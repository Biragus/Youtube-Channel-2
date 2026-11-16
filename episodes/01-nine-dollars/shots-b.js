// Episode 01 drawings, chapters 7 to 11. Same conventions as shots-a.js.
const K = require('../../engine/kit');
const { W, H, GREEN, INK, RED, GOLD, lerp, prog, ease, easeOut, pop, rnd, money, bg, zoom, drift, at, alpha, tint, shake, grey,
  T, E, card, line, circle, cap, tag, counter, bubble, thought, who, head, withSpec, P, phone, laptop, sheet, van, box, door, windowP, table, floor, star, tick, button, finger, floaters, S } = K;
const { cityMap, notebook, close, laughs } = require('./shots-a')._shared;

// Kai at his desk with a laptop; screen(f) paints the 640x400 laptop screen
function desk(f, expr, screen, o = {}) {
  bg(o.inner ?? '#2a3150', o.outer ?? '#0d101c'); who(o.name ?? 'kai', { x: 500, y: 1180, s: 1.95, pose: o.pose ?? P.type, expr });
  laptop(1230, 740, 1.15, screen); card(0, 790, W, 300, '#3b2a1a', 0);
}
const salesPage = (ugly) => { card(0, 0, 640, 400, ugly ? '#fffbe0' : '#ffffff', 0); card(0, 0, 640, 60, ugly ? '#c2255c' : '#1e8449', 0); T("THE DRIVER'S LEDGER", 320, 32, 30, '#ffffff'); E('🚐', 130, 190, 130, ugly ? Math.PI : 0); card(280, 110, 300, 26, '#c9cfd6', 6); card(280, 156, 240, 26, '#c9cfd6', 6); card(280, 202, 280, 26, '#c9cfd6', 6); card(280, 280, 220, 70, ugly ? '#f08c00' : '#2f9e44', 14); T('BUY  $9', 390, 316, 34, '#ffffff'); };
const salesCounter = (v, k = 1, o = {}) => counter('SALES', String(v), o.x ?? 1500, o.y ?? 260, v > 0 ? GREEN : '#9aa3b5', k, { size: o.size ?? 150 });
const message = (from, emoji, text, f, color = '#1c7ed6') => { bg('#1b2033', '#07080d'); phone(960, 560, 1.25, 1, () => { card(0, 0, 400, 720, '#eef2f7', 0); card(0, 0, 400, 90, color, 0); T(from, 200, 50, 36, '#ffffff'); const k = pop(f.t, 0.35); at(40, 200, k, () => { card(0, 0, 320, text.length > 24 ? 230 : 170, '#ffffff', 22, '#c9cfd6', 3); const words = text.split('\n'); words.forEach((w, i) => T(w, 22, 44 + i * 44, 30, INK, { align: 'left', weight: 700 })); if (emoji) T(emoji, 22, 60 + words.length * 44, 30, INK, { align: 'left' }); }); }); };

module.exports = {
  // ===== 7. Trying ==========================================================
  '7a': { sfx: [['typing', 0.1, 1.2]], draw: (f) => drift(f, 1.0, 1.06, () => {
    const day = Math.min(6, 1 + Math.floor(f.k * 6)); const night = Math.floor(f.k * 12) % 2 === 0;
    desk(f, 'determined', () => { sheet(20, 20, 600, 360, 8, 5, { seed: day }); }, { inner: night ? '#2a3150' : '#7a8fb8', outer: night ? '#0d101c' : '#3a4a70' });
    windowP(1620, 60, 240, 240, night ? '#1b2a57' : '#bfe3f5'); if (night) circle(1800, 120, 22, '#f6f1c9'); else circle(1800, 120, 28, '#ffd43b');
    tag(`NIGHT ${day}`, 1, '#ffd43b');
  }) },
  '7b': { sfx: [['door', 0.6, 0.5], ['door', 1.4, 0.5], ['error', 3.6, 0.4]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#3b4252', '#12141c'); at(960, 560, 2.1, () => { K.ctx().save(); K.ctx().translate(-320, -200); const k = prog(f.t, 0.2, f.d * 0.6); K.ctx().beginPath(); K.ctx().rect(0, 0, 640, 400 * easeOut(k)); K.ctx().clip(); salesPage(true); K.ctx().restore(); }, 0.02);
    cap('UGLY. BUT REAL.', pop(f.t, f.d * 0.78), { size: 84, y: 1010, color: '#ffd43b' });
  }) },
  '7c': { sfx: [['heartbeat', 0.2, 1.3], ['slam', 2.3, 0.7]], draw: (f) => { const press = prog(f.t, f.d * 0.68, f.d * 0.74); shake(press > 0 && f.t < f.d * 0.9 ? 8 : 0, () => drift(f, 1.0, 1.15, () => {
    bg('#1f3a2a', '#0a140e'); button('PUBLISH', 960, 500, 760, press > 0 ? '#1e7a33' : '#2fb344', 2, press);
    finger(lerp(1500, 1080, ease(prog(f.t, 0.2, f.d * 0.66))), lerp(900, 580, ease(prog(f.t, 0.2, f.d * 0.66))) + (press > 0 ? 0 : Math.sin(f.t * 20) * 5), 2.2);
  })); tint('#ffffff', press > 0 ? 0.5 * (1 - prog(f.t, f.d * 0.74, f.d * 0.9)) : 0); } },
  '7d': { quietCut: true, sfx: [['tick', 0.4, 2]], draw: (f) => drift(f, 1.0, 1.05, () => { desk(f, 'hopeful', () => salesPage(true)); salesCounter(0, pop(f.t, 0.2)); }) },
  '7e': { sfx: [['paper', 0.1], ['error', 0.9, 0.4], ['paper', 2.0], ['error', 2.9, 0.4]], draw: (f) => drift(f, 1.0, 1.05, () => {
    const second = f.k > 0.5; desk(f, second ? 'sad' : 'neutral', () => salesPage(true), { pose: second ? 'slump' : P.type });
    tag(second ? 'DAY 5' : 'DAY 1', pop(f.t, second ? f.d * 0.5 : 0.05), '#ffd43b'); salesCounter(0); cap('NOTHING.', pop(f.t, second ? f.d * 0.74 : f.d * 0.22), { size: 110, color: '#9aa3b5', y: 990 });
  }) },
  '7f': { sfx: [['notif', 0.9], ['scratch', 2.0, 0.6]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#1d2440', '#0a0d1a'); tag('DAY 12', 1, '#ffd43b'); card(260, 200, 1400, 640, '#0f1424', 30, '#4c6ef5', 8); T('ANALYTICS', 960, 270, 44, '#4c6ef5', { spacing: 10, mono: true });
    line([[340, 720], [1580, 720]], '#2b3760', 6); line([[340, 720], [1300, 720], [1380, 620], [1460, 720], [1580, 720]], '#4c6ef5', 8);
    counter('VISITORS', '1', 620, 480, GREEN, pop(f.t, f.d * 0.28), { size: 160 });
    at(1300, 470, pop(f.t, f.d * 0.62), () => { head('mom', 0, 0, 1.5, 'smile'); T('hi honey!', 0, 150, 50, '#ffffff'); }, Math.sin(f.t * 6) * 0.08);
  }) },
  '7g': { sfx: [['notif', 0.3], ['laugh', 1.6, 2]], draw: (f) => message('DEX', '😂😂😂', '[screenshot of\nyour page]', f, '#2f9e44') },
  '7h': { sfx: [['tick', 0.2, 3], ['error', 2.4, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#2a1820', '#0c0609'); const p = 0.6 + 0.4 * Math.abs(Math.sin(f.t * 5));
    alpha(p, () => counter('RENT DUE IN', '18 DAYS', 500, 520, '#ffa94d', pop(f.t, 0.1), { size: 120 })); counter('BALANCE', '$11.00', 1420, 520, RED, pop(f.t, f.d * 0.5), { size: 120, rot: -0.02 });
  }) },
  '7i': { sfx: [['heartbeat', 0.3, 1.2]], draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#3b1f1f', '#0c0609');
    for (let i = 0; i < 10; i++) at((i % 2 ? 1280 : 180) + rnd(i) * 420, 160 + Math.floor(i / 2) * 190 + rnd(i + 4) * 60, pop(f.t, 0.2 + i * 0.26), () => E('🛑', 0, 0, 120 + rnd(i) * 70), (rnd(i + 2) - 0.5) * 0.5);
    who('kai', { x: 960, y: 1080, s: 1.7, pose: 'slump', expr: 'sad' });
  }) },
  '7j': { quietCut: true, sfx: [['heartbeat', 0.1, 1.4]], draw: (f) => drift(f, 1.0, 1.2, () => {
    bg('#3b1f1f', '#0c0609'); button('DELETE PRODUCT', 960, 500, 1000, '#e03131', 1.6, 0); finger(1090, 600 + Math.sin(f.t * 16) * 10, 2.2);
  }) },
  '7k': { sfx: [['whoosh', 0.9], ['riser', 3.2, 0.9], ['boom', 3.7, 0.7]], draw: (f) => drift(f, 1.05, 1.0, () => {
    const back = ease(prog(f.t, 0.6, 1.3)); bg(back > 0.5 ? '#22314f' : '#3b1f1f', '#0a0d1a');
    alpha(1 - back, () => { button('DELETE PRODUCT', 960, 500, 1000, '#e03131', 1.6, 0); }); finger(1090 + back * 900, 600 + back * 500, 2.2);
    const asked = prog(f.t, f.d * 0.58, f.d * 0.66); alpha(back * (1 - asked * 0.75), () => close('kai', 960, 'determined', { s: 2.6, hy: 520 }));
    const s = 'WHY?'; const n = Math.ceil(prog(f.t, f.d * 0.62, f.d * 0.8) * s.length); if (n > 0) T(s.slice(0, n), W / 2, 500, 460, '#ffffff', { glow: GREEN, blur: 60 });
    cap('IS NOBODY BUYING', pop(f.t, f.d * 0.84), { size: 80, y: 880, color: GREEN });
  }) },

  // ===== 8. Trying harder ===================================================
  '8a': { sfx: [['door', 0.3, 0.8]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#8f897d', '#4d483f'); floor(940, '#3f3a33'); door(420, 940, 1.5, '#6b4a2f'); card(700, 300, 1220, 640, '#bfe3f5', 0); floor(940, '#69757f');
    const x = lerp(520, 1500, f.k); who('kai', { x, y: 950, s: 1.4, pose: P.walk(f.t * 1.8), expr: 'determined' }); E('💻', x + 110, 700, 110);
  }) },
  '8b': { sfx: [['crowd', 0.1, 1.2], ['engine', 2.6, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.depot({ dawn: true }); van(1560, 880, 0.8, { color: '#d8d2c2' });
    const n = Math.min(3, Math.floor(f.k * 4)); who('kai', { x: 560, y: 940, s: 1.35, pose: P.give, expr: 'smile' });
    who(`driver${n + 1}`, { x: 980, y: 940, s: 1.35, flip: true, expr: 'neutral', pose: 'crossed' }); for (let i = 0; i < 3; i++) who(`driver${i + 5}`, { x: 1220 + i * 130, y: 900, s: 0.95, flip: true });
    floaters(f.t, 9, (i, life) => circle(660 + life * 60, 470 - life * 70, 16 + life * 26, 'rgba(255,255,255,0.6)'), { every: 0.55, life: 0.9 });
    tag('6:10 AM  ·  -2°C', 1, '#a5d8ff');
  }) },
  '8c': { sfx: [['notif', 2.4], ['notif', 4.0], ['notif', 5.6]], draw: (f) => drift(f, 1.03, 1.0, () => {
    bg('#8d7f9c', '#3a3350'); [1, 2, 4].forEach((d, i) => who(`driver${d}`, { x: 420 + i * 540, y: 1150, s: 1.6, expr: 'neutral', pose: i === 1 ? 'shrug' : 'crossed' }));
    [['Too complicated.', 0.34], ['I need it on\nmy phone.', 0.56], ['Two taps. Max.', 0.8]].forEach(([s, a], i) => bubble(s, 420 + i * 540, 400, pop(f.t, f.d * a), { size: 46 }));
  }) },
  '8d': { sfx: [['pen', 0.6, 1.2]], draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#2a3150', '#0d101c'); close('kai', 520, f.k < 0.35 ? 'sad' : 'determined', { s: 2.2, hy: 470 });
    at(1320, 540, pop(f.t, f.d * 0.3), () => { card(-360, -300, 720, 600, '#fff8dc', 12, '#b7950b', 6); T('FEEDBACK', 0, -170, 96, INK); T('=', 0, -40, 110, '#8a7a5c'); T('GOLD', 0, 110, 170, '#e8a100', { glow: '#ffd43b' }); line([[-240, 210], [240, 210]], RED, 12); }, 0.04);
  }) },
  '8e': { sfx: [['glass', 0.5], ['poof', 2.0]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#1f3a2a', '#0a140e'); const br = prog(f.t, 0.4, f.d * 0.5); const re = ease(prog(f.t, f.d * 0.5, f.d * 0.9));
    if (br < 1) { if (br <= 0) sheet(400, 210, 1120, 660, 9, 5, { seed: 3 }); else for (let i = 0; i < 45; i++) { const cx = 400 + (i % 9) * 124 + 62; const cy = 210 + Math.floor(i / 9) * 132 + 66; at(cx + (cx - 960) * br * 1.6, cy + (cy - 540) * br * 1.6 + br * br * 500, 1, () => card(-58, -62, 116, 124, '#ffffff', 6, '#1e8449', 4), br * (rnd(i) - 0.5) * 6); } }
    if (re > 0) phone(960, 560, 1.2, re, () => { card(0, 0, 400, 720, '#f2fbf5', 0); card(0, 0, 400, 100, '#1e8449', 0); T('LEDGER', 200, 54, 40, '#ffffff', { spacing: 6 }); card(40, 190, 320, 190, '#2fb344', 30); T('+ TRIP', 200, 288, 56, '#ffffff'); card(40, 420, 320, 190, '#1c7ed6', 30); T('+ FUEL', 200, 518, 56, '#ffffff'); });
    cap('TWO TAPS.', pop(f.t, f.d * 0.86), { x: 1500, y: 560, size: 100, color: GREEN });
  }) },
  '8f': { sfx: [['chime', 1.8]], draw: (f) => drift(f, 1.0, 1.07, () => {
    S.depot({ dawn: true }); who('kai', { x: 620, y: 950, s: 1.45, expr: 'tired' }); const x = lerp(2100, 1240, easeOut(prog(f.t, 0.5, 1.5)));
    who('sam', { x, y: 950, s: 1.45, pose: P.give, flip: true, expr: 'happy' }); E('☕', x - 243, 585, 100); // one coffee, held out in his hand
    at(x, 250, pop(f.t, f.d * 0.7), () => { card(-150, -60, 300, 120, '#1c7ed6', 30); T('SAM', 0, 4, 80, '#ffffff', { spacing: 8 }); });
  }) },
  '8g': { sfx: [['error', 0.8, 0.5], ['error', 1.3, 0.5], ['error', 1.8, 0.5], ['error', 2.3, 0.5]], draw: (f) => drift(f, 1.0, 1.05, () => {
    S.street(); van(620, 900, 1.2, { color: '#d0e8ff' }); head('sam', 830, 610, 0.9, 'worried');
    const n = Math.floor(prog(f.t, 0.5, f.d * 0.9) * 11); for (let i = 0; i < n; i++) tick(1180 + (i % 4) * 150, 300 + Math.floor(i / 4) * 150, 1.6 * pop(f.t, 0.5 + i * (f.d * 0.9 - 0.5) / 11), false);
    counter('BUGS', String(n), 1400, 840, RED, 1, { size: 110 });
  }) },
  '8h': { sfx: [['chime', 0.3, 0.6], ['chime', 0.9, 0.7], ['chime', 1.4, 0.8]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1f3a2a', '#0a140e'); const n = Math.floor(prog(f.t, 0.15, f.d * 0.85) * 11.99);
    for (let i = 0; i < 11; i++) tick(420 + (i % 6) * 220, 380 + Math.floor(i / 6) * 240, 2.4, i < n);
    cap(`FIXED  ${Math.min(11, n)} / 11`, 1, { y: 900, size: 100, color: GREEN });
  }) },
  '8i': { sfx: [['notif', 0.4], ['error', 3.3, 0.4]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#1b2033', '#07080d'); phone(700, 560, 1.25, 1, () => { card(0, 0, 400, 720, '#12141c', 0); card(60, 120, 280, 480, '#f2fbf5', 20); card(60, 120, 280, 70, '#1e8449', 20); card(90, 240, 220, 120, '#2fb344', 20); card(90, 400, 220, 120, '#1c7ed6', 20); circle(48, 60, 14, RED); T('REC  0:30', 150, 62, 30, '#ffffff', { mono: true }); });
    counter('VIEWS', '40', 1380, 520, '#9aa3b5', pop(f.t, f.d * 0.68), { size: 190, s: 1.2 });
  }) },
  '8j': { sfx: [['send', 0.2, 0.3], ['send', 1.1, 0.3], ['send', 2.0, 0.3], ['send', 2.9, 0.3], ['send', 3.8, 0.3]], draw: (f) => drift(f, 1.03, 1.0, () => {
    bg('#1b2033', '#07080d'); const n = Math.floor(f.k * 21) + 1;
    for (let i = 0; i < Math.min(21, n); i++) at(230 + (i % 7) * 245, 260 + Math.floor(i / 7) * 250, pop(f.t, (i / 21) * f.d), () => { card(-105, -100, 210, 200, ['#1c7ed6', '#e8590c', '#2f9e44', '#9c36b5', '#e03131'][i % 5], 16); E('▶️', 0, -14, 70); T(`DAY ${26 + i}`, 0, 66, 28, '#ffffff'); });
    tag('ONE VIDEO. EVERY DAY.', 1, GREEN);
  }) },
  '8k': { draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1b2033', '#07080d'); line([[260, 800], [1660, 800]], '#2b3760', 6);
    [40, 60, 31, 44, 38].forEach((v, i) => { const k = ease(prog(f.t, 0.15 + i * (f.d * 0.14), 0.5 + i * (f.d * 0.14))); card(340 + i * 270, 800 - v * 5 * k, 170, v * 5 * k, '#4c6ef5', 10); if (k > 0.9) T(String(v), 425 + i * 270, 760 - v * 5, 70, '#ffffff', { mono: true }); });
    T('VIEWS PER VIDEO', W / 2, 180, 60, '#9aa3b5', { spacing: 10, weight: 700 }); cap('KEEP GOING ANYWAY', pop(f.t, f.d * 0.78), { size: 84, y: 950, color: GREEN });
  }) },
  '8l': { sfx: [['cash', 3.6, 0.7], ['door', 0.3, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#5c4a3a', '#1f1710'); tag('DAY 46', 1, '#ffd43b'); card(1100, 150, 700, 200, '#2a1f14', 16, GOLD, 8); T('PAWN SHOP', 1450, 250, 90, GOLD);
    who('driver7', { x: 1450, y: 1000, s: 1.4, flip: true, expr: 'neutral' }); card(820, 760, 1100, 340, '#3b2a1a', 0); card(820, 740, 1100, 40, '#6b4a2f', 0);
    const k = ease(prog(f.t, f.d * 0.35, f.d * 0.7)); who('kai', { x: 480, y: 1000, s: 1.4, pose: P.give, expr: 'sad' }); E('🎸', lerp(700, 1100, k), lerp(600, 640, k), 300, -0.5);
    counter('RENT', k >= 1 ? 'PAID' : 'DUE', 480, 250, k >= 1 ? '#51cf66' : RED, 1, { size: 100 });
  }) },
  '8m': { quietCut: true, sfx: [['cash', 2.4, 1.6]], draw: (f) => drift(f, 1.0, 1.12, () => {
    S.room({ night: true }); tag('DAY 47', 1, '#ffd43b'); const on = f.t > 2.4;
    if (on) { const c = K.ctx(); const g = c.createRadialGradient(1250, 830, 0, 1250, 830, 520); g.addColorStop(0, 'rgba(57,255,20,0.45)'); g.addColorStop(1, 'rgba(57,255,20,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
    at(1250, 840, 1, () => { card(-70, -20, 140, 40, on ? '#d8ffd0' : '#1a1f33', 10, '#111114', 6); });
    head(withSpec('kai'), 700, 690, 1.0, on ? 'shock' : 'tired');
  }, 1250, 800) },
  '8n': { quietCut: true, sfx: [['riser', 0.1], ['boom', 0.5, 0.7], ['chime', 1.2]], draw: (f) => drift(f, 1.0, 1.12, () => {
    bg('#123d1c', '#030a05'); phone(960, 560, 1.3, 1, () => { card(0, 0, 400, 720, '#0b140d', 0); T('2:14 AM', 200, 110, 60, '#9aa3b5', { mono: true }); at(200, 380, pop(f.t, 0.3), () => { card(-170, -150, 340, 300, '#ffffff', 30); E('💰', 0, -70, 110); T('NEW SALE', 0, 30, 44, INK); T('$9.00', 0, 100, 70, '#2f9e44', { mono: true }); }); });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + f.t * 0.4; star(960 + Math.cos(a) * (560 + Math.sin(f.t * 3 + i) * 30), 560 + Math.sin(a) * 420, 20, GREEN); }
  }) },
  '8o': { draw: (f) => drift(f, 1.0, 1.1, () => {
    S.room({ night: true }); tint(GREEN, 0.06); who('kai', { x: 800, y: 1010, s: 1.9, pose: 'phone', expr: 'hopeful', prop: 'phone' });
    at(1400, 420, pop(f.t, 0.15) * (1 + Math.sin(f.t * 3) * 0.03), () => T('$9', 0, 0, 380, GREEN, { glow: GREEN, blur: 80 }));
    cap('WHILE YOU WERE ASLEEP', pop(f.t, f.d * 0.62), { size: 70, y: 990 });
  }) },
  '8p': { sfx: [['cash', 0.3, 0.8], ['cash', 0.7, 0.8], ['cash', 1.1, 0.8], ['cash', 1.5, 0.8]], draw: (f) => drift(f, 1.0, 1.05, () => { bg('#123d1c', '#030a05'); const n = 1 + Math.floor(prog(f.t, 0.2, f.d * 0.85) * 6.99); salesCounter(n, 1 + 0.08 * Math.sin(f.t * 20), { x: 960, y: 500, size: 260 }); for (let i = 0; i < n; i++) E('💰', 420 + i * 180, 860, 110); }) },
  '8q': { sfx: [['notif', 0.5], ['crowd', 2.2, 1.4], ['chime', 5.4]], draw: (f) => drift(f, 1.0, 1.07, () => {
    bg('#22314f', '#0a0d1a'); at(960, 540, pop(f.t, 0.2), () => { card(-640, -360, 1280, 720, '#ffffff', 40); head(K.CAST.friend ? withSpec('sam', { hair: { type: 'short', color: '#7a4a2a' }, acc: ['cap'], accent: '#e8590c' }) : 'sam', -480, -220, 1.1, 'happy'); T('BigRigBen', -370, -250, 54, INK, { align: 'left' }); T('50K followers', -370, -186, 36, '#6b7280', { align: 'left', weight: 700 });
      card(-560, -110, 500, 280, '#2fb344', 24); E('▶️', -310, 30, 120); alpha(prog(f.t, f.d * 0.6, f.d * 0.7), () => { T('"This saved', 280, -40, 78, INK); T('my month."', 280, 60, 78, INK); });
      E('❤️', -500, 270, 70); T(Math.floor(lerp(12, 48211, ease(prog(f.t, f.d * 0.3, f.d)))).toLocaleString('en-US'), -440, 272, 56, '#e03131', { align: 'left', mono: true }); });
  }) },
  '8r': { sfx: [['counter', 0.1, 1.4], ['boom', 1.6, 0.7]], draw: (f) => { const v = f.k < 0.3 ? 7 : (f.k < 0.6 ? 60 : 412); shake(f.k > 0.6 ? 10 : 3, () => { bg('#123d1c', '#030a05'); salesCounter(v, 1 + 0.1 * Math.abs(Math.sin(f.t * 14)), { x: 960, y: 520, size: 360 }); floaters(f.t, 14, (i, life) => E('💰', 200 + rnd(i) * 1500, 1000 - life * 700, 90), { every: 0.14, life: 0.9 }); }); } },
  '8s': { sfx: [['error', 2.3, 0.9], ['error', 2.9, 0.9], ['buzz', 3.6]], draw: (f) => drift(f, 1.0, 1.06, () => {
    const bad = prog(f.t, f.d * 0.42, f.d * 0.8); bg(bad > 0 ? '#4a1010' : '#22314f', '#0c0609');
    for (let i = 0; i < 12; i++) { const red = i / 12 < bad; card(180 + (i % 4) * 400, 150 + Math.floor(i / 4) * 250, 360, 210, red ? '#e03131' : '#f2fbf5', 16, '#111114', 6); if (red) T('NO DATA', 360 + (i % 4) * 400, 255 + Math.floor(i / 4) * 250, 54, '#ffffff'); else sheet(200 + (i % 4) * 400, 170 + Math.floor(i / 4) * 250, 320, 170, 5, 3, { seed: i }); }
    counter('ANGRY EMAILS', String(Math.floor(200 * ease(bad))), 960, 920, RED, pop(f.t, f.d * 0.45), { size: 100 });
  }) },
  '8t': { sfx: [['typing', 1.2, 1.2], ['send', 3.0, 0.33], ['send', 3.6, 0.33], ['send', 4.2, 0.33], ['chime', 6.0]], draw: (f) => drift(f, 1.0, 1.05, () => {
    desk(f, 'determined', () => { card(0, 0, 640, 400, '#eef2f7', 0); T("I'm sorry. Here is your refund.", 320, 120, 34, INK, { weight: 700 }); T('It is fixed. Kai', 320, 190, 34, INK, { weight: 700 }); card(220, 280, 200, 70, '#1c7ed6', 14); T('SEND', 320, 316, 34, '#ffffff'); });
    const back = f.k > 0.7; floaters(f.t, 22, (i, life) => { const x = lerp(1300, 1960, life); const y = 300 + rnd(i) * 300 - life * 120; if (back) tick(W - (x - 1300) - 100, y, 1.2); else E('✉️', x, y, 90); }, { every: 0.22, from: f.d * 0.3, life: 0.9 });
    tag(back ? '200 / 200 REFUNDED' : 'ONE NIGHT', 1, back ? GREEN : '#ffd43b');
  }) },
  '8u': { sfx: [['chime', 0.4, 0.6], ['chime', 1.8, 0.6], ['chime', 3.2, 0.6]], draw: (f) => drift(f, 1.03, 1.0, () => {
    bg('#22314f', '#0a0d1a'); [['He actually answered.', 0.08], ['Refund in 10 minutes.', 0.36], ['Buying it again.', 0.62]].forEach(([s, a], i) => at(960 + (i - 1) * 60, 270 + i * 270, pop(f.t, f.d * a), () => { card(-560, -105, 1120, 210, '#ffffff', 30); for (let j = 0; j < 5; j++) star(-470 + j * 70, -40, 30); T(s, -500, 44, 56, INK, { align: 'left' }); head(`driver${i + 2}`.length ? withSpec('dex', { hair: { type: 'short', color: '#444' }, acc: [], top: { type: 'tee', color: '#888' } }) : 'dex', 450, 0, 1.0, 'happy'); }, (i - 1) * -0.02));
  }) },
  '8v': { sfx: [['notif', 0.3], ['notif', 1.4], ['notif', 2.3], ['counter', 3.4]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1f3a2a', '#0a140e'); [['🚐', 'LEDGER', '#1e8449', 0.05], ['🧾', 'TAX PACK', '#1c7ed6', 0.26], ['🗺️', 'ROUTE PLANNER', '#e8590c', 0.44]].forEach(([e, s, col, a], i) => at(400 + i * 560, 430, pop(f.t, f.d * a), () => { card(-240, -250, 480, 500, col, 40); E(e, 0, -60, 200); T(s, 0, 150, s.length > 9 ? 46 : 60, '#ffffff', { spacing: 3 }); }, (i - 1) * 0.04));
    counter('THIS MONTH', money(Math.floor(lerp(900, 9400, ease(prog(f.t, f.d * 0.6, f.d * 0.95))))), 960, 880, GREEN, pop(f.t, f.d * 0.58), { size: 110 });
  }) },
  '8w': { sfx: [['riser', 3.4, 0.8]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#123d1c', '#030a05'); line([[260, 860], [1700, 860]], '#2b5a37', 6); line([[260, 860], [260, 180]], '#2b5a37', 6);
    const k = ease(prog(f.t, 0.3, f.d * 0.9)); const pts = []; for (let i = 0; i <= 40 * k; i++) { const x = i / 40; pts.push([260 + x * 1440, 860 - (x ** 2.4) * 640 - Math.sin(i * 1.7) * 14]); } if (pts.length > 1) line(pts, GREEN, 14);
    if (pts.length) { const p = pts[pts.length - 1]; circle(p[0], p[1], 22, '#ffffff'); }
    T(f.k < 0.5 ? 'HOBBY' : 'BUSINESS', 700, 300, 150, f.k < 0.5 ? '#6b8f76' : '#ffffff', { glow: f.k < 0.5 ? undefined : GREEN });
  }) },
  '8x': { sfx: [['boom', 2.4, 0.7]], draw: (f) => drift(f, 1.0, 1.06, () => {
    const k = ease(prog(f.t, f.d * 0.42, f.d * 0.55)); card(0, 0, 960, H, '#3b4252', 0); card(960, 0, 960, H, '#123d1c', 0);
    grey(() => { who('kai', { x: 480, y: 960, s: 1.5, pose: P.hold, expr: 'sad' }); box(480, 960 - 1.5 * 190, 1.4); }); T('GOT FIRED', 480, 150, 80, '#9aa3b5');
    alpha(k, () => { who('kai', { x: 1440, y: 960, s: 1.5, pose: 'power', expr: 'determined' }); T('BUILDS THINGS', 1440, 150, 80, GREEN, { glow: GREEN }); });
    alpha(1 - k, () => card(960, 0, 960, H, '#0a140e', 0)); line([[960, 0], [960, H]], '#ffffff', 8);
  }) },

  // ===== 9. New life ========================================================
  '9a': { quietCut: true, sfx: [['chime', 0.5, 0.7]], draw: (f) => drift(f, 1.0, 1.07, () => {
    bg('#ffe8c2', '#f0b77a', 1300, 300); windowP(1180, 140, 520, 560, '#bfe3f5'); circle(1560, 280, 70, '#fff3b0'); card(240, 720, 900, 180, '#e8e4da', 40); card(240, 650, 300, 130, '#ffffff', 36);
    head(withSpec('kai'), 430, 600, 1.5, 'smile'); floor(900, '#c49a6c');
    alpha(1 - ease(prog(f.t, f.d * 0.5, f.d * 0.85)), () => counter('BALANCE', '?', 1560, 880, '#9aa3b5', 1, { size: 100 }));
  }) },
  '9b': { sfx: [['chime', 0.6], ['counter', 1.4, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => { cityMap(f, true); tag('18 MONTHS LATER', 1, GREEN); }) },
  '9c': { sfx: [['poof', 0.5, 0.7]], draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#fff1d6', '#f0b77a'); const k = prog(f.t, 0.45, 0.95); who(k < 0.5 ? 'kai' : 'kai2', { x: 960, y: 1010, s: 1.9, pose: k < 0.5 ? 'stand' : 'power', expr: k < 0.5 ? 'neutral' : 'smug' });
    if (k > 0 && k < 1) for (let i = 0; i < 16; i++) { const a = i * 0.8; alpha(1 - Math.abs(k - 0.5) * 2 + 0.3, () => circle(960 + Math.cos(a) * (120 + k * 260), 620 + Math.sin(a) * (200 + k * 240), 110 - k * 40, '#ffffff')); }
    if (k >= 1) for (let i = 0; i < 10; i++) star(960 + Math.cos(i * 0.63 + f.t) * 520, 560 + Math.sin(i * 0.63 + f.t) * 400, 18, GOLD);
  }) },
  '9d': { draw: (f) => drift(f, 1.08, 1.0, () => { S.apartment(); who('kai2', { x: 960, y: 950, s: 1.7, pose: P.wide, expr: 'happy' }); }) },
  '9e': { quietCut: true, draw: (f) => drift(f, 1.0, 1.05, () => { S.apartment(); who('kai2', { x: 960, y: 940, s: 0.85, expr: 'smile' }); E('🪴', 300, 830, 190); E('🛋️', 1560, 820, 260); }) },
  '9f': { sfx: [['door', 0.2, 0.6], ['slam', 1.5, 0.25]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.office(); card(1340, 250, 480, 150, '#1f2a44', 16); T('SAM', 1580, 296, 60, '#ffffff', { spacing: 8 }); T('HEAD OF PRODUCT', 1580, 356, 34, GREEN, { weight: 800 });
    const hit = ease(prog(f.t, 0.8, 1.4)); who('kai2', { x: 720, y: 960, s: 1.5, pose: { lean: 0, tilt: 0, armL: [8, 4], armR: [lerp(8, 140, hit), 10], legL: [6, 0], legR: [6, 0] }, expr: 'happy' });
    who('sam', { x: 1090, y: 960, s: 1.5, pose: { lean: 0, tilt: 0, armL: [8, 4], armR: [lerp(8, 140, hit), 10], legL: [6, 0], legR: [6, 0] }, flip: true, expr: 'happy' });
    if (hit >= 1) star(905, 430, 60 * (1 - prog(f.t, 1.4, 2.0)) + 10, '#ffffff');
  }) },
  '9g': { sfx: [['chime', 2.0]], draw: (f) => drift(f, 1.0, 1.07, () => {
    bg('#bfe3f5', '#8fc7e8', 960, 300); floor(880, '#7fb069'); K.house(620, 880, 1.45);
    at(620, 250, pop(f.t, f.d * 0.55), () => { card(-200, -90, 400, 180, '#2fb344', 20, '#ffffff', 10); T('PAID OFF', 0, 4, 76, '#ffffff'); }, -0.08);
    who('mom', { x: 1280, y: 980, s: 1.3, expr: 'shock' }); who('kai2', { x: 1560, y: 980, s: 1.3, pose: P.give, flip: true, expr: 'smile' });
  }) },
  '9h': { quietCut: true, draw: (f) => drift(f, 1.0, 1.15, () => { bg('#ffe8c2', '#f0b77a'); close('mom', 960, 'happycry', { s: 2.6, hy: 470 }); E('🔑', 960, 900 + Math.sin(f.t * 3) * 8, 220); }) },

  // ===== 10. The return =====================================================
  '10a': { sfx: [['door', 0.5, 0.6]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.office(); [['dex', 0], ['ray', 1], ['maya', 2]].forEach(([n, i]) => { const x = lerp(2100 + i * 240, 1000 + i * 260, easeOut(prog(f.t, 0.2 + i * 0.5, 1.4 + i * 0.5))); who(n, { x, y: 960, s: 1.25, pose: P.walk(f.t * 1.6 + i), flip: true, expr: 'smile' }); });
    who('kai2', { x: 420, y: 980, s: 1.5, pose: 'crossed', expr: 'neutral' });
  }) },
  '10b': { sfx: [['paper', 0.2]], draw: (f) => drift(f, 1.0, 1.08, () => { bg('#2f9e44', '#14532d'); close('dex', 1150, 'worried', { s: 2.2, hy: 500, flip: true }); at(560, 600, pop(f.t, 0.15), () => { card(-230, -300, 460, 600, '#ffffff', 12); T('C.V.', 0, -200, 90, INK); for (let i = 0; i < 6; i++) card(-170, -90 + i * 56, 340 - (i % 3) * 60, 22, '#c9cfd6', 6); }, -0.1 + Math.sin(f.t * 18) * 0.015); }) },
  '10c': { sfx: [['door', 1.2, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.dinner(); who('kai2', { x: 760, y: 950, s: 1.35, expr: 'neutral' }); who('ray', { x: 1300, y: 950, s: 1.35, pose: P.give, flip: true, expr: 'fake' }); K.chair(1040, 950, 1.25);
    bubble('After you, sir.', 1300, 290, pop(f.t, f.d * 0.55), { size: 60, side: -1 }); E('💵', 1500, 700, 100);
  }) },
  '10d': { sfx: [['notif', 0.3]], draw: (f) => message('MAYA', '', 'I always knew\nyou would\nmake it.', f, '#d6336c') },
  '10e': { sfx: [['door', 2.4, 0.8]], draw: (f) => grey(() => drift(f, 1.0, 1.06, () => {
    S.depot(); at(960, 250, pop(f.t, f.d * 0.42), () => { card(-360, -120, 720, 240, '#e03131', 16, '#ffffff', 12); T('CLOSED', 0, 6, 150, '#ffffff', { spacing: 10 }); }, -0.06);
    who('graves', { x: 960, y: 1000, s: 1.25, pose: P.hold, expr: 'sad' }); box(960, 1000 - 1.25 * 190, 1.2);
  })) },
  '10f': { draw: (f) => drift(f, 1.0, 1.07, () => {
    S.office(); card(1260, 180, 560, 680, '#dfe9f5', 8, '#1f2a44', 14); T('KAI & CO.', 1540, 300, 76, '#1f2a44'); T('FOUNDER', 1540, 380, 40, '#6b7280', { spacing: 8, weight: 700 }); circle(1320, 540, 16, GOLD);
    who('graves', { x: 620, y: 980, s: 1.5, pose: P.hold, expr: 'worried' }); E('📁', 620, 640, 150); K.chair(300, 980, 1.25);
  }) },
  '10g': { quietCut: true, sfx: [['riser', 1.6], ['boom', 2.1, 0.9]], draw: (f) => { const seen = f.k > 0.5; shake(seen && f.k < 0.7 ? 8 : 0, () => drift(f, 1.0, 1.1, () => {
    bg('#1f2a44', '#070a14'); const dark = withSpec('kai2', { top: { type: 'blazer', color: '#0b0d14', shirt: '#0b0d14' }, pants: '#0b0d14', shoes: '#0b0d14', acc: [], eye: seen ? GREEN : '#111114', eyeGlow: seen });
    who(dark, { x: 1300, y: 1250, s: 2.4, pose: 'crossed', expr: 'determined' }); card(700, 820, 1300, 300, '#101626', 0);
    who('graves', { x: 420, y: 1130, s: 1.7, expr: seen ? 'shock' : 'neutral', pose: seen ? 'shrug' : 'stand' });
    if (seen) { const k = ease(prog(f.t, f.d * 0.55, f.d * 0.9)); at(420 + 18, 1130 - 1.7 * 376 + 20 + k * 70, 1.7, () => { const c = K.ctx(); c.strokeStyle = '#ffffff'; c.lineWidth = 4; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * 24, 0, 24, 0, Math.PI * 2); c.stroke(); } }, k * 0.3); }
  })); tint(GREEN, seen ? 0.4 * (1 - prog(f.t, f.d * 0.5, f.d * 0.62)) : 0); } },
  '10h': { quietCut: true, draw: (f) => drift(f, 1.0, 1.12, () => { bg('#1f2a44', '#070a14'); close('kai2', 960, f.k > 0.5 ? 'smile' : 'neutral', { s: 2.7, hy: 500 }); }) },
  '10i': { sfx: [['paper', 0.5, 1.4]], draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#3b2a1a', '#150e07'); card(0, 300, W, 780, '#5f3920', 0); const k = easeOut(prog(f.t, 0.4, 1.4));
    line([[2100, 1000], [lerp(2100, 1240, k), lerp(900, 640, k)]], '#1f2a44', 120); circle(lerp(2060, 1200, k), lerp(880, 620, k), 60, '#111114');
    at(lerp(1700, 900, k), lerp(760, 560, k), 1, () => { card(-330, -190, 660, 380, '#ffffff', 20, '#c9cfd6', 6); alpha(prog(f.t, f.d * 0.6, f.d * 0.72), () => T('4471', 0, -10, 190, INK, { mono: true })); }, -0.06);
  }) },
  '10j': { quietCut: true, sfx: [['boom', 1.9, 0.9]], draw: (f) => drift(f, 1.0, 1.14, () => {
    bg('#3b2a1a', '#150e07'); at(960, 520, 1.5, () => { card(-330, -190, 660, 380, '#ffffff', 20, '#c9cfd6', 6); T('4471', 0, -40, 170, INK, { mono: true }); alpha(prog(f.t, f.d * 0.38, f.d * 0.5), () => T('Nothing personal.', 0, 110, 56, RED, { weight: 800 })); }, -0.04);
  }) },

  // ===== 11. Close ==========================================================
  '11a': { draw: (f) => drift(f, 1.0, 1.07, () => { S.street({ night: true }); for (let i = 0; i < 60; i++) card(30 + rnd(i) * 1860, 300 + rnd(i + 7) * 420, 14, 20, 'rgba(255,220,130,0.8)', 2); who('kai2', { x: 960, y: 1010, s: 1.7, pose: 'stand', expr: 'neutral' }); }) },
  '11b': { sfx: [['cash', 0.4]], draw: (f) => drift(f, 1.0, 1.1, () => { bg('#123d1c', '#030a05'); at(960, 470, pop(f.t, 0.1) * (1 + Math.sin(f.t * 3) * 0.03), () => T('$9', 0, 0, 520, GREEN, { glow: GREEN, blur: 90 })); cap('PROOF THE VOICE WAS WRONG', pop(f.t, f.d * 0.5), { size: 70, y: 950 }); }) },
  '11c': { sfx: [['chime', 2.6]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#22314f', '#0a0d1a'); alpha(1 - prog(f.t, f.d * 0.25, f.d * 0.35), () => { T('A BIG IDEA', 960, 480, 150, '#6b7592'); line([[480, 480], [1440, 480]], RED, 16); });
    alpha(prog(f.t, f.d * 0.3, f.d * 0.42), () => { at(620, 540, 0.62, () => notebook(f), -0.06); T('+', 1130, 540, 160, '#ffffff'); button('PUBLISH', 1500, 540, 520, '#2fb344', pop(f.t, f.d * 0.62)); });
  }) },
  '11d': { quietCut: true, sfx: [['riser', 0.2], ['boom', 0.7, 0.7]], draw: (f) => { bg('#07080c'); zoom(1 + f.k * 0.06, () => { T('WHAT IS YOUR', W / 2, 400, 130, '#ffffff', { spacing: 8 }); at(W / 2, 620, pop(f.t, 0.7), () => T('NOTEBOOK?', 0, 0, 230, GREEN, { glow: GREEN, blur: 70 })); }); } },
  '11e': { sfx: [['notif', 0.5], ['chime', 1.2]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#22314f', '#0a0d1a'); who('kai2', { x: 620, y: 1010, s: 1.6, pose: 'wave', expr: 'happy' });
    at(1300, 260, pop(f.t, 0.3), () => { card(-380, -90, 760, 180, '#e03131', 40); E('🔔', -290, 0, 90); T('SUBSCRIBE', 50, 4, 80, '#ffffff'); });
    const x = lerp(2200, 1480, easeOut(prog(f.t, f.d * 0.35, f.d * 0.8))); who(withSpec('kai', { hair: { type: 'short', color: '#111114' }, eye: '#4dabf7', eyeGlow: true, top: { type: 'hoodie', color: '#7a6f66' } }), { x, y: 1010, s: 1.3, pose: 'slump', flip: true, expr: 'tired' });
  }) },
};
