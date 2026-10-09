import { test, expect } from "@playwright/test";

test("provider and consumer attributes", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/normal.html");

  const c1_a = await page.evaluate(async () => {
    return $("#con1").customA;
  });

  const c1_a_attr = await page.evaluate(async () => {
    return $("#con1").ele.getAttribute("custom-a");
  });

  const c1_b_attr = await page.evaluate(async () => {
    return $("#con1").ele.getAttribute("custom-b");
  });

  await expect(c1_a).toBe("I am A");
  await expect(c1_a_attr).toBe(null);
  await expect(c1_b_attr).toBe(null);

  const c2_a = await page.evaluate(async () => {
    return $("#con2").customA;
  });

  const c2_a_attr = await page.evaluate(async () => {
    return $("#con2").ele.getAttribute("custom-a");
  });

  const c2_b_attr = await page.evaluate(async () => {
    return $("#con2").ele.getAttribute("custom-b");
  });

  await expect(c2_a).toBe("I am A");
  await expect(c2_a_attr).toBe("I am A");
  await expect(c2_b_attr).toBe(null);

   await page.waitForTimeout(500);

  const c3_a = await page.evaluate(async () => {
    return $("#con3").customA;
  });

  const c3_a_attr = await page.evaluate(async () => {
    return $("#con3").ele.getAttribute("custom-a");
  });
  const c3_b_attr = await page.evaluate(async () => {
    return $("#con3").ele.getAttribute("custom-b");
  });

  await expect(c3_a).toBe("I am A");
  await expect(c3_a_attr).toBe(null);
  await expect(c3_b_attr).toBe("I am B");
});

test("change provider props", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/normal.html");

  await expect(await page.evaluate(() => $("#con1").customA)).toBe("I am A");
  await expect(await page.evaluate(() => $("#con2").customA)).toBe("I am A");

  await page.evaluate(() => {
    $("o-provider").customA = "change A";
    $("o-provider").customB = "change B";
  });

  await expect(await page.evaluate(() => $("#con1").customA)).toBe("change A");
  await expect(await page.evaluate(() => $("#con2").customA)).toBe("change A");
  await expect(await page.evaluate(() => $("#con1").customB)).toBe("change B");
  await expect(await page.evaluate(() => $("#con2").customB)).toBe("change B");

   await page.waitForTimeout(500);

  await expect(await page.evaluate(() => $("#con3").customA)).toBe("change A");
  await expect(await page.evaluate(() => $("#con3").customB)).toBe("change B");
});

test("change consumer in shadow", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/normal.html");

  await page.waitForTimeout(100);

  await expect(await page.evaluate(() => $("comp-two").ca)).toBe("I am A");

  await page.evaluate(() => {
    $("o-provider").customA = "change A";
  });

  await expect(await page.evaluate(() => $("comp-two").ca)).toBe("change A");
});

test("change provider in shadow", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/context/provider-in-shadow.html"
  );

  await page.waitForTimeout(100);

  await expect(await page.evaluate(() => $("#con5").customA)).toBe("A in One");
  await expect(await page.evaluate(() => $("#con5").customB)).toBe("I am B");
  await expect(await page.evaluate(() => $("#con5").customC)).toBe("C in One");

  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customA)
  ).toBe("A in One");
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customB)
  ).toBe("I am B");
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customC)
  ).toBe("C in One");

  await expect(await page.evaluate(() => $("#con6").customA)).toBe("A in One");
  await expect(await page.evaluate(() => $("#con6").customB)).toBe("I am B");
  await expect(await page.evaluate(() => $("#con6").customC)).toBe("C in One");

  await page.evaluate(() => {
    return ($("comp-one").shadow.$("o-provider").customA = "change A in One");
  });

  await expect(await page.evaluate(() => $("#con5").customA)).toBe(
    "change A in One"
  );
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customA)
  ).toBe("change A in One");
  await expect(await page.evaluate(() => $("#con6").customA)).toBe(
    "change A in One"
  );
});

test("change name in provider", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/change-name.html");

  await page.waitForTimeout(200);

  await expect(await page.evaluate(() => $("#con6").customA)).toBe("A in One");
  await expect(await page.evaluate(() => $("#con6").customB)).toBe(undefined);
  await expect(await page.evaluate(() => $("#con6").customC)).toBe("C in One");

  await page.evaluate(() => {
    $("#con6").name = "test2";
  });

  await expect(await page.evaluate(() => $("#con6").customA)).toBe("I am A");
  await expect(await page.evaluate(() => $("#con6").customB)).toBe("I am B");
  await expect(await page.evaluate(() => $("#con6").customC)).toBe(undefined);

  await page.evaluate(() => {
    $("#con6").name = "test3";
  });

  await expect(await page.evaluate(() => $("#con6").customA)).toBe(undefined);
  await expect(await page.evaluate(() => $("#con6").customB)).toBe(undefined);
  await expect(await page.evaluate(() => $("#con6").customC)).toBe(undefined);
});

test("root provider", async ({ page }) => {
  await page.goto(
    "http://localhost:3348/test/cases/context/root-provider.html"
  );

  await page.waitForTimeout(400);

  await expect(await page.evaluate(() => $("#con1").customA)).toBe("I am A");
  await expect(await page.evaluate(() => $("#con1").customB)).toBe(
    "root custom b"
  );
  await expect(await page.evaluate(() => $("#con1").customC)).toBe(
    "root custom c"
  );
  await expect(await page.evaluate(() => $("#con1").attr("custom-b"))).toBe(
    null
  );

  await expect(await page.evaluate(() => $("#con2").customA)).toBe("I am A");
  await expect(await page.evaluate(() => $("#con2").customB)).toBe("Sub B");
  await expect(await page.evaluate(() => $("#con2").customC)).toBe(
    "root custom c"
  );

  await expect(await page.evaluate(() => $("#con3").customA)).toBe("I am A");
  await expect(await page.evaluate(() => $("#con3").customB)).toBe(
    "root custom b"
  );
  await expect(await page.evaluate(() => $("#con3").customC)).toBe(
    "root custom c"
  );
  await expect(await page.evaluate(() => $("#con3").attr("custom-b"))).toBe(
    "root custom b"
  );

  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customA)
  ).toBe("I am A");
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customB)
  ).toBe("root custom b");
  await expect(
    await page.evaluate(() => $("comp-two").shadow.$("o-consumer").customC)
  ).toBe("root custom c");
  await expect(
    await page.evaluate(() =>
      $("comp-two").shadow.$("o-consumer").attr("custom-b")
    )
  ).toBe("root custom b");

  await page.evaluate(() => {
    $("o-root-provider").customB = "change root b";
  });

  await expect(await page.evaluate(() => $("#con1").customB)).toBe(
    "change root b"
  );
  await expect(await page.evaluate(() => $("#con2").customB)).toBe("Sub B");
  await expect(await page.evaluate(() => $("#con3").customB)).toBe(
    "change root b"
  );
  await expect(
    await page.evaluate(() =>
      $("comp-two").shadow.$("o-consumer").attr("custom-b")
    )
  ).toBe("change root b");

  await page.evaluate(() => {
    $("o-root-provider").remove();
  });

  await expect(await page.evaluate(() => $("#con1").customB)).toBe(undefined);
  await expect(await page.evaluate(() => $("#con2").customB)).toBe("Sub B");
  await expect(await page.evaluate(() => $("#con3").customB)).toBe(undefined);
  await expect(
    await page.evaluate(() =>
      $("comp-two").shadow.$("o-consumer").attr("custom-b")
    )
  ).toBe(null);
});

test("dispatch event from provider", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/context/dispatch.html");

  await page.waitForTimeout(400);

  const con1_text = await page.evaluate(async () => {
    return $("#result1").text;
  });

  const con2_text = await page.evaluate(async () => {
    return $("#result2").text;
  });

  await expect(con1_text).toBe("con1 got: Hello World");
  await expect(con2_text).toBe("con2 got: Hello World");
});
