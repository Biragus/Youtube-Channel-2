// Short 43: "LUCKY." Up close, suit Kai on a ledge with his trophy and someone calling him lucky. Zoom out: a huge staircase.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 7.0; const TOPY = 1100; const GY = 1500; const OUT = 2.6;
const STEPS = ['SHOWING UP', 'LEARNING', 'FAILED LAUNCH', 'REWRITES', 'NO SALES', 'LATE NIGHTS', 'DAY ONE'];
const bystander = { hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'tee', color: '#868e96' }, pants: '#3b4252', shoes: '#e5e5e5' };
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(800); const z = ease(prog(t, OUT, OUT + 1.6));
  camera({ x: lerp(560, 1120, z), y: lerp(1100, 1250, z), z: lerp(1.0, 0.52, z), t }, () => {
    // ground and ledge
    card(-800, GY, 4400, 1500, '#141823', 0); line([[-800, GY], [3600, GY]], 'rgba(255,255,255,0.2)', 5);
    card(560, TOPY, 360, GY - TOPY, '#262b3a', 6); line([[560, TOPY], [920, TOPY]], GOLD, 6);
    // the staircase behind: hidden by the dark until the camera pulls back
    STEPS.forEach((s, i) => { const sw = 180; const sh = (GY - TOPY) / STEPS.length; const x = 920 + i * sw; const y = TOPY + i * sh; card(x, y, sw + 4, GY - y, '#20253a', 2, 'rgba(255,255,255,0.12)', 3); alpha(z, () => label(s, x + sw / 2, y + 60, 34, '#9aa3b5', { spacing: 3 })); });
    for (let i = 0; i < 12; i++) alpha(z * 0.5, () => circle(2150 - i * 110, GY - 20 - i * 52, 10, '#ffffff'));
    // suit Kai with the trophy on top
    spot(740, TOPY - 260, 300, 'rgba(242,193,78,0.3)');
    who('kai2', { x: 740, y: TOPY, s: 0.95, pose: { lean: 0, tilt: -4, armL: [8, 4], armR: [150 + Math.sin(t * 3) * 6, 14], legL: [6, 0], legR: [6, 0] }, expr: 'happy' });
    at(780 + 95, TOPY - 520 + Math.sin(t * 3) * 6, 1, () => { card(-40, 40, 80, 20, '#c9a43a', 4); card(-14, 0, 28, 44, '#c9a43a', 4); circle(0, -30, 48, GOLD); label('$', 0, -26, 50, '#5c3d00', { spacing: 0 }); });
    // the bystander below
    who(bystander, { x: 300, y: GY, s: 0.95, pose: 'point', expr: 'smug' });
    alpha(prog(t, 0.6, 0.9), () => pill('"LUCKY."', 300, GY - 520, 46, '#ffffff'));
  });
  title(z > 0.4 ? "THEY DON'T SEE THE STAIRS." : 'THEY CALL IT LUCK.', z > 0.4 ? GOLD : '#ffffff', 300, z > 0.4 ? 64 : 76, z > 0.4 ? GOLD : undefined);
});
