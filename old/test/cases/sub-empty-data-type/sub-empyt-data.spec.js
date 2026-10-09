import { test, expect } from "@playwright/test";

test("sub empty data", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/sub-empty-data-type/demo.html"
  );

  await expect(page.locator("t-c")).toContainText(`test component
   a: {}
   b: []`);

  await expect(page.locator("#log")).toContainText(
    `{"name":"get_config","inputSchema":{"type":"object","properties":{}},"testArr":[]}`
  );
});
