import { test, expect } from "@playwright/test";

// o-router 的 spec：页面为纯应用页（无自检 harness），流程由这里
// 驱动并断言。覆盖：hash 同步、replace 语义、浏览器前后进驱动、
// hash 直达、reload 保持。

const ROUTER_URL = "/packages/router/test/statics/router.html";
const ENTRY_URL = "/packages/router/test/statics/router-entry.html";
const DIST_URL = "/packages/router/test/statics/dist-host.html";

const title = (page) =>
  page.evaluate(() => {
    const app = $("o-app");
    const p = app?.current;
    const el =
      p?.shadow && (p.shadow.$("#r-title") || p.shadow.$("#r2-title"));
    return el ? el.text.trim() : null;
  });

test("goto/replace 同步 hash 且 replace 不增历史 / goto & replace sync hash", async ({
  page,
}) => {
  await page.goto(ROUTER_URL);
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 30000 });

  // 初始：home（page-r1）已建立 hash 地址（就绪后初始条目回填）
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => location.hash)).toContain("page-r1.html");

  // goto：push 新条目
  await page.evaluate(() =>
    $("o-app").goto("./fixtures/page-r2.html?from=goto"),
  );
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await page.evaluate(() => location.hash)).toContain("page-r2.html");
  expect(await page.evaluate(() => location.hash)).toContain("from=goto");

  // replace：替换栈顶，不新增条目
  await page.evaluate(() =>
    $("o-app").replace("./fixtures/page-r1.html?from=rep"),
  );
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await page.evaluate(() => location.hash)).toContain("page-r1.html");
  expect(await page.evaluate(() => location.hash)).toContain("from=rep");
});

test("浏览器后退/前进驱动 app（等深恢复路由栈）/ browser back & forward drive app", async ({
  page,
}) => {
  await page.goto(ROUTER_URL);
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 30000 });

  // 建 [home, r2] 两层
  await page.evaluate(() =>
    $("o-app").goto("./fixtures/page-r2.html?from=go"),
  );
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });

  // 浏览器后退：回到 home 的 hash 条目（就绪后初始条目已回填 hash 地址）
  await page.goBack();
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await title(page)).toBe("r1");
  expect(await page.evaluate(() => location.hash)).toContain("page-r1.html");

  // 浏览器前进：app 前进到 r2
  await page.goForward();
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await title(page)).toBe("r2");
  expect(await page.evaluate(() => location.hash)).toContain("page-r2.html");
});

test("程序 back 后浏览器 forward 仍可驱动 / browser forward after programmatic back", async ({
  page,
}) => {
  await page.goto(ROUTER_URL);
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 30000 });

  await page.evaluate(() =>
    $("o-app").goto("./fixtures/page-r2.html?from=go"),
  );
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });

  // 程序 back：router 负责把浏览器历史一并回退
  await page.evaluate(() => $("o-app").back());
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 15000 });

  // 此后浏览器 forward：应前进到 r2
  await page.goForward();
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await page.evaluate(() => location.hash)).toContain("page-r2.html");
});

test("hash 直达渲染目标页 / direct hash entry renders the target", async ({
  page,
}) => {
  await page.goto(
    ENTRY_URL +
      "#/packages/router/test/statics/fixtures/page-r1.html",
  );

  await page.locator("#r-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await page.evaluate(() => $("o-app").current.src)).toContain(
    "page-r1.html",
  );
  expect(await page.evaluate(() => location.hash)).toContain("page-r1.html");
});

test("reload 保持当前 hash 页 / reload keeps current hash page", async ({
  page,
}) => {
  await page.goto(ENTRY_URL);
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 30000 });

  await page.evaluate(() =>
    $("o-app").goto("./fixtures/page-r2.html?from=reload"),
  );
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });

  await page.reload();
  await page.locator("#r2-title").waitFor({ state: "visible", timeout: 15000 });
  expect(await page.evaluate(() => location.hash)).toContain("page-r2.html");
  expect(await page.evaluate(() => location.hash)).toContain("from=reload");
});

test("dist 产物冒烟：经典脚本加载 dist ofa + dist router / dist artifacts smoke", async ({
  page,
}) => {
  await page.goto(DIST_URL);
  await page.locator("#r-title").waitFor({ state: "visible", timeout: 30000 });

  // 就绪后初始条目回填 hash 地址 = 全局 $ 挂接的 router 正常工作
  await page.waitForFunction(() => location.hash.includes("page-r1"), undefined, {
    timeout: 15000,
  });

  // dist ofa 与 dist router 是同一份框架实例：渲染一次、无重复注册
  expect(await page.evaluate(() => window.__r1renders)).toBe(1);
});
