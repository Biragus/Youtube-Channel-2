// Short 35: JUST THE NEXT STEP. Kai walks into thick fog; each step lights the next stone. Then the fog lifts on the goal.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, H, dark, spot, label, makeShort, title, camera, blend, hop, pill } = require('./lib');
const CUT = 10.6; const N = 14; const LIFT = 8.6;
const stone = (i) => [260 + i * 150 + Math.sin(i * 0.9) * 40, 1450 - i * 62];          // a winding path, rising to the right
const stepAt = (i) => 0.9 + i * 0.52;                                                     // when Kai reaches stone i
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const n = Math.min(N - 1, Math.max(0, Math.floor((t - 0.9) / 0.52))); const k = Math.min(1, Math.max(0, ((t - 0.9) / 0.52) - n));
  const [x0, y0] = stone(n); const [x1, y1] = stone(Math.min(N - 1, n + 1)); const kx = t < 0.9 ? stone(0)[0] : lerp(x0, x1, ease(k)); const ky = (t < 0.9 ? stone(0)[1] : lerp(y0, y1, ease(k))) - Math.sin(k * Math.PI) * 30;
  const lift = ease(prog(t, LIFT, LIFT + 1.2)); const done = t > LIFT + 0.4;
  camera({ x: lerp(kx + 120, 1260, lift), y: lerp(ky - 200, 960, lift), z: lerp(1.15, 0.45, lift), t }, () => {
    // the goal, far away, hidden until the fog lifts
    const [gx, gy] = stone(N - 1); at(gx - 60, gy - 470, 1, () => { spot(0, 0, 360, `rgba(242,193,78,${0.15 + 0.35 * lift})`); pill('YOUR GOAL', 0, 0, 64, GOLD, { fill: '#2a2414', border: GOLD }); });
    // the stones: only the ones Kai has reached, plus the next one, are lit
    for (let i = 0; i < N; i++) { const [sx, sy] = stone(i); const lit = i <= n + 1 ? easeOut(prog(t, stepAt(i) - 0.6, stepAt(i) - 0.2)) : 0; const a = Math.max(lit, lift);
      if (a <= 0) continue; alpha(a, () => { spot(sx, sy, 110, 'rgba(57,255,20,0.25)'); c.fillStyle = '#4a5068'; c.beginPath(); c.ellipse(sx, sy, 70, 22, 0, 0, Math.PI * 2); c.fill(); c.strokeStyle = GREEN; c.lineWidth = 4; c.stroke(); }); }
    // Kai, carrying a small lantern
    spot(kx + 50, ky - 220, 150, 'rgba(255,214,120,0.35)');
    who(done ? 'kai2' : 'kai', { x: kx, y: ky - hop(t, LIFT + 0.6, 50), s: 0.75, pose: done ? blend(P.walk(t), 'cheer', prog(t, LIFT + 0.4, LIFT + 0.8)) : (t < 0.9 ? { lean: 0, tilt: 0, armL: [8, 4], armR: [60, -60], legL: [6, 0], legR: [6, 0] } : { ...P.walk(t * 1.9), armR: [60, -60] }), expr: done ? 'happy' : 'determined' });
    if (!done) at(kx + 60, ky - 250, 1, () => { line([[0, -30], [0, -10]], '#adb5bd', 4); card(-14, -10, 28, 36, '#ffd43b', 6, '#495057', 3); });
  });
  // the fog: everything outside a small circle around Kai, until it lifts
  if (lift < 1) { const fx = W / 2 - 120 * (1 - lift); const fy = 1150; const g = c.createRadialGradient(fx, fy, 160, fx, fy, lerp(520, 2400, lift)); g.addColorStop(0, 'rgba(18,20,30,0)'); g.addColorStop(1, `rgba(18,20,30,${0.97 * (1 - lift)})`); c.fillStyle = g; c.fillRect(0, 0, W, H); }
  title(done ? 'THE PATH APPEARS AS YOU WALK.' : "YOU DON'T NEED THE WHOLE PATH.", done ? GREEN : '#ffffff', 300, 50, done ? GREEN : undefined);
  if (!done && t > 2) title('JUST THE NEXT STEP.', GOLD, 380, 62, GOLD);
});
