import { defineConfig, devices } from '@playwright/test';

const liveUrl = process.env.E2E_BASE_URL;
const python = process.env.PYTHON || 'python';

export default defineConfig({
  testDir: './e2e',
  timeout: liveUrl ? 180_000 : 60_000,
  expect: { timeout: liveUrl ? 60_000 : 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: liveUrl || 'http://localhost:5175',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'laptop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] }, grep: /@phone/ },
  ],
  webServer: liveUrl
    ? undefined
    : [
        {
          command: `rm -f e2e.db && ${python} -m uvicorn app.main:app --port 8002`,
          cwd: './backend',
          url: 'http://localhost:8002/api/health',
          env: {
            DATABASE_URL: 'sqlite:///./e2e.db',
            SECRET_KEY: 'e2e-secret-key-that-is-long-enough',
            FRONTEND_ORIGINS: 'http://localhost:5175',
            RESEND_API_KEY: '',
          },
          reuseExistingServer: false,
          timeout: 60_000,
        },
        {
          command: 'npm run dev -- --port 5175 --strictPort',
          url: 'http://localhost:5175',
          env: { VITE_API_URL: 'http://localhost:8002' },
          reuseExistingServer: false,
          timeout: 60_000,
        },
      ],
});
