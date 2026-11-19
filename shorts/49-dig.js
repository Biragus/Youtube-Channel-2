// Short 49: TEN IDEAS vs ONE. One digs ten shallow holes; Kai digs one hole all the way down to the gold. The camera follows him down.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 7.0; const GY = 900; const GOLDY = 2300; const STRIKE = 5.0;
const other = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: '#e8590c' }, pants: '#3b4252', shoes: '#e5e5e5' };
const dig = (t) => ({ lean: 14, tilt: 6, armL: [60 + Math.sin(t * 9) * 25, -40], armR: [60 + Math.sin(t * 9) * 25, -40], legL: [10, 0], legR: [10, 0] });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(700); const depth = lerp(0, GOLDY - GY - 60, ease(prog(t, 0.6, STRIKE))); const hit = t > STRIKE;
  camera({ x: 540, y: lerp(1100, GY + depth - 50, ease(prog(t, 1.8, STRIKE))), z: 1.0, shake: impact(t, STRIKE, 18) + (t > 0.6 && !hit ? 2 : 0), t }, () => {
    c.fillStyle = '#2a2219'; c.fillRect(-200, GY, 1500, 2400); line([[-200, GY], [1300, GY]], '#5a4a36', 6);
    for (let i = 0; i < 40; i++) circle(rnd(i) * 1080, GY + 80 + rnd(i + 5) * 1900, 6 + rnd(i + 2) * 8, 'rgba(255,255,255,0.05)');
    // the gold seam deep down
    spot(540, GOLDY, 500 * (hit ? 1.4 : 1), 'rgba(242,193,78,0.25)'); for (let i = 0; i < 9; i++) at(140 + i * 100, GOLDY + Math.sin(i) * 20, 1, () => { circle(0, 0, 34, GOLD); label('$', 0, 3, 38, '#5c3d00', { spacing: 0 }); });
    // left: ten shallow holes, each abandoned
    const holes = Math.min(10, Math.floor(t * 1.6)); for (let i = 0; i < holes; i++) card(40 + i * 40, GY, 34, 40 + rnd(i) * 30, '#0d0d12', 4);
    who(other, { x: 70 + holes * 40, y: GY, s: 0.55, pose: dig(t), expr: t > 4 ? 'tired' : 'neutral' }); label('10 IDEAS', 230, GY - 280, 30, '#ffa94d', { spacing: 3 });
    // right: one hole, all the way down
    card(640, GY, 140, depth + 30, '#0d0d12', 4); for (let i = 0; i < 10; i++) floaters(t, 1, () => circle(710 + Math.sin(t * 20 + i) * 60, GY + depth - 60 - i * 8, 6, '#5a4a36'), {});
    who(hit ? 'kai2' : 'kai', { x: 710, y: GY + depth + 30 - hop(t, STRIKE + 0.2, 50), s: 0.55, pose: hit ? blend(dig(t), 'cheer', prog(t, STRIKE, STRIKE + 0.3)) : dig(t), expr: hit ? 'happy' : 'determined' });
    label('1 IDEA', 710, GY - 280, 30, GREEN, { spacing: 3 });
    if (hit) floaters(t, 30, (i, life) => circle(710 + Math.cos(i * 2.4) * life * 300, GOLDY - 40 + Math.sin(i * 2.4) * life * 200, 12 * (1 - life), GOLD), { every: 0.02, from: STRIKE, life: 0.7 });
  });
  title(hit ? 'GO DEEP ON ONE.' : 'TEN IDEAS OR ONE?', hit ? GOLD : '#ffffff', 300, 80, hit ? GOLD : undefined);
});
