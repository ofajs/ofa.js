import { test, expect } from "@playwright/test";

// formdata 插件的 spec：覆盖源码形态（插件与 o-if/o-fill 协作）与
// dist 形态（经典脚本 dist ofa.js + dist 插件，挂全局 $ 的单实例契约）。
//
// 注意：#target 位于 formdata-demo 的 shadow 内，断言必须显式穿透
// shadowRoot（裸 document.querySelector 不跨 shadow 边界）。

const SRC = "/packages/plugins/formdata/test/statics/formdata.html";
const DIST = "/packages/plugins/formdata/test/statics/dist-host.html";

/** 穿透 shadow 读取 #target 的文本（未就绪时返回 null，供 waitForFunction 轮询） */
const targetText = (page) =>
  page.evaluate(() => {
    const t = document
      .querySelector("formdata-demo")
      ?.shadowRoot?.querySelector("#target");
    return t ? t.textContent.trim() : null;
  });

test("源码形态：键随 o-if 显隐与 fill 项增删跟随 / source mode tracks keys", async ({
  page,
}) => {
  await page.goto(SRC);
  await page
    .locator("formdata-demo")
    .waitFor({ state: "visible", timeout: 30000 });

  // 初始：常驻 a + fill 项 K1/K2
  await page.waitForFunction(
    () =>
      document
        .querySelector("formdata-demo")
        ?.shadowRoot?.querySelector("#target")?.textContent?.trim() ===
      '{"a":"I am A","K1":"1","K2":"2"}',
    undefined,
    { timeout: 15000 },
  );

  // o-if 显示 → b 键出现；隐藏 → b 键消失
  await page.evaluate(() => window.$("formdata-demo").count++);
  await page.waitForFunction(
    () =>
      document
        .querySelector("formdata-demo")
        ?.shadowRoot?.querySelector("#target")?.textContent?.startsWith(
          '{"a":"I am A","K1":"1","K2":"2","b"',
        ),
    undefined,
    { timeout: 15000 },
  );

  await page.evaluate(() => window.$("formdata-demo").count++);
  await page.waitForFunction(
    () =>
      document
        .querySelector("formdata-demo")
        ?.shadowRoot?.querySelector("#target")?.textContent?.trim() ===
      '{"a":"I am A","K1":"1","K2":"2"}',
    undefined,
    { timeout: 15000 },
  );

  // fill 项增加 → K3 出现
  await page.evaluate(() => window.$("formdata-demo").addItem());
  await page.waitForFunction(
    () =>
      document
        .querySelector("formdata-demo")
        ?.shadowRoot?.querySelector("#target")?.textContent?.includes(
          '"K3":"3"',
        ),
    undefined,
    { timeout: 15000 },
  );

  // 编辑回写：用户输入 → data
  const input = page.locator('input[name="a"]');
  await input.fill("I am A2");
  await page.waitForFunction(
    () =>
      document
        .querySelector("formdata-demo")
        ?.shadowRoot?.querySelector("#target")?.textContent?.startsWith(
          '{"a":"I am A2"',
        ),
    undefined,
    { timeout: 15000 },
  );
});

test("dist 产物冒烟：经典脚本 dist ofa + dist 插件 / dist artifacts smoke", async ({
  page,
}) => {
  await page.goto(DIST);

  // 插件把 formData 注册到了 $.fn 上
  await page.waitForFunction(
    () => typeof window.$.fn.formData === "function",
    undefined,
    { timeout: 15000 },
  );

  const target = page.locator("#target"); // dist 页的 #target 在光 DOM
  await target.waitFor({ state: "visible", timeout: 15000 });

  // 初始收集：文本值 + checkbox（未勾选也以空数组形态收集）
  expect(await page.evaluate(() => window.__initialData)).toBe(
    '{"a":"I am A","agree":[]}',
  );

  // 用户输入 → data
  await page.locator('input[name="a"]').fill("I am A2");
  await page.waitForFunction(
    () => document.querySelector("#target").textContent.includes('"a":"I am A2"'),
    undefined,
    { timeout: 15000 },
  );

  // data → 表单（双向；证明插件用的 stanz 与页面框架同实例）
  await page.evaluate(() => window.__setData("a", "from-data"));
  await page.waitForFunction(
    () => document.querySelector('input[name="a"]').value === "from-data",
    undefined,
    { timeout: 15000 },
  );

  // checkbox 勾选 → 聚合为数组
  await page.locator('input[name="agree"]').check();
  await page.waitForFunction(
    () =>
      document.querySelector("#target").textContent.includes('"agree":["yes"]'),
    undefined,
    { timeout: 15000 },
  );

  // 与 dist ofa 同一份框架实例；版本随 bump 演进，只校验形态
  expect(await page.evaluate(() => typeof window.$.stanz)).toBe("function");
  expect(await page.evaluate(() => /^\d+\.\d+\.\d+$/.test(window.$.version))).toBe(
    true,
  );
});
