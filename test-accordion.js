const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://demoqa.com/accordian');
  const html = await page.innerHTML('#accordianContainer');
  console.log(html);
  await browser.close();
})();
