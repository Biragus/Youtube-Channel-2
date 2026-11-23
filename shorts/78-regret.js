// GIVING UP ISN'T LIGHTER. Top: he lets the boulder roll back and walks off, but carries it in his head. Bottom: Kai pushes it to the top.
const K = require('../engine/kit'); const M = require('../engine/motion'); const { GREEN, GOLD, lerp, prog, ease, at, line, who, P, thought } = K;
const { W, dark, label, makeShort, halves, rock, pushPose, npc, confetti } = require('./lib');
const CUT = 6.8; const QUIT = 1.6;
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const hx = (k) => lerp(140, 940, k); const hy = (k) => lerp(y0 + 760, y0 + 380, k);
    label(kai ? 'KEEP PUSHING' : 'GIVING UP', W / 2, y0 + (kai ? 90 : 170), 56, kai ? GREEN : '#9aa3b5', { spacing: 6, glow: kai ? GREEN : undefined });
    line([[hx(0), hy(0)], [hx(1), hy(1)]], 'rgba(255,255,255,0.3)', 6); line([[hx(1), hy(1)], [1080, hy(1)]], 'rgba(255,255,255,0.3)', 6);
    if (kai) { const k = Math.min(1, prog(t, 0.3, 5)); rock(hx(k) + 60, hy(k) - 60, 60, 'GOAL', '#2f9e44'); const slope = (xx) => hy(prog(xx, hx(0), hx(1))); const rx = hx(k) + 60; const ry = hy(k) - 60; if (k >= 1) M.celebrate('kai2', hx(1) - 40, hy(1), 0.6, t, 5.0); else M.figure({ spec: 'kai', ...M.onGround(M.gait(0, rx - 110, 0, 0.6, 'walk', { stride: 70, lean: 26 }), slope), handL: [rx - 52, ry - 14], handR: [rx - 56, ry + 16], elbow: -1, expr: 'determined' }); if (k >= 1) confetti(t, 5, hx(1), hy(1) - 300, 300); }
    else { const k = t < QUIT ? prog(t, 0.3, QUIT) * 0.3 : 0.3 * (1 - ease(prog(t, QUIT, QUIT + 1))); rock(hx(k) + 60, hy(k) - 60, 60, 'GOAL', '#868e96');
      const wx = t < QUIT ? hx(Math.max(0, k - 0.06)) : lerp(hx(0.24), 600, prog(t, QUIT + 0.3, 5)); const weight = prog(t, QUIT + 0.5, 5.5);
      const slope2 = (xx) => xx > hx(0) ? hy(prog(xx, hx(0), hx(1))) : hy(0); const rx2 = hx(k) + 60; const ry2 = hy(k) - 60; if (t < QUIT) M.figure({ spec: npc('#868e96'), ...M.onGround(M.gait(0, rx2 - 110, 0, 0.6, 'walk', { stride: 70, lean: 26 }), slope2), handL: [rx2 - 52, ry2 - 14], handR: [rx2 - 56, ry2 + 16], elbow: -1, expr: 'tired' }); else M.figure({ spec: npc('#868e96'), ...M.onGround(M.gait(0, -wx, 0, 0.6, 'walk', { flip: true, stride: 90 }), slope2), tilt: lerp(4, 24, weight), expr: 'sad' });
      if (t > QUIT + 0.5) thought(wx + 120, hy(0.24) - 340, lerp(50, 90, weight), 1, () => rock(0, 0, lerp(26, 48, weight), 'REGRET', '#495057')); }
  });
});
