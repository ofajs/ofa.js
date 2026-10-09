import { test, expect } from "@playwright/test";

test("render page src", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/render-src/test.html");
  await page.getByText("Page 1").click();
  await page.getByTestId("link1").click();
  await page.getByText("Page 2").click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByText("Page 1").click();
});
