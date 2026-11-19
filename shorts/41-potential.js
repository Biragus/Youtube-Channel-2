// Short 41: YOU vs YOUR POTENTIAL. Kai's shadow on the wall is suit Kai, flexing. He walks into it and becomes it.
const K = require('../engine/kit');
const { GREEN, GOLD, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const FY = 1450; const MERGE = 5.0;
const flex = { lean: 0, tilt: -4, armL: [84, -100], armR: [84, -100], legL: [10, 0], legR: [10, 0] };
const crossed = 'crossed';
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const grow = ease(prog(t, 1.2, 2.6)); const walk = ease(prog(t, 3.4, MERGE)); const after = t > MERGE;
  camera({ x: 560, y: lerp(1150, 1050, prog(t, 0, MERGE)), z: lerp(1.15, 1.0, prog(t, 0, MERGE)) + (after ? 0.06 * Math.exp(-(t - MERGE) * 3) : 0), shake: impact(t, MERGE, 16), t }, () => {
    card(-200, 300, 1500, FY - 300, '#161a24', 0); line([[-200, FY], [1300, FY]], 'rgba(255,255,255,0.2)', 5);
    // the lamp throws the light from the left
    line([[120, 560], [120, 760]], '#495057', 6); c.fillStyle = '#ffd43b'; c.beginPath(); c.moveTo(60, 760); c.lineTo(180, 760); c.lineTo(150, 710); c.lineTo(90, 710); c.closePath(); c.fill(); spot(120, 800, 500, 'rgba(255,214,120,0.18)');
    // the shadow: suit Kai, growing and flexing
    if (!after) { c.save(); c.filter = 'brightness(0.18)'; c.globalAlpha = 0.85; who('kai2', { x: 680, y: FY, s: lerp(0.95, 1.6, grow), pose: blend('stand', flex, prog(t, 2.0, 2.6)), expr: 'smug', still: true }); c.restore();
      alpha(prog(t, 2.4, 2.8), () => label('YOUR POTENTIAL', 680, FY - 1.6 * 376 - 190, 46, '#9aa3b5', { spacing: 6 })); }
    // Kai: arms crossed, unsure, then walks into it
    const kx = lerp(360, 680, walk); spot(kx, FY - 220, 220, 'rgba(255,255,255,0.08)');
    if (!after) { who('kai', { x: kx, y: FY, s: 0.95, pose: t < 3.4 ? crossed : P.walk(t * 1.4), expr: t < 3.4 ? 'worried' : 'determined', look: 0.6 }); alpha(1 - prog(t, 3.4, 3.8), () => label('YOU', 360, FY - 530, 50, '#ffffff', { spacing: 8 })); }
    else { spot(680, FY - 300, 420, 'rgba(57,255,20,0.3)'); who('kai2', { x: 680, y: FY - hop(t, MERGE + 0.2, 50), s: 1.4, pose: blend('stand', flex, prog(t, MERGE, MERGE + 0.4)), expr: 'smug' }); floaters(t, 30, (i, life) => circle(680 + Math.cos(i * 2.4) * life * 420, FY - 400 + Math.sin(i * 2.4) * life * 420, 7 * (1 - life), GREEN), { every: 0.02, from: MERGE, life: 0.8 }); }
  });
  K.tint('#ffffff', 0.8 * (1 - prog(t, MERGE, MERGE + 0.3)) * (t > MERGE ? 1 : 0));
  title(after ? 'BECOME IT.' : 'IT IS ALREADY IN YOU.', after ? GREEN : '#ffffff', 300, after ? 96 : 66, after ? GREEN : undefined);
});
