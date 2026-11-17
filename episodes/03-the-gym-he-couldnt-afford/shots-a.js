// Episode 03 drawings, chapters 2 to 4, plus the sets and props shared with shots-b.js and shots-c.js.
// Each shot is { draw(f), sfx } where f = { t: seconds into the shot, d: its length, k: 0..1 progress }.
const K = require('../../engine/kit');
const { W, H, GREEN, INK, RED, GOLD, lerp, prog, ease, easeOut, pop, rnd, money, bg, drift, at, alpha, tint, shake,
  T, E, card, line, circle, cap, tag, counter, bubble, who, withSpec, P, phone, laptop, floor, star, tick, floaters, S, windowP, table } = K;

// ---- cast ---------------------------------------------------------------------
const close = (name, x, expr, o = {}) => { const s = o.s ?? 2.4; who(name, { ...o, x, y: (o.hy ?? 480) + 376 * s, s, expr }); };
const headset = withSpec('kai', { acc: ['headphones'], accent: '#3b3f4a' });
const teeKai = withSpec('kai', { top: { type: 'tee', color: '#4c6ef5', sleeves: 'short' } });
const teeHeadset = { ...teeKai, acc: ['headphones'], accent: '#3b3f4a' };
const brick = { hair: { type: 'short', color: '#22222a', beard: '#22222a' }, top: { type: 'tee', color: '#e03131', sleeves: 'short' }, pants: '#1b1b1f', shoes: '#ffffff', acc: ['watch'] };
const doctor = { hair: { type: 'bun', color: '#3a2a1a' }, top: { type: 'blazer', color: '#ffffff', shirt: '#a5d8ff' }, pants: '#495057', shoes: '#1b1b1f', acc: ['glasses'] };
const physio = { hair: { type: 'pony', color: '#7a4a2a' }, top: { type: 'tee', color: '#1c7ed6', sleeves: 'short' }, pants: '#1b3a5c', shoes: '#ffffff' };
const coworker = { hair: { type: 'curly', color: '#7a4a2a' }, top: { type: 'shirt', color: '#f08c00' }, pants: '#343a40', shoes: '#1b1b1f', acc: ['headphones'], accent: '#3b3f4a' };
const dexGym = withSpec('dex', { top: { type: 'tee', color: '#212529', sleeves: 'short', print: '#e03131' }, acc: ['chain'] });
const flex = { lean: 0, tilt: -4, armL: [84, -100], armR: [84, -100], legL: [9, 0], legR: [9, 0] };
const sit = { lean: 0, tilt: 8, drop: 0, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] };
const squat = (k) => ({ lean: 0, tilt: 4, drop: 0, armL: [70, -10], armR: [70, -10], legL: [5 + k * 60, -k * 110], legR: [5 + k * 60, -k * 110] });
// the hood pulled up over the head of a character standing at (x, y) with scale s
function hood(x, y, s, k = 1, col = '#8b919c') { if (k <= 0) return; const hy = y - 376 * s + (1 - k) * 60 * s; const c = K.ctx(); c.save(); c.globalAlpha *= k; c.strokeStyle = col; c.lineWidth = 30 * s; c.lineCap = 'round'; c.beginPath(); c.arc(x, hy, 76 * s, Math.PI * 0.82, Math.PI * 2.18); c.stroke(); c.restore(); }
// a character lying on its back, feet at (x, y), head to the left
function lying(name, x, y, s, expr, o = {}) { at(x, y, 1, () => who(name, { x: 0, y: 0, s, pose: o.pose ?? P.wide, expr, still: true, look: o.look }), -Math.PI / 2); }

// ---- props ------------------------------------------------------------------
function monitor(x, y, s, screen) { at(x, y, s, () => { card(-170, -240, 340, 220, '#22252e', 14); card(-155, -225, 310, 190, '#e7f5ff', 8); card(-20, -20, 40, 60, '#3a3f4d', 4); card(-80, 36, 160, 16, '#3a3f4d', 6); if (screen) screen(); }); }
function deskFront(x = 960, w = 1100, col = '#b9c2cf') { card(x - w / 2, 800, w, 46, col, 10, INK, 7); card(x - w / 2 + 40, 846, 30, 240, '#8d99a8', 4); card(x + w / 2 - 70, 846, 30, 240, '#8d99a8', 4); }
// a bank app on a phone: o.lines = [[label, amount, colour]]
function bankApp(balance, o = {}) {
  card(0, 0, 400, 720, '#f1f3f5', 0); card(0, 0, 400, 100, '#1f2a44', 0); T('MY BANK', 200, 56, 34, '#ffffff', { spacing: 6 });
  T('BALANCE', 200, 170, 28, '#6b7280', { spacing: 6, weight: 700 }); T(balance, 200, 240, 74, o.color ?? INK, { mono: true, weight: 800 });
  (o.lines ?? []).forEach(([l, a, col], i) => { card(24, 330 + i * 110, 352, 90, '#ffffff', 16); T(l, 50, 375 + i * 110, 30, INK, { align: 'left', weight: 800 }); T(a, 352, 375 + i * 110, 30, col ?? RED, { align: 'right', mono: true, weight: 800 }); });
}
function gauge(x, y, s, v) {
  at(x, y, s, () => {
    card(-270, -240, 540, 340, '#ffffff', 30, INK, 8); const c = K.ctx();
    for (const [col, a, b] of [['#2fb344', 0, 0.42], ['#f59f00', 0.42, 0.72], ['#e03131', 0.72, 1]]) { c.strokeStyle = col; c.lineWidth = 50; c.lineCap = 'butt'; c.beginPath(); c.arc(0, 20, 180, Math.PI + a * Math.PI, Math.PI + b * Math.PI); c.stroke(); }
    const a = Math.PI + v * Math.PI; line([[0, 20], [Math.cos(a) * 165, 20 + Math.sin(a) * 165]], INK, 14); circle(0, 20, 24, INK);
    T('BLOOD PRESSURE', 0, 70, 32, '#6b7280', { spacing: 4, weight: 800 });
  });
}
function priceCard(x, y, s, o = {}) {
  at(x, y, s, () => {
    card(-340, -230, 680, 460, o.faded ? '#ece6d8' : '#ffffff', 24, INK, 8); card(-340, -230, 680, 104, o.faded ? '#c9a3a3' : '#e03131', 24);
    T('MEMBERSHIP', 0, -176, 50, '#ffffff', { spacing: 8 }); T('$60 / MONTH', 0, -50, 84, INK); T('12-MONTH CONTRACT', 0, 50, 46, '#495057'); T('+ $99 JOINING FEE', 0, 130, 46, '#495057');
  }, o.rot ?? -0.03);
}
function calendar(x, y, s, o = {}) {
  at(x, y, s, () => {
    card(-430, -340, 860, 680, '#ffffff', 20, INK, 8); card(-430, -340, 860, 110, o.col ?? '#e03131', 20); T(o.title ?? 'THIS MONTH', 0, -284, 54, '#ffffff', { spacing: 8 });
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach((d, i) => T(d, -360 + i * 120, -190, 34, '#495057'));
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 7; c2++) { const cx = -360 + c2 * 120; const cy = -100 + r * 110; T(String(r * 7 + c2 + 1), cx, cy, 36, '#adb5bd', { weight: 700 }); if (o.mark) o.mark(r, c2, cx, cy); }
  }, o.rot ?? 0);
}
function ring(cx, cy, r, col, w = 7) { const c = K.ctx(); c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke(); }
function cross(cx, cy, r, col, w = 8) { line([[cx - r, cy - r], [cx + r, cy + r]], col, w); line([[cx + r, cy - r], [cx - r, cy + r]], col, w); }
function shoebox(x, y, s, o = {}) {
  at(x, y, s, () => {
    card(-230, -150, 460, 150, '#e8590c', 10, INK, 8); card(-250, -180, 500, 50, '#c2410c', 10, INK, 8); T('RUN', 0, -70, 60, '#ffffff', { spacing: 10 });
    if (o.tag !== false) { line([[200, -160], [280, -230]], INK, 4); at(310, -250, 1, () => { card(-70, -40, 140, 80, '#fff3bf', 10, INK, 5); T('$89', 0, 2, 46, INK); }, 0.2); }
    if (o.dust) for (let i = 0; i < 14; i++) circle(-220 + rnd(i) * 440, -186 - rnd(i + 3) * 10, 4, 'rgba(255,255,255,0.45)');
  }, o.rot ?? 0);
}
// open notebook; o.left / o.right draw on the pages (each page is 490x640, centred at -255 and 255)
function notebook(x, y, s, o = {}) {
  at(x, y, s, () => {
    card(-530, -350, 1060, 700, o.glow ? '#1d3a26' : '#2b2f3a', 26);
    if (o.glow) { const c = K.ctx(); c.save(); c.shadowColor = GREEN; c.shadowBlur = 80; card(-530, -350, 1060, 700, 'rgba(57,255,20,0.25)', 26); c.restore(); }
    card(-505, -325, 490, 650, '#fffdf5', 10); card(15, -325, 490, 650, '#fffdf5', 10);
    for (let i = 0; i < 9; i++) { line([[-475, -200 + i * 60], [-45, -200 + i * 60]], '#d0ebff', 3); line([[45, -200 + i * 60], [475, -200 + i * 60]], '#d0ebff', 3); }
    if (o.left) o.left(); if (o.right) o.right();
  }, o.rot ?? 0);
}
// a page of day ticks: n ticks shown, gaps = indexes left empty
function dayTicks(cx, cy, n, o = {}) { for (let i = 0; i < (o.of ?? 28); i++) { const x = cx - 195 + (i % 7) * 65; const y = cy - 150 + Math.floor(i / 7) * 100; ring(x, y, 24, '#ced4da', 3); if (i < n && !(o.gaps ?? []).includes(i)) tick(x, y, 0.62); } }
function planCover(x, y, s, o = {}) {
  at(x, y, s, () => {
    card(-260, -360, 520, 720, '#fff7e6', 18, INK, 8); card(-260, -360, 520, 250, '#2f9e44', 18); card(-260, -130, 520, 20, '#2f9e44', 0);
    T('THE', 0, -306, 38, '#d3f9d8', { spacing: 10 }); T('LIVING ROOM', 0, -238, 62, '#ffffff'); T('PLAN', 0, -170, 62, '#ffffff');
    E('🛋️', 0, 40, 200); T('12 WEEKS · NO GYM', 0, 190, 34, INK, { spacing: 2 });
    if (o.price !== false) { star(180, 296, 80, GOLD); T('$9', 180, 304, 50, INK); }
  }, o.rot ?? 0);
}
const salesCounter = (v, k = 1, o = {}) => counter('SALES', String(v), o.x ?? 1500, o.y ?? 260, String(v) !== '0' ? GREEN : '#9aa3b5', k, { size: o.size ?? 150 });
const stairsCounter = (n, x, y, k = 1, o = {}) => counter(o.title ?? 'STAIRS', `${n} / 14`, x, y, n >= 14 ? GREEN : GOLD, k, { size: o.size ?? 120 });
const cardCounter = (v, x, y, k = 1, o = {}) => counter('CREDIT CARD', money(v), x, y, v > 0 ? RED : GREEN, k, { size: o.size ?? 120 });

// ---- sets -------------------------------------------------------------------
const SET = {
  callCentre(o = {}) {
    bg(o.night ? '#2b3350' : '#d5dde6', o.night ? '#0e1220' : '#8d99a8');
    for (let i = 0; i < 4; i++) card(140 + i * 440, 60, 300, 22, o.night ? '#3a4466' : '#ffffff', 10);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 7; i++) { const x = -40 + i * 300 + r * 150; const y = 440 + r * 110; card(x + 70, y - 70, 100, 70, '#22252e', 6); if (!o.night || (i + r) % 3 === 0) card(x + 80, y - 62, 80, 50, o.night ? '#4dabf7' : '#a5d8ff', 4); card(x, y, 240, 120, o.night ? '#2a3150' : '#9aa7b8', 8, 'rgba(0,0,0,0.25)', 5); }
    floor(820, o.night ? '#151a2c' : '#7d8898');
  },
  clinic() { bg('#e6f4f1', '#a9c9c2'); floor(860, '#c4d6d2'); card(1560, 150, 220, 220, '#ffffff', 20, '#c9d6d2', 6); card(1645, 180, 50, 160, '#e03131', 6); card(1590, 235, 160, 50, '#e03131', 6); windowP(160, 150, 380, 300, '#bfe3f5'); },
  gym(o = {}) {
    bg('#f8f9fa', '#ced4da');
    for (let i = 0; i < 7; i++) card(i * 300 - 40, 40, 280, 660, 'rgba(165,216,255,0.35)', 0, 'rgba(255,255,255,0.95)', 10);
    floor(800, '#495057');
    for (let i = 0; i < 5; i++) { const x = 200 + i * 380; card(x - 100, 640, 200, 30, INK, 8); card(x - 10, 520, 20, 130, '#868e96', 4); card(x - 90, 500, 180, 28, '#e03131', 8); circle(x - 110, 514, 34, INK); circle(x + 110, 514, 34, INK); }
    if (o.sign !== false) { card(640, 90, 640, 120, '#e03131', 20, INK, 8); T('IRONCLAD GYM', 960, 152, 66, '#ffffff', { spacing: 6 }); }
  },
  gymDesk(x = 960, w = 900) { card(x - w / 2, 700, w, 60, '#212529', 10); card(x - w / 2 + 20, 760, w - 40, 330, '#343a40', 0); },
  living(o = {}) {
    bg(o.night ? '#2c2a44' : '#f3e3c8', o.night ? '#0e0d18' : '#c9a77a'); floor(820, o.night ? '#1b1a2b' : '#a07c55');
    K.ctx().fillStyle = o.night ? '#3b2f4a' : '#b5654a'; K.ctx().beginPath(); K.ctx().ellipse(960, 950, 760, 110, 0, 0, Math.PI * 2); K.ctx().fill(); // rug
    windowP(1380, 150, 340, 300, o.night ? '#1b2a57' : '#bfe3f5', { frame: o.night ? '#3b3a5c' : '#f4efe6' });
    if (o.sofa !== false) { card(140, 560, 640, 250, '#5c7cfa', 40, INK, 8); card(170, 470, 580, 140, '#748ffc', 40, INK, 8); card(110, 600, 90, 210, '#4c6ef5', 30, INK, 8); card(720, 600, 90, 210, '#4c6ef5', 30, INK, 8); }
  },
  // 14 steps rising to the right; stepAt(i) gives the feet position on step i (0..13), 14 = the landing
  stairs(o = {}) {
    bg(o.dark ? '#3b3226' : '#efe3cf', o.dark ? '#120e09' : '#b8a07a');
    const c = K.ctx(); c.fillStyle = o.dark ? '#5a4a36' : '#c9a77a'; c.beginPath(); c.moveTo(300, H); c.lineTo(300, 1020);
    for (let i = 0; i < 14; i++) { c.lineTo(300 + i * 70, 1020 - (i + 1) * 35); c.lineTo(370 + i * 70, 1020 - (i + 1) * 35); }
    c.lineTo(W, 530); c.lineTo(W, H); c.closePath(); c.fill(); c.strokeStyle = INK; c.lineWidth = 6; c.stroke();
    floor(1020, o.dark ? '#2a2219' : '#9c7c56');
    for (let i = 0; i < 6; i++) line([[340 + i * 175, 920 - i * 87], [340 + i * 175, 770 - i * 87]], '#6b4a2f', 8);
    line([[320, 770], [1300, 285]], '#6b4a2f', 14);
  },
};
const stepAt = (i) => (i >= 14 ? [1500, 530] : [335 + i * 70, 1020 - (i + 1) * 35]);

const _shared = { close, headset, teeKai, teeHeadset, brick, doctor, physio, coworker, dexGym, flex, sit, squat, hood, lying, monitor, deskFront, bankApp, gauge, priceCard, calendar, ring, cross, shoebox, notebook, dayTicks, planCover, salesCounter, stairsCounter, cardCounter, SET, stepAt };

const BG = { navy: ['#22314f', '#0a0d1a'], red: ['#3b1f1f', '#0c0609'], dark: ['#1b2033', '#07080d'], green: ['#123d1c', '#030a05'] };

module.exports = {
  _shared,
  // ===== 2. The situation ===================================================
  '2a': { sfx: [['typing', 0.4, 0.5]], draw: (f) => drift(f, 1.0, 1.07, () => { SET.callCentre(); who(headset, { x: 760, y: 1000, s: 1.6, pose: P.type, expr: 'tired' }); deskFront(); monitor(1220, 800, 1.1, () => { for (let i = 0; i < 4; i++) card(-130, -205 + i * 40, 200 - i * 30, 18, '#74c0fc', 6); }); tag('$14.20 / HOUR', pop(f.t, 0.4), '#ffd43b'); }) },
  '2a2': { sfx: [['counter', 1.0, 0.6], ['error', 2.0, 0.4]], draw: (f) => { const k = ease(prog(f.t, 1.0, 2.0)); drift(f, 1.0, 1.06, () => { bg(...BG.navy); phone(960, 560, 1.25, 1, () => bankApp(money(Math.round(lerp(1262, 62, k))), { color: k > 0.9 ? RED : INK, lines: k > 0 ? [['RENT', '-$1,200']] : [] })); }); } },
  '2a3': { sfx: [['paper', 0.8], ['heartbeat', 1.5, 0.5]], draw: (f) => { const flip = prog(f.t, 0.7, 1.2); drift(f, 1.0, 1.08, () => { bg('#3a2a20', '#0f0a07'); card(160, 640, 1600, 60, '#8a5a3c', 10, INK, 7); at(960, 470, 1, () => { const sx = Math.abs(Math.cos(flip * Math.PI)); K.ctx().scale(Math.max(0.02, sx), 1); card(-360, -230, 720, 460, '#ffffff', 16, '#c9cfd6', 6); if (flip < 0.5) { for (let i = 0; i < 6; i++) card(-300, -170 + i * 60, 600 - (i % 3) * 120, 18, '#dee2e6', 6); } else { card(-360, -230, 720, 90, RED, 16); T('STATEMENT', 0, -184, 44, '#ffffff', { spacing: 6 }); T('BALANCE DUE', 0, -60, 40, '#6b7280', { weight: 800 }); T('$4,180', 0, 50, 140, RED, { mono: true, weight: 800 }); } }, -0.03); }); } },
  '2b': { sfx: [['slam', 0.9, 0.3], ['paper', 2.6, 0.6]], draw: (f) => drift(f, 1.0, 1.06, () => { const night = f.k > 0.5; if (!night) { SET.callCentre(); card(700, 160, 520, 760, '#d9d2c2', 16, INK, 8); card(740, 200, 440, 460, '#22252e', 10); for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) card(770 + i * 105, 230 + r * 140, 80, 100, ['#e03131', '#f08c00', '#7048e8', '#1c7ed6'][(i + r) % 4], 8); card(760, 760, 400, 110, '#111114', 10); const d = easeOut(prog(f.t, 0.4, 0.9)); card(900, lerp(370, 790, d), 120, 60, '#e03131', 8, INK, 5); } else { S.room({ night: true }); table(960, 760, 420); at(960, 700, pop(f.t, f.d * 0.52), () => { card(-90, -130, 180, 140, '#d9b98a', 8, INK, 6); line([[-40, -130], [-30, -170], [30, -170], [40, -130]], INK, 6); T('TAKEAWAY', 0, -60, 26, INK); }); tag('10:00 PM', 1, '#a5d8ff'); } }) },
  '2b2': { sfx: [['typing', 0.3, 0.25]], draw: (f) => drift(f, 1.0, 1.08, () => { SET.callCentre({ night: true }); who(headset, { x: 760, y: 1000, s: 1.6, pose: P.type, expr: 'tired' }); deskFront(960, 1100, '#5c6680'); monitor(1220, 800, 1.1, () => { T('CALL 61', 0, -130, 40, INK); }); tag('9:00 PM', pop(f.t, 0.2), '#a5d8ff'); }) },
  '2c': { draw: (f) => drift(f, 1.0, 1.1, () => { bg('#4a4f5c', '#15171d'); card(560, 80, 800, 960, '#c9cfd6', 30, INK, 10); card(590, 110, 740, 900, '#9fb6c9', 20); alpha(0.85, () => { who('kai', { x: 960, y: 1250, s: 2.2, expr: 'sad', pose: 'slump' }); hood(960, 1250 + 22, 2.2, ease(prog(f.t, 0.6, 1.6))); }); line([[640, 300], [760, 180]], 'rgba(255,255,255,0.5)', 14); line([[640, 420], [880, 180]], 'rgba(255,255,255,0.3)', 10); }) },
  '2d': { sfx: [['glass', 1.1, 0.25]], draw: (f) => drift(f, 1.03, 1.0, () => { S.street(); at(1180, 470, pop(f.t, 0.1), () => { card(-560, -360, 1120, 720, '#ffffff', 16, INK, 8); card(-520, -320, 1040, 560, '#a5d8ff', 6); [['driver1', -300], ['dex', -100], ['driver4', 300]].forEach(([n, x]) => who(n, { x, y: 220, s: 0.9, expr: 'happy', pose: 'wave' })); K.ctx().setLineDash([18, 14]); ring(110, -40, 90, '#ffffff', 6); K.ctx().setLineDash([]); }, 0.02); who('kai', { x: 330, y: 1000, s: 1.5, pose: 'phone', prop: 'phone', expr: 'fake' }); flashK(f); }) },
  '2e': { sfx: [['pen', 0.5, 0.6]], draw: (f) => drift(f, 1.0, 1.07, () => { bg(...BG.red); calendar(960, 560, 1.15, { mark: (r, c2, cx, cy) => { if (c2 !== 0) return; const at0 = 0.3 + r * 0.7; if (f.t > at0) ring(cx, cy, 40, RED); if (f.t > at0 + 0.35) cross(cx, cy, 34, INK, 9); } }); }) },
  '2e2': { draw: (f) => drift(f, 1.0, 1.12, () => { bg('#2b2a36', '#0c0b10'); card(0, 0, W, 300, '#3a3f5c', 0); card(0, 280, W, 40, '#2a2f48', 0); floor(860, '#1d1c26'); shoebox(960, 860, 1.6, { dust: true }); }) },
  '2f': { sfx: [['glass', 1.0, 0.3]], draw: (f) => drift(f, 1.0, 1.06, () => { S.dinner(); who('mom', { x: 560, y: 1000, s: 1.5, pose: P.give, expr: 'sad' }); who('kai', { x: 1360, y: 1000, s: 1.5, flip: true, expr: 'sad', pose: 'slump' }); table(960, 760, 1300); const x = lerp(700, 1180, ease(prog(f.t, 0.6, 2.2))); at(x, 720, 1, () => { K.ctx().fillStyle = '#ffffff'; K.ctx().beginPath(); K.ctx().ellipse(0, 0, 110, 40, 0, 0, Math.PI); K.ctx().fill(); for (let i = 0; i < 7; i++) circle(-70 + i * 23, -6 - rnd(i) * 16, 22, ['#2f9e44', '#51cf66', '#e03131'][i % 3]); }); }) },
  '2g': { draw: (f) => drift(f, 1.0, 1.07, () => { SET.gym({ sign: false }); who(dexGym, { x: 900, y: 1000, s: 1.8, pose: flex, expr: 'smug' }); at(1380, 760, 1, () => { card(-50, -160, 100, 180, '#ffffff', 16, INK, 7); card(-50, -190, 100, 40, '#e03131', 10, INK, 7); T('PRO', 0, -60, 34, INK); }); }) },
  '2h': { draw: (f) => drift(f, 1.0, 1.08, () => { SET.gym({ sign: false }); close(dexGym, 600, 'smug', { s: 2.2, hy: 520 }); bubble('Bro, just eat less\nand move more.', 1290, 640, pop(f.t, 0.2), { size: 66, side: -1 }); }) },
  '2i': { draw: (f) => drift(f, 1.0, 1.1, () => { S.street({ sunset: true }); card(700, 800, 520, 34, '#8a5a3c', 8, INK, 6); card(730, 834, 24, 90, '#5a3a20', 4); card(1166, 834, 24, 90, '#5a3a20', 4); who('kai', { x: 960, y: 920, s: 1.5, pose: sit, expr: 'sad' }); }) },

  // ===== 3. The doctor and the gym ==========================================
  '3a': { draw: (f) => drift(f, 1.0, 1.06, () => { SET.clinic(); who('kai', { x: 620, y: 960, s: 1.5, pose: 'slump', expr: 'worried' }); card(530, 560, 44, 56, '#1c7ed6', 10, INK, 5); who(doctor, { x: 1260, y: 960, s: 1.5, flip: true, expr: 'worried', pose: P.think }); monitor(1560, 700, 0.9, () => T('158/98', 0, -130, 56, '#f08c00', { mono: true })); }) },
  '3b': { sfx: [['heartbeat', 0.2, 0.6]], draw: (f) => drift(f, 1.0, 1.1, () => { bg('#e6f4f1', '#8fb5ad'); gauge(960, 560, 1.6, lerp(0.25, 0.62, ease(prog(f.t, 0.2, f.d * 0.8)))); }) },
  '3c': { draw: (f) => drift(f, 1.0, 1.07, () => { SET.clinic(); close(doctor, 560, 'determined', { s: 2.2, hy: 520 }); bubble('Start moving.\nNot someday. Now.', 1280, 640, pop(f.t, 0.2), { size: 66, side: -1 }); }) },
  '3d': { sfx: [['door', 0.4, 0.4]], draw: (f) => drift(f, 1.08, 1.0, () => { SET.gym(); card(120, 330, 300, 470, 'rgba(255,255,255,0.4)', 8, '#adb5bd', 10); who('kai', { x: 270, y: 800, s: 0.95, pose: 'slump', expr: 'worried' }); }) },
  '3e': { sfx: [['pen', 0.4, 0.4]], draw: (f) => drift(f, 1.0, 1.07, () => { SET.gym(); who(brick, { x: 960, y: 1060, s: 2.0, pose: 'crossed', expr: 'smug' }); SET.gymDesk(); at(1260, 690, 1, () => { card(-90, -40, 180, 40, '#8a5a3c', 6, INK, 5); card(-70, -120, 140, 90, '#ffffff', 6, INK, 5); }, 0.1); tag('BRICK', pop(f.t, 0.3), '#ff8787'); }) },
  '3f': { sfx: [['paper', 0.3]], draw: (f) => drift(f, 1.0, 1.06, () => { bg('#343a40', '#121416'); card(0, 560, W, 520, '#212529', 0); priceCard(lerp(1500, 960, easeOut(prog(f.t, 0.2, 0.9))), 520, 1.2); }) },
  '3g': { draw: (f) => drift(f, 1.0, 1.07, () => { SET.gym(); who('kai', { x: 560, y: 1000, s: 1.3, pose: 'shrug', expr: 'worried' }); who(brick, { x: 1360, y: 1060, s: 2.0, pose: 'crossed', flip: true, expr: 'smug' }); SET.gymDesk(1360, 760); bubble('Any way to\npay a bit less?', 560, 420, pop(f.t, 0.3), { size: 56 }); }) },
  '3h': { sfx: [['laugh', 0.3, 0.8]], draw: (f) => drift(f, 1.0, 1.07, () => { SET.gym({ sign: false }); at(1400, 380, 1, () => { card(-300, -260, 600, 520, '#ffffff', 20, INK, 8); const j = ease(prog(f.t, 0.4, 1.2)); card(-200, 160 - 340 * j, 150, 340 * j, '#2f9e44', 6); card(50, 160 - 60 * j, 150, 60 * j, RED, 6); T('JAN', -125, 210, 44, INK); T('FEB', 125, 210, 44, INK); }); who(brick, { x: 640, y: 1060, s: 2.0, pose: 'point', expr: 'laugh' }); floaters(f.t, 6, (i, life) => T('HA', 520 + i * 40, 300 - life * 200, 60, '#ff8787'), { every: 0.4, from: 0.3 }); }) },
  '3i': { draw: (f) => drift(f, 1.0, 1.05, () => { bg('#dee2e6', '#868e96'); floor(860, '#495057'); for (let i = 0; i < 4; i++) { card(80 + i * 460, 120, 400, 700, '#c9d6e3', 10, '#868e96', 12); } const x = lerp(240, 1680, f.k); for (let i = 0; i < 4; i++) { const mx = 280 + i * 460; if (Math.abs(x - mx) < 260) alpha(0.5, () => who('kai', { x: mx + (x - mx) * 0.3, y: 800, s: 1.0, expr: 'sad', pose: 'slump', flip: true })); } who('kai', { x, y: 1000, s: 1.4, pose: P.walk(f.t * 1.2), expr: 'sad', look: 0.4 }); }) },
  '3j': { sfx: [['error', 0.6, 0.4]], draw: (f) => drift(f, 1.0, 1.07, () => { bg(...BG.red); phone(960, 560, 1.25, 1, () => bankApp('$312.40', { color: RED, lines: [['RENT DUE', '9 DAYS', '#e8590c']] })); tag('RENT IN 9 DAYS', pop(f.t, 0.6), '#ff8787'); }) },
  '3k': { sfx: [['door', 0.6, 0.5], ['heartbeat', 1.6, 0.5]], draw: (f) => drift(f, 1.0, 1.04, () => { const sh = ease(prog(f.t, 0.3, 1.2)); card(0, 0, 960, H, '#e9ecef', 0); card(120, 200, 720, 880, 'rgba(165,216,255,0.5)', 0, '#868e96', 10); card(120, 200, 360 * sh, 880, 'rgba(116,192,252,0.85)', 0, INK, 6); card(840 - 360 * sh, 200, 360 * sh, 880, 'rgba(116,192,252,0.85)', 0, INK, 6); T('MEMBERS ONLY', 480, 140, 52, INK, { spacing: 4 }); card(960, 0, 960, H, '#fff5f5', 0); gauge(1440, 560, 1.2, 0.64); line([[960, 0], [960, H]], INK, 10); }) },
  '3k0': { sfx: [['heartbeat', 0.3, 0.6]], draw: (f) => drift(f, 1.0, 1.05, () => { card(0, 0, 960, H, '#3b3226', 0); card(960, 0, 960, H, '#3b1f1f', 0); line([[960, 0], [960, H]], '#ffffff', 8); T('BODY', 480, 260, 60, '#9aa3b5', { spacing: 10 }); T('BANK', 1440, 260, 60, '#9aa3b5', { spacing: 10 }); stairsCounter(0, 480, 560, pop(f.t, 0.2), { size: 130 }); cardCounter(4180, 1440, 560, pop(f.t, 0.6), { size: 130 }); }) },
  '3k2': { draw: (f) => drift(f, 1.0, 1.06, () => { S.street({ night: true }); card(1100, 160, 560, 760, '#adb5bd', 10, INK, 8); card(1130, 190, 500, 700, '#ffe8cc', 4); who(withSpec('dex', { acc: [], top: { type: 'tee', color: '#212529', sleeves: 'short' } }), { x: 1380, y: 760, s: 1.25, pose: flex, expr: 'smug', still: true }); T('NO EXCUSES', 1380, 830, 70, '#e03131', { spacing: 4 }); const x = lerp(200, 900, f.k); who('kai', { x, y: 1000, s: 1.4, pose: P.walk(f.t * 1.1), expr: 'sad' }); hood(x, 1000, 1.4); }) },
  '3k3': { draw: (f) => drift(f, 1.0, 1.08, () => { S.room({ night: true }); who('kai', { x: 800, y: 860, s: 1.4, pose: sit, expr: 'sad' }); shoebox(1260, 960, 0.8, { tag: false, rot: 0.1 }); }) },

  // ===== 4. Trying and failing ==============================================
  '4a': { sfx: [['typing', 0.2, 0.3]], draw: (f) => drift(f, 1.0, 1.08, () => { SET.living(); laptop(1120, 890, 0.9, () => { card(0, 0, 640, 400, '#fff4e6', 0); who(dexGym, { x: 320, y: 360, s: 0.7, pose: 'cheer', expr: 'happy', still: true }); T('30:00 FULL BODY', 320, 40, 34, '#e8590c'); }); who('kai', { x: 600, y: 1040, s: 1.5, pose: 'stand', expr: 'worried' }); }) },
  '4b': { sfx: [['heartbeat', 0.3, 0.5]], draw: (f) => drift(f, 1.0, 1.08, () => { SET.living({ sofa: false }); lying('kai', 1300, 920, 1.4, 'tired'); counter('TIMER', '4:07', 1400, 300, RED, pop(f.t, 0.3), { size: 130 }); floaters(f.t, 6, (i, life) => circle(780 + i * 30, 800 - life * 160, 10, '#a5d8ff'), { every: 0.4 }); }) },
  '4c': { draw: (f) => drift(f, 1.0, 1.05, () => { SET.stairs(); const i = lerp(9, 5, f.k); const [x, y] = stepAt(Math.floor(i)); who('kai', { x, y, s: 1.0, pose: { lean: 0, tilt: 6, armL: [8, 4], armR: [130, -20], legL: [5, 0], legR: [5, 0] }, expr: 'worried', flip: true }); floaters(f.t, 6, (n, life) => T('OW', x - 80 + n * 30, y - 470 - life * 140, 54, RED), { every: f.d / 6 }); }) },
  '4d': { sfx: [['pen', 0.3, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => { bg(...BG.navy); calendar(960, 560, 1.15, { col: '#495057', mark: (r, c2, cx, cy) => { const n = r * 7 + c2; if ([0, 3, 7].includes(n) && f.t > 0.3 + [0, 3, 7].indexOf(n) * 0.5) tick(cx, cy, 1.0); } }); }) },
  '4d2': { draw: (f) => drift(f, 1.0, 1.08, () => { SET.living({ night: true }); who('kai', { x: 460, y: 900, s: 1.3, pose: sit, expr: 'sad' }); laptop(1240, 900, 0.75, () => { card(0, 0, 640, 400, '#22252e', 0); card(260, 130, 40, 140, '#ffffff', 6); card(340, 130, 40, 140, '#ffffff', 6); }); }) },
  '4e': { sfx: [['send', 0.3, 0.5], ['send', 1.4, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => { bg(...BG.dark); phone(960, 560, 1.25, 1, () => { card(0, 0, 400, 720, '#f1f3f5', 0); const off = -((f.t * 160) % 300); for (let i = 0; i < 4; i++) { const y = 20 + off + i * 300; card(20, y, 360, 280, '#ffffff', 18); card(36, y + 16, 328, 180, '#ffe3e3', 10); who(withSpec('dex', { acc: [], top: { type: 'tee', color: '#212529', sleeves: 'short' } }), { x: 200, y: y + 190, s: 0.42, pose: flex, still: true, expr: 'smug' }); T(['NO EXCUSES', 'SHRED IN 30', 'NO PAIN NO GAIN', 'NO EXCUSES'][i], 200, y + 240, 30, RED); } }); }) },
  '4f': { draw: (f) => drift(f, 1.0, 1.12, () => { bg('#cdb38f', '#7a6040'); lying('kai', 1340, 600, 1.7, 'neutral', { look: 0 }); }) },
  '4g': { sfx: [['riser', 1.4, 0.5]], draw: (f) => drift(f, 1.0, 1.15, () => { bg('#2a3050', '#0a0c16'); close('kai', 960, f.k > 0.55 ? 'hopeful' : 'tired', { s: 3.0, hy: 520 }); tint(GREEN, f.k > 0.55 ? 0.18 * (1 - prog(f.t, f.d * 0.55, f.d * 0.8)) : 0); }) },
};

// camera flash for the group photo
function flashK(f) { tint('#ffffff', f.t > 1.1 ? 0.5 * (1 - prog(f.t, 1.1, 1.5)) : 0); }
