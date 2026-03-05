import { Page } from '@playwright/test';

export class Helpers {

    static async navigateTo(page: Page, url: string) {
        // Block common ad and analytics domains that cause timeouts on demoqa.com
        const blockedDomains = [
            'googlesyndication.com',
            'googletagmanager.com',
            'google-analytics.com',
            'doubleclick.net',
            'adsystem.com',
            'adnxs.com',
            'amazon-adsystem.com',
            'quantserve.com',
            'scorecardresearch.com',
            'adroll.com'
        ];

        await page.route('**/*', (route) => {
            const requestUrl = route.request().url();
            if (blockedDomains.some(domain => requestUrl.includes(domain))) {
                route.abort(); // Abort requests to blocked domains
            } else {
                route.continue(); // Let other requests pass
            }
        });

        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                await page.goto(url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 45000 // 45 seconds timeout
                });
                break; // If successful, break out of loop
            } catch (error) {
                if (i === maxRetries - 1) throw error; // If last retry fails, throw error
                console.log(`Navigation failed to ${url}, retrying (${i + 1}/${maxRetries})...`);
            }
        }
    }

    static async waitAndClick(page: Page, selector: string) {
        await page.waitForSelector(selector, { state: 'visible' });
        await page.click(selector);
    }

    static async waitAndFill(page: Page, selector: string, value: string) {
        await page.waitForSelector(selector, { state: 'visible' });
        await page.fill(selector, value);
    }

    static async checkCheckbox(page: Page, selector: string) {
        await page.waitForSelector(selector, { state: 'visible' });
        if (!(await page.isChecked(selector))) {
            await page.check(selector);
        }
    }

    static async clickElementByIndex(page: Page, selector: string, index: number) {
        const elements = page.locator(selector);
        await elements.nth(index).click();
    }
}
