import { test, expect } from "@playwright/test";

test("old page keeps its size during leave animation", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 400 });
  await page.goto("http://localhost:3348/test/cases/old-page-size/demo.html");
  await page.getByText("Child A").waitFor();

  const oldPage = page.locator("o-page", { hasText: "Child A" }).first();

  const before = await oldPage.evaluate((ele) => {
    const rect = ele.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });
  expect(before.width).toBeGreaterThan(900);

  // Record the old page rect on every frame during the leave animation
  await page.exposeFunction("recordRect", (rect) => {
    rects.push(rect);
  });

  const rects = [];
  await oldPage.evaluate((ele) => {
    const tick = () => {
      if (!ele.isConnected) return;
      const rect = ele.getBoundingClientRect();
      window.recordRect({ width: rect.width, height: rect.height });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  await page.getByRole("link", { name: "to child b" }).click();
  await page.getByText("Child B").waitFor();
  await page.waitForTimeout(300);

  expect(rects.length).toBeGreaterThan(0);
  for (const rect of rects) {
    expect(rect.width).toBe(before.width);
    expect(rect.height).toBe(before.height);
  }
});
