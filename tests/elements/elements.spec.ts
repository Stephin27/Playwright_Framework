import { test, expect } from '@playwright/test';
import { ElementsPage } from '../../pages/ElementsPage';
import { Assertions } from '../../utils/assertions';
import { TestData } from '../../utils/testData';
import { Helpers } from '../../utils/helpers';

test.describe('DemoQA Elements Page Tests', () => {
    let elementsPage: ElementsPage;

    test.beforeEach(async ({ page }) => {
        elementsPage = new ElementsPage(page);
        await Helpers.navigateTo(page, TestData.URL); // Navigate to /elements directly or base then elements? 
        // TestData.URL is https://demoqa.com/elements, so we are there.
        // However, the side menu might need to be visible.
    });

    test('Text Box Form Submission', async ({ page }) => {
        await elementsPage.navigateToTextBox();
        await elementsPage.fillTextBoxForm(
            TestData.TEXT_BOX.FULL_NAME,
            TestData.TEXT_BOX.EMAIL,
            TestData.TEXT_BOX.CURRENT_ADDRESS,
            TestData.TEXT_BOX.PERMANENT_ADDRESS
        );

        // Assertions
        await Assertions.assertElementVisible(page, '#output');
        await Assertions.assertElementContainsText(page, '#name', TestData.TEXT_BOX.FULL_NAME);
        await Assertions.assertElementContainsText(page, '#email', TestData.TEXT_BOX.EMAIL);
    });

    test('Check Box Selection', async ({ page }) => {
        await elementsPage.navigateToCheckBox();
        await elementsPage.selectHomeCheckbox();

        await Assertions.assertElementVisible(page, '#result');
        await Assertions.assertElementContainsText(page, '#result', 'You have selected');
        await Assertions.assertCheckboxChecked(page, 'label[for="tree-node-home"] input');
    });

    test('Radio Button Selection', async ({ page }) => {
        await elementsPage.navigateToRadioButton();
        await elementsPage.selectYesRadio();

        await Assertions.assertElementText(page, '.text-success', 'Yes');

        await elementsPage.selectImpressiveRadio();
        await Assertions.assertElementText(page, '.text-success', 'Impressive');
    });

    test('Web Tables - Add New Record', async ({ page }) => {
        await elementsPage.navigateToWebTables();
        await elementsPage.addNewRecord(
            TestData.WEB_TABLE.FIRST_NAME,
            TestData.WEB_TABLE.LAST_NAME,
            TestData.WEB_TABLE.EMAIL,
            TestData.WEB_TABLE.AGE,
            TestData.WEB_TABLE.SALARY,
            TestData.WEB_TABLE.DEPARTMENT
        );

        // Verify the new record appears in the table
        const gridCell = page.locator('.rt-tbody');
        await expect(gridCell).toContainText(TestData.WEB_TABLE.EMAIL);
        await expect(gridCell).toContainText(TestData.WEB_TABLE.FIRST_NAME);
    });

    test('Buttons Interaction', async ({ page }) => {
        await elementsPage.navigateToButtons();

        // Double Click
        await elementsPage.doubleClickButton();
        await Assertions.assertElementText(page, '#doubleClickMessage', 'You have done a double click');

        // Right Click
        await elementsPage.rightClickButton();
        await Assertions.assertElementText(page, '#rightClickMessage', 'You have done a right click');

        // Dynamic Click
        await elementsPage.clickDynamicButton();
        await Assertions.assertElementText(page, '#dynamicClickMessage', 'You have done a dynamic click');
    });

    test('Links Redirection', async ({ page, context }) => {
        await elementsPage.navigateToLinks();

        // Handle new tab
        const pagePromise = context.waitForEvent('page');
        await elementsPage.clickSimpleLink();
        const newPage = await pagePromise;

        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL('https://demoqa.com/');
        await newPage.close();
    });
});
