import { test, expect } from "@playwright/test";

test("load component", async ({ page }) => {
  await page.goto("http://localhost:3348/test/test-component.html");
  await page.getByPlaceholder("Enter something...").click();
  await page.getByPlaceholder("Enter something...").fill("test value");

  const result = await page.waitForFunction(async () => {
    return $("t-input").value;
  });

  await expect(result._preview).toBe("test value");

  await expect(page.getByTestId("outer")).toHaveText("test value");
});
