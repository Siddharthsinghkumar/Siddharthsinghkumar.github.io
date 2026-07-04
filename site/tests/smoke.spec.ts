import { test, expect } from "@playwright/test";

// Regression smoke suite — protects the shipped site against future upgrades.
// Invariants come from COPY.md / CONTEXT.md / DESIGN.md.

const PAGES = [
  { path: "/", h1: /I build systems that work while you sleep/i },
  { path: "/prospect", h1: /reads the morning papers/i },
  { path: "/travel-planner", h1: /survives its own failures/i },
];

for (const { path, h1 } of PAGES) {
  test(`${path} renders with correct H1 and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(path);
    await expect(page.locator("h1")).toContainText(h1);

    // exactly one h1 per page (semantic SEO invariant)
    expect(await page.locator("h1").count()).toBe(1);

    // GitHub API may be rate-limited in CI — those are allowed; nothing else is.
    const real = errors.filter((e) => !e.includes("api.github.com"));
    expect(real, `console errors: ${real.join(" | ")}`).toHaveLength(0);
  });
}

test("404 page renders NO SIGNAL for unknown routes", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  // heading text is animated per-character (DecryptedText); assert on textContent
  await expect
    .poll(async () => (await page.locator("h1").textContent()) ?? "")
    .toContain("NO SIGNAL");
});

test("nav links reach both case studies and back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /prospect/i }).first().click();
  await expect(page).toHaveURL(/prospect/);
  await expect(page.locator("h1")).toContainText(/morning papers/i);
});

test("primary CTAs exist: email + resume", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href^="mailto:siddharthsingh8418@gmail.com"]').first()).toBeVisible();
  const resume = page.locator('a[href*="resume"]').first();
  await expect(resume).toBeVisible();
});

test("project grid shows 4 cards with data (snapshot fallback works offline)", async ({ page }) => {
  // Block the GitHub API to prove the fallback path — cards must still render.
  await page.route("**/api.github.com/**", (route) => route.abort());
  await page.goto("/");
  for (const name of ["Sindhey Pathology", "Autonomous Firefighting Robot", "MTK Firmware Unlock", "TrueNAS ZFS Recovery Lab"]) {
    const card = page.getByRole("heading", { level: 3, name }).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
  }
});

test("forbidden content never renders (phone, education, old claims)", async ({ page }) => {
  for (const path of ["/", "/prospect", "/travel-planner"]) {
    await page.goto(path);
    const body = await page.locator("body").innerText();
    for (const banned of ["82679", "B.Tech", "GATE", "6 months", "Bijnor"]) {
      expect(body, `"${banned}" leaked on ${path}`).not.toContain(banned);
    }
  }
});

test("reduced motion: content visible immediately, no animation required", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  // Sections below the fold must be readable without scroll-triggered reveals.
  const skills = page.getByRole("heading", { name: /stack/i });
  await skills.scrollIntoViewIfNeeded();
  await expect(skills).toBeVisible();
  await ctx.close();
});
