const { defineConfig, devices } = require("@playwright/test");

const isCI = Boolean(process.env.CI);
const baseURL =
  process.env.BASE_URL ||
  (isCI ? "http://127.0.0.1:8000" : "https://bendavies.me");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO || 0),
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: isCI
    ? {
        command: "python3 -m http.server 8000 --directory site",
        url: baseURL,
        reuseExistingServer: false,
      }
    : undefined,
});
