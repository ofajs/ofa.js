import { test, expect } from "@playwright/test";

// body-ghost 插件的 spec：mapping 载体挂载、内容传送、事件沿原位置
// 冒泡、宿主移除后清理。

const PAGE = "/packages/plugins/body-ghost/test/statics/body-ghost.html";
const DIST = "/packages/plugins/body-ghost/test/statics/dist-host.html";

test("mapping 载体挂到 body，内容传送进其 shadow / mapping mounts on body", async ({
  page,
}) => {
  await page.goto(PAGE);

  const ghostBtn = page.locator("#ghost-btn");
  await ghostBtn.waitFor({ state: "visible", timeout: 15000 });

  // 真实 DOM 已传送到 body 末尾的 mapping 载体内
  const state = await page.evaluate(() => {
    const mapping = document.querySelector("body-ghost-mapping");
    return {
      mappingInBody: mapping?.parentElement === document.body,
      ghostInMappingShadow: !!mapping?.shadowRoot.querySelector("#ghost-btn"),
      ghostId: mapping?.getAttribute("ghost-id"),
    };
  });
  expect(state.mappingInBody).toBe(true);
  expect(state.ghostInMappingShadow).toBe(true);
  expect(state.ghostId).toBeTruthy();

  // 原位置壳不占布局（display:none）
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector("body-ghost")).display,
    ),
  ).toBe("none");
});

test("事件沿原位置冒泡：ghost 内点击计入外层计数 / events bubble to original position", async ({
  page,
}) => {
  await page.goto(PAGE);

  const ghostBtn = page.locator("#ghost-btn");
  await ghostBtn.waitFor({ state: "visible", timeout: 15000 });

  await ghostBtn.click();
  await page.waitForFunction(
    () => document.querySelector("#wrap-count").textContent === "1",
    undefined,
    { timeout: 15000 },
  );

  // wrap 内的按钮同样可计数（同一组件实例）
  await page.locator("#wrap-box button").click();
  await page.waitForFunction(
    () => document.querySelector("#wrap-count").textContent === "2",
    undefined,
    { timeout: 15000 },
  );
});

test("宿主移除后 mapping 清理 / mapping removed with host", async ({
  page,
}) => {
  await page.goto(PAGE);

  const ghostBtn = page.locator("#ghost-btn");
  await ghostBtn.waitFor({ state: "visible", timeout: 15000 });
  await page.waitForFunction(
    () => !!document.querySelector("body-ghost-mapping"),
    undefined,
    { timeout: 15000 },
  );

  await page.evaluate(() => window.__wrap.remove());
  await page.waitForFunction(
    () => !document.querySelector("body-ghost-mapping"),
    undefined,
    { timeout: 15000 },
  );
});

test("dist 冒烟：经典脚本 dist ofa + dist body-ghost / dist artifacts smoke", async ({
  page,
}) => {
  await page.goto(DIST);

  await page.waitForFunction(
    () => {
      const mapping = document.querySelector("body-ghost-mapping");
      return (
        mapping?.parentElement === document.body &&
        !!mapping?.shadowRoot.querySelector("#bg-in")
      );
    },
    undefined,
    { timeout: 15000 },
  );
});
