import { test, expect } from "@playwright/test";

// global-link 插件的 spec：shadow 注入生效、href 实时切换、移除恢复。
// 页面 body 显式设了 color: rgb(29, 29, 31)，作为"无全局样式"的回落值。

const PAGE = "/packages/plugins/global-link/test/statics/global-link.html";

const colorOf = (page, sel) =>
  page.evaluate(
    (sel) => {
      // g-text 在组件 shadow 内，穿透查询取 computed style
      const el = document.querySelector(sel).shadowRoot.querySelector(".g-text");
      return getComputedStyle(el).color;
    },
    sel,
  );

test("全局样式注入所有组件 shadow / global style reaches every shadow", async ({
  page,
}) => {
  await page.goto(PAGE);

  await page.waitForFunction(
    () => {
      const a = document
        .querySelector("styled-a")
        .shadowRoot.querySelector(".g-text");
      const b = document
        .querySelector("styled-b")
        .shadowRoot.querySelector(".g-text");
      return (
        getComputedStyle(a).color === "rgb(255, 0, 0)" &&
        getComputedStyle(b).color === "rgb(255, 0, 0)"
      );
    },
    undefined,
    { timeout: 15000 },
  );
});

test("href 实时切换全部组件样式 / href switches all shadows live", async ({
  page,
}) => {
  await page.goto(PAGE);

  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("styled-a")
          .shadowRoot.querySelector(".g-text"),
      ).color === "rgb(255, 0, 0)",
    undefined,
    { timeout: 15000 },
  );

  await page.evaluate(() =>
    window.__glink.ele.setAttribute("href", "./fixtures/global-blue.css"),
  );

  await page.waitForFunction(
    () => {
      const a = document
        .querySelector("styled-a")
        .shadowRoot.querySelector(".g-text");
      const b = document
        .querySelector("styled-b")
        .shadowRoot.querySelector(".g-text");
      return (
        getComputedStyle(a).color === "rgb(0, 0, 255)" &&
        getComputedStyle(b).color === "rgb(0, 0, 255)"
      );
    },
    undefined,
    { timeout: 15000 },
  );
});

test("移除 o-global-link 后样式恢复 / removing the tag restores styles", async ({
  page,
}) => {
  await page.goto(PAGE);

  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("styled-a")
          .shadowRoot.querySelector(".g-text"),
      ).color === "rgb(255, 0, 0)",
    undefined,
    { timeout: 15000 },
  );

  await page.evaluate(() => window.__glink.remove());

  await page.waitForFunction(
    () => {
      const a = document
        .querySelector("styled-a")
        .shadowRoot.querySelector(".g-text");
      const b = document
        .querySelector("styled-b")
        .shadowRoot.querySelector(".g-text");
      return (
        getComputedStyle(a).color === "rgb(29, 29, 31)" &&
        getComputedStyle(b).color === "rgb(29, 29, 31)"
      );
    },
    undefined,
    { timeout: 15000 },
  );
});

const GL_DIST = "/packages/plugins/global-link/test/statics/dist-host.html";

test("dist 冒烟：经典脚本 dist ofa + dist global-link / dist artifacts smoke", async ({
  page,
}) => {
  await page.goto(GL_DIST);

  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("gl-demo")
          .shadowRoot.querySelector(".g-text"),
      ).color === "rgb(255, 0, 0)",
    undefined,
    { timeout: 15000 },
  );
});
