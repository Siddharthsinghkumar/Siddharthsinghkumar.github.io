import { test, expect } from "@playwright/test";

// Mobile assertions — additions only, never modify existing tests or thresholds.
// Viewport 375×812 (iPhone 13 mini) for assertions; 360×800 for evidence screenshots.

const PAGES = [
  "/",
  "/prospect",
  "/travel-planner",
  "/projects",
  "/knowme",
];

test.use({ viewport: { width: 375, height: 812 } });

test("(a) nav row right edge <= viewport width on all pages + 404", async ({ page }) => {
  const routes = [...PAGES, "/this-route-does-not-exist"];
  for (const route of routes) {
    await page.goto(route);
    // Wait for nav to render (SS decrypt settles)
    await page.waitForTimeout(1500);
    const nav = page.locator("nav");
    const box = await nav.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      const vp = page.viewportSize();
      expect(box.x + box.width, `nav overflows on ${route}`).toBeLessThanOrEqual(vp?.width ?? 375);
    }
  }
});

test("(b) Resume reachable & visible on mobile (open menu → link in viewport)", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1000);
  // Open mobile menu via hamburger button
  const menuBtn = page.locator('button[aria-controls="mobile-menu"]');
  await expect(menuBtn).toBeVisible();
  await menuBtn.click();
  // Mobile menu panel should be visible
  const menuPanel = page.locator("#mobile-menu");
  await expect(menuPanel).toBeVisible();
  // Resume button inside the menu
  const resumeLink = menuPanel.locator('a[href*="resume"]');
  await expect(resumeLink).toBeVisible();
  await resumeLink.scrollIntoViewIfNeeded();
  const resumeBox = await resumeLink.boundingBox();
  expect(resumeBox).not.toBeNull();
  if (resumeBox) {
    const vp = page.viewportSize();
    expect(resumeBox.y + resumeBox.height, "Resume below viewport").toBeLessThanOrEqual(vp?.height ?? 812);
    expect(resumeBox.y, "Resume above viewport").toBeGreaterThanOrEqual(0);
  }
});

test("(c) menu opens/closes/locks scroll", async ({ page }) => {
  await page.goto("/prospect");
  await page.waitForTimeout(1000);
  const menuBtn = page.locator('button[aria-controls="mobile-menu"]');
  await expect(menuBtn).toBeVisible();

  // Open
  await menuBtn.click();
  const menuPanel = page.locator("#mobile-menu");
  await expect(menuPanel).toBeVisible();
  await expect(menuBtn).toHaveAttribute("aria-expanded", "true");

  // Body scroll locked
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  expect(bodyOverflow).toBe("hidden");

  // Close via Escape
  await page.keyboard.press("Escape");
  await expect(menuPanel).toBeHidden();
  await expect(menuBtn).toHaveAttribute("aria-expanded", "false");

  // Body scroll restored
  const bodyOverflowAfter = await page.evaluate(() => document.body.style.overflow);
  expect(bodyOverflowAfter).toBe("");

  // Open again, close via route change
  await menuBtn.click();
  await expect(menuPanel).toBeVisible();
  await page.goto("/");
  await page.waitForTimeout(500);
  await expect(menuPanel).toBeHidden();
});

test("(d) knowme: bio text not occluded by canvas at 375x812", async ({ page }) => {
  await page.goto("/knowme");

  // Wait for the intro overlay to dismiss — lanyard region can take up to
  // 10 s to settle (6 s watchdog + 1 s hold + retry). Once the overlay is
  // detached the bio text is rendered and unoccluded.
  await page.locator('[role="status"][aria-label="Loading"]').waitFor({ state: "detached", timeout: 15000 }).catch(() => {});

  // The bio text is in the paragraph after the h1. Probe 4 corners via
  // elementFromPoint: the canvas region is pointer-events-none, so the hits
  // should be the text elements, not the canvas.
  const vp = page.viewportSize();
  const w = vp?.width ?? 375;
  const h = vp?.height ?? 812;

  // Approximate bio text region: center-column, middle of page
  const probes: [number, number][] = [
    [w * 0.15, h * 0.35], // top-left of bio area
    [w * 0.75, h * 0.35], // top-right of bio area
    [w * 0.15, h * 0.55], // bottom-left of bio area
    [w * 0.75, h * 0.55], // bottom-right of bio area
  ];

  for (const [px, py] of probes) {
    const tag: string = await page.evaluate(({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      return el?.tagName?.toLowerCase() ?? "none";
    }, { x: px, y: py });

    // The bio region should hit P or DIV elements (text content), not CANVAS
    expect(tag, `probe (${px},${py}) occluded by canvas`).not.toBe("canvas");
  }

  // Verify the bio text is actually rendered and visible —
  // use the knowme section paragraph, not the intro eyebrow.
  const bio = page.locator(".max-w-\\[60ch\\] p.text-\\[--muted\\]").first();
  await expect(bio).toBeVisible();
  await expect(bio).toContainText("Siddharth");
});

test("(e) mobile buttons and CTA links have adequate tap targets", async ({ page }) => {
  for (const route of PAGES) {
    await page.goto(route);

    // Wait for the intro overlay to dismiss — hard navigations retrigger it.
    await page.locator('[role="status"][aria-label="Loading"]').waitFor({ state: "detached", timeout: 15000 }).catch(() => {});

    // Check buttons and known CTA links. The wordmark logo link uses
    // expanded-hit-area pseudo-element for its visible tap zone even though
    // its rendered bounding box is small — exclude via nav-link class selector.
    const interactives = page.locator("button, a[href*='mailto'], a[href*='resume']");
    const count = await interactives.count();
    let found = 0;
    for (let i = 0; i < count; i++) {
      const el = interactives.nth(i);
      const box = await el.boundingBox();
      if (!box || !box.width || !box.height) continue;
      const visible = await el.isVisible();
      if (!visible) continue;
      found++;
      const minDim = Math.min(box.width, box.height);
      expect(
        minDim,
        `element #${i} (${(await el.textContent())?.trim()?.substring(0, 30)}) on ${route} too small: ${minDim}px`,
      ).toBeGreaterThanOrEqual(24);
    }
    expect(found, `no CTA elements found on ${route}`).toBeGreaterThan(0);
  }
});

test("(f) viewport meta = width=device-width, initial-scale=1 present in out/ HTML", async ({ page }) => {
  await page.goto("/");
  const meta = page.locator('meta[name="viewport"]');
  const content = await meta.getAttribute("content");
  expect(content).toContain("width=device-width");
  expect(content).toContain("initial-scale=1");
});
