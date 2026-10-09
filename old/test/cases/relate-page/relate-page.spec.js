import { test, expect } from "@playwright/test";

test("relate page", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/relate-page/index.html");
  await page.getByRole("heading", { name: "My Page" }).click();
  await page.getByText("Welcome to my page!").click();
});

test("relate import", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/relate-page/index.html");

  await page.waitForTimeout(200);

  expect(await page.$eval("#d1", (el) => el.textContent)).toBe("d1:I am data1");
  expect(await page.$eval("#d2", (el) => el.textContent)).toBe("d2:I am data2");
});
