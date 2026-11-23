// COMPOUND. Coins drop into a jar: one, then two, then four... until it overflows.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, card, line, who, floaters, rnd, money } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, ground, coin, confetti } = require('./lib');
const CUT = 6.8; const FY = 1400; const JX = 600; const FULL = 5.0;
const drops = []; { let tt = 0.5; let n = 1; while (tt < FULL + 1) { for (let i = 0; i < n; i++) drops.push(tt + i * 0.04); tt += 0.55; n = Math.min(40, n * 2); } }
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const inJar = drops.filter((d) => t > d + 0.5).length; const level = Math.min(1, inJar / 120); const over = t > FULL;
  camera({ x: 560, y: 1080, z: lerp(1.15, 1, prog(t, 0, FULL)), shake: impact(t, FULL, 12), t }, () => {
    ground(FY);
    card(JX - 150, FY - 420 + 420 * (1 - level), 300, 420 * level, 'rgba(242,193,78,0.7)', 20);
    for (let i = 0; i < Math.min(inJar, 30); i++) coin(JX - 110 + (i % 6) * 44, FY - 30 - Math.floor(i / 6) * 14 - (1 - level) * 0, 18, 0);
    c.strokeStyle = 'rgba(200,220,255,0.7)'; c.lineWidth = 8; c.beginPath(); c.roundRect(JX - 160, FY - 440, 320, 440, 30); c.stroke(); card(JX - 120, FY - 470, 240, 34, '#adb5bd', 8);
    drops.forEach((d, i) => { if (t < d || t > d + 0.5) return; const f = prog(t, d, d + 0.5); coin(JX + (rnd(i) - 0.5) * 200, lerp(500, FY - 420 * level - 20, f * f), 20, t * 9 + i); });
    if (over) floaters(t, 50, (i, life) => coin(JX + (i % 2 ? 1 : -1) * (170 + life * 200), FY - 440 + life * life * 420 - Math.sin(life * 3) * 80, 18, t * 9 + i), { every: 0.03, from: FULL, life: 0.8 });
    who(over ? 'kai2' : 'kai', { x: 230, y: FY - hop(t, FULL + 0.2, 60), s: 0.85, pose: over ? 'cheer' : { lean: 0, tilt: 6, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] }, expr: over ? 'happy' : 'neutral', look: 0.6 });
  });
  K.at(W / 2, 400, 1, () => pill(`${money(inJar * 9)}`, 0, 0, 36, GREEN, { border: GREEN }));
  title('IT COMPOUNDS.', over ? GREEN : '#ffffff', 300, 76, over ? GREEN : undefined);
});
