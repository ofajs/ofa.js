import { test, expect } from "@playwright/test";

// statics/ 下每个页面都是自检式测试视图：页面内渲染具名检查项和
// 通过/失败徽章，人工打开即可阅读。本 spec 断言页面渲染出的可见结果，
// 自动化验证的正是人看到的内容。
//
// 页面与历史易错用例的对应关系见包内 CONTEXT.md 的「用例覆盖表」。

const PAGES = [
  { path: "/packages/xhear/test/statics/syntax-text.html", total: 10 },
  { path: "/packages/xhear/test/statics/syntax-bind.html", total: 8 },
  { path: "/packages/xhear/test/statics/syntax-event.html", total: 7 },
  { path: "/packages/xhear/test/statics/syntax-sync-watch.html", total: 5 },
  { path: "/packages/xhear/test/statics/syntax-style.html", total: 4 },
  { path: "/packages/xhear/test/statics/syntax-if.html", total: 6 },
  { path: "/packages/xhear/test/statics/syntax-fill.html", total: 8 },
  { path: "/packages/xhear/test/statics/syntax-fill-key.html", total: 4 },
  { path: "/packages/xhear/test/statics/syntax-template.html", total: 6 },
  { path: "/packages/xhear/test/statics/combo-render.html", total: 7 },
  { path: "/packages/xhear/test/statics/combo-form.html", total: 6 },
  { path: "/packages/xhear/test/statics/register.html", total: 13 },
  { path: "/packages/xhear/test/statics/dom-array.html", total: 9 },
  { path: "/packages/xhear/test/statics/memory.html", total: 5 },
  { path: "/packages/xhear/test/statics/svg.html", total: 5 },
];

for (const { path, total } of PAGES) {
  test(`${path} 自检 ${total}/${total} 通过 / shows ${total}/${total} passed`, async ({
    page,
  }) => {
    // 页面报错视为立即失败（渲染中断不应被等待超时掩盖）
    const pageErrors = [];
    page.on("pageerror", (e) => pageErrors.push(String(e)));

    await page.goto(path);

    // 等待页面完成全部检查项
    await page.waitForFunction(
      () => window.__pageTests?.finished === true,
      null,
      { timeout: 30000 }
    );

    const state = await page.evaluate(() => window.__pageTests);

    expect(
      pageErrors,
      pageErrors.join("\n")
    ).toEqual([]);

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
