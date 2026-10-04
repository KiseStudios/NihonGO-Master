const { chromium } = require("playwright");
const assert = require("node:assert/strict");

const baseUrl = (process.env.TEST_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const FRAME_COUNT = 120;

// Observe rendered pixels and scheduling without adding a continuous test RAF.
// Sampling runs only during an input exercise; the engine's debug counter is
// inspected separately while idle. No wall-clock FPS threshold belongs in CI.
async function observe(page) {
  await page.addInitScript(() => {
    const originalRAF = window.requestAnimationFrame.bind(window);
    const originalDraw = CanvasRenderingContext2D.prototype.drawImage;
    let inRAF = 0;
    const checks = window.__heroChecks = { draws: 0, drawsOutsideRAF: 0, sampling: false, samples: [] };
    window.requestAnimationFrame = (callback) => originalRAF((time) => {
      inRAF++;
      try { callback(time); } finally { inRAF--; }
    });
    CanvasRenderingContext2D.prototype.drawImage = function (...args) {
      if (this.canvas.id === "heroSequenceCanvas") {
        checks.draws++;
        if (!inRAF) checks.drawsOutsideRAF++;
      }
      return originalDraw.apply(this, args);
    };
    const small = document.createElement("canvas");
    small.width = 24;
    small.height = 16;
    const context = small.getContext("2d", { willReadFrequently: true });
    checks.pixels = () => {
      context.drawImage(document.querySelector("#heroSequenceCanvas"), 0, 0, small.width, small.height);
      const data = context.getImageData(0, 0, small.width, small.height).data;
      let hash = 2166136261;
      let opaque = 0;
      let min = 255;
      let max = 0;
      for (let index = 0; index < data.length; index++) {
        hash = Math.imul(hash ^ data[index], 16777619);
        if (index % 4 === 3) opaque += data[index] === 255;
        else { min = Math.min(min, data[index]); max = Math.max(max, data[index]); }
      }
      return { hash: hash >>> 0, opaque, range: max - min };
    };
    checks.start = () => {
      checks.samples = [];
      checks.sampling = true;
      let lastDraws = -1;
      let pixels;
      const sample = (time) => {
        if (!checks.sampling) return;
        const hero = document.querySelector(".scroll-hero");
        if (checks.draws !== lastDraws) { pixels = checks.pixels(); lastDraws = checks.draws; }
        checks.samples.push({
          time, scroll: scrollY, frame: Number(hero.dataset.frame),
          target: Number(hero.dataset.targetFrame), ...pixels,
        });
        originalRAF(sample);
      };
      originalRAF(sample);
    };
    checks.stop = () => { checks.sampling = false; return checks.samples; };
  });
}

async function ready(page, preload = true) {
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.goto(`${baseUrl}/?heroDebug=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector(".scroll-hero")?.dataset.frame === "1");
  if (preload) {
    await page.waitForFunction(() => Number(document.querySelector(".scroll-hero").dataset.loadedFrames) === 120,
      null, { timeout: 30000 });
    assert.equal(await page.evaluate(() => scrollY), 0, "All 120 compressed frames preload without traversing the hero");
    assert.equal(await page.locator(".scroll-hero").getAttribute("data-frame"), "1", "Background preload leaves the opening image visible");
    const cache = await page.locator(".scroll-hero").evaluate((hero) => Number(hero.dataset.cachedFrames));
    assert.ok(cache > 0 && cache < FRAME_COUNT, "Preloading all files does not decode the complete sequence into memory");
  }
  assert.equal(await page.locator(".scroll-hero").getAttribute("data-frame-count"), String(FRAME_COUNT));
}

async function settled(page) {
  await page.evaluate(() => {
    window.__heroSettle = { scroll: scrollY, target: document.querySelector(".scroll-hero").dataset.targetFrame, at: performance.now() };
  });
  await page.waitForFunction(() => {
    const hero = document.querySelector(".scroll-hero");
    const state = window.__heroSettle;
    if (state.scroll !== scrollY || state.target !== hero.dataset.targetFrame) {
      state.scroll = scrollY;
      state.target = hero.dataset.targetFrame;
      state.at = performance.now();
    }
    // PageDown performs native animated scrolling. Equality at an intermediate
    // point does not mean that the browser has finished delivering input.
    return performance.now() - state.at >= 200 && hero.dataset.frame === hero.dataset.targetFrame;
  }, null, { timeout: 15000 });
  await page.evaluate(() => new Promise(requestAnimationFrame));
}

async function jump(page, progress) {
  const align = () => page.locator(".scroll-hero").evaluate((hero, value) => {
    const rect = hero.getBoundingClientRect();
    const sticky = hero.querySelector(".scroll-hero-sticky").getBoundingClientRect();
    scrollTo({ top: scrollY + rect.top + (rect.height - sticky.height) * value, behavior: "instant" });
  }, progress);
  await align();
  // The preserved navbar changes height after the first scroll.
  await page.waitForTimeout(350);
  await align();
  await settled(page);
  const frame = Number(await page.locator(".scroll-hero").getAttribute("data-frame"));
  assert.ok(Math.abs(frame - (1 + Math.round(progress * (FRAME_COUNT - 1)))) <= 1,
    `A scrollbar-style jump reaches the selected image (${progress})`);
  return frame;
}

async function input(page, label, direction, action) {
  await page.evaluate(() => window.__heroChecks.start());
  await action();
  await settled(page);
  const samples = await page.evaluate(() => window.__heroChecks.stop());
  assert.ok(samples.length > 1, `${label}: observed rendered states during input`);
  const first = samples[0];
  const last = samples.at(-1);
  assert.ok(direction * (last.frame - first.frame) > 0, `${label}: sequence follows input direction`);
  for (let index = 1; index < samples.length; index++) {
    assert.ok(direction * (samples[index].frame - samples[index - 1].frame) >= 0,
      `${label}: the image does not unexpectedly reverse while input keeps its direction`);
  }
  assert.ok(new Set(samples.map((sample) => sample.hash)).size > 1, `${label}: canvas pixels change with the sequence`);
  assert.ok(samples.every((sample) => sample.opaque === 24 * 16 && sample.range > 5),
    `${label}: every observed canvas state contains an opaque image, without blank flashes`);
  assert.equal(last.frame, last.target, `${label}: the last image catches the requested position`);
  return { input: label, start: first.frame, end: last.frame, renderedImages: new Set(samples.map((sample) => sample.hash)).size };
}

async function exerciseInputs(browser, viewport, nativeImage = false, highPower = false) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const fetches = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (request.resourceType() === "fetch" && /\/optimized\/\d+\/frame_\d+\.webp/.test(request.url())) fetches.push(request.url());
  });
  await observe(page);
  if (nativeImage) await page.addInitScript(() => { window.createImageBitmap = undefined; });
  if (highPower) await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => 8 });
    if (navigator.connection) Object.defineProperty(navigator.connection, "saveData", { configurable: true, get: () => false });
  });
  try {
    await ready(page);
    if (highPower) {
      assert.equal(await page.locator(".scroll-hero").getAttribute("data-quality"), "high", "Eight cores and 8 GiB select the high quality profile");
      assert.ok(fetches.length > 0 && fetches.every((url) => url.includes("/optimized/1920/")),
        "The high power 1920px viewport fetches the 1920px sequence");
    }
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await jump(page, 0.08);
    const results = [];
    results.push(await input(page, "slow wheel", 1, async () => {
      for (let index = 0; index < 6; index++) {
        await page.mouse.wheel(0, 70);
        await page.waitForTimeout(85);
      }
    }));
    results.push(await input(page, "fast wheel", 1, async () => {
      for (let index = 0; index < 3; index++) {
        await page.mouse.wheel(0, 220);
        await page.waitForTimeout(20);
      }
    }));
    results.push(await input(page, "fine trackpad-style deltas", -1, async () => {
      for (let index = 0; index < 24; index++) {
        await page.mouse.wheel(0, -9);
        await page.waitForTimeout(12);
      }
    }));
    await jump(page, 0.2);
    // Blur links so PageDown exercises native document keyboard scrolling.
    await page.evaluate(() => document.activeElement?.blur());
    results.push(await input(page, "PageDown", 1, () => page.keyboard.press("PageDown")));
    await jump(page, 0.75);
    results.push(await input(page, "rapid reverse wheel", -1, async () => {
      for (let index = 0; index < 3; index++) {
        await page.mouse.wheel(0, -240);
        await page.waitForTimeout(16);
      }
    }));
    // Reverse while forward events are still arriving, then require the exact
    // final requested image rather than old asynchronous decode results.
    await page.mouse.wheel(0, 480);
    await page.mouse.wheel(0, -620);
    await settled(page);
    const reversed = Number(await page.locator(".scroll-hero").getAttribute("data-frame"));
    await page.waitForTimeout(450);
    assert.equal(Number(await page.locator(".scroll-hero").getAttribute("data-frame")), reversed,
      "Late forward decoding cannot move the resting image after a rapid reversal");
    await jump(page, 0.94);
    await jump(page, 0.05);
    await jump(page, 1);
    assert.equal(await page.locator(".scroll-hero").getAttribute("data-frame"), "120", "A jump reaches the exact last image");
    const finalPixels = await page.evaluate(() => window.__heroChecks.pixels());
    await page.waitForTimeout(400);
    assert.deepEqual(await page.evaluate(() => window.__heroChecks.pixels()), finalPixels,
      "The final frame remains drawn without clearing or flicker");
    await jump(page, 0);
    assert.equal(await page.locator(".scroll-hero").getAttribute("data-frame"), "1", "Reverse scrolling reaches the exact opening image");

    await page.mouse.move(0, 0);
    await page.waitForTimeout(700);
    const idleRAF = await page.locator(".scroll-hero").getAttribute("data-raf-count");
    assert.ok(Number(idleRAF) > 0, "Debug mode exposes the engine's animation count");
    await page.waitForTimeout(650);
    assert.equal(await page.locator(".scroll-hero").getAttribute("data-raf-count"), idleRAF,
      "The hero stops scheduling RAF work when scroll, pointer and loading are idle");
    assert.equal(await page.evaluate(() => window.__heroChecks.drawsOutsideRAF), 0,
      "Every sequence canvas draw occurs inside RAF, including load completion");
    if (highPower) {
      const decodedBytes = Number(await page.locator(".scroll-hero").getAttribute("data-decoded-bytes"));
      assert.ok(decodedBytes > 0 && decodedBytes <= 96 * 1024 * 1024, "The high power decoded frame cache stays within 96 MiB");
    }
    assert.deepEqual(errors, [], "All input paths finish without application JavaScript errors");
    console.log("PASS hero inputs", viewport, nativeImage ? "native Image decoding" : "ImageBitmap decoding", highPower ? "high power / 1920px / 96MiB cache" : "automatic quality", results);
  } finally { await page.close(); }
}

async function exercisePreloadAfterLeaving(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  // Playwright keeps this page foregrounded. Simulate only the visibility
  // state consumed by the controller, and announce changes through its event.
  await page.addInitScript(() => {
    window.__heroSimulatedHidden = false;
    Object.defineProperty(document, "hidden", { configurable: true, get: () => window.__heroSimulatedHidden });
    window.__setHeroSimulatedVisibility = (hidden) => {
      window.__heroSimulatedHidden = hidden;
      document.dispatchEvent(new Event("visibilitychange"));
    };
  });
  // Ensure requests are still pending when the user skips the presentation.
  await page.route("**/optimized/*/frame_*.webp", async (route) => {
    if (route.request().resourceType() === "fetch") await new Promise((resolve) => setTimeout(resolve, 80));
    await route.continue();
  });
  try {
    await ready(page, false);
    assert.ok(Number(await page.locator(".scroll-hero").getAttribute("data-loaded-frames")) < FRAME_COUNT,
      "The skipped-hero exercise starts before background preload is complete");
    await page.locator(".scroll-hero").evaluate((hero) => {
      scrollTo({ top: scrollY + hero.getBoundingClientRect().bottom + innerHeight, behavior: "instant" });
    });
    await page.waitForFunction(() => document.querySelector(".scroll-hero").getBoundingClientRect().bottom < 0);
    await page.evaluate(() => window.__setHeroSimulatedVisibility(true));
    assert.equal(await page.evaluate(() => document.hidden), true, "The preload test explicitly simulates a hidden document");
    // In-flight requests may finish while hidden. Let their 80ms route delay
    // drain, then prove that no new background work starts during the pause.
    await page.waitForTimeout(300);
    const pausedLoaded = await page.locator(".scroll-hero").getAttribute("data-loaded-frames");
    assert.ok(Number(pausedLoaded) < FRAME_COUNT, "The simulated hidden state pauses preload before all frames are fetched");
    await page.waitForTimeout(180);
    assert.equal(await page.locator(".scroll-hero").getAttribute("data-loaded-frames"), pausedLoaded,
      "Background preload stays paused after in-flight requests finish in the simulated hidden state");
    await page.evaluate(() => window.__setHeroSimulatedVisibility(false));
    assert.equal(await page.evaluate(() => document.hidden), false, "The test explicitly resumes simulated document visibility");
    assert.equal(await page.locator(".scroll-hero").evaluate((hero) => hero.getBoundingClientRect().bottom < 0), true,
      "Visibility resumes while the hero remains outside the viewport");
    await page.waitForFunction(() => Number(document.querySelector(".scroll-hero").dataset.loadedFrames) === 120,
      null, { timeout: 30000 });
    await jump(page, 0.7);
    console.log("PASS simulated hidden/visible lifecycle pauses and resumes all 120 compressed files outside the hero viewport; return scrolling draws the selected image");
  } finally { await page.close(); }
}

async function exerciseMissingTarget(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  let requests = 0;
  await observe(page);
  // Logical frame 61 maps to original source frame 122 in the 120-frame sample.
  await page.route("**/optimized/*/frame_122.webp", async (route) => {
    requests++;
    if (requests === 1) return route.fulfill({ status: 503, body: "Temporary intermediate-frame outage" });
    await gate;
    await route.continue();
  });
  try {
    await ready(page, false);
    await jump(page, 0.1);
    const previousFrame = await page.locator(".scroll-hero").getAttribute("data-frame");
    const previousPixels = await page.evaluate(() => window.__heroChecks.pixels());
    await page.locator(".scroll-hero").evaluate((hero) => {
      const rect = hero.getBoundingClientRect();
      const sticky = hero.querySelector(".scroll-hero-sticky").getBoundingClientRect();
      scrollTo({ top: scrollY + rect.top + (rect.height - sticky.height) * 0.5, behavior: "instant" });
    });
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.targetFrame === "61");
    await page.waitForTimeout(180);
    assert.equal(await page.locator(".scroll-hero").getAttribute("data-frame"), previousFrame,
      "An unavailable exact target keeps the last valid image instead of substituting a nearby frame");
    assert.deepEqual(await page.evaluate(() => window.__heroChecks.pixels()), previousPixels,
      "Waiting for an intermediate target never blanks the canvas");
    release();
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "61", null, { timeout: 15000 });
    assert.ok(requests >= 2, "An intermediate transient fetch failure retries and recovers");
    assert.notDeepEqual(await page.evaluate(() => window.__heroChecks.pixels()), previousPixels,
      "Recovery renders the requested intermediate image");
    await page.setViewportSize({ width: 390, height: 844 });
    await settled(page);
    const resized = await page.evaluate(() => window.__heroChecks.pixels());
    assert.equal(resized.opaque, 24 * 16, "Resizing after recovery keeps the canvas covered");
    assert.ok(resized.range > 5, "Resizing after recovery preserves a visible image");
    await jump(page, 0.2);
    assert.equal(await page.evaluate(() => window.__heroChecks.drawsOutsideRAF), 0, "Recovery and resize draw only inside RAF");
    console.log("PASS intermediate target outage: holds pixels, retries, draws exact frame and survives desktop/mobile resize");
  } finally { release(); await page.close(); }
}

async function exerciseUrgentTarget(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  await page.addInitScript(() => {
    window.__heroHeldRequests = 0;
    window.__heroUrgentRequested = false;
  });
  await page.route("**/optimized/*/frame_*.webp", async (route) => {
    const source = Number(route.request().url().match(/frame_(\d+)\.webp/)[1]);
    if (source === 1) return route.continue();
    if (source === 122) {
      await page.evaluate(() => { window.__heroUrgentRequested = true; });
      return route.continue();
    }
    await page.evaluate(() => { window.__heroHeldRequests++; });
    await gate;
    await route.continue();
  });
  try {
    await ready(page, false);
    await page.waitForFunction(() => window.__heroHeldRequests >= 2);
    const align = () => page.locator(".scroll-hero").evaluate((hero) => {
      const rect = hero.getBoundingClientRect();
      const sticky = hero.querySelector(".scroll-hero-sticky").getBoundingClientRect();
      scrollTo({ top: scrollY + rect.top + (rect.height - sticky.height) * 0.5, behavior: "instant" });
    });
    await align();
    await page.waitForTimeout(350);
    await align();
    await page.waitForFunction(() => window.__heroUrgentRequested, null, { timeout: 10000 });
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "61", null, { timeout: 10000 });
    assert.equal(await page.evaluate(() => window.__heroUrgentRequested), true,
      "The exact target fetch starts while stale neighbor fetches remain unresolved");
    assert.ok(await page.evaluate(() => window.__heroHeldRequests >= 2),
      "The target decodes and renders without waiting for old network requests to free decode slots");
    await page.screenshot({ path: "/tmp/nihongo-hero-urgent-request.png" });
    console.log("PASS urgent target fetch/decode bypasses held stale neighbor requests; screenshot /tmp/nihongo-hero-urgent-request.png");
  } finally { release(); await page.close(); }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    if (process.env.HERO_ONLY === "urgent") {
      await exerciseUrgentTarget(browser);
      return;
    }
    if (process.env.HERO_ONLY === "preload") {
      await exercisePreloadAfterLeaving(browser);
      return;
    }
    for (const viewport of [{ width: 1366, height: 768 }, { width: 1920, height: 1080 }, { width: 390, height: 844 }]) {
      await exerciseInputs(browser, viewport, viewport.width === 390, viewport.width === 1920);
    }
    await exercisePreloadAfterLeaving(browser);
    await exerciseMissingTarget(browser);
    await exerciseUrgentTarget(browser);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
