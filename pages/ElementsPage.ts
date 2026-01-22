import { Page } from '@playwright/test';
import { Helpers } from '../utils/helpers';

export class ElementsPage {
    readonly page: Page;

    // Locators
    private elementsCard = 'div.card:has-text("Elements")';
    private menuList = '.element-list';

    // Text Box Locators
    private textBoxMenu = '//span[text()="Text Box"]';
    private userNameInput = '#userName';
    private userEmailInput = '#userEmail';
    private currentAddressInput = '#currentAddress';
    private permanentAddressInput = '#permanentAddress';
    private submitButton = '#submit';
    private outputArea = '#output';

    // Check Box Locators
    private checkBoxMenu = '//span[text()="Check Box"]';
    private homeCheckbox = 'label[for="tree-node-home"] span.rct-checkbox';
    private expandAllButton = 'button[title="Expand all"]';
    private resultDisplay = '#result';

    // Radio Button Locators
    private radioButtonMenu = '//span[text()="Radio Button"]';
    private yesRadioLabel = 'label[for="yesRadio"]';
    private impressiveRadioLabel = 'label[for="impressiveRadio"]';
    private successMessage = '.text-success';

    // Web Tables Locators
    private webTablesMenu = '//span[text()="Web Tables"]';
    private addButton = '#addNewRecordButton';
    private registrationForm = '.modal-content';
    private firstNameInput = '#firstName';
    private lastNameInput = '#lastName';
    private emailInput = '#userEmail';
    private ageInput = '#age';
    private salaryInput = '#salary';
    private departmentInput = '#department';
    private submitFormButton = '#submit';

    // Buttons Locators
    private buttonsMenu = '//span[text()="Buttons"]';
    private doubleClickBtn = '#doubleClickBtn';
    private rightClickBtn = '#rightClickBtn';
    private dynamicClickBtn = 'button:text("Click Me")'; // Often has dynamic ID, text is safer
    private doubleClickMessage = '#doubleClickMessage';
    private rightClickMessage = '#rightClickMessage';
    private dynamicClickMessage = '#dynamicClickMessage';

    // Links Locators
    private linksMenu = '//span[text()="Links"]';
    private simpleLink = '#simpleLink';
    private dynamicLink = '#dynamicLink';

    constructor(page: Page) {
        this.page = page;
    }

    // Actions

    async navigateToElements() {
        // Assuming we are at base URL
        await Helpers.waitAndClick(this.page, this.elementsCard);
    }

    // Text Box Actions
    async navigateToTextBox() {
        await Helpers.waitAndClick(this.page, this.textBoxMenu);
    }

    async fillTextBoxForm(fullName: string, email: string, currentAddr: string, permanentAddr: string) {
        await Helpers.waitAndFill(this.page, this.userNameInput, fullName);
        await Helpers.waitAndFill(this.page, this.userEmailInput, email);
        await Helpers.waitAndFill(this.page, this.currentAddressInput, currentAddr);
        await Helpers.waitAndFill(this.page, this.permanentAddressInput, permanentAddr);

        // Scroll to submit to ensure visibility
        const submitBtn = this.page.locator(this.submitButton);
        await submitBtn.scrollIntoViewIfNeeded();
        await Helpers.waitAndClick(this.page, this.submitButton);
    }

    // Check Box Actions
    async navigateToCheckBox() {
        await Helpers.waitAndClick(this.page, this.checkBoxMenu);
    }

    async selectHomeCheckbox() {
        await Helpers.waitAndClick(this.page, this.homeCheckbox);
    }

    async expandAll() {
        await Helpers.waitAndClick(this.page, this.expandAllButton);
    }

    // Radio Button Actions
    async navigateToRadioButton() {
        await Helpers.waitAndClick(this.page, this.radioButtonMenu);
    }

    async selectYesRadio() {
        await Helpers.waitAndClick(this.page, this.yesRadioLabel);
    }

    async selectImpressiveRadio() {
        await Helpers.waitAndClick(this.page, this.impressiveRadioLabel);
    }

    // Web Tables Actions
    async navigateToWebTables() {
        await Helpers.waitAndClick(this.page, this.webTablesMenu);
    }

    async addNewRecord(firstName: string, lastName: string, email: string, age: string, salary: string, department: string) {
        await Helpers.waitAndClick(this.page, this.addButton);
        await Helpers.waitAndFill(this.page, this.firstNameInput, firstName);
        await Helpers.waitAndFill(this.page, this.lastNameInput, lastName);
        await Helpers.waitAndFill(this.page, this.emailInput, email);
        await Helpers.waitAndFill(this.page, this.ageInput, age);
        await Helpers.waitAndFill(this.page, this.salaryInput, salary);
        await Helpers.waitAndFill(this.page, this.departmentInput, department);
        await Helpers.waitAndClick(this.page, this.submitFormButton);
    }

    // Buttons Actions
    async navigateToButtons() {
        // Sometimes the menu needs scrolling
        const menu = this.page.locator(this.buttonsMenu);
        await menu.scrollIntoViewIfNeeded();
        await Helpers.waitAndClick(this.page, this.buttonsMenu);
    }

    async doubleClickButton() {
        await this.page.dblclick(this.doubleClickBtn);
    }

    async rightClickButton() {
        await this.page.click(this.rightClickBtn, { button: 'right' });
    }

    async clickDynamicButton() {
        // The third button "Click Me" often has a dynamic ID. 
        // Using text locator or xpath is better.
        // There are 3 buttons. 1st is Double, 2nd is Right, 3rd is just Click Me
        // Let's use exact text match to avoid confusion with "Double Click Me"
        await this.page.locator('button').filter({ hasText: /^Click Me$/ }).click();
    }

    // Links Actions
    async navigateToLinks() {
        const menu = this.page.locator(this.linksMenu);
        await menu.scrollIntoViewIfNeeded();
        await Helpers.waitAndClick(this.page, this.linksMenu);
    }

    async clickSimpleLink() {
        // This opens a new tab, so we might need to handle context or just verify attribute
        // But the requirement says "Create tests for ... Links".
        // Usually we check if it has correct href or intercept the new page.
        // For this action, we just click.
        await Helpers.waitAndClick(this.page, this.simpleLink);
    }
}
