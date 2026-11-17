// Payhip product images: node product/shop-images.js -> product/shop/*.png (1500x1500, square works in every Payhip layout)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const DIR = __dirname; const OUT = path.join(DIR, 'shop'); fs.mkdirSync(OUT, { recursive: true });
const PDF = path.join(DIR, 'From-Zero-Digital-Product-Playbook.pdf');
const HI = path.join(DIR, 'build', 'hi'); fs.mkdirSync(HI, { recursive: true });
const S = 1500; const GREEN = '#39ff14';

// high-resolution renders of the pages we show
const pick = { cover: 1, ch2: 8, table: 9, script: 11, prompts: 26, prompts2: 28, claude: 25, end: 30 };
for (const [name, n] of Object.entries(pick)) execFileSync('pdftoppm', ['-r', '170', '-png', '-singlefile', '-f', String(n), '-l', String(n), PDF, path.join(HI, name)]);

function backdrop(c) {
  const g = c.createRadialGradient(S / 2, S * 0.42, 0, S / 2, S / 2, S * 0.8);
  g.addColorStop(0, '#1d4a2a'); g.addColorStop(0.55, '#0f1f1a'); g.addColorStop(1, '#050806');
  c.fillStyle = g; c.fillRect(0, 0, S, S);
}
function text(c, str, x, y, size, color, o = {}) {
  c.save(); c.font = `${o.weight ?? 900} ${size}px Inter`; c.textAlign = o.align ?? 'center'; c.textBaseline = 'middle'; c.letterSpacing = `${o.spacing ?? 0}px`;
  if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.blur ?? 40; }
  c.fillStyle = color; c.fillText(str, x, y); c.restore();
}
// a page with a soft shadow, optionally tilted
function page(c, img, x, y, w, rot = 0) {
  const h = w * img.height / img.width;
  c.save(); c.translate(x, y); c.rotate(rot);
  c.shadowColor = 'rgba(0,0,0,0.55)'; c.shadowBlur = 50; c.shadowOffsetY = 24;
  c.fillStyle = '#fff'; c.fillRect(-w / 2, -h / 2, w, h); c.shadowColor = 'transparent';
  c.drawImage(img, -w / 2, -h / 2, w, h); c.restore();
}
// a book: the cover with a spine and page edges, slightly turned
function book(c, img, x, y, w) {
  const h = w * img.height / img.width; const d = 34;
  c.save(); c.translate(x, y); c.transform(1, -0.06, 0, 1, 0, 0);
  c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 70; c.shadowOffsetY = 40;
  c.fillStyle = '#e9e4da'; c.fillRect(-w / 2 + d * 0.4, -h / 2 + d * 0.5, w, h); c.shadowColor = 'transparent';
  for (let i = 0; i < 9; i++) { c.fillStyle = i % 2 ? '#f4f0e8' : '#ddd6c9'; c.fillRect(-w / 2 + d * 0.4 + w - 6 - i * 0.2, -h / 2 + d * 0.5 + i * 3, 6, h - i * 3); }
  c.drawImage(img, -w / 2, -h / 2, w, h);
  const sp = c.createLinearGradient(-w / 2, 0, -w / 2 + 40, 0); sp.addColorStop(0, 'rgba(0,0,0,0.45)'); sp.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = sp; c.fillRect(-w / 2, -h / 2, 40, h);
  c.restore();
}
const save = (name, cv) => fs.writeFileSync(path.join(OUT, name), cv.toBuffer('image/png'));

(async () => {
  const img = {}; for (const k of Object.keys(pick)) img[k] = await loadImage(path.join(HI, `${k}.png`));
  const art = async (n) => loadImage(path.join(DIR, 'build', 'art', `${n}.png`));

  // 1. main image: the book, with Kai before and after
  {
    const cv = createCanvas(S, S); const c = cv.getContext('2d'); backdrop(c);
    const before = await art('kai-before'); const after = await art('kai-after');
    c.globalAlpha = 0.95; c.drawImage(before, 40, 640, 420, 600); c.drawImage(after, 1040, 640, 420, 600); c.globalAlpha = 1;
    book(c, img.cover, 750, 720, 620);
    text(c, 'MAKE AND SELL YOUR FIRST DIGITAL PRODUCT', 750, 110, 40, GREEN, { spacing: 4, weight: 800 });
    text(c, '31 pages  ·  11 chapters  ·  16 copy-paste Claude prompts', 750, 1390, 44, '#ffffff', { weight: 700 });
    save('1-main.png', cv);
  }
  // 2. a look inside: three pages fanned out
  {
    const cv = createCanvas(S, S); const c = cv.getContext('2d'); backdrop(c);
    text(c, 'A LOOK INSIDE', 750, 120, 70, '#ffffff', { spacing: 10 });
    page(c, img.ch2, 380, 790, 560, -0.09); page(c, img.prompts, 1120, 790, 560, 0.09); page(c, img.table, 750, 760, 600, 0);
    text(c, 'Step by step  ·  real examples  ·  copy-paste prompts', 750, 1400, 42, '#c9d6cf', { weight: 700 });
    save('2-inside.png', cv);
  }
  // 3. what you will learn
  {
    const cv = createCanvas(S, S); const c = cv.getContext('2d'); backdrop(c);
    text(c, "WHAT YOU'LL LEARN", 750, 130, 70, '#ffffff', { spacing: 8 });
    const items = ['Find an idea people will actually pay for', 'Check it with real people before you build', 'Let Claude write and design your product', 'Price it and open your shop', 'Get your first ten sales without an audience', 'Make animated story videos with Claude', 'Handle refunds, bad reviews and slow weeks', 'Turn one product into a small shop', '16 copy-paste prompts, step by step'];
    items.forEach((s, i) => { const y = 280 + i * 118; c.fillStyle = 'rgba(255,255,255,0.06)'; c.beginPath(); c.roundRect(150, y - 46, 1200, 92, 46); c.fill(); c.fillStyle = GREEN; c.beginPath(); c.arc(206, y, 26, 0, Math.PI * 2); c.fill(); c.strokeStyle = '#0b1a0f'; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(194, y); c.lineTo(203, y + 10); c.lineTo(220, y - 10); c.stroke(); text(c, s, 260, y + 2, 44, '#ffffff', { align: 'left', weight: 700 }); });
    save('3-learn.png', cv);
  }
  // 4. worksheets and the 30-day plan
  {
    const cv = createCanvas(S, S); const c = cv.getContext('2d'); backdrop(c);
    text(c, 'DO IT ALL WITH CLAUDE', 750, 120, 66, '#ffffff', { spacing: 6 });
    page(c, img.claude, 470, 780, 620, -0.05); page(c, img.prompts2, 1040, 790, 620, 0.05);
    text(c, 'Copy the prompt. Paste it. Done.', 750, 1400, 42, '#c9d6cf', { weight: 700 });
    save('4-claude.png', cv);
  }
  console.log('wrote shop images to', OUT);
})();
