import { test, expect } from '@playwright/test';
import { WidgetsPage } from '../../pages/WidgetsPage';
import { TestData } from '../../utils/testData';
import { Helpers } from '../../utils/helpers';

test.describe('DemoQA Widgets Tests', () => {
    let widgetsPage: WidgetsPage;

    test.beforeEach(async ({ page }) => {
        widgetsPage = new WidgetsPage(page);
        await Helpers.navigateTo(page, TestData.WIDGETS_URL);
    });

    test('Accordian Interaction', async ({ page }) => {
        await widgetsPage.navigateToAccordian();

        // Verify default state (Section 1 Open)
        await expect(widgetsPage.section1Content).toBeVisible();
        await expect(widgetsPage.section2Content).toBeHidden();

        // Close Section 1
        await widgetsPage.toggleSection1();
        await expect(widgetsPage.section1Content).toBeHidden();

        // Open Section 2
        await widgetsPage.toggleSection2();
        await expect(widgetsPage.section2Content).toBeVisible();
    });

    test('Tabs Switching', async ({ page }) => {
        await widgetsPage.navigateToTabs();

        // Default 'What' tab
        await expect(widgetsPage.whatTab).toHaveAttribute('aria-selected', 'true');
        await expect(widgetsPage.whatTabPanel).toBeVisible();

        // Switch to 'Origin'
        await widgetsPage.clickOriginTab();
        await expect(widgetsPage.originTab).toHaveAttribute('aria-selected', 'true');
        await expect(widgetsPage.originTabPanel).toBeVisible();
        await expect(widgetsPage.whatTabPanel).toBeHidden();

        // Switch to 'Use'
        await widgetsPage.clickUseTab();
        await expect(widgetsPage.useTab).toHaveAttribute('aria-selected', 'true');
        await expect(widgetsPage.useTabPanel).toBeVisible();
    });

    test('Tool Tips', async ({ page }) => {
        await widgetsPage.navigateToToolTips();

        // Hover over button
        await widgetsPage.hoverToolTipButton();

        // Verify tooltip appears
        await expect(widgetsPage.toolTipInner).toBeVisible();
        await expect(widgetsPage.toolTipInner).toHaveText('You hovered over the Button');
    });

    test('Date Picker Interaction', async ({ page }) => {
        await widgetsPage.navigateToDatePicker();

        // Get current date
        const currentDate = new Date();
        const day = currentDate.getDate().toString();
        const month = currentDate.getMonth().toString(); // 0-indexed for select option value
        const year = currentDate.getFullYear().toString();

        // Format for verification: MM/DD/YYYY
        // Pad month + 1 and day with leading zeros if needed
        const formattedMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const formattedDay = day.padStart(2, '0');
        const expectedValue = `${formattedMonth}/${formattedDay}/${year}`;

        await widgetsPage.selectDate(day, month, year);

        // Verification
        await expect(widgetsPage.dateInput).toHaveValue(expectedValue);
    });
});
