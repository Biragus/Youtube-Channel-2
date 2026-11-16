// Scene toolkit: everything a shot needs to draw a frame in a line or two.
// The build script calls use(ctx) once and setTime(t) per frame; helpers then draw on that context.
const { CAST, EXPRESSIONS, drawCharacter, drawHead } = require('./characters');
const { ICONS, drawIcon } = require('./icons');

const W = 1920; const H = 1080;
const GREEN = '#39ff14'; const INK = '#16161a'; const RED = '#ff4d4d'; const PAPER = '#f4efe6'; const GOLD = '#f2c14e';
let ctx = null; let NOW = 0;
const use = (c) => { ctx = c; };
const setTime = (t) => { NOW = t; };

// extra faces used by the story
EXPRESSIONS.fake = { eyes: 'sad', mouth: 'smile' };
EXPRESSIONS.happycry = { eyes: 'happy', mouth: 'grin', tear: true };
EXPRESSIONS.hopeful = { eyes: 'shock', mouth: 'smile' };

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = (k) => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeOut = (k) => 1 - (1 - clamp(k)) ** 3;
// 0 -> overshoot -> 1 scale for things that pop in at time `at`
const pop = (t, at = 0, dur = 0.26) => { const k = prog(t, at, at + dur); return k === 0 ? 0 : 1 + Math.sin(k * Math.PI) * 0.2 * (1 - k) - (1 - k) ** 3; };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const money = (v, dec = 0) => `$${v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;

// ---- frame-level helpers ---------------------------------------------------
function bg(inner, outer, cx = W / 2, cy = 480, r = 1150) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, inner); g.addColorStop(1, outer ?? inner);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function zoom(z, fn, cx = W / 2, cy = H / 2) { ctx.save(); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
// slow push or pull across the whole shot, with a small punch on the cut
function drift(f, a, b, fn, cx, cy) { zoom(lerp(a, b, ease(f.k)) + 0.06 * (1 - ease(prog(f.t, 0, 0.14))), fn, cx, cy); }
function at(x, y, s, fn, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fn(); ctx.restore(); }
function alpha(a, fn) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); fn(); ctx.restore(); }
function tint(color, a) { alpha(a, () => { ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); }); }
function shake(amount, fn) { ctx.save(); ctx.translate(Math.sin(NOW * 83) * amount, Math.cos(NOW * 71) * amount); fn(); ctx.restore(); }
function grey(fn) { ctx.save(); ctx.filter = 'grayscale(0.85) brightness(0.9)'; fn(); ctx.restore(); }

function T(str, x, y, size, color = '#ffffff', o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 900} ${size}px ${o.mono ? 'JetBrains Mono' : 'Inter'}`;
  ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = `${o.spacing ?? 0}px`;
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.strokeWidth ?? size * 0.16; ctx.strokeStyle = o.stroke; ctx.strokeText(str, x, y); }
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.blur ?? 40; }
  ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.restore();
}
// Draws an icon centred on (x, y). Known icons are code-drawn so they stay sharp at any size; the rest fall back to emoji.
function E(emoji, x, y, size, rot = 0) {
  if (ICONS[emoji]) { if (size <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(size / 100, size / 100); drawIcon(ctx, emoji); ctx.restore(); return; }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = `${size}px "Noto Color Emoji"`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(emoji, 0, 0); ctx.restore(); }
function textWidth(str, size, mono) { ctx.save(); ctx.font = `900 ${size}px ${mono ? 'JetBrains Mono' : 'Inter'}`; const w = ctx.measureText(str).width; ctx.restore(); return w; }
function card(x, y, w, h, fill, r = 28, stroke, lw = 8) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
function line(pts, color, width) { ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); }
function circle(x, y, r, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

// big caption in the lower third
function cap(str, k = 1, o = {}) {
  if (k <= 0) return;
  at(o.x ?? W / 2, o.y ?? 950, k, () => T(str, 0, 0, o.size ?? 92, o.color ?? '#ffffff', { stroke: o.stroke ?? '#0b0c12', spacing: 3, glow: o.glow }));
}
// small tag in the top-left corner (DAY 12 and similar)
function tag(str, k = 1, color = '#ffffff', fill = '#0d1018') {
  if (k <= 0) return; const w = textWidth(str, 54) + 70;
  at(70 + w / 2, 96, k, () => { card(-w / 2, -48, w, 96, fill, 22, color, 6); T(str, 0, 2, 54, color, { spacing: 4 }); }, -0.03);
}
// counter box: a small title over a big number
function counter(title, value, x, y, color = RED, k = 1, o = {}) {
  if (k <= 0) return; const size = o.size ?? 110; const w = Math.max(textWidth(value, size, true), textWidth(title, 40) + 40) + 90;
  at(x, y, k * (o.s ?? 1), () => {
    const h = size + 130; // box grows with the number
    card(-w / 2, -h / 2, w, h, '#0d1018', 34, color, 8);
    T(title, 0, -h / 2 + 50, 40, '#9aa3b5', { spacing: 8, weight: 700 }); T(value, 0, 34, size, color, { mono: true, weight: 800 });
  }, o.rot ?? 0.02);
}
// speech bubble whose tail points down at (x, y)
function bubble(str, x, y, k = 1, o = {}) {
  if (k <= 0) return; const size = o.size ?? 54; const lines = str.split('\n');
  const w = Math.max(...lines.map((l) => textWidth(l, size))) * 0.93 + 80; const h = lines.length * size * 1.25 + 56; const side = o.side ?? 1;
  at(x, y, k, () => {
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-22 * side, -40); ctx.lineTo(0, 0); ctx.lineTo(26 * side, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
    card(-w / 2, -h - 36, w, h, '#ffffff', 34, INK, 8);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.min(-18 * side, 22 * side), -42, 40, 10);
    lines.forEach((l, i) => T(l, 0, -h - 36 + 28 + size * 0.62 + i * size * 1.25, size, INK, { weight: 800 }));
  });
}
function thought(x, y, r, k, fn) { // thought cloud centred on (x, y) with content drawn by fn
  if (k <= 0) return;
  at(x, y, k, () => { ctx.fillStyle = '#ffffff'; for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.72, Math.sin(a) * r * 0.5, r * 0.5, 0, Math.PI * 2); ctx.fill(); } ctx.beginPath(); ctx.ellipse(0, 0, r * 0.9, r * 0.62, 0, 0, Math.PI * 2); ctx.fill(); circle(-r * 0.75, r * 0.85, r * 0.13, '#ffffff'); circle(-r * 0.95, r * 1.08, r * 0.08, '#ffffff'); fn(); });
}

// ---- characters ---------------------------------------------------------------
const NAMES = { kai: 'heroBefore', kai2: 'heroAfter', maya: 'ex', dex: 'friend', graves: 'boss', mom: 'mom', ray: 'uncle', sam: 'believer', mentor: 'mentor', nora: 'nora' };
const DRIVER_COLORS = ['#c0392b', '#2e86c1', '#d68910', '#1e8449', '#7d3c98', '#5d6d7e', '#b7950b', '#a04000'];
function driverSpec(i) { return { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: DRIVER_COLORS[i % 8], sleeves: i % 2 ? 'short' : undefined }, pants: '#3b4252', shoes: '#e5e5e5', acc: i % 3 === 0 ? ['cap'] : [], accent: DRIVER_COLORS[(i + 3) % 8] }; }
// who('kai', { x, y, s, pose, expr, flip, prop, look, still }) — feet at (x, y); characters breathe unless still
function who(name, o = {}) {
  const spec = typeof name === 'object' ? name : (CAST[NAMES[name]] ?? driverSpec(+String(name).replace(/\D/g, '') || 0));
  const s = o.s ?? 1; const bob = o.still ? 0 : Math.sin(NOW * 2.2 + (o.x ?? 0) * 0.01) * 3 * s;
  drawCharacter(ctx, spec, { ...o, y: (o.y ?? 900) + bob });
}
function head(name, x, y, s, expr, look = 0) { at(x, y, s, () => drawHead(ctx, typeof name === 'object' ? name : CAST[NAMES[name]], 0, 0, expr, look)); }
const withSpec = (name, extra) => ({ ...CAST[NAMES[name]], ...extra });
// custom poses on top of the rig's presets
const P = {
  hold: { lean: 0, tilt: 4, armL: [30, -100], armR: [30, -100], legL: [5, 0], legR: [5, 0] },
  wide: { lean: 0, tilt: 0, armL: [88, 2], armR: [88, 2], legL: [8, 0], legR: [8, 0] },
  sitFloor: { lean: 0, tilt: 12, drop: 0, armL: [12, 10], armR: [12, 10], legL: [62, -40], legR: [62, -40] },
  type: { lean: 0, tilt: 6, armL: [34, -70], armR: [34, -70], legL: [5, 0], legR: [5, 0] },
  give: { lean: 0, tilt: 0, armL: [8, 4], armR: [70, -20], legL: [6, 0], legR: [6, 0] },
  think: { lean: 0, tilt: -6, armL: [8, 4], armR: [26, -150], legL: [5, 0], legR: [5, 0] },
  walk: (ph) => { const a = Math.sin(ph * Math.PI * 2); return { lean: 0, tilt: a * 2, armL: [8 + a * 14, 6], armR: [8 - a * 14, 6], legL: [6 + a * 9, a > 0 ? -a * 22 : 0], legR: [6 - a * 9, a < 0 ? a * 22 : 0] }; },
};

// ---- devices and props -------------------------------------------------------
// phone frame; the screen is a 400x720 area with its origin at the top-left corner
function phone(cx, cy, s, k, draw, rot = 0) {
  if (k <= 0) return;
  at(cx, cy + (1 - easeOut(k)) * 900, s, () => {
    card(-218 + 14, -378 + 18, 436, 756, 'rgba(0,0,0,0.3)', 56); card(-218, -378, 436, 756, '#111114', 56);
    ctx.save(); ctx.beginPath(); ctx.roundRect(-200, -360, 400, 720, 40); ctx.clip(); ctx.translate(-200, -360); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 400, 720); draw(); ctx.restore();
    card(-56, -352, 112, 24, '#111114', 12);
  }, rot);
}
// laptop; the screen is a 640x400 area with its origin at the top-left corner
function laptop(cx, cy, s, draw) {
  at(cx, cy, s, () => {
    card(-340, -430, 680, 440, '#22252e', 22);
    ctx.save(); ctx.beginPath(); ctx.rect(-320, -410, 640, 400); ctx.clip(); ctx.translate(-320, -410); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 640, 400); draw(); ctx.restore();
    ctx.fillStyle = '#3a3f4d'; ctx.beginPath(); ctx.moveTo(-400, 10); ctx.lineTo(400, 10); ctx.lineTo(440, 44); ctx.lineTo(-440, 44); ctx.closePath(); ctx.fill();
  });
}
function sheet(x, y, w, h, rows, cols, o = {}) { // spreadsheet grid
  card(x, y, w, h, '#ffffff', 10, o.stroke ?? '#1e8449', 5);
  ctx.fillStyle = o.head ?? '#1e8449'; ctx.fillRect(x, y, w, h / rows);
  ctx.strokeStyle = '#c8d6cc'; ctx.lineWidth = 2;
  for (let r = 1; r < rows; r++) { ctx.beginPath(); ctx.moveTo(x, y + (h / rows) * r); ctx.lineTo(x + w, y + (h / rows) * r); ctx.stroke(); }
  for (let c = 1; c < cols; c++) { ctx.beginPath(); ctx.moveTo(x + (w / cols) * c, y); ctx.lineTo(x + (w / cols) * c, y + h); ctx.stroke(); }
  ctx.fillStyle = '#9fb3a6';
  for (let r = 1; r < rows; r++) for (let c = 0; c < cols; c++) if (rnd(r * 7 + c + (o.seed ?? 0)) > 0.25) ctx.fillRect(x + (w / cols) * c + 8, y + (h / rows) * (r + 0.36), (w / cols) * (0.3 + rnd(r + c * 3) * 0.4), (h / rows) * 0.26);
}
function van(x, y, s = 1, o = {}) { // side view, nose to the right, wheels on y
  at(x, y + (o.rattle ? Math.sin(NOW * 40) * 3 : 0), s, () => {
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.ellipse(0, 6, 300, 16, 0, 0, Math.PI * 2); ctx.fill();
    card(-290, -300, 420, 260, o.color ?? '#e9e4d8', 24, INK, 8);
    ctx.fillStyle = o.color ?? '#e9e4d8'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(130, -250); ctx.lineTo(220, -250); ctx.lineTo(290, -150); ctx.lineTo(290, -40); ctx.lineTo(130, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#9fd0e8'; ctx.beginPath(); ctx.moveTo(150, -226); ctx.lineTo(210, -226); ctx.lineTo(262, -150); ctx.lineTo(150, -150); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (o.rust) { ctx.fillStyle = '#b5651d'; for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-250 + rnd(i) * 380, -80 - rnd(i + 4) * 60, 10 + rnd(i + 8) * 14, 0, Math.PI * 2); ctx.fill(); } }
    if (o.logo) T(o.logo, -80, -170, 44, o.logoColor ?? INK, { weight: 800 });
    for (const wx of [-190, 190]) { circle(wx, -40, 52, INK); circle(wx, -40, 24, '#c9ccd2'); }
  });
}
function box(x, y, s = 1) { at(x, y, s, () => { card(-60, -100, 120, 100, '#c99a5b', 6, INK, 6); ctx.fillStyle = '#a97a3f'; ctx.fillRect(-10, -100, 20, 100); }); }
function door(x, y, s = 1, color = '#6b4a2f') { at(x, y, s, () => { card(-150, -520, 300, 520, color, 10, INK, 8); card(-110, -480, 220, 200, 'rgba(0,0,0,0.12)', 8); card(-110, -250, 220, 200, 'rgba(0,0,0,0.12)', 8); circle(105, -250, 14, GOLD); }); }
function windowP(x, y, w, h, sky, o = {}) { card(x, y, w, h, sky, 8, o.frame ?? '#f4efe6', 14); line([[x + w / 2, y], [x + w / 2, y + h]], o.frame ?? '#f4efe6', 10); line([[x, y + h / 2], [x + w, y + h / 2]], o.frame ?? '#f4efe6', 10); }
function table(x, y, w, color = '#8a5a3c') { card(x - w / 2, y - 26, w, 26, color, 8, INK, 6); ctx.fillStyle = color; ctx.fillRect(x - w / 2 + 30, y, 24, 150); ctx.fillRect(x + w / 2 - 54, y, 24, 150); }
function floor(y, color, lineColor = 'rgba(0,0,0,0.25)') { ctx.fillStyle = color; ctx.fillRect(0, y, W, H - y); line([[0, y], [W, y]], lineColor, 6); }
function star(x, y, r, fill = GOLD) { ctx.fillStyle = fill; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2; const rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
function tick(x, y, s, ok = true) { at(x, y, s, () => { circle(0, 0, 34, ok ? '#2fb344' : '#e03131'); if (ok) line([[-14, 2], [-4, 13], [16, -11]], '#ffffff', 9); else { line([[-12, -12], [12, 12]], '#ffffff', 9); line([[12, -12], [-12, 12]], '#ffffff', 9); } }); }
function button(str, x, y, w, color, k = 1, pressed = 0) { at(x, y + pressed * 8, k, () => { card(-w / 2, -60 + 12 * (1 - pressed), w, 120, 'rgba(0,0,0,0.3)', 34); card(-w / 2, -60, w, 120, color, 34); T(str, 0, 2, 58, '#ffffff', { spacing: 4 }); }); }
function finger(x, y, s = 1) { at(x, y, s, () => { ctx.lineCap = 'round'; line([[0, 0], [70, 190]], '#111114', 44); circle(0, 0, 22, '#111114'); }); }
// Crisp code-drawn props (emoji go soft when scaled up this large)
function alarm(x, y, s = 1, t = 0) { // ringing alarm clock centred on (x, y)
  at(x, y, s, () => {
    line([[-70, 96], [-104, 150]], INK, 18); line([[70, 96], [104, 150]], INK, 18);
    for (const sd of [-1, 1]) { ctx.save(); ctx.translate(sd * 84, -98); ctx.rotate(sd * 0.62); ctx.fillStyle = '#ffd43b'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 52, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    line([[0, -120], [0, -150]], INK, 12); circle(0, -156, 14, INK);
    circle(0, 0, 124, INK); circle(0, 0, 110, '#e03131'); circle(0, 0, 88, '#ffffff');
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; line([[Math.sin(a) * 70, -Math.cos(a) * 70], [Math.sin(a) * 80, -Math.cos(a) * 80]], INK, i % 3 ? 4 : 8); }
    line([[0, 0], [0, -62]], INK, 9); line([[0, 0], [20, 35]], INK, 11); // five o'clock circle(0, 0, 9, '#e03131');
    for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) { ctx.strokeStyle = '#ffd43b'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(sd * 84, -98, 78 + i * 26, sd > 0 ? -1.3 : Math.PI + 0.5, sd > 0 ? -0.5 : Math.PI + 1.3); ctx.stroke(); }
  }, Math.sin(t * 38) * 0.07);
}
function house(x, y, s = 1) { // front view, standing on y
  at(x, y, s, () => {
    card(120, -470, 56, 130, '#a85a3c', 4, INK, 7);
    card(-230, -300, 460, 300, '#fff3d6', 6, INK, 8);
    ctx.fillStyle = '#e8590c'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-280, -290); ctx.lineTo(0, -480); ctx.lineTo(280, -290); ctx.closePath(); ctx.fill(); ctx.stroke();
    card(-50, -170, 100, 170, '#8a4a2a', 8, INK, 7); circle(26, -84, 9, GOLD);
    for (const wx of [-170, 90]) { card(wx, -220, 90, 90, '#a8dcf5', 6, INK, 7); line([[wx + 45, -220], [wx + 45, -130]], INK, 5); line([[wx, -175], [wx + 90, -175]], INK, 5); }
    circle(0, -370, 30, '#a8dcf5'); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -370, 30, 0, Math.PI * 2); ctx.stroke();
    for (const bx of [-290, -200, 210, 300]) circle(bx, -34, 46, '#4c9a52');
  });
}
function chair(x, y, s = 1, color = '#b9773f') { // wooden chair standing on y
  at(x, y, s, () => {
    for (const lx of [-66, 56]) card(lx, -110, 18, 110, color, 5, INK, 6);
    card(-70, -310, 20, 210, color, 5, INK, 6); card(52, -310, 20, 210, color, 5, INK, 6);
    card(-70, -300, 142, 34, color, 8, INK, 6); card(-70, -236, 142, 30, color, 8, INK, 6);
    card(-84, -132, 172, 30, color, 8, INK, 6);
  });
}
// floating bits that rise and fade, used for laughter, sparks and steam
function floaters(t, n, fn, o = {}) { for (let i = 0; i < n; i++) { const start = (o.every ?? 0.25) * i + (o.from ?? 0); const life = prog(t, start, start + (o.life ?? 1)); if (life <= 0 || life >= 1) continue; alpha(1 - life, () => fn(i, life)); } }

// ---- sets -------------------------------------------------------------------------
const S = {
  // Kai's tiny room. night: true makes it dark
  room(o = {}) {
    bg(o.night ? '#27304d' : '#b9b3a6', o.night ? '#0d101c' : '#8f897d', 960, 500);
    ctx.fillStyle = o.night ? '#161b2e' : '#a39d90'; ctx.fillRect(0, 0, 560, H); ctx.fillRect(1360, 0, 560, H);
    line([[560, 0], [560, 860]], 'rgba(0,0,0,0.3)', 6); line([[1360, 0], [1360, 860]], 'rgba(0,0,0,0.3)', 6);
    floor(860, o.night ? '#11141f' : '#7b7468');
    windowP(1060, 200, 220, 260, o.night ? '#1b2a57' : '#bfe3f5', { frame: o.night ? '#2c3554' : '#f4efe6' });
    if (o.night) circle(1220, 260, 26, '#f6f1c9');
    card(600, 720, 420, 110, o.night ? '#2a3150' : '#6f7d9c', 18); card(600, 690, 130, 60, o.night ? '#3a4368' : '#e8e4da', 16); // bed
  },
  depot(o = {}) {
    bg(o.dawn ? '#f3c9a0' : '#cfd6df', o.dawn ? '#8d7f9c' : '#8e98a8');
    for (let i = 0; i < 9; i++) card(60 + i * 205, 180, 180, 420, i % 2 ? '#6d7a8c' : '#7b889a', 8, 'rgba(0,0,0,0.25)', 5);
    for (let i = 0; i < 9; i++) card(130 + i * 205, 380, 40, 16, '#2b3240', 6);
    floor(820, o.dawn ? '#8a7f86' : '#9aa1ab');
    ctx.fillStyle = '#f2c14e'; for (let i = 0; i < 12; i++) ctx.fillRect(i * 170, 834, 90, 14);
  },
  bay() {
    bg('#b9c0c9', '#6f7884');
    card(260, 120, 1400, 560, '#4d5665', 10, 'rgba(0,0,0,0.3)', 8); for (let i = 0; i < 9; i++) line([[260, 190 + i * 60], [1660, 190 + i * 60]], 'rgba(0,0,0,0.18)', 5);
    floor(800, '#8b929c'); ctx.fillStyle = '#f2c14e'; for (let i = 0; i < 16; i++) { ctx.save(); ctx.translate(i * 130, 800); ctx.transform(1, 0, -0.6, 1, 0, 0); ctx.fillRect(0, 0, 60, 26); ctx.restore(); }
  },
  breakroom() {
    bg('#e8dcc4', '#bfae8c'); floor(840, '#a8946f');
    card(1380, 220, 300, 420, '#d9d2c2', 12, 'rgba(0,0,0,0.25)', 6); card(1410, 250, 240, 150, '#9fd0e8', 8); // vending machine
    card(140, 240, 280, 200, '#f4efe6', 8, 'rgba(0,0,0,0.25)', 6); T('BREAK ROOM', 280, 340, 34, '#8a7a5c', { weight: 800 });
  },
  kitchen() {
    bg('#f5e6c8', '#d9bf8f'); floor(850, '#c49a6c');
    card(0, 560, W, 300, '#e8d3a8', 0); card(0, 540, W, 34, '#b98a55', 0);
    for (let i = 0; i < 5; i++) card(90 + i * 380, 140, 300, 250, '#fff7e6', 10, '#d9b98a', 6);
    windowP(820, 160, 280, 220, '#bfe3f5');
  },
  dinner() { bg('#f0d9b5', '#b58a5a'); floor(880, '#8c6a45'); for (let i = 0; i < 3; i++) card(300 + i * 520, 120, 240, 180, '#fff7e6', 8, '#7a5a3a', 10); },
  library() {
    bg('#e9dfc9', '#b8a888');
    for (let s = 0; s < 4; s++) { card(40 + s * 480, 100, 420, 640, '#7a5a3a', 8); for (let r = 0; r < 4; r++) { for (let b = 0; b < 12; b++) card(60 + s * 480 + b * 32, 130 + r * 150, 26, 110 - rnd(s * 50 + r * 12 + b) * 26, ['#b03a2e', '#2e86c1', '#d4ac0d', '#1e8449', '#7d3c98', '#935116'][Math.floor(rnd(s * 9 + r * 5 + b * 3) * 6)], 3); } }
    floor(840, '#8c7a5c');
  },
  office() {
    bg('#eef2f7', '#c9d3e0'); floor(850, '#a9b4c4');
    windowP(120, 140, 520, 420, '#bfe3f5'); windowP(700, 140, 520, 420, '#bfe3f5');
    for (let i = 0; i < 7; i++) card(150 + i * 150, 420 - rnd(i + 2) * 180, 100, 140 + rnd(i + 2) * 180, 'rgba(90,110,150,0.35)', 0);
  },
  apartment() {
    bg('#fdf3e3', '#f2d9b8'); floor(860, '#d9b98a');
    for (let i = 0; i < 3; i++) { windowP(160 + i * 560, 110, 460, 560, '#a8dcf5'); for (let j = 0; j < 5; j++) card(190 + i * 560 + j * 84, 520 - rnd(i * 5 + j) * 200, 64, 150 + rnd(i * 5 + j) * 200, 'rgba(80,110,160,0.3)', 0); }
  },
  street(o = {}) {
    bg(o.night ? '#2a3565' : (o.sunset ? '#ffb27a' : '#bfe3f5'), o.night ? '#0c1024' : (o.sunset ? '#c0577a' : '#8fc7e8'), 960, 300);
    for (let i = 0; i < 10; i++) { const h = 220 + rnd(i + 11) * 300; card(i * 200 - 20, 760 - h, 180, h, o.night ? '#1a2142' : (o.sunset ? '#6b3a5c' : '#7f93a8'), 0); }
    floor(760, o.night ? '#151a30' : (o.sunset ? '#4a2f4a' : '#69757f')); line([[0, 920], [W, 920]], 'rgba(255,255,255,0.35)', 8);
  },
  dark(inner = '#232a44', outer = '#080a14') { bg(inner, outer); },
};

module.exports = {
  W, H, GREEN, INK, RED, PAPER, GOLD, CAST, use, setTime, ctx: () => ctx, clamp, lerp, prog, ease, easeOut, pop, rnd, money,
  bg, zoom, drift, at, alpha, tint, shake, grey, T, E, textWidth, card, line, circle, cap, tag, counter, bubble, thought,
  who, head, withSpec, P, phone, laptop, sheet, van, box, door, windowP, table, floor, star, tick, button, finger, floaters, S, alarm, house, chair,
};
