// VERSION 7. Kai's paper planes nosedive one after another; each fold gets better; version 7 glides across the screen.
const K = require('../engine/kit'); const M = require('../engine/motion'); const { GREEN, GOLD, lerp, prog, ease, pop, at, line, who, rnd } = K;
const { W, dark, label, makeShort, title, camera, hop, pill, ground, confetti } = require('./lib');
const CUT = 6.8; const FY = 1450; const THROW = [0.5, 1.4, 2.3, 3.2, 4.1]; const GOOD = 4.1;
function plane(x, y, rot, col) { at(x, y, 1, () => { const c = K.ctx(); c.fillStyle = col; c.beginPath(); c.moveTo(60, 0); c.lineTo(-50, -26); c.lineTo(-30, 0); c.lineTo(-50, 26); c.closePath(); c.fill(); c.strokeStyle = 'rgba(0,0,0,0.3)'; c.lineWidth = 3; c.beginPath(); c.moveTo(60, 0); c.lineTo(-30, 0); c.stroke(); }, rot); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const v = THROW.filter((a) => t > a).length; const good = t > GOOD;
  camera({ x: good ? lerp(560, 900, prog(t, GOOD, GOOD + 2)) : 560, y: 1100, z: 1.0, t }, () => {
    ground(FY, -600, 2400);
    THROW.forEach((a, i) => { if (t < a) return; const f = prog(t, a, a + (i === 4 ? 2.4 : 0.9)); const last = i === 4;
      const x = 300 + f * (last ? 1400 : 200 + i * 80); const y = FY - 300 - (last ? Math.sin(f * Math.PI) * 200 : -f * f * 280); plane(x, Math.min(FY - 10, y), last ? -0.05 : f * 1.3, last ? '#f1f3f5' : '#adb5bd'); if (!last && f >= 1) label(`V${i + 1}`, x, FY - 40, 26, '#868e96', { spacing: 2 }); });
    const thr = THROW.find((a) => t > a - 0.4 && t < a + 0.2); if (good && t > GOOD + 1.5) M.celebrate('kai2', 240, FY, 0.85, t, GOOD + 1.5); else M.idle('kai', 240, FY, 0.85, t, { armL: thr ? [10, 6] : [40, -110], armR: thr ? [M.lerp(-50, 165, M.smoother((t - (thr - 0.4)) / 0.5)), 10] : [40, -110], lean: thr ? M.keys(t - thr, [[-0.4, -6], [0, 10], [0.2, 0]]) : 0, expr: good ? 'happy' : (v > 2 ? 'determined' : 'neutral') });
    if (good && t > GOOD + 1.5) confetti(t, GOOD + 1.5, 1300, 900);
  });
  K.at(W / 2, 400, 1, () => pill(`VERSION ${Math.max(1, v)}`, 0, 0, 34, good ? GREEN : '#ffffff', { border: good ? GREEN : undefined }));
  title(good ? 'KEEP FOLDING.' : 'IT WON\'T FLY YET.', good ? GREEN : '#ffffff', 300, 74, good ? GREEN : undefined);
});
