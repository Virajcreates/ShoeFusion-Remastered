const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    const dir = './public/screenshots';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport to a standard desktop size
    await page.setViewport({ width: 1440, height: 900 });

    // Navigate to local dev server
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for the 3D models to load (give it a few seconds)
    console.log('Waiting for 3D models to render...');
    await new Promise(r => setTimeout(r, 4000));

    // Capture Hero Section
    console.log('Capturing Hero Section...');
    await page.screenshot({ path: './public/screenshots/hero.png' });

    // Scroll down to the grid
    console.log('Scrolling to Product Grid...');
    await page.evaluate(() => {
      window.scrollBy(0, 1200);
    });
    
    // Wait for scroll and models
    await new Promise(r => setTimeout(r, 2000));

    // Capture Grid Section
    console.log('Capturing Grid Section...');
    await page.screenshot({ path: './public/screenshots/grid.png' });

    await browser.close();
    console.log('Screenshots captured successfully!');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    process.exit(1);
  }
})();
