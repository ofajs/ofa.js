import { test, expect } from "@playwright/test";

test("host link and style", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/fix-link/test-fix-link.html"
  );

  await page.getByRole("link", { name: "go to ./target.html" }).click();
  await page.getByText("I am target.").click();
  await page.getByRole("button", { name: "go back" }).click();
  await page.getByRole("button", { name: "change href" }).click();
  await page.getByRole("link", { name: "go to ./target2.html" }).click();
  await page.getByText("I am target2.").click();
});
