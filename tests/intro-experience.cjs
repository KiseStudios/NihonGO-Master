const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { mkdir, writeFile } = require("node:fs/promises");
const path = require("node:path");

const baseUrl = (process.env.TEST_BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const output = process.env.INTRO_SCREENSHOTS || "/tmp/kise-layered-hero-validation";
const mode = process.argv[2] || "all";
const heroSelector = ".hero-experience";
const imageSelector = ".hero-layer .hero-image";
const primaryCopy = ".hero-copy--intro";
const originCopy = ".hero-copy--origin";
const images = ["telainicial2/optimized/kiseinitialjapan.webp", "telainicial2/optimized/kisejapansequence.webp"];
const primaryImageRoute = /\/telainicial2\/[^?]*kiseinitialjapan\.(?:png|webp)(?:\?|$)/;
const originImageRoute = /\/telainicial2\/[^?]*kisejapansequence\.(?:png|webp)(?:\?|$)/;
const checkpoints = [0, .3, .49, .65, .8, .96, 1];
// Real artwork bounds in the supplied 1672x941 source. Checking these regions
// catches cropped lettering even when the image element itself fits the stage.
const muralArtwork = {
  width: 1672, height: 941,
  regions: [
    { name: "KISE STUDIOS", left: 700, top: 164, right: 850, bottom: 237 },
    { name: "MADE IN JAPAN", left: 914, top: 582, right: 1456, bottom: 647 },
    { name: "red circle", left: 930, top: 140, right: 1390, bottom: 575 },
  ],
};

function launchOptions() {
  const options = { headless: true };
  if (process.env.TEST_BROWSER_EXECUTABLE_PATH) options.executablePath = process.env.TEST_BROWSER_EXECUTABLE_PATH;
  else if (process.env.TEST_BROWSER_CHANNEL) options.channel = process.env.TEST_BROWSER_CHANNEL;
  return options;
}

async function createPage(browser, options = {}, { expectedImageError = false, expectedGsapError = false, expectedHelperError = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, ...options });
  const page = await context.newPage();
  const errors = [];
  const failures = [];
  const requests = new Set();
  page.on("pageerror", error => {
    if (expectedHelperError && error.message === "Simulated home helper failure") return;
    errors.push(error.message);
  });
  page.on("request", request => {
    const url = new URL(request.url());
    if (url.origin === new URL(baseUrl).origin) requests.add(url.pathname);
  });
  page.on("response", response => {
    if (response.status() < 400 || !response.url().startsWith(baseUrl)) return;
    if (expectedImageError && (expectedImageError instanceof RegExp ? expectedImageError : originImageRoute).test(response.url())) return;
    if (expectedGsapError && /\/(?:gsap|ScrollTrigger)[^/]*\.js/.test(response.url())) return;
    failures.push(`${response.status()} ${response.url()}`);
  });
  await page.route("https://fonts.googleapis.com/**", route => route.abort());
  return { context, page, check: async () => {
    assert.deepEqual(errors, [], "The application has no unexpected JavaScript errors");
    assert.deepEqual(failures, [], "All expected local resources are available");
    assert.deepEqual([...requests].filter(value => /\/telainicial\/|\.mp4$|\/frame_\d+\./.test(value)), [],
      "The hero never requests legacy posters, videos or image sequences");
    const images = await page.locator(imageSelector).evaluateAll(elements => elements.map(image => new URL(image.src).pathname));
    assert.equal(images.length, 2, "One stage contains exactly the two supplied image scenes");
    assert.deepEqual([...requests].filter(value => value.startsWith("/telainicial2/")).sort(), [...new Set(images)].sort(),
      "The hero only transfers its two rendered image assets");
  }};
}

async function open(page, { loaded = true, interactive = true, scripts = true } = {}) {
  await page.goto(`${baseUrl}/?heroDebug=1`, { waitUntil: "domcontentloaded" });
  if (!scripts) await page.waitForLoadState("load");
  else {
    await page.waitForFunction(() => document.querySelector(".hero-experience")?.dataset.engine === "gsap-layered-v1",
      null, { timeout: 20000 });
    if (loaded) await page.waitForFunction(() => [...document.querySelectorAll(".hero-image")]
      .every(image => image.complete && image.naturalWidth > 0), null, { timeout: 20000 });
    if (interactive && loaded) await page.waitForFunction(() => document.querySelector(".hero-experience").dataset.state === "ready",
      null, { timeout: 20000 });
    if (interactive) await settled(page);
  }
  assert.equal(await page.locator(heroSelector).count(), 1, "The opening is one hero experience");
  assert.equal(await page.locator(`${heroSelector} .hero-stage`).count(), 1, "Both scenes share one stage");
  assert.equal(await page.locator(`${heroSelector} video, ${heroSelector} canvas`).count(), 0,
    "Native layered images replace the legacy sequence/video/canvas renderer");
  assert.equal(await page.locator(imageSelector).count(), 2);
  if (loaded) assert.ok(await page.locator(imageSelector).evaluateAll(elements =>
    elements.every(image => image.complete && image.naturalWidth > 0)), "Both native image assets load");
  const sources = await page.locator(imageSelector).evaluateAll(elements => elements.map(image => image.getAttribute("src")));
  assert.deepEqual(sources, images, "The hero uses the two optimized local WebPs in narrative order");
}

async function settled(page) {
  await page.evaluate(() => { window.__heroSettled = { value: "", at: performance.now() }; });
  await page.waitForFunction(() => {
    const hero = document.querySelector(".hero-experience");
    const value = [scrollY, hero.dataset.progress, ...[...hero.querySelectorAll(".hero-image, .hero-copy-content, .hero-layer--origin")]
      .map(element => { const style = getComputedStyle(element); return `${style.transform}|${style.opacity}|${style.clipPath}`; })].join("|");
    const last = window.__heroSettled;
    if (value !== last.value) { last.value = value; last.at = performance.now(); }
    return performance.now() - last.at >= 180;
  }, null, { timeout: 12000, polling: 50 });
}

async function state(page) {
  return page.locator(heroSelector).evaluate(hero => {
    const stage = hero.querySelector(".hero-stage");
    const rect = hero.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const triggers = window.ScrollTrigger?.getAll().filter(trigger => trigger.trigger === hero) || [];
    const trigger = triggers[0];
    return {
      progress: Number(hero.dataset.progress), phase: hero.dataset.phase, state: hero.dataset.state,
      top: stageRect.top, height: rect.height, stageHeight: stageRect.height, documentTop: rect.top + scrollY,
      viewportHeight: innerHeight, width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clip: getComputedStyle(hero.querySelector(".hero-layer--origin")).clipPath,
      triggerCount: triggers.length, pinIsStage: trigger?.pin === stage,
      start: trigger?.start, end: trigger?.end,
    };
  });
}

async function align(page, progress) {
  await page.locator(heroSelector).evaluate((hero, value) => {
    const trigger = window.ScrollTrigger.getAll().find(entry => entry.trigger === hero);
    if (!trigger) throw new Error("The hero ScrollTrigger has not been created");
    scrollTo({ top: trigger.start + (trigger.end - trigger.start) * value, behavior: "instant" });
  }, progress);
}

async function jump(page, progress) {
  await align(page, progress);
  await settled(page);
  const result = await state(page);
  assert.ok(Math.abs(result.progress - progress) < .015, `Native scroll reaches timeline progress ${progress}`);
  if (progress < 1) assert.ok(Math.abs(result.top) < 2, "The shared scene stays pinned at the top during its narrative");
  assert.equal(result.scrollWidth, result.width, "The opening has no horizontal overflow");
  assert.equal(result.phase, progress < .52 ? "discover" : progress < .78 ? "reveal" : "origin", "The narrative phase follows timeline progress");
  return result;
}

async function capture(page, name) {
  await page.screenshot({ path: path.join(output, `${name}.png`) });
  const viewport = page.viewportSize();
  // Native compositor pixels establish that the mask changes what the visitor
  // actually sees. Text, HUD and cursor are excluded from this image crop.
  const buffer = await page.screenshot({
    type: "png", animations: "disabled",
    clip: { x: Math.floor(viewport.width * .48), y: Math.floor(viewport.height * .20),
      width: Math.floor(viewport.width * .50), height: Math.floor(viewport.height * .65) },
    // Hiding these layers preserves layout and prevents moving text-mask
    // rectangles from manufacturing pixel changes unrelated to the artwork.
    style: ".hero-copy, .hero-progress, .hero-debug, .hero-cursor { visibility: hidden !important; }",
  });
  await writeFile(path.join(output, `${name}-image-crop.png`), buffer);
  assert.ok(buffer.length > 3000, "The visible stage contains detailed image pixels");
  return createHash("sha256").update(buffer).digest("hex");
}

function revealEdge(clip) {
  assert.match(clip, /^polygon\(/, "The second image uses a polygon mask rather than a plain fade");
  const coordinates = clip.slice(clip.indexOf("(") + 1, -1).split(",").map(point => point.trim().split(/\s+/).map(parseFloat));
  assert.equal(coordinates.length, 4, "The editorial curtain has four polygon corners");
  return [coordinates[0][1], coordinates[1][1]];
}

async function accessibleCopy(page, selector) {
  const result = await page.locator(selector).evaluate(element => {
    const content = element.querySelector(".hero-copy-content") || element;
    return { hidden: element.getAttribute("aria-hidden"), inert: element.inert,
      opacity: Number(getComputedStyle(element).opacity) * Number(getComputedStyle(content).opacity),
      actions: [...element.querySelectorAll("a, button")].map(action => {
        let opacity = 1;
        let inert = false;
        let visible = true;
        for (let node = action; node && node !== element.parentElement; node = node.parentElement) {
          const style = getComputedStyle(node);
          opacity *= Number(style.opacity);
          inert ||= node.inert;
          visible &&= style.display !== "none" && style.visibility !== "hidden";
        }
        return { text: action.textContent.trim(), opacity, inert, visible };
      }) };
  });
  assert.notEqual(result.hidden, "true", "Readable narrative copy remains exposed to assistive technology");
  assert.equal(result.inert, false, "Readable narrative actions can receive keyboard focus");
  assert.ok(result.opacity > .8, `Narrative copy has legible opacity (${JSON.stringify(result)})`);
  assert.ok(result.actions.every(action => action.visible && !action.inert && action.opacity > .35),
    `Readable narrative CTAs are visible through their own action-wrapper opacity (${JSON.stringify(result.actions)})`);
}

async function idle(page, label) {
  await settled(page);
  await page.waitForTimeout(200);
  const before = await page.locator(heroSelector).getAttribute("data-raf-count");
  assert.ok(before !== null && Number.isFinite(Number(before)), "Debug mode exposes the hero's own RAF counter");
  await page.waitForTimeout(350);
  assert.equal(await page.locator(heroSelector).getAttribute("data-raf-count"), before,
    `${label}: the hero mouse/render loop stops after input; GSAP's global ticker is independent`);
}

async function stacked(page, label) {
  const result = await state(page);
  assert.equal(result.triggerCount, 0, `${label}: no hero pin trigger remains`);
  assert.equal(await page.locator(heroSelector).evaluate(hero => Boolean(hero.closest(".pin-spacer") || hero.querySelector(".pin-spacer"))), false,
    `${label}: switching to normal flow removes the pin spacer`);
  assert.notEqual(await page.locator(".hero-stage").evaluate(element => getComputedStyle(element).position), "fixed",
    `${label}: the stage is in normal document flow`);
  const boxes = await page.locator(".hero-layer").evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, height: rect.height };
  }));
  assert.ok(boxes[0].height > 200 && boxes[1].height > 200, `${label}: both static images retain useful height`);
  assert.ok(boxes[1].top >= boxes[0].bottom - 2, `${label}: the static scenes form two natural rows`);
  await accessibleCopy(page, primaryCopy);
  await accessibleCopy(page, originCopy);
  assert.ok(await page.locator(`${originCopy} a[href="#journey"]`).isVisible(), `${label}: the entry CTA stays available`);
  assert.ok(await page.locator(".hero-cursor").evaluate(element => {
    const style = getComputedStyle(element); return style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0;
  }), `${label}: the decorative cursor is disabled`);
}

async function core(browser) {
  for (const mobile of [false, true]) {
    const session = await createPage(browser, mobile
      ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {});
    const { page, context } = session;
    try {
      await open(page);
      const initial = await jump(page, 0);
      assert.equal(initial.triggerCount, 1, "One ScrollTrigger controls the complete hero timeline");
      assert.equal(initial.pinIsStage, true, "The main timeline pins the shared stage");
      assert.ok(initial.end > initial.start + initial.viewportHeight, "The scroll narrative has a useful pinned range");
      const overlap = await page.locator(".hero-layer").evaluateAll(elements => elements.map(element => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height, position: getComputedStyle(element).position };
      }));
      assert.ok(overlap.every(layer => layer.position === "absolute"), "Both active image scenes are absolute layers in the same stage");
      assert.deepEqual(overlap[0], overlap[1], "The image layers occupy the same viewport instead of separate sections");
      assert.ok(revealEdge(initial.clip).every(value => value >= 90), "The origin curtain begins below the visible viewport");
      assert.equal(await page.locator(".editorial-nav").evaluate(element => element.classList.contains("is-hero-clear")), true,
        "The opening header starts with its light transparent surface");
      const prefix = mobile ? "mobile" : "desktop";
      const rendered = [];
      for (const progress of checkpoints) {
        const result = await jump(page, progress);
        assert.ok(Math.abs(result.documentTop - initial.documentTop) < 2,
          "Header surface changes preserve the hero document origin without layout jumps");
        rendered.push(await capture(page, `${prefix}-${String(progress).replace(".", "-")}`));
        if (progress === .3) await accessibleCopy(page, primaryCopy);
        if (progress === .3) assert.equal(await page.locator(".editorial-nav").evaluate(element => element.classList.contains("is-hero-solid")), true,
          "The preserved header gains its solid surface after the initial scene");
        if (progress >= .96) await accessibleCopy(page, originCopy);
        if (progress === .96) await visibleMural(page, `${prefix} core origin`);
        if (progress === .65) assert.ok(revealEdge(result.clip).every(value => value > 1 && value < 99),
          "The middle of the reveal shows a real partial diagonal curtain");
        if (progress === .65) assert.ok(await page.locator(".hero-copy").evaluateAll(elements =>
          elements.every(element => element.inert && element.getAttribute("aria-hidden") === "true")),
        "Invisible copy and its actions cannot receive focus during the image-only reveal");
        if (progress >= .8) assert.ok(revealEdge(result.clip).every(value => Math.abs(value) < .1),
          "The origin image is fully unmasked after the reveal range");
      }
      assert.ok(new Set(rendered).size >= 4, "Visible pixels change across camera movement, partial curtain and origin scene");
      assert.notEqual(rendered[1], rendered[3], "The partial curtain changes the visible composition");
      assert.notEqual(rendered[3], rendered[5], "The completed curtain presents the origin artwork");
      assert.notEqual(rendered[0], rendered.at(-1), "The two image scenes are visibly distinct");
      for (const progress of [...checkpoints].reverse().slice(1)) await jump(page, progress);
      assert.equal(await capture(page, `${prefix}-reverse-opening`), rendered[0], "Reverse scrolling restores the actual opening pixels");
      await jump(page, .3);
      const discover = page.locator(`${primaryCopy} a`).first();
      await discover.focus();
      await page.keyboard.press("Enter");
      await settled(page);
      assert.ok((await state(page)).progress >= .88, "Keyboard Discover advances to the origin scene");
      await jump(page, .96);
      await accessibleCopy(page, originCopy);
      await containedCopy(page, "Origin scene");
      if (mobile) {
        const crop = await page.locator(".hero-layer--origin .hero-image").evaluate(image => {
          const style = getComputedStyle(image); return { fit: style.objectFit, position: style.objectPosition };
        });
        assert.equal(crop.fit, "cover", "Mobile fills its origin image region without letterboxing");
        assert.ok(parseFloat(crop.position) > 65, "Mobile directs the origin crop toward the mural on the right");
      }
      const enter = page.locator(`${originCopy} a[href="#journey"]`);
      await enter.focus();
      await page.keyboard.press("Enter");
      await page.waitForFunction(() => document.querySelector("#journey").getBoundingClientRect().top < 140,
        null, { timeout: 15000 });
      assert.equal(await page.evaluate(() => app.currentScreen), "home", "The entry CTA reaches the existing home content");
      assert.ok(await page.locator(".hero-stage").evaluate(element => element.getBoundingClientRect().top < -100),
        "The stage releases naturally into the remaining home page");
      await page.locator('.learning-row[data-screen="katakana"]').click();
      assert.equal(await page.evaluate(() => app.currentScreen), "katakana", "Learning navigation remains intact after the hero");
      await page.locator(".ed-brand").click();
      await settled(page);
      assert.equal(await page.evaluate(() => document.activeElement.id), "home-title",
        "Returning from a learning screen restores focus to the formerly inert opening heading");
      await session.check();
      console.log(`PASS layered hero core: ${prefix}; one pinned stage, polygon reveal pixels, reversal and keyboard CTAs`);
    } finally { await context.close(); }
  }
}

async function transforms(page, selector) {
  return page.locator(selector).evaluateAll(elements => elements.map(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: matrix.m41, y: matrix.m42, scale: Math.hypot(matrix.m11, matrix.m12) };
  }));
}

async function containedCopy(page, label) {
  const geometry = await page.locator(originCopy).evaluate(element => {
    const stage = element.closest(".hero-stage").getBoundingClientRect();
    const nav = document.querySelector(".editorial-nav").getBoundingClientRect();
    const elements = [...element.querySelectorAll(".hero-copy-content > *, a")].filter(node => {
      const style = getComputedStyle(node); return style.display !== "none" && style.visibility !== "hidden";
    });
    return elements.map(node => {
      const rect = node.getBoundingClientRect();
      return { text: node.textContent.trim().slice(0, 60), left: rect.left, right: rect.right,
        top: rect.top, bottom: rect.bottom, stageLeft: stage.left, stageRight: stage.right,
        stageBottom: stage.bottom, navBottom: nav.bottom };
    });
  });
  assert.ok(geometry.every(rect => rect.left >= rect.stageLeft - 1 && rect.right <= rect.stageRight + 1 &&
    rect.top >= rect.navBottom - 1 && rect.bottom <= rect.stageBottom + 1),
  `${label}: origin text and actions fit the stage without navbar or viewport collisions (${JSON.stringify(geometry)})`);
}

async function muralGeometry(page) {
  return page.locator(".hero-layer--origin .hero-image").evaluate((image, artwork) => {
    const rect = element => {
      const value = element.getBoundingClientRect();
      return { left: value.left, right: value.right, top: value.top, bottom: value.bottom };
    };
    const style = getComputedStyle(image);
    const frame = rect(image);
    const layer = rect(image.closest(".hero-layer"));
    const stage = rect(image.closest(".hero-stage"));
    const nav = rect(document.querySelector(".editorial-nav"));
    const width = image.clientWidth;
    const height = image.clientHeight;
    const position = style.objectPosition.split(/\s+/).map(value => {
      if (!/^[-\d.]+%$/.test(value)) throw new Error(`Unsupported artwork object-position: ${style.objectPosition}`);
      return parseFloat(value) / 100;
    });
    if (position.length !== 2) throw new Error(`Expected two artwork position coordinates: ${style.objectPosition}`);
    // object-fit crops the source inside its element before CSS transforms are
    // applied. The final BCR/client-size ratios include the image's scale and
    // transformed ancestors; there are no rotations in this visual timeline.
    const fit = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const offsetX = (width - image.naturalWidth * fit) * position[0];
    const offsetY = (height - image.naturalHeight * fit) * position[1];
    const scaleX = (frame.right - frame.left) / width;
    const scaleY = (frame.bottom - frame.top) / height;
    const projectX = value => frame.left + (offsetX + value / artwork.width * image.naturalWidth * fit) * scaleX;
    const projectY = value => frame.top + (offsetY + value / artwork.height * image.naturalHeight * fit) * scaleY;
    const visible = {
      left: Math.max(0, frame.left, layer.left, stage.left),
      right: Math.min(innerWidth, frame.right, layer.right, stage.right),
      top: Math.max(nav.bottom, frame.top, layer.top, stage.top),
      bottom: Math.min(innerHeight, frame.bottom, layer.bottom, stage.bottom),
    };
    const copies = [...document.querySelectorAll(".hero-copy--origin .hero-copy-content > *")]
      .filter(element => {
        let opacity = 1;
        for (let node = element; node && node !== image.closest(".hero-stage"); node = node.parentElement) {
          const current = getComputedStyle(node);
          if (current.display === "none" || current.visibility === "hidden") return false;
          opacity *= Number(current.opacity);
        }
        return opacity > .45;
      }).map(element => ({ text: element.textContent.trim().slice(0, 65), ...rect(element) }));
    return { fit: style.objectFit, position: style.objectPosition, naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight, frame, layer, stage, nav, visible, copies,
      regions: artwork.regions.map(region => ({ name: region.name, left: projectX(region.left),
        right: projectX(region.right), top: projectY(region.top), bottom: projectY(region.bottom) })) };
  }, muralArtwork);
}

async function visibleMural(page, label, geometry = null) {
  const result = geometry || await muralGeometry(page);
  assert.equal(result.fit, "cover", `${label}: the artwork uses its intended cover crop`);
  assert.ok(Math.abs(result.naturalWidth / result.naturalHeight - muralArtwork.width / muralArtwork.height) < .002,
    `${label}: the source artwork aspect ratio matches the measured brand regions`);
  const epsilon = 1;
  for (const region of result.regions) {
    assert.ok(region.left >= result.visible.left - epsilon && region.right <= result.visible.right + epsilon &&
      region.top >= result.visible.top - epsilon && region.bottom <= result.visible.bottom + epsilon,
    `${label}: ${region.name} remains fully visible inside the image, stage and viewport, below navigation (${JSON.stringify(result)})`);
    for (const copy of result.copies) {
      const overlap = Math.min(region.right, copy.right) - Math.max(region.left, copy.left) > epsilon &&
        Math.min(region.bottom, copy.bottom) - Math.max(region.top, copy.top) > epsilon;
      assert.equal(overlap, false,
        `${label}: ${region.name} does not collide with narrative copy (${JSON.stringify({ region, copy })})`);
    }
  }
  return result;
}

async function mural(browser) {
  for (const viewport of [
    { width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 },
    { width: 1024, height: 1366 }, { width: 844, height: 390 },
    { width: 1366, height: 650 }, { width: 1920, height: 768 },
  ]) {
    const session = await createPage(browser, { viewport,
      ...(viewport.width <= 700 ? { isMobile: true, hasTouch: true } : {}) });
    try {
      await open(session.page);
      for (const progress of [.90, .98]) {
        await jump(session.page, progress);
        const label = `mural-${viewport.width}x${viewport.height}-${Math.round(progress * 100)}`;
        const geometry = await muralGeometry(session.page);
        // Save the actual rendered image and its source-to-viewport projection
        // before asserting, so a crop failure remains visually reviewable.
        await capture(session.page, label);
        await writeFile(path.join(output, `${label}-geometry.json`), JSON.stringify(geometry, null, 2));
        await visibleMural(session.page, label, geometry);
        await containedCopy(session.page, label);
        await accessibleCopy(session.page, originCopy);
      }
      await session.check();
      console.log(`PASS mural framing ${viewport.width}x${viewport.height}: complete lettering and circle, no navbar/copy collisions at 90% and 98%`);
    } finally { await session.context.close(); }
  }
}

async function input(browser) {
  const session = await createPage(browser);
  const { page } = session;
  try {
    await open(page);
    await jump(page, .1);
    await page.mouse.move(683, 384);
    await settled(page);
    const first = await capture(page, "wheel-before");
    let previous = (await state(page)).progress;
    for (let step = 0; step < 8; step++) {
      await page.mouse.wheel(0, 65);
      await page.waitForTimeout(70);
      const current = (await state(page)).progress;
      assert.ok(current >= previous - .002, "Slow wheel input does not reverse the forward timeline");
      previous = current;
    }
    await settled(page);
    assert.notEqual(await capture(page, "wheel-slow"), first, "Wheel input changes the rendered artwork");
    await page.mouse.wheel(0, 1300);
    await settled(page);
    const forward = (await state(page)).progress;
    assert.ok(forward > previous, "Coarse wheel input advances the scene reveal");
    await page.mouse.wheel(0, -1300);
    await settled(page);
    assert.ok((await state(page)).progress < forward, "Coarse reverse wheel goes back through the reveal");
    const trackpadStart = (await state(page)).progress;
    for (let step = 0; step < 24; step++) { await page.mouse.wheel(0, 9); await page.waitForTimeout(12); }
    await settled(page);
    assert.ok((await state(page)).progress > trackpadStart, "Fine trackpad-style deltas advance the same native timeline");
    await jump(page, .15);
    await page.evaluate(() => document.activeElement?.blur());
    await page.keyboard.press("PageDown");
    await settled(page);
    assert.ok((await state(page)).progress > .15, "Native PageDown controls the same pinned sequence");

    // Hover checks need a fully available CTA; the opening action is still
    // intentionally inert while its entrance fade runs around progress .20.
    for (const progress of [.3, .94]) {
      await jump(page, progress);
      await page.mouse.move(683, 384);
      await settled(page);
      const images = await transforms(page, imageSelector);
      const copies = await transforms(page, ".hero-copy-content");
      const lightPseudo = progress < .78 ? "::before" : "::after";
      const lightBefore = await page.locator(".hero-light").evaluate((element, pseudo) => getComputedStyle(element, pseudo).backgroundImage, lightPseudo);
      // Dispatch and inspect in one browser task, so a slow test runner cannot
      // accidentally sample after the complete easing tail has already ended.
      const early = await page.locator(".hero-stage").evaluate(stage => {
        stage.dispatchEvent(new PointerEvent("pointermove", { pointerType: "mouse", clientX: 1300, clientY: 700, bubbles: true }));
        return [...stage.querySelectorAll(".hero-image")].map(image => {
          const matrix = new DOMMatrixReadOnly(getComputedStyle(image).transform);
          return { x: matrix.m41, y: matrix.m42 };
        });
      });
      await page.mouse.move(1300, 700);
      await settled(page);
      const moved = await transforms(page, imageSelector);
      const movedCopy = await transforms(page, ".hero-copy-content");
      const active = progress < .52 ? 0 : 1;
      const dx = moved[active].x - images[active].x;
      const dy = moved[active].y - images[active].y;
      assert.ok(Math.abs(dx) > .5 && Math.abs(dy) > .3, "The active image has perceptible mouse depth");
      assert.ok(Math.abs(early[active].x - images[active].x) < Math.abs(dx) - .05, "Mouse movement eases toward the target rather than snapping");
      assert.ok(Math.abs(dx) <= 12.2 && Math.abs(dy) <= 8.2, "Image parallax stays within the subtle depth budget");
      assert.ok((movedCopy[active].x - copies[active].x) * dx < 0, "Headline micro movement opposes the image depth");
      assert.ok(Math.abs(movedCopy[active].x - copies[active].x) <= 3.2 && Math.abs(movedCopy[active].y - copies[active].y) <= 2.2,
        "Text movement remains within its readable 3px/2px budget");
      assert.notEqual(await page.locator(".hero-light").evaluate((element, pseudo) => getComputedStyle(element, pseudo).backgroundImage, lightPseudo), lightBefore,
        "The subtle radial light follows the pointer");
      assert.notEqual(await page.locator(".hero-stage").evaluate(element => getComputedStyle(element).cursor), "none",
        "The browser's normal pointer remains available");
      assert.ok(await page.locator(".hero-cursor").isVisible(), "The optional editorial cursor is available on desktop");
      const cta = page.locator(`${active ? originCopy : primaryCopy} a`).first();
      await cta.hover();
      await settled(page);
      assert.ok((await transforms(page, ".hero-cursor"))[0].scale > 2, "Hovering an action expands the editorial cursor toward 2.5x");
      await page.mouse.move(20, 20);
      await settled(page);
      const reset = await transforms(page, imageSelector);
      assert.ok(Math.abs(reset[active].x - images[active].x) < .2 && Math.abs(reset[active].y - images[active].y) < .2,
        "Leaving the scene smoothly returns image depth to its neutral position");
    }
    await idle(page, "Desktop input ended");
    await session.check();
    console.log("PASS hero inputs: wheel/trackpad/PageDown, opposed mouse depth, light, optional cursor, hover and hero-only idle RAF");
  } finally { await session.context.close(); }

  const mobile = await createPage(browser, { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    await open(mobile.page);
    await jump(mobile.page, .2);
    const before = (await state(mobile.page)).progress;
    const cdp = await mobile.context.newCDPSession(mobile.page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 250, y: 650 }] });
    for (const y of [570, 490, 410, 330, 250]) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 250, y }] });
      await mobile.page.waitForTimeout(50);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await settled(mobile.page);
    assert.ok((await state(mobile.page)).progress > before, "A real mobile touch gesture advances the layered timeline");
    const baseline = await transforms(mobile.page, imageSelector);
    await mobile.page.locator(".hero-stage").dispatchEvent("pointermove", { pointerType: "mouse", clientX: 370, clientY: 750 });
    await settled(mobile.page);
    assert.deepEqual(await transforms(mobile.page, imageSelector), baseline, "Mobile ignores desktop pointer depth");
    for (const viewport of [{ width: 360, height: 800 }, { width: 430, height: 932 }, { width: 1024, height: 768 }]) {
      await mobile.page.setViewportSize(viewport);
      await settled(mobile.page);
      await jump(mobile.page, .96);
      await accessibleCopy(mobile.page, originCopy);
      await containedCopy(mobile.page, `Resize ${viewport.width}`);
      assert.equal(await mobile.page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), true,
        "Resize preserves the complete viewport width without overflow");
      await capture(mobile.page, `resize-${viewport.width}-origin`);
    }
    await idle(mobile.page, "Mobile gesture ended");
    await mobile.check();
    console.log("PASS hero mobile: touch, no pointer depth, resize and readable final composition");
  } finally { await mobile.context.close(); }
}

async function lifecycle(browser) {
  const session = await createPage(browser);
  try {
    const { page } = session;
    await open(page);
    await jump(page, .2);
    await page.mouse.move(1200, 650);
    await page.evaluate(() => app.navigateTo("kanji"));
    await page.waitForTimeout(180);
    const hiddenHomeCount = await page.locator(heroSelector).getAttribute("data-raf-count");
    await page.locator(".hero-stage").dispatchEvent("pointermove", { pointerType: "mouse", clientX: 100, clientY: 200 });
    await page.waitForTimeout(300);
    assert.equal(await page.locator(heroSelector).getAttribute("data-raf-count"), hiddenHomeCount, "Inactive home pauses the hero render loop");
    await page.evaluate(() => app.navigateTo("home"));
    await settled(page);
    await jump(page, .2);
    await page.evaluate(() => {
      window.__heroSimulatedHidden = true;
      Object.defineProperty(document, "hidden", { configurable: true, get: () => window.__heroSimulatedHidden });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.waitForTimeout(150);
    const hiddenCount = await page.locator(heroSelector).getAttribute("data-raf-count");
    await page.locator(".hero-stage").dispatchEvent("pointermove", { pointerType: "mouse", clientX: 1250, clientY: 600 });
    await page.waitForTimeout(250);
    assert.equal(await page.locator(heroSelector).getAttribute("data-raf-count"), hiddenCount, "Explicitly simulated document.hidden pauses the hero loop");
    await page.evaluate(() => { window.__heroSimulatedHidden = false; document.dispatchEvent(new Event("visibilitychange")); });
    await settled(page);
    await jump(page, .65);
    await session.check();
    console.log("PASS hero lifecycle: home navigation, simulated hidden/visible state and resume");
  } finally { await session.context.close(); }
}

async function recovery(browser) {
  for (const mobile of [false, true]) {
    const session = await createPage(browser, { reducedMotion: "reduce",
      ...(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : {}) });
    try {
      await open(session.page, { interactive: false });
      await session.page.waitForFunction(() => document.querySelector(".hero-experience").dataset.state === "reduced-motion");
      await stacked(session.page, "Reduced motion");
      await capture(session.page, `reduced-${mobile ? "mobile" : "desktop"}`);
      await session.page.emulateMedia({ reducedMotion: "no-preference" });
      await session.page.waitForFunction(() => document.querySelector(".hero-experience").dataset.state === "ready");
      await jump(session.page, .65);
      await session.page.emulateMedia({ reducedMotion: "reduce" });
      await session.page.waitForFunction(() => document.querySelector(".hero-experience").dataset.state === "reduced-motion");
      await stacked(session.page, "Live reduced-motion toggle");
      await session.check();
      console.log(`PASS reduced motion ${mobile ? "mobile" : "desktop"}: natural flow, no pin spacer and live toggle`);
    } finally { await session.context.close(); }
  }

  const noJS = await createPage(browser, { javaScriptEnabled: false });
  try {
    await open(noJS.page, { scripts: false, interactive: false });
    await stacked(noJS.page, "JavaScript unavailable");
    await capture(noJS.page, "no-javascript");
    await noJS.page.locator(`${originCopy} a[href="#journey"]`).click();
    await noJS.page.waitForURL(/#journey$/);
    await noJS.check();
    console.log("PASS no JavaScript: readable static scenes and native entry CTA");
  } finally { await noJS.context.close(); }

  const delayed = await createPage(browser);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  await delayed.page.route(originImageRoute, async route => { await gate; await route.continue(); });
  try {
    await open(delayed.page, { loaded: false, interactive: false });
    await delayed.page.waitForFunction(() => document.querySelector(".hero-layer--japan .hero-image").naturalWidth > 0);
    assert.equal((await state(delayed.page)).state, "loading", "A delayed origin image has an explicit loading state");
    await accessibleCopy(delayed.page, primaryCopy);
    await capture(delayed.page, "origin-image-loading");
    release();
    await delayed.page.waitForFunction(() => document.querySelector(".hero-experience").dataset.state === "ready", null, { timeout: 20000 });
    await jump(delayed.page, .96);
    await accessibleCopy(delayed.page, originCopy);
    await capture(delayed.page, "delayed-origin-recovered");
    await delayed.check();
    console.log("PASS delayed image: explicit loading and recovery into the pinned origin scene");
  } finally { release(); await delayed.context.close(); }

  for (const [label, routePattern, survivor] of [
    ["japan", primaryImageRoute, ".hero-layer--origin .hero-image"],
    ["origin", originImageRoute, ".hero-layer--japan .hero-image"],
  ]) {
    const failed = await createPage(browser, {}, { expectedImageError: routePattern });
    let blocked = 0;
    await failed.page.route(routePattern, route => {
      blocked++;
      return route.fulfill({ status: 503, body: `Unavailable ${label} image` });
    });
    try {
      await open(failed.page, { loaded: false, interactive: false });
      await failed.page.waitForFunction(() => document.querySelector(".hero-experience").dataset.state === "fallback");
      await stacked(failed.page, `${label} media 503`);
      await failed.page.waitForFunction(selector => document.querySelector(selector).naturalWidth > 0, survivor);
      assert.ok(blocked > 0, `The ${label} media failure fixture intercepts the actual artwork request`);
      await failed.page.screenshot({ path: path.join(output, `media-${label}-fallback.png`) });
      await failed.page.locator(`${originCopy} a[href="#journey"]`).click();
      await failed.page.waitForFunction(() => document.querySelector("#journey").getBoundingClientRect().top < 140);
      await failed.check();
      console.log(`PASS ${label} media failure: preserves the surviving image, static readable copy and accessible entry CTA`);
    } finally { await failed.context.close(); }
  }

  for (const dependency of ["gsap", "ScrollTrigger"]) {
    const unavailable = await createPage(browser, {}, { expectedGsapError: true });
    let blocked = 0;
    const routePattern = dependency === "gsap" ? /\/gsap[^/]*\.js(?:\?|$)/ : /\/ScrollTrigger[^/]*\.js(?:\?|$)/;
    await unavailable.page.route(routePattern, route => {
      blocked++;
      return route.fulfill({ status: 503, body: `Unavailable ${dependency}` });
    });
    try {
      await open(unavailable.page, { interactive: false });
      await unavailable.page.waitForFunction(() => ["static", "fallback"].includes(document.querySelector(".hero-experience").dataset.state));
      assert.ok(blocked > 0, `The ${dependency} failure fixture intercepts the actual dependency request`);
      await stacked(unavailable.page, `${dependency} unavailable`);
      await unavailable.check();
      console.log(`PASS ${dependency} unavailable: readable native fallback without a retained pin`);
    } finally { await unavailable.context.close(); }
  }

  const helper = await createPage(browser, {}, { expectedHelperError: true });
  await helper.page.route("**/js/home.js*", route => route.fulfill({ contentType: "application/javascript", body: 'throw new Error("Simulated home helper failure");' }));
  try {
    await open(helper.page);
    await jump(helper.page, .65);
    await helper.check();
    console.log("PASS hero initialization is independent of the home helper");
  } finally { await helper.context.close(); }
  await lifecycle(browser);
}

(async () => {
  assert.ok(["all", "core", "mural", "input", "recovery"].includes(mode), `Unknown mode: ${mode}`);
  await mkdir(output, { recursive: true });
  const browser = await chromium.launch(launchOptions());
  try {
    if (mode === "all" || mode === "core") await core(browser);
    if (mode === "all" || mode === "mural") await mural(browser);
    if (mode === "all" || mode === "input") await input(browser);
    if (mode === "all" || mode === "recovery") await recovery(browser);
    console.log(`PASS GSAP layered hero ${mode}; screenshots ${output}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
