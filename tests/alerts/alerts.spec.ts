import { test, expect } from '@playwright/test';
import { AlertsPage } from '../../pages/AlertsPage';
import { TestData } from '../../utils/testData';
import { Helpers } from '../../utils/helpers';
import { Assertions } from '../../utils/assertions';
import { Logger } from '../../utils/Logger';

test.describe('DemoQA Alerts Tests', () => {
    let alertsPage: AlertsPage;

    test.beforeEach(async ({ page }) => {
        alertsPage = new AlertsPage(page);
        Logger.info(`Navigating to Alerts page: ${TestData.ALERTS_URL}`);
        await Helpers.navigateTo(page, TestData.ALERTS_URL);
    });

    test('Simple Alert', async ({ page }) => {
        Logger.info('Starting Simple Alert test');
        // Setup listener
        page.once('dialog', async dialog => {
            Logger.info(`Dialog encountered: ${dialog.type()} - "${dialog.message()}"`);
            expect(dialog.type()).toBe('alert');
            expect(dialog.message()).toBe('You clicked a button');
            await dialog.accept();
            Logger.info('Simple Alert accepted');
        });

        await alertsPage.triggerSimpleAlert();
    });

    test('Timer Alert (Wait 5 seconds)', async ({ page }) => {
        Logger.info('Starting Timer Alert test');
        // This time we need to wait for the dialog event as it comes later
        const dialogPromise = page.waitForEvent('dialog');

        await alertsPage.triggerTimerAlert();
        Logger.info('Timer alert triggered, waiting for dialog...');

        const dialog = await dialogPromise;
        Logger.info(`Dialog encountered: ${dialog.type()} - "${dialog.message()}"`);
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('This alert appeared after 5 seconds');
        await dialog.accept();
        Logger.info('Timer Alert accepted');
    });

    test('Confirm Alert - Accept', async ({ page }) => {
        Logger.info('Starting Confirm Alert - Accept test');
        page.once('dialog', async dialog => {
            Logger.info(`Dialog encountered: ${dialog.type()} - "${dialog.message()}"`);
            expect(dialog.type()).toBe('confirm');
            expect(dialog.message()).toBe('Do you confirm action?');
            await dialog.accept();
            Logger.info('Confirm Alert accepted');
        });

        await alertsPage.triggerConfirmAlert();
        await expect(alertsPage.confirmResult).toContainText('You selected Ok');
    });

    test('Confirm Alert - Dismiss', async ({ page }) => {
        Logger.info('Starting Confirm Alert - Dismiss test');
        page.once('dialog', async dialog => {
            Logger.info(`Dialog encountered: ${dialog.type()} - "${dialog.message()}"`);
            expect(dialog.type()).toBe('confirm');
            await dialog.dismiss();
            Logger.info('Confirm Alert dismissed');
        });

        await alertsPage.triggerConfirmAlert();
        await expect(alertsPage.confirmResult).toHaveText('You selected Cancel');
    });

    test('Prompt Alert', async ({ page }) => {
        Logger.info('Starting Prompt Alert test');
        const testName = 'Antigravity User';

        page.once('dialog', async dialog => {
            Logger.info(`Dialog encountered: ${dialog.type()} - "${dialog.message()}"`);
            expect(dialog.type()).toBe('prompt');
            expect(dialog.message()).toBe('Please enter your name');
            await dialog.accept(testName);
            Logger.info(`Prompt Alert accepted with name: ${testName}`);
        });

        await alertsPage.triggerPromptAlert();
        await expect(alertsPage.promptResult).toContainText(`You entered ${testName}`);
    });
});
