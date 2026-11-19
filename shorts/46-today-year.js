// Short 46: TODAY, IN A MONTH, IN A YEAR. Kai pushes his product: a heavy block today, a rounder one in a month, a rolling ball in a year.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 6.6; const ROWS = [['TODAY', 0.15, 20], ['IN A MONTH', 0.5, 120], ['IN A YEAR', 1, 320]];
const push = (t, eff) => ({ lean: lerp(30, 12, eff), tilt: 0, armL: [80, -10], armR: [80, -10], legL: [-14 + Math.sin(t * 8 * (0.4 + eff)) * 14, 0], legR: [24 - Math.sin(t * 8 * (0.4 + eff)) * 14, -20] });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900);
  ROWS.forEach(([name, ease1, speed], i) => { const y0 = 520 + i * 430; const fy = y0 + 300; const appear = pop(t, 0.2 + i * 0.5); if (appear <= 0) return;
    label(name, 1000, y0 + 30, 44, i === 2 ? GREEN : '#ffffff', { align: 'right', spacing: 6, glow: i === 2 ? GREEN : undefined });
    const travel = (t * speed) % 1400; const x = 160 + (i === 0 ? Math.min(travel, 260) + Math.sin(t * 3) * 6 : travel % 700);
    line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.18)', 4); for (let k = 0; k < 8; k++) circle(((k * 160 - t * speed) % 1120 + 1120) % 1120, fy + 30, 4, 'rgba(255,255,255,0.15)');
    // the product: square, then bevelled, then a ball that rolls
    const bx = 330; const r = 110; at(bx, fy - r, 1, () => { if (i === 2) c.rotate(t * speed / r); else c.rotate(Math.sin(t * (i ? 6 : 3)) * (i ? 0.06 : 0.04)); card(-r, -r, 2 * r, 2 * r, i === 2 ? '#2f9e44' : (i ? '#868e96' : '#5c6f8a'), lerp(4, r, ease1), INK, 6); label('PRODUCT', 0, 4, 30, '#ffffff', { spacing: 2 }); });
    who(i === 2 ? 'kai2' : 'kai', { x: bx - r - 70, y: fy, s: 0.7, pose: i === 2 ? P.walk(t * 2.4) : push(t, ease1), expr: ['worried', 'determined', 'happy'][i], still: i === 0 });
    if (i === 0) floaters(t, 8, (k, life) => circle(bx - r - 40, fy - 270 - life * 40, 6, '#74c0fc'), { every: 0.4, from: 0.5, life: 0.5 });
    if (i === 2) floaters(t, 20, (k, life) => label('+$9', 520 + (k % 3) * 120, fy - 120 - life * 140, 36, GREEN, { glow: GREEN }), { every: 0.2, from: 1.5, life: 1.0 });
  });
  title('IT GETS EASIER.', '#ffffff', 300, 84);
});
