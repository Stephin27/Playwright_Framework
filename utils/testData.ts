export const TestData = {
    URL: process.env.BASE_URL || 'https://demoqa.com/elements',
    ALERTS_URL: process.env.ALERTS_URL || 'https://demoqa.com/alerts',
    WIDGETS_URL: process.env.WIDGETS_URL || 'https://demoqa.com/widgets',
    PRACTICE_FORM_URL: process.env.PRACTICE_FORM_URL || 'https://demoqa.com/automation-practice-form',
    TEXT_BOX: {
        FULL_NAME: 'John Doe',
        EMAIL: 'john.doe@example.com',
        CURRENT_ADDRESS: '123 Main St, New York, NY',
        PERMANENT_ADDRESS: '456 Wall St, New York, NY'
    },
    WEB_TABLE: {
        FIRST_NAME: 'Jane',
        LAST_NAME: 'Smith',
        EMAIL: 'jane.smith@example.com',
        AGE: '30',
        SALARY: '50000',
        DEPARTMENT: 'Engineering'
    }
};
