import { test, expect } from "@playwright/test";

test("import module", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/import-module/test.html");

  await page.waitForTimeout(100);

  await page.getByText("I am test comp").click();

  expect(await page.$eval("#ok", (node) => node.textContent)).toBe("ok");
});
