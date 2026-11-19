// Short 47: "I MADE IT." Suit Kai plants a flag on a little hill marked $1K. Zoom out: it is the foot of a mountain range.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 6.8; const GY = 1500; const OUT = 2.8;
function peak(x, w, h, col, snow) { const c = K.ctx(); c.fillStyle = col; c.beginPath(); c.moveTo(x - w / 2, GY); c.lineTo(x, GY - h); c.lineTo(x + w / 2, GY); c.closePath(); c.fill(); c.fillStyle = 'rgba(255,255,255,0.08)'; c.beginPath(); c.moveTo(x, GY - h); c.lineTo(x + w / 2, GY); c.lineTo(x + w * 0.1, GY); c.closePath(); c.fill(); if (snow) { c.fillStyle = '#e9ecef'; c.beginPath(); c.moveTo(x, GY - h); c.lineTo(x - w * 0.12, GY - h * 0.8); c.lineTo(x + w * 0.12, GY - h * 0.8); c.closePath(); c.fill(); } }
module.exports = makeShort(CUT, (t) => {
  dark(800); const z = ease(prog(t, OUT, OUT + 1.6)); const plant = prog(t, 0.9, 1.3);
  camera({ x: lerp(560, 1950, z), y: lerp(1150, 560, z), z: lerp(1.05, 0.26, z), shake: impact(t, 1.3, 10), t }, () => {
    // the range behind, only visible once the camera pulls back
    alpha(z, () => { [[1500, 1400, 1600, '$10K'], [2400, 1800, 2600, '$100K'], [3300, 1500, 1900, 'FREEDOM']].forEach(([x, w, h, s]) => { peak(x, w, h, '#2b3142', true); label(s, x, GY - h - 160, 140, GOLD, { spacing: 6, glow: GOLD }); }); });
    card(-2000, GY, 7000, 3000, '#141823', 0);
    peak(560, 700, 300, '#3a4158', false); label('$1K', 560, GY - 110, 60, '#ffffff', { spacing: 4 });
    // the flag
    const fh = 160 * plant; line([[640, GY - 300], [640, GY - 300 - fh]], '#dee2e6', 6); if (plant > 0.9) { const c = K.ctx(); c.fillStyle = RED; c.beginPath(); c.moveTo(640, GY - 460); c.quadraticCurveTo(700, GY - 440 + Math.sin(t * 8) * 8, 740, GY - 430); c.lineTo(640, GY - 400); c.closePath(); c.fill(); }
    who('kai2', { x: 540, y: GY - 296 - hop(t, 1.4, 40), s: 0.8, pose: t < 0.9 ? { lean: 0, tilt: 0, armL: [8, 4], armR: [90, -60], legL: [6, 0], legR: [6, 0] } : (t < OUT + 1 ? blend('stand', 'cheer', prog(t, 1.3, 1.6)) : blend('cheer', 'stand', prog(t, OUT + 1, OUT + 1.4))), expr: t < OUT + 1 ? 'happy' : 'shock', look: 0.6 });
  });
  title(z > 0.5 ? "YOU'RE JUST GETTING STARTED." : '"I MADE IT."', z > 0.5 ? GOLD : '#ffffff', 300, z > 0.5 ? 52 : 90, z > 0.5 ? GOLD : undefined);
});
