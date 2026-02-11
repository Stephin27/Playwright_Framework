import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
    testDir: './tests',
    timeout: 120 * 1000,
    expect: {
        timeout: 5 * 1000
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.RETRIES ? parseInt(process.env.RETRIES) : (process.env.CI ? 2 : 0),
    workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
    reporter: [
        ['line'],
        ['html', { open: 'never' }],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: false
        }]
    ],
    use: {
        actionTimeout: 20 * 1000,
        navigationTimeout: 60 * 1000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        headless: process.env.HEADLESS === 'true'
    },
    projects: [
        {
            name: process.env.BROWSER || 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Uncomment for other browsers
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],
});
