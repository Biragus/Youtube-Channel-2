// Episode 01 drawings, chapters 2 to 6. One entry per narration line (ids match narration.js).
// Each shot is { draw(f), sfx } where f = { t: seconds into the shot, d: its length, k: 0..1 progress }.
// sfx entries are [name, seconds into the shot, volume multiplier].
const K = require('../../engine/kit');
const { W, H, GREEN, INK, RED, GOLD, lerp, prog, ease, easeOut, pop, rnd, money, bg, zoom, drift, at, alpha, tint, shake, grey,
  T, E, card, line, circle, cap, tag, counter, bubble, thought, who, head, withSpec, P, phone, laptop, sheet, van, box, door, windowP, table, floor, star, tick, button, finger, floaters, S } = K;

// head-and-shoulders framing: puts the head centre at (x, hy)
const close = (name, x, expr, o = {}) => { const s = o.s ?? 2.4; who(name, { ...o, x, y: (o.hy ?? 480) + 376 * s, s, expr }); };
const laughs = (f, n = 7) => floaters(f.t, n, (i, life) => at(260 + rnd(i) * 1400, 260 + rnd(i + 5) * 300 - life * 80, 1, () => T('HA', 0, 0, 60 + rnd(i + 2) * 50, '#ffffff', { stroke: INK }), (rnd(i + 9) - 0.5) * 0.6), { every: 0.3, from: 0.3 });
const feedCard = (emoji, label, color) => { card(0, 0, 400, 720, color, 0); E(emoji, 200, 300, 190); T(label, 200, 520, 40, '#ffffff', { weight: 800 }); };

module.exports = {
  // ===== 2. Rock bottom =====================================================
  '2a': { sfx: [['crowd', 0.1, 0.7]], draw: (f) => drift(f, 1.0, 1.07, () => {
    S.depot(); const x = lerp(480, 1180, f.k);
    who('driver3', { x: 1560, y: 880, s: 0.9, pose: 'stand' }); who('driver5', { x: 230, y: 880, s: 0.9, pose: 'crossed' });
    who('kai', { x, y: 940, s: 1.3, pose: P.walk(f.t * 1.6), expr: 'tired' });
    box(x, 940 - 1.3 * 190, 1.2); box(x + 6, 940 - 1.3 * 190 - 118, 1.1); box(x - 8, 940 - 1.3 * 190 - 228, 0.9);
  }) },
  '2b': { sfx: [['chime', 0.3, 0.5]], draw: (f) => drift(f, 1.0, 1.12, () => {
    bg('#aeb7c4', '#6f7a8a'); close('kai', 620, 'tired', { s: 2.2, hy: 430 });
    at(1320, 520, pop(f.t, 0.15), () => { card(-330, -200, 660, 400, '#ffffff', 30, INK, 10); card(-330, -200, 660, 110, '#1f2a44', 30); T('DELIVERY CO.', 0, -146, 50, '#ffffff', { spacing: 6 }); T('DRIVER', 0, -30, 60, '#6b7280', { spacing: 10 }); T('4471', 0, 90, 170, INK, { mono: true }); }, -0.05);
  }, 960, 500) },
  '2c': { sfx: [['paper', 0.2], ['paper', 1.7], ['paper', 3.2]], draw: (f) => drift(f, 1.05, 1.0, () => {
    bg('#e9dfc9', '#b8a888');
    for (let i = 0; i < 24; i++) { const x = 250 + (i % 6) * 240; const y = 150 + Math.floor(i / 6) * 180; const k = pop(f.t, 0.1 + i * 0.09); card(x, y, 210, 150, '#ffffff', 12, '#8a7a5c', 5); if (k > 0) E('🚐', x + 105, y + 78, 90 * k); }
    const steps = [['10 HOURS A DAY', 0.04], ['6 DAYS A WEEK', 0.3], ['200 STOPS', 0.55]]; const cur = steps.filter(([, a]) => f.k >= a).pop();
    if (cur) cap(cur[0], pop(f.t, cur[1] * f.d), { y: 960, size: 100 });
  }) },
  '2d': { sfx: [['engine', 0.1], ['engine', 1.3, 0.8], ['error', 2.2, 0.4]], draw: (f) => drift(f, 1.0, 1.05, () => {
    S.street(); const x = lerp(-200, 1250, easeOut(f.k * 1.1));
    floaters(f.t, 12, (i, life) => circle(x - 330 - life * 160, 700 - life * 120 - rnd(i) * 30, 24 + life * 50, 'rgba(70,70,80,0.55)'), { every: 0.22, life: 0.9 });
    van(x, 900, 1.25, { rust: true, rattle: true, color: '#d8d2c2' });
    const hk = prog(f.t, 2.0, f.d); if (hk > 0) at(x - 240 - hk * 420, 880 - Math.abs(Math.sin(hk * 9)) * 60 * (1 - hk), 1, () => { circle(0, 0, 30, '#c9ccd2'); circle(0, 0, 10, INK); }, hk * 20);
  }) },
  '2e': { sfx: [['counter', 0.3], ['error', 2.6, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#2a3150', '#0c0e18'); const k = ease(prog(f.t, 0.3, f.d * 0.75)); const val = lerp(1840, 43.18, k);
    T('THIS MONTH', W / 2, 190, 56, '#9aa3b5', { spacing: 12, weight: 700 });
    card(260, 300, 1400, 70, '#161a2a', 35); card(260, 300, 1400 * (0.08 + 0.92 * prog(f.t, 0.2, f.d * 0.9)), 70, '#4c6ef5', 35);
    for (let i = 1; i < 4; i++) line([[260 + i * 350, 290], [260 + i * 350, 380]], '#0c0e18', 6);
    T('WEEK 1', 435, 420, 30, '#6b7592', { weight: 700 }); T('WEEK 4', 1485, 420, 30, '#6b7592', { weight: 700 });
    counter('BALANCE', money(val, 2), W / 2, 680, val < 300 ? RED : '#51cf66', pop(f.t, 0.1), { size: 170, s: 1.3 });
  }) },
  '2f': { sfx: [['door', 0.2, 0.5]], draw: (f) => drift(f, 1.08, 1.0, () => {
    S.room(); const wide = prog(f.t, 0.5, 1.1);
    who('kai', { x: 960, y: 900, s: 1.9, pose: { lean: 0, tilt: 0, armL: [lerp(8, 88, ease(wide)), 2], armR: [lerp(8, 88, ease(wide)), 2], legL: [6, 0], legR: [6, 0] }, expr: 'tired' });
    if (wide >= 1) { T('!', 520, 520, 90, RED); T('!', 1400, 520, 90, RED); }
  }) },
  '2g': { sfx: [['drip', 0.6], ['drip', 2.2], ['drip', 3.6]], draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#8f897d', '#5c574e'); card(0, 0, W, 160, '#a39d90', 0);
    ctx_blob(760, 160, 220, '#6e6658'); const dk = (f.t * 0.65) % 1; E('💧', 870, lerp(230, 720, dk * dk), 70);
    E('🪣', 870, 830, 220); floor(900, '#4d483f');
    at(1260, 330, pop(f.t, f.d * 0.38), () => { card(-190, -90, 380, 180, '#ffffff', 16, RED, 10); T('HELLO, MY NAME IS', 0, -44, 26, RED, { weight: 800 }); T('GARY', 0, 26, 96, INK); }, 0.07);
  }) },
  '2h': { draw: (f) => drift(f, 1.0, 1.12, () => {
    bg('#b9b3a6', '#7b7468'); card(0, 700, W, 40, '#6b4a2f', 0);
    card(610, 200, 700, 500, '#3b2a1a', 14); card(650, 240, 620, 420, '#e8dcc4', 6);
    head('kai', 830, 470, 1.5, 'smile'); alpha(1 - ease(prog(f.t, 0.5, f.d * 0.85)), () => head('maya', 1090, 470, 1.5, 'smile'));
    alpha(ease(prog(f.t, 0.5, f.d * 0.85)), () => { const c = K.ctx(); c.setLineDash([16, 14]); c.strokeStyle = '#8a7a5c'; c.lineWidth = 7; c.beginPath(); c.arc(1090, 470, 93, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); });
  }) },
  '2i': { sfx: [['door', 3.2, 0.9]], draw: (f) => grey(() => drift(f, 1.0, 1.06, () => {
    bg('#d8cbb3', '#9a8c74'); floor(880, '#7a6c56'); door(1480, 880, 1.25, '#5a4a3a');
    const leave = ease(prog(f.t, f.d * 0.72, f.d));
    who('maya', { x: lerp(1060, 1470, leave), y: 900, s: 1.45, pose: 'crossed', expr: 'sad' }); E('🧳', lerp(1230, 1600, leave), 800, 150);
    who('kai', { x: 520, y: 900, s: 1.45, pose: 'slump', expr: 'sad' });
    bubble("I'm tired of waiting\nfor your life to start.", 1010, 300, pop(f.t, f.d * 0.25) * (1 - leave), { size: 50 });
  })) },
  '2j': { draw: (f) => drift(f, 1.0, 1.15, () => {
    bg('#6f7584', '#2c2f3a'); close('kai', 960, 'sad', { s: 2.6, hy: 520 });
    bubble('. . .', 1240, 300, pop(f.t, 0.5), { size: 90, side: -1 });
  }) },
  '2k': { sfx: [['crowd', 0.1, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.dinner(); who('mom', { x: 430, y: 930, s: 1.3, expr: 'smile' }); who('kai', { x: 960, y: 930, s: 1.3, expr: 'neutral' }); who('ray', { x: 1500, y: 930, s: 1.3, pose: 'point', flip: true, expr: 'smug' });
    table(960, 760, 1700, '#7a4a2a'); card(110, 786, 1700, 300, '#5f3920', 0);
    ['🍗', '🥔', '🥗', '🍷'].forEach((e, i) => E(e, 420 + i * 360, 700, 100));
    bubble('Still driving\nthe van?', 1360, 300, pop(f.t, f.d * 0.55), { size: 56, side: -1 });
  }) },
  '2l': { sfx: [['laugh', 0.1, 1.2], ['laugh', 1.3]], draw: (f) => {
    const zk = ease(prog(f.t, f.d * 0.4, f.d * 0.7));
    zoom(lerp(1, 2.1, zk), () => { S.dinner(); who('mom', { x: 430, y: 930, s: 1.3, expr: 'laugh' }); who('kai', { x: 960, y: 930, s: 1.3, expr: 'fake' }); who('ray', { x: 1500, y: 930, s: 1.3, expr: 'laugh', pose: 'cheer' }); table(960, 760, 1700, '#7a4a2a'); card(110, 786, 1700, 300, '#5f3920', 0); }, 960, 440);
    alpha(1 - zk, () => laughs(f));
  } },
  '2m': { draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#d9bf95', '#9a7a4c'); close('mom', 1380, 'worried', { s: 2.0, hy: 420 });
    card(0, 780, W, 300, '#5f3920', 0); card(0, 760, W, 40, '#7a4a2a', 0);
    const sq = Math.sin(f.t * 5) * 6; line([[420, 1080], [700, 900]], '#8b919c', 110); circle(720, 890, 62, '#111114');
    line([[1250, 1080], [860 + sq, 900]], '#7c5cbf', 100); circle(830 + sq, 880, 58, '#111114');
  }) },
  '2n': { sfx: [['tick', 0.2, 2], ['tick', 2.0, 2]], draw: (f) => drift(f, 1.0, 1.07, () => {
    bg('#cfd6df', '#8e98a8'); floor(880, '#9aa1ab'); door(560, 880, 1.2, '#7b889a'); card(450, 250, 220, 90, '#ffffff', 12, INK, 6); T('WC', 560, 296, 60, INK);
    who('graves', { x: 1180, y: 900, s: 1.5, pose: P.give, flip: true, expr: 'angry' });
    at(940, 520, 1, () => { circle(0, 0, 100, '#ffffff'); const c = K.ctx(); c.strokeStyle = INK; c.lineWidth = 12; c.beginPath(); c.arc(0, 0, 100, 0, Math.PI * 2); c.stroke(); card(-18, -134, 36, 40, INK, 6); const a = f.t * 2.4; line([[0, 0], [Math.sin(a) * 76, -Math.cos(a) * 76]], RED, 10); T((3 + f.k).toFixed(0) + ':' + String(Math.floor((f.t * 14) % 60)).padStart(2, '0'), 0, 150, 44, INK, { mono: true }); });
  }) },
  '2o': { sfx: [['error', 0.2, 0.5]], draw: (f) => drift(f, 1.02, 1.1, () => {
    bg('#9aa3b5', '#4f5869'); close('graves', 1200, 'angry', { s: 2.5, hy: 520, flip: true });
    bubble('Four minutes, 4471.', 760, 330, pop(f.t, 0.15), { size: 64 }); bubble("That's coming out\nof your lunch.", 700, 620, pop(f.t, f.d * 0.48), { size: 54 });
  }) },
  '2p': { draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#59606f', '#23262f'); card(380, 80, 1160, 900, '#aab4c4', 30, '#3b2a1a', 26);
    for (let i = 5; i >= 1; i--) alpha(pop(f.t, f.d * 0.4 + (5 - i) * 0.22) * 0.5, () => { who('kai', { x: 960 + i * 86, y: 960, s: 1.5 - i * 0.07, pose: 'slump', expr: 'tired', still: true }); T(`YEAR ${6 - i}`, 960 + i * 86 + 60, 250 + i * 14, 30, '#ffffff', { weight: 800 }); });
    who('kai', { x: 800, y: 980, s: 1.6, pose: 'slump', expr: 'tired' });
    cap('"TEMPORARY"', pop(f.t, 0.3), { y: 1000, size: 80 });
  }) },
  '2q': { quietCut: true, draw: (f) => drift(f, 1.0, 1.1, () => {
    S.room({ night: true }); who('kai', { x: 800, y: 900, s: 1.5, pose: 'slump', expr: 'tired' });
    floaters(f.t, 5, (i, life) => T('z', 980 + i * 26 + life * 40, 420 - life * 120, 50 + i * 8, '#9aa3b5'), { every: 0.7, life: 1.4 });
    tint('#000000', 0.55 * ease(prog(f.t, f.d * 0.55, f.d)));
  }) },

  // ===== 3. The video =======================================================
  '3a': { quietCut: true, sfx: [['tick', 0.2, 1.5]], draw: (f) => { bg('#05060a'); const o = ease(prog(f.t, 0.25, 0.6)); zoom(1 + f.k * 0.08, () => at(960, 520, 3.2, () => { const c = K.ctx(); c.fillStyle = GREEN; c.shadowColor = GREEN; c.shadowBlur = 30; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * 24, 0, 14, 19 * o + 1, 0, 0, Math.PI * 2); c.fill(); } })); T('2:07 AM', 1620, 120, 60, '#3a4158', { mono: true }); } },
  '3b': { sfx: [['buzz', 0.2], ['send', 1.6, 0.5], ['send', 2.4, 0.5], ['send', 3.1, 0.5]], draw: (f) => drift(f, 1.05, 1.0, () => {
    bg('#3a4f7a', '#090b14', 900, 900, 1200); const c = K.ctx(); const g = c.createRadialGradient(900, 1120, 0, 900, 1120, 760); g.addColorStop(0, 'rgba(170,215,255,0.55)'); g.addColorStop(1, 'rgba(170,215,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    who('kai', { x: 900, y: 1540, s: 2.7, pose: 'phone', expr: 'tired', prop: 'phone' });
    floaters(f.t, 8, (i, life) => E(['🐱', '💥', '🕺', '🍕', '⚽', '🎮', '🚗', '😂'][i], 1350 + rnd(i) * 260, 760 - life * 520, 110), { every: 0.42, from: 1.2, life: 0.9 });
  }) },
  '3c': { sfx: [['send', 0.1, 0.6], ['send', 1.4, 0.6], ['send', 2.8, 0.6], ['error', 4.6, 0.3]], draw: (f) => {
    bg('#1b2033', '#07080d'); const n = Math.min(2, Math.floor(f.k * 3 / 0.62)); const items = [['🐱', 'cat does a thing', '#f08c00'], ['💥', 'worst crash ever', '#c92a2a'], ['🕺', 'kitchen dance pt. 9', '#5f3dc4']];
    const local = (f.k * 3 / 0.62) % 1;
    phone(960, 560, 1.25, 1, () => { K.ctx().save(); K.ctx().translate(0, f.k < 0.62 && n < 2 ? -720 * ease(prog(local, 0.82, 1)) : 0); feedCard(...items[n]); K.ctx().translate(0, 720); feedCard(...items[Math.min(2, n + 1)]); K.ctx().restore(); });
    if (f.k > 0.62) ['NOTHING.', 'NOTHING.', 'NOTHING.'].forEach((s, i) => at(i === 1 ? 960 : (i ? 1560 : 360), 300 + i * 220, pop(f.t, f.d * (0.64 + i * 0.11)), () => T(s, 0, 0, 80, '#6b7592', { stroke: '#07080d' }), (i - 1) * 0.08));
  } },
  '3d': { quietCut: true, sfx: [['scratch', 2.4, 0.7]], draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#1b2033', '#07080d'); const stop = f.k > 0.55;
    phone(960, 560, 1.25, 1, () => { card(0, 0, 400, 720, '#2b2f3a', 0); at(200, 470, 1, () => who('mentor', { x: 0, y: 380, s: 0.95, expr: 'smile', still: true })); card(20, 600, 360, 90, 'rgba(0,0,0,0.55)', 16); T('how I make money asleep', 200, 645, 26, '#ffffff', { weight: 700 }); });
    finger(lerp(1380, 1230, ease(prog(f.t, 0, 0.5))), stop ? 620 : 620 + Math.sin(f.t * 9) * 60, 1.5);
    if (stop) { const r = 60 + ((f.t * 60) % 60); alpha(1 - (r - 60) / 60, () => { const c = K.ctx(); c.strokeStyle = GREEN; c.lineWidth = 8; c.beginPath(); c.arc(1230, 620, r, 0, Math.PI * 2); c.stroke(); }); }
  }) },
  '3e': { sfx: [['chime', 3.0, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#3b4252', '#16181d'); close('mentor', 520, 'smile', { s: 2.3, hy: 470 });
    const gk = prog(f.t, f.d * 0.42, f.d * 0.95); const n = Math.floor(lerp(1, 60, ease(gk)));
    for (let i = 0; i < n; i++) { const x = 1010 + (i % 10) * 82; const y = 250 + Math.floor(i / 10) * 100; E('📄', x, y, i === 0 && gk <= 0 ? 0 : 70); }
    if (gk <= 0) E('📄', 1380, 480, 300 * pop(f.t, f.d * 0.18));
    cap(gk <= 0 ? 'ONE FILE' : '× 1,000', pop(f.t, gk <= 0 ? f.d * 0.2 : f.d * 0.6), { x: 1380, y: 900, size: 110, color: gk <= 0 ? '#ffffff' : GREEN });
  }) },
  '3f': { sfx: [['notif', 1.9], ['notif', 2.9], ['notif', 3.8]], draw: (f) => drift(f, 1.03, 1.0, () => {
    bg('#27304d', '#0d101c'); T('DIGITAL PRODUCTS', W / 2, 170, 90, '#ffffff', { spacing: 8 });
    [['📋', 'TEMPLATES', '#1c7ed6', 0.36], ['📘', 'GUIDES', '#e8590c', 0.56], ['🛠️', 'TOOLS', '#2f9e44', 0.74]].forEach(([e, s, col, a], i) => at(400 + i * 560, 600, pop(f.t, f.d * a), () => { card(-230, -260, 460, 520, col, 40); E(e, 0, -50, 210); T(s, 0, 170, 62, '#ffffff', { spacing: 4 }); }, (i - 1) * 0.04));
  }) },
  '3g': { sfx: [['cash', 1.4], ['cash', 2.4, 0.8], ['cash', 3.2, 0.7]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1d2440', '#0a0d1a'); card(0, 0, 960, H, '#141a30', 0); card(960, 0, 960, H, '#0f2a1c', 0); line([[960, 0], [960, H]], '#ffffff', 8);
    card(170, 640, 620, 150, '#3a4368', 30); card(170, 590, 200, 90, '#e8e4da', 24); head(withSpec('kai', { eye: '#39ff14' }), 300, 560, 1.2, 'tired'); card(330, 600, 470, 150, '#56618f', 36);
    floaters(f.t, 6, (i, life) => T('z', 420 + i * 30 + life * 50, 470 - life * 140, 60 + i * 8, '#9aa3b5'), { every: 0.6, life: 1.4 });
    T('MAKE IT ONCE', 480, 210, 64, '#9aa3b5', { spacing: 4 });
    [0.3, 0.52, 0.7].forEach((a, i) => at(1440, 390 + i * 200, pop(f.t, f.d * a), () => { card(-330, -76, 660, 152, '#ffffff', 30); E('💰', -250, 0, 90); T('NEW SALE', -60, -26, 44, INK, { align: 'left' }); T('+ $9.00', -60, 34, 52, '#2f9e44', { align: 'left', mono: true }); }));
    T('SELLS WHILE YOU SLEEP', 1440, 210, 56, GREEN, { spacing: 3 });
  }) },
  '3h': { sfx: [['heartbeat', 0.4, 1.2], ['riser', 2.2, 0.8]], draw: (f) => drift(f, 1.0, 1.18, () => {
    bg('#3a4f7a', '#090b14', 960, 600); const k = prog(f.t, 0.6, f.d);
    for (let i = 0; i < 3; i++) { const r = ((f.t * 0.8 + i / 3) % 1); alpha((1 - r) * 0.5, () => { const c = K.ctx(); c.strokeStyle = GREEN; c.lineWidth = 10; c.beginPath(); c.arc(960, 980, 120 + r * 500, 0, Math.PI * 2); c.stroke(); }); }
    close('kai', 960, k > 0.25 ? 'hopeful' : 'tired', { s: 2.8, hy: 500 });
    tint(GREEN, 0.08 * ease(k));
  }) },
  '3i': { sfx: [['tick', 0.2, 2], ['tick', 2.2, 2]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1b2033', '#07080d'); const k = ease(prog(f.t, 0.3, f.d * 0.9)); const hrs = lerp(1.1, 4.0, k);
    T(`${Math.floor(hrs)}:${String(Math.floor((hrs % 1) * 60)).padStart(2, '0')} AM`, 480, 480, 170, '#ffffff', { mono: true }); T('VIDEOS WATCHED', 480, 640, 40, '#6b7592', { spacing: 8, weight: 700 }); T(String(Math.floor(lerp(1, 10, k))), 480, 760, 150, GREEN, { mono: true });
    const n = Math.floor(lerp(1, 10, k)); for (let i = 0; i < n; i++) at(1160 + (i % 2) * 380, 170 + Math.floor(i / 2) * 180, pop(f.t, 0.3 + i * (f.d * 0.6) / 10), () => { card(-170, -80, 340, 160, ['#1c7ed6', '#e8590c', '#2f9e44', '#9c36b5', '#e03131'][i % 5], 14, '#ffffff', 5); E('▶️', 0, 0, 70); });
  }) },
  '3j': { quietCut: true, sfx: [['boom', 0.9, 0.5]], draw: (f) => drift(f, 1.1, 1.0, () => {
    bg('#3a4f7a', '#090b14', 960, 700); const k = ease(prog(f.t, 0.5, 1.4));
    who('kai', { x: 960, y: 1500, s: 2.6, pose: k > 0.5 ? 'slump' : 'phone', expr: k > 0.4 ? 'sad' : 'hopeful', prop: k > 0.5 ? undefined : 'phone' });
    tint('#000000', 0.6 * k);
  }) },

  // ===== 4. "It will never work" ============================================
  '4a': { sfx: [['boom', 1.2, 0.5]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#3b4252', '#12141c'); at(960, 440, pop(f.t, f.d * 0.3, 0.4) * (1 + Math.sin(f.t * 2) * 0.03), () => T('?', 0, 0, 760, '#5c677d'));
    who('kai', { x: 960, y: 1010, s: 0.8, pose: 'shrug', expr: 'sad' }); E('🚐', 760, 950, 110);
  }) },
  '4b': { sfx: [['crowd', 0.1, 0.8]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.breakroom(); who('kai', { x: 640, y: 930, s: 1.45, pose: 'phone', expr: 'hopeful', prop: 'phone' }); who('dex', { x: 1220, y: 930, s: 1.45, pose: P.give, flip: true, expr: 'neutral' }); E('🥪', 1060, 590, 100);
    table(930, 800, 1100, '#b08a5a'); card(380, 826, 1100, 260, '#8c6a45', 0);
    bubble('Look at this...', 700, 250, pop(f.t, f.d * 0.55), { size: 54 });
  }) },
  '4c': { sfx: [['laugh', 0.1, 1.6], ['laugh', 1.0, 1.4], ['door', 2.0, 0.5]], draw: (f) => drift(f, 1.05, 1.0, () => {
    S.breakroom(); const fall = prog(f.t, f.d * 0.5, f.d * 0.82);
    who('dex', { x: 960, y: 950, s: 1.9, pose: 'cheer', expr: 'laugh', lean: 0 }); E('🥪', 1220, lerp(430, 900, fall * fall), 150, fall * 5);
    if (fall >= 1) T('splat', 1400, 880, 60, '#8a7a5c', { weight: 800 });
    laughs(f, 8);
  }) },
  '4d': { sfx: [['scratch', 0.05, 0.6]], draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#2f9e44', '#14532d'); close('dex', 1320, 'laugh', { s: 2.4, hy: 520, flip: true });
    [['Bro.', 0.05], ['You?', 0.22], ['Selling files?', 0.42], ['To who?', 0.72]].forEach(([s, a], i) => bubble(s, 480 + (i % 2) * 160, 290 + i * 200, pop(f.t, f.d * a), { size: 70 }));
  }) },
  '4e': { quietCut: true, draw: (f) => drift(f, 1.0, 1.07, () => {
    S.kitchen(); who('kai', { x: 560, y: 940, s: 1.45, pose: P.give, expr: 'hopeful' }); who('mom', { x: 1280, y: 940, s: 1.45, expr: f.k > 0.5 ? 'worried' : 'neutral' }); E('🫖', 1560, 500, 130);
    bubble('. . .', 1300, 270, pop(f.t, f.d * 0.55), { size: 80, side: -1 });
  }) },
  '4f': { sfx: [['error', 0.4, 0.4]], draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#f5e6c8', '#c9a56a'); close('mom', 1260, 'worried', { s: 2.3, hy: 520, flip: true });
    at(430, 300, pop(f.t, 0.1), () => { card(-330, -200, 660, 400, '#22252e', 24); card(-300, -170, 600, 340, '#c92a2a', 8); T('⚠ WARNING', 0, -70, 60, '#ffffff'); T('ONLINE SCAMS', 0, 20, 70, '#ffffff'); T('ON THE RISE', 0, 100, 50, '#ffd8d8'); });
    bubble('Honey, those things are scams.\nPlease. Just keep the job.', 620, 860, pop(f.t, f.d * 0.2), { size: 48 });
  }) },
  '4g': { sfx: [['paper', 0.3]], draw: (f) => drift(f, 1.0, 1.07, () => {
    S.dinner(); who('ray', { x: 1100, y: 1000, s: 1.9, pose: { lean: 0, tilt: 16, armL: [20, -70], armR: [24, -90], legL: [5, 0], legR: [5, 0] }, expr: 'smug' });
    card(0, 800, W, 300, '#5f3920', 0); card(0, 778, W, 40, '#7a4a2a', 0); E('🍽️', 1100, 760, 190);
    bubble('Real men have\nreal jobs.', 620, 420, pop(f.t, f.d * 0.55), { size: 64 });
  }) },
  '4h': { draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#6b7592', '#2a3150'); [['dex', 460], ['mom', 960], ['ray', 1460]].forEach(([n, x], i) => { who(n, { x, y: 960, s: 1.35, expr: 'worried', pose: 'stand' }); E('🛡️', x, 240 - Math.sin(f.t * 2 + i) * 10, 150 * pop(f.t, f.d * 0.45 + i * 0.18)); });
    cap('THEY THINK THEY ARE PROTECTING YOU', pop(f.t, f.d * 0.42), { size: 64, y: 1010 });
  }) },
  '4i': { sfx: [['heartbeat', 0.6]], draw: (f) => drift(f, 1.0, 1.12, () => {
    bg('#3b4252', '#0c0e14'); close('kai', 720, 'sad', { s: 2.8, hy: 560 });
    thought(1330, 330, 300, pop(f.t, f.d * 0.42), () => { head('kai', Math.sin(f.t * 9) * 26, -10, 1.3, 'angry'); T('NO.', 0, 150, 70, INK); });
  }) },
  '4j': { sfx: [['typing', 0.2, 1.2], ['boom', 2.0, 0.6]], draw: (f) => { bg('#0c0e14', '#000000'); const a = 'IT WILL NEVER WORK.'; const b = 'Not for someone like you.'; const n = Math.floor(prog(f.t, 0.15, f.d * 0.5) * a.length); T(a.slice(0, n) + (n < a.length && Math.floor(f.t * 4) % 2 ? '_' : ''), W / 2, 460, 130, '#ffffff', { mono: true }); alpha(ease(prog(f.t, f.d * 0.58, f.d * 0.75)), () => T(b, W / 2, 660, 70, RED, { mono: true, weight: 700 })); } },
  '4k': { sfx: [['error', 1.0, 0.5], ['tick', 2.6, 2]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1b2033', '#07080d'); const pressed = prog(f.t, f.d * 0.24, f.d * 0.3); const gone = ease(prog(f.t, f.d * 0.3, f.d * 0.45));
    phone(700, 560, 1.2, 1, () => { card(0, 0, 400, 720, '#12141c', 0); T('SAVED VIDEOS', 200, 70, 30, '#9aa3b5', { weight: 800 }); for (let i = 0; i < 4; i++) alpha(1 - gone, () => card(30, 120 + i * 120, 340, 100, ['#1c7ed6', '#e8590c', '#2f9e44', '#9c36b5'][i], 12)); card(40, 610, 320, 80, pressed > 0 ? '#8a1c1c' : '#e03131', 20); T('REMOVE ALL', 200, 652, 34, '#ffffff'); });
    finger(lerp(1100, 800, ease(prog(f.t, 0, f.d * 0.24))), 990, 1.4);
    at(1380, 520, pop(f.t, f.d * 0.55), () => { E('⏰', 0, -40, 300); T('5:00 AM', 0, 190, 80, '#ffffff', { mono: true }); });
  }) },

  // ===== 5. The big problem =================================================
  '5a': { quietCut: true, sfx: [['riser', 0.4], ['boom', 0.9, 0.8]], draw: (f) => drift(f, 1.0, 1.1, () => {
    S.depot(); tint(RED, 0.28 * ease(prog(f.t, 0.8, 1.6)));
    at(lerp(-400, 960, easeOut(prog(f.t, 0.3, 1.0))), 520, 1, () => { card(-300, -190, 600, 380, '#e03131', 14, '#7a1010', 10); line([[-300, -190], [0, 30], [300, -190]], '#7a1010', 10); T('NOTICE', 0, 110, 70, '#ffffff', { spacing: 10 }); }, -0.08);
  }) },
  '5b': { sfx: [['crowd', 0.1]], draw: (f) => drift(f, 1.0, 1.06, () => {
    S.bay(); for (let i = 0; i < 9; i++) who(`driver${i}`, { x: 200 + i * 150, y: 940 + (i % 2) * 30, s: 0.85, expr: 'worried', pose: i % 3 ? 'stand' : 'crossed' });
    who('kai', { x: 1560, y: 960, s: 0.9, expr: 'neutral' });
    card(1690, 800, 190, 130, '#c99a5b', 6, INK, 6); who('graves', { x: 1785, y: 800, s: 1.0, pose: P.give, flip: true, expr: 'angry' });
    E('📢', 1640, 430, 110);
  }) },
  '5c': { sfx: [['error', 0.8, 0.4], ['error', 1.5, 0.4], ['error', 2.2, 0.4], ['error', 2.9, 0.4]], draw: (f) => drift(f, 1.02, 1.0, () => {
    bg('#1d2440', '#0a0d1a'); card(220, 110, 1480, 780, '#0f1424', 30, '#4c6ef5', 10); T('ROUTE OPTIMISER 3000', W / 2, 180, 50, '#4c6ef5', { spacing: 8, mono: true });
    for (let i = 0; i < 24; i++) { const x = 340 + (i % 8) * 180; const y = 330 + Math.floor(i / 8) * 180; E('🚐', x, y, 110); if (i % 2 === 1) { const k = pop(f.t, 0.5 + (i / 24) * (f.d * 0.7)); if (k > 0) tick(x, y, 1.6 * k, false); } }
    cap('NEEDS HALF OF YOU', pop(f.t, f.d * 0.55), { y: 990, size: 76, color: RED });
  }) },
  '5d': { sfx: [['paper', 0.2], ['paper', 1.6]], draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#8e98a8', '#3f4756'); close('graves', 1300, 'neutral', { s: 2.3, hy: 520, flip: true }); E('📋', 900, 760, 260);
    ['4458', '4462', '4466', '4469', '4470'].forEach((s, i) => { const life = prog(f.t, 0.3 + i * (f.d * 0.17), 0.3 + i * (f.d * 0.17) + 1.4); if (life > 0 && life < 1) alpha(1 - life * life, () => T(s, 620 - life * 260, 420 - i * 20 - life * 120, 90, '#ffffff', { mono: true, stroke: '#2c3340' })); });
  }) },
  '5e': { quietCut: true, sfx: [['slam', 0.45, 1.3], ['boom', 0.45]], draw: (f) => { const hit = f.t > 0.45; shake(hit ? 16 * (1 - prog(f.t, 0.45, 1.0)) : 0, () => { bg('#aeb7c4', '#5f6a7a');
    at(960, 540, 1.5, () => { card(-330, -200, 660, 400, '#ffffff', 30, INK, 10); card(-330, -200, 660, 110, '#1f2a44', 30); T('DELIVERY CO.', 0, -146, 50, '#ffffff', { spacing: 6 }); T('DRIVER', 0, -30, 60, '#6b7280', { spacing: 10 }); T('4471', 0, 90, 170, INK, { mono: true }); });
    if (hit) at(960, 560, 3 - 2 * easeOut(prog(f.t, 0.45, 0.6)), () => { const c = K.ctx(); c.strokeStyle = RED; c.lineWidth = 16; c.strokeRect(-470, -110, 940, 220); T('TERMINATED', 0, 6, 140, RED, { spacing: 8 }); }, -0.14); }); tint('#ffffff', hit ? 0.6 * (1 - prog(f.t, 0.45, 0.75)) : 0); } },
  '5f': { draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#59606f', '#1c1f27'); who('graves', { x: 1250, y: 1250, s: 2.5, pose: 'crossed', expr: 'smug', flip: true }); who('kai', { x: 420, y: 1120, s: 1.1, pose: 'slump', expr: 'sad' });
    bubble('Nothing personal.', 760, 250, pop(f.t, 0.12), { size: 66, side: -1 }); bubble('You were never going to be\nmore than this anyway.', 700, 560, pop(f.t, f.d * 0.34), { size: 46, side: -1 });
  }) },
  '5g': { sfx: [['door', 0.3, 0.7]], draw: (f) => drift(f, 1.06, 1.0, () => {
    S.street({ sunset: true }); const x = lerp(1500, 500, f.k);
    alpha(0.35, () => { const c = K.ctx(); c.fillStyle = '#000000'; c.beginPath(); c.moveTo(x - 40, 930); c.lineTo(x + 40, 930); c.lineTo(x + 560, 1010); c.lineTo(x + 420, 1020); c.closePath(); c.fill(); });
    who('kai', { x, y: 930, s: 1.3, pose: P.hold, expr: 'sad' }); box(x, 930 - 1.3 * 190, 1.3);
  }) },
  '5h': { sfx: [['paper', 0.8]], draw: (f) => drift(f, 1.0, 1.14, () => {
    bg('#8f897d', '#4d483f'); floor(960, '#3f3a33'); door(960, 960, 1.7, '#6b4a2f');
    at(960, 420, pop(f.t, 0.5), () => { card(-230, -170, 460, 340, '#fff8dc', 6, '#b7950b', 4); card(-70, -196, 140, 50, 'rgba(255,255,255,0.7)', 4); T('RENT DUE', 0, -70, 70, RED); T('30 DAYS', 0, 40, 96, INK, { mono: true }); T('FINAL NOTICE', 0, 124, 28, '#8a7a5c', { weight: 800 }); }, 0.04 + Math.sin(f.t * 2) * 0.01);
  }, 960, 420) },
  '5i': { sfx: [['counter', 0.2], ['error', 1.5, 0.5], ['tick', 2.4, 3]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#2a1820', '#0c0609'); counter('BALANCE', '$43.18', 480, 420, RED, pop(f.t, 0.1), { size: 110 }); counter('JOB', 'NONE', 1010, 420, RED, pop(f.t, f.d * 0.33), { size: 110, rot: -0.02 });
    const days = 30 - prog(f.t, f.d * 0.6, f.d) * 1.2; counter('RENT DUE IN', `${Math.ceil(days)} DAYS`, 1300, 760, '#ffa94d', pop(f.t, f.d * 0.52), { size: 130, s: 1.15 });
  }) },
  '5j': { quietCut: true, sfx: [['door', 0.5, 0.6]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#4d483f', '#16130f'); floor(940, '#2a2620'); door(960, 940, 1.5, '#4a3524');
    const sit = ease(prog(f.t, 0.3, 1.2)); who('kai', { x: 960, y: 960, s: 1.5, pose: sit > 0.5 ? P.sitFloor : 'slump', expr: 'sad' });
  }) },
  '5k': { quietCut: true, sfx: [['heartbeat', 0.8], ['riser', 3.6, 0.9], ['boom', 4.1, 0.6]], draw: (f) => drift(f, 1.0, 1.3, () => {
    bg('#4d483f', '#16130f'); floor(940, '#2a2620'); door(960, 940, 1.5, '#4a3524'); const up = prog(f.t, f.d * 0.55, f.d * 0.7);
    who('kai', { x: 960, y: 960, s: 1.5, pose: { ...P.sitFloor, tilt: lerp(12, -4, ease(up)) }, expr: up > 0.5 ? 'determined' : 'sad' });
    tint(GREEN, 0.07 * ease(up)); cap('NOTHING LEFT TO LOSE', pop(f.t, f.d * 0.68), { y: 300, size: 54, glow: GREEN });
  }, 960, 560) },

  // ===== 6. Research ========================================================
  '6a': { sfx: [['chime', 0.4, 0.6]], draw: (f) => drift(f, 1.0, 1.05, () => {
    bg('#1e2a4a', '#0a0d1a');
    phone(960, 560, 1.25, 1, () => { card(0, 0, 400, 720, '#12141c', 0); T('SAVED VIDEOS', 200, 70, 30, '#9aa3b5', { weight: 800 }); for (let i = 0; i < 4; i++) { const k = easeOut(prog(f.t, 0.25 + i * 0.12, 0.6 + i * 0.12)); card(30 + (1 - k) * 420, 120 + i * 120, 340, 100, ['#1c7ed6', '#e8590c', '#2f9e44', '#9c36b5'][i], 12); } card(40, 610, 320, 80, '#2f9e44', 20); T('RESTORED', 200, 652, 34, '#ffffff'); });
  }) },
  '6b': { sfx: [['pen', 0.3]], draw: (f) => drift(f, 1.0, 1.07, () => {
    bg('#2a3150', '#0d101c'); who('kai', { x: 560, y: 1150, s: 1.9, pose: P.type, expr: 'determined' });
    laptop(1240, 700, 1.0, () => { card(0, 0, 640, 400, '#2b2f3a', 0); at(320, 420, 1, () => who('mentor', { x: 0, y: 0, s: 0.75, expr: 'smile', still: true })); });
    card(0, 760, W, 320, '#3b2a1a', 0); E('📓', 660, 800, 190); E('✏️', 760 + Math.sin(f.t * 14) * 16, 760, 110);
    floaters(f.t, 6, (i, life) => T(['hook', 'niche', 'problem', 'price', 'audience', 'offer'][i], 860 + i * 150, 200 - life * 110, 44, GREEN, { weight: 800 }), { every: 0.6, from: 0.8, life: 1.2 });
  }) },
  '6c': { sfx: [['paper', 0.4], ['pen', 1.6, 0.8]], draw: (f) => drift(f, 1.05, 1.0, () => {
    S.library(); who('kai', { x: 960, y: 1020, s: 1.5, pose: P.type, expr: 'determined' }); table(960, 820, 1300, '#6b4a2f'); card(310, 846, 1300, 260, '#573b25', 0);
    for (let i = 0; i < 5; i++) E('📚', 480 + (i > 1 ? 780 : 0) + (i % 2) * 150, 760 - Math.floor(i / 2) * 6, 150); E('💻', 960, 770, 170);
    tag('FREE WIFI + HEATER', pop(f.t, f.d * 0.2), '#ffd43b'); E('♨️', 1750, 760, 130);
  }) },
  '6d': { sfx: [['pen', 0.3, 1.2]], draw: (f) => drift(f, 1.0, 1.1, () => {
    bg('#3b2a1a', '#1c130b'); at(960, 540, 1, () => { card(-620, -400, 1240, 800, '#fff8dc', 12, '#b7950b', 6); for (let i = 0; i < 9; i++) line([[-560, -300 + i * 80], [560, -300 + i * 80]], '#d9cfa8', 3); line([[-470, -400], [-470, 400]], '#e8a0a0', 4);
      const a = 'RULE 1:'; const b = 'SELL WHAT HURTS'; T(a, 0, -200, 100, '#1c7ed6'); const n = Math.floor(prog(f.t, f.d * 0.45, f.d * 0.8) * b.length); T(b.slice(0, n), 0, 0, 120, INK); if (n >= b.length) { line([[-470, 80], [470, 80]], RED, 12); line([[-470, 108], [470, 108]], RED, 12); }
      alpha(0.5, () => T('not what you like', 0, 220, 56, '#8a7a5c', { weight: 700 })); if (f.k > 0.3) line([[-250, 222], [250, 222]], '#8a7a5c', 6); }, -0.02);
  }) },
  '6e': { draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#2a3150', '#0d101c'); who('kai', { x: 560, y: 1200, s: 2.0, pose: P.think, expr: 'determined' });
    thought(1280, 380, 330, pop(f.t, 0.3), () => { if (f.k < 0.55) { T('WHO DO I', 0, -50, 76, INK); T('KNOW?', 0, 50, 96, '#1c7ed6'); } else for (let i = 0; i < 6; i++) E('🚐', -170 + (i % 3) * 170, -60 + Math.floor(i / 3) * 130, 110 * pop(f.t, f.d * 0.55 + i * 0.08)); });
  }) },
  '6f': { sfx: [['notif', 0.6, 0.6], ['notif', 1.4, 0.6], ['counter', 2.6]], draw: (f) => drift(f, 1.0, 1.06, () => cityMap(f, false)) },
  '6g': { sfx: [['error', 2.6, 0.6], ['error', 3.9, 0.6], ['error', 5.0, 0.7]], draw: (f) => drift(f, 1.03, 1.0, () => {
    bg('#3b1f1f', '#140a0a'); T('EVERY DRIVER HATES', W / 2, 150, 76, '#ffffff', { spacing: 6 });
    [['🛣️', 'MILES', 0.4], ['⛽', 'FUEL', 0.6], ['🧾', 'TAX', 0.78]].forEach(([e, s, a], i) => at(400 + i * 560, 600, pop(f.t, f.d * a), () => { card(-230, -260, 460, 520, '#2a1414', 40, RED, 8); E(e, 0, -50, 210); T(s, 0, 170, 80, '#ffffff', { spacing: 4 }); E('😡', 160, -200, 100); }, Math.sin(f.t * 12 + i) * 0.02));
  }) },
  '6h': { sfx: [['paper', 0.3], ['paper', 1.2]], draw: (f) => drift(f, 1.0, 1.1, () => { bg('#3b2a1a', '#1c130b'); at(960, 560, 1, () => notebook(f), -0.05); tag('5 YEARS OF NUMBERS', pop(f.t, f.d * 0.45), '#ffd43b'); }) },
  '6i': { sfx: [['poof', 1.1]], draw: (f) => drift(f, 1.0, 1.06, () => {
    bg('#1f3a2a', '#0a140e'); const k = ease(prog(f.t, f.d * 0.3, f.d * 0.6));
    alpha(1 - k, () => at(960, 560, 1 - k * 0.2, () => notebook(f), -0.05 + k));
    alpha(k, () => at(960, 560, 0.8 + k * 0.2, () => { sheet(-560, -330, 1120, 660, 9, 5, { seed: 3 }); ['DATE', 'MILES', 'FUEL', 'INCOME', 'TAX'].forEach((s, i) => T(s, -448 + i * 224, -292, 34, '#ffffff', { weight: 800 })); }));
    if (k > 0 && k < 1) for (let i = 0; i < 14; i++) star(960 + Math.cos(i * 2.4) * 600 * k, 560 + Math.sin(i * 2.4) * 380 * k, 22 * (1 - k) + 6, GREEN);
  }) },
  '6j': { sfx: [['chime', 1.3], ['cash', 3.9]], draw: (f) => drift(f, 1.0, 1.07, () => {
    bg('#1f3a2a', '#0a140e'); at(960, 520, pop(f.t, 0.15), () => { card(-520, -330, 1040, 660, '#ffffff', 40); card(-520, -330, 1040, 300, '#1e8449', 40); E('🚐', -330, -180, 190); sheet(-170, -290, 620, 230, 5, 4, { stroke: '#ffffff', head: '#145a32' });
      alpha(prog(f.t, f.d * 0.22, f.d * 0.34), () => { T("THE DRIVER'S", 0, 60, 96, INK); T('LEDGER', 0, 168, 120, '#1e8449', { spacing: 8 }); }); });
    at(1500, 250, pop(f.t, f.d * 0.72), () => { star(0, 0, 190, '#ffd43b'); T('$9', 0, 6, 130, INK); }, 0.2);
  }) },
  '6k': { sfx: [['chime', 2.6, 0.6]], draw: (f) => drift(f, 1.0, 1.08, () => {
    bg('#22314f', '#0a0d1a'); who('kai', { x: 480, y: 1200, s: 2.0, pose: P.type, expr: 'hopeful' });
    laptop(1220, 760, 1.2, () => { card(0, 0, 640, 400, '#eef2f7', 0); E('📄', 320, 170, 190); card(150, 290, 340, 70, '#1e8449', 14); T('drivers-ledger.xlsx', 320, 326, 30, '#ffffff', { weight: 700 }); alpha(prog(f.t, f.d * 0.6, f.d * 0.72), () => T('by KAI', 520, 60, 40, '#1c7ed6')); });
    const c = K.ctx(); const g = c.createRadialGradient(1100, 600, 0, 1100, 600, 800); g.addColorStop(0, 'rgba(190,225,255,0.22)'); g.addColorStop(1, 'rgba(190,225,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  }) },
  '6l': { quietCut: true, draw: (f) => drift(f, 1.0, 1.14, () => { bg('#22314f', '#0a0d1a'); close('kai', 960, 'smile', { s: 2.8, hy: 500 }); cap('YOURS.', pop(f.t, f.d * 0.55), { size: 150, glow: GREEN, color: GREEN }); }) },
};

// ---- pieces shared by several shots --------------------------------------------
function ctx_blob(x, y, w, color) { const c = K.ctx(); c.fillStyle = color; c.beginPath(); c.ellipse(x + w / 2, y, w / 2, 46, 0, 0, Math.PI); c.fill(); }
function notebook(f) {
  card(-560, -360, 1120, 720, '#2f4a6b', 18); card(-540, -340, 1080, 680, '#fff8dc', 8); line([[0, -340], [0, 340]], '#c9bd95', 8);
  for (let p = 0; p < 2; p++) for (let r = 0; r < 9; r++) { const y = -280 + r * 68; line([[-500 + p * 540, y + 26], [-40 + p * 540, y + 26]], '#d9cfa8', 3); for (let c = 0; c < 3; c++) T(String(Math.floor(40 + rnd(p * 31 + r * 7 + c) * 900)), -430 + p * 540 + c * 150, y, 34, '#3b4a6b', { mono: true, weight: 700 }); }
  E('☕', 430, -280, 90);
}
// city map with a dot for every driver; green: true turns every dot green (used again in chapter 9)
function cityMap(f, green) {
  bg('#16223d', '#070b16'); const c = K.ctx(); c.strokeStyle = '#243459'; c.lineWidth = 10;
  for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(0, 90 + i * 120 + rnd(i) * 30); c.lineTo(W, 60 + i * 120 + rnd(i + 3) * 60); c.stroke(); c.beginPath(); c.moveTo(120 + i * 220 + rnd(i + 6) * 40, 0); c.lineTo(60 + i * 220 + rnd(i + 9) * 90, H); c.stroke(); }
  const n = 150; const shown = Math.floor(n * ease(prog(f.t, 0.2, f.d * 0.7)));
  for (let i = 0; i < shown; i++) { const x = 60 + rnd(i * 3 + 1) * 1800; const y = 60 + rnd(i * 5 + 2) * 960; const col = green ? GREEN : '#ffd43b'; alpha(0.25, () => circle(x, y, 22 + Math.sin(f.t * 3 + i) * 5, col)); circle(x, y, 9, col); }
  counter(green ? 'DRIVERS USING IT' : 'DRIVERS OUT THERE', Math.floor(60000 * ease(prog(f.t, 0.2, f.d * 0.75))).toLocaleString('en-US'), W / 2, 540, green ? GREEN : '#ffd43b', pop(f.t, 0.2), { size: 170, s: 1.2 });
}
module.exports._shared = { cityMap, notebook, close, laughs };
