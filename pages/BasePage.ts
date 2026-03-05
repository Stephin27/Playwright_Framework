import { Page, Locator } from '@playwright/test';
import { RecoveryManager } from '../utils/RecoveryManager';

export class BasePage {
    readonly page: Page;
    readonly recovery: RecoveryManager;

    constructor(page: Page) {
        this.page = page;
        this.recovery = new RecoveryManager(page);
        this.setupAdBlocking();
    }

    private async setupAdBlocking() {
        // Block ad-related domains at the network level
        await this.page.route('**/*', (route) => {
            const url = route.request().url();
            const adDomains = [
                'google-analytics.com',
                'googletagservices.com',
                'adservice.google.com',
                'pagead2.googlesyndication.com',
                'doubleclick.net',
                'adnxs.com',
                'carbonads.net',
                'fixedban',
                'adsbygoogle',
                'amazon-adsystem',
                'googlesyndication'
            ];

            if (adDomains.some(domain => url.includes(domain))) {
                route.abort();
            } else {
                route.continue();
            }
        });
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
