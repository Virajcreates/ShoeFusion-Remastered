import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser with WebGL enabled...');
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
    deviceScaleFactor: 2 // Professional high-res capture
  });
  
  const page = await context.newPage();
  
  console.log('Navigating to http://127.0.0.1:3001...');
  await page.goto('http://127.0.0.1:3001', { waitUntil: 'networkidle' });
  
  console.log('Waiting 10 seconds for 3D Canvas to fully initialize...');
  await page.waitForTimeout(10000);
  
  console.log('Scrolling perfectly to the Product Grid...');
  await page.evaluate(() => {
    window.scrollTo({ top: 950, behavior: 'instant' });
  });
  
  console.log('Waiting for elements to snap and render...');
  await page.waitForTimeout(3000);
  
  console.log('Capturing grid_pro.png...');
  await page.screenshot({ path: './public/screenshots/grid_pro.png' });
  
  console.log('Closing browser...');
  await browser.close();
  console.log('Professional screenshot successfully saved!');
})();
