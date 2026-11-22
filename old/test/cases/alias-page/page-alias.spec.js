import { test, expect, firefox } from "@playwright/test";

test("page use alias", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/alias-page/test.html");
  await page.waitForTimeout(200);

  await page.getByText("I am page1").click();
  await page.getByRole("link", { name: "To page2" }).click();
  await page.getByText("I am page2").click();
  await page
    .getByText(
      "test parent,current: http://localhost:3348/test/cases/alias-page/page2.html"
    )
    .click();
  await page.getByRole("link", { name: "to page 3" }).click();
  await page.getByText("I am page3").click();
  await page
    .getByText(
      "test parent,current: http://localhost:3348/test/cases/alias-page/page3.html"
    )
    .click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByText("I am page2").click();
  await page
    .getByText(
      "test parent,current: http://localhost:3348/test/cases/alias-page/page2.html"
    )
    .click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByText("I am page1").click();
});

test("hash router page use alias", async ({ page, browserName }) => {
  await page.goto("http://localhost:3348/test/cases/alias-page/hr-test.html");
  await page.waitForTimeout(200);

  await page.getByText("I am page1").click();
  await page.getByRole("link", { name: "To page2" }).click();
  await page.getByText("I am page2").click();
  await page
    .getByText(
      "test parent,current: http://localhost:3348/test/cases/alias-page/page2.html"
    )
    .click();
  await page.getByRole("link", { name: "to page 3" }).click();

  await page.getByText("I am page3").click();
  await page
    .getByText(
      "test parent,current: http://localhost:3348/test/cases/alias-page/page3.html"
    )
    .click();

  await page.waitForTimeout(200);

  if (browserName === "firefox") {
    // After firefox in playwright use reload method, the state will be lost
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyR");
    await page.keyboard.up("Control");
  } else {
    await page.reload();
  }

  await page.getByText("I am page3").click();

  await page.waitForTimeout(100);
  await page.getByRole("button", { name: "Back" }).click();
  await page.waitForTimeout(100);
  await page.getByText("I am page2").click();
  await page
    .getByText(
      "test parent,current: http://localhost:3348/test/cases/alias-page/page2.html"
    )
    .click();
  await page.getByRole("button", { name: "Back" }).click();
  await page.getByText("I am page1").click();
});
