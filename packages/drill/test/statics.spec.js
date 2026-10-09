import { test, expect } from "@playwright/test";

// statics/ 下每个静态页都是自检式测试视图：页面内渲染具名检查项和
// 通过/失败徽章，人工打开即可阅读。本 spec 断言页面渲染出的可见结果，
// 自动化验证的正是人看到的内容。

const PAGES = [
  { path: "/packages/drill/test/statics/loader.html", total: 9 },
  { path: "/packages/drill/test/statics/middleware.html", total: 3 },
  { path: "/packages/drill/test/statics/element.html", total: 8 },
  { path: "/packages/drill/test/statics/cache.html", total: 2 },
  { path: "/packages/drill/test/statics/path.html", total: 5 },
];

for (const { path, total } of PAGES) {
  test(`${path} 自检 ${total}/${total} 通过 / shows ${total}/${total} passed`, async ({
    page,
  }) => {
    await page.goto(path);

    // 等待页面完成全部检查项
    await page.waitForFunction(
      () => window.__pageTests?.finished === true,
      null,
      { timeout: 15000 }
    );

    const state = await page.evaluate(() => window.__pageTests);

    // 失败明细放进 expect 消息，报告里可直接读到原因
    expect(
      state.failures,
      state.failures.map(({ name, detail }) => `${name}: ${detail}`).join("\n")
    ).toEqual([]);
    expect(state.passed).toBe(total);
    // 校验检查项总数，防止渲染中断导致用例静默减少
    expect(state.total).toBe(total);

    // 页面上渲染的汇总文字，即人工看到的结果
    expect((await page.textContent(".summary")).trim()).toBe(
      `${total}/${total} 通过 / passed`
    );
  });
}
