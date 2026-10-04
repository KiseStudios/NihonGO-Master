const { chromium } = require("playwright");
const assert = require("node:assert/strict");

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";

async function exerciseRecovery(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  let firstFrameFetches = 0;
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("**/optimized/*/frame_001.webp", (route) => {
    // Keep the poster available while the animation's first fetch fails.
    if (route.request().resourceType() !== "fetch") return route.continue();
    firstFrameFetches++;
    return firstFrameFetches === 1
      ? route.fulfill({ status: 503, body: "Temporary frame outage" })
      : route.continue();
  });
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => {
      const hero = document.querySelector(".scroll-hero");
      return hero?.classList.contains("is-enhanced") && hero.dataset.frame === "1";
    }, null, { timeout: 10000 });
    assert.ok(firstFrameFetches > 1, "A transient first-frame failure recovers without reloading");
    await page.mouse.move(800, 400);
    await page.mouse.wheel(0, 850);
    await page.waitForFunction(() => {
      const hero = document.querySelector(".scroll-hero");
      return Number(hero.dataset.progress) > 0.1 && Number(hero.dataset.frame) > 20;
    }, null, { timeout: 10000 });
    assert.equal(await page.locator(".scroll-hero").evaluate((hero) => hero.classList.contains("is-static")), false);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "1");
    assert.deepEqual(errors, [], "Recovery and forward/reverse scrolling have no JavaScript errors");
  } finally {
    await page.close();
  }
}

async function exerciseAutomaticScroll(browser, viewport, reducedMotion) {
  const page = await browser.newPage({ viewport, reducedMotion });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  const pixels = () => page.locator("#heroSequenceCanvas").evaluate((source) => {
    const sample = document.createElement("canvas");
    sample.width = 32;
    sample.height = 24;
    const context = sample.getContext("2d");
    context.drawImage(source, 0, 0, 32, 24);
    return Array.from(context.getImageData(0, 0, 32, 24).data);
  });
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "1");
    const hero = page.locator(".scroll-hero");
    assert.equal(await hero.getAttribute("data-engine"), "scroll-v6");
    assert.equal(await page.getByRole("button", { name: "Ativar animação" }).count(), 0);
    assert.equal(await page.locator(".hero-sequence-progress").isVisible(), true);
    assert.equal(await page.locator(".scroll-hero-sticky").evaluate((el) => getComputedStyle(el).position), "sticky");
    const firstPixels = await pixels();
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.wheel(0, 850);
    await page.waitForFunction(() => {
      const hero = document.querySelector(".scroll-hero");
      return Number(hero.dataset.progress) > 0.1 && Number(hero.dataset.frame) > 20 && hero.dataset.frame === hero.dataset.targetFrame;
    }, null, { timeout: 10000 });
    assert.notDeepEqual(await pixels(), firstPixels, "The rendered image changes, not only the progress label");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `/tmp/nihongo-scroll-v6-${viewport.width}-${reducedMotion}.png` });
    await page.mouse.wheel(0, -1000);
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "1");
    assert.deepEqual(await pixels(), firstPixels, "Reversing the wheel restores the opening image");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "1");
    assert.equal(await hero.evaluate((el) => el.classList.contains("is-enhanced")), true, "Reload keeps scroll active without a button");
    assert.deepEqual(errors, [], "Automatic scrolling has no JavaScript errors");
  } finally {
    await page.close();
  }
}

async function exerciseIndependentStartup(browser) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("**/js/home.js*", (route) => route.fulfill({
    contentType: "application/javascript", body: 'throw new Error("Simulated helper failure");',
  }));
  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.querySelector(".scroll-hero").dataset.frame === "1");
    await page.mouse.move(800, 400);
    await page.mouse.wheel(0, 900);
    await page.waitForFunction(() => Number(document.querySelector(".scroll-hero").dataset.frame) > 25);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await exerciseRecovery(browser);
    for (const reducedMotion of ["no-preference", "reduce"]) {
      await exerciseAutomaticScroll(browser, { width: 1366, height: 768 }, reducedMotion);
      await exerciseAutomaticScroll(browser, { width: 390, height: 844 }, reducedMotion);
    }
    await exerciseIndependentStartup(browser);
    console.log("PASS: first-frame recovery; automatic wheel scrolling with visible pixel changes and exact reverse on desktop/mobile with both motion preferences; reload; independent startup despite helper failure.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
