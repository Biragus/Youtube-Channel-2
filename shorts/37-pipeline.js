// Short 37: BUCKETS vs A PIPELINE. One carries water bucket by bucket forever; Kai builds a pipe once, then it flows.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, counter } = K;
const { W, dark, spot, label, makeShort, halves, blend, hop, pulse } = require('./lib');
const CUT = 10.4; const BUILT = 5.0;
const carrier = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: '#5c6f8a' }, pants: '#3b4252', shoes: '#e5e5e5' };
const tank = (x, fy, level) => { card(x - 90, fy - 220, 180, 220, '#2b3142', 10, '#adb5bd', 5); card(x - 82, fy - 8 - 200 * level, 164, 200 * level, '#1c7ed6', 6); label('$', x, fy - 110, 60, 'rgba(255,255,255,0.5)', { spacing: 0 }); };
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 780; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'A PIPELINE' : 'BUCKETS', W / 2, y0 + (kai ? 90 : 170), 64, kai ? GREEN : '#ffffff', { spacing: 10, glow: kai ? GREEN : undefined });
    card(80, fy - 160, 140, 160, '#1c7ed6', 10, '#74c0fc', 4); label('WORK', 150, fy - 190, 26, '#74c0fc', { spacing: 2 });
    if (!kai) { const ph = (t * 0.45) % 1; const x = ph < 0.5 ? lerp(260, 760, ph * 2) : lerp(760, 260, (ph - 0.5) * 2); tank(880, fy, Math.min(0.35, t * 0.03));
      who(carrier, { x, y: fy, s: 0.8, flip: ph >= 0.5, pose: { ...P.walk(t * 2.2), armR: [40, -10] }, expr: t > 5 ? 'tired' : 'neutral' }); if (ph < 0.5) card(x + 40, fy - 170, 50, 50, '#1c7ed6', 6, '#adb5bd', 3);
    } else { const built = t > BUILT; const segs = Math.min(5, Math.floor(prog(t, 0.6, BUILT) * 6));
      for (let i = 0; i < segs; i++) card(220 + i * 110, fy - 110, 110, 40, '#868e96', 6, INK, 3);
      if (built) { for (let i = 0; i < 6; i++) { const k = ((t * 1.5 + i / 6) % 1); circle(240 + k * 540, fy - 90, 12, '#74c0fc'); } }
      tank(880, fy, built ? Math.min(1, (t - BUILT) * 0.2 + 0.05) : 0);
      const kx = built ? 420 : 240 + segs * 110; who(built && t > BUILT + 2 ? 'kai2' : 'kai', { x: kx, y: fy - 130 - hop(t, BUILT + 2, 40), s: 0.7, pose: built ? blend({ lean: 0, tilt: 6, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] }, 'cheer', prog(t, BUILT + 1.8, BUILT + 2.2)) : { lean: 0, tilt: 4, armL: [8, 4], armR: [90 + Math.sin(t * 12) * 20, -40 + Math.sin(t * 12) * 30], legL: [6, 0], legR: [6, 0] }, expr: built ? 'happy' : 'determined' }); }
  });
  require('./lib').pill('BUILD IT ONCE.', W / 2, 960, 32);
});
