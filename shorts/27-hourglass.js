// Short 27: THE TIME IS RUNNING. "Someday" sand runs out while Kai waits; he flips the glass, it reads TODAY, and he starts.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, workstation } = require('./lib');
const CUT = 10.4; const HX = 680; const HY = 980; const FLIP = 5.0;
function glass(sandTop, color) { const c = K.ctx();
  card(-170, -340, 340, 30, '#8a5a3c', 10); card(-170, 310, 340, 30, '#8a5a3c', 10);
  c.fillStyle = 'rgba(200,220,255,0.12)'; c.strokeStyle = 'rgba(200,220,255,0.7)'; c.lineWidth = 6; c.beginPath(); c.moveTo(-140, -310); c.lineTo(140, -310); c.lineTo(14, 0); c.lineTo(140, 310); c.lineTo(-140, 310); c.lineTo(-14, 0); c.closePath(); c.fill(); c.stroke();
  const top = sandTop; c.fillStyle = color; c.beginPath(); const h = 280 * top; c.moveTo(-14 - 126 * (h / 300), -h); c.lineTo(14 + 126 * (h / 300), -h); c.lineTo(10, -10); c.lineTo(-10, -10); c.closePath(); if (top > 0.01) c.fill();
  const bot = 1 - top; const bh = 260 * bot; c.beginPath(); c.moveTo(-140, 310); c.lineTo(140, 310); c.lineTo(140 - 60 * (1 - bot), 310 - bh); c.lineTo(-140 + 60 * (1 - bot), 310 - bh); c.closePath(); c.fill();
  if (top > 0.01) line([[0, 0], [0, 300 - bh]], color, 5); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const flipK = ease(prog(t, FLIP, FLIP + 0.7)); const started = t > FLIP + 0.8;
  const sand1 = 1 - prog(t, 0.5, FLIP - 0.3); const sand2 = 1 - prog(t, FLIP + 0.8, CUT + 6);
  camera({ x: 560, y: 1050, z: lerp(1.1, 1, prog(t, 0, 3)), shake: impact(t, FLIP + 0.7, 12), t }, () => {
    at(HX, HY, 1, () => { glass(t < FLIP + 0.35 ? sand1 : sand2, t < FLIP + 0.35 ? '#e9c48f' : GREEN); }, flipK * Math.PI);
    at(HX, HY + 420, 1, () => label(t < FLIP + 0.35 ? 'SOMEDAY' : 'TODAY', 0, 0, 60, t < FLIP + 0.35 ? '#e9c48f' : GREEN, { spacing: 8, glow: t < FLIP + 0.35 ? undefined : GREEN }));
    if (!started) { const kx = lerp(230, 480, prog(t, FLIP - 0.9, FLIP - 0.1)); spot(kx, 1300, 220); who('kai', { x: kx, y: 1500, s: 0.9, pose: t < FLIP - 0.9 ? { lean: 0, tilt: 12 + Math.sin(t * 1.5) * 4, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] } : (t < FLIP - 0.1 ? P.walk(t * 1.6) : { lean: 0, tilt: 0, armL: [8, 4], armR: [150, 10], legL: [6, 0], legR: [6, 0] }), expr: t < FLIP - 1.4 ? 'tired' : 'determined', look: 0.5 }); K.line([[60, 1500], [1020, 1500]], 'rgba(255,255,255,0.15)', 4); }
    else workstation(300, 1560, 1.0, 'kai', t, { expr: 'determined', glowColor: 'rgba(57,255,20,0.25)' });
  });
  title(started ? 'START TODAY.' : 'WAITING FOR SOMEDAY?', started ? GREEN : '#ffffff', 300, started ? 90 : 62, started ? GREEN : undefined);
});
