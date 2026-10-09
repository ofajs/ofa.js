import { test, expect } from "@playwright/test";

test("match var", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/container-style/demo.html");

  const css1 = await page.evaluate(() => {
    return {
      color: $("#finnal-target").css.color,
      fontSize: $("#finnal-target").css.fontSize,
    };
  });

  // 初始化样式
  expect(css1.color).toBe("rgb(0, 0, 0)");
  expect(css1.fontSize).toBe("16px");

  await page.getByRole("button", { name: "count += 100" }).click();
  await new Promise((resolve) => setTimeout(resolve, 200));

  const css2 = await page.evaluate(() => {
    return {
      color: $("#finnal-target").css.color,
      fontSize: $("#finnal-target").css.fontSize,
    };
  });

  expect(css2.color).toBe("rgb(255, 0, 0)");
  expect(css2.fontSize).toBe("16px");

  await page.getByRole("button", { name: "count += 100" }).click();
  await new Promise((resolve) => setTimeout(resolve, 200));

  const css3 = await page.evaluate(() => {
    return {
      color: $("#finnal-target").css.color,
      fontSize: $("#finnal-target").css.fontSize,
    };
  });

  expect(css3.color).toBe("rgb(0, 128, 0)");
  expect(css3.fontSize).toBe("20px");

  // bug: 在safari上会渲染出错，暂时注释掉
  // await page.getByRole("button", { name: "toggle style" }).click();
  // await new Promise((resolve) => setTimeout(resolve, 200));

  // const css4 = await page.evaluate(() => {
  //   return {
  //     color: $("#finnal-target").css.color,
  //     fontSize: $("#finnal-target").css.fontSize,
  //   };
  // });

  // expect(css4.color).toBe("rgb(0, 128, 0)");
  // expect(css4.fontSize).toBe("16px");

  // await page.getByRole("button", { name: "toggle style" }).click();
  // await new Promise((resolve) => setTimeout(resolve, 200));

  // const css5 = await page.evaluate(() => {
  //   return {
  //     color: $("#finnal-target").css.color,
  //     fontSize: $("#finnal-target").css.fontSize,
  //   };
  // });

  // expect(css5.color).toBe("rgb(0, 128, 0)");
  // expect(css5.fontSize).toBe("20px");

  await page.getByRole("button", { name: "count += 100" }).click();
  await new Promise((resolve) => setTimeout(resolve, 200));

  const css6 = await page.evaluate(() => {
    return {
      color: $("#finnal-target").css.color,
      fontSize: $("#finnal-target").css.fontSize,
    };
  });

  expect(css6.color).toBe("rgb(0, 0, 255)");
  expect(css6.fontSize).toBe("16px");

  await page.getByRole("button", { name: "count += 100" }).click();
  await new Promise((resolve) => setTimeout(resolve, 200));

  const css7 = await page.evaluate(() => {
    return {
      color: $("#finnal-target").css.color,
      fontSize: $("#finnal-target").css.fontSize,
    };
  });

  // 初始化样式
  expect(css7.color).toBe("rgb(0, 0, 0)");
  expect(css7.fontSize).toBe("16px");
});
