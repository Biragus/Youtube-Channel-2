// Short 35: START WITH A STALL. A tiny stall in the dark, one customer, then a queue, and it grows into a shop.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 10.6; const FY = 1450; const SX = 620; const GROW = 7.4;
const cust = (i) => ({ hair: { type: ['short', 'curly', 'bun', 'long', 'pony'][i % 5], color: ['#2b2b33', '#7a4a2a', '#3a2a4a'][i % 3] }, top: { type: 'tee', color: ['#1c7ed6', '#e8590c', '#9c36b5', '#2f9e44', '#e03131', '#f08c00'][i % 6] }, pants: '#3b4252', shoes: '#e5e5e5' });
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const g = ease(prog(t, GROW, GROW + 1)); const queue = Math.floor(lerp(0, 9, prog(t, 2.6, GROW) ** 1.4));
  camera({ x: lerp(560, 520, g), y: lerp(1220, 1080, g), z: lerp(1.35, 0.95, ease(prog(t, 1.5, GROW + 1))), shake: impact(t, GROW, 12), t }, () => {
    card(-400, FY, 2000, 800, '#1b1f2b', 0); line([[-400, FY], [1600, FY]], 'rgba(255,255,255,0.2)', 5);
    for (let i = 0; i < 6; i++) { const lx = -200 + i * 320; line([[lx, FY], [lx, FY - 520]], '#495057', 10); spot(lx, FY - 520, 140, `rgba(255,214,120,${0.25 * prog(t, 2 + i * 0.4, 2.6 + i * 0.4)})`); circle(lx, FY - 520, 16, t > 2 + i * 0.4 ? '#ffd43b' : '#495057'); }
    // the stall, which turns into a shop
    alpha(1 - g, () => { card(SX - 160, FY - 220, 320, 220, '#8a5a3c', 10, INK, 5); for (let i = 0; i < 5; i++) card(SX - 180 + i * 72, FY - 380, 72, 60, i % 2 ? '#e03131' : '#fff3bf', 6); line([[SX - 170, FY - 320], [SX - 170, FY - 220]], INK, 6); line([[SX + 170, FY - 320], [SX + 170, FY - 220]], INK, 6); label('$9', SX, FY - 120, 50, '#fff3bf', { spacing: 2 }); });
    if (g > 0) at(SX, FY, lerp(0.4, 1, easeOut(g)), () => { card(-330, -620, 660, 620, '#2b3142', 12, INK, 6); card(-330, -700, 660, 110, GREEN, 16); label('THE LIVING ROOM PLAN', 0, -645, 36, INK, { spacing: 2 }); card(-280, -500, 240, 220, 'rgba(255,214,120,0.8)', 8); card(40, -500, 240, 220, 'rgba(255,214,120,0.8)', 8); card(-80, -240, 160, 240, '#4a2f1d', 6); spot(0, -300, 500, 'rgba(255,214,120,0.3)'); });
    // Kai behind the stall, waving people over
    const done = t > GROW + 0.6; spot(SX, FY - 330, 180, 'rgba(57,255,20,0.18)');
    if (!g || g < 0.5) who('kai', { x: SX, y: FY - 160, s: 0.75, pose: t < 2.6 ? { lean: 0, tilt: 8, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] } : { lean: 0, tilt: -4, armL: [8, 4], armR: [148 + Math.sin(t * 8) * 14, 24], legL: [5, 0], legR: [5, 0] }, expr: t < 2.6 ? 'neutral' : 'happy' });
    else who('kai2', { x: SX, y: FY - hop(t, GROW + 0.8, 60), s: 0.85, pose: blend('stand', 'cheer', prog(t, GROW + 0.6, GROW + 1)), expr: 'happy' });
    // the queue forms, bobbing as it waits
    for (let i = 0; i < queue; i++) { const qx = SX + 230 + i * 95; at(0, 0, 1, () => who(cust(i), { x: qx, y: FY - Math.abs(Math.sin(t * 3 + i)) * 6, s: 0.7, flip: true, pose: i === queue - 1 && t < GROW ? P.walk(t * 1.6) : 'stand', expr: 'smile' })); }
  });
  title(g > 0 ? 'THEN BUILD THE SHOP.' : 'START WITH A STALL.', g > 0 ? GREEN : '#ffffff', 300, 72, g > 0 ? GREEN : undefined);
});
