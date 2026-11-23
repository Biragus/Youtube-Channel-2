// WHAT PEOPLE SEE / WHAT THEY DON'T. Top: hoodie Kai deadlifts, shaking, plates added month by month. Bottom: suit Kai presses the full bar overhead, easy.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, at, card, line, floaters } = K;
const M = require('../engine/motion');
const { W, dark, label, makeShort, halves, pill } = require('./lib');
const CUT = 6.8; const S = 0.95;
function bar(x, y, plates, shake = 0) { const c = K.ctx(); c.save(); c.translate(0, Math.sin(K.ctx() && Date.now) * 0); line([[x - 300, y + shake], [x + 300, y - shake]], '#adb5bd', 12); for (let i = 0; i < plates; i++) for (const s of [-1, 1]) card(x + s * (200 + i * 24) - 10, y - 70 + i * 4 - s * shake, 20, 140 - i * 8, i % 2 ? '#495057' : '#343a40', 4, INK, 3); c.restore(); }
// a deadlift: hips hinge down, hands on the bar, then stand up with it. k = 0 (bar on floor) .. 1 (standing)
function lift(x, fy, k, t, spec, plates, shake, expr) {
  const barY = lerp(fy - 70, fy - 70 - 150 * S, M.smooth(k)) + Math.sin(t * 40) * shake;
  const hipY = lerp(fy - 95 * S, fy - 150 * S, M.smooth(k));
  bar(x, barY, plates, Math.sin(t * 40) * shake);
  M.figure({ spec, hip: [x, hipY], ground: fy, s: S, footL: [x - 30 * S, fy], footR: [x + 30 * S, fy], lean: lerp(38, 0, M.smooth(k)), tilt: lerp(-12, 0, k), handL: [x - 60 * S, barY], handR: [x + 60 * S, barY], elbow: -1, expr });
}
module.exports = makeShort(CUT, (t) => {
  dark(960); const month = Math.min(12, Math.floor(prog(t, 0.3, 5.6) * 12) + 1);
  halves(t, CUT, (y0) => { const top = y0 === 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(top ? "WHAT THEY DON'T SEE" : 'WHAT PEOPLE SEE', W / 2, y0 + (top ? 170 : 90), 52, top ? '#9aa3b5' : GOLD, { spacing: 6, glow: top ? undefined : GOLD });
    if (top) { const cyc = (t % 1.7) / 1.7; const k = cyc < 0.6 ? M.smooth(cyc / 0.6) * 0.85 : 0.85 * (1 - M.smooth((cyc - 0.6) / 0.4)); const plates = Math.min(6, Math.floor(prog(t, 0.3, 5.6) * 6) + 1);
      lift(540, fy, k, t, 'kai', plates, k > 0.5 ? 2.5 : 0, k > 0.4 ? 'determined' : 'tired'); floaters(t, 8, (i, life) => K.circle(520 + (i % 3) * 30, fy - 370 - life * 50, 6, '#74c0fc'), { every: 0.3, from: 0, life: 0.5 }); at(860, y0 + 330, 1, () => pill(`MONTH ${month}`, 0, 0, 26, '#ffffff')); }
    else { const cyc = (t % 2.2) / 2.2; const press = cyc < 0.5 ? M.smooth(cyc / 0.5) : 1 - M.smooth((cyc - 0.5) / 0.5); const barY = lerp(fy - 270 * S, fy - 470 * S, press);
      bar(540, barY, 6); M.figure({ spec: 'kai2', hip: [540, fy - 150 * S], ground: fy, s: S, footL: [510, fy], footR: [570, fy], handL: [540 - 70 * S, barY + 10], handR: [540 + 70 * S, barY + 10], elbow: -1, expr: 'smug', tilt: -4 }); floaters(t, 10, (i, life) => K.circle(200 + K.rnd(i) * 680, fy - 500 + life * 200, 5, GOLD), { every: 0.2, from: 0, life: 1 }); }
  });
});
