// IF YOU DON'T TRY / IF YOU TRY. Top: he sits by his bike at the ramp, forever. Bottom: Kai rides up and flies across.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, circle, who } = K;
const { W, dark, label, makeShort, halves, sitPose, npc, confetti } = require('./lib');
const CUT = 6.8; const GO = 1.0; const UP = 2.6; const LAND = 4.2;
function bike(x, y, rot = 0) { at(x, y, 1, () => { for (const wx of [-60, 60]) { circle(wx, 0, 30, INK); circle(wx, 0, 22, '#495057'); } line([[-60, 0], [0, -40], [60, 0]], '#e03131', 8); line([[0, -40], [40, -60]], '#adb5bd', 6); }, rot); }
function scene(fy, t, kai) { card(380, fy, 300, 6, '#495057', 0); const c = K.ctx(); c.fillStyle = '#3a4158'; c.beginPath(); c.moveTo(220, fy); c.lineTo(400, fy - 120); c.lineTo(400, fy); c.closePath(); c.fill(); K.card(400, fy, 260, 400, '#07080c', 0); card(660, fy, 600, 400, '#141823', 0); line([[0, fy], [220, fy]], 'rgba(255,255,255,0.15)', 4); line([[660, fy], [1080, fy]], 'rgba(255,255,255,0.15)', 4);
  if (!kai) { bike(150, fy - 30); who(npc('#e8590c'), { x: 90, y: fy, s: 0.55, pose: sitPose, expr: 'sad' }); return; }
  let x; let y; let rot = 0; if (t < GO) { x = 120; y = fy - 30; } else if (t < UP) { x = lerp(120, 400, ease(prog(t, GO, UP))); y = x < 220 ? fy - 30 : fy - 30 - (x - 220) * 0.66; rot = x > 220 ? -0.6 : 0; } else if (t < LAND) { const k = prog(t, UP, LAND); x = lerp(400, 820, k); y = lerp(fy - 150, fy - 30, k) - Math.sin(k * Math.PI) * 200; rot = lerp(-0.6, 0.1, k); } else { x = 820 + (t - LAND) * 60; y = fy - 30; }
  bike(x, y, rot); at(x, y - 40, 1, () => who(t > LAND ? 'kai2' : 'kai', { x: 0, y: 0, s: 0.5, pose: t > LAND ? 'cheer' : { lean: 20, tilt: 0, armL: [80, -10], armR: [80, -10], legL: [60, -80], legR: [60, -80] }, expr: t > LAND ? 'happy' : 'determined', still: true }), rot);
  if (t > LAND) confetti(t, LAND, 820, fy - 450, 300); }
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 700; label(kai ? 'IF YOU TRY' : "IF YOU DON'T TRY", W / 2, y0 + (kai ? 90 : 170), 56, kai ? GREEN : '#9aa3b5', { spacing: 6, glow: kai ? GREEN : undefined }); scene(fy, t, kai); });
});
