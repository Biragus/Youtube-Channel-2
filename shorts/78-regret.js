// GIVING UP ISN'T LIGHTER. Top: he lets the boulder roll back and walks off, but carries it in his head. Bottom: Kai pushes it to the top.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, at, line, who, P, thought } = K;
const { W, dark, label, makeShort, halves, rock, pushPose, npc, confetti } = require('./lib');
const CUT = 6.8; const QUIT = 1.6;
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const hx = (k) => lerp(140, 940, k); const hy = (k) => lerp(y0 + 760, y0 + 380, k);
    label(kai ? 'KEEP PUSHING' : 'GIVING UP', W / 2, y0 + (kai ? 90 : 170), 56, kai ? GREEN : '#9aa3b5', { spacing: 6, glow: kai ? GREEN : undefined });
    line([[hx(0), hy(0)], [hx(1), hy(1)]], 'rgba(255,255,255,0.3)', 6); line([[hx(1), hy(1)], [1080, hy(1)]], 'rgba(255,255,255,0.3)', 6);
    if (kai) { const k = Math.min(1, prog(t, 0.3, 5)); rock(hx(k) + 60, hy(k) - 60, 60, 'GOAL', '#2f9e44'); who(k >= 1 ? 'kai2' : 'kai', { x: hx(Math.max(0, k - 0.06)), y: hy(Math.max(0, k - 0.06)), s: 0.6, pose: k >= 1 ? 'cheer' : pushPose(t), expr: k >= 1 ? 'happy' : 'determined' }); if (k >= 1) confetti(t, 5, hx(1), hy(1) - 300, 300); }
    else { const k = t < QUIT ? prog(t, 0.3, QUIT) * 0.3 : 0.3 * (1 - ease(prog(t, QUIT, QUIT + 1))); rock(hx(k) + 60, hy(k) - 60, 60, 'GOAL', '#868e96');
      const wx = t < QUIT ? hx(Math.max(0, k - 0.06)) : lerp(hx(0.24), 600, prog(t, QUIT + 0.3, 5)); const weight = prog(t, QUIT + 0.5, 5.5);
      who(npc('#868e96'), { x: wx, y: t < QUIT ? hy(Math.max(0, k - 0.06)) : hy(0.24) + (wx - hx(0.24)) * 0, s: 0.6, pose: t < QUIT ? pushPose(t) : { ...P.walk(t * 1.2), tilt: lerp(4, 22, weight), drop: weight * 30 }, expr: t < QUIT ? 'tired' : 'sad' });
      if (t > QUIT + 0.5) thought(wx + 120, hy(0.24) - 340, lerp(50, 90, weight), 1, () => rock(0, 0, lerp(26, 48, weight), 'REGRET', '#495057')); }
  });
});
