// Renders hero colour variants side by side: node engine/hero-variants.js  ->  characters/hero-variants.png
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const { CAST, drawCharacter, drawHead } = require('./characters');

const VARIANTS = [
  { title: 'A  ·  BURGUNDY FACE, WHITE EYES', skin: '#8a1c3a', eye: '#ffffff' },
  { title: 'B  ·  BLACK FACE, NEON GREEN EYES', skin: '#111114', eye: '#39ff14', eyeGlow: true },
];
const W = 2400; const H = 1500;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

function label(str, x, y, size, color = '#16161a', weight = 800, spacing = 0) {
  ctx.save(); ctx.font = `${weight} ${size}px Inter`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.letterSpacing = `${spacing}px`; ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.restore();
}
function panel(x, y, w, h, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.fill(); }

ctx.fillStyle = '#efe6d5'; ctx.fillRect(0, 0, W, H);
VARIANTS.forEach((v, i) => {
  const x0 = 60 + i * 1170; const cx = x0 + 555;
  const before = { ...CAST.heroBefore, ...v }; const after = { ...CAST.heroAfter, ...v };
  label(v.title, cx, 70, 40, '#16161a', 800, 3);
  // light scene and dark scene, since videos use both
  panel(x0, 120, 540, 720, '#d7dbe2'); panel(x0 + 570, 120, 540, 720, '#1b2033');
  drawCharacter(ctx, before, { x: x0 + 270, y: 740, s: 1.05, pose: 'slump', expr: 'tired' });
  drawCharacter(ctx, after, { x: x0 + 840, y: 740, s: 1.05, pose: 'power', expr: 'smug' });
  label('BEFORE', x0 + 270, 795, 30, '#55596a', 800, 3); label('AFTER  ·  night scene', x0 + 840, 795, 30, '#c9cfe6', 800, 3);
  panel(x0, 870, 1110, 270, '#ffffff'); panel(x0, 1170, 1110, 270, '#1b2033');
  ['sad', 'shock', 'determined', 'happy', 'smug'].forEach((e, k) => {
    drawHead(ctx, before, x0 + 135 + k * 210, 985, e, 0); label(e, x0 + 135 + k * 210, 1090, 24, '#55596a', 600);
    drawHead(ctx, before, x0 + 135 + k * 210, 1285, e, 0); label(e, x0 + 135 + k * 210, 1390, 24, '#c9cfe6', 600);
  });
});
const out = path.join(__dirname, '..', 'characters', 'hero-variants.png');
fs.writeFileSync(out, canvas.toBuffer('image/png'));
console.log('wrote', out);
