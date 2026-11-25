// STRIKE. Pins labelled FEAR, DOUBT, EXCUSES. Kai steps up, swings the ball called ACTION back and rolls it. Strike.
// Seen from the side: the lane runs left to right, so the bowl reads clearly (approach, back swing, low release, follow-through).
const K = require('../engine/kit'); const M = require('../engine/motion'); const A = require('../engine/actions');
const { GREEN, RED, lerp, prog, at, card, line, circle } = K;
const { dark, label, makeShort, title, camera, impact, confetti } = require('./lib');
const CUT = 6.8; const FY = 1300; const T0 = 0.6; const ROLL = T0 + 1.1; const HIT = 3.5; const S = 1.1;
const PINS = [['FEAR', 660], ['DOUBT', 750], ['EXCUSES', 840]];
module.exports = makeShort(CUT, (t) => {
  dark(900); const hit = t > HIT;
  camera({ x: lerp(540, 560, prog(t, ROLL, HIT)), y: 1000, z: lerp(1, 1.04, prog(t, ROLL, HIT)), shake: impact(t, HIT, 18), t }, () => {
    card(0, FY, 1080, 40, '#5c3d24', 0); for (let i = 0; i < 12; i++) line([[i * 96, FY + 6], [i * 96 + 60, FY + 6]], 'rgba(0,0,0,0.25)', 3);
    PINS.forEach(([s, x], i) => { const f = hit ? prog(t, HIT + i * 0.06, HIT + 1.0) : 0;
      at(x + f * (40 + i * 30), FY - f * (700 - i * 120) + f * f * 900, 1, () => { card(-30, -190, 60, 190, '#f1f3f5', 28); card(-30, -140, 60, 14, RED, 0); K.ctx().save(); K.ctx().rotate(-Math.PI / 2); label(s, 70, 2, 20, '#495057', { spacing: 1 }); K.ctx().restore(); }, f * (5 + i * 2) * (i === 0 ? -1 : 1)); });
    let ball = null; const bs = 48;
    if (t < T0) { const r = A.work('kai', 200, FY, S, t, { handR: [260, FY - 175], handL: [250, FY - 185], expr: 'determined' }); ball = [r.handR[0] + 8, r.handR[1] - 10]; }
    else if (!hit && t < ROLL) { const r = A.bowl('kai', 200, FY, S, t, T0); ball = r.ball; }
    else if (!hit) { A.bowl('kai', 200, FY, S, t, T0); const k = prog(t, ROLL, HIT); ball = [lerp(430, 630, k), FY - bs]; }
    else M.celebrate('kai2', 360, FY, S, t, HIT + 0.1);
    if (ball) at(ball[0], ball[1], 1, () => { circle(0, 0, bs, '#2f9e44'); K.ctx().rotate(t > ROLL ? (t - ROLL) * 9 : 0); label('ACTION', 0, 3, 14, '#ffffff', { spacing: 1 }); });
    if (hit) confetti(t, HIT, 760, 900);
  });
  title(hit ? 'STRIKE.' : 'ONE ROLL.', hit ? GREEN : '#ffffff', 300, 90, hit ? GREEN : undefined);
});
