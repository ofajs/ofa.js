import { test, expect } from "@playwright/test";

test("o-fill compnent", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/o-fill/demo.html");

  await new Promise((resolve) => setTimeout(resolve, 200));

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp1"]')).map((el) => el.textContent())
    )
  ).toEqual(["1111", "222", "33"]);

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp2"]')).map((el) => el.textContent())
    )
  ).toEqual(["1111-1", "1111-2", "33-1"]);

  await expect(
    await Promise.all(
      (
        await page.$$('[data-testid="item"]')
      ).map((el) => el.textContent().then((e) => e.trim()))
    )
  ).toEqual(["1111", "222", "33"]);

  await page.getByRole("button", { name: "Change Some" }).click();

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp1"]')).map((el) => el.textContent())
    )
  ).toEqual(["33", "2.1111", "2.2222", "1111"]);

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp2"]')).map((el) => el.textContent())
    )
  ).toEqual(["33-1", "1111-1", "1111-2"]);

  await expect(
    await Promise.all(
      (
        await page.$$('[data-testid="item"]')
      ).map((el) => el.textContent().then((e) => e.trim()))
    )
  ).toEqual(["33", "2.1111", "2.2222", "1111"]);

  await page.getByRole("button", { name: "New Arr" }).click();

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp1"]')).map((el) => el.textContent())
    )
  ).toEqual(["4444", "55555", "666666"]);

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp2"]')).map((el) => el.textContent())
    )
  ).toEqual([]);

  await expect(
    await Promise.all(
      (
        await page.$$('[data-testid="item"]')
      ).map((el) => el.textContent().then((e) => e.trim()))
    )
  ).toEqual(["4444", "55555", "666666"]);

  await page.getByRole("button", { name: "Clear" }).click();

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp1"]')).map((el) => el.textContent())
    )
  ).toEqual([]);

  await expect(
    await Promise.all(
      (await page.$$('[data-testid="temp2"]')).map((el) => el.textContent())
    )
  ).toEqual([]);

  await expect(
    await Promise.all(
      (
        await page.$$('[data-testid="item"]')
      ).map((el) => el.textContent().then((e) => e.trim()))
    )
  ).toEqual([]);
});
