import { Page, expect, Locator } from '@playwright/test';

export class Assertions {

    static async assertTitle(page: Page, expectedTitle: string) {
        await expect(page).toHaveTitle(expectedTitle);
    }

    static async assertURL(page: Page, expectedURL: string) {
        await expect(page).toHaveURL(expectedURL);
    }

    static async assertElementVisible(page: Page, selector: string) {
        const element = page.locator(selector);
        await expect(element).toBeVisible();
    }

    static async assertElementText(page: Page, selector: string, expectedText: string) {
        const element = page.locator(selector);
        await expect(element).toHaveText(expectedText);
    }

    static async assertElementContainsText(page: Page, selector: string, expectedText: string) {
        const element = page.locator(selector);
        await expect(element).toContainText(expectedText);
    }

    static async assertCheckboxChecked(page: Page, selector: string) {
        const element = page.locator(selector);
        await expect(element).toBeChecked();
    }
}
