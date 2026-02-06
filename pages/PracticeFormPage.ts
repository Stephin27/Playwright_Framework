import { Page, Locator } from '@playwright/test';

export class PracticeFormPage {
    readonly page: Page;
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
    readonly stateSelect: Locator; // Often a div acting as select in React
    readonly citySelect: Locator;
    readonly submitButton: Locator;

    // Date Picker specific (reusing logic or locators if similar to Widgets, but usually independent)
    readonly dateMonthSelect: Locator;
    readonly dateYearSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');
        this.emailInput = page.getByPlaceholder('name@example.com');

        // Gender is tricky, often the input is hidden and label is clicked. 
        // Using getByText or label association.
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

        // State and City are often React Select components
        this.stateSelect = page.locator('#state');
        this.citySelect = page.locator('#city');

        this.submitButton = page.locator('#submit');

        // Date picker internals
        this.dateMonthSelect = page.locator('.react-datepicker__month-select');
        this.dateYearSelect = page.locator('.react-datepicker__year-select');
    }

    async navigateTo() {
        const maxRetries = 3;
        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.page.goto('https://demoqa.com/automation-practice-form', {
                    timeout: 60000,
                    waitUntil: 'domcontentloaded'
                });
                break;
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                console.log(`Navigation failed, retrying (${i + 1}/${maxRetries})...`);
            }
        }
        // Remove ads and footer to avoid click interceptions
        await this.page.addStyleTag({ content: '#fixedban { display: none !important; } footer { display: none !important; }' });
    }

    async fillForm(data: any) {
        await this.firstNameInput.fill(data.FirstName);
        await this.lastNameInput.fill(data.LastName);
        await this.emailInput.fill(data.Email);

        if (data.Gender === 'Male') await this.maleRadio.click();
        else if (data.Gender === 'Female') await this.femaleRadio.click();
        else await this.otherRadio.click();

        await this.mobileInput.fill(data.Mobile);

        // Date Logic
        // Data format assumed: "15 Mar 2000" or similar. 
        // Simple implementation: 
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
                await this.subjectsInput.fill(subject.trim());
                // Wait for option to appear and ensure it's ready to be clicked
                const option = this.page.locator('.subjects-auto-complete__option').first();
                await option.waitFor({ state: 'visible' });
                await option.click();
            }
        }

        if (data.Hobbies) {
            if (data.Hobbies.includes('Sports')) await this.hobbiesSportsCheckbox.click({ force: true });
            if (data.Hobbies.includes('Reading')) await this.hobbiesReadingCheckbox.click({ force: true });
            if (data.Hobbies.includes('Music')) await this.hobbiesMusicCheckbox.click({ force: true });
        }

        await this.currentAddressInput.fill(data.Address);

        if (data.State) {
            await this.stateSelect.click();
            await this.page.getByText(data.State, { exact: true }).click();
        }

        if (data.City) {
            await this.citySelect.click();
            await this.page.getByText(data.City, { exact: true }).click();
        }
    }

    async submit() {
        await this.submitButton.click({ force: true });
    }
}
