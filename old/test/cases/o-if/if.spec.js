import { test, expect } from "@playwright/test";

test("match var", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/o-if/demo.html");

  await page.waitForSelector("#tips");

  // 断言文本是否包含 'I am 0 green'
  expect(await page.$eval("#tips", (el) => el.textContent)).toContain(
    "I am 0 green"
  );

  await page.getByRole("button", { name: "+1" }).click();

  await page.waitForTimeout(100);

  expect(await page.$eval("#tips", (el) => el.textContent)).toContain(
    "I am 1 pink"
  );

  await page.getByRole("button", { name: "+1" }).click();

  await page.waitForTimeout(100);

  expect(await page.$eval("#tips", (el) => el.textContent)).toContain(
    "I am 2 red"
  );

  await page.getByRole("button", { name: "-1" }).click();
  await page.waitForTimeout(10);
  await page.getByRole("button", { name: "-1" }).click();
  await page.waitForTimeout(10);
  await page.getByRole("button", { name: "-1" }).click();
  await page.waitForTimeout(10);

  expect(await page.$eval("#tips", (el) => el.textContent)).toContain(
    "I am -1 blue"
  );
});
