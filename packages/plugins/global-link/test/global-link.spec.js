import { test, expect } from "@playwright/test";

// global-link 插件的 spec：shadow 注入生效、href 实时切换、移除恢复。
// 页面 body 显式设了 color: rgb(29, 29, 31)，作为"无全局样式"的回落值。
//
// 语义（忠实于实现）：o-global-link 只影响**其后挂载**的组件——
// 已注入样式的 shadow 副本不会随 href 变更或组件移除而回收。
//
// 断言需穿透组件 shadow 且容忍 l-m 异步加载期的未升级状态（null 安全）。

const PAGE = "/packages/plugins/global-link/test/statics/global-link.html";

const gColors = (page) =>
  page.evaluate(() =>
    ["styled-a", "styled-b"].map((tag) => {
      const el = document
        .querySelector(tag)
        ?.shadowRoot?.querySelector(".g-text");
      return el ? getComputedStyle(el).color : null;
    }),
  );

test("全局样式注入其后挂载的组件 shadow / global style reaches later-mounted shadows", async ({
  page,
}) => {
  await page.goto(PAGE);

  await page.waitForFunction(
    () => {
      const colors = ["styled-a", "styled-b"].map((tag) => {
        const el = document
          .querySelector(tag)
          ?.shadowRoot?.querySelector(".g-text");
        return el ? getComputedStyle(el).color : null;
      });
      return (
        colors[0] === "rgb(255, 0, 0)" && colors[1] === "rgb(255, 0, 0)"
      );
    },
    undefined,
    { timeout: 15000 },
  );
});

test("href 切换只影响其后挂载的组件 / href switch only affects later components", async ({
  page,
}) => {
  await page.goto(PAGE);

  // 已挂载组件保持红色
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("styled-a")
          ?.shadowRoot?.querySelector(".g-text") || document.body,
      ).color === "rgb(255, 0, 0)",
    undefined,
    { timeout: 15000 },
  );

  // href 切换为蓝：新挂载的 styled-c 拿到蓝色，已挂载的仍是红色
  await page.evaluate(() =>
    window.__glink.ele.setAttribute("href", "./fixtures/global-blue.css"),
  );
  await page.evaluate(() => {
    const el = document.createElement("styled-c");
    document.body.appendChild(el);
  });

  await page.waitForFunction(
    () => {
      const c = document
        .querySelector("styled-c")
        ?.shadowRoot?.querySelector(".g-text");
      const a = document
        .querySelector("styled-a")
        ?.shadowRoot?.querySelector(".g-text");
      return (
        !!c &&
        getComputedStyle(c).color === "rgb(0, 0, 255)" &&
        getComputedStyle(a).color === "rgb(255, 0, 0)"
      );
    },
    undefined,
    { timeout: 15000 },
  );
});

test("移除 o-global-link 后新组件不再拿到样式 / removing the tag stops injection", async ({
  page,
}) => {
  await page.goto(PAGE);

  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("styled-a")
          ?.shadowRoot?.querySelector(".g-text") || document.body,
      ).color === "rgb(255, 0, 0)",
    undefined,
    { timeout: 15000 },
  );

  await page.evaluate(() => window.__glink.remove());
  await page.evaluate(() => {
    const el = document.createElement("styled-b");
    el.setAttribute("data-late", "");
    document.body.appendChild(el);
  });

  // 新挂载的组件不再被注入（.g-text 回落页面默认色），已有组件不受影响
  await page.waitForFunction(
    () => {
      const late = document.querySelector("styled-b[data-late]")
        ?.shadowRoot?.querySelector(".g-text");
      const a = document
        .querySelector("styled-a")
        ?.shadowRoot?.querySelector(".g-text");
      return (
        late &&
        getComputedStyle(late).color === "rgb(29, 29, 31)" &&
        a &&
        getComputedStyle(a).color === "rgb(255, 0, 0)"
      );
    },
    undefined,
    { timeout: 15000 },
  );
});
