import { test, expect } from "@playwright/test";

test("load page", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-page.html");
  await page.getByPlaceholder("Enter something...").fill("1001");

  const { _preview: pageFirstDivText } = await page.waitForFunction(
    async () => {
      return $("o-page").shadow.$("div").text;
    }
  );

  await expect(pageFirstDivText).toBe('query --> {"num":"1001"}');
});

test("load '.page'", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-page2.html");

  const text1 = await page.getByTestId("page1").textContent();

  await expect(text1.includes("I am page1")).toBe(true);

  const text2 = await page.getByTestId("que").textContent();

  await expect(text2.includes('{"num":"22"}')).toBe(true);
});
