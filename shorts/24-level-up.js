// Short 24: LEVEL UP. A side-scrolling run: Kai collects IDEA, PRODUCT, FIRST SALE and 100 SALES, levelling up each time.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 10.6; const FY = 1350; const SPEED = 330;
const ITEMS = [['IDEA', 1.6, 100], ['PRODUCT', 3.6, 300], ['FIRST SALE', 5.6, 500], ['100 SALES', 7.6, 900]];
const kx = (t) => 300 + t * SPEED;

module.exports = makeShort(CUT, (t) => {
  dark(800); const c = K.ctx(); const got = ITEMS.filter(([, a]) => t > a).length; const lvl = 1 + got; const lastUp = got ? ITEMS[got - 1][1] : -9;
  const xpNeed = 1000; const xp = ITEMS.filter(([, a]) => t > a).reduce((s, [, , v]) => s + v, 0); const x = kx(t);
  camera({ x: x + 220, y: 1080, z: 1.0 + 0.08 * Math.max(0, 1 - (t - lastUp) * 2), shake: impact(t, lastUp, 8), t }, () => {
    // ground blocks and floating platforms, scrolling past
    for (let i = -2; i < 40; i++) { const bx = i * 120; card(bx, FY, 116, 116, i % 2 ? '#2b3142' : '#262b3a', 6); }
    for (let i = 0; i < 12; i++) { const bx = 700 + i * 380; card(bx, FY - 420 - (i % 3) * 90, 220, 40, '#3a4158', 8); }
    // the items: hover, then burst when collected
    ITEMS.forEach(([s, a, v], i) => { const ix = kx(a) + 40; const got1 = t > a; if (got1 && t > a + 0.6) return;
      at(ix, FY - 230 + Math.sin(t * 4 + i) * 12 - (got1 ? (t - a) * 200 : 0), got1 ? 1 + (t - a) * 2 : 1, () => alpha(got1 ? 1 - (t - a) / 0.6 : 1, () => { spot(0, 0, 110, 'rgba(242,193,78,0.35)'); const w = K.textWidth(s, 30, false, 2) + 50; card(-w / 2, -32, w, 64, '#2a2414', 14, GOLD, 4); label(s, 0, 2, 30, GOLD, { spacing: 2 }); }));
      if (got1 && t < a + 1.0) label(`+${v} XP`, ix, FY - 330 - (t - a) * 120, 40, GREEN, { spacing: 2, glow: GREEN }); });
    // Kai runs, jumping for each item
    const jump = ITEMS.reduce((s, [, a]) => s + hop(t, a - 0.35, 170, 0.7), 0); spot(x, FY - 200 - jump, 220, 'rgba(57,255,20,0.18)');
    who(lvl >= 5 ? 'kai2' : 'kai', { x, y: FY - jump, s: 0.85, pose: t > 9.4 ? blend(P.walk(t * 2.4), 'cheer', prog(t, 9.4, 9.7)) : P.walk(t * 2.4), expr: 'happy' });
  });
  // the game HUD
  K.at(W / 2, 430, 1, () => { card(-420, -60, 840, 120, '#0d1018', 30, 'rgba(255,255,255,0.35)', 3); label(`LVL ${lvl}`, -320, 2, 48, GOLD, { spacing: 3 }); card(-220, -18, 600, 36, '#1b1f2b', 18); card(-220, -18, 600 * Math.min(1, lerp(0, xp / xpNeed, 1)), 36, GREEN, 18); });
  if (t - lastUp < 1.0 && got) K.at(W / 2, 640, pop(t, lastUp), () => label('LEVEL UP!', 0, 0, 110, GOLD, { spacing: 6, glow: GOLD }));
  title('LEVEL UP.', '#ffffff', 300, 90);
});
