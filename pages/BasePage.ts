import { Page, Locator } from '@playwright/test';
import { RecoveryManager } from '../utils/RecoveryManager';

export class BasePage {
    readonly page: Page;
    readonly recovery: RecoveryManager;

    constructor(page: Page) {
        this.page = page;
        this.recovery = new RecoveryManager(page);
    }

    async safeClick(intent: string, fallbackLocator: Locator) {
        await this.recovery.executeWithFallback(
            { intent, fallbackLocator },
            async (loc) => {
                await loc.scrollIntoViewIfNeeded();
                await loc.click();
            }
        );
    }

    async safeFill(intent: string, fallbackLocator: Locator, value: string) {
        await this.recovery.executeWithFallback(
            { intent, fallbackLocator },
            async (loc) => {
                await loc.scrollIntoViewIfNeeded();
                await loc.fill(value);
            }
        );
    }
}
