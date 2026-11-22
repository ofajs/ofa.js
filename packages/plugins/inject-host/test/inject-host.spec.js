import { test, expect } from "@playwright/test";

// inject-host 插件的 spec：收编样式作用于光 DOM、head 去重、
// style 文本实时变更、link href 切换与移除恢复。

const PAGE = "/packages/plugins/inject-host/test/statics/inject-host.html";

test("收编样式并作用于光 DOM / injected style applies to light DOM", async ({
  page,
}) => {
  await page.goto(PAGE);

  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#light-target")).color ===
      "rgb(0, 128, 0)",
    undefined,
    { timeout: 15000 },
  );

  // head 中应有收编样式，且按内容 hash 去重
  const deduped = await page.evaluate(() => {
    const hoisted = document.head.querySelectorAll("style[inject-host]");
    const contents = new Set();
    hoisted.forEach((s) => contents.add(s.textContent.trim()));
    return { count: hoisted.length, unique: contents.size };
  });
  expect(deduped.count).toBeGreaterThanOrEqual(1);
  expect(deduped.count).toBe(deduped.unique);
});

test("双重组件嵌于 o-page：样式收编进页面 shadow 多层命中 / hoisted into o-page shadow", async ({
  page,
}) => {
  await page.goto(PAGE);

  // .item-name 在 o-page 的 shadow 树内（裸 querySelector 穿不透，显式走
  // shadowRoot）；虽经内层组件 user-list-item 的槽渲染仍被命中
  await page.waitForFunction(
    () => {
      const op = document.querySelector("o-page");
      const el = op?.shadowRoot?.querySelector("#nested-name");
      return el && getComputedStyle(el).color === "rgb(255, 0, 0)";
    },
    undefined,
    { timeout: 15000 },
  );

  // 收编样式塞进 o-page 的 shadowRoot（宿主根），head 中没有这份规则
  const state = await page.evaluate(() => {
    const rule = "user-list user-list-item .item-name";
    const op = document.querySelector("o-page");
    const hoisted = op?.shadowRoot?.querySelector("style[inject-host]");
    const inHead = Array.from(
      document.head.querySelectorAll("style[inject-host]"),
    ).some((s) => s.textContent.includes(rule));
    return {
      inPageShadow:
        !!hoisted && hoisted.textContent.includes(rule),
      notInHead: !inHead,
    };
  });
  expect(state.inPageShadow).toBe(true);
  expect(state.notInHead).toBe(true);

  // 且 .item-name 确实渲染在内层组件 user-list-item 的 shadow 槽内
  const nested = await page.evaluate(() => {
    const op = document.querySelector("o-page");
    const el = op?.shadowRoot?.querySelector("#nested-name");
    const item = op?.shadowRoot?.querySelector("user-list-item");
    const slot = el && el.assignedSlot;
    return !!slot && !!item && slot.getRootNode() === item.shadowRoot;
  });
  expect(nested).toBe(true);
});

test("注入 style 文本变更实时生效 / injected style text changes apply live", async ({
  page,
}) => {
  await page.goto(PAGE);

  const styleTarget = page.locator("#inj-style-target");
  await styleTarget.waitFor({ state: "visible", timeout: 15000 });

  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#inj-style-target")).color ===
      "rgb(0, 128, 0)",
    undefined,
    { timeout: 15000 },
  );

  // 改注入 style 的文本：收编副本同步更新
  await page.evaluate(() =>
    window.__dyn.setStyleText(".inj-style-target { color: rgb(0, 0, 255); }"),
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#inj-style-target")).color ===
      "rgb(0, 0, 255)",
    undefined,
    { timeout: 15000 },
  );

  await page.evaluate(() =>
    window.__dyn.setStyleText(".inj-style-target { color: rgb(0, 128, 0); }"),
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#inj-style-target")).color ===
      "rgb(0, 128, 0)",
    undefined,
    { timeout: 15000 },
  );
});

test("注入 link href 切换与移除恢复 / injected link href switch and remove", async ({
  page,
}) => {
  await page.goto(PAGE);

  const linkTarget = page.locator("#inj-link-target");
  await linkTarget.waitFor({ state: "visible", timeout: 15000 });

  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#inj-link-target")).color ===
      "rgb(255, 0, 0)",
    undefined,
    { timeout: 15000 },
  );

  // 切换 href → 收编副本的样式跟着切
  await page.evaluate(() =>
    window.__dyn.switchLink("./fixtures/inject-link-blue.css"),
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#inj-link-target")).color ===
      "rgb(0, 0, 255)",
    undefined,
    { timeout: 15000 },
  );

  // 移除注入的 link → 样式失效（回落页面默认文字色 #1d1d1f）
  await page.evaluate(() => window.__dyn.removeLink());
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector("#inj-link-target")).color ===
      "rgb(29, 29, 31)",
    undefined,
    { timeout: 15000 },
  );
});
