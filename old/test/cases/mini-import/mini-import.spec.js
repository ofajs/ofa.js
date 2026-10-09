import { test, expect } from "@playwright/test";

test("mini import", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/mini-import/test-mini-import.html"
  );

  await page.waitForTimeout(300);

  await expect(page.getByTestId("content")).toHaveText("Data text");
});
