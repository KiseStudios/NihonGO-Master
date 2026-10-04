const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { readdir, readFile, stat, open, mkdir } = require("node:fs/promises");
const path = require("node:path");

const baseUrl = (process.env.TEST_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const output = process.env.SCROLL_HERO_SCREENSHOTS || "/tmp/nihongo-scroll-hero-validation";
const assetDirectory = path.resolve(__dirname, "../Site japones estudo/telainicial");
const heroSelector = ".scroll-hero";

async function inventory() {
  const names = (await readdir(assetDirectory))
    .filter((name) => /^frame_\d+\.png$/.test(name))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  assert.equal(names.length, 240, "The complete original image sequence is preserved");
  const dimensions = [];
  for (let index = 0; index < names.length; index++) {
    assert.equal(names[index], `frame_${String(index + 1).padStart(3, "0")}.png`, "No missing or misnamed frames");
    const file = await open(path.join(assetDirectory, names[index]), "r");
    const header = Buffer.alloc(24);
    try {
      await file.read(header, 0, header.length, 0);
    } finally {
      await file.close();
    }
    assert.equal(header.subarray(1, 4).toString(), "PNG", `${names[index]} is a PNG`);
    dimensions.push([header.readUInt32BE(16), header.readUInt32BE(20)]);
  }
  assert.ok(dimensions.every(([width, height]) => width === dimensions[0][0] && height === dimensions[0][1]), "Frames share one aspect ratio");
  const optimizedDirectory = path.join(assetDirectory, "optimized");
  const manifest = JSON.parse(await readFile(path.join(optimizedDirectory, "manifest.json"), "utf8"));
  assert.equal(manifest.format, "webp");
  assert.equal(manifest.frameCount, names.length);
  assert.deepEqual([manifest.source.width, manifest.source.height], dimensions[0]);
  assert.deepEqual(manifest.variants.map((variant) => variant.directory), ["1280", "1920"]);
  const variants = [];
  for (const variant of manifest.variants) {
    const directory = path.join(optimizedDirectory, variant.directory);
    const optimizedNames = (await readdir(directory)).filter((name) => name.endsWith(".webp")).sort();
    assert.equal(optimizedNames.length, names.length, `Complete ${variant.directory}px WebP sequence`);
    assert.equal(variant.frameCount, names.length);
    let bytes = 0;
    for (let index = 0; index < optimizedNames.length; index++) {
      const name = optimizedNames[index];
      assert.equal(name, `frame_${String(index + 1).padStart(3, "0")}.webp`, "No missing optimized frames");
      const file = await open(path.join(directory, name), "r");
      const header = Buffer.alloc(30);
      try { await file.read(header, 0, header.length, 0); }
      finally { await file.close(); }
      assert.equal(header.subarray(0, 4).toString(), "RIFF");
      assert.equal(header.subarray(8, 12).toString(), "WEBP");
      assert.equal(header.subarray(12, 16).toString(), "VP8 ");
      assert.deepEqual([header.readUInt16LE(26) & 0x3fff, header.readUInt16LE(28) & 0x3fff], [variant.width, variant.height], "WebP dimensions match the manifest");
      bytes += (await stat(path.join(directory, name))).size;
    }
    assert.equal(bytes, variant.totalBytes, "Manifest reports the actual optimized transfer size");
    assert.ok(bytes <= (variant.width === 1280 ? 11 : 18) * 1024 * 1024, "Compressed sequences stay near 10 MiB / 17 MiB");
    variants.push({ width: variant.width, frames: optimizedNames.length, bytes });
  }
  console.log("Asset inventory:", { originalFrames: names.length, dimensions: dimensions[0], optimized: variants });
  const selected = Array.from({ length: 120 }, (_, index) => names[Math.round(index * (names.length - 1) / 119)]);
  assert.equal(new Set(selected).size, 120, "Exactly 120 distinct source frames");
  assert.equal(selected[0], names[0]);
  assert.equal(selected.at(-1), names.at(-1));
  return selected;
}

function monitor(page) {
  const errors = [];
  const httpErrors = [];
  const frameRequests = [];
  const localOrigin = new URL(baseUrl).origin;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const url = message.location().url;
    // External font delivery is outside the application; local failures are failures.
    if (!url || url.startsWith(localOrigin)) errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(localOrigin))
      httpErrors.push(`${response.status()} ${response.url()}`);
  });
  page.on("request", (request) => {
    const url = request.url();
    if (/\/telainicial\/(?:optimized\/(?:1280|1920)\/)?frame_\d+\.(?:png|webp)(?:\?|$)/.test(url)) frameRequests.push(url);
  });
  const check = () => {
    assert.deepEqual(errors, [], "No application JavaScript or console errors");
    assert.deepEqual(httpErrors, [], "No missing local assets or HTTP errors");
  };
  // Call before coverPixels, which intentionally reads the original PNG as a reference.
  check.optimizedStartup = () => {
    assert.ok(frameRequests.length > 0, "The application requests image frames");
    assert.ok(frameRequests.every((url) => /\/optimized\/(1280|1920)\/frame_\d+\.webp(?:\?|$)/.test(url)), "Runtime startup requests WebP frames without original PNG transfers");
  };
  return check;
}

async function ready(page) {
  await page.goto(baseUrl);
  await page.waitForFunction(() => {
    const hero = document.querySelector(".scroll-hero");
    const poster = hero?.querySelector(".hero-sequence-poster");
    return hero?.classList.contains("is-enhanced") &&
      Number(hero.dataset.frame) >= 1 && poster?.complete && poster.naturalWidth > 0;
  }, null, { timeout: 20000 });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator(".hero-story-stage").count(), 6, "All six narrative chapters exist");
  assert.equal(await page.locator(".scroll-hero-sticky").evaluate((el) => getComputedStyle(el).position), "sticky");
  assert.equal(await page.locator("#heroSequenceCanvas").getAttribute("aria-hidden"), "true", "Canvas is decorative; the story uses real HTML");
  const poster = await page.locator(".hero-sequence-poster").evaluate((image) => ({ src: image.getAttribute("src"), width: image.naturalWidth, height: image.naturalHeight }));
  assert.equal(poster.src, "telainicial/optimized/1280/frame_001.webp", "The first optimized frame remains the poster");
  assert.deepEqual([poster.width, poster.height], [1280, 720]);
}

async function state(page) {
  return page.locator(heroSelector).evaluate((hero) => {
    const rect = hero.getBoundingClientRect();
    const sticky = hero.querySelector(".scroll-hero-sticky");
    const canvas = hero.querySelector("canvas");
    const canvasRect = canvas.getBoundingClientRect();
    return {
      frame: Number(hero.dataset.frame),
      target: Number(hero.dataset.targetFrame),
      progress: Number(hero.dataset.progress),
      loaded: Number(hero.dataset.loadedFrames),
      cached: Number(hero.dataset.cachedFrames),
      decodedBytes: Number(hero.dataset.decodedBytes),
      quality: hero.dataset.quality,
      heroHeight: rect.height,
      stickyTop: sticky.getBoundingClientRect().top,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      canvasCssWidth: canvasRect.width,
      canvasCssHeight: canvasRect.height,
      dpr: devicePixelRatio,
    };
  });
}

async function scrollToProgress(page, progress, frameCount) {
  const align = () => page.locator(heroSelector).evaluate((hero, value) => {
    const rect = hero.getBoundingClientRect();
    const height = hero.querySelector(".scroll-hero-sticky").getBoundingClientRect().height;
    window.scrollTo({ top: scrollY + rect.top + (rect.height - height) * value, behavior: "instant" });
  }, progress);
  await align();
  // The preserved navbar changes height on first scroll, then the hero geometry settles.
  await page.waitForTimeout(380);
  await align();
  await page.waitForFunction(({ progress, frameCount }) => {
    const hero = document.querySelector(".scroll-hero");
    const actual = Number(hero.dataset.progress);
    const drawn = Number(hero.dataset.frame);
    const target = Number(hero.dataset.targetFrame);
    return Math.abs(actual - progress) < 0.015 && drawn >= 1 && drawn <= frameCount &&
      drawn === target &&
      (progress !== 0 || drawn === 1) &&
      (progress !== 1 || (drawn === frameCount && target === frameCount));
  }, { progress, frameCount }, { timeout: 20000 });
  const result = await state(page);
  assert.ok(Math.abs(result.target - (1 + progress * (frameCount - 1))) <= 2, "Scroll maps to the real frame count");
  assert.equal(result.scrollWidth, result.viewportWidth, "No horizontal overflow");
  assert.ok(Math.abs(result.stickyTop) < 2, "The sequence stays pinned at top: 0");
  return result;
}

async function chapter(page, index) {
  const stages = await page.locator(".hero-story-stage").evaluateAll((elements) => elements.map((el) => ({
    current: el.classList.contains("is-current"),
    inert: el.inert,
    hidden: el.getAttribute("aria-hidden"),
    opacity: Number(getComputedStyle(el).opacity),
  })));
  assert.ok(stages[index].current && !stages[index].inert && stages[index].hidden !== "true", `Chapter ${index + 1} is accessible`);
  assert.ok(stages[index].opacity > 0.8, `Chapter ${index + 1} is legible at its midpoint`);
  stages.forEach((stage, stageIndex) => {
    if (stageIndex !== index) assert.ok(stage.inert && stage.hidden === "true", "Inactive chapter links cannot receive keyboard focus");
  });
}

async function coverPixels(page, frameNames) {
  const result = await page.locator(heroSelector).evaluate(async (hero, names) => {
    const canvas = hero.querySelector("canvas");
    const frame = Number(hero.dataset.frame);
    // Capture the pixels and their frame number in the same task. Image.decode()
    // yields; the live sequence may validly draw another frame while it runs.
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext("2d").drawImage(canvas, 0, 0);
    const image = new Image();
    image.src = `telainicial/${names[frame - 1]}`;
    await image.decode();
    const reference = document.createElement("canvas");
    reference.width = snapshot.width;
    reference.height = snapshot.height;
    const context = reference.getContext("2d");
    const scale = Math.max(reference.width / image.naturalWidth, reference.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(image, (reference.width - width) / 2, (reference.height - height) / 2, width, height);
    const sample = (source) => {
      const small = document.createElement("canvas");
      small.width = 32;
      small.height = 24;
      const ctx = small.getContext("2d");
      ctx.drawImage(source, 0, 0, 32, 24);
      return ctx.getImageData(0, 0, 32, 24).data;
    };
    const actual = sample(snapshot);
    const expected = sample(reference);
    let difference = 0;
    let opaque = 0;
    for (let index = 0; index < actual.length; index++) {
      if (index % 4 === 3) opaque += actual[index] >= 250 ? 1 : 0;
      else difference += Math.abs(actual[index] - expected[index]);
    }
    return { frame, meanDifference: difference / (32 * 24 * 3), opaque };
  }, frameNames);
  assert.equal(result.opaque, 32 * 24, "The canvas has no blank or transparent cover gaps");
  // A smaller decoded bitmap may use another resampling algorithm; compare overall composition.
  assert.ok(result.meanDifference < 15, `Canvas preserves centered cover and aspect ratio (mean RGB difference ${result.meanDifference.toFixed(2)})`);
  return result;
}

async function screenshot(page, name) {
  await page.screenshot({ path: path.join(output, `${name}.png`) });
}

async function finalStability(page, frameCount) {
  const samples = await page.locator(heroSelector).evaluate(async (hero) => {
    const canvas = hero.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const samples = [];
    for (let index = 0; index < 12; index++) {
      await new Promise(requestAnimationFrame);
      const data = ctx.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 4, 4).data;
      samples.push({ frame: Number(hero.dataset.frame), pixels: Array.from(data) });
    }
    return samples;
  });
  samples.forEach((sample) => {
    assert.equal(sample.frame, frameCount, "The exact final frame remains displayed");
    assert.deepEqual(sample.pixels, samples[0].pixels, "The final image does not clear or flicker between animation frames");
  });
}

async function resize(page, viewport, frameCount) {
  await page.setViewportSize(viewport);
  await page.waitForTimeout(400);
  const result = await scrollToProgress(page, 0.45, frameCount);
  assert.ok(Math.abs(result.canvasCssWidth - viewport.width) < 1, "Canvas spans the viewport width after resize");
  assert.ok(Math.abs(result.canvasCssHeight - viewport.height) < 2, "Canvas spans the viewport height after resize");
  const assetWidth = result.quality === "high" && viewport.width > 700 ? 1920 : 1280;
  assertCanvasBacking(result, assetWidth, assetWidth === 1920 ? 4_200_000 : 2_100_000);
  return result;
}

function assertCanvasBacking(result, assetWidth, pixelBudget) {
  const ratioX = result.canvasWidth / result.canvasCssWidth;
  const ratioY = result.canvasHeight / result.canvasCssHeight;
  const roundingX = 1 / result.canvasCssWidth;
  const roundingY = 1 / result.canvasCssHeight;
  assert.ok(result.canvasWidth > 0 && result.canvasHeight > 0, "Canvas backing store has visible dimensions");
  assert.ok(Math.abs(ratioX - ratioY) <= roundingX + roundingY,
    "The backing store stays proportional to the displayed canvas, allowing integer pixel rounding");
  const usefulRatio = Math.min(assetWidth / result.canvasCssWidth, (assetWidth * 9 / 16) / result.canvasCssHeight);
  assert.ok(ratioX <= usefulRatio + roundingX && ratioY <= usefulRatio + roundingY,
    "Canvas backing density does not exceed the useful WebP detail after the cover crop");
  assert.ok(ratioX <= result.dpr + roundingX && ratioY <= result.dpr + roundingY,
    "Canvas backing density does not exceed the device pixel ratio");
  assert.ok(result.canvasWidth * result.canvasHeight <= pixelBudget + result.canvasWidth + result.canvasHeight + 1,
    "Canvas respects the pixel budget, allowing integer dimension rounding");
}

(async () => {
  const frames = await inventory();
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const desktop = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await desktop.newPage();
    const desktopErrors = monitor(page);
    await ready(page);
    desktopErrors.optimizedStartup();
    const initial = await state(page);
    assert.ok(initial.heroHeight / initial.viewportHeight >= 5 && initial.heroHeight / initial.viewportHeight <= 5.5, "Desktop sequence uses approximately 500vh");
    assert.ok(initial.loaded >= 1 && initial.loaded <= frames.length, "Frames load progressively within the actual inventory");
    await scrollToProgress(page, 0, frames.length);
    await coverPixels(page, frames);
    await screenshot(page, "desktop-1366-intro");

    let previousFrame = 0;
    for (const [index, progress] of [0.075, 0.26, 0.45, 0.63, 0.81, 0.96].entries()) {
      const result = await scrollToProgress(page, progress, frames.length);
      assert.ok(result.frame > previousFrame, "Forward scrolling advances the sequence");
      previousFrame = result.frame;
      await chapter(page, index);
      await screenshot(page, `desktop-1366-chapter-${index + 1}`);
    }
    await scrollToProgress(page, 1, frames.length);
    await finalStability(page, frames.length);
    await coverPixels(page, frames);
    await screenshot(page, "desktop-1366-final");
    previousFrame = frames.length;
    for (const [index, progress] of [[5, 0.96], [4, 0.81], [3, 0.63], [2, 0.45], [1, 0.26], [0, 0.075], [0, 0]]) {
      const result = await scrollToProgress(page, progress, frames.length);
      assert.ok(result.frame < previousFrame, "Backward scrolling reverses the sequence");
      previousFrame = result.frame;
      await chapter(page, index);
    }

    await page.locator('.hero-story-intro [data-screen="hiragana"]').click();
    assert.equal(await page.evaluate(() => app.currentScreen), "hiragana", "Intro CTA preserves application navigation");
    assert.ok(await page.locator("#hiraganaGrid .kana-card").count() >= 46);
    const hiddenFrame = await page.locator(heroSelector).getAttribute("data-frame");
    await page.waitForTimeout(200);
    assert.equal(await page.locator(heroSelector).getAttribute("data-frame"), hiddenFrame, "Hidden home does not continue drawing");
    await page.locator(".ed-brand").click();
    assert.equal(await page.evaluate(() => app.currentScreen), "home");
    await scrollToProgress(page, 0, frames.length);
    assert.equal(await page.evaluate(() => document.activeElement.id), "home-title", "Returning home restores the existing heading focus");

    await resize(page, { width: 1920, height: 1080 }, frames.length);
    await coverPixels(page, frames);
    await screenshot(page, "desktop-1920-midpoint");
    await scrollToProgress(page, 1, frames.length);
    await page.evaluate(() => window.scrollBy({ top: innerHeight * 0.7, behavior: "instant" }));
    await page.waitForTimeout(200);
    assert.ok(await page.locator("#journey").evaluate((el) => el.getBoundingClientRect().top < innerHeight), "Scrolling naturally reaches the preserved next section");
    assert.ok(await page.locator(".scroll-hero-sticky").evaluate((el) => el.getBoundingClientRect().top < -100), "Sticky area releases after the sequence");
    await screenshot(page, "desktop-1920-boundary");
    await scrollToProgress(page, 0.96, frames.length);
    await page.locator('.hero-story-final [data-screen="hiragana"]').click();
    assert.equal(await page.evaluate(() => app.currentScreen), "hiragana", "Final Hiragana CTA navigates correctly");
    await page.locator(".ed-brand").click();
    await scrollToProgress(page, 0.96, frames.length);
    await page.locator('.hero-story-final a[href="#journey"]').click();
    await page.waitForFunction(() => Math.abs(document.querySelector("#journey").getBoundingClientRect().top - 90) < 15, null, { timeout: 10000 });
    assert.equal(await page.evaluate(() => app.currentScreen), "home", "Final primary CTA explores the real home journey");
    desktopErrors();
    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const touch = await mobile.newPage();
    const mobileErrors = monitor(touch);
    await ready(touch);
    mobileErrors.optimizedStartup();
    const mobileInitial = await state(touch);
    assert.ok(mobileInitial.heroHeight / mobileInitial.viewportHeight >= 3.5 && mobileInitial.heroHeight / mobileInitial.viewportHeight <= 4.5, "Mobile sequence uses approximately 400vh");
    assert.equal(mobileInitial.dpr, 2);
    const mobileFetches = await touch.evaluate(() => performance.getEntriesByType("resource")
      .filter((entry) => entry.initiatorType === "fetch" && /\/optimized\/\d+\/frame_\d+\.webp/.test(entry.name))
      .map((entry) => entry.name));
    assert.ok(mobileFetches.length > 0 && mobileFetches.every((url) => url.includes("/optimized/1280/")),
      "Mobile uses the 1280px WebP variant rather than fetching an oversized sequence");
    assertCanvasBacking(mobileInitial, 1280, 2_100_000);
    await scrollToProgress(touch, 0, frames.length);
    await screenshot(touch, "mobile-360-intro");
    const beforePointer = await touch.locator(".hero-story-intro").evaluate((el) => el.style.transform);
    await touch.locator(".scroll-hero-sticky").dispatchEvent("pointermove", { pointerType: "mouse", clientX: 300, clientY: 300 });
    await touch.waitForTimeout(200);
    assert.equal(await touch.locator(".hero-story-intro").evaluate((el) => el.style.transform), beforePointer, "Mobile ignores desktop mouse microinteractions");
    for (const [index, progress] of [0.075, 0.26, 0.45, 0.63, 0.81, 0.96].entries()) {
      const result = await scrollToProgress(touch, progress, frames.length);
      assert.ok(result.decodedBytes > 0 && result.decodedBytes <= 40 * 1024 * 1024, "Mobile decoded cache respects the 40 MiB budget");
      await chapter(touch, index);
    }
    await scrollToProgress(touch, 0.63, frames.length);
    await coverPixels(touch, frames);
    await screenshot(touch, "mobile-360-kanji");
    await scrollToProgress(touch, 1, frames.length);
    await finalStability(touch, frames.length);
    await screenshot(touch, "mobile-360-final");
    for (const [index, progress] of [[5, 0.96], [4, 0.81], [3, 0.63], [2, 0.45], [1, 0.26], [0, 0.075], [0, 0]]) {
      await scrollToProgress(touch, progress, frames.length);
      await chapter(touch, index);
    }
    await touch.locator('.hero-story-intro [data-screen="hiragana"]').tap();
    assert.equal(await touch.evaluate(() => app.currentScreen), "hiragana", "Mobile CTA is touch accessible");
    mobileErrors();
    await mobile.close();

    const imageFallback = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const imageOnly = await imageFallback.newPage();
    const imageFallbackErrors = monitor(imageOnly);
    await imageOnly.addInitScript(() => { window.createImageBitmap = undefined; });
    await ready(imageOnly);
    imageFallbackErrors.optimizedStartup();
    assert.equal(await imageOnly.evaluate(() => typeof window.createImageBitmap), "undefined", "Exercise native Image decoding without ImageBitmap");
    await scrollToProgress(imageOnly, 0.63, frames.length);
    await coverPixels(imageOnly, frames);
    assert.ok((await state(imageOnly)).decodedBytes <= 40 * 1024 * 1024, "Native Image fallback respects the 40 MiB mobile decoded cache budget");
    await scrollToProgress(imageOnly, 1, frames.length);
    await finalStability(imageOnly, frames.length);
    await coverPixels(imageOnly, frames);
    assert.ok((await state(imageOnly)).decodedBytes <= 40 * 1024 * 1024, "Image fallback stays bounded at the final frame");
    assert.ok(await imageOnly.locator('.hero-story-final [data-screen="hiragana"]').isVisible(), "Image fallback keeps the final CTA visible");
    assert.equal(await imageOnly.locator(".hero-story-final").evaluate((el) => el.inert), false, "Image fallback keeps the final CTA interactive");
    await screenshot(imageOnly, "mobile-360-image-fallback-final");
    imageFallbackErrors();
    await imageFallback.close();

    const reduced = await browser.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
    const still = await reduced.newPage();
    const reducedErrors = monitor(still);
    await ready(still);
    await scrollToProgress(still, 0.63, frames.length);
    await chapter(still, 3);
    await coverPixels(still, frames);
    assert.equal(await still.locator(".hero-story-content").first().evaluate((el) => getComputedStyle(el).transform), "none", "Reduced motion removes extra parallax while scroll still selects frames");
    await scrollToProgress(still, 0, frames.length);
    await screenshot(still, "reduced-motion-scroll-active");
    reducedErrors();
    await reduced.close();

    const fallback = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const noCanvas = await fallback.newPage();
    const fallbackErrors = monitor(noCanvas);
    await noCanvas.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (...args) {
        return this.id === "heroSequenceCanvas" ? null : original.apply(this, args);
      };
    });
    await noCanvas.goto(baseUrl);
    await noCanvas.waitForFunction(() => document.querySelector(".scroll-hero")?.classList.contains("is-static"));
    await noCanvas.waitForFunction(() => document.querySelector(".hero-sequence-poster")?.naturalWidth > 0);
    await screenshot(noCanvas, "canvas-unavailable-fallback");
    assert.ok(await noCanvas.locator(heroSelector).evaluate((hero) => hero.getBoundingClientRect().height <= innerHeight * 2.5), "Canvas fallback avoids a long empty pinned section");
    fallbackErrors();
    await fallback.close();

    const withoutScripts = await browser.newContext({ viewport: { width: 1366, height: 768 }, javaScriptEnabled: false });
    const htmlOnly = await withoutScripts.newPage();
    const htmlOnlyErrors = monitor(htmlOnly);
    await htmlOnly.goto(baseUrl);
    await htmlOnly.waitForFunction(() => {
      const image = document.querySelector(".hero-sequence-poster");
      return image?.complete && image.naturalWidth > 0;
    });
    assert.equal(await htmlOnly.locator(".hero-sequence-poster").getAttribute("src"), "telainicial/optimized/1280/frame_001.webp", "Without JavaScript the first optimized frame remains the poster");
    assert.ok(await htmlOnly.locator(".hero-sequence-poster").isVisible(), "Without JavaScript the hero is never blank");
    assert.ok(await htmlOnly.locator(heroSelector).evaluate((hero) => hero.getBoundingClientRect().height <= innerHeight * 2.5), "Without JavaScript the presentation is compact");
    assert.ok(await htmlOnly.locator('.hero-story-intro [data-screen="hiragana"]').isVisible(), "Without JavaScript the introductory learning CTA remains visible");
    assert.equal(await htmlOnly.locator(".hero-story-intro").evaluate((el) => el.inert), false, "Without JavaScript the introductory link remains accessible");
    await screenshot(htmlOnly, "javascript-disabled-static");
    htmlOnlyErrors();
    await withoutScripts.close();

    console.log(`PASS: 240 preserved originals / 480 optimized WebPs / ${frames.length} runtime frames, manifest dimensions/bytes, startup without PNG transfers, cover pixels, six chapters forward/reverse on desktop/mobile, exact stable final frame, navigation/focus, resize, sticky release, 360px HiDPI mobile, Image fallback/40 MiB cache budget, reduced motion, Canvas fallback, JavaScript-disabled poster/CTA, console and HTTP checks. Screenshots: ${output}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
