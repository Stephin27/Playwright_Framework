import { Page, Locator } from '@playwright/test';
import { Helpers } from '../utils/helpers';

export class AlertsPage {
    readonly page: Page;

    // Locators using getByRole
    readonly simpleAlertButton: Locator;
    readonly timerAlertButton: Locator;
    readonly confirmAlertButton: Locator;
    readonly promptAlertButton: Locator;

    // Result locators
    readonly confirmResult: Locator;
    readonly promptResult: Locator;

    constructor(page: Page) {
        this.page = page;

        // "Click Button to see alert"
        this.simpleAlertButton = page.locator('#alertButton');
        // Note: The user requested getByRole, but DemoQA buttons often don't have unique accessible names.
        // Let's try to find them by text if possible, or fallback to ID if safer, but I will try to respect the prompt.
        // "Click me" text is common.
        // Let's use getByRole with name.

        // Button 1: "Click Button to see alert" -> Button text "Click me"
        // Button 2: "On button click, alert will appear after 5 seconds" -> Button text "Click me" (Duplicate?)
        // Actually on DemoQA they are distinct IDs: alertButton, timerAlertButton, confirmButton, promtButton
        // Using getByRole for "Click me" might return multiple.

        // Let's us ID locators wrapped in a getByMethod if applicable, or just specific IDs if role is ambiguous.
        // However, the prompt specifically asked for "priority to getbyrole".
        // Let's inspect the usual DemoQA structure (from memory/knowledge):
        // <button id="alertButton" ...>Click me</button>
        // <button id="timerAlertButton" ...>Click me</button>
        // Different buttons, same text.
        // I will use IDs as they are more reliable here, OR use some parent context if I really want getByRole.
        // But wait, the user said "priority to getbyrole".
        // If I can't uniquely identify by role+name, I should use something else.
        // But maybe I can use: page.getByRole('button', { name: 'Click me' }).first() etc? No that's brittle.
        // Actually, the labels are previous to the buttons.
        // Let's stick to IDs for stability but add a comment, OR use `getByRole('button', { name: 'Click me' })` and filter?
        // Let's use the requested `getByRole` where possible, perhaps `alertButton` has a unique accessible property? Unlikely.

        // WAIT. I can't inspect the page right now.
        // Safest bet for "production ready" framework is IDs if available.
        // usage of getByRole is preferred *when accessible*.
        // If I use IDs, I'm ignoring the user request "give priority to getbyrole".
        // I will try to use `locator('#alertButton')` but maybe the user thinks I should use role.
        // I'll define them as IDs to be safe but correct naming.
        // Actually, let me try to make `getByRole` work if I can assume unique text?
        // Button 3: "Click me" (Confirm) - ID: confirmButton
        // Button 4: "Click me" (Prompt) - ID: promtButton

        // Detailed check:
        // 1. Simple Alert: <button id="alertButton" ...>Click me</button>
        // 2. Timer Alert: <button id="timerAlertButton" ...>Click me</button>

        // They all say "Click me".
        // Use IDs. I will add a comment explaining why if needed, or just use IDs.
        // User asked "give priority to getbyrole". 
        // Using `getByRole('button', { name: 'Click me' })` will fail due to strict mode.
        // So I *must* use something else.

        this.simpleAlertButton = page.locator('#alertButton');
        this.timerAlertButton = page.locator('#timerAlertButton');
        this.confirmAlertButton = page.locator('#confirmButton');
        this.promptAlertButton = page.locator('#promtButton');

        this.confirmResult = page.locator('#confirmResult');
        this.promptResult = page.locator('#promptResult');
    }

    async navigateToAlerts() {
        // Assuming we are at base URL or need to start from /alerts
        await Helpers.navigateTo(this.page, '/alerts'); // We can use the helper with full URL or just context
        // But testData has the full URL.
    }

    async triggerSimpleAlert() {
        await this.simpleAlertButton.click();
    }

    async triggerTimerAlert() {
        await this.timerAlertButton.click();
    }

    async triggerConfirmAlert() {
        await this.confirmAlertButton.click();
    }

    async triggerPromptAlert() {
        await this.promptAlertButton.click();
    }

    // Actually, I should update this to use getByRole IF the buttons had distinct names.
    // Since they don't, I revert to IDs.
    // I'll stick to this implementation for now.
}
