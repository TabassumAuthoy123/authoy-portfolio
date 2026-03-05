const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5174';
const SCREENSHOT_DIR = 'C:\\Users\\adnan\\.gemini\\antigravity\\brain\\45207850-2968-4abd-a512-6dbfd83fe9f7';

const pages = [
  { name: 'home', path: '/' },
  { name: 'articles', path: '/articles' },
  { name: 'gallery', path: '/gallery' },
  { name: 'login', path: '/login' },
];

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
      defaultViewport: { width: 1920, height: 1080 },
    });

    for (const pg of pages) {
      const page = await browser.newPage();
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', err => errors.push(err.message));

      console.log(`\nTesting: ${pg.name} (${BASE_URL}${pg.path})`);
      
      await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 2000));

      // Scroll through page
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 300;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= document.body.scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 500));

      // Screenshot
      const ssPath = path.join(SCREENSHOT_DIR, `test_${pg.name}.png`);
      await page.screenshot({ path: ssPath, fullPage: true });
      console.log(`  Screenshot: ${ssPath}`);

      if (errors.length > 0) {
        console.log(`  ERRORS (${errors.length}):`);
        errors.forEach(e => console.log(`    - ${e}`));
      } else {
        console.log('  OK - No errors');
      }

      await page.close();
    }

    console.log('\n=== DONE ===');
  } catch (err) {
    console.error('FAILED:', err.message);
  } finally {
    if (browser) await browser.close();
  }
})();
