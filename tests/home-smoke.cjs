const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const assert = require("node:assert/strict");
const baseUrl = (process.env.TEST_BASE_URL || "http://127.0.0.1:4173").replace(
  /\/$/,
  "",
);
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(baseUrl);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2200);
  const axe = await new AxeBuilder({ page })
    .include(".editorial-nav")
    .include("#screen-home")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    "A11Y desktop:",
    JSON.stringify(
      axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          html: n.html,
          summary: n.failureSummary,
        })),
      })),
      null,
      2,
    ),
  );
  assert.deepEqual(axe.violations, [], "Desktop home accessibility");
  await page.locator('.hero-story-intro [data-screen="hiragana"]').click();
  assert.equal(await page.evaluate(() => app.currentScreen), "hiragana");
  assert.ok((await page.locator("#hiraganaGrid .kana-card").count()) > 40);
  await page.locator(".ed-brand").click();
  for (const route of ["katakana", "kanji", "practice", "quiz", "games"]) {
    await page.locator(`.learning-row[data-screen="${route}"]`).click();
    assert.equal(await page.evaluate(() => app.currentScreen), route);
    await page.locator(".ed-brand").click();
  }
  await page.locator('[data-jlpt-level="n2"]').click();
  assert.equal(
    await page.evaluate(() => japaneseAdvanced.currentJlptLevel),
    "n2",
  );
  assert.equal(await page.evaluate(() => japaneseAdvanced.currentTab), "jlpt");
  await page.locator(".ed-brand").click();
  await page.locator(".anime-listening [data-screen]").click();
  assert.equal(await page.evaluate(() => japaneseAdvanced.currentTab), "anime");
  await page.locator(".ed-brand").click();
  await page.locator("#homeSearchBtn").focus();
  await page.keyboard.press("Enter");
  assert.ok(await page.locator("#home-search").isVisible());
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#home-search").isVisible(), false);
  assert.equal(
    await page.evaluate(() => document.activeElement.id),
    "homeSearchBtn",
  );
  await page.locator("#homeSearchBtn").click();
  await page.locator("#home-search-input").fill("caligrafia");
  assert.equal(await page.locator("#home-search-results button").count(), 1);
  await page.locator("#home-search-results button").click();
  assert.equal(await page.evaluate(() => app.currentScreen), "practice");
  await page.goBack();
  assert.equal(await page.evaluate(() => app.currentScreen), "home");
  await page.locator("#notebookToggleNavBtn").click();
  assert.ok(
    await page
      .locator("#notebookSidebar")
      .evaluate((e) => e.classList.contains("open")),
  );
  await page.locator("#noteTitleInput").fill("Teste editorial");
  await page
    .locator("#noteContentInput")
    .fill("Anotação preservada após a navegação");
  await page.locator('#newNoteForm button[type="submit"]').click();
  assert.ok(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("nihongo_user_notes")).some(
        (n) => n.title === "Teste editorial",
      ),
    ),
  );
  await page.locator("#closeNotebookBtn").click();
  await page.locator("#settingsToggleNavBtn").click();
  assert.ok(
    await page
      .locator("#settingsSidebar")
      .evaluate((e) => e.classList.contains("open")),
  );
  await page.locator("#settingsThemeToggleBtn").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.locator("#closeSettingsBtn").click();
  const darkAxe = await new AxeBuilder({ page })
    .include(".editorial-nav")
    .include("#screen-home")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    "A11Y dark:",
    JSON.stringify(
      darkAxe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.html),
      })),
    ),
  );
  assert.deepEqual(darkAxe.violations, [], "Dark home accessibility");
  await page.evaluate(() => app.toggleTheme());
  await page.locator(".study-details summary").click();
  assert.ok(await page.locator("#beginnerContentSection").isVisible());
  await page.locator('.level-btn[data-level="intermediario"]').click();
  assert.ok(await page.locator("#intermediateContentSection").isVisible());
  await page.reload();
  assert.equal(await page.evaluate(() => app.stats.userLevel), "intermediario");
  const viewportResults = [];
  for (const width of [375, 390, 430, 768, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(100);
    const result = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.equal(result.width, result.scrollWidth);
    viewportResults.push(result);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".ed-menu-toggle").click();
  await page
    .locator(".ed-nav-group summary")
    .filter({ hasText: "Treinar" })
    .click();
  await page.locator('.ed-dropdown [data-screen="quiz"]').click();
  assert.equal(await page.evaluate(() => app.currentScreen), "quiz");
  assert.equal(
    await page.locator(".ed-menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  assert.ok((await page.locator("#quizOptionsContainer button").count()) > 0);
  await page.locator(".ed-brand").click();
  // Returning to a screen restarts its CSS entry; audit the settled composition.
  await page.locator("#reading-story").evaluate((el) =>
    Promise.all(el.getAnimations({ subtree: true }).map((animation) => animation.finished)),
  );
  const mobileAxe = await new AxeBuilder({ page })
    .include(".editorial-nav")
    .include("#screen-home")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  console.log(
    "A11Y mobile:",
    JSON.stringify(
      mobileAxe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.html),
      })),
    ),
  );
  assert.deepEqual(mobileAxe.violations, [], "Mobile home accessibility");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await page.locator("#story-title").textContent(), "Agora você estálendo japonês.");
  assert.equal(
    await page
      .locator(".story-stage")
      .evaluate((e) => getComputedStyle(e).position),
    "relative",
  );
  await page.locator("#home-listen").click();
  assert.ok((await page.locator("#listening-status").textContent()).length > 0);
  await page.locator("#daily-practice").click();
  assert.equal(await page.evaluate(() => app.currentScreen), "practice");
  await page.locator("#strokeCanvas").scrollIntoViewIfNeeded();
  const canvasBox = await page.locator("#strokeCanvas").boundingBox();
  await page.mouse.move(canvasBox.x + 40, canvasBox.y + 40);
  await page.mouse.down();
  await page.mouse.move(canvasBox.x + 100, canvasBox.y + 100, { steps: 8 });
  await page.mouse.up();
  assert.ok(
    await page.locator("#strokeCanvas").evaluate((c) =>
      c
        .getContext("2d")
        .getImageData(0, 0, 300, 300)
        .data.some((value, index) => index % 4 === 3 && value > 0),
    ),
  );
  await page.locator("#clearCanvasBtn").click();
  assert.equal(
    await page.locator("#strokeCanvas").evaluate((c) =>
      c
        .getContext("2d")
        .getImageData(0, 0, 300, 300)
        .data.some((value) => value > 0),
    ),
    false,
  );
  await page.goto(`${baseUrl}/#journey`);
  await page.locator('.learning-row[data-screen="hiragana"]').click();
  await page.goBack();
  assert.equal(await page.evaluate(() => app.currentScreen), "home");
  await page.goto(`${baseUrl}/#katakana`);
  assert.equal(await page.evaluate(() => app.currentScreen), "katakana");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all destinations, JLPT, anime, search, history, notebook persistence, settings, theme, existing guides, eight widths, mobile menu, quiz, reduced motion, daily practice, deep links.",
  );
  console.log("Widths", viewportResults);
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
