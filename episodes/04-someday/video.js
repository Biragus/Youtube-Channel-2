// Episode 04, "Someday": a wordless 2:40 story. Kai is stuck, a shadow whispers every excuse, he starts anyway,
// writes a guide from what he learned, and the shadow shrinks to nothing. Scenes are drawn in 1920x1080.
const K = require('../../engine/kit');
const M = require('../../engine/motion');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, T, rnd } = K;
const W = 1920; const H = 1080; const FLOOR = 900;
const sm = M.smooth;
const c = () => K.ctx();

// ---- shared pieces -------------------------------------------------------------
function room(o = {}) { // dark room with a window
  K.bg(o.inner ?? '#1b1f2b', o.outer ?? '#05060a', o.cx ?? 960, o.cy ?? 420, 1300);
  if (o.window !== false) { const wx = o.wx ?? 1480; card(wx, 150, 300, 340, o.sky ?? '#0b1430', 10, '#2a2f3d', 12); line([[wx + 150, 150], [wx + 150, 490]], '#2a2f3d', 10); line([[wx, 320], [wx + 300, 320]], '#2a2f3d', 10); if (o.moon !== false) { circle(wx + 220, 230, 34, '#e9ecef'); circle(wx + 236, 222, 30, o.sky ?? '#0b1430'); } }
  c().fillStyle = o.floor ?? '#0c0e14'; c().fillRect(0, FLOOR, W, H - FLOOR); line([[0, FLOOR], [W, FLOOR]], 'rgba(255,255,255,0.06)', 4);
}
function glow(x, y, r, color) { const g = c().createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); c().fillStyle = g; c().fillRect(x - r, y - r, r * 2, r * 2); }
function vignette(a = 0.55) { const g = c().createRadialGradient(960, 540, 380, 960, 540, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); c().fillStyle = g; c().fillRect(0, 0, W, H); }
function cam(lt, d, z0, z1, cx, cy, fn, shake = 0) { c().save(); if (shake) c().translate(Math.sin(lt * 83) * shake, Math.cos(lt * 71) * shake); K.zoom(lerp(z0, z1, sm(lt / d)), fn, cx, cy); c().restore(); }
let TAG = null; function dayTag(n, lt, color = '#ffffff') { TAG = [n, lt, color]; }
function drawTag(n, lt, color) { at(130, 110, pop(lt, 0.15), () => { T(`DAY ${n}`, 0, 0, 46, color, { mono: true, spacing: 6, align: 'left' }); card(0, 34, 70, 6, color === '#ffffff' ? '#ff3b3b' : color, 3); }); }
function caption(str, y, lt, a, b, color = '#ffffff', size = 64, o = {}) { alpha(prog(lt, a, a + 0.4) * (1 - prog(lt, b - 0.4, b)), () => T(str, 960, y + (1 - easeOut(prog(lt, a, a + 0.5))) * 20, size, color, { spacing: 4, ...o })); }
// the shadow's voice: red, shaky, fades in and out
function whisper(str, x, y, lt, a, b, size = 50) { const k = prog(lt, a, a + 0.5) * (1 - prog(lt, b - 0.5, b)); if (k <= 0) return; alpha(k, () => { const j = 2.2; T(str, x + Math.sin(lt * 37) * j, y + Math.cos(lt * 29) * j, size, '#ff4a4a', { glow: '#ff0000', blur: 30, spacing: 3, weight: 800 }); }); }

// the shadow: a dark copy of Kai with a red rim and slit eyes. (x, y) is where it stands; s scales it (1 = 720 px tall)
function demon(x, y, s, lt, o = {}) {
  if (s <= 0.01) return;
  const sway = Math.sin(lt * 1.3) * 12; const hL = o.handL ?? [-230 + Math.sin(lt * 1.7) * 14, -240]; const hR = o.handR ?? [230 - Math.sin(lt * 1.5) * 14, -240];
  const parts = (fill, g) => { const cc = c(); cc.fillStyle = fill; cc.strokeStyle = fill;
    for (let i = 0; i < 12; i++) { const px = -170 + i * 31 + Math.sin(lt * 2 + i) * 10; cc.beginPath(); cc.arc(px, -26 - Math.abs(Math.sin(i * 1.7 + lt * 1.3)) * 26, 46 + rnd(i) * 24 + g, 0, Math.PI * 2); cc.fill(); }
    cc.beginPath(); cc.moveTo(-150 - g, -20); cc.bezierCurveTo(-200 - g, -200, -210 - g, -380, -130 - g + sway * 0.4, -470 - g); cc.quadraticCurveTo(sway * 0.5, -520 - g, 130 + g + sway * 0.4, -470 - g); cc.bezierCurveTo(210 + g, -380, 200 + g, -200, 150 + g, -20); cc.closePath(); cc.fill();
    cc.beginPath(); cc.arc(sway * 0.6, -590, 100 + g, 0, Math.PI * 2); cc.fill();
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.42; const bx = sway * 0.6 + Math.cos(a) * 80; const by = -590 + Math.sin(a) * 80; cc.beginPath(); cc.moveTo(bx - 30 - g, by + 10); cc.lineTo(bx + Math.cos(a) * (80 + g) + Math.sin(lt * 3 + i) * 6, by + Math.sin(a) * (80 + g)); cc.lineTo(bx + 30 + g, by + 10); cc.closePath(); cc.fill(); }
    cc.lineCap = 'round'; cc.lineJoin = 'round';
    for (const [sx, hd] of [[-1, hL], [1, hR]]) { const sh = [sx * 140 + sway * 0.4, -430]; const el = [lerp(sh[0], hd[0], 0.5) + sx * 50, lerp(sh[1], hd[1], 0.5) + 30]; cc.lineWidth = 46 + g * 2; cc.beginPath(); cc.moveTo(sh[0], sh[1]); cc.quadraticCurveTo(el[0], el[1], hd[0], hd[1]); cc.stroke();
      cc.lineWidth = 12 + g * 2; for (let f = -1; f <= 1; f++) { cc.beginPath(); cc.moveTo(hd[0], hd[1]); cc.lineTo(hd[0] + sx * 34 + f * 14, hd[1] + 30 + Math.abs(f) * -8); cc.stroke(); } }
  };
  alpha(o.a ?? 1, () => at(x, y, s, () => {
    c().save(); c().shadowColor = '#ff1a1a'; c().shadowBlur = 50; alpha(0.85, () => parts('#7a0b0b', 5)); c().restore();
    parts('#040406', 0);
    const blink = (lt % 3.7) > 3.55 ? 0.15 : 1;
    for (const sx of [-1, 1]) at(sway * 0.6 + sx * 40, -598, 1, () => { c().scale(1, blink); c().shadowColor = '#ff0000'; c().shadowBlur = 30; c().fillStyle = '#ff2d2d'; c().beginPath(); c().ellipse(0, 0, 30, 8, sx * 0.28, 0, Math.PI * 2); c().fill(); });
  }));
}
// lying in bed: blanket over the body, head on the pillow, one arm that can reach out
function bed(lt, o = {}) { // headboard on the right, beside the nightstand
  card(400, 690, 980, 70, '#3a2a22', 10); card(400, 760, 40, 140, '#2a1e18', 6); card(1340, 760, 40, 140, '#2a1e18', 6); card(1330, 560, 50, 340, '#2a1e18', 10);
  card(1110, 640, 220, 70, '#cfd4dc', 30);
  if (o.empty) { card(420, 650, 700, 70, '#3b4a6b', 30); return; }
  at(1200, 622, 0.95, () => K.head('kai', 0, 0, 1, o.expr ?? 'tired', 0), 1.35 + Math.sin(lt * 1.1) * 0.03);
  card(420, 640 - Math.sin(lt * 1.6) * 4, 720, 80, '#3b4a6b', 34);
  if (o.hand) { const [hx, hy] = o.hand; const sh = [1110, 668]; const el = [lerp(sh[0], hx, 0.5) - 10, Math.min(sh[1], hy) - 60]; c().lineCap = 'round'; c().lineJoin = 'round'; line([sh, el, [hx, hy]], '#8a8f99', 28); circle(hx, hy, 17, '#111114'); }
}
function nightstand(x, time, lt, o = {}) {
  card(x - 110, 720, 220, 180, '#2a1e18', 10); card(x - 90, 650, 180, 70, '#111114', 12, '#2b2f3a', 4);
  const ring = o.ring && (lt % 0.5) < 0.3; const col = o.color ?? '#ff3b3b';
  T(time, x, 687, 50, ring ? '#ffffff' : col, { mono: true, glow: col, blur: ring ? 40 : 18 });
  if (o.ring) for (const sd of [-1, 1]) alpha(ring ? 1 : 0.3, () => { line([[x + sd * 110, 640], [x + sd * 140, 615]], '#ffd43b', 6); line([[x + sd * 116, 672], [x + sd * 152, 668]], '#ffd43b', 6); });
}
function desk(x, o = {}) { card(x - 300, 690, 600, 26, '#3a2a22', 8); card(x - 270, 716, 22, 184, '#2a1e18', 4); card(x + 248, 716, 22, 184, '#2a1e18', 4); }
function chair(x) { card(x - 70, 740, 140, 20, '#24262e', 6); card(x - 60, 760, 14, 140, '#1a1c22', 4); card(x + 46, 760, 14, 140, '#1a1c22', 4); card(x - 70, 560, 20, 190, '#24262e', 6); }
function laptopAt(x, y, s, draw) { K.laptop(x, y, s, draw); }
function screen(fill) { c().fillStyle = fill; c().fillRect(0, 0, 640, 400); }
function poofAt(x, y, lt, t0, n = 14, r = 160) { const k = prog(lt, t0, t0 + 0.8); if (k <= 0 || k >= 1) return; alpha(1 - k, () => { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; circle(x + Math.cos(a) * r * easeOut(k), y + Math.sin(a) * r * 0.7 * easeOut(k), 40 * (1 - k * 0.5), '#e9ecef'); } circle(x, y, 120 * (1 - k), '#ffffff'); }); }

// ---- scenes ----------------------------------------------------------------------
// each: [duration, draw(lt), sounds [[name, offset, multiplier, length]], options]
const S = [];
const add = (d, draw, sfx = [], o = {}) => S.push({ d, draw, sfx, ...o });

// ACT I: the rut
add(5, (lt) => { K.bg('#0b0c10', '#000000'); caption('Every morning was the same.', 540, lt, 0.6, 4.6, '#ffffff', 60, { weight: 700 }); }, [['heartbeat', 0.4, 0.6], ['heartbeat', 2.4, 0.5]], { quietCut: true });

add(8, (lt) => cam(lt, 8, 1.0, 1.12, 1250, 650, () => {
  room({ wx: 1500 }); bed(lt, { hand: lt > 1.2 ? [lerp(1130, 1450, sm(prog(lt, 1.2, 2.0))), lerp(660, 640, sm(prog(lt, 1.2, 2.0))) - Math.sin(sm(prog(lt, 1.2, 2.0)) * Math.PI) * 60] : null });
  const snooze = lt > 2.05; const mins = snooze ? Math.floor(lerp(0, 227, ease(prog(lt, 3.2, 6.2)))) : 0; const hh = 6 + Math.floor(mins / 60); const mm = mins % 60;
  nightstand(1460, `${hh}:${String(mm).padStart(2, '0')}`, lt, { ring: !snooze });
  alpha(prog(lt, 2.4, 2.8) * (1 - prog(lt, 6.6, 7.2)), () => T('5 more minutes...', 1000, 420, 40, '#9aa3b5', { weight: 700, spacing: 2 }));
  for (let i = 0; i < 3; i++) { const k = ((lt * 0.5 + i / 3) % 1); if (lt > 2.4) alpha(Math.sin(k * Math.PI) * 0.8, () => T('z', 1180 + k * 50 + i * 12, 540 - k * 110, 30 + k * 20, '#9aa3b5')); }
  vignette();
}), [['alarm', 0.3, 1, 1.8], ['slam', 2.0, 0.35], ['clock', 3.2, 1, 3.0]]);

add(8, (lt) => cam(lt, 8, 1.04, 1.14, 960, 620, () => {
  room({ wx: 200 }); dayTag(1, lt);
  const rise = sm(prog(lt, 1.2, 3.0)); demon(980, FLOOR + 40 + (1 - rise) * 500, 0.95, lt, { a: rise, handL: [-200, -330], handR: [210, -300 + Math.sin(lt * 2) * 10] });
  card(640, 690, 640, 110, '#3d3346', 30); card(600, 640, 90, 200, '#3d3346', 30); card(1230, 640, 90, 200, '#3d3346', 30); card(640, 790, 640, 110, '#2e2635', 20);
  glow(960, 560, 160, 'rgba(120,190,255,0.25)');
  M.sit('kai', 960, FLOOR, 1.05, lt, { seat: 760, armL: [24, -40], armR: [24, -128 + Math.sin(lt * 4) * 3], prop: 'phone', tilt: 14, lean: 4, expr: 'tired', look: 0.2 });
  whisper('Start tomorrow.', 980, 200, lt, 3.4, 7.6);
  vignette();
}), [['rumble', 2.6, 0.8]]);

add(8, (lt) => cam(lt, 8, 1.06, 1.16, 900, 600, () => {
  room({ wx: 1500, sky: '#060a18' }); dayTag(38, lt);
  card(200, 210, 150, 150, '#14161d', 75, '#2b2f3a', 8); line([[275, 285], [275, 235]], '#9aa3b5', 6); line([[275, 285], [305, 300]], '#9aa3b5', 6); T('2:14 AM', 275, 400, 26, '#5c6370', { mono: true });
  demon(1100, FLOOR + 20, 0.95, lt, { handL: [-260, -200], handR: [-60 + Math.sin(lt) * 10, -330] });
  chair(760); desk(1020);
  laptopAt(1080, 680, 0.42, () => { screen('#0f1420'); for (let i = 0; i < 6; i++) card(40, 40 + i * 50, 380 - (i % 3) * 90, 18, '#2a3450', 6); });
  glow(1080, 560, 220, 'rgba(120,170,255,0.18)');
  const nod = Math.max(0, Math.sin(lt * 0.9)) * 10;
  M.sit('kai', 770, FLOOR, 1.05, lt, { seat: 745, lean: 14 + nod, handL: [960, 668 + Math.sin(lt * 14) * 3], handR: [1000, 668 + Math.cos(lt * 12) * 3], elbow: -1, expr: 'tired', look: 0.4 });
  whisper("You're not smart enough.", 1150, 190, lt, 2.8, 7.6);
  vignette();
}), [['clock', 0, 1, 8], ['rumble', 2.2, 0.8]]);

add(8, (lt) => cam(lt, 8, 1.0, 1.1, 960, 560, () => {
  room({ wx: 1560 }); dayTag(90, lt);
  demon(1340, FLOOR + 20, 0.95, lt, { handL: [-280, -330], handR: [140, -260] });
  for (let i = 0; i < 6; i++) { const t0 = 0.3 + i * 0.35; const k = easeOut(prog(lt, t0, t0 + 0.7)); if (k > 0) at(520 + i * 70 + Math.sin(i) * 30, lerp(-120, 880 - (i % 3) * 14, k), 1, () => { card(-70, -46, 140, 92, '#f4efe6', 6); T('OVERDUE', 0, -12, 18, '#e03131', { spacing: 1 }); card(-46, 14, 92, 8, '#ced4da', 3); }, (rnd(i) - 0.5) * 0.6 + (1 - k) * 2); }
  M.idle('kai', 760, FLOOR, 1.1, lt, { armL: [10, 6], handR: [830, 610], elbow: -1, crouch: 10, lean: 6, expr: 'worried', look: 0.3, prop: 'phone' });
  alpha(prog(lt, 1.6, 2.0), () => { c().setLineDash([10, 10]); line([[836, 600], [660, 470]], 'rgba(255,255,255,0.35)', 3); c().setLineDash([]); c().strokeStyle = 'rgba(255,255,255,0.5)'; c().lineWidth = 3; c().beginPath(); c().arc(836, 606, 34, 0, Math.PI * 2); c().stroke(); });
  K.phone(500, 430, 0.42, prog(lt, 1.6, 2.2), () => { c().fillStyle = '#0f1420'; c().fillRect(0, 0, 400, 720); T('BALANCE', 200, 250, 34, '#9aa3b5', { spacing: 4 }); T('$4.12', 200, 340, 92, '#ff4a4a', { glow: '#ff0000', blur: 16 }); });
  whisper("People like you don't get lucky.", 1180, 170, lt, 3.6, 7.6, 46);
  vignette();
}), [['paper', 0.3], ['buzz', 1.6, 0.33], ['rumble', 3.0, 0.8]]);

add(8, (lt) => cam(lt, 8, 1.0, 1.18, 1180, 470, () => {
  room({ window: false, inner: '#171a22' }); dayTag(210, lt);
  card(940, 160, 500, 640, '#2a2f3d', 20); card(960, 180, 460, 600, '#0b0d13', 12);
  c().save(); c().beginPath(); c().rect(960, 180, 460, 600); c().clip(); demon(1190, 860, 0.85, lt + 3, { handL: [-160, -250], handR: [160, -250] });
  const crack = prog(lt, 5.0, 5.15); if (crack > 0) { for (let i = 0; i < 9; i++) { const a = i * 0.7 + 0.3; const len = 120 + rnd(i) * 220; line([[1170, 420], [1170 + Math.cos(a) * len * 0.5 + 14 * Math.sin(i), 420 + Math.sin(a) * len * 0.5], [1170 + Math.cos(a) * len, 420 + Math.sin(a) * len]], 'rgba(255,255,255,0.75)', 3); } }
  c().restore();
  M.idle('kai', 640, FLOOR, 1.15, lt, { flip: false, armL: [10, 6], armR: [10, 6], expr: lt > 5.1 ? 'sad' : 'worried', look: 0.8, crouch: lt > 5.1 ? 14 * sm(prog(lt, 5.1, 5.6)) : 0 });
  whisper("You'll never change.", 1190, 880, lt, 2.2, 7.6);
  vignette();
}, lt > 5 && lt < 5.3 ? 6 : 0), [['rumble', 1.8, 0.8], ['glass', 5.0, 0.8]]);

add(8, (lt) => cam(lt, 8, 1.0, 1.22, 960, 700, () => {
  K.bg('#0a0b10', '#000000'); dayTag(365, lt);
  glow(960, 760, 340, 'rgba(255,255,255,0.10)'); c().fillStyle = 'rgba(255,255,255,0.05)'; c().beginPath(); c().moveTo(880, 0); c().lineTo(1040, 0); c().lineTo(1260, 900); c().lineTo(660, 900); c().closePath(); c().fill();
  demon(960, FLOOR + 80, lerp(1.0, 1.18, sm(lt / 8)), lt, { handL: [-260, -120 + Math.sin(lt) * 20], handR: [260, -120 - Math.sin(lt) * 20] });
  M.sit('kai', 960, FLOOR, 1.0, lt, { seat: FLOOR - 40, tilt: 26, lean: 10, handL: [1010, 800], handR: [1030, 790], expr: 'sad', look: 0 });
  vignette(0.7);
}), [['heartbeat', 0.5, 0.7], ['heartbeat', 2.5, 0.7], ['heartbeat', 4.5, 0.8], ['heartbeat', 6.5, 0.9], ['rumble', 1.0, 0.7]], { fadeOut: 0.6 });

// ACT II: day one, again
add(7, (lt) => {
  const hit = 1.6; const up = 3.0; cam(lt, 7, 1.12, 1.0, 1250, 650, () => {
    room({ wx: 1500 });
    if (lt < up) { const k = sm(prog(lt, 0.9, hit)); bed(lt, { hand: [lerp(1130, 1455, k), lerp(640, 655, k) - Math.sin(k * Math.PI) * 120], expr: lt > hit ? 'determined' : 'tired' }); }
    else { bed(lt, { empty: true }); if (lt < up + 0.9) M.figure({ spec: 'kai', ...M.jump(lt, up, 0.9, 1180, FLOOR, 1000, FLOOR, 1.1, 90), expr: 'determined', glow: 'rgba(57,255,20,0.6)' }); else M.idle('kai', 1000, FLOOR, 1.1, lt, { expr: 'determined', armL: [14, -30], armR: [14, -30] }); }
    nightstand(1460, '6:00', lt, { ring: lt < hit });
    vignette();
  }, lt > hit && lt < hit + 0.35 ? 14 : 0);
  alpha(prog(lt, 4.2, 4.6), () => at(960, 160, pop(lt, 4.2), () => T('DAY 1. AGAIN.', 0, 0, 80, '#ffffff', { spacing: 10, glow: GREEN, blur: 30 })));
}, [['alarm', 0.2, 1, 1.4], ['slam', 1.6], ['boom', 1.6, 0.6], ['riser', 3.6]], { music: 'drive' });

add(8, (lt) => cam(lt, 8, 1.02, 1.12, 960, 540, () => {
  room({ wx: 180 });
  demon(1640, FLOOR + 20, 0.9, lt, { handL: [-230, -300], handR: [200, -260] });
  card(820, 170, 640, 440, '#2b2f3a', 14); card(836, 186, 608, 408, '#f4efe6', 8); card(900, 606, 480, 14, '#2b2f3a', 6); card(1100, 600, 80, 10, '#1c7ed6', 4);
  T('WHAT I LEARNED', 1140, 240, 38, '#16161a', { spacing: 3 }); card(900, 270, 480, 5, '#16161a', 2);
  const rows = ['wake up at 6. no snooze.', 'no phone until 8.', 'one small task first.', 'write it down.'];
  rows.forEach((s2, i) => { const k = prog(lt, 1.2 + i * 1.3, 2.2 + i * 1.3); c().save(); c().beginPath(); c().rect(880, 300 + i * 70, 520 * k, 66); c().clip(); T(s2, 890, 334 + i * 70, 34, '#2b2f3a', { align: 'left', weight: 700 }); c().restore(); });
  const k = Math.min(1, ((lt - 1.2) % 1.3) / 1.0); const row = Math.min(3, Math.max(0, Math.floor((lt - 1.2) / 1.3))); const writing = lt > 1.2 && lt < 6.4;
  M.idle('kai', 760, FLOOR, 1.15, lt, { lean: 4, handR: writing ? [lerp(900, 1280, k), 334 + row * 70 + Math.sin(lt * 30) * 3] : [900, 520], armL: [10, 6], elbow: -1, expr: 'determined', look: 0.8 });
  whisper('Who would pay for that?', 1560, 140, lt, 3.4, 7.4, 44);
  vignette();
}), [['pen', 1.2, 0.6, 5.0], ['rumble', 3.0, 0.6]]);

add(8, (lt) => cam(lt, 8, 1.04, 1.12, 1000, 560, () => {
  room({ wx: 1560, sky: '#0d1838' }); dayTag(9, lt);
  card(180, 220, 150, 150, '#14161d', 75, '#2b2f3a', 8); line([[255, 295], [255, 240]], '#9aa3b5', 6); line([[255, 295], [255, 350]], '#9aa3b5', 6); T('5:58 AM', 255, 410, 26, '#9aa3b5', { mono: true });
  const reach = sm(prog(lt, 2.4, 3.6)) * (1 - sm(prog(lt, 4.1, 4.6)));
  demon(1430, FLOOR + 20, 0.9, lt, { handL: [lerp(-240, -560, reach), lerp(-260, -380, reach)], handR: [200, -260] });
  chair(760); desk(1020);
  laptopAt(1080, 680, 0.42, () => { screen('#ffffff'); T('THE 6AM RESET', 320, 60, 40, '#16161a', { spacing: 2 }); T('Chapter 1', 320, 110, 26, '#868e96', { weight: 700 }); for (let i = 0; i < 5; i++) card(60, 160 + i * 42, 520 * Math.min(1, Math.max(0, (lt - 0.4 - i * 1.2) / 1.2)), 16, '#ced4da', 6); });
  for (let i = 0; i < 3; i++) { const k = (lt * 0.6 + i / 3) % 1; alpha(Math.sin(k * Math.PI) * 0.5, () => card(1250 + Math.sin(k * 6 + i) * 6, 620 - k * 80, 8, 26, '#ffffff', 4)); }
  card(1226, 640, 50, 54, '#c2410c', 8);
  const push = sm(prog(lt, 4.0, 4.3)) * (1 - sm(prog(lt, 4.8, 5.3)));
  M.sit('kai', 770, FLOOR, 1.05, lt, { seat: 745, lean: 8, handL: push > 0.05 ? [lerp(960, 1180, push), lerp(668, 520, push)] : [960, 668 + Math.sin(lt * 18) * 4], handR: [1000, 668 + Math.cos(lt * 16) * 4], elbow: -1, expr: 'determined', look: 0.4 });
  whisper('Go back to bed.', 1420, 170, lt, 1.8, 4.2, 46);
  vignette();
}), [['typing', 0.3, 0.5, 3.6], ['rumble', 1.6, 0.6], ['punch', 4.2, 0.8], ['typing', 4.8, 0.5, 3.0]]);

add(8, (lt) => {
  const flash = Math.max(0, 1 - Math.abs(lt - 3.05) * 6) + Math.max(0, 1 - Math.abs(lt - 3.35) * 8) * 0.6;
  cam(lt, 8, 1.0, 1.08, 960, 600, () => {
    K.bg('#11152a', '#03040a');
    for (let i = 0; i < 14; i++) { const bw = 120 + rnd(i) * 140; const bh = 200 + rnd(i + 9) * 360; const bx = ((i * 190 - lt * 260) % 2660 + 2660) % 2660 - 370; card(bx, FLOOR - bh, bw, bh, '#0a0c16', 4); for (let r = 0; r < 4; r++) if (rnd(i * 7 + r) > 0.5) card(bx + 20, FLOOR - bh + 30 + r * 60, 18, 26, 'rgba(255,212,59,0.35)', 3); }
    c().fillStyle = '#0a0b10'; c().fillRect(0, FLOOR, W, H - FLOOR);
    for (let i = 0; i < 12; i++) card(((i * 220 - lt * 900) % 2640 + 2640) % 2640 - 360, FLOOR + 40, 120, 8, 'rgba(255,255,255,0.12)', 4);
    dayTag(23, lt);
    demon(lerp(520, 140, sm(prog(lt, 1, 8))), FLOOR + 30, 0.8, lt, { handL: [-120, -320], handR: [320, -300 + Math.sin(lt * 5) * 20] });
    M.march('kai', 1080, FLOOR, 1.05, lt * 720, { run: true, expr: 'determined', lean: 4, profile: true });
    c().strokeStyle = 'rgba(170,190,255,0.35)'; c().lineWidth = 3; c().beginPath(); for (let i = 0; i < 160; i++) { const rx = ((rnd(i) * 2200 - lt * 300) % 2200 + 2200) % 2200 - 140; const ry = ((rnd(i + 40) * 1200 + lt * 1500) % 1200) - 100; c().moveTo(rx, ry); c().lineTo(rx - 12, ry + 44); } c().stroke();
    vignette();
  });
  alpha(flash * 0.7, () => { c().fillStyle = '#e7ecff'; c().fillRect(0, 0, W, H); });
}, [['rain', 0, 1, 8], ['thunder', 3.0]]);

add(8, (lt) => cam(lt, 8, 1.0, 1.1, 1080, 520, () => {
  room({ wx: 160 }); dayTag(41, lt);
  demon(1560, FLOOR + 20, 0.85, lt + 1, { handL: [-200, -330 + Math.sin(lt * 9) * 14 * (lt > 1.4 && lt < 3.4 ? 1 : 0)], handR: [210, -320 - Math.sin(lt * 9) * 14 * (lt > 1.4 && lt < 3.4 ? 1 : 0)] });
  chair(640); desk(900);
  laptopAt(1000, 680, 0.62, () => { screen('#f8f9fa'); T('THE 6AM RESET  ·  $9', 320, 54, 30, '#16161a'); card(40, 96, 560, 2, '#dee2e6', 1); T('SALES', 320, 170, 32, '#868e96', { spacing: 6 }); T('0', 320, 250, 110, '#e03131');
    const pr = sm(prog(lt, 5.0, 5.2)) * (1 - sm(prog(lt, 5.3, 5.5))); card(200, 320 + pr * 4, 240, 56, lt > 5.2 ? '#2f9e44' : '#1c7ed6', 14); T(lt > 5.2 ? 'PUBLISHED' : 'PUBLISH AGAIN', 320, 349 + pr * 4, 22, '#ffffff', { spacing: 2 }); });
  const tap = sm(prog(lt, 4.4, 5.0)) * (1 - sm(prog(lt, 5.4, 6.0)));
  M.sit('kai', 650, FLOOR, 1.05, lt, { seat: 745, lean: lt < 3.6 ? 6 : 12, handL: [820, 668], handR: tap > 0.02 ? [lerp(860, 1000, tap), lerp(668, 640, tap)] : [860, 668], elbow: -1, expr: lt < 3.6 ? 'sad' : 'determined', look: 0.5 });
  whisper('Told you.', 1560, 170, lt, 1.4, 3.8);
  vignette();
}), [['laugh', 1.4, 0.6], ['rumble', 1.3, 0.6], ['send', 5.1, 0.2]]);

add(8, (lt) => {
  const step = (x) => FLOOR - Math.max(0, Math.min(7, Math.floor((x - 300) / 170))) * 70;
  const kx = lerp(240, 1450, sm(prog(lt, 0.3, 7.2)) * 0.5 + prog(lt, 0.3, 7.2) * 0.5); const camY = lerp(0, -330, sm(prog(lt, 0.5, 7.5)));
  K.bg('#151a2a', '#04050a', 960, 540, 1400);
  cam(lt, 8, 1.0, 1.05, 960, 540, () => { c().save(); c().translate(0, -camY);
    for (let i = 0; i < 8; i++) { const x0 = 300 + i * 170; card(x0, FLOOR - i * 70, i === 7 ? 600 : 170, 1200, '#1d2232', 4, '#2b3248', 4); }
    const height = (FLOOR - step(kx)) / 490; demon(1700, FLOOR - 490 + 10, lerp(0.62, 0.3, height), lt, { handL: [-240, -260], handR: [240, -260] });
    const p = M.gait(0, kx - 240, FLOOR, 1.0, 'walk', { lean: 8, profile: true }); const q = { ...p, hip: [p.hip[0] + 240, p.hip[1]], footL: [p.footL[0] + 240, p.footL[1]], footR: [p.footR[0] + 240, p.footR[1]] };
    M.figure({ spec: 'kai', ...M.onGround(q, step), expr: 'determined' });
    c().restore(); vignette();
  });
  dayTag(57, lt);
}, [['punch', 1.0, 0.25], ['punch', 2.0, 0.25], ['punch', 3.0, 0.25], ['punch', 4.0, 0.25], ['punch', 5.0, 0.25], ['punch', 6.0, 0.25], ['riser', 6.6]]);

add(8, (lt) => cam(lt, 8, 1.0, 1.1, 960, 520, () => {
  room({ wx: 1560, sky: '#13204a' }); dayTag(64, lt);
  const flick = lt > 2.6 ? 0.5 + 0.5 * Math.sin(lt * 40) : 1; demon(1560, FLOOR + 20, lerp(0.85, 0.6, sm(prog(lt, 2.6, 4))), lt, { a: flick * (1 - prog(lt, 4.5, 5.5)) });
  chair(700); desk(960);
  const buzz = lt > 1.2 && lt < 2.2 ? Math.sin(lt * 90) * 4 : 0; card(1060 + buzz, 674, 110, 18, '#111114', 6); card(1066 + buzz, 676, 98, 6, lt > 1.2 ? '#69db7c' : '#1b1e27', 3); if (lt > 1.2) glow(1115, 670, 90, 'rgba(105,219,124,0.35)');
  if (lt < 2.6) M.sit('kai', 710, FLOOR, 1.05, lt, { seat: 745, lean: 6, handL: [880, 668], handR: [920, 668], elbow: -1, expr: lt > 1.3 ? 'shock' : 'neutral', look: 0.7 });
  else M.celebrate('kai', 820, FLOOR, 1.1, lt, 2.6, { height: 110 });
  at(960, 250, pop(lt, 1.4), () => { card(-330, -80, 660, 160, '#ffffff', 30); circle(-250, 0, 44, '#2f9e44'); T('$', -250, 4, 50, '#ffffff'); T('New sale!', -40, -26, 40, '#16161a', { align: 'left' }); T('The 6AM Reset  +$9.00', -40, 26, 30, '#2f9e44', { align: 'left', weight: 800 }); });
  vignette();
}), [['buzz', 1.2, 0.33], ['notif', 1.4, 0.33], ['cash', 2.6], ['chime', 3.0, 0.2]]);

add(12, (lt) => {
  const day = Math.round(lerp(64, 300, ease(prog(lt, 0.4, 8.6)))); const sales = Math.round(lerp(1, 2050, prog(lt, 0.4, 8.6) ** 1.6));
  cam(lt, 12, 1.0, 1.06, 960, 540, () => {
    room({ wx: 140, sky: lt > 9 ? '#2b4a8a' : '#13204a' });
    demon(1760, FLOOR + 20, lerp(0.7, 0.12, sm(prog(lt, 0.5, 8.5))), lt, { a: 1 - prog(lt, 8.6, 9.0) });
    const suit = lt > 9.1;
    if (!suit) { chair(560); desk(820); laptopAt(880, 680, 0.42, () => { screen('#0f1420'); for (let i = 0; i < 6; i++) card(40, 40 + i * 50, 380 - (i % 3) * 90 + Math.sin(lt * 3 + i) * 30, 18, '#3a5a9a', 6); });
      M.sit('kai', 570, FLOOR, 1.05, lt, { seat: 745, lean: 8, handL: [760, 668 + Math.sin(lt * 18) * 4], handR: [800, 668 + Math.cos(lt * 16) * 4], elbow: -1, expr: 'determined', look: 0.4 }); }
    else M.celebrate('kai2', 700, FLOOR, 1.15, lt, 9.3, { height: 90 });
    desk(1380); card(1350, 600, 60, 90, '#2b2f3a', 4); card(1260, 680, 240, 14, '#2b2f3a', 6); card(1060, 220, 640, 400, '#2b2f3a', 18); card(1076, 236, 608, 368, '#0d1018', 10);
    T('SALES', 1120, 270, 30, '#9aa3b5', { align: 'left', spacing: 6 }); T(sales.toLocaleString('en-US'), 1640, 270, 44, GREEN, { align: 'right', glow: GREEN, blur: 14 });
    const pts = []; const kk = prog(lt, 0.4, 8.6); for (let i = 0; i <= 40; i++) { const u = i / 40; if (u > kk) break; pts.push([1100 + u * 560, 570 - (u ** 1.8) * 240 - Math.sin(u * 20) * 6]); } if (pts.length > 1) line(pts, GREEN, 8);
    poofAt(700, 680, lt, 9.0);
    vignette();
  });
  at(130, 110, 1, () => { T(`DAY ${day}`, 0, 0, 46, '#ffffff', { mono: true, spacing: 6, align: 'left' }); card(0, 34, 70, 6, GREEN, 3); });
}, [['typing', 0.2, 0.25, 8.4], ['counter', 0.4, 0.2, 8.2], ['poof', 9.0, 0.7], ['cash', 9.4, 0.6]]);

add(8, (lt) => cam(lt, 8, 1.0, 1.12, 1100, 640, () => {
  room({ wx: 1560, sky: '#2b4a8a', moon: false });
  const kx = lerp(380, 1000, sm(prog(lt, 0.3, 4.0)));
  const fade = 1 - prog(lt, 4.8, 5.4); demon(1250, FLOOR + 4, 0.16, lt, { a: fade, handL: [-160, -300], handR: [200, -340] });
  whisper('...tomorrow?', 1250, 700, lt, 1.4, 4.8, 30);
  if (lt < 4.0) M.walk('kai2', kx, FLOOR, 1.1, { expr: 'smug', profile: true }); else M.idle('kai2', 1000, FLOOR, 1.1, lt, { expr: lt > 5 ? 'smile' : 'smug', look: 0.7 });
  poofAt(1250, 820, lt, 4.8, 10, 80);
  vignette(0.4);
}), [['rumble', 1.2, 0.35], ['poof', 4.8, 0.5]], { fadeOut: 0.5 });

// ACT III: the new life
add(9, (lt) => {
  const rise = sm(prog(lt, 0, 6)); const g = c().createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgb(${lerp(14, 58, rise)},${lerp(20, 70, rise)},${lerp(48, 120, rise)})`); g.addColorStop(1, `rgb(${lerp(40, 255, rise)},${lerp(30, 150, rise)},${lerp(60, 80, rise)})`); c().fillStyle = g; c().fillRect(0, 0, W, H);
  cam(lt, 9, 1.08, 1.0, 960, 600, () => {
    glow(960, lerp(1000, 640, rise), 520, 'rgba(255,190,90,0.55)'); circle(960, lerp(1000, 640, rise), 130, '#ffd27a');
    c().fillStyle = '#0b0d16'; c().beginPath(); c().moveTo(0, 820); c().quadraticCurveTo(500, 700, 960, 760); c().quadraticCurveTo(1400, 820, 1920, 700); c().lineTo(1920, 1080); c().lineTo(0, 1080); c().closePath(); c().fill();
    const open = sm(prog(lt, 2.0, 3.6)); M.idle('kai2', 960, 762, 1.05, lt, { armL: [lerp(10, 130, open), lerp(4, 10, open)], armR: [lerp(10, 130, open), lerp(4, 10, open)], expr: 'happy' });
  });
  at(130, 110, 1, () => { T('DAY 365', 0, 0, 46, '#ffffff', { mono: true, spacing: 6, align: 'left' }); card(0, 34, 70, 6, GOLD, 3); });
  alpha(prog(lt, 4.2, 4.8), () => { T(K.money(Math.round(lerp(0, 41280, easeOut(prog(lt, 4.2, 6.4))))), 960, 170, 96, GOLD, { glow: GOLD, blur: 30, spacing: 4 }); T('from one $9 guide', 960, 260, 36, '#ffffff', { weight: 700, spacing: 3 }); });
}, [['counter', 4.2, 0.2, 2.2], ['chime', 6.4, 0.2]], { music: 'warm', fadeIn: 0.6 });

add(8, (lt) => cam(lt, 8, 1.04, 1.12, 1300, 640, () => {
  room({ wx: 1500, sky: '#6d9eea', moon: false, inner: '#3a3f52', outer: '#141620', floor: '#1a1c26' }); glow(1650, 320, 400, 'rgba(255,220,150,0.25)');
  bed(lt, { empty: true });
  const t6 = lt > 1.8; nightstand(1460, t6 ? '6:00' : '5:59', lt, { color: '#69db7c' });
  const tap = sm(prog(lt, 1.2, 1.7)) * (1 - sm(prog(lt, 2.0, 2.5)));
  M.idle('kai2', 1250, FLOOR, 1.1, lt, { handR: tap > 0.02 ? [lerp(1290, 1440, tap), lerp(760, 650, tap)] : undefined, elbow: -1, expr: lt > 2.2 ? 'smile' : 'neutral', look: 0.6 });
  const peek = prog(lt, 3.6, 4.0) * (1 - prog(lt, 5.4, 5.6)); if (peek > 0) { const dx = lt > 5.0 ? (lt - 5.0) * -900 : 0; for (const sx of [-1, 1]) alpha(peek, () => { c().save(); c().shadowColor = '#ff0000'; c().shadowBlur = 14; c().fillStyle = '#ff2d2d'; c().beginPath(); c().ellipse(760 + dx + sx * 14, 840, 9, 3, sx * 0.3, 0, Math.PI * 2); c().fill(); c().restore(); }); }
  vignette(0.35);
}), [['clock', 0, 1, 1.8], ['chime', 1.5, 0.2]]);

add(6, (lt) => { K.bg('#0d0f16', '#000000');
  at(960, 470, pop(lt, 0.3), () => { T('SOMEDAY', 0, 0, 150, '#ffffff', { spacing: 14 }); const k = easeOut(prog(lt, 1.4, 1.8)); if (k > 0) { c().save(); c().shadowColor = '#ff0000'; c().shadowBlur = 20; line([[-420, 10], [-420 + 840 * k, -10]], '#ff3b3b', 18); c().restore(); } });
  alpha(prog(lt, 2.5, 2.8), () => at(960, 680, pop(lt, 2.5), () => T('DAY ONE.', 0, 0, 120, GREEN, { spacing: 12, glow: GREEN, blur: 40 })));
}, [['slam', 1.4, 0.45], ['boom', 2.5, 0.45]]);

add(10, (lt) => cam(lt, 10, 1.0, 1.05, 960, 540, () => {
  K.bg('#16202f', '#04060a'); c().fillStyle = '#0a0d14'; c().fillRect(0, FLOOR, W, H - FLOOR);
  glow(1260, 500, 380, 'rgba(57,255,20,0.18)');
  at(1260, 500 + Math.sin(lt * 1.6) * 8, pop(lt, 0.6), () => { card(-170, -230, 340, 460, '#0f1a12', 18, GREEN, 6); card(-130, -190, 260, 8, GREEN, 4); T('HOW TO MAKE', 0, -120, 30, '#ffffff', { spacing: 3 }); T('& SELL', 0, -76, 30, '#ffffff', { spacing: 3 }); T('DIGITAL', 0, 0, 52, GREEN, { glow: GREEN, blur: 16 }); T('PRODUCTS', 0, 60, 52, GREEN, { glow: GREEN, blur: 16 }); T('step-by-step guide', 0, 160, 24, '#9aa3b5', { weight: 700, spacing: 2 }); }, Math.sin(lt * 1.2) * 0.03);
  const point = sm(prog(lt, 1.0, 1.6)); M.idle('kai2', 640, FLOOR, 1.15, lt, { armR: [lerp(10, 92, point), lerp(4, -6, point)], expr: 'smile', look: 0.6 });
  caption('What do you know that someone needs?', 130, lt, 1.6, 9.8, '#ffffff', 48, { weight: 800 });
  alpha(prog(lt, 3.6, 4.1), () => T('The step-by-step guide is linked in my bio.', 960, 990, 40, GREEN, { weight: 800, spacing: 1 }));
  vignette(0.4);
}), [['chime', 0.6, 0.2], ['chime', 3.6, 0.2]], { fadeOut: 1.2 });

// timeline
let t = 0; for (const s of S) { s.start = t; t += s.d; }
const duration = t;
function draw(time) {
  const i = Math.max(0, S.findIndex((s) => time < s.start + s.d)); const s = S[i === -1 ? S.length - 1 : i]; const lt = time - s.start;
  K.setTime(lt); TAG = null; s.draw(lt); if (TAG) { c().setTransform(1, 0, 0, 1, 0, 0); drawTag(...TAG); }
  const fi = s.fadeIn ?? 0.18; const fo = s.fadeOut ?? 0;
  const a = Math.max(1 - lt / fi, fo ? prog(lt, s.d - fo, s.d) : 0); if (a > 0) { c().fillStyle = `rgba(0,0,0,${Math.min(1, a)})`; c().fillRect(0, 0, W, H); }
}
module.exports = { S, duration, draw, W, H };
