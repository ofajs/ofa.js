import { test, expect } from "@playwright/test";

test("o-if in o-fill", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/oif-hybird-ofill/demo1.html"
  );

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":0}]
    count: 0 blue`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":1}]
    count: 1 red`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":2}]
    count: 2 blue`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinfill")).toContainText(`[{"count":3}]
      count: 3 red`);
});

test("o-if in o-if", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/oif-hybird-ofill/demo2.html"
  );

  await expect(page.locator("c-ifinif")).toContainText(`{"count":-1}
count: -1 green`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":0}
count: 0 pink`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":1}
count: 1 red`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":2}
count: 2 yellow`);

  await page.getByRole("button", { name: "AddOne" }).click();

  await expect(page.locator("c-ifinif")).toContainText(`{"count":3}
count: 3 blue`);
});

test("o-fill in o-if", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/oif-hybird-ofill/demo3.html"
  );

  await expect(page.locator("c-fillinif"))
    .toContainText(`{"showList":true,"items":["A","B","C"]}
    item: A
    item: B
    item: C`);

  await page.getByRole("button", { name: "Toggle List" }).click();
  await expect(page.locator("c-fillinif"))
    .toContainText(`{"showList":false,"items":["A","B","C"]}
    List is hidden`);

  await page.getByRole("button", { name: "Toggle List" }).click();
  await page.getByRole("button", { name: "Add Item" }).click();
  await expect(page.locator("c-fillinif"))
    .toContainText(`{"showList":true,"items":["A","B","C","D"]}
  item: A
  item: B
  item: C
  item: D`);
});

test("o-fill in o-fill", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/oif-hybird-ofill/demo4.html"
  );

  await expect(page.locator("c-fillinfill")).toContainText(
    `Outer: [{\"id\":1,\"innerArr\":[\"A\",\"B\"]},{\"id\":2,\"innerArr\":[\"C\",\"D\"]}]
          Outer Item: 1
          Inner: [\"A\",\"B\"]
            Inner Item: A
            Inner Item: B
          Outer Item: 2
          Inner: [\"C\",\"D\"]
            Inner Item: C
            Inner Item: D`
  );

  await page.getByRole("button", { name: "Add Outer Item" }).click();
  await expect(page.locator("c-fillinfill")).toContainText(
    `Outer: [{\"id\":1,\"innerArr\":[\"A\",\"B\"]},{\"id\":2,\"innerArr\":[\"C\",\"D\"]},{\"id\":3,\"innerArr\":[\"Item 3-1\",\"Item 3-2\"]}]
          Outer Item: 1
          Inner: [\"A\",\"B\"]
            Inner Item: A
            Inner Item: B
          Outer Item: 2
          Inner: [\"C\",\"D\"]
            Inner Item: C
            Inner Item: D
          Outer Item: 3
          Inner: [\"Item 3-1\",\"Item 3-2\"]
            Inner Item: Item 3-1
            Inner Item: Item 3-2`
  );

  await page
    .getByRole("button", { name: "Add Inner Item to First Outer" })
    .click();
  await expect(page.locator("c-fillinfill")).toContainText(
    `Outer: [{\"id\":1,\"innerArr\":[\"A\",\"B\",\"C\"]},{\"id\":2,\"innerArr\":[\"C\",\"D\"]},{\"id\":3,\"innerArr\":[\"Item 3-1\",\"Item 3-2\"]}]
          Outer Item: 1
          Inner: [\"A\",\"B\",\"C\"]
            Inner Item: A
            Inner Item: B
            Inner Item: C
          Outer Item: 2
          Inner: [\"C\",\"D\"]
            Inner Item: C
            Inner Item: D
          Outer Item: 3
          Inner: [\"Item 3-1\",\"Item 3-2\"]
            Inner Item: Item 3-1
            Inner Item: Item 3-2`
  );
});
