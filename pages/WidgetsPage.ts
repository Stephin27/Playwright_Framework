import { Page, Locator } from '@playwright/test';
import { Helpers } from '../utils/helpers';

export class WidgetsPage {
    readonly page: Page;

    // Menus
    private accordianMenu = '//span[text()="Accordian"]';
    private tabsMenu = '//span[text()="Tabs"]';
    private toolTipsMenu = '//span[text()="Tool Tips"]';
    private datePickerMenu = '//span[text()="Date Picker"]';

    // Accordian Locators
    readonly section1Header: Locator;
    readonly section1Content: Locator;
    readonly section2Header: Locator;
    readonly section2Content: Locator;

    // Tabs Locators
    readonly whatTab: Locator;
    readonly originTab: Locator;
    readonly useTab: Locator;
    readonly whatTabPanel: Locator;
    readonly originTabPanel: Locator;
    readonly useTabPanel: Locator;

    // Tool Tips Locators
    readonly toolTipButton: Locator;
    readonly toolTipInner: Locator;

    // Date Picker Locators
    readonly dateInput: Locator;
    readonly dateMonthSelect: Locator;
    readonly dateYearSelect: Locator;
    readonly dateDay: (day: string) => Locator;

    constructor(page: Page) {
        this.page = page;

        // Accordian
        this.section1Header = page.locator('#section1Heading');
        this.section1Content = page.locator('#section1Content');
        this.section2Header = page.locator('#section2Heading');
        this.section2Content = page.locator('#section2Content');

        // Tabs
        this.whatTab = page.locator('#demo-tab-what');
        this.originTab = page.locator('#demo-tab-origin');
        this.useTab = page.locator('#demo-tab-use');
        this.whatTabPanel = page.locator('#demo-tabpane-what');
        this.originTabPanel = page.locator('#demo-tabpane-origin');
        this.useTabPanel = page.locator('#demo-tabpane-use');

        // Tool Tips
        this.toolTipButton = page.locator('#toolTipButton');
        this.toolTipInner = page.locator('.tooltip-inner');

        // Date Picker
        this.dateInput = page.locator('#datePickerMonthYearInput');
        this.dateMonthSelect = page.locator('.react-datepicker__month-select');
        this.dateYearSelect = page.locator('.react-datepicker__year-select');
        this.dateDay = (day: string) => page.locator(`.react-datepicker__day:not(.react-datepicker__day--outside-month):has-text("${day}")`);
    }

    // Actions

    async navigateToAccordian() {
        await Helpers.waitAndClick(this.page, this.accordianMenu);
    }

    async toggleSection1() {
        await this.section1Header.click();
    }

    async toggleSection2() {
        await this.section2Header.click();
    }

    async navigateToTabs() {
        await Helpers.waitAndClick(this.page, this.tabsMenu);
    }

    async clickOriginTab() {
        await this.originTab.click();
    }

    async clickUseTab() {
        await this.useTab.click();
    }

    async navigateToToolTips() {
        // Scroll needed sometimes
        const menu = this.page.locator(this.toolTipsMenu);
        await menu.scrollIntoViewIfNeeded();
        await Helpers.waitAndClick(this.page, this.toolTipsMenu);
    }

    async hoverToolTipButton() {
        await this.toolTipButton.hover();
    }

    async navigateToDatePicker() {
        // Scroll needed sometimes
        const menu = this.page.locator(this.datePickerMenu);
        await menu.scrollIntoViewIfNeeded();
        await Helpers.waitAndClick(this.page, this.datePickerMenu);
    }

    async selectDate(day: string, month: string, year: string) {
        await this.dateInput.click();
        await this.dateMonthSelect.selectOption(month);
        await this.dateYearSelect.selectOption(year);
        // We need to be careful with day selection to pick the one in the current month
        // The locator logic `not(.react-datepicker__day--outside-month)` handles this.
        await this.dateDay(day).first().click();
    }
}
