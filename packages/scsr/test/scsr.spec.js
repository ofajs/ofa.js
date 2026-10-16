import { test, expect } from "@playwright/test";

// scsr 的 spec：页面为纯应用页（无自检 harness），流程由这里驱动并
// 断言。覆盖：真实路径同步、站内跳转不重载、浏览器前后进、reload
// 恢复、页内锚点（hash 不参与路由且条目可对账）、ignore 条目内核
// 契约、嵌套父页、带 query/hash 直达、页面标题同步。

const S1 = "/packages/scsr/test/statics/scsr01.html";
const S2 = "/packages/scsr/test/statics/scsr02.html";
const S3 = "/packages/scsr/test/statics/scsr03.html";
const DIST = "/packages/scsr/test/statics/dist-host.html";

const stateReady = (page) =>
  page.waitForFunction(() => history.state?.routerMode === 1, undefined, {
    timeout: 30000,
  });

// 等旧页动画移除完毕（页面进出动画期新旧页短暂共存，直接驱动下一段
// 前进/后退会与移除竞态）
const appSettled = (page, count = 1) =>
  page.waitForFunction(
    (c) => document.querySelectorAll("o-page").length === c,
    count,
    { timeout: 15000 },
  );

test("首屏把当前 URL 收编为应用内页面 / fresh load adopts current URL as page", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });
  await stateReady(page);

  // 地址不变形：真实路径保持原样，不追加 hash
  expect(new URL(page.url()).pathname).toBe(S1);
  expect(await page.evaluate(() => location.hash)).toBe("");

  // 初始条目已补建路由状态，页面地址进 routers
  const state = await page.evaluate(() => history.state);
  expect(state.routers[0].src).toContain("scsr01.html");

  // 只渲染一次：内联 template[page] 不参与渲染，o-page 不重复 push
  expect(await page.evaluate(() => window.__p01renders)).toBe(1);
});

test("页面标题随 page-loaded 同步 / page title syncs on page-loaded", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });

  await page.evaluate(() => $("o-app").goto("./scsr02.html"));
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });
  await page.waitForFunction(() => document.title === "SCSR Page 02");

  // 后退重载 page01，标题同步还原
  await page.goBack();
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 15000 });
  await page.waitForFunction(() => document.title === "SCSR Page 01");
});

test("t-btn 站内跳转切真实路径且不重载文档 / in-app goto swaps real path without reload", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });
  await stateReady(page);

  // 文档存活标记：跳转后仍在 = 没有发生文档级导航
  await page.evaluate(() => (window.__docAlive = 1));

  await page.locator("#p01-goto").click();
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });

  expect(new URL(page.url()).pathname).toBe(S2);
  expect(await page.evaluate(() => window.__docAlive)).toBe(1);
  expect(await page.evaluate(() => window.__p01renders)).toBe(1);

  // 路由状态已随 pushState 写入
  const state = await page.evaluate(() => history.state);
  expect(state.routers).toHaveLength(2);
  expect(state.routers[1].src).toContain("scsr02.html");
});

test("浏览器后退/前进驱动应用 / browser back & forward drive the app", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });

  await page.evaluate(() => $("o-app").goto("./scsr02.html?from=bf"));
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page);

  await page.goBack();
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page);
  expect(new URL(page.url()).pathname).toBe(S1);

  await page.goForward();
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });
  expect(new URL(page.url()).pathname).toBe(S2);
  expect(await page.locator("#p02-from").textContent()).toBe("bf");
});

test("reload 后按历史状态恢复当前页 / reload restores the current page", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });

  await page.evaluate(() => $("o-app").goto("./scsr02.html?from=reload"));
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });

  await page.reload();
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 30000 });

  expect(new URL(page.url()).pathname).toBe(S2);
  expect(new URL(page.url()).search).toBe("?from=reload");

  // 恢复自 history.state：栈长 2，目标页只渲染一次，query 完整达页
  expect(await page.evaluate(() => history.state.routers)).toHaveLength(2);
  expect(await page.evaluate(() => window.__p02renders)).toBe(1);
  expect(await page.locator("#p02-from").textContent()).toBe("reload");
});

test("页内锚点只动 hash 不重渲染，跨锚点条目前后进不扰动应用 / in-page anchor changes hash only", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });
  await stateReady(page);

  await page.locator("#to-anchor").click();
  await page.waitForFunction(() => location.hash === "#anchor-pos");

  // 应用不响应锚点定位
  expect(await page.evaluate(() => window.__p01renders)).toBe(1);

  // 应用跳走后再后退，回到锚点条目：恢复 page01，hash 保留
  await page.evaluate(() => $("o-app").goto("./scsr02.html"));
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page);

  await page.goBack();
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page);
  expect(await page.evaluate(() => location.hash)).toBe("#anchor-pos");
  const rendersAfterBack = await page.evaluate(() => window.__p01renders);
  expect(rendersAfterBack).toBe(2);

  // 继续后退到初始条目再前进回锚点条目：等深同栈，不重渲染
  await page.goBack();
  await page.waitForFunction(() => location.hash === "");
  await page.goForward();
  await page.waitForFunction(() => location.hash === "#anchor-pos");
  await page.locator("#p01-title").waitFor({ state: "visible" });
  await appSettled(page);
  expect(await page.evaluate(() => window.__p01renders)).toBe(
    rendersAfterBack,
  );
});

test("ignore 标记的条目被内核跳过，不驱动应用 / kernel skips ignore-marked entries", async ({
  page,
}) => {
  await page.goto(S1);
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });

  await page.evaluate(() => $("o-app").goto("./scsr02.html"));
  await page
    .locator("#p02-title")
    .waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page);

  // 直接构造带 ignore 标记的条目（内核契约：宿主可为「只承载 URL
  // 变化」的条目写此标记），等深但栈顶指向 page03
  await page.evaluate(
    ({ s1, s3 }) =>
      history.replaceState(
        {
          routerMode: 1,
          ignore: 1,
          routers: [{ src: s1 }, { src: s3 }],
        },
        "",
        undefined,
      ),
    {
      s1: new URL(S1, "http://localhost:3348").href,
      s3: new URL(S3, "http://localhost:3348").href,
    },
  );

  await page.goBack();
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page);

  // 前进到 ignore 条目：只移动 URL，不触发 page03 渲染
  await page.goForward();
  expect(new URL(page.url()).pathname).toBe(S2);
  expect(await page.evaluate(() => window.__p03renders)).toBeUndefined();
  expect(await page.evaluate(() => $("o-app").current.src)).toContain(
    "scsr01.html",
  );
});

test("嵌套父页包裹渲染，子目录页可直达可达 / parent chain renders; sub-dir page reachable", async ({
  page,
}) => {
  await page.goto(S3);
  await page.locator("#p03-title").waitFor({ state: "visible", timeout: 30000 });
  // scsr03 声明 parent：父页标记与子页内容同时可见
  await page
    .locator("#parent-marker")
    .waitFor({ state: "visible", timeout: 15000 });
  expect(await page.evaluate(() => window.__p03renders)).toBe(1);

  await page.evaluate(() => $("o-app").goto("./subs/scsr0301.html"));
  await page
    .locator("#p0301-title")
    .waitFor({ state: "visible", timeout: 15000 });
  // 0301 未声明 parent：继承链收缩为单页
  await appSettled(page);
  expect(new URL(page.url()).pathname).toBe(
    "/packages/scsr/test/statics/subs/scsr0301.html",
  );

  await page.goBack();
  await page.locator("#p03-title").waitFor({ state: "visible", timeout: 15000 });
  await page
    .locator("#parent-marker")
    .waitFor({ state: "visible", timeout: 15000 });
  await appSettled(page, 2);
});

test("带锚点直达：页面渲染且 hash 保留 / direct entry with hash keeps fragment", async ({
  page,
}) => {
  await page.goto(S1 + "#anchor-pos");
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });
  await stateReady(page);

  expect(await page.evaluate(() => location.hash)).toBe("#anchor-pos");

  // 页面地址取自 pathname+search，不带锚点
  const state = await page.evaluate(() => history.state);
  expect(state.routers[0].src).toContain("scsr01.html");
  expect(state.routers[0].src).not.toContain("#");

  expect(await page.evaluate(() => window.__p01renders)).toBe(1);
});

test("带 query 直达：query 进页面地址 / direct entry with query reaches page src", async ({
  page,
}) => {
  await page.goto(S1 + "?foo=bar");
  await page.locator("#p01-title").waitFor({ state: "visible", timeout: 30000 });
  await stateReady(page);

  expect(new URL(page.url()).search).toBe("?foo=bar");
  const state = await page.evaluate(() => history.state);
  expect(state.routers[0].src).toContain("?foo=bar");
});

test("dist 产物冒烟：经典脚本加载 dist ofa + dist scsr / dist artifacts smoke", async ({
  page,
}) => {
  await page.goto(DIST);
  await page
    .locator("#dist-scsr-title")
    .waitFor({ state: "visible", timeout: 30000 });
  await stateReady(page);

  // 当前 URL 被收编为应用内页面，且 dist ofa 与 dist scsr 是同一份
  // 框架实例（只渲染一次、无重复注册）
  expect(await page.evaluate(() => window.__distRenders)).toBe(1);
  expect(await page.evaluate(() => history.state.routers[0].src)).toContain(
    "dist-host.html",
  );
});
