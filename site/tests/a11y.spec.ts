import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Accessibility gate: zero serious/critical axe violations on every page.
// (DESIGN.md §5: a11y ≥ 0.95 is a merge gate.)

for (const path of ["/", "/prospect", "/travel-planner", "/404.html"]) {
  test(`axe: no serious/critical violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(500); // let reveals settle
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
