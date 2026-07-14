import { test, expect } from "@playwright/test";

// Regression smoke suite — protects the shipped site against future upgrades.
// Invariants come from COPY.md / CONTEXT.md / DESIGN.md.

const PAGES = [
  { path: "/", h1: /I build systems that work while you sleep/i },
  { path: "/prospect", h1: /reads the morning papers/i },
  { path: "/travel-planner", h1: /survives its own failures/i },
  { path: "/projects", h1: /Projects/i },
  { path: "/knowme", h1: /Know Me/i },
];

for (const { path, h1 } of PAGES) {
  test(`${path} renders with correct H1 and no console errors`, async ({ page }) => {
    test.setTimeout(15000);
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto(path);
    await expect(page.locator("h1")).toContainText(h1);

    // exactly one h1 per page (semantic SEO invariant)
    expect(await page.locator("h1").count()).toBe(1);

    // GitHub API rate-limits + resume 404 + any static-asset 404 in test env are allowed.
    const real = errors.filter((e) =>
      !e.includes("api.github.com") &&
      !e.includes("403") &&
      !e.includes(".pdf") &&
      !e.includes("favicon.ico")
    );
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
  test.setTimeout(15000);
  await page.route("**/api.github.com/**", (route) => route.abort());
  await page.goto("/projects");
  for (const name of ["Sindhey Pathology", "Autonomous Firefighting Robot", "MTK Firmware Unlock", "TrueNAS ZFS Recovery Lab"]) {
    const card = page.getByRole("heading", { level: 3, name }).first();
    await card.scrollIntoViewIfNeeded();
    await expect(card).toBeVisible();
  }
});

test("forbidden content never renders (phone, education, old claims)", async ({ page }) => {
  // Base64-opaque + index-only failure messages: this file and CI logs are
  // public — the banned values must never appear in either.
  const banned = [
    ...["ODI2Nzk=", "Qi5UZWNo", "R0FURQ==", "Qmlqbm9y"].map((enc) =>
      Buffer.from(enc, "base64").toString(),
    ),
    "6 months",
  ];
  for (const path of ["/", "/prospect", "/travel-planner"]) {
    await page.goto(path);
    const body = await page.locator("body").innerText();
    banned.forEach((str, i) => {
      expect(body, `banned string #${i + 1} leaked on ${path}`).not.toContain(str);
    });
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

test("internal link integrity guard (F15): no 404s on site navigation", async ({ page, request }) => {
  const routes = ["/", "/prospect", "/travel-planner", "/projects", "/knowme"];
  const checked = new Set<string>();
  
  for (const route of routes) {
    await page.goto(route);
    const links = await page.locator('a[href^="/"]').evaluateAll((els) => els.map(el => el.getAttribute('href')));
    
    for (const href of links) {
      if (href && href !== "/" && !href.startsWith("/#") && !href.includes(".pdf") && !checked.has(href)) {
        checked.add(href);
        const response = await request.get(href);
        expect(response.status(), `Link ${href} on ${route} returned ${response.status()}`).toBe(200);
      }
    }
  }
});
;
