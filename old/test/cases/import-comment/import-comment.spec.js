import { test, expect } from "@playwright/test";

test("import with comments", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/import-comment/test.html");

  const text = await page.waitForFunction(() => {
    const root = document.querySelector("test-comp")?.shadowRoot;
    if (!root) return false;
    const text = root.querySelector("#import-comment-result")?.textContent;
    return text && text !== "loading" ? text : false;
  });

  expect(await text.jsonValue()).toBe("ok1-ok2-ok3-ok4-ok5");
});
