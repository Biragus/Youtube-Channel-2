// Renders the cast sheet: node engine/cast-sheet.js  ->  characters/cast-sheet.png
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const { CAST, drawCharacter, drawHead } = require('./characters');

const W = 2400; const H = 1620;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');
const INK = '#16161a';

function label(str, x, y, size, o = {}) {
  ctx.save();
  ctx.font = `${o.weight ?? 800} ${size}px Inter`;
  ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = o.color ?? INK;
  if (o.spacing) ctx.letterSpacing = `${o.spacing}px`;
  ctx.fillText(str, x, y);
  ctx.restore();
}

// wraps text to a max width, centred on x
function wrap(str, x, y, size, maxW, color) {
  ctx.save(); ctx.font = `500 ${size}px Inter`;
  const lines = []; let line = '';
  for (const word of str.split(' ')) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; } else line = test;
  }
  lines.push(line); ctx.restore();
  lines.forEach((l, i) => label(l, x, y + i * size * 1.3, size, { weight: 500, color }));
}

function card(x, y, w, h, fill) {
  ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.beginPath(); ctx.roundRect(x + 6, y + 10, w, h, 36); ctx.fill();
  ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.fill();
}

// background
ctx.fillStyle = '#efe6d5'; ctx.fillRect(0, 0, W, H);
label('CAST SHEET', 80, 84, 60, { align: 'left', spacing: 6 });
label('Transformation stories  ·  one rig, drawn in code', 80, 140, 30, { align: 'left', weight: 500, color: '#6b6457' });

// ---- hero: before and after --------------------------------------------
card(80, 200, 560, 700, '#d7dbe2');
drawCharacter(ctx, CAST.heroBefore, { x: 360, y: 760, s: 1.08, pose: 'slump', expr: 'tired' });
label('KAI  ·  BEFORE', 360, 812, 34, { spacing: 3 });
label('Broke, tired, stuck', 360, 856, 26, { weight: 500, color: '#55596a' });

card(680, 200, 560, 700, '#ffd8a8');
drawCharacter(ctx, CAST.heroAfter, { x: 960, y: 760, s: 1.08, pose: 'power', expr: 'smug' });
label('KAI  ·  AFTER', 960, 812, 34, { spacing: 3 });
label('Built it himself', 960, 856, 26, { weight: 500, color: '#7a4a12' });

// arrow between the two
ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(660, 540, 40, 0, Math.PI * 2); ctx.fill();
ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
ctx.beginPath(); ctx.moveTo(642, 540); ctx.lineTo(678, 540); ctx.moveTo(664, 524); ctx.lineTo(680, 540); ctx.lineTo(664, 556); ctx.stroke();

// ---- hero: expressions --------------------------------------------------
card(1280, 200, 1040, 700, '#ffffff');
label('EXPRESSIONS', 1320, 250, 28, { align: 'left', spacing: 4, color: '#6b6457' });
const faces = ['neutral', 'tired', 'sad', 'cry', 'worried', 'shock', 'angry', 'determined', 'smile', 'happy', 'smug'];
faces.forEach((name, i) => {
  const col = i % 4; const row = Math.floor(i / 4);
  const x = 1420 + col * 250; const y = 370 + row * 205;
  drawHead(ctx, CAST.heroBefore, x, y, name, 0);
  label(name, x, y + 92, 24, { weight: 600, color: '#55596a' });
});
// poses, small
const poseX = 2170;
drawCharacter(ctx, CAST.heroBefore, { x: poseX, y: 846, s: 0.33, pose: 'phone', expr: 'shock', prop: 'phone' });
label('with phone', poseX, 872, 24, { weight: 600, color: '#55596a' });

// ---- supporting cast ----------------------------------------------------
label('SUPPORTING CAST', 80, 970, 28, { align: 'left', spacing: 4, color: '#6b6457' });
const row = [
  ['ex', 'crossed', 'smug', '#ffdeeb'],
  ['friend', 'point', 'laugh', '#d3f9d8'],
  ['boss', 'crossed', 'angry', '#e3e5ea'],
  ['mom', 'stand', 'worried', '#eadcff'],
  ['uncle', 'shrug', 'smug', '#ffe2c2'],
  ['believer', 'wave', 'happy', '#d0e8ff'],
  ['mentor', 'hipHand', 'smile', '#dcdde2'],
];
const cw = 300; const gap = 23.3;
row.forEach(([key, pose, expr, bg], i) => {
  const x = 80 + i * (cw + gap);
  card(x, 1010, cw, 550, bg);
  const c = CAST[key];
  drawCharacter(ctx, c, { x: x + cw / 2, y: 1410, s: 0.74, pose, expr });
  label(c.name, x + cw / 2, 1452, 28, { spacing: 2 });
  wrap(c.role, x + cw / 2, 1492, 19, cw - 44, '#55596a');
});

const out = path.join(__dirname, '..', 'characters', 'cast-sheet.png');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, canvas.toBuffer('image/png'));
console.log('wrote', out);
