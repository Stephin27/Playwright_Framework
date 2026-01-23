import { test, expect } from '@playwright/test';
import { PracticeFormPage } from '../../pages/PracticeFormPage';
import { ExcelUtils } from '../../utils/excelUtils';
import { TestData } from '../../utils/testData';
import * as path from 'path';

const excelFilePath = path.join(__dirname, '../../data/formData.xlsx');

test.describe('Data-Driven Practice Form Tests', () => {
    let practiceFormPage: PracticeFormPage;
    let testData: any[];

    test.beforeAll(async () => {
        testData = await ExcelUtils.readExcel(excelFilePath);
    });

    test.beforeEach(async ({ page }) => {
        practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.navigateTo();
    });

    // We can iterate here to generate dynamic tests
    // Note: Since we need to read data asynchronously in beforeAll, we can't easily use .forEach at the top level 
    // to generate separate test() calls unless we change how we load data (e.g. sync read or external script).
    // For now, we will loop inside a single test or use a patterned approach.
    // However, Playwright recommends generating tests from data synchronously if possible.
    // If we want separate "test" entries in the report for each row, we need to read the file before definition.
    // Since readExcel is async, let's just make one test that iterates, OR use a different approach.
    // Better Approach: Iterate inside one test for simplicity unless 'test.step' is preferred.
    // Let's use test.step for each row for better reporting granularity within one test.

    test('Submit Form with Excel Data', async () => {
        for (const [index, data] of testData.entries()) {
            await test.step(`Submitting form for ${data.FirstName} ${data.LastName}`, async () => {
                await practiceFormPage.fillForm(data);
                await practiceFormPage.submit();

                // Verification - Modal appears
                const modalParams = 'example-modal-sizes-title-lg';
                await expect(practiceFormPage.page.getByText('Thanks for submitting the form')).toBeVisible();

                // Add specific assertions if needed, e.g. checking values in the table
                await expect(practiceFormPage.page.getByText(`${data.FirstName} ${data.LastName}`)).toBeVisible();

                // Close modal to reset state or navigate again if needed (but we have beforeEach navigateTo)
                // Actually, if we loop inside one test, we need to reset/reload.
                // The form submission opens a modal. We should close it or reload page.
                await practiceFormPage.page.keyboard.press('Escape');
                // Or just reload
                await practiceFormPage.navigateTo();
            });
        }
    });
});
