import { test, expect } from '@playwright/test';
import { WidgetsPage } from '../../pages/WidgetsPage';
import { TestData } from '../../utils/testData';
import { Helpers } from '../../utils/helpers';
import { Logger } from '../../utils/Logger';

test.describe('DemoQA Widgets Tests', () => {
    let widgetsPage: WidgetsPage;

    test.beforeEach(async ({ page }) => {
        widgetsPage = new WidgetsPage(page);
        Logger.info(`Navigating to Widgets page: ${TestData.WIDGETS_URL}`);
        await Helpers.navigateTo(page, TestData.WIDGETS_URL);
    });

    test('Accordian Interaction', async ({ page }) => {
        Logger.info('Starting Accordian Interaction test');
        await widgetsPage.navigateToAccordian();

        // Verify default state (Section 1 Open)
        Logger.info('Verifying Section 1 is open by default');
        await expect(widgetsPage.section1Content).toBeVisible();
        await expect(widgetsPage.section2Content).toBeHidden();

        // Close Section 1
        Logger.info('Closing Section 1');
        await widgetsPage.toggleSection1();
        await expect(widgetsPage.section1Content).toBeHidden();

        // Open Section 2
        Logger.info('Opening Section 2');
        await widgetsPage.toggleSection2();
        await expect(widgetsPage.section2Content).toBeVisible();
        Logger.info('Accordian Interaction test completed successfully');
    });

    test('Tabs Switching', async ({ page }) => {
        Logger.info('Starting Tabs Switching test');
        await widgetsPage.navigateToTabs();

        // Default 'What' tab
        Logger.info('Verifying "What" tab is active by default');
        await expect(widgetsPage.whatTab).toHaveAttribute('aria-selected', 'true');
        await expect(widgetsPage.whatTabPanel).toBeVisible();

        // Switch to 'Origin'
        Logger.info('Switching to "Origin" tab');
        await widgetsPage.clickOriginTab();
        await expect(widgetsPage.originTab).toHaveAttribute('aria-selected', 'true');
        await expect(widgetsPage.originTabPanel).toBeVisible();
        await expect(widgetsPage.whatTabPanel).toBeHidden();

        // Switch to 'Use'
        Logger.info('Switching to "Use" tab');
        await widgetsPage.clickUseTab();
        await expect(widgetsPage.useTab).toHaveAttribute('aria-selected', 'true');
        await expect(widgetsPage.useTabPanel).toBeVisible();
        Logger.info('Tabs Switching test completed successfully');
    });

    test('Tool Tips', async ({ page }) => {
        Logger.info('Starting Tool Tips test');
        await widgetsPage.navigateToToolTips();

        // Hover over button
        Logger.info('Hovering over ToolTip button');
        await widgetsPage.hoverToolTipButton();

        // Verify tooltip appears
        Logger.info('Verifying tooltip visibility and text');
        await expect(widgetsPage.toolTipInner).toBeVisible();
        await expect(widgetsPage.toolTipInner).toHaveText('You hovered over the Button');
        Logger.info('Tool Tips test completed successfully');
    });

    test('Date Picker Interaction', async ({ page }) => {
        Logger.info('Starting Date Picker Interaction test');
        await widgetsPage.navigateToDatePicker();

        // Get current date
        const currentDate = new Date();
        const day = currentDate.getDate().toString();
        const month = currentDate.getMonth().toString(); // 0-indexed for select option value
        const year = currentDate.getFullYear().toString();

        // Format for verification: MM/DD/YYYY
        const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        const expectedValue = `${formattedMonth}/${formattedDay}/${year}`;

        Logger.info(`Selecting today's date: ${expectedValue}`);
        await widgetsPage.selectDate(day, month, year);

        // Verification
        Logger.info('Verifying date picker input value');
        await expect(widgetsPage.dateInput).toHaveValue(expectedValue);
        Logger.info('Date Picker Interaction test completed successfully');
    });
});
