import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: /auth\.spec\.ts/,
  timeout: 90000,
  expect: { timeout: 15000 },
  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- -p 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
