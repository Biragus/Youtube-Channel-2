// ONE SMALL GEAR. Kai turns a tiny gear labelled DAY 1; it turns a bigger one, then a bigger one, until the whole machine lights up.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, line, circle, who } = K; const M = require('../engine/motion'); const A = require('../engine/actions');
const { W, dark, label, makeShort, title, camera, impact, hop, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const G = [[300, 1330, 60, 'DAY 1'], [450, 1210, 110, 'HABIT'], [680, 1030, 170, 'SKILL'], [520, 750, 130, 'INCOME']];
function gear(x, y, r, ang, col, name) { const c = K.ctx(); at(x, y, 1, () => { c.fillStyle = col; for (let i = 0; i < Math.round(r / 12); i++) { const a = ang + i * (Math.PI * 2 / Math.round(r / 12)); c.save(); c.rotate(a); c.fillRect(-r * 0.12, -r - 14, r * 0.24, 28); c.restore(); } circle(0, 0, r, col); circle(0, 0, r * 0.3, '#212529'); }); label(name, x, y + 4, Math.max(18, r * 0.22), '#ffffff', { spacing: 2 }); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const on = G.map((_, i) => prog(t, 0.8 + i * 1.0, 1.4 + i * 1.0)); const all = t > 4.4;
  camera({ x: 520, y: lerp(1250, 1080, prog(t, 0.5, 4.4)), z: lerp(1.12, 0.95, ease(prog(t, 0.5, 4.4))), shake: impact(t, 4.4, 8), t }, () => {
    ground(FY); if (all) spot(520, 750, 400, 'rgba(57,255,20,0.3)');
    let ang = t * 2; G.forEach(([x, y, r, name], i) => { const turning = on[i] > 0; const a = turning ? (i % 2 ? -1 : 1) * (t - (0.8 + i)) * (60 / r) * 2 : 0; gear(x, y, r, a, turning ? (all ? '#2f9e44' : '#868e96') : '#495057', name); });
    if (all) M.celebrate('kai2', 150, FY, 0.8, t, 4.45); else { const ga = 2 * Math.max(0, t - 0.8) - Math.PI / 2; const hp = [300 + Math.cos(ga) * 44, 1330 + Math.sin(ga) * 44]; A.work('kai', 175, FY, 0.8, t, { crouch: 24, lean: 18, handR: hp, handL: [hp[0] - 6, hp[1] + 8], expr: 'determined' }); circle(hp[0], hp[1], 10, '#ced4da'); }
  });
  title(all ? 'IT ALL STARTED SMALL.' : 'TURN THE SMALL ONE.', all ? GREEN : '#ffffff', 300, 70, all ? GREEN : undefined);
});
