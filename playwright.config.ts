import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './src/specs',
  timeout: 205000,
  expect: {
    timeout: 5000
  },
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
 //reporter: "allure-playwright",
  use: {
    headless: false,
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
    actionTimeout: 0,
    trace: 'on-first-retry',
    launchOptions: {
      logger: {
        isEnabled: (name, severity) => name === 'browser',
        log: (name, severity, message, args) =>
          console.log(`${name} ${message}`)
      }
    }
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome web',
      use: {
        channel: 'chrome' // msedge
      }
    }
  ],
  outputDir: 'test-results/'
};

export default config;
