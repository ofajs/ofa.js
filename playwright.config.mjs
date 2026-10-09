import { defineConfig, devices } from "@playwright/test";

// monorepo 根级 playwright 配置：统一跑各 packages 下的测试
export default defineConfig({
  // 扫描 packages/*/test 下的 spec
  testDir: "packages",
  testMatch: "**/test/**/*.spec.js",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    // 页面统一通过 baseURL + 相对路径访问
    baseURL: "http://localhost:3348",
    trace: "on-first-retry",
  },
  // 三大浏览器套件即兼容性矩阵
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  // 测试前自动起静态服务器；本地复用已运行实例
  webServer: {
    command: "node scripts/static-server.mjs .",
    url: "http://localhost:3348/packages/drill/test/statics/loader.html",
    reuseExistingServer: !process.env.CI,
  },
});
