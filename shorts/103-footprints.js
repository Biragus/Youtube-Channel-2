// FEWER FOOTPRINTS. Many tracks start across the sand; one by one they stop. One line of footprints reaches the flag: Kai's.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, line, circle, who, P, rnd } = K;
const { W, dark, label, makeShort, title, camera, hop, pill, confetti, spot } = require('./lib');
const CUT = 6.8; const N = 8; const KAI = 5; const TOPY = 760; const BOTY = 1480;
const stopAt = (i) => (i === KAI ? 1 : 0.15 + rnd(i * 3) * 0.6);
module.exports = makeShort(CUT, (t) => {
  dark(800); const c = K.ctx(); c.fillStyle = '#3a3324'; c.fillRect(0, 380, W, 1200); const k = prog(t, 0.3, 5.4); const done = t > 5.4;
  camera({ x: 540, y: 1000, z: 1.0, t }, () => {
    line([[540, TOPY - 60], [540, TOPY - 200]], '#dee2e6', 6); c.fillStyle = GOLD; c.beginPath(); c.moveTo(540, TOPY - 200); c.lineTo(620, TOPY - 175); c.lineTo(540, TOPY - 150); c.fill();
    for (let i = 0; i < N; i++) { const x0 = 100 + i * 125; const lim = Math.min(k, stopAt(i)); const steps = Math.floor(lim * 22);
      for (let s = 0; s < steps; s++) { const f = s / 22; const x = lerp(x0, 540, f * f) + (s % 2 ? 10 : -10); const y = lerp(BOTY, TOPY, f); c.fillStyle = i === KAI ? 'rgba(57,255,20,0.7)' : 'rgba(0,0,0,0.45)'; c.beginPath(); c.ellipse(x, y, 9, 14, 0, 0, Math.PI * 2); c.fill(); } }
    const f = Math.min(1, k); const kx = lerp(100 + KAI * 125, 540, f * f); const ky = lerp(BOTY, TOPY, f); spot(kx, ky - 120, 150, 'rgba(57,255,20,0.2)');
    who(done ? 'kai2' : 'kai', { x: done ? 540 : kx, y: (done ? TOPY - 40 : ky) - (done ? hop(t, 5.5, 30) : 0), s: 0.42, pose: done ? 'cheer' : P.walk(t * 2), expr: done ? 'happy' : 'determined' });
    if (done) confetti(t, 5.4, 540, TOPY - 450, 300);
  });
  title(done ? 'KEEP WALKING.' : 'MANY START.', done ? GREEN : '#ffffff', 300, 80, done ? GREEN : undefined); if (t > 2.4 && !done) title('FEW FINISH.', GOLD, 390, 64, GOLD);
});
