import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Accessibility gate: zero serious/critical axe violations on every page.
// Home page gets 60s timeout — the 3D scene needs warm-up for axe to scan.

for (const path of ["/", "/prospect", "/travel-planner", "/404.html"]) {
  test(`axe: no serious/critical violations on ${path}`, async ({ page }) => {
    test.setTimeout(60000);
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    expect(
      bad,
      bad.map((v) => `${v.impact}: ${v.id} — ${v.nodes.length} node(s)`).join("\n"),
    ).toHaveLength(0);
  });
}
