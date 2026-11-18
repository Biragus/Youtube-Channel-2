// Short 38: EVERY FAIL IS A REP. Kai lifts a barbell labelled FAILURE again and again; each rep he grows stronger.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, counter } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pulse } = require('./lib');
const CUT = 10.4; const FY = 1400; const STRONG = 8.6;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const reps = Math.floor(Math.max(0, t - 0.8) * lerp(0.8, 1.6, prog(t, 0.8, STRONG))); const rep = (t - 0.8) * lerp(0.8, 1.6, prog(t, 0.8, STRONG)) % 1; const s = lerp(0.85, 1.15, prog(t, 0.8, STRONG));
  const lift = t < 0.8 ? 0 : Math.sin(rep * Math.PI); const done = t > STRONG;
  camera({ x: 540, y: 1080, z: lerp(1.1, 1.0, prog(t, 0, STRONG)), shake: done ? impact(t, STRONG, 14) : (lift < 0.05 && t > 1 ? 3 : 0), t }, () => {
    line([[60, FY], [1020, FY]], 'rgba(255,255,255,0.2)', 5); spot(540, FY - 300, 360 * s, done ? 'rgba(57,255,20,0.3)' : 'rgba(255,255,255,0.12)');
    const handY = FY - 376 * s + lerp(120, -150, done ? 1 : lift) * s;
    who(done ? 'kai2' : 'kai', { x: 540, y: FY - hop(t, STRONG + 0.4, 50), s, pose: { lean: 0, tilt: done ? -6 : 6 - lift * 10, drop: (1 - lift) * 20, armL: [lerp(30, 160, done ? 1 : lift), lerp(-110, 10, done ? 1 : lift)], armR: [lerp(30, 160, done ? 1 : lift), lerp(-110, 10, done ? 1 : lift)], legL: [10, 0], legR: [10, 0] }, expr: done ? 'happy' : (lift > 0.5 ? 'determined' : 'worried') });
    line([[540 - 300 * s, handY], [540 + 300 * s, handY]], '#adb5bd', 14);
    for (const sd of [-1, 1]) { card(540 + sd * 260 * s - 30, handY - 90, 60, 180, '#343a40', 10, INK, 4); card(540 + sd * 320 * s - 26, handY - 70, 52, 140, '#495057', 10, INK, 4); }
    label(done ? 'SKILL' : 'FAILURE', 540, handY - 120, 36, done ? GREEN : '#ff8787', { spacing: 4 });
    if (lift > 0.9 && !done) floaters(t, 6, (i, life) => circle(500 + i * 20, FY - 400 * s - life * 60, 8, '#74c0fc'), { every: 0.1, from: 0, life: 0.5 });
  });
  counter('REPS', String(reps), W / 2, 1700, done ? GREEN : '#ffffff', pop(t, 0.8) * pulse(t, 0.8, 0.05), { size: 80, rot: 0 });
  title(done ? 'NOW IT IS STRENGTH.' : 'EVERY FAIL IS A REP.', done ? GREEN : '#ffffff', 300, 72, done ? GREEN : undefined);
});
