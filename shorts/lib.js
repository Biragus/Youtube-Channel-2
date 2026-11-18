// Shared look for the shorts: near-black background, soft spotlights so the black-headed characters read, short labels.
const K = require('../engine/kit');
const W = 1080; const H = 1920;
function dark(cy = 900) { const c = K.ctx(); const g = c.createRadialGradient(W / 2, cy, 0, W / 2, cy, 1300); g.addColorStop(0, '#1c202c'); g.addColorStop(1, '#040506'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function spot(x, y, r, color = 'rgba(120,140,190,0.22)') { const c = K.ctx(); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
const label = (str, x, y, size, color = '#ffffff', o = {}) => K.T(str, x, y, size, color, { spacing: o.spacing ?? 4, glow: o.glow, blur: o.blur ?? 30, align: o.align, weight: o.weight });
function watermark() { K.T('FROM ZERO', W / 2, 1855, 26, 'rgba(255,255,255,0.28)', { spacing: 8, weight: 800 }); }
function linkTag(k) { if (k <= 0) return; K.at(W / 2, 1765, k, () => { K.card(-190, -44, 380, 88, K.GREEN, 44); K.T('LINK IN BIO', 0, 3, 40, K.INK, { spacing: 3 }); }); }
function shade(color, a, x = 0, y = 0, w = W, h = H) { K.alpha(a, () => { K.ctx().fillStyle = color; K.ctx().fillRect(x, y, w, h); }); }
module.exports = { W, H, dark, spot, label, watermark, linkTag, shade };

// arms tapping at a keyboard; phase offsets two people so they do not move in sync
const typing = (t, phase = 0) => { const a = Math.sin(t * 17 + phase); const b = Math.sin(t * 17 + phase + 2.1); return { lean: 0, tilt: 6 + Math.sin(t * 3 + phase) * 1.5, armL: [34 + a * 5, -70 + a * 16], armR: [34 + b * 5, -70 + b * 16], legL: [5, 0], legR: [5, 0] }; };

// The payoff scene every short cuts to: suit Kai cruising in a sports car along a sunset road. t = seconds since the cut.
function lifestyle(t) {
  const c = K.ctx();
  const sky = c.createLinearGradient(0, 0, 0, 1250); sky.addColorStop(0, '#2b1055'); sky.addColorStop(0.55, '#d53a7a'); sky.addColorStop(1, '#ffb36b'); c.fillStyle = sky; c.fillRect(0, 0, W, 1250);
  spot(540, 980, 520, 'rgba(255,214,120,0.55)'); K.circle(540, 980, 190, '#ffd27a');
  for (let i = 0; i < 6; i++) K.card(0, 1010 + i * 34, W, 14, 'rgba(213,58,122,0.35)', 0); // sun stripes
  // skyline and palms slide past at different speeds
  for (let i = 0; i < 14; i++) { const x = ((i * 170 - t * 120) % 2380 + 2380) % 2380 - 300; const h = 180 + K.rnd(i + 3) * 260; K.card(x, 1250 - h, 140, h, '#1d0f33', 0); }
  for (let i = 0; i < 5; i++) { const x = ((i * 520 - t * 520) % 2600 + 2600) % 2600 - 400; c.save(); c.translate(x, 1250); K.line([[0, 0], [30, -330]], '#120822', 22); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.55; K.line([[30, -330], [30 + Math.cos(a) * 170, -330 + Math.sin(a) * 120 + 60]], '#120822', 18); } c.restore(); }
  // road
  c.fillStyle = '#17121f'; c.fillRect(0, 1250, W, H - 1250); K.line([[0, 1250], [W, 1250]], '#ff7ab6', 6);
  for (let i = 0; i < 8; i++) { const x = ((i * 260 - t * 1500) % 2080 + 2080) % 2080 - 300; K.card(x, 1560, 150, 16, '#ffd27a', 8); }
  // speed lines
  for (let i = 0; i < 10; i++) { const x = ((i * 300 - t * 2200) % 3000 + 3000) % 3000 - 600; K.line([[x, 1300 + (i % 5) * 40], [x + 180, 1300 + (i % 5) * 40]], 'rgba(255,255,255,0.18)', 4); }
  // the car, nose to the right, with Kai at the wheel
  const bob = Math.sin(t * 22) * 2.5;
  K.at(540, 1520 + bob, 1.35, () => {
    c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); c.ellipse(0, 6, 340, 18, 0, 0, Math.PI * 2); c.fill();
    // a convertible: Kai sits in the open cabin, clipped at the door line so only his head and shoulders show
    c.save(); c.beginPath(); c.rect(-400, -400, 800, 340); c.clip(); K.who('kai2', { x: -40, y: 81, s: 0.68, expr: 'smug', still: true, pose: { lean: 0, tilt: -4, armL: [8, 4], armR: [60, -40], legL: [5, 0], legR: [5, 0] } }); c.restore();
    c.strokeStyle = '#0d0d12'; c.lineWidth = 8;
    c.fillStyle = 'rgba(160,220,255,0.3)'; c.beginPath(); c.moveTo(70, -84); c.lineTo(120, -150); c.lineTo(138, -150); c.lineTo(108, -84); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#e8b931'; c.beginPath(); c.moveTo(-330, -20); c.lineTo(-320, -80); c.lineTo(-150, -86); c.lineTo(150, -86); c.lineTo(320, -52); c.lineTo(340, -20); c.lineTo(330, 0); c.lineTo(-330, 0); c.closePath(); c.fill(); c.stroke();
    K.line([[-300, -46], [300, -40]], K.GREEN, 6); K.card(305, -46, 30, 14, '#fff3bf', 6); K.card(-334, -50, 18, 16, '#ff4d4d', 6);
    for (const wx of [-210, 210]) { K.circle(wx, -6, 62, '#0d0d12'); K.circle(wx, -6, 34, '#c9ccd2'); const a = t * 30; K.line([[wx + Math.cos(a) * 30, -6 + Math.sin(a) * 30], [wx - Math.cos(a) * 30, -6 - Math.sin(a) * 30]], '#6b6f78', 6); }
  });
  linkTag(K.pop(t, 0.5)); watermark();
  shade('#ffffff', 0.8 * (1 - K.prog(t, 0, 0.25))); // flash on the cut
}
module.exports.typing = typing; module.exports.lifestyle = lifestyle;
