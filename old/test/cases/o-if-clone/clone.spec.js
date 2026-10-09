import { test, expect } from "@playwright/test";

// 回归测试：条件/填充组件在无子元素的构造场景下不应报错
// （第三方库如 snapdom 克隆 DOM 时，自定义元素构造函数先于子节点挂载执行）
test("create and clone o-if / o-fill without children", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(err.message));

  await page.goto("http://localhost:3348/test/cases/o-if-clone/demo.html");

  // 正常渲染不受影响
  await page.waitForSelector("#big");
  expect(await page.$eval("#big", (el) => el.textContent.trim())).toBe(
    "I am 2 red",
  );
  expect(await page.$$("[data-testid=item]")).toHaveLength(2);

  // createElement 时元素没有子节点，构造函数不应抛错
  const createResult = await page.evaluate(() => {
    const results = {};
    ["o-if", "o-else-if", "o-else", "o-fill"].forEach((tag) => {
      try {
        document.body.appendChild(document.createElement(tag));
        results[tag] = "ok";
      } catch (err) {
        results[tag] = err.message;
      }
    });
    return results;
  });

  Object.entries(createResult).forEach(([tag, result]) => {
    expect(result, `${tag} create failed`).toBe("ok");
  });

  // cloneNode(true) 深克隆已渲染的元素，构造函数先执行，不应抛错且克隆内容保留
  const cloneResult = await page.evaluate(() => {
    const results = {};
    ["o-if", "o-else", "o-fill"].forEach((tag) => {
      try {
        const live = document.querySelector(tag);
        const cloned = live.cloneNode(true);
        results[tag] = {
          ok: true,
          childCount: cloned.children.length,
          liveChildCount: live.children.length,
        };
      } catch (err) {
        results[tag] = { ok: false, err: err.message };
      }
    });
    return results;
  });

  Object.entries(cloneResult).forEach(([tag, result]) => {
    expect(result.ok, `${tag} clone failed: ${result.err}`).toBe(true);
    expect(result.childCount, `${tag} clone lost children`).toBe(
      result.liveChildCount,
    );
  });

  await page.waitForTimeout(100);
  expect(pageErrors).toEqual([]);
});
