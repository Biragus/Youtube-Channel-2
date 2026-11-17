// Builds the guide: node product/build-pdf.js -> product/From-Zero-Digital-Product-Playbook.pdf (+ page previews)
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

(async () => {
  const dir = __dirname; const out = path.join(dir, 'From-Zero-Digital-Product-Playbook.pdf');
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto('file://' + path.join(dir, 'guide.html'), { waitUntil: 'networkidle' });
  await page.pdf({
    path: out, format: 'Letter', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%; font-family:Inter, sans-serif; font-size:8px; color:#8a8f99; padding:0 0.9in; display:flex; justify-content:space-between;"><span style="letter-spacing:2px; font-weight:700">FROM ZERO · THE DIGITAL PRODUCT PLAYBOOK</span><span class="pageNumber"></span></div>',
  });
  await browser.close();
  const pages = execFileSync('pdfinfo', [out]).toString().match(/Pages:\s+(\d+)/)[1];
  // page previews for checking and for the shop images
  const prev = path.join(dir, 'build', 'pages'); fs.rmSync(prev, { recursive: true, force: true }); fs.mkdirSync(prev, { recursive: true });
  execFileSync('pdftoppm', ['-r', '110', '-png', out, path.join(prev, 'p')]);
  console.log('wrote', out, pages, 'pages');
})();
