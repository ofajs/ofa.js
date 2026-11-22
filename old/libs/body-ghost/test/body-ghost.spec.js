import { test, expect } from "@playwright/test";

test("body-ghost test", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/libs/body-ghost/test/test-body-ghost.html"
  );

  await page.waitForTimeout(100);

  await expect(
    await page.evaluate(async () => {
      return $("test-comp").count;
    })
  ).toBe(100);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.$("sub-comp").attachedCount
    )
  ).toBe(1);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.$("sub-comp").detachedCount
    )
  ).toBe(0);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.all("sub-comp").length
    )
  ).toBe(2);

  await page.getByRole("button", { name: "count++" }).click();
  await page.getByRole("button", { name: "count++" }).click();
  await page.getByRole("button", { name: "count++" }).click();
  await page.getByRole("button", { name: "count++" }).click();

  await page.waitForTimeout(100);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.all("sub-comp").length
    )
  ).toBe(6);

  await page.getByRole("button", { name: "count++" }).click();

  await page.waitForTimeout(100);

  await expect(await page.evaluate(() => $("body-ghost-mapping"))).toBe(null);

  await page.getByRole("button", { name: "count++" }).click();

  await page.waitForTimeout(100);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.all("sub-comp").length
    )
  ).toBe(1);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.$("sub-comp").attachedCount
    )
  ).toBe(1);

  await expect(
    await page.evaluate(
      () => $("body-ghost-mapping").shadow.$("sub-comp").detachedCount
    )
  ).toBe(0);
});
