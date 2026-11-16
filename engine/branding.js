// Channel art: node engine/branding.js ["CHANNEL NAME"]  ->  branding/profile.png (800x800) and branding/banner.png (2560x1440)
// YouTube crops the banner on phones and desktop to the middle 1546x423 strip, so the name and tagline stay inside it.
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const { CAST, drawCharacter, drawHead } = require('./characters');

const NAME = process.argv[2] ?? 'FROM ZERO';
const TAGLINE = 'New motivational animated stories every week.';
const CTA = 'LINK IN BIO TO LEARN HOW  →';
const GREEN = '#39ff14';
const out = path.join(__dirname, '..', 'branding'); fs.mkdirSync(out, { recursive: true });

function text(c, str, x, y, size, color, o = {}) {
  c.save(); c.font = `${o.weight ?? 900} ${size}px Inter`; c.textAlign = o.align ?? 'center'; c.textBaseline = 'middle'; c.letterSpacing = `${o.spacing ?? 0}px`;
  if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = o.blur ?? 50; }
  c.fillStyle = color; c.fillText(str, x, y); c.restore();
}
function backdrop(c, w, h, cx, cy, r) {
  const g = c.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, '#1d4a2a'); g.addColorStop(0.55, '#0f1f1a'); g.addColorStop(1, '#07090d');
  c.fillStyle = g; c.fillRect(0, 0, w, h);
}

// ---- profile picture: Kai's face, big enough to read at 48px ---------------------
{
  const S = 800; const cv = createCanvas(S, S); const c = cv.getContext('2d');
  // bright green field so the black head reads even at thumbnail size
  { const g = c.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, 560); g.addColorStop(0, '#5dff3d'); g.addColorStop(1, '#159a0c'); c.fillStyle = g; c.fillRect(0, 0, S, S); }
  c.save(); c.strokeStyle = '#0b3d08'; c.globalAlpha = 0.25; c.lineWidth = 10; for (const r of [300, 360]) { c.beginPath(); c.arc(S / 2, S / 2 + 30, r, 0, Math.PI * 2); c.stroke(); } c.restore();
  c.save(); c.translate(S / 2, S / 2 + 70); c.scale(4.0, 4.0); drawHead(c, CAST.heroBefore, 0, 0, 'determined', 0); c.restore();
  fs.writeFileSync(path.join(out, 'profile.png'), cv.toBuffer('image/png'));
}

// ---- banner ----------------------------------------------------------------------
{
  const W = 2560; const H = 1440; const cv = createCanvas(W, H); const c = cv.getContext('2d');
  backdrop(c, W, H, W / 2, H / 2, 1500);
  // faint rising line across the whole banner: the climb from zero
  c.save(); c.strokeStyle = GREEN; c.globalAlpha = 0.22; c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath();
  for (let i = 0; i <= 60; i++) { const x = (i / 60) * W; const y = 1180 - ((i / 60) ** 2.2) * 900 - Math.sin(i * 1.7) * 18; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); c.restore();
  // before and after, either side of the safe strip's text
  drawCharacter(c, CAST.heroBefore, { x: 640, y: 905, s: 0.86, pose: 'slump', expr: 'tired' });
  drawCharacter(c, CAST.heroAfter, { x: 1920, y: 905, s: 0.86, pose: 'power', expr: 'smug' });
  // fit the name to the space between the two figures
  let size = 190; c.font = `900 ${size}px Inter`; while (c.measureText(NAME).width > 900 && size > 60) { size -= 6; c.font = `900 ${size}px Inter`; }
  text(c, NAME, W / 2, 660, size, '#ffffff', { spacing: 6, glow: GREEN, blur: 40 });
  let ts = 44; c.font = `600 ${ts}px Inter`; while (c.measureText(TAGLINE).width > 1040 && ts > 22) { ts -= 1; c.font = `600 ${ts}px Inter`; } // keep it between the two figures
  text(c, TAGLINE, W / 2, 660 + size * 0.5 + 56, ts, '#ffffff', { weight: 700 });
  text(c, CTA, W / 2, 660 + size * 0.5 + 136, 34, GREEN, { spacing: 8, weight: 800 });
  fs.writeFileSync(path.join(out, 'banner.png'), cv.toBuffer('image/png'));
  // preview with the safe strip marked, for checking only
  c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 4; c.setLineDash([20, 14]); c.strokeRect((W - 1546) / 2, (H - 423) / 2, 1546, 423);
  fs.writeFileSync(path.join(out, 'banner-safe-area-preview.png'), cv.toBuffer('image/png'));
}
console.log('wrote branding for', NAME);
