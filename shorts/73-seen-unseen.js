// WHAT PEOPLE SEE / WHAT THEY DON'T. Bottom: suit Kai lifts a heavy bar easily. Top: hoodie Kai, plates added one by one over months.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, who, floaters } = K;
const { W, dark, label, makeShort, halves, pill } = require('./lib');
const CUT = 6.8;
function bar(x, y, plates) { line([[x - 300, y], [x + 300, y]], '#adb5bd', 12); for (let i = 0; i < plates; i++) for (const s of [-1, 1]) card(x + s * (200 + i * 24) - 10, y - 70 + i * 4, 20, 140 - i * 8, i % 2 ? '#495057' : '#343a40', 4, INK, 3); }
module.exports = makeShort(CUT, (t) => {
  dark(960); const months = Math.min(12, Math.floor(prog(t, 0.4, 5.5) * 12) + 1);
  halves(t, CUT, (y0) => { const top = y0 === 0; const fy = y0 + 760; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(top ? "WHAT THEY DON'T SEE" : 'WHAT PEOPLE SEE', W / 2, y0 + (top ? 170 : 90), 52, top ? '#9aa3b5' : GOLD, { spacing: 6, glow: top ? undefined : GOLD });
    if (top) { const plates = Math.min(6, Math.floor(prog(t, 0.4, 5.5) * 6) + 1); const lift = Math.max(0, Math.sin(t * 3)) * 0.4; const hy = fy - 0.85 * 376 + lerp(80, -60, lift) * 0.85;
      who('kai', { x: 540, y: fy, s: 0.85, pose: { lean: 0, tilt: 8, drop: 20, armL: [lerp(30, 120, lift), -90], armR: [lerp(30, 120, lift), -90], legL: [16, -30], legR: [16, -30] }, expr: 'determined' }); bar(540, hy, plates);
      floaters(t, 8, (i, life) => K.circle(500 + i % 3 * 40, fy - 360 - life * 50, 6, '#74c0fc'), { every: 0.3, from: 0, life: 0.5 }); at(860, y0 + 320, 1, () => pill(`MONTH ${months}`, 0, 0, 26, '#ffffff')); }
    else { const hy = fy - 0.85 * 376 - 150 * 0.85; who('kai2', { x: 540, y: fy, s: 0.85, pose: { lean: 0, tilt: -4, armL: [160, 10], armR: [160, 10], legL: [10, 0], legR: [10, 0] }, expr: 'smug' }); bar(540, hy, 6); floaters(t, 10, (i, life) => K.circle(200 + K.rnd(i) * 680, fy - 500 + life * 200, 5, GOLD), { every: 0.2, from: 0, life: 1 }); }
  });
});
