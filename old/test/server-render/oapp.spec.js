import { test, expect } from "@playwright/test";

test("test o-app component server render", async ({ page }) => {
  await page.goto("http://localhost:3348/test/server-render/oapp-test.html");
  
  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/0"
  );
  await page.getByTestId("gotoNextBtn").click();

  await new Promise((resolve) => setTimeout(resolve, 400));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/1"
  );
  await page.getByTestId("gotoNextBtn").click();

  await new Promise((resolve) => setTimeout(resolve, 400));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/2"
  );
});

test("test server render page", async ({ page }) => {
  await page.goto("http://localhost:33483/pages/0");

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/0"
  );
  await page.getByTestId("gotoNextBtn").click();

  await new Promise((resolve) => setTimeout(resolve, 400));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/1"
  );

  await page.evaluate(() => window.location.reload());

  await new Promise((resolve) => setTimeout(resolve, 100));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/1"
  );

  await page.getByTestId("gotoNextBtn").click();

  await new Promise((resolve) => setTimeout(resolve, 400));

  expect(await page.$eval("#main-title", (node) => node.textContent)).toBe(
    "current page: /pages/2"
  );
});
