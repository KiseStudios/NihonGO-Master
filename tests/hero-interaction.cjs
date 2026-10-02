const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { mkdir } = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");
const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";
const output = process.env.HERO_SCREENSHOTS || path.join(os.tmpdir(), "nihongo-hero-validation");

async function settle(page) {
  await page.waitForFunction(() => !document.querySelector("#reading-story").classList.contains("is-pointer-moving"));
}
async function scrollToHero(page) {
  await page.locator("#reading-story").evaluate((el) => {
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: "instant" });
  });
  await page.waitForTimeout(400); // Existing navigation height transition.
}
async function transforms(page) {
  return page.locator("#reading-story [data-depth-x]").evaluateAll((els) =>
    els.map((el) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return { x: matrix.m41, y: matrix.m42 };
    }),
  );
}
async function geometry(page) {
  return page.evaluate(() => {
    const hero = document.querySelector("#reading-story");
    const rect = hero.getBoundingClientRect();
    const title = hero.querySelector("h2").getBoundingClientRect();
    const glyphs = [...hero.querySelectorAll(".hero-kanji")].map((el) => el.getBoundingClientRect());
    return {
      width: innerWidth,
      height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      heroHeight: rect.height,
      boundaryGap: hero.nextElementSibling.getBoundingClientRect().top - rect.bottom,
      contained: glyphs.every((r) => r.left >= rect.left && r.right <= rect.right && r.top >= rect.top && r.bottom <= rect.bottom),
      titleClear: glyphs.every((r) => r.right <= title.left || r.left >= title.right || r.bottom <= title.top || r.top >= title.bottom),
      contentContained: [...hero.querySelectorAll(".story-note, .story-aside, .story-bottom")].every((el) => {
        const r = el.getBoundingClientRect();
        return r.left >= rect.left && r.right <= rect.right && r.top >= rect.top && r.bottom <= rect.bottom;
      }),
    };
  });
}
(async () => {
  const browser = await chromium.launch();
  try {
    await mkdir(output, { recursive: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseUrl);
    // Avoid smooth anchor scrolling while Playwright aligns element screenshots.
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1400);
    // Fully revealed before visiting the dark section, without mouse or scroll.
    const entry = await page.locator(".story-enter").evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
    assert.ok(entry.every((opacity) => opacity === "1"));
    assert.deepEqual(await transforms(page), Array(5).fill({ x: 0, y: 0 }));
    assert.equal(await page.locator("#reading-story").evaluate((el) => el.previousElementSibling.id), "journey");
    assert.equal(await page.locator(".story-stage").evaluate((el) => getComputedStyle(el).position), "relative");

    for (const [width, height] of [[1920,1080], [1440,900], [1366,768], [1024,768], [390,844]]) {
      await page.setViewportSize({ width, height });
      await page.mouse.move(0, 0);
      await scrollToHero(page);
      await settle(page);
      const result = await geometry(page);
      assert.equal(result.scrollWidth, width, "No horizontal overflow");
      assert.ok(Math.abs(result.heroHeight - height) < 1, "Hero occupies one viewport");
      assert.ok(Math.abs(result.boundaryGap) < 1, "Clean dark/light boundary");
      assert.ok(result.contained && result.titleClear && result.contentContained, "Glyphs and text are contained and do not overlap");
      await page.locator("#reading-story").screenshot({ path: path.join(output, `hero-${width}x${height}.png`) });
      if (width > 700) {
        const rect = await page.locator("#reading-story").boundingBox();
        const x = width * 0.9;
        const y = rect.y + rect.height * 0.3;
        await page.mouse.move(x, y);
        // A new target must be interpolated, rather than applied immediately.
        const early = (await transforms(page))[1];
        const intensity = width <= 1100 ? 0.6 : 1;
        const expectedX = -20 * 0.8 * intensity;
        assert.ok(Math.abs(early.x) < Math.abs(expectedX) - 0.1, "Interpolated entry");
        await settle(page);
        const moved = await transforms(page);
        assert.ok(Math.abs(moved[1].x - expectedX) < 0.05, "Opposite primary motion, with tablet reduction");
        assert.ok(moved[0].x > 0 && moved[2].x > 0 && moved[4].x < 0, "Independent layer directions");
        await page.waitForTimeout(250);
        assert.deepEqual(await transforms(page), moved, "No jitter at rest");
        assert.ok((await geometry(page)).titleClear, "Moving kanji does not cover title");
        // Reverse direction rapidly; settling must still remain bounded.
        await page.mouse.move(width * 0.1, rect.y + rect.height * 0.7);
        await page.mouse.move(width * 0.85, rect.y + rect.height * 0.25);
        await page.mouse.move(0, 0);
        const returning = (await transforms(page))[1];
        assert.ok(Math.abs(returning.x) > 0.01, "Exit returns gradually");
        await settle(page);
        assert.deepEqual(await transforms(page), Array(5).fill({ x: 0, y: 0 }), "Neutral after leaving");
      }
      // Page scrolling leaves the static composition and content unchanged.
      const before = await transforms(page);
      await page.evaluate(() => window.scrollBy({ top: 220, behavior: "instant" }));
      await page.waitForTimeout(400);
      assert.deepEqual(await transforms(page), before, "Scroll does not animate the hero");
      await page.locator("#reading-story").evaluate((el) => window.scrollTo({ top: el.offsetTop + el.offsetHeight - innerHeight / 2, behavior: "instant" }));
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(output, `boundary-${width}.png`) });
      console.log("PASS viewport", result);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await scrollToHero(page);
    await page.mouse.move(1200, 400);
    await settle(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() =>
      [...document.querySelectorAll("#reading-story [data-depth-x]")].every((el) =>
        getComputedStyle(el).transform === "none" && el.style.transform === ""),
    );
    await page.mouse.move(200, 600);
    assert.deepEqual(await transforms(page), Array(5).fill({ x: 0, y: 0 }), "Reduced motion clears active transforms");
    assert.ok(await page.locator(".story-enter").evaluateAll((els) => els.every((el) => getComputedStyle(el).animationName === "none")));
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.mouse.move(1100, 500);
    await settle(page);
    await page.evaluate(() => app.navigateTo("kanji"));
    await page.evaluate(() => app.navigateTo("home"));
    assert.deepEqual(await transforms(page), Array(5).fill({ x: 0, y: 0 }), "No stale motion after navigation");

    for (const viewport of [{ width: 390, height: 844 }, { width: 1024, height: 768 }]) {
      const context = await browser.newContext({ viewport, hasTouch: true, isMobile: true });
      const touch = await context.newPage();
      await touch.goto(baseUrl);
      await scrollToHero(touch);
      await touch.locator("#reading-story").dispatchEvent("pointermove", { pointerType: "touch", clientX: 250, clientY: 400 });
      // Even a synthetic mouse event must be ignored on a coarse-pointer device.
      await touch.mouse.move(300, 450);
      assert.deepEqual(await transforms(touch), Array(5).fill({ x: 0, y: 0 }));
      await touch.locator("#reading-story .ed-text-link").tap();
      assert.equal(await touch.evaluate(() => app.currentScreen), "kanji");
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: entry, pointer interpolation, tablet intensity, rest, exit, scroll independence, touch, reduced motion, navigation. Screenshots: ${output}`);
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
