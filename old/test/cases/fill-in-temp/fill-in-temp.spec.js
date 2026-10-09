import { test, expect } from "@playwright/test";

test("fill-in-temp test", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/fill-in-temp/case.html");

  await page.waitForTimeout(100);

  // 验证页面上出现指定的字符串
  await expect(page.getByText("one-1")).toBeVisible();
  await expect(page.getByText("one-2-1")).toBeVisible();
  await expect(page.getByText("one-3")).toBeVisible();
  await expect(page.getByText("two")).toBeVisible();
});
