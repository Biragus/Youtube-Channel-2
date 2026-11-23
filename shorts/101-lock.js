// THE COMBINATION. A safe with three dials: SKILL, PROBLEM, OFFER. Kai turns each until it clicks; the door opens on gold.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, ground, coin, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const CLICK = [1.6, 2.8, 4.0]; const OPEN = 4.6; const D = ['SKILL', 'PROBLEM', 'OFFER'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const o = ease(prog(t, OPEN, OPEN + 0.7)); const c = K.ctx();
  camera({ x: 600, y: 1100, z: lerp(1.1, 1.0, o), shake: CLICK.reduce((s, a) => s + impact(t, a, 5, 0.2), 0) + impact(t, OPEN, 10), t }, () => {
    ground(FY); card(420, FY - 640, 560, 640, '#343a40', 20, INK, 6);
    if (o > 0) { spot(700, FY - 320, 360 * o, 'rgba(242,193,78,0.5)'); for (let i = 0; i < 9; i++) coin(560 + (i % 3) * 90, FY - 180 - Math.floor(i / 3) * 70, 30, t * 2 + i); }
    at(420, FY - 640, 1, () => { c.scale(1 - o * 0.9, 1); card(0, 0, 560, 640, '#495057', 20, INK, 6);
      D.forEach((s, i) => { const y = 140 + i * 180; const locked = t > CLICK[i]; const ang = locked ? 0 : t * (4 + i) ; circle(280, y, 62, '#212529'); circle(280, y, 56, locked ? '#2f9e44' : '#868e96'); line([[280, y], [280 + Math.sin(ang) * 46, y - Math.cos(ang) * 46]], INK, 8); label(s, 280, y + 92, 26, locked ? GREEN : '#ced4da', { spacing: 3 }); }); });
    const dial = CLICK.findIndex((a) => t < a); who(o > 0.5 ? 'kai2' : 'kai', { x: 260, y: FY - hop(t, OPEN + 0.3, 50), s: 0.85, pose: o > 0.5 ? 'cheer' : { lean: 6, tilt: 4, armL: [8, 4], armR: [86, -10 + Math.sin(t * 14) * 10], legL: [6, 0], legR: [6, 0] }, expr: o > 0.5 ? 'happy' : 'determined' });
  });
  title(o > 0.5 ? 'IT CLICKED.' : 'FIND THE COMBINATION.', o > 0.5 ? GREEN : '#ffffff', 300, 70, o > 0.5 ? GREEN : undefined);
});
