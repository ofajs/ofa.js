import { test, expect } from "@playwright/test";

test("empty temp", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/empty-temp/test.html");

  await page.waitForTimeout(100);

  await page.getByText("I m text").click();

  const { _preview: data } = await page.waitForFunction(async () => {
    return $("empty-temp").val;
  });

  expect(data).toBe("I am empty temp");

  const { _preview: hasShadow } = await page.waitForFunction(async () => {
    return document.querySelector("empty-temp").shadowRoot;
  });

  expect(hasShadow).toBe("null");
});
