import { test, expect } from "@playwright/test";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test("first hash entry renders the page only once", async ({ page }) => {
  // Delay page module loading to widen the race window (simulates a cold cache)
  await page.route("**/test/pages/home.html*", async (route) => {
    await sleep(800);
    await route.continue();
  });

  await page.goto(
    "http://localhost:3348/libs/router/test/router-test.html#/test/pages/home.html?count=501"
  );

  // Simulate the spurious popstate(state=null) that some browsers
  // (Safari/iOS/WebView, bfcache restore) fire during page load,
  // while the initial hash goto is still awaiting the page module.
  // It must not trigger a second append of the same page.
  await page.waitForFunction(() => {
    const router = window.$ && $("o-router");
    return !!(router && router._popstateFunc);
  });

  await page.evaluate(() => {
    window.dispatchEvent(new Event("popstate"));
  });

  await sleep(1500);

  const count = await page.evaluate(() => {
    return document.querySelector("o-app").querySelectorAll(":scope > o-page").length;
  });

  expect(count).toBe(1);
});
