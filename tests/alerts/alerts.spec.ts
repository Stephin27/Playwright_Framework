import { test, expect } from '@playwright/test';
import { AlertsPage } from '../../pages/AlertsPage';
import { TestData } from '../../utils/testData';
import { Helpers } from '../../utils/helpers';
import { Assertions } from '../../utils/assertions';

test.describe('DemoQA Alerts Tests', () => {
    let alertsPage: AlertsPage;

    test.beforeEach(async ({ page }) => {
        alertsPage = new AlertsPage(page);
        await Helpers.navigateTo(page, TestData.ALERTS_URL);
    });

    test('Simple Alert', async ({ page }) => {
        // Setup listener
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('You clicked a button');
            await dialog.accept();
        });

        await alertsPage.triggerSimpleAlert();
    });

    test('Timer Alert (Wait 5 seconds)', async ({ page }) => {
        // This time we need to wait for the dialog event as it comes later
        const dialogPromise = page.waitForEvent('dialog');

        await alertsPage.triggerTimerAlert();

        const dialog = await dialogPromise;
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('This alert appeared after 5 seconds');
        await dialog.accept();
    });

    test('Confirm Alert - Accept', async ({ page }) => {
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toBe('Do you confirm action?');
            await dialog.accept();
        });

        await alertsPage.triggerConfirmAlert();
        await expect(alertsPage.confirmResult).toContainText('You selected Ok');
    });

    test('Confirm Alert - Dismiss', async ({ page }) => {
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            await dialog.dismiss();
        });

        await alertsPage.triggerConfirmAlert();
        await expect(alertsPage.confirmResult).toHaveText('You selected Cancel');
    });

    test('Prompt Alert', async ({ page }) => {
        const testName = 'Antigravity User';

        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('prompt');
            expect(dialog.message()).toBe('Please enter your name');
            await dialog.accept(testName);
        });

        await alertsPage.triggerPromptAlert();
        await expect(alertsPage.promptResult).toContainText(`You entered ${testName}`);
    });
});
