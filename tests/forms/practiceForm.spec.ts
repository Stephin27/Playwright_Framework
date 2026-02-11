import { test, expect } from '@playwright/test';
import { PracticeFormPage } from '../../pages/PracticeFormPage';
import { ExcelUtils } from '../../utils/excelUtils';
import { TestData } from '../../utils/testData';
import { Logger } from '../../utils/Logger';
import * as path from 'path';

const excelFilePath = path.join(__dirname, '../../data/formData.xlsx');

test.describe('Data-Driven Practice Form Tests', () => {
    let practiceFormPage: PracticeFormPage;
    let testData: any[];

    test.beforeAll(async () => {
        Logger.info(`Reading test data from Excel: ${excelFilePath}`);
        testData = await ExcelUtils.readExcel(excelFilePath);
    });

    test.beforeEach(async ({ page }) => {
        practiceFormPage = new PracticeFormPage(page);
        Logger.info('Navigating to Practice Form page');
        await practiceFormPage.navigateTo();
    });


    test('Submit Form with Excel Data', async () => {
        test.slow();
        Logger.info(`Starting Data-Driven test with ${testData.length} data sets`);
        for (const [index, data] of testData.entries()) {
            await test.step(`Submitting form for ${data.FirstName} ${data.LastName}`, async () => {
                Logger.info(`Processing record ${index + 1}: ${data.FirstName} ${data.LastName}`);
                await practiceFormPage.fillForm(data);

                Logger.info('Submitting form...');
                await practiceFormPage.submit();

                // Verification - Modal appears
                Logger.info('Verifying submission success modal...');
                await expect(practiceFormPage.page.getByText('Thanks for submitting the form')).toBeVisible();
                await expect(practiceFormPage.page.getByText(`${data.FirstName} ${data.LastName}`)).toBeVisible();

                Logger.info('Closing modal and resetting state...');
                // Close modal to reset state
                await practiceFormPage.page.keyboard.press('Escape');
                // Or just reload
                await practiceFormPage.navigateTo();
            });
        }
        Logger.info('Data-Driven Practice Form Tests completed');
    });
});
