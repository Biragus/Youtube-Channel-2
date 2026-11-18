// Shared look for the shorts: near-black background, soft spotlights so the black-headed characters read, short labels.
const K = require('../engine/kit');
const W = 1080; const H = 1920;
function dark(cy = 900) { const c = K.ctx(); const g = c.createRadialGradient(W / 2, cy, 0, W / 2, cy, 1300); g.addColorStop(0, '#1c202c'); g.addColorStop(1, '#040506'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function spot(x, y, r, color = 'rgba(120,140,190,0.22)') { const c = K.ctx(); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
const label = (str, x, y, size, color = '#ffffff', o = {}) => K.T(str, x, y, size, color, { spacing: o.spacing ?? 4, glow: o.glow, blur: o.blur ?? 30, align: o.align, weight: o.weight });
function watermark() { K.T('FROM ZERO', W / 2, 1885, 26, 'rgba(255,255,255,0.28)', { spacing: 8, weight: 800 }); }
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
  // the call to action
  K.at(W / 2, 880, K.pop(t, 0.5) * (1 + 0.04 * Math.sin(t * 6)), () => { K.ctx().save(); K.ctx().shadowColor = K.GREEN; K.ctx().shadowBlur = 50; K.card(-300, -76, 600, 152, K.GREEN, 76); K.ctx().restore(); K.T('LINK IN BIO', 0, 5, 72, K.INK, { spacing: 4 }); K.card(-270, 100, 540, 80, 'rgba(0,0,0,0.6)', 40); label('TO LEARN HOW', 0, 140, 44, '#ffffff', { spacing: 8 }); });
  watermark();
  shade('#ffffff', 0.8 * (1 - K.prog(t, 0, 0.25))); // flash on the cut
}
module.exports.typing = typing; module.exports.lifestyle = lifestyle;

// ---- motion helpers ------------------------------------------------------------
// camera: looks at (x, y) with zoom z; shake in pixels (use impact() for a hit that dies away)
function camera(v, fn) {
  const c = K.ctx(); const sh = v.shake ?? 0; const now = v.t ?? 0;
  c.save(); c.translate(W / 2 + Math.sin(now * 83) * sh, H / 2 + Math.cos(now * 71) * sh); c.scale(v.z ?? 1, v.z ?? 1); c.rotate(v.rot ?? 0); c.translate(-(v.x ?? W / 2), -(v.y ?? H / 2)); fn(); c.restore();
}
const impact = (t, at, amount = 16, dur = 0.4) => (t < at ? 0 : amount * Math.max(0, 1 - (t - at) / dur));
// a hop: 0 most of the time, up to h pixels in a quick arc starting at `at`
const hop = (t, at, h = 60, dur = 0.45) => (t < at || t > at + dur ? 0 : Math.sin(((t - at) / dur) * Math.PI) * h);
// a pulse for counters that just changed: 1 -> 1+amp -> 1
const pulse = (t, period, amp = 0.08) => 1 + amp * Math.max(0, Math.cos(((t % period) / period) * Math.PI * 2)) ** 6;
module.exports.camera = camera; module.exports.impact = impact; module.exports.hop = hop; module.exports.pulse = pulse;

// ---- smooth poses ------------------------------------------------------------------
const { POSES } = require('../engine/characters');
const asPose = (p) => (typeof p === 'string' ? POSES[p] : p);
// blend two poses: k = 0 gives a, 1 gives b (eased), so pose changes glide instead of snapping
function blend(a, b, k) {
  a = asPose(a); b = asPose(b); k = K.ease(K.clamp(k)); if (k <= 0) return a; if (k >= 1) return b;
  const out = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = a[key] ?? (Array.isArray(b[key]) ? [0, 0] : 0); const y = b[key] ?? (Array.isArray(a[key]) ? [0, 0] : 0); out[key] = Array.isArray(x) ? [K.lerp(x[0], y[0], k), K.lerp(x[1], y[1], k)] : K.lerp(x, y, k); }
  return out;
}

// ---- a person working at a laptop, seen from the front ----------------------------------
// Seated behind a desk; the laptop's lid faces the camera. Elbows and forearms tap in turn, the head
// nods a little, and the screen lights the face. o.cheer (0..1) blends into arms-up celebration.
function workstation(x, floorY, s, spec, t, o = {}) {
  const c = K.ctx(); const hipY = floorY - 85 * s; const deskTop = hipY - 40 * s; const ph = o.phase ?? 0;
  const a = Math.sin(t * 15 + ph) * 0.7 + Math.sin(t * 26 + ph) * 0.3; const b = Math.sin(t * 15 + ph + Math.PI) * 0.7 + Math.sin(t * 23 + ph + 1) * 0.3;
  const typingPose = { lean: 0, tilt: 5 + Math.sin(t * 2.3 + ph) * 2.5, drop: 0, armL: [55 + a * 5, -95 + a * 14], armR: [55 + b * 5, -95 + b * 14], legL: [85, -85], legR: [85, -85] };
  const cheerPose = { lean: 0, tilt: -6, drop: 0, armL: [150, 16], armR: [150, 16], legL: [85, -85], legR: [85, -85] };
  const sighPose = { lean: 0, tilt: 16, drop: 8, armL: [40, -110], armR: [40, -110], legL: [85, -85], legR: [85, -85] };
  let pose = typingPose; if (o.sigh) pose = blend(pose, sighPose, o.sigh); if (o.cheer) pose = blend(pose, cheerPose, o.cheer);
  K.card(x - 95 * s, hipY - 190 * s, 190 * s, 190 * s, '#2b2f3a', 22 * s);                       // chair back
  if (o.glow !== false) spot(x, hipY - 220 * s, 170 * s, o.glowColor ?? 'rgba(120,200,255,0.30)'); // screen light on the face
  K.who(spec, { x, y: floorY - (o.hop ?? 0), s, pose, expr: o.expr ?? 'determined', still: true });
  // desk and laptop lid
  K.card(x - 260 * s, deskTop, 520 * s, 22 * s, '#3a3f4d', 6 * s); K.card(x - 240 * s, deskTop + 22 * s, 480 * s, floorY - deskTop - 22 * s, '#262a34', 6 * s);
  c.fillStyle = '#c9ccd2'; c.beginPath(); c.moveTo(x - 70 * s, deskTop); c.lineTo(x + 70 * s, deskTop); c.lineTo(x + 62 * s, deskTop - 100 * s); c.lineTo(x - 62 * s, deskTop - 100 * s); c.closePath(); c.fill();
  c.strokeStyle = '#8d939e'; c.lineWidth = 4 * s; c.stroke();
  K.circle(x, deskTop - 52 * s, 11 * s, o.logo ?? `rgba(57,255,20,${0.55 + 0.35 * Math.abs(Math.sin(t * 4))})`);
}
module.exports.blend = blend; module.exports.workstation = workstation;

// ---- short template ---------------------------------------------------------------
// makeShort(cut, body): body(t) draws the animation up to its payoff; after `cut` the lifestyle scene plays.
function makeShort(CUT, body) {
  return { cut: CUT, duration: CUT + 3, draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', K.prog(t, CUT + 2.5, CUT + 3)); return; }
    body(t); watermark(); shade('#000000', 1 - K.prog(t, 0, 0.3));
  } };
}
// a title, kept clear of the top edge
const title = (str, color = '#ffffff', y = 300, size = 72, glow) => label(str, W / 2, y, size, color, { spacing: 4, glow });
// a split-screen half with its own slow camera; draw(y0) paints it
function halves(t, CUT, draw) { for (const y0 of [0, 980]) { const c = K.ctx(); c.save(); c.beginPath(); c.rect(0, y0 - 20, W, 960); c.clip(); camera({ x: 540 + Math.sin(t * 0.5 + y0) * 10, y: 960, z: K.lerp(1, 1.07, t / CUT), t }, () => draw(y0)); c.restore(); } K.line([[0, 960], [W, 960]], 'rgba(255,255,255,0.25)', 4); }
function rain(t, x0, y0, w, h, n = 40, color = 'rgba(160,190,255,0.45)') { for (let i = 0; i < n; i++) { const x = x0 + K.rnd(i) * w; const y = y0 + ((t * 900 + K.rnd(i + 9) * h) % h); K.line([[x, y], [x - 8, y + 30]], color, 3); } }
function sun(x, y, r, t) { spot(x, y, r * 3, 'rgba(255,214,120,0.35)'); K.circle(x, y, r, '#ffd43b'); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + t; K.line([[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], '#ffd43b', 6); } }
function cloud(x, y, s, col = '#4a5068') { K.at(x, y, s, () => { K.circle(-60, 10, 50, col); K.circle(0, -10, 65, col); K.circle(65, 10, 50, col); K.card(-110, 10, 220, 50, col, 25); }); }
Object.assign(module.exports, { makeShort, title, halves, rain, sun, cloud });
