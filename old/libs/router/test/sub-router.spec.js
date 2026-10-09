import { test, expect } from "@playwright/test";

test("sub router test", async ({ page }) => {
  await page.goto("http://127.0.0.1:3348/libs/router/test/router-test.html");
  await page.getByRole("button", { name: "Go to sub page 01" }).click();

  await page.waitForTimeout(300);

  await page.getByRole("heading", { name: "I am Sub Page 1" }).click();
  await page.getByRole("link", { name: "go to subpage 2" }).click();

  await page.waitForTimeout(300);

  await page.getByRole("heading", { name: "I am Sub Page 2" }).click();
  await page.getByRole("link", { name: "go to subpage 3" }).click();

  await page.waitForTimeout(300);

  await page.getByRole("heading", { name: "I am Sub Page 3" }).click();
  await page.getByRole("link", { name: "TO PAGE 4" }).click();

  await page.waitForTimeout(300);

  await page.getByRole("heading", { name: "I am Sub Page 4" }).click();

  await page.waitForTimeout(300);

  await page.goto(
    "http://127.0.0.1:3348/libs/router/test/router-test.html#/test/pages/subs/sub-page03.html"
  );

  await page.waitForTimeout(300);

  await page.getByRole("heading", { name: "I am Sub Page 3" }).click();
});

test("reload page", async ({ page }) => {
  await page.goto("http://127.0.0.1:3348/libs/router/test/router-test.html");

  await page.getByRole("button", { name: "Go to sub page 01" }).click();
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForTimeout(100);

  await page.getByRole("heading", { name: "I am Sub Page 1" }).click();
  await page.getByRole("link", { name: "Page03" }).click();
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForTimeout(100);

  await page.getByRole("heading", { name: "I am Sub Page 3" }).click();
});
