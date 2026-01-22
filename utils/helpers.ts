import { Page } from '@playwright/test';

export class Helpers {

    static async navigateTo(page: Page, url: string) {
        await page.goto(url);
        await page.waitForLoadState('domcontentloaded');
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
