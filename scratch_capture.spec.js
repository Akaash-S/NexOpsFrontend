const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

test('capture A7 noise badge evidence', async ({ page }) => {
    const screenshotDir = path.join(__dirname, '..', 'docs', 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    await page.goto('http://localhost:3000/login');
    await page.evaluate(() => {
        localStorage.setItem('authToken', 'mock-auth-token');
    });

    console.log('Navigating to http://localhost:3000/incidents/inc-a7-demo ...');
    await page.goto('http://localhost:3000/incidents/inc-a7-demo', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    // 1. Capture Full Page Screenshot
    const fullPath = path.join(screenshotDir, 'a7_noise_badge_fullpage.png');
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`Saved Full Page Screenshot: ${fullPath}`);

    // 2. Positive Case: Locate billing-service candidate cause card / node (noisyRuleIds = 1)
    const billingCard = page.locator('text=billing-service').locator('xpath=ancestor::div[contains(@class, "rounded-xl") or contains(@class, "border")]').first();
    if (await billingCard.count() > 0) {
        const positivePath = path.join(screenshotDir, 'a7_noise_badge_positive.png');
        await billingCard.screenshot({ path: positivePath });
        console.log(`Saved Positive Case Screenshot (billing-service with Noise Badge): ${positivePath}`);
    }

    // 3. Negative Case: Locate auth-service candidate cause card / node (noisyRuleIds = 0)
    const authCard = page.locator('text=auth-service').locator('xpath=ancestor::div[contains(@class, "rounded-xl") or contains(@class, "border")]').first();
    if (await authCard.count() > 0) {
        const negativePath = path.join(screenshotDir, 'a7_noise_badge_negative.png');
        await authCard.screenshot({ path: negativePath });
        console.log(`Saved Negative Case Screenshot (auth-service with NO Noise Badge): ${negativePath}`);
    }

    const pageContent = await page.content();
    const hasBillingNoiseText = pageContent.includes('rarely correlate with real incidents') || pageContent.includes('noisy rule');
    console.log(`HTML Verification: Noisy rule text present in DOM = ${hasBillingNoiseText}`);
});
