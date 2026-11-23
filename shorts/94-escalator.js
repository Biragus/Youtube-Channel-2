// STANDING STILL IS GOING BACKWARD. Both stand on a down escalator. One stands still and sinks; Kai walks up and reaches the top.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, card, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, blend, hop, pill, npc, confetti } = require('./lib');
const CUT = 6.8; const A = [180, 1480]; const B = [900, 720]; const DONE = 5.2;
const onSlope = (k) => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)];
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const kk = Math.min(1, lerp(0.15, 1, prog(t, 0.4, DONE))); const ok = Math.max(0, 0.45 - prog(t, 0.4, 5) * 0.45); const done = t > DONE;
  camera({ x: 540, y: 1100, z: 1.0, t }, () => {
    c.fillStyle = '#20253a'; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.lineTo(B[0], B[1] + 60); c.lineTo(A[0], A[1] + 60); c.closePath(); c.fill();
    for (let i = 0; i < 14; i++) { const k = ((i / 14) + t * 0.12) % 1; const [x, y] = onSlope(1 - k); line([[x - 20, y], [x + 30, y]], 'rgba(255,255,255,0.25)', 4); }
    K.line([[A[0] - 200, A[1]], [A[0], A[1]]], 'rgba(255,255,255,0.2)', 4); K.line([[B[0], B[1]], [1200, B[1]]], GOLD, 6); label('THE TOP', 980, B[1] - 60, 34, GOLD, { spacing: 4 });
    label('DOWN', 360, 1440, 30, '#ff8787', { spacing: 6 }); for (let i = 0; i < 3; i++) at(470 + i * 40, 1440, 1, () => { line([[0, -14], [0, 14]], '#ff8787', 5); line([[-10, 4], [0, 14], [10, 4]], '#ff8787', 5); });
    const [ox, oy] = onSlope(ok); M.idle(npc('#868e96'), ox, oy, 0.6, t, { armR: [22, -132], tilt: 10, expr: 'neutral', prop: 'phone' });
    const [kx, ky] = onSlope(kk); const sl = (B[1] - A[1]) / (B[0] - A[0]); if (done) M.celebrate('kai2', B[0] + 60, B[1], 0.6, t, DONE + 0.05); else { const p = M.gait(0, kx, ky, 0.6, 'walk', { lean: 6 }); M.figure({ spec: 'kai', ...M.onGround(p, (x) => ky + (x - kx) * sl), expr: 'determined' }); }
    if (done) confetti(t, DONE, B[0] + 60, B[1] - 400, 300);
  });
  title('STANDING STILL', '#ffffff', 280, 72); title('IS GOING BACKWARD.', done ? GREEN : GOLD, 370, 64, done ? GREEN : GOLD);
});
