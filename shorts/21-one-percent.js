// Short 21: 1% BETTER EVERY DAY. Staying the same is a flat line; 1% a day curves up to 37 times better in a year.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 10.6; const BASE = 1500; const X0 = 140; const X1 = 980; const SCALE = 30;
const same = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: '#868e96' }, pants: '#3b4252', shoes: '#e5e5e5' };
const dayAt = (t) => Math.round(365 * prog(t, 0.8, 9.0) ** 1.1);
const px = (d) => lerp(X0, X1, d / 365); const py = (d) => BASE - (1.01 ** d - 1) * SCALE;

module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const d = dayAt(t); const done = t > 9.0;
  camera({ x: 560, y: lerp(1150, 950, ease(prog(t, 3, 9))), z: lerp(1.05, 0.6, ease(prog(t, 3, 9))), t }, () => {
    // axes and the two paths
    line([[X0 - 40, BASE], [X1 + 60, BASE]], 'rgba(255,255,255,0.25)', 4); line([[X0 - 40, BASE], [X0 - 40, BASE - 1500]], 'rgba(255,255,255,0.15)', 4);
    c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 8; c.beginPath(); for (let k = 0; k <= 365; k += 5) k ? c.lineTo(px(k), py(k)) : c.moveTo(px(k), py(k)); c.stroke();
    c.strokeStyle = GREEN; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); for (let k = 0; k <= d; k += 3) k ? c.lineTo(px(k), py(k)) : c.moveTo(px(k), py(k)); c.stroke();
    line([[X0, BASE - 6], [px(d), BASE - 6]], '#868e96', 10);
    // the one who stays the same, on the flat line
    who(same, { x: px(d) - 30, y: BASE - 8, s: 0.55, pose: P.walk(t * 1.4), expr: 'tired' });
    // Kai riding the curve up
    spot(px(d), py(d) - 120, 200, 'rgba(57,255,20,0.2)');
    who(done ? 'kai2' : 'kai', { x: px(d), y: py(d) - hop(t, 9.1, 50), s: 0.6, pose: done ? blend(P.walk(t * 1.4), 'cheer', prog(t, 9.0, 9.4)) : P.walk(t * 1.6), expr: done ? 'happy' : 'determined' });
    if (done) { at(px(365) - 330, py(365) + 260, pop(t, 9.1), () => label('37x', 0, 0, 110, GREEN, { spacing: 2, glow: GREEN })); at(px(365) - 60, BASE - 100, pop(t, 9.3), () => label('1x', 0, 0, 70, '#868e96', { spacing: 2 })); }
  });
  K.at(W / 2, 470, 1, () => { K.card(-180, -44, 360, 88, '#0d1018', 44, 'rgba(255,255,255,0.4)', 3); label(`DAY ${Math.max(1, d)}`, 0, 3, 40, '#ffffff', { spacing: 4 }); });
  title('1% BETTER', GREEN, 290, 90, GREEN); title('EVERY DAY.', '#ffffff', 390, 70);
});
