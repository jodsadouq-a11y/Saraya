// Renders public/og.jpg (social sharing image) from scripts/og.html.
//   node scripts/og.cjs   (requires Playwright + Chromium)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'og.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  await p.screenshot({ path: path.join(__dirname, '..', 'public', 'og.jpg'), type: 'jpeg', quality: 86 });
  await b.close();
})();
