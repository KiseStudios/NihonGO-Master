const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { mkdir, writeFile } = require("node:fs/promises");
const path = require("node:path");

const baseUrl = (process.env.TEST_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const output = process.env.SCROLL_HERO_SCREENSHOTS || "/tmp/kise-scroll-video-validation";
const mode = process.argv[2] || "all";
const heroSelector = ".scroll-hero";
const videoRoute = "**/telainicial/videocapainicial*.mp4";
const posterSource = "telainicial/video-poster.webp";
const chapters = [0.075, 0.26, 0.45, 0.63, 0.81, 0.96];
const timeTolerance = 0.035;

// Instrument the native media API. A temporary test canvas reads the decoded
// video only for verification; production must keep its native <video> layer.
// The sampler uses the original RAF so it never inflates engine RAF counters.
async function instrument(page, { delaySeeked = 0 } = {}) {
  await page.addInitScript(({ delaySeeked }) => {
    const nativeRAF = window.requestAnimationFrame.bind(window);
    const nativeCancel = window.cancelAnimationFrame.bind(window);
    const timeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "currentTime");
    const nativePlay = HTMLMediaElement.prototype.play;
    const nativeAdd = EventTarget.prototype.addEventListener;
    let insideRAF = 0;
    const checks = window.__videoChecks = {
      seeks: [], seeked: [], presentations: [], playCalls: 0,
      rafCalls: 0, rafCallbacks: 0, rafCosts: [], sampling: false,
      samples: [], metadataAt: null, pending: null,
    };
    window.requestAnimationFrame = (callback) => {
      checks.rafCalls++;
      return nativeRAF((at) => {
        const started = performance.now();
        checks.rafCallbacks++;
        insideRAF++;
        try { callback(at); } finally {
          insideRAF--;
          if (checks.sampling) checks.rafCosts.push(performance.now() - started);
        }
      });
    };
    Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
      ...timeDescriptor,
      set(value) {
        if (this.id === "heroScrollVideo") {
          const hero = document.querySelector(".scroll-hero");
          const rect = hero.getBoundingClientRect();
          const record = {
            at: performance.now(), requested: Number(value), previous: timeDescriptor.get.call(this),
            duration: this.duration, readyState: this.readyState,
            insideRAF: insideRAF > 0, wasSeeking: this.seeking,
            pendingSeek: checks.pending !== null, hidden: document.hidden,
            active: document.querySelector("#screen-home").classList.contains("active"),
            visible: rect.bottom > 0 && rect.top < innerHeight,
          };
          checks.seeks.push(record);
          checks.pending = record;
        }
        return timeDescriptor.set.call(this, value);
      },
    });
    HTMLMediaElement.prototype.play = function (...args) {
      if (this.id === "heroScrollVideo") checks.playCalls++;
      return nativePlay.apply(this, args);
    };
    if (delaySeeked) {
      EventTarget.prototype.addEventListener = function (name, listener, options) {
        if (this.id === "heroScrollVideo" && name === "seeked") {
          return nativeAdd.call(this, name, function (event) {
            setTimeout(() => {
              if (typeof listener === "function") listener.call(this, event);
              else listener.handleEvent(event);
            }, delaySeeked);
          }, options);
        }
        return nativeAdd.call(this, name, listener, options);
      };
    }
    nativeAdd.call(document, "loadedmetadata", (event) => {
      if (event.target.id === "heroScrollVideo") checks.metadataAt = performance.now();
    }, true);
    nativeAdd.call(document, "seeked", (event) => {
      if (event.target.id !== "heroScrollVideo") return;
      checks.seeked.push({
        at: performance.now(), time: event.target.currentTime,
        latency: checks.pending ? performance.now() - checks.pending.at : null,
      });
      checks.pending = null;
    }, true);
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 36;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    checks.pixels = () => {
      const video = document.querySelector("#heroScrollVideo");
      if (!video || video.readyState < 2) return null;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let hash = 2166136261;
      let opaque = 0;
      let minimum = 255;
      let maximum = 0;
      for (let index = 0; index < pixels.length; index++) {
        hash = Math.imul(hash ^ pixels[index], 16777619);
        if (index % 4 === 3) opaque += pixels[index] === 255;
        else { minimum = Math.min(minimum, pixels[index]); maximum = Math.max(maximum, pixels[index]); }
      }
      return { hash: hash >>> 0, opaque, range: maximum - minimum };
    };
    checks.start = () => {
      checks.samples = [];
      checks.rafCosts = [];
      checks.sampling = true;
      const video = document.querySelector("#heroScrollVideo");
      let frameToken = null;
      if (video.requestVideoFrameCallback) {
        const presented = (at, metadata) => {
          checks.presentations.push({ at, mediaTime: metadata.mediaTime, presentedFrames: metadata.presentedFrames });
          if (checks.sampling) frameToken = video.requestVideoFrameCallback(presented);
        };
        frameToken = video.requestVideoFrameCallback(presented);
      }
      let token;
      const sample = (at) => {
        if (!checks.sampling) return;
        const hero = document.querySelector(".scroll-hero");
        checks.samples.push({
          at, scroll: scrollY, progress: Number(hero.dataset.progress),
          targetTime: Number(hero.dataset.targetTime), currentTime: video.currentTime,
          presentedTime: checks.presentations.at(-1)?.mediaTime ?? null,
          seeking: video.seeking, pixels: checks.pixels(),
        });
        token = nativeRAF(sample);
      };
      token = nativeRAF(sample);
      checks.stop = () => {
        checks.sampling = false;
        nativeCancel(token);
        if (frameToken !== null) video.cancelVideoFrameCallback(frameToken);
        return checks.samples;
      };
    };
    // This is explicitly a simulated visibility state; Playwright keeps its
    // active page foregrounded. The controller receives the browser event.
    window.__simulatedHidden = false;
    Object.defineProperty(document, "hidden", { configurable: true, get: () => window.__simulatedHidden });
    window.__setSimulatedHidden = (hidden) => {
      window.__simulatedHidden = hidden;
      document.dispatchEvent(new Event("visibilitychange"));
    };
  }, { delaySeeked });
}

function monitor(page, { expectedMediaFailure = false, expectedHelperFailure = false } = {}) {
  const errors = [];
  const httpErrors = [];
  const frameRequests = [];
  page.on("pageerror", (error) => {
    if (expectedHelperFailure && error.message === "Simulated helper failure") return;
    errors.push(error.message);
  });
  page.on("response", (response) => {
    if (response.status() < 400 || !response.url().startsWith(baseUrl)) return;
    if (expectedMediaFailure && /\/telainicial\/videocapainicial(?:-scrub)?\.mp4/.test(response.url())) return;
    httpErrors.push(`${response.status()} ${response.url()}`);
  });
  page.on("request", (request) => {
    if (/\/telainicial\/(?:optimized\/\d+\/)?frame_\d+\.(?:webp|png)/.test(request.url())) frameRequests.push(request.url());
  });
  return () => {
    assert.deepEqual(errors, [], "No application JavaScript errors");
    assert.deepEqual(httpErrors, [], "No missing local assets");
    assert.deepEqual(frameRequests, [], "The hero never fetches the old frame sequence");
  };
}

async function createPage(browser, contextOptions = {}, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, ...contextOptions });
  const page = await context.newPage();
  const check = monitor(page, options);
  await instrument(page, options);
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  if (process.env.VIDEO_SOURCE_OVERRIDE) {
    assert.match(process.env.VIDEO_SOURCE_OVERRIDE, /^telainicial\/videocapainicial(?:-scrub)?\.mp4$/);
    await page.route((url) => url.origin === new URL(baseUrl).origin && ["/", "/index.html"].includes(url.pathname), async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(/(<source\s+src=")telainicial\/videocapainicial(?:-scrub)?\.mp4("[^>]*type="video\/mp4")/,
        `$1${process.env.VIDEO_SOURCE_OVERRIDE}$2`);
      await route.fulfill({ response, body: html });
    });
  }
  return { context, page, check };
}

async function ready(page, { media = true } = {}) {
  await page.goto(`${baseUrl}/?heroDebug=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => {
    const hero = document.querySelector(".scroll-hero");
    const poster = hero?.querySelector(".hero-sequence-poster");
    return hero?.classList.contains("is-enhanced") && hero.dataset.engine === "scroll-video-v1" &&
      Number.isFinite(Number(hero.dataset.progress)) && poster?.complete && poster.naturalWidth > 0;
  }, null, { timeout: 20000, polling: 50 });
  if (media) await mediaReady(page);
  assert.equal(await page.locator(".hero-story-stage").count(), 6, "Six narrative chapters remain in semantic HTML");
  assert.equal(await page.locator(".scroll-hero canvas").count(), 0, "Production hero uses native video rather than canvas");
  const configuration = await page.locator("#heroScrollVideo").evaluate((video) => ({
    source: video.querySelector("source")?.getAttribute("src") || video.getAttribute("src"),
    muted: video.muted, inline: video.playsInline, preload: video.preload,
    autoplay: video.autoplay, loop: video.loop, controls: video.controls,
    pictureInPicture: video.disablePictureInPicture,
    paused: video.paused, decorative: video.getAttribute("aria-hidden"),
    fit: getComputedStyle(video).objectFit, position: getComputedStyle(video).position,
    transform: getComputedStyle(video).transform,
  }));
  assert.match(configuration.source, /^telainicial\/videocapainicial(?:-scrub)?\.mp4$/,
    "The native player uses the supplied MP4 or its optional optimized copy");
  if (process.env.VIDEO_SOURCE_OVERRIDE) assert.equal(configuration.source, process.env.VIDEO_SOURCE_OVERRIDE,
    "The comparison fixture selects the requested MP4 without editing the application");
  assert.equal(configuration.muted, true);
  assert.equal(configuration.inline, true);
  assert.equal(configuration.preload, await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches) ? "none" : "auto");
  assert.equal(configuration.autoplay, false);
  assert.equal(configuration.loop, false);
  assert.equal(configuration.controls, false);
  assert.equal(configuration.pictureInPicture, true);
  assert.equal(configuration.paused, true);
  assert.equal(configuration.decorative, "true");
  assert.equal(configuration.fit, "cover");
  assert.equal(configuration.position, "absolute");
  assert.equal(configuration.transform, "none", "The native media remains stable without pointer transforms");
  if (media) {
    await page.waitForFunction(() => {
      const video = document.querySelector("#heroScrollVideo");
      return document.querySelector(".scroll-hero").classList.contains("has-video-frame") && getComputedStyle(video).opacity === "1";
    }, null, { timeout: 5000, polling: 50 });
  }
  assert.equal(await page.locator(".hero-sequence-poster").getAttribute("src"), posterSource);
  assert.equal(await page.locator(".scroll-hero-sticky").evaluate((el) => getComputedStyle(el).position), "sticky");
}

async function mediaReady(page) {
  await page.waitForFunction(() => {
    const video = document.querySelector("#heroScrollVideo");
    return video && Number.isFinite(video.duration) && video.duration > 0 && video.readyState >= 2 && !video.seeking;
  }, null, { timeout: 20000, polling: 50 });
}

async function state(page) {
  return page.locator(heroSelector).evaluate((hero) => {
    const video = hero.querySelector("video");
    const rect = hero.getBoundingClientRect();
    const sticky = hero.querySelector(".scroll-hero-sticky").getBoundingClientRect();
    const media = video.getBoundingClientRect();
    return {
      progress: Number(hero.dataset.progress), targetTime: Number(hero.dataset.targetTime),
      currentTime: video.currentTime, duration: video.duration, readyState: video.readyState,
      source: video.currentSrc,
      paused: video.paused, seeking: video.seeking,
      heroHeight: rect.height, stickyHeight: sticky.height, stickyTop: sticky.top,
      mediaWidth: media.width, mediaHeight: media.height,
      videoWidth: video.videoWidth, videoHeight: video.videoHeight,
      viewportWidth: innerWidth, viewportHeight: innerHeight,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth, dpr: devicePixelRatio,
      fallback: hero.classList.contains("is-media-fallback"),
    };
  });
}

async function settled(page, { media = true } = {}) {
  await page.evaluate(() => {
    window.__settle = { scroll: scrollY, progress: document.querySelector(".scroll-hero").dataset.progress, at: performance.now() };
  });
  await page.waitForFunction(({ media, tolerance }) => {
    const hero = document.querySelector(".scroll-hero");
    const video = document.querySelector("#heroScrollVideo");
    const last = window.__settle;
    if (last.scroll !== scrollY || last.progress !== hero.dataset.progress) {
      last.scroll = scrollY;
      last.progress = hero.dataset.progress;
      last.at = performance.now();
    }
    const expected = Math.min(Math.max(0, video.duration - .01), Number(hero.dataset.progress) * video.duration);
    return performance.now() - last.at >= 180 && (!media ||
      (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - expected) <= tolerance));
  }, { media, tolerance: timeTolerance }, { timeout: 20000, polling: 50 });
  // Native presentation can follow seeked. Do not mistake the synchronous
  // currentTime getter (requested time) for evidence of decoded pixels.
  await page.waitForTimeout(80);
}

async function jump(page, progress, options = {}) {
  const align = () => page.locator(heroSelector).evaluate((hero, value) => {
    const rect = hero.getBoundingClientRect();
    const sticky = hero.querySelector(".scroll-hero-sticky").getBoundingClientRect();
    scrollTo({ top: scrollY + rect.top + (rect.height - sticky.height) * value, behavior: "instant" });
  }, progress);
  await align();
  // Navbar height changes after first scroll. Align again once its transition
  // settles; the controller must also recalculate after real viewport resize.
  await page.waitForTimeout(380);
  await align();
  await settled(page, options);
  const result = await state(page);
  assert.ok(Math.abs(result.progress - progress) < .015, `Normalized progress reaches ${progress}`);
  assert.equal(result.scrollWidth, result.clientWidth, "Content fits the usable viewport without horizontal overflow");
  assert.ok(Math.abs(result.stickyTop) < 2, "The storytelling remains pinned at the viewport top");
  if (options.media !== false) assert.ok(Math.abs(result.targetTime - Math.min(result.duration - .01, progress * result.duration)) < .08,
    "The debug target represents the scroll-selected video time");
  return result;
}

async function chapter(page, index) {
  const stages = await page.locator(".hero-story-stage").evaluateAll((elements) => elements.map((element) => ({
    current: element.classList.contains("is-current"), inert: element.inert,
    hidden: element.getAttribute("aria-hidden"), opacity: Number(getComputedStyle(element).opacity),
  })));
  assert.ok(stages[index].current && !stages[index].inert && stages[index].hidden !== "true", `Chapter ${index + 1} is accessible`);
  assert.ok(stages[index].opacity > .8, `Chapter ${index + 1} is readable at its midpoint`);
  stages.forEach((stage, position) => {
    if (position !== index) assert.ok(stage.inert && stage.hidden === "true", "Inactive links are removed from keyboard navigation");
  });
}

async function pixels(page) {
  const result = await page.evaluate(() => window.__videoChecks.pixels());
  assert.ok(result, "Native video has decoded pixels");
  assert.equal(result.opaque, 64 * 36, "Every sampled pixel is covered, without blank gaps");
  assert.ok(result.range > 10, "The rendered frame contains an image rather than a blank flash");
  return result;
}

async function verifyScheduling(page) {
  const checks = await page.evaluate(() => ({
    seeks: window.__videoChecks.seeks,
    playCalls: window.__videoChecks.playCalls,
  }));
  assert.equal(checks.playCalls, 0, "Scroll scrubbing never calls video.play()");
  checks.seeks.forEach((seek) => {
    assert.ok(seek.readyState >= 1 && Number.isFinite(seek.duration) && seek.duration > 0, "Seeks wait for metadata");
    assert.ok(seek.insideRAF, "currentTime writes happen in RAF rather than the scroll listener");
    assert.equal(seek.wasSeeking, false, "At most one native seek is in flight");
    assert.equal(seek.pendingSeek, false, "A pending seek completes before another request is issued");
    assert.ok(seek.requested >= 0 && seek.requested <= seek.duration - .009, "The requested time stays within safe endpoints");
    assert.equal(seek.hidden, false, "Hidden documents do not issue seeks");
    assert.equal(seek.active, true, "Inactive home screens do not issue seeks");
    assert.equal(seek.visible, true, "Offscreen heroes do not issue seeks");
  });
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(output, `${name}.png`) });
}

async function core(browser) {
  for (const mobile of [false, true]) {
    const { context, page, check } = await createPage(browser, mobile
      ? { viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : {});
    try {
      await ready(page);
      const initial = await jump(page, 0);
      assert.ok(initial.videoWidth > 0 && initial.videoHeight > 0, "The real MP4 metadata is available");
      assert.ok(initial.heroHeight > initial.stickyHeight * 2, "The outer hero provides a narrative scroll journey");
      if (mobile) assert.ok(initial.heroHeight < initial.stickyHeight * 4.5, "Mobile uses a shorter storytelling journey");
      const firstPixels = await pixels(page);
      assert.ok(initial.currentTime < .015, "The video opens at its first frame");
      await screenshot(page, mobile ? "mobile-intro" : "desktop-intro");
      let previous = -1;
      const hashes = new Set([firstPixels.hash]);
      for (const [index, progress] of chapters.entries()) {
        const result = await jump(page, progress);
        assert.ok(result.currentTime > previous, "Forward scroll advances native video time");
        previous = result.currentTime;
        await chapter(page, index);
        hashes.add((await pixels(page)).hash);
        await screenshot(page, `${mobile ? "mobile" : "desktop"}-chapter-${index + 1}`);
      }
      assert.ok(hashes.size > 4, "Rendered video pixels change across the actual narrative timeline");
      const end = await jump(page, 1);
      assert.ok(Math.abs(end.currentTime - (end.duration - .01)) < .015, "The endpoint selects duration minus 10ms");
      const lastPixels = await pixels(page);
      assert.notEqual(lastPixels.hash, firstPixels.hash, "The final visible video frame differs from its opening");
      await page.waitForTimeout(400);
      assert.deepEqual(await pixels(page), lastPixels, "The final paused video frame remains stable");
      await screenshot(page, mobile ? "mobile-final" : "desktop-final");
      for (let index = chapters.length - 1; index >= 0; index--) {
        const result = await jump(page, chapters[index]);
        assert.ok(result.currentTime < previous || index === 5, "Reverse scroll goes backwards through video time");
        previous = result.currentTime;
        await chapter(page, index);
      }
      await jump(page, 0);
      assert.deepEqual(await pixels(page), firstPixels, "Reverse scrolling restores the actual opening pixels");
      if (!mobile) {
        await page.setViewportSize({ width: 1920, height: 1080 });
        const resized = await jump(page, .45);
        assert.equal(resized.mediaWidth, 1920);
        assert.ok(Math.abs(resized.mediaHeight - 1080) < 2);
        await pixels(page);
        await screenshot(page, "desktop-1920-midpoint");
      }
      await jump(page, .96);
      await page.locator('.hero-story-final [data-screen="hiragana"]').click();
      assert.equal(await page.evaluate(() => app.currentScreen), "hiragana", "Final CTA preserves the study navigation");
      await page.locator(".ed-brand").click();
      await jump(page, .96);
      await page.locator('.hero-story-final a[href="#journey"]').click();
      await page.waitForFunction(() => Math.abs(document.querySelector("#journey").getBoundingClientRect().top - 90) < 18,
        null, { timeout: 15000, polling: 50 });
      assert.equal(await page.evaluate(() => app.currentScreen), "home");
      assert.ok(await page.locator(".scroll-hero-sticky").evaluate((el) => el.getBoundingClientRect().top < -100), "Sticky releases at the following section");
      await verifyScheduling(page);
      check();
      console.log(`PASS native video storytelling: ${mobile ? "mobile DPR2" : "desktop and resize"}; duration=${initial.duration}s; pixels=${hashes.size}`);
    } finally { await context.close(); }
  }
}

async function exerciseInput(page, label, direction, action) {
  await page.evaluate(() => window.__videoChecks.start());
  await action();
  await settled(page);
  const samples = await page.evaluate(() => window.__videoChecks.stop());
  assert.ok(samples.length > 1, `${label}: native frames were sampled during input`);
  assert.ok(direction * (samples.at(-1).currentTime - samples[0].currentTime) > 0, `${label}: time follows the input direction`);
  for (let index = 1; index < samples.length; index++) {
    assert.ok(direction * (samples[index].currentTime - samples[index - 1].currentTime) >= -.001,
      `${label}: video time never reverses against a consistent input direction`);
  }
  const observed = samples.map((sample) => sample.pixels).filter(Boolean);
  assert.ok(new Set(observed.map((value) => value.hash)).size > 1, `${label}: decoded pixels really change`);
  assert.ok(observed.every((value) => value.opaque === 64 * 36 && value.range > 10), `${label}: frames do not go blank`);
  return { input: label, samples: samples.length, pixelStates: new Set(observed.map((value) => value.hash)).size };
}

async function idleSnapshot(page) {
  return page.evaluate(() => ({
    seeks: window.__videoChecks.seeks.length, callbacks: window.__videoChecks.rafCallbacks,
    engineRAF: document.querySelector(".scroll-hero").dataset.rafCount ?? null,
    time: document.querySelector("#heroScrollVideo").currentTime,
  }));
}

async function pausedLifecycle(page, label) {
  // A finite pointer interpolation or last native decode may still be winding
  // down after input ends. Require a stable interval, then prove it stays idle;
  // a continuous RAF cannot satisfy this gate within its bounded timeout.
  await page.evaluate(() => {
    window.__idleGate = { callbacks: window.__videoChecks.rafCallbacks, seeks: window.__videoChecks.seeks.length, at: performance.now() };
  });
  await page.waitForFunction(() => {
    const gate = window.__idleGate;
    const checks = window.__videoChecks;
    if (gate.callbacks !== checks.rafCallbacks || gate.seeks !== checks.seeks.length) {
      gate.callbacks = checks.rafCallbacks;
      gate.seeks = checks.seeks.length;
      gate.at = performance.now();
    }
    return performance.now() - gate.at >= 280;
  }, null, { timeout: 5000, polling: 50 });
  const before = await idleSnapshot(page);
  await page.waitForTimeout(450);
  const after = await idleSnapshot(page);
  assert.equal(after.seeks, before.seeks, `${label}: no new seeks`);
  assert.equal(after.time, before.time, `${label}: native video stays paused`);
  if (before.engineRAF !== null) assert.equal(after.engineRAF, before.engineRAF, `${label}: the controller has no continuous RAF`);
  else assert.equal(after.callbacks, before.callbacks, `${label}: no continuous RAF callbacks`);
}

async function input(browser) {
  const { context, page, check } = await createPage(browser);
  try {
    await ready(page);
    await page.mouse.move(650, 400);
    await jump(page, .08);
    const results = [];
    results.push(await exerciseInput(page, "slow wheel", 1, async () => {
      for (let index = 0; index < 6; index++) { await page.mouse.wheel(0, 70); await page.waitForTimeout(85); }
    }));
    results.push(await exerciseInput(page, "fast wheel", 1, async () => {
      for (let index = 0; index < 3; index++) { await page.mouse.wheel(0, 220); await page.waitForTimeout(20); }
    }));
    results.push(await exerciseInput(page, "fine simulated trackpad", -1, async () => {
      for (let index = 0; index < 24; index++) { await page.mouse.wheel(0, -9); await page.waitForTimeout(12); }
    }));
    await jump(page, .2);
    await page.evaluate(() => document.activeElement?.blur());
    results.push(await exerciseInput(page, "PageDown", 1, () => page.keyboard.press("PageDown")));
    await jump(page, .75);
    results.push(await exerciseInput(page, "reverse wheel", -1, async () => {
      for (let index = 0; index < 3; index++) { await page.mouse.wheel(0, -240); await page.waitForTimeout(16); }
    }));
    const cdp = await context.newCDPSession(page);
    for (const progress of [.94, .05, .9, .12]) {
      const target = await page.locator(heroSelector).evaluate((hero, progress) => ({
        x: 0, y: scrollY + hero.getBoundingClientRect().top +
          (hero.getBoundingClientRect().height - hero.querySelector(".scroll-hero-sticky").offsetHeight) * progress,
      }), progress);
      await cdp.send("Input.synthesizeScrollGesture", { x: 900, y: 400, yDistance: scrollYValue(target.y, await page.evaluate(() => scrollY)),
        speed: 60000, gestureSourceType: "mouse" });
      await settled(page);
      assert.ok(Math.abs((await state(page)).progress - progress) < .02, "Browser scrollbar-style jumps retain the last target");
    }
    await cdp.detach();
    await page.mouse.wheel(0, 480);
    await page.mouse.wheel(0, -620);
    await settled(page);
    const reversedPixels = await pixels(page);
    const reversedTime = (await state(page)).currentTime;
    await page.waitForTimeout(350);
    assert.equal((await state(page)).currentTime, reversedTime, "A late forward seek cannot replace the final reverse target");
    assert.deepEqual(await pixels(page), reversedPixels);
    await page.mouse.move(0, 0);
    await pausedLifecycle(page, "idle within the hero");

    await jump(page, .4);
    await page.evaluate(() => window.__setSimulatedHidden(true));
    await page.mouse.wheel(0, 260);
    await pausedLifecycle(page, "simulated hidden document");
    await page.evaluate(() => window.__setSimulatedHidden(false));
    await settled(page);
    await jump(page, .075);
    await page.locator('.hero-story-intro [data-screen="hiragana"]').click();
    await pausedLifecycle(page, "inactive home screen");
    await page.locator(".ed-brand").click();
    await jump(page, .35);
    await page.locator(heroSelector).evaluate((hero) => {
      scrollTo({ top: scrollY + hero.getBoundingClientRect().bottom + innerHeight, behavior: "instant" });
    });
    await pausedLifecycle(page, "offscreen hero");
    await jump(page, .63);
    await chapter(page, 3);
    await verifyScheduling(page);
    check();
    console.log("PASS desktop inputs and lifecycle", results);
  } finally { await context.close(); }

  const mobile = await createPage(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  try {
    await ready(mobile.page);
    await jump(mobile.page, .1);
    const cdp = await mobile.context.newCDPSession(mobile.page);
    const result = await exerciseInput(mobile.page, "native touch swipe", 1, async () => {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: 690 }] });
      for (let y = 670; y >= 260; y -= 35) {
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y }] });
        await mobile.page.waitForTimeout(18);
      }
      // Release after the finger rests so this measures a swipe rather than an
      // uncontrolled fling that can leave the entire hero before media settles.
      await mobile.page.waitForTimeout(180);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    });
    await cdp.detach();
    await jump(mobile.page, .45);
    const before = await mobile.page.locator(".hero-story-content").evaluateAll((elements) => elements.map((el) => getComputedStyle(el).transform));
    await mobile.page.locator(".scroll-hero-sticky").dispatchEvent("pointermove", { pointerType: "mouse", clientX: 350, clientY: 350 });
    await mobile.page.waitForTimeout(180);
    assert.deepEqual(await mobile.page.locator(".hero-story-content").evaluateAll((elements) => elements.map((el) => getComputedStyle(el).transform)), before,
      "Mobile ignores mouse pointer effects");
    await verifyScheduling(mobile.page);
    mobile.check();
    console.log("PASS mobile input", result);
  } finally { await mobile.context.close(); }
  await scrollbarInput();
}

function scrollYValue(target, current) { return current - target; }

function browserLaunchOptions({ scrollbars = false } = {}) {
  const options = { headless: true };
  if (process.env.TEST_BROWSER_EXECUTABLE_PATH) options.executablePath = process.env.TEST_BROWSER_EXECUTABLE_PATH;
  else if (process.env.TEST_BROWSER_CHANNEL) options.channel = process.env.TEST_BROWSER_CHANNEL;
  if (scrollbars) options.ignoreDefaultArgs = ["--hide-scrollbars"];
  return options;
}

async function scrollbarInput() {
  const browser = await chromium.launch(browserLaunchOptions({ scrollbars: true }));
  const { context, page, check } = await createPage(browser);
  try {
    await ready(page);
    await jump(page, 0);
    const first = await pixels(page);
    // Compact the sticky navbar before grabbing the thumb. Its height
    // transition changes document geometry and can re-anchor a native drag.
    await jump(page, .05);
    const track = await page.evaluate(() => {
      const root = document.scrollingElement;
      const hero = document.querySelector(".scroll-hero");
      const rect = hero.getBoundingClientRect();
      const height = document.documentElement.clientHeight;
      const width = innerWidth - document.documentElement.clientWidth;
      // Native Linux Chromium has a square arrow button at each end. Thumb
      // height follows the viewport/document ratio over the remaining track.
      const button = width + 1;
      const trackHeight = height - 2 * button;
      const thumb = Math.max(20, trackHeight * height / root.scrollHeight);
      const target = rect.top + scrollY +
        (rect.height - hero.querySelector(".scroll-hero-sticky").offsetHeight) * .35;
      return {
        width, x: innerWidth - width / 2,
        startY: button + thumb / 2 + (trackHeight - thumb) * root.scrollTop / (root.scrollHeight - height),
        endY: button + thumb / 2 + (trackHeight - thumb) * target / (root.scrollHeight - height),
      };
    });
    assert.ok(track.width > 0, "A separate browser shows the native scrollbar for the drag exercise");
    const forward = await exerciseInput(page, "native scrollbar thumb drag", 1, async () => {
      await page.mouse.move(track.x, track.startY);
      await page.mouse.down();
      await page.mouse.move(track.x, track.endY, { steps: 12 });
      await page.mouse.up();
    });
    const selected = await state(page);
    assert.ok(selected.progress > .25 && selected.progress < .45,
      `Dragging the native thumb reaches the intended hero region: ${JSON.stringify({ track, selectedProgress: selected.progress })}`);
    const reverse = await exerciseInput(page, "native scrollbar reverse drag", -1, async () => {
      await page.mouse.move(track.x, track.endY);
      await page.mouse.down();
      await page.mouse.move(track.x, track.startY, { steps: 12 });
      await page.mouse.up();
    });
    assert.ok(Math.abs((await state(page)).progress - .05) < .02, "Dragging the native thumb upwards returns to its opening position");
    await jump(page, 0);
    assert.deepEqual(await pixels(page), first, "The opening pixels return after a real scrollbar drag");
    await verifyScheduling(page);
    check();
    console.log("PASS native scrollbar thumb drag", { width: track.width, selectedProgress: selected.progress, forward, reverse });
  } finally { await context.close(); await browser.close(); }
}

async function recovery(browser) {
  const delayed = await createPage(browser);
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  await delayed.page.route(videoRoute, async (route) => { await gate; await route.continue(); });
  try {
    await ready(delayed.page, { media: false });
    await jump(delayed.page, .63, { media: false });
    await chapter(delayed.page, 3);
    assert.equal(await delayed.page.evaluate(() => window.__videoChecks.seeks.length), 0, "Delayed metadata never causes a premature seek");
    assert.equal(await delayed.page.locator(".hero-sequence-poster").evaluate((poster) => getComputedStyle(poster).opacity), "1",
      "The available poster covers delayed native media");
    assert.equal(await delayed.page.locator("#heroScrollVideo").evaluate((video) => getComputedStyle(video).opacity), "0");
    await screenshot(delayed.page, "delayed-metadata-poster");
    release();
    await mediaReady(delayed.page);
    await settled(delayed.page);
    await pixels(delayed.page);
    await verifyScheduling(delayed.page);
    delayed.check();
    console.log("PASS delayed metadata: poster and narration stay available; media catches current scroll after loading");
  } finally { release(); await delayed.context.close(); }

  const queued = await createPage(browser, {}, { delaySeeked: 100 });
  try {
    await ready(queued.page);
    await jump(queued.page, .1);
    const before = await queued.page.evaluate(() => window.__videoChecks.seeks.length);
    await queued.page.evaluate(() => {
      const hero = document.querySelector(".scroll-hero");
      const origin = scrollY + hero.getBoundingClientRect().top;
      const travel = hero.offsetHeight - hero.querySelector(".scroll-hero-sticky").offsetHeight;
      const values = [.7, .2, .9, .35, .84];
      values.forEach((progress, index) => setTimeout(() => scrollTo({ top: origin + travel * progress, behavior: "instant" }), index * 18));
    });
    await queued.page.waitForTimeout(220);
    await settled(queued.page);
    const stateAfter = await state(queued.page);
    assert.ok(Math.abs(stateAfter.progress - .84) < .015, "The last queued scroll intention wins");
    const seeks = await queued.page.evaluate(() => window.__videoChecks.seeks.slice(-1));
    assert.ok(Math.abs(seeks[0].requested - stateAfter.targetTime) < timeTolerance, "Completion flushes the latest requested time");
    const count = await queued.page.evaluate(() => window.__videoChecks.seeks.length);
    assert.ok(count - before < 5, "Multiple scroll intentions coalesce while seek completion is delayed");
    await verifyScheduling(queued.page);
    queued.check();
    console.log("PASS delayed seek completion: one native seek and latest-target coalescing");
  } finally { await queued.context.close(); }

  for (const mobile of [false, true]) {
    const reduced = await createPage(browser, {
      reducedMotion: "reduce", ...(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {}),
    });
    try {
      await ready(reduced.page, { media: false });
      const before = await reduced.page.locator(".hero-story-content").evaluateAll((elements) => elements.map((el) => getComputedStyle(el).transform));
      await reduced.page.mouse.move(950, 400);
      await reduced.page.locator(".scroll-hero-sticky").dispatchEvent("pointermove", { pointerType: "mouse", clientX: 900, clientY: 400 });
      await reduced.page.waitForTimeout(150);
      assert.deepEqual(await reduced.page.locator(".hero-story-content").evaluateAll((elements) => elements.map((el) => getComputedStyle(el).transform)), before,
        "Reduced motion disables pointer parallax");
      for (const [index, progress] of chapters.entries()) {
        await jump(reduced.page, progress, { media: false });
        await chapter(reduced.page, index);
      }
      assert.equal(await reduced.page.evaluate(() => window.__videoChecks.seeks.length), 0, "Reduced motion never scroll-seeks native video");
      assert.equal(await reduced.page.locator(".hero-sequence-poster").evaluate((poster) => getComputedStyle(poster).opacity), "1",
        "Reduced motion keeps the static poster visible throughout the narrative");
      assert.equal(await reduced.page.locator("#heroScrollVideo").evaluate((video) => getComputedStyle(video).opacity), "0",
        "The static poster is not covered by the native media layer");
      assert.equal(await reduced.page.evaluate(() => window.__videoChecks.playCalls), 0);
      await screenshot(reduced.page, `reduced-${mobile ? "mobile" : "desktop"}-final`);
      reduced.check();
      console.log(`PASS reduced motion ${mobile ? "mobile" : "desktop"}: static media with all six scroll chapters`);
    } finally { await reduced.context.close(); }
  }

  const failed = await createPage(browser, {}, { expectedMediaFailure: true });
  await failed.page.route(videoRoute, (route) => route.fulfill({ status: 503, body: "Simulated media failure" }));
  // Force the source to fail before the controller initializes. Native
  // <source> errors can arrive during parsing and leave video.error null;
  // NETWORK_NO_SOURCE must still yield a visible, usable media fallback.
  await failed.page.route("**/js/scroll-hero.js*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250));
    await route.continue();
  });
  try {
    await ready(failed.page, { media: false });
    await failed.page.waitForFunction(() => document.querySelector(".scroll-hero").classList.contains("is-media-fallback"),
      null, { timeout: 15000, polling: 50 });
    for (const [index, progress] of chapters.entries()) {
      await jump(failed.page, progress, { media: false });
      await chapter(failed.page, index);
    }
    assert.equal(await failed.page.locator(".hero-sequence-poster").evaluate((poster) => getComputedStyle(poster).opacity), "1");
    assert.equal(await failed.page.locator("#heroScrollVideo").evaluate((video) => getComputedStyle(video).opacity), "0");
    assert.equal(await failed.page.evaluate(() => window.__videoChecks.seeks.length), 0);
    await screenshot(failed.page, "media-failure-final");
    await failed.page.locator('.hero-story-final [data-screen="hiragana"]').click();
    assert.equal(await failed.page.evaluate(() => app.currentScreen), "hiragana", "Unavailable media preserves the final navigation");
    failed.check();
    console.log("PASS media failure: static poster, six chapters and working navigation");
  } finally { await failed.context.close(); }

  const unsupported = await createPage(browser);
  await unsupported.page.route(videoRoute, (route) => route.fulfill({
    status: 200, contentType: "video/mp4",
    path: path.resolve(__dirname, "../Site japones estudo/telainicial/videocapainicial.mp4"),
    headers: { "Cache-Control": "no-store" },
  }));
  try {
    // A genuine HTTP 200 response ignores native byte-range requests. Use the
    // original MP4 with its late moov index; do not fake the seekable property.
    await ready(unsupported.page, { media: false });
    await unsupported.page.waitForFunction(() => document.querySelector("#heroScrollVideo").readyState === 4,
      null, { timeout: 20000, polling: 50 });
    const nativeRange = await unsupported.page.locator("#heroScrollVideo").evaluate((video) => ({
      duration: video.duration,
      seekableEnd: video.seekable.length ? video.seekable.end(video.seekable.length - 1) : 0,
      bufferedEnd: video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0,
    }));
    if (nativeRange.seekableEnd === 0) {
      await unsupported.page.waitForFunction(() => document.querySelector(".scroll-hero").classList.contains("is-media-fallback"),
        null, { timeout: 5000, polling: 50 });
      for (const [index, progress] of chapters.entries()) {
        await jump(unsupported.page, progress, { media: false });
        await chapter(unsupported.page, index);
      }
      assert.equal(await unsupported.page.locator("#heroScrollVideo").evaluate((video) => getComputedStyle(video).opacity), "0");
      assert.equal(await unsupported.page.locator(heroSelector).getAttribute("data-media-failure"), "unseekable");
      assert.equal(await unsupported.page.evaluate(() => window.__videoChecks.seeks.length), 0,
        "A downloaded but unnavigable timeline never enters a repeated seek loop");
      await pausedLifecycle(unsupported.page, "unseekable-media fallback");
      await screenshot(unsupported.page, "unseekable-media-final");
      console.log("PASS native non-range media: poster and narrative survive an unseekable timeline", nativeRange);
    } else {
      // Some browser versions can seek fully buffered files without HTTP Range.
      // Accept the observed native capability and verify it actually renders.
      const first = await pixels(unsupported.page);
      await jump(unsupported.page, .63);
      assert.notEqual((await pixels(unsupported.page)).hash, first.hash);
      await verifyScheduling(unsupported.page);
      console.log("PASS native non-range media: browser supports seeking a fully buffered file", nativeRange);
    }
    unsupported.check();
  } finally { await unsupported.context.close(); }

  const independent = await createPage(browser, {}, { expectedHelperFailure: true });
  await independent.page.route("**/js/home.js*", (route) => route.fulfill({
    contentType: "application/javascript", body: 'throw new Error("Simulated helper failure");',
  }));
  try {
    await ready(independent.page);
    const first = await pixels(independent.page);
    await jump(independent.page, .63);
    await chapter(independent.page, 3);
    assert.notEqual((await pixels(independent.page)).hash, first.hash, "Independent media startup updates real pixels without home.js");
    await verifyScheduling(independent.page);
    independent.check();
    console.log("PASS media controller starts independently of a failing home.js");
  } finally { await independent.context.close(); }
}

const percentile = (values, fraction) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * fraction))];
};

async function benchmark(browser) {
  const label = process.env.HERO_RUN || "after";
  const directory = `/tmp/kise-video-performance/${label}`;
  await mkdir(directory, { recursive: true });
  const results = [];
  for (const viewport of [{ width: 1366, height: 768 }, { width: 1920, height: 1080 }]) {
    const { context, page, check } = await createPage(browser, { viewport });
    try {
      await ready(page);
      await jump(page, .08);
      await page.mouse.move(viewport.width / 2, viewport.height / 2);
      const seekStart = await page.evaluate(() => window.__videoChecks.seeks.length);
      await page.evaluate(() => window.__videoChecks.start());
      for (const [steps, delta, interval] of [[10, 100, 60], [4, 320, 65], [4, -320, 65], [35, 12, 16], [35, -12, 16]]) {
        for (let index = 0; index < steps; index++) { await page.mouse.wheel(0, delta); await page.waitForTimeout(interval); }
      }
      await settled(page);
      const raw = await page.evaluate(() => {
        const checks = window.__videoChecks;
        return { samples: checks.stop(), seeks: checks.seeks, seeked: checks.seeked, presentations: checks.presentations, costs: checks.rafCosts };
      });
      let moving = 0;
      let held = 0;
      let wrongDirection = 0;
      const gaps = [];
      for (let index = 1; index < raw.samples.length; index++) {
        const previous = raw.samples[index - 1];
        const current = raw.samples[index];
        gaps.push(current.at - previous.at);
        if (current.scroll !== previous.scroll) {
          moving++;
          if (current.pixels?.hash === previous.pixels?.hash) held++;
          if (Math.abs(current.currentTime - previous.currentTime) > .001 &&
            Math.sign(current.currentTime - previous.currentTime) !== Math.sign(current.scroll - previous.scroll)) wrongDirection++;
        }
      }
      const result = {
        viewport, source: (await state(page)).source, duration: (await state(page)).duration, samples: raw.samples.length,
        nativeSeekRequests: raw.seeks.length - seekStart,
        seekLatencyP95Ms: percentile(raw.seeked.map((event) => event.latency).filter((value) => value !== null), .95),
        seekLatencyMaxMs: Math.max(0, ...raw.seeked.map((event) => event.latency ?? 0)),
        rafCostP95Ms: percentile(raw.costs, .95), rafDeltaP95Ms: percentile(gaps, .95),
        requestedLagP95Seconds: percentile(raw.samples.map((sample) => Math.abs(sample.targetTime - sample.currentTime)), .95),
        presentedLagP95Seconds: percentile(raw.samples.filter((sample) => sample.presentedTime !== null)
          .map((sample) => Math.abs(sample.targetTime - sample.presentedTime)), .95),
        movingSamples: moving, heldVideoFramesWhileScrolling: held, wrongDirection,
        distinctPresentedTimes: new Set(raw.presentations.map((frame) => frame.mediaTime)).size,
        distinctPixelStates: new Set(raw.samples.map((sample) => sample.pixels?.hash)).size,
      };
      results.push(result);
      await writeFile(path.join(directory, `${viewport.width}-samples.json`), JSON.stringify(raw, null, 2));
      await verifyScheduling(page);
      check();
      console.log(JSON.stringify(result));
    } finally { await context.close(); }
  }
  await writeFile(path.join(directory, "summary.json"), JSON.stringify(results, null, 2));
  console.log(`Diagnostic benchmark saved to ${directory}; timings describe this headless Chromium host, without a hardware FPS guarantee.`);
}

(async () => {
  assert.ok(["all", "core", "input", "scrollbar", "recovery", "benchmark"].includes(mode), `Unknown mode: ${mode}`);
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch(browserLaunchOptions());
  try {
    if (mode === "all" || mode === "core") await core(browser);
    if (mode === "all" || mode === "input") await input(browser);
    if (mode === "scrollbar") await scrollbarInput();
    if (mode === "all" || mode === "recovery") await recovery(browser);
    if (mode === "benchmark") await benchmark(browser);
    console.log(`PASS scroll-video ${mode}; screenshots ${output}`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
