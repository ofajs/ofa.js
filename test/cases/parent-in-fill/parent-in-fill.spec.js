import { test, expect } from "@playwright/test";

test("$parent in o-fill test", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/parent-in-fill/demo.html");

  await new Promise((resolve) => setTimeout(resolve, 200));

  // 测试初始渲染
  const fillItems = await page.$$('[data-testid="fill-item"]');
  expect(fillItems.length).toBe(3);

  // 验证第一项的内容
  const firstItem = fillItems[0];
  const firstItemText = await firstItem.textContent();
  expect(firstItemText).toContain("Item 1");
  expect(firstItemText).toContain("Item Value: 100");
  expect(firstItemText).toContain("Component Start Balance: ¥10,000.00");
  expect(firstItemText).toContain("Component Interest Rate: 5.5%");

  // 验证嵌套项
  const nestedItems = await page.$$('[data-testid="nested-item"]');
  expect(nestedItems.length).toBe(3); // 2 + 1 + 0

  // 验证第一个嵌套项可以访问父级数据
  const firstNestedText = await nestedItems[0].textContent();
  expect(firstNestedText).toContain("Nested 1-1");
  expect(firstNestedText).toContain("Access Parent Item Name: Item 1");
  expect(firstNestedText).toContain("Access Parent Item Value: 100");

  // 测试改变父级数据
  await page.getByTestId("change-balance").click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 验证父级数据变化后，组件数据更新
  const updatedFirstItem = await page.$('[data-testid="fill-item"]');
  const updatedText = await updatedFirstItem.textContent();
  expect(updatedText).toContain("Component Start Balance: ¥");
  expect(updatedText).not.toContain("Component Start Balance: ¥10,000.00");

  // 测试改变 items
  await page.getByTestId("change-items").click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  const newFillItems = await page.$$('[data-testid="fill-item"]');
  expect(newFillItems.length).toBe(2);

  const newFirstItemText = await newFillItems[0].textContent();
  expect(newFirstItemText).toContain("New Item 1");
  expect(newFirstItemText).toContain("Item Value: 500");

  // 测试添加嵌套项
  const beforeNestedCount = (await page.$$('[data-testid="nested-item"]')).length;
  await page.getByTestId("add-nested").click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  const afterNestedCount = (await page.$$('[data-testid="nested-item"]')).length;
  expect(afterNestedCount).toBe(beforeNestedCount + 1);

  // 验证新添加的嵌套项也能正确访问 $parent
  const lastNestedItem = (await page.$$('[data-testid="nested-item"]')).pop();
  const lastNestedText = await lastNestedItem.textContent();
  expect(lastNestedText).toContain("New Nested");
  expect(lastNestedText).toContain("Access Parent Item Name: New Item 1");
  expect(lastNestedText).toContain("Access Parent Item Value: 500");
});

test("$parent data binding consistency", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/parent-in-fill/demo.html");

  await new Promise((resolve) => setTimeout(resolve, 200));

  // 获取初始组件数据
  const parentDataElement = await page.$(".parent-data");
  const initialParentText = await parentDataElement.textContent();
  expect(initialParentText).toContain("Start Balance: ¥10,000.00");

  // 验证 fill 项中的组件数据与父级一致
  const firstFillItem = await page.$('[data-testid="fill-item"]');
  const fillItemText = await firstFillItem.textContent();
  expect(fillItemText).toContain("Component Start Balance: ¥10,000.00");

  // 改变组件数据
  await page.getByTestId("change-balance").click();
  await new Promise((resolve) => setTimeout(resolve, 100));

  // 验证组件显示更新
  const updatedParentText = await parentDataElement.textContent();
  expect(updatedParentText).not.toContain("Start Balance: ¥10,000.00");

  // 验证 fill 项中的组件数据也同步更新
  const updatedFillItemText = await firstFillItem.textContent();
  expect(updatedFillItemText).not.toContain("Component Start Balance: ¥10,000.00");
  
  // 确保两个地方显示的值一致
  const parentBalance = updatedParentText.match(/Start Balance: ¥([\d,]+\.?\d*)/)?.[1];
  const fillComponentBalance = updatedFillItemText.match(/Component Start Balance: ¥([\d,]+\.?\d*)/)?.[1];
  expect(parentBalance).toBe(fillComponentBalance);
});
