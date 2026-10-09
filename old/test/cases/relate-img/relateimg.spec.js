import { test, expect } from "@playwright/test";

test("relate img src", async ({ page }) => {
  await page.goto("http://localhost:3348/test/cases/relate-img/demo.html");

  await page.waitForTimeout(300);

  const img1src = await page.$eval('[data-testid="img1"]', (el) => el.src);
  await expect(img1src).toBe("http://localhost:3348/test/testimg.jpeg");

  const img2src = await page.$eval('[data-testid="img2"]', (el) => el.src);
  await expect(img2src).toBe("http://localhost:3348/test/testimg.jpeg");

  const img3src = await page.$eval('[data-testid="img3"]', (el) => el.src);
  await expect(img3src).toBe("http://localhost:3348/test/testimg.jpeg");
});
