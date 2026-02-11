import { Page, Locator } from '@playwright/test';
import { Helpers } from '../utils/helpers';
import { BasePage } from './BasePage';

export class AlertsPage extends BasePage {

    // Locators
    readonly simpleAlertButton: Locator;
    readonly timerAlertButton: Locator;
    readonly confirmAlertButton: Locator;
    readonly promptAlertButton: Locator;

    // Result locators
    readonly confirmResult: Locator;
    readonly promptResult: Locator;

    constructor(page: Page) {
        super(page);

        this.simpleAlertButton = page.locator('#alertButton');

        this.timerAlertButton = page.locator('#timerAlertButton');
        this.confirmAlertButton = page.locator('#confirmButton');
        this.promptAlertButton = page.locator('#promtButton');

        this.confirmResult = page.locator('#confirmResult');
        this.promptResult = page.locator('#promptResult');
    }

    async navigateToAlerts() {
        await Helpers.navigateTo(this.page, '/alerts');
    }

    async triggerSimpleAlert() {
        // The intent "Click Button" will be used by the Healer Agent to find the element
        await this.safeClick('Click Button', this.simpleAlertButton);
    }

    async triggerTimerAlert() {
        await this.safeClick('On button click, alert will appear after 5 seconds', this.timerAlertButton);
    }

    async triggerConfirmAlert() {
        await this.safeClick('On button click, confirm box will appear', this.confirmAlertButton);
    }

    async triggerPromptAlert() {
        await this.safeClick('On button click, prompt box will appear', this.promptAlertButton);
    }

}
