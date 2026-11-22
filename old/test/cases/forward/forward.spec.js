import { test, expect } from "@playwright/test";

test("app forward", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/forward/forward-test.html");
  await page.getByRole("heading", { name: "Page1" }).click();
  await page.getByRole("link", { name: "to p2" }).click();
  await page.getByRole("link", { name: "to p3" }).click();
  await page.getByRole("link", { name: "to p4" }).click();
  await page.getByRole("heading", { name: "Page4" }).click(); // in page4

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("heading", { name: "Page1" }).click(); // in page1

  await page.getByRole("button", { name: "forward", exact: true }).click();

  await page.getByRole("heading", { name: "Page2" }).click(); // in page2

  await page.getByRole("button", { name: "forward", exact: true }).click();

  await page.getByRole("heading", { name: "Page3" }).click(); // in page3

  await page.getByRole("button", { name: "forward", exact: true }).click();

  await page.getByRole("heading", { name: "Page4" }).click(); // in page4

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("heading", { name: "Page1" }).click(); // in page1

  await page.getByRole("button", { name: "forward3", exact: true }).click();

  await page.getByRole("heading", { name: "Page4" }).click(); // in page4

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("heading", { name: "Page3" }).click(); // in page3

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("heading", { name: "Page2" }).click(); // in page2

  await page.getByRole("button", { name: "back" }).click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  await page.getByRole("heading", { name: "Page1" }).click(); // in page1

  await expect(1).toBe(1);
});
