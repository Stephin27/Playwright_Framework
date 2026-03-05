import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Helpers } from '../utils/helpers';

export class PracticeFormPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly maleRadio: Locator;
    readonly femaleRadio: Locator;
    readonly otherRadio: Locator;
    readonly mobileInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInput: Locator;
    readonly hobbiesSportsCheckbox: Locator;
    readonly hobbiesReadingCheckbox: Locator;
    readonly hobbiesMusicCheckbox: Locator;
    readonly uploadPictureInput: Locator;
    readonly currentAddressInput: Locator;
    readonly stateSelect: Locator;
    readonly citySelect: Locator;
    readonly submitButton: Locator;

    // Date Picker specific locators
    readonly dateMonthSelect: Locator;
    readonly dateYearSelect: Locator;

    constructor(page: Page) {
        super(page);
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('name@example.com');

        // Gender selection
        this.maleRadio = page.getByText('Male', { exact: true });
        this.femaleRadio = page.getByText('Female', { exact: true });
        this.otherRadio = page.getByText('Other', { exact: true });

        this.mobileInput = page.getByPlaceholder('Mobile Number');
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');

        this.subjectsInput = page.locator('#subjectsInput');

        this.hobbiesSportsCheckbox = page.getByText('Sports', { exact: true });
        this.hobbiesReadingCheckbox = page.getByText('Reading', { exact: true });
        this.hobbiesMusicCheckbox = page.getByText('Music', { exact: true });

        this.uploadPictureInput = page.locator('#uploadPicture');
        this.currentAddressInput = page.getByPlaceholder('Current Address');

        // State and City selectors
        this.stateSelect = page.locator('#state');
        this.citySelect = page.locator('#city');

        this.submitButton = page.locator('#submit');

        // Date picker internals
        this.dateMonthSelect = page.locator('.react-datepicker__month-select');
        this.dateYearSelect = page.locator('.react-datepicker__year-select');
    }

    async navigateToPracticeForm() {
        // Block common ad and analytics domains
        const blockedDomains = [
            'googlesyndication.com', 'googletagmanager.com', 'google-analytics.com',
            'doubleclick.net', 'adsystem.com', 'adnxs.com', 'amazon-adsystem.com'
        ];
        await this.page.route('**/*', (route) => {
            if (blockedDomains.some(domain => route.request().url().includes(domain))) {
                route.abort();
            } else {
                route.continue();
            }
        });

        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.page.goto('https://demoqa.com/automation-practice-form', {
                    timeout: 45000,
                    waitUntil: 'domcontentloaded'
                });
                break;
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`Navigation failed, retrying (${i + 1}/${maxRetries})...`);
            }
        }
    }

    async fillForm(data: any) {
        await this.firstNameInput.fill(data.FirstName);
        await this.lastNameInput.fill(data.LastName);
        await this.emailInput.fill(data.Email);

        if (data.Gender === 'Male') await this.maleRadio.click();
        else if (data.Gender === 'Female') await this.femaleRadio.click();
        else await this.otherRadio.click();

        await this.mobileInput.scrollIntoViewIfNeeded();
        await this.mobileInput.fill(data.Mobile);

        // Date Logic
        // Date selection logic
        if (data.DateOfBirth) {
            await this.dateOfBirthInput.click();
            const dateParts = data.DateOfBirth.split(' ');
            const day = dateParts[0];
            const month = dateParts[1];
            const year = dateParts[2];

            await this.dateYearSelect.selectOption(year);
            const monthMap: { [key: string]: string } = {
                'Jan': 'January', 'Feb': 'February', 'Mar': 'March', 'Apr': 'April', 'May': 'May', 'Jun': 'June',
                'Jul': 'July', 'Aug': 'August', 'Sep': 'September', 'Oct': 'October', 'Nov': 'November', 'Dec': 'December'
            };
            const fullMonth = monthMap[month] || month;
            await this.dateMonthSelect.selectOption(fullMonth);
            // Select day, avoid outside month
            await this.page.locator(`.react-datepicker__day:not(.react-datepicker__day--outside-month)`).getByText(day, { exact: true }).first().click();
        }

        if (data.Subjects) {
            const subjects = data.Subjects.split(',');
            for (const subject of subjects) {
                await this.subjectsInput.pressSequentially(subject.trim(), { delay: 100 });
                // Small wait to ensure react select processes the input
                await this.page.waitForTimeout(500);
                await this.page.keyboard.press('Enter');
            }
        }

        if (data.Hobbies) {
            // Using force: true to bypass potential ad overlays
            if (data.Hobbies.includes('Sports')) await this.hobbiesSportsCheckbox.click({ force: true });
            if (data.Hobbies.includes('Reading')) await this.hobbiesReadingCheckbox.click({ force: true });
            if (data.Hobbies.includes('Music')) await this.hobbiesMusicCheckbox.click({ force: true });
        }

        await this.currentAddressInput.fill(data.Address);

        if (data.State) {
            await this.stateSelect.scrollIntoViewIfNeeded();
            await this.stateSelect.click();
            // Wait for option to be visible and click it
            const option = this.page.locator(`div[id^="react-select-3-option"]`).filter({ hasText: data.State }).first();
            await option.click();
        }

        if (data.City) {
            await this.citySelect.scrollIntoViewIfNeeded();
            await this.citySelect.click();
            const option = this.page.locator(`div[id^="react-select-4-option"]`).filter({ hasText: data.City }).first();
            await option.click();
        }
    }

    async submit() {
        await this.safeClick("Click the Submit button to finalize the form", this.submitButton);
    }
}
