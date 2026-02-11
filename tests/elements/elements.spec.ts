import { test, expect } from '@playwright/test';
import { ElementsPage } from '../../pages/ElementsPage';
import { Assertions } from '../../utils/assertions';
import { TestData } from '../../utils/testData';
import { Helpers } from '../../utils/helpers';
import { Logger } from '../../utils/Logger';

test.describe('DemoQA Elements Page Tests', () => {
    let elementsPage: ElementsPage;

    test.beforeEach(async ({ page }) => {
        elementsPage = new ElementsPage(page);
        Logger.info(`Navigating to Elements page: ${TestData.URL}`);
        await Helpers.navigateTo(page, TestData.URL);
    });

    test('Text Box Form Submission', async ({ page }) => {
        Logger.info('Starting Text Box Form Submission test');
        await elementsPage.navigateToTextBox();
        Logger.info('Filling Text Box form...');
        await elementsPage.fillTextBoxForm(
            TestData.TEXT_BOX.FULL_NAME,
            TestData.TEXT_BOX.EMAIL,
            TestData.TEXT_BOX.CURRENT_ADDRESS,
            TestData.TEXT_BOX.PERMANENT_ADDRESS
        );

        // Assertions
        Logger.info('Verifying form submission results...');
        await Assertions.assertElementVisible(page, elementsPage.outputArea);
        await Assertions.assertElementContainsText(page, elementsPage.outputName, TestData.TEXT_BOX.FULL_NAME);
        await Assertions.assertElementContainsText(page, elementsPage.outputEmail, TestData.TEXT_BOX.EMAIL);
        Logger.info('Text Box Form Submission test completed successfully');
    });

    test('Check Box Selection', async ({ page }) => {
        Logger.info('Starting Check Box Selection test');
        await elementsPage.navigateToCheckBox();
        Logger.info('Selecting Home checkbox...');
        await elementsPage.selectHomeCheckbox();

        Logger.info('Verifying checkbox selection...');
        await Assertions.assertElementVisible(page, elementsPage.resultDisplay);
        await Assertions.assertElementContainsText(page, elementsPage.resultDisplay, 'You have selected');
        await Assertions.assertCheckboxChecked(page, elementsPage.homeCheckboxInput);
        Logger.info('Check Box Selection test completed successfully');
    });

    test('Radio Button Selection', async ({ page }) => {
        Logger.info('Starting Radio Button Selection test');
        await elementsPage.navigateToRadioButton();
        Logger.info('Selecting "Yes" radio button...');
        await elementsPage.selectYesRadio();

        await Assertions.assertElementText(page, elementsPage.successMessage, 'Yes');

        Logger.info('Selecting "Impressive" radio button...');
        await elementsPage.selectImpressiveRadio();
        await Assertions.assertElementText(page, elementsPage.successMessage, 'Impressive');
        Logger.info('Radio Button Selection test completed successfully');
    });

    test('Web Tables - Add New Record', async ({ page }) => {
        Logger.info('Starting Web Tables - Add New Record test');
        await elementsPage.navigateToWebTables();
        Logger.info(`Adding new record: ${TestData.WEB_TABLE.FIRST_NAME} ${TestData.WEB_TABLE.LAST_NAME}`);
        await elementsPage.addNewRecord(
            TestData.WEB_TABLE.FIRST_NAME,
            TestData.WEB_TABLE.LAST_NAME,
            TestData.WEB_TABLE.EMAIL,
            TestData.WEB_TABLE.AGE,
            TestData.WEB_TABLE.SALARY,
            TestData.WEB_TABLE.DEPARTMENT
        );

        // Verify the new record appears in the table
        Logger.info('Verifying new record in table...');
        const gridCell = page.locator(elementsPage.tableBody);
        await expect(gridCell).toContainText(TestData.WEB_TABLE.EMAIL);
        await expect(gridCell).toContainText(TestData.WEB_TABLE.FIRST_NAME);
        Logger.info('Web Tables - Add New Record test completed successfully');
    });

    test('Buttons Interaction', async ({ page }) => {
        Logger.info('Starting Buttons Interaction test');
        await elementsPage.navigateToButtons();

        // Double Click
        Logger.info('Performing double click...');
        await elementsPage.doubleClickButton();
        await Assertions.assertElementText(page, elementsPage.doubleClickMessage, 'You have done a double click');

        // Right Click
        Logger.info('Performing right click...');
        await elementsPage.rightClickButton();
        await Assertions.assertElementText(page, elementsPage.rightClickMessage, 'You have done a right click');

        // Dynamic Click
        Logger.info('Performing dynamic click...');
        await elementsPage.clickDynamicButton();
        await Assertions.assertElementText(page, elementsPage.dynamicClickMessage, 'You have done a dynamic click');
        Logger.info('Buttons Interaction test completed successfully');
    });

    test('Links Redirection', async ({ page, context }) => {
        Logger.info('Starting Links Redirection test');
        await elementsPage.navigateToLinks();

        // Handle new tab
        Logger.info('Clicking simple link and waiting for new tab...');
        const pagePromise = context.waitForEvent('page');
        await elementsPage.clickSimpleLink();
        const newPage = await pagePromise;

        await newPage.waitForLoadState();
        Logger.info(`New page URL: ${newPage.url()}`);
        await expect(newPage).toHaveURL('https://demoqa.com/');
        await newPage.close();
        Logger.info('Links Redirection test completed successfully');
    });
});
