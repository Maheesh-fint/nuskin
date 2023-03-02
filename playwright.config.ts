import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
const config: PlaywrightTestConfig = {
  testDir: './src/specs',
  timeout: 1940000,
  expect: {
    timeout: 15000
  },
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
reporter: "html",
 //reporter: './src/utils/MyReporter.ts',
  use: {
    baseURL: 'https://test.nuskin.com',
    headless: false,
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 },
    video: 'on-first-retry',
    actionTimeout: 0,
    navigationTimeout: 30 * 1000,
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
