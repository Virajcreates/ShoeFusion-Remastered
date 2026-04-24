import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser with WebGL enabled...');
  // Run headed to guarantee WebGL works, but minimize it or let the user see it like they asked!
  const browser = await chromium.launch({
    headless: false, 
    args: [
      '--ignore-gpu-blocklist',
      '--enable-webgl',
      '--use-gl=angle',
      '--start-maximized'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to http://127.0.0.1:3001...');
  await page.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle' });
  
  console.log('Waiting 15 seconds for 3D Canvas to fully initialize...');
  await page.waitForTimeout(15000);
  
  console.log('Capturing hero.png...');
  await page.screenshot({ path: './public/screenshots/hero_final.png' });
  
  console.log('Capturing grid.png (Full Page)...');
  await page.screenshot({ path: './public/screenshots/grid_final.png', fullPage: true });
  
  console.log('Closing browser...');
  await browser.close();
  console.log('Screenshots successfully saved with WebGL rendered!');
})();
