import { test, expect } from "@playwright/test";

test("o-router fix body", async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 800 });
  await page.goto("http://localhost:3348/libs/router/test/router-test.html");

  const boundingBox = await (await page.$("o-app")).boundingBox();

  expect(boundingBox.width).toBe(800);
  expect(boundingBox.height).toBe(800);
});

const getHash = async (page) => {
  const { _preview: href } = await page.waitForFunction(() => {
    // return location.hash; // Can cause stuck
    return location.href;
  });

  if (/.+(#.+)/.exec(href)) {
    return href.replace(/.+(#.+)/, "$1");
  }

  return "";
};

test("o-router hash router", async ({ page }) => {
  await page.goto("http://localhost:3348/libs/router/test/router-test.html");

  expect(await getHash(page)).toBe("");

  await page.getByTestId("gotohome").click();
   await page.waitForTimeout(500);
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=2");

  await page.getByTestId("gotohome").click();
   await page.waitForTimeout(500);
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=3");

  await page.getByTestId("back").click();
   await page.waitForTimeout(500);
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=2");

  await page.getByTestId("replacetohome").click();
   await page.waitForTimeout(500);
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=250");

  await page.getByTestId("back").click();
   await page.waitForTimeout(500);
  expect(await getHash(page)).toBe("");

  await page.getByTestId("gotohome").click();
   await page.waitForTimeout(500);
  await page.getByTestId("gotohome").click();
   await page.waitForTimeout(500);

  await page.goBack();
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=2");
   await page.waitForTimeout(500);
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"2"}')
  );

  await page.goForward();
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=3");
   await page.waitForTimeout(500);
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"3"}')
  );

  await page.waitForFunction(() => {
    history.go(-2);

    return true;
  });
  expect(await getHash(page)).toBe("");
   await page.waitForTimeout(500);
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"1"}')
  );

  await page.waitForFunction(() => {
    history.go(2);

    return true;
  });
  expect(await getHash(page)).toBe("#/test/pages/home.html?count=3");
   await page.waitForTimeout(500);
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"3"}')
  );
});

test("Direct access", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/libs/router/test/router-test.html#/test/pages/home.html?count=501"
  );

   await page.waitForTimeout(500);
  await expect(page.getByTestId("first-div")).toHaveText(
    new RegExp('{"count":"501"}')
  );
});

test("cross domain page in router mode", async ({ page }) => {
  await page.goto("http://127.0.0.1:3348/libs/router/test/router-test.html");
  await page.waitForTimeout(100);

  await page.getByRole("button", { name: "Go to sub page" }).click();

  await expect(page.getByTestId("src1")).toHaveText(
    "self src:http://127.0.0.1:3348/test/pages/subs/sub-page01.html"
  );

  const { _preview: href1 } = await page.waitForFunction(() => {
    // return location.hash; // Can cause stuck
    return location.href;
  });

  await expect(href1).toBe(
    "http://127.0.0.1:3348/libs/router/test/router-test.html#/test/pages/subs/sub-page01.html"
  );

  await page.getByRole("link", { name: "Page04" }).click();
  await page.waitForTimeout(400);
  

  await expect(page.getByTestId("src4")).toHaveText(
    "self src:http://127.0.0.1:3348/test/pages/subs/sub-page04.html"
  );

  await page.getByTestId("back").click();
  await page.waitForTimeout(400);
  await page.getByTestId("back").click();
  await page.waitForTimeout(400);
  await page
    .getByRole("button", { name: "ToSubpage 33482(Cross domain)" })
    .click();
  await page.waitForTimeout(400);

  await expect(page.getByTestId("src1")).toHaveText(
    "self src:http://127.0.0.1:33482/pages/subs/sub-page01.html"
  );

  const { _preview: href2 } = await page.waitForFunction(() => {
    // return location.hash; // Can cause stuck
    return location.href;
  });

  await expect(href2).toBe(
    "http://127.0.0.1:3348/libs/router/test/router-test.html#http://127.0.0.1:33482/pages/subs/sub-page01.html"
  );

  await page.getByRole("link", { name: "Page04" }).click();

  await page.waitForTimeout(400);

  await expect(page.getByTestId("src4")).toHaveText(
    "self src:http://127.0.0.1:33482/pages/subs/sub-page04.html"
  );
});
