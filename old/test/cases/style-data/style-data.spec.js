import { test, expect } from "@playwright/test";

test("style data", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/style-data/test.html");

  await page.waitForTimeout(100);

  const data1 = await getData({ page });

  expect(data1.weight).toBe("900");
  expect(data1.color).toBe("rgb(255, 0, 0)");
  expect(data1.size).toBe("20px");

  await page.getByRole("button", { name: "weight:600" }).click();

  await page.waitForTimeout(10);

  const data2 = await getData({ page });
  expect(data2.weight).toBe("400"); // default is 400
  expect(data2.size).toBe("20px");

  await page.getByRole("button", { name: "weight:850" }).click();

  await page.waitForTimeout(10);

  const data3 = await getData({ page });
  expect(data3.weight).toBe("850");
  expect(data3.size).toBe("20px");

  await page.setViewportSize({ width: 540, height: 480 });

  await page.waitForTimeout(10);

  const data4 = await getData({ page });
  expect(data4.size).toBe("16px");
});

const getData = async ({ page }) => {
  const { _preview } = await page.waitForFunction(async () => {
    return JSON.stringify({
      weight: $("sd-demo").shadow.$("#container").css.fontWeight,
      color: $("sd-demo").shadow.$("#container").css.color,
      size: $("sd-demo").shadow.$("#container").css.fontSize,
    });
  });

  return JSON.parse(_preview);
};
