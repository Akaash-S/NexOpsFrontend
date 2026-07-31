const { chromium } = require('playwright');

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1200 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));

  // 1. Set localStorage BEFORE navigation by visiting origin first
  await page.goto('http://localhost:3000/favicon.ico');
  await page.evaluate(() => {
    localStorage.setItem('authToken', 'mock-auth-token');
  });

  // 2. Navigate directly to /analytics
  console.log('Navigating to http://localhost:3000/analytics...');
  await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle' });

  await page.waitForTimeout(5000);

  const outputPath = 'C:\\Users\\AKAASH\\.gemini\\antigravity-ide\\brain\\62405bde-9f66-4c20-b837-a95c3e1138ee\\analytics_all_fixes_proof.png';
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log('Successfully saved screenshot to:', outputPath);
  await browser.close();
}

main().catch(err => {
  console.error('Error taking screenshot:', err);
  process.exit(1);
});
