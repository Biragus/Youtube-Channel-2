// Shared look for the shorts: near-black background, soft spotlights so the black-headed characters read, short labels.
const K = require('../engine/kit');
const W = 1080; const H = 1920;
function dark(cy = 900) { const c = K.ctx(); const g = c.createRadialGradient(W / 2, cy, 0, W / 2, cy, 1300); g.addColorStop(0, '#1c202c'); g.addColorStop(1, '#040506'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function spot(x, y, r, color = 'rgba(120,140,190,0.22)') { const c = K.ctx(); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
const label = (str, x, y, size, color = '#ffffff', o = {}) => { if (typeof checking !== 'undefined' && checking) { const w = K.textWidth(str, size, false, o.spacing ?? 4); track(str, o.align === 'left' ? x + w / 2 : (o.align === 'right' ? x - w / 2 : x), y, w, size); } K.T(str, x, y, size, color, { spacing: o.spacing ?? 4, glow: o.glow, blur: o.blur ?? 30, align: o.align, weight: o.weight }); };
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
  for (let i = 0; i < 8; i++) { const x = ((i * 260 - t * 1500) % 2080 + 2080) % 2080 - 300; K.card(x, 1455, 150, 16, '#ffd27a', 8); }
  // speed lines
  for (let i = 0; i < 10; i++) { const x = ((i * 300 - t * 2200) % 3000 + 3000) % 3000 - 600; K.line([[x, 1300 + (i % 5) * 40], [x + 180, 1300 + (i % 5) * 40]], 'rgba(255,255,255,0.18)', 4); }
  // the car, nose to the right, with Kai at the wheel
  const bob = Math.sin(t * 22) * 2.5;
  K.at(540, 1400 + bob, 1.35, () => {
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
// split screens are drawn as two panels inside the safe band (y 250-1490), scaled down so nothing sits under the app's top bar, captions or buttons
const PS = 0.8; const MID = 852;
// each half keeps its useful rows (top: 110-860, bottom: 40-770) and is scaled into the safe band
function panelEnter(y0) { const c = K.ctx(); const [from, to, top] = y0 ? [40, 770, 905] : [110, 860, 245]; c.translate(W / 2 - (W * PS) / 2, top - (y0 + from) * PS); c.scale(PS, PS); c.beginPath(); c.rect(0, y0 + from, W, to - from); c.clip(); c.translate(0, y0 + 480 - 960); } // the shift lets camera() zoom around the half's own centre
function halves(t, CUT, draw) { for (const y0 of [0, 980]) { const c = K.ctx(); c.save(); panelEnter(y0); camera({ x: 540 + Math.sin(t * 0.5 + y0) * 10, y: y0 + 480, z: K.lerp(1, 1.04, t / CUT), t }, () => draw(y0)); c.restore(); } K.line([[60, MID], [W - 60, MID]], 'rgba(255,255,255,0.25)', 4); }
function rain(t, x0, y0, w, h, n = 40, color = 'rgba(160,190,255,0.45)') { for (let i = 0; i < n; i++) { const x = x0 + K.rnd(i) * w; const y = y0 + ((t * 900 + K.rnd(i + 9) * h) % h); K.line([[x, y], [x - 8, y + 30]], color, 3); } }
function sun(x, y, r, t) { spot(x, y, r * 3, 'rgba(255,214,120,0.35)'); K.circle(x, y, r, '#ffd43b'); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + t; K.line([[x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3], [x + Math.cos(a) * r * 1.7, y + Math.sin(a) * r * 1.7]], '#ffd43b', 6); } }
function cloud(x, y, s, col = '#4a5068') { K.at(x, y, s, () => { K.circle(-60, 10, 50, col); K.circle(0, -10, 65, col); K.circle(65, 10, 50, col); K.card(-110, 10, 220, 50, col, 25); }); }
Object.assign(module.exports, { makeShort, title, halves, rain, sun, cloud, panelEnter, MID, PS });
// a rounded tag sized to its text, so the words never spill out
function pill(str, x, y, size, color = '#ffffff', o = {}) { const w = K.textWidth(str, size, false, o.spacing ?? 3) + (o.pad ?? 70); const h = size * 1.9; K.card(x - w / 2, y - h / 2, w, h, o.fill ?? '#0d1018', h / 2, o.border ?? 'rgba(255,255,255,0.5)', 3); label(str, x, y + 3, size, color, { spacing: o.spacing ?? 3 }); }
module.exports.pill = pill;

// ---- "which one are you?" stories: 4 stacked lanes ----------------------------------
const LANE_TOP = 430; const LANE_H = 262;
// lane(i, name, color, fn): draws lane i clipped to its box; fn(y0, floorY) paints it
function lane(i, name, color, fn, o = {}) {
  const y0 = LANE_TOP + i * LANE_H; const c = K.ctx();
  c.save(); c.beginPath(); c.roundRect(20, y0 + 6, W - 40, LANE_H - 12, 22); c.clip();
  K.card(20, y0 + 6, W - 40, LANE_H - 12, o.fill ?? '#0f121a', 22);
  if (o.dim) K.alpha(o.dim, () => K.card(20, y0 + 6, W - 40, LANE_H - 12, '#000000', 22));
  fn(y0, y0 + LANE_H - 34); c.restore();
  c.strokeStyle = o.border ?? 'rgba(255,255,255,0.12)'; c.lineWidth = o.border ? 4 : 2; c.beginPath(); c.roundRect(20, y0 + 6, W - 40, LANE_H - 12, 22); c.stroke();
  K.circle(52, y0 + 36, 8, color); label(name, 68, y0 + 37, 24, color, { align: 'left', spacing: 4 });
}
// a thought or speech tag above a small character
const says = (str, x, y0p, t, a, b, color = '#ffffff') => { const y = y0p + 30; return K.alpha(K.prog(t, a, a + 0.15) * (1 - K.prog(t, b - 0.2, b)), () => pill(str, x, y, 24, color, { pad: 40 })); };
function bar(x, y, w, k, color, txt) { K.card(x, y, w, 24, '#1b1f2b', 12); K.card(x, y, Math.max(24, w * K.clamp(k)), 24, color, 12); if (txt) label(txt, x + w / 2, y - 22, 20, '#9aa3b5', { spacing: 2 }); }
function whichOne(t, from, opts) { if (t < from) return; const k = K.pop(t, from); shade('#000000', 0.85 * K.prog(t, from, from + 0.4)); K.at(W / 2, 960, k, () => { label('WHICH ONE', 0, -60, 90, '#ffffff', { spacing: 6 }); label('ARE YOU?', 0, 50, 100, K.GREEN, { spacing: 6, glow: K.GREEN }); opts.forEach(([s, col], i) => pill(s, (i % 2 ? 1 : -1) * 190, 200 + Math.floor(i / 2) * 80, 30, col, { pad: 40 })); }); }
Object.assign(module.exports, { LANE_TOP, LANE_H, lane, says, bar, whichOne });

// ---- layout safety -------------------------------------------------------------------------
// Screen zones the apps cover: keep text out of y < 230, y > 1500 and the right-hand button column (x > 930 between y 900 and 1600).
const SAFE = { top: 230, bottom: 1500, right: 930 };
// A simple tracker: during a still render with SAFE_CHECK=1, every label/pill reports its screen box, and overlaps are printed.
var boxes = []; var checking = !!process.env.SAFE_CHECK;
function track(str, x, y, w, h) { if (!checking) return; const m = K.ctx().getTransform(); const X = m.a * x + m.e; const Y = m.d * y + m.f; const ww = w * Math.abs(m.a); const hh = h * Math.abs(m.d); if (ww < 30 || hh < 14) return; boxes.push({ str, x0: X - ww / 2, x1: X + ww / 2, y0: Y - hh / 2, y1: Y + hh / 2 }); }
function report(t) { if (!checking) return; const out = []; boxes.forEach((b, i) => { if (b.y0 < SAFE.top - 40 || b.y1 > SAFE.bottom + 60) out.push(`edge: "${b.str}" y ${Math.round(b.y0)}-${Math.round(b.y1)}`); if (b.x1 > SAFE.right + 60 && b.y1 > 900 && b.y0 < 1600) out.push(`buttons: "${b.str}"`); for (let j = i + 1; j < boxes.length; j++) { const o = boxes[j]; if (b.x0 < o.x1 - 6 && o.x0 < b.x1 - 6 && b.y0 < o.y1 - 6 && o.y0 < b.y1 - 6) out.push(`overlap: "${b.str}" / "${o.str}"`); } }); boxes.length = 0; if (out.length) console.log(`t=${t}`, [...new Set(out)].join(' | ')); }
// figures report boxes too: only the safe-zone edges matter for them (feet may touch the bottom band on purpose? no: keep them above it)
function trackBox(kind, x, y, w, h) { if (!checking) return; const m = K.ctx().getTransform(); const X = m.a * x + m.e; const Y = m.d * y + m.f; const ww = w * Math.abs(m.a); const hh = h * Math.abs(m.d); if (ww < 20) return; const y0 = Y - hh / 2; const y1 = Y + hh / 2; const out = []; if (y0 < SAFE.top - 30 && y1 > 0) out.push(`${kind} top ${Math.round(y0)}`); if (y1 > SAFE.bottom + 40 && y0 < 1920) out.push(`${kind} bottom ${Math.round(y1)}`); if (X + ww / 2 > SAFE.right + 80 && Y > 900 && Y < 1600 && X - ww / 2 < 1080) out.push(`${kind} under buttons`); if (out.length) figIssues.push(...out); }
var figIssues = [];
const _report = report; function report2(t) { if (checking && figIssues.length) { console.log(`t=${t}`, [...new Set(figIssues)].join(' | ')); figIssues.length = 0; } _report(t); }
Object.assign(module.exports, { SAFE, report: report2, trackBox });

// ---- small props shared by the later shorts ---------------------------------------------------------
const ground = (y, x0 = -600, x1 = 1700) => { K.card(x0, y, x1 - x0, 1400, '#141823', 0); K.line([[x0, y], [x1, y]], 'rgba(255,255,255,0.18)', 4); };
const coin = (x, y, r = 26, spin = 0) => K.at(x, y, 1, () => { K.ctx().scale(0.35 + 0.65 * Math.abs(Math.cos(spin)), 1); K.circle(0, 0, r, K.GOLD); K.circle(0, 0, r * 0.8, '#e0a92e'); label('$', 0, 2, r * 1.1, '#5c3d00', { spacing: 0 }); });
const rock = (x, y, r, txt, col = '#868e96') => { const c = K.ctx(); c.fillStyle = col; c.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; const rr = r * (0.85 + 0.15 * Math.sin(i * 2.7)); i ? c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : c.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); c.fill(); if (txt) label(txt, x, y + 4, Math.min(r * 0.45, 40), '#ffffff', { spacing: 2 }); };
const sitPose = { lean: 0, tilt: 10, drop: 0, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] };
const pushPose = (t, k = 1) => ({ lean: 26, tilt: 0, armL: [80, -10], armR: [80, -10], legL: [-14 + Math.sin(t * 7 * k) * 14, 0], legR: [24 - Math.sin(t * 7 * k) * 14, -20] });
const npc = (col, hair = 'short') => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'tee', color: col }, pants: '#3b4252', shoes: '#e5e5e5' });
function confetti(t, from, x, y, w = 400) { K.floaters(t, 30, (i, life) => K.card(x - w / 2 + K.rnd(i) * w, y + life * 300, 10, 18, ['#51cf66', '#ffd43b', '#74c0fc'][i % 3], 3), { every: 0.04, from, life: 1.1 }); }
Object.assign(module.exports, { ground, coin, rock, sitPose, pushPose, npc, confetti });
