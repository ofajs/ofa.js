import { test, expect } from "@playwright/test";

test("l-m load alias path", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/alias/demo.html"
  );

  await page.getByText("ok").click();
});
