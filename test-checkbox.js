const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://demoqa.com/checkbox', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000); // give it time to load
    await page.screenshot({ path: 'checkbox-page.png' });
    const html = await page.innerHTML('body');
    console.log(html);
    await browser.close();
})();
