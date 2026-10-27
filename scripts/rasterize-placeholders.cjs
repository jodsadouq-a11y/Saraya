/**
 * Rasterises the SVG placeholder illustrations into responsive JPEGs
 * (bitmaps scale/animate far more cheaply than complex vector art).
 *
 *   node scripts/gen-placeholders.mjs && node scripts/rasterize-placeholders.cjs
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'media', 'placeholders');
const WIDE = new Set(['hall', 'hall-dark', 'stage']);

(async () => {
  const browser = await chromium.launch();
  for (const file of fs.readdirSync(DIR).filter((f) => f.endsWith('.svg'))) {
    const name = file.replace('.svg', '');
    const [w, h] = WIDE.has(name) ? [1920, 1080] : [1200, 1600];
    for (const scale of [1, 0.5]) {
      const page = await browser.newPage({ viewport: { width: w * scale, height: h * scale } });
      const svg = fs.readFileSync(path.join(DIR, file), 'utf8');
      await page.setContent(`<style>html,body{margin:0}svg{width:100vw;height:100vh;display:block}</style>${svg}`);
      const out = path.join(DIR, `${name}-${w * scale}.jpg`);
      await page.screenshot({ path: out, type: 'jpeg', quality: 78 });
      console.log(path.basename(out), (fs.statSync(out).size / 1024).toFixed(0) + ' kB');
      await page.close();
    }
  }
  await browser.close();
})();
