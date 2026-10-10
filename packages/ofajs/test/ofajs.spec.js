import { test, expect } from "@playwright/test";

// statics/ 下每个页面都是自检式测试视图：页面内渲染具名检查项和
// 通过/失败徽章，人工打开即可阅读。本 spec 断言页面渲染出的可见结果，
// 自动化验证的正是人看到的内容。

const PAGES = [
  { path: "/packages/ofajs/test/statics/comp.html", total: 12 },
  { path: "/packages/ofajs/test/statics/if-fill.html", total: 14 },
  { path: "/packages/ofajs/test/statics/app.html", total: 12 },
  { path: "/packages/ofajs/test/statics/context.html", total: 5 },
  { path: "/packages/ofajs/test/statics/misc.html", total: 5 },
];

for (const { path, total } of PAGES) {
  test(`${path} 自检 ${total}/${total} 通过 / shows ${total}/${total} passed`, async ({
    page,
  }) => {
    // 页面报错视为立即失败（渲染中断不应被等待超时掩盖）
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    await page.goto(path);

    await page.waitForFunction(
      () => window.__pageTests?.finished === true,
      null,
      { timeout: 60000 },
    );

    const state = await page.evaluate(() => window.__pageTests);

    expect(pageErrors, pageErrors.join("\n")).toEqual([]);

    expect(
      state.failures,
      state.failures.map(({ name, detail }) => `${name}: ${detail}`).join("\n")
    ).toEqual([]);
    expect(state.passed).toBe(total);
    expect(state.total).toBe(total);

    expect((await page.textContent(".summary")).trim()).toBe(
      `${total}/${total} 通过 / passed`
    );
  });
}
