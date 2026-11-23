// STRIKE. Pins labelled FEAR, DOUBT, EXCUSES stand in a triangle. Kai rolls one ball called ACTION. Strike.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, card, line, circle, who, rnd } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, confetti } = require('./lib');
const CUT = 6.8; const ROLL = 1.6; const HIT = 3.4;
const PINS = ['FEAR', 'DOUBT', 'EXCUSES', 'LATER', 'WHAT IF', 'NO TIME'];
const PPOS = [[540, 620], [480, 560], [600, 560], [420, 500], [540, 500], [660, 500]];
module.exports = makeShort(CUT, (t) => {
  dark(900); const k = prog(t, ROLL, HIT); const bx = 540 + Math.sin(k * 3) * 30 * (1 - k); const by = lerp(1300, 620, k); const hit = t > HIT;
  camera({ x: 540, y: lerp(1050, 900, prog(t, ROLL, HIT)), z: lerp(1, 1.08, prog(t, ROLL, HIT)), shake: impact(t, HIT, 20), t }, () => {
    card(300, 380, 480, 1200, '#3a2a1f', 0); for (let i = 0; i < 6; i++) line([[320 + i * 88, 400], [320 + i * 88, 1560]], 'rgba(0,0,0,0.25)', 3);
    PINS.forEach((s, i) => { const [x, y] = PPOS[i]; const f = hit ? prog(t, HIT + i * 0.04, HIT + 0.9) : 0; const dir = x < 540 ? -1 : (x > 540 ? 1 : (i % 2 ? 1 : -1));
      at(x + dir * f * 500, y - f * 300 + f * f * 400, 1, () => { card(-26, -70, 52, 100, '#f1f3f5', 24); card(-26, -40, 52, 10, RED, 0); label(s, 0, 50, 18, '#ffffff', { spacing: 1 }); }, f * dir * 6); });
    if (t > ROLL - 0.2 && !hit) at(bx, by, 1, () => { circle(0, 0, 46, '#2f9e44'); label('ACTION', 0, 4, 18, '#ffffff', { spacing: 1 }); });
    who(hit ? 'kai2' : 'kai', { x: 540, y: 1480 - hop(t, HIT + 0.2, 50), s: 0.85, pose: t < ROLL ? { lean: 20, tilt: 10, armL: [8, 4], armR: [lerp(-30, 60, prog(t, ROLL - 0.5, ROLL)), 0], legL: [30, -40], legR: [-10, 0] } : (hit ? 'cheer' : 'stand'), expr: hit ? 'happy' : 'determined' });
    if (hit) confetti(t, HIT, 540, 400);
  });
  title(hit ? 'STRIKE.' : 'ONE ROLL.', hit ? GREEN : '#ffffff', 300, 90, hit ? GREEN : undefined);
});
