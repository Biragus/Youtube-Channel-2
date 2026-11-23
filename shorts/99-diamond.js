// PRESSURE. A lump of coal gets squeezed under weights labelled DEADLINES, REJECTION, BILLS... then it's a diamond.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, card, line, circle, who, floaters } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, impact, hop, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1350; const REVEAL = 4.6; const W8 = ['DEADLINES', 'REJECTION', 'BILLS'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const n = Math.min(3, Math.floor(prog(t, 0.4, 3.4) * 3.01)); const up = ease(prog(t, REVEAL - 0.5, REVEAL)); const dia = t > REVEAL;
  camera({ x: 540, y: 1100, z: lerp(1, 1.2, prog(t, REVEAL, REVEAL + 1)), shake: [1.4, 2.4, 3.4].reduce((s, a) => s + impact(t, a, 10), 0), t }, () => {
    ground(FY); card(340, FY - 30, 400, 30, '#495057', 6);
    W8.forEach((s, i) => { if (i >= n) return; const a = 0.4 + (i + 1) * 1.0; const f = easeOut(prog(t, a - 0.4, a)); const y = lerp(300, FY - 80 - 60 - i * 110, f) - up * 300; K.alpha(1 - up, () => { card(360, y, 360, 100, '#343a40', 10, INK, 4); label(s, 540, y + 52, 32, '#ff8787', { spacing: 3 }); }); });
    if (!dia) { c.fillStyle = '#212529'; c.beginPath(); c.ellipse(540, FY - 80, 70 - n * 6, 50 - n * 6, 0, 0, Math.PI * 2); c.fill(); }
    else { spot(540, FY - 140, 300, 'rgba(165,216,255,0.5)'); at(540, FY - 140, pop(t, REVEAL), () => { c.fillStyle = '#a5d8ff'; c.beginPath(); c.moveTo(-90, -30); c.lineTo(-50, -80); c.lineTo(50, -80); c.lineTo(90, -30); c.lineTo(0, 90); c.closePath(); c.fill(); c.strokeStyle = '#e7f5ff'; c.lineWidth = 4; c.stroke(); line([[-90, -30], [90, -30]], '#e7f5ff', 4); line([[-50, -80], [0, -30], [50, -80]], '#e7f5ff', 3); line([[0, -30], [0, 90]], '#e7f5ff', 3); });
      floaters(t, 20, (i, life) => circle(540 + Math.cos(i * 2.4) * life * 260, FY - 140 + Math.sin(i * 2.4) * life * 200, 6 * (1 - life), '#e7f5ff'), { every: 0.04, from: REVEAL, life: 0.7 }); }
    if (dia) M.celebrate('kai2', 200, FY, 0.8, t, REVEAL + 0.2); else M.idle('kai', 200, FY, 0.8, t, { tilt: 8, armL: [22, -100], armR: [22, -100], crouch: 8 + Math.sin(t * 3) * 4, expr: 'worried', look: 0.6 });
  });
  title(dia ? 'PRESSURE MADE A DIAMOND.' : 'FEELING THE PRESSURE?', dia ? '#a5d8ff' : '#ffffff', 300, 64, dia ? '#a5d8ff' : undefined);
});
