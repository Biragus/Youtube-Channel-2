// THE CROWDED ROAD. Everyone queues on the main road to SUCCESS and goes nowhere. Kai takes the empty side path and gets there first.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, hop, npc, confetti, spot } = require('./lib');
const CUT = 6.8; const DONE = 5.2;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const k = prog(t, 0.6, DONE); const done = t > DONE;
  const path = (u) => [lerp(780, 540, u) + Math.sin(u * Math.PI) * 220, lerp(1500, 600, u)];
  camera({ x: 540, y: 1050, z: 1.0, t }, () => {
    card(380, 560, 200, 1000, '#262b3a', 0); label('MAIN ROAD', 480, 1520, 26, '#868e96', { spacing: 3 });
    c.strokeStyle = '#2b3a2b'; c.lineWidth = 60; c.lineCap = 'round'; c.beginPath(); for (let u = 0; u <= 1; u += 0.05) { const [x, y] = path(u); u ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    spot(480, 560, 200, 'rgba(242,193,78,0.35)'); label('SUCCESS', 480, 540, 44, GOLD, { spacing: 6, glow: GOLD });
    for (let i = 0; i < 9; i++) M.idle(npc(['#1c7ed6', '#e8590c', '#9c36b5', '#868e96'][i % 4], ['short', 'curly', 'bun'][i % 3]), 450 + (i % 2) * 60, 1450 - i * 90, 0.38, t + i, { expr: 'tired' });
    const [kx, ky] = path(k); if (done) M.celebrate('kai2', 560, 640, 0.42, t, DONE + 0.05); else M.march('kai', kx, ky, 0.42, t * 120, { expr: 'determined' });
    if (done) confetti(t, DONE, 520, 300, 300);
  });
  title(done ? 'TAKE YOUR OWN PATH.' : 'EVERYONE TAKES THE SAME ROAD.', done ? GREEN : '#ffffff', 300, done ? 66 : 50, done ? GREEN : undefined);
});
