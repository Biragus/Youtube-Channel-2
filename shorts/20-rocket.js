// Short 20: BUILD IT. THEN LAUNCH. Kai assembles a rocket from IDEA, PRODUCT, SHOP and CONTENT, counts down, and it flies.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 11.0; const RX = 640; const PAD = 1450; const LIFT = 7.6;
const PARTS = [['IDEA', 1.0], ['PRODUCT', 2.0], ['SHOP', 3.0], ['CONTENT', 4.0]];
const wrench = (t) => ({ lean: 0, tilt: 4, armL: [8, 4], armR: [90 + Math.sin(t * 12) * 20, -40 + Math.sin(t * 12) * 30], legL: [6, 0], legR: [6, 0] });

function rocket(parts, t) { const c = K.ctx();
  if (parts > 0) { c.fillStyle = RED; c.beginPath(); c.moveTo(-110, 0); c.lineTo(-60, -160); c.lineTo(-60, 0); c.fill(); c.beginPath(); c.moveTo(110, 0); c.lineTo(60, -160); c.lineTo(60, 0); c.fill(); card(-70, -120, 140, 120, '#dee2e6', 10, INK, 5); label('IDEA', 0, -60, 26, INK, { spacing: 2 }); }
  if (parts > 1) { card(-70, -360, 140, 240, '#f1f3f5', 10, INK, 5); label('PRODUCT', 0, -180, 24, INK, { spacing: 1 }); }
  if (parts > 2) { circle(0, -290, 34, '#74c0fc'); c.strokeStyle = INK; c.lineWidth = 6; c.beginPath(); c.arc(0, -290, 34, 0, Math.PI * 2); c.stroke(); label('SHOP', 0, -235, 20, INK, { spacing: 1 }); }
  if (parts > 3) { c.fillStyle = RED; c.beginPath(); c.moveTo(-70, -360); c.lineTo(0, -500); c.lineTo(70, -360); c.closePath(); c.fill(); c.strokeStyle = INK; c.lineWidth = 5; c.stroke(); label('CONTENT', 0, -400, 18, '#ffffff', { spacing: 1 }); }
}
module.exports = makeShort(CUT, (t) => {
  dark(800); const parts = PARTS.filter(([, at0]) => t > at0 + 0.4).length; const fly = Math.max(0, t - LIFT); const ry = PAD - fly * fly * 380;
  camera({ x: 560, y: t < LIFT ? lerp(1150, 1050, prog(t, 0, LIFT)) : Math.min(1050, ry - 250), z: t < 5 ? lerp(1.1, 1, prog(t, 0, 5)) : lerp(1, 1.1, prog(t, 5, LIFT)), shake: t > LIFT - 1.2 && t < LIFT + 1.5 ? 6 + impact(t, LIFT, 20) : 0, t }, () => {
    for (let i = 0; i < 80; i++) circle(rnd(i) * W, -4000 + rnd(i + 5) * 5200, 2 + rnd(i + 3) * 2, 'rgba(255,255,255,0.5)');
    card(-400, PAD, 1900, 600, '#1b1f2b', 0); line([[-400, PAD], [1500, PAD]], 'rgba(255,255,255,0.3)', 6); card(RX - 160, PAD - 20, 320, 20, '#495057', 4);
    // parts drop in and stack
    PARTS.forEach(([name, a], i) => { if (t > a && t < a + 0.4) at(RX, lerp(PAD - 1200, PAD - 120 - i * 120, easeOut(prog(t, a, a + 0.4))), 1, () => { card(-60, -40, 120, 80, '#dee2e6', 10, INK, 4); label(name, 0, 2, 20, INK, { spacing: 1 }); }); });
    // flames and smoke at lift-off
    if (t > LIFT - 1.2) { const f = 1 + Math.sin(t * 40) * 0.15; at(RX, ry, f, () => { const c = K.ctx(); c.fillStyle = '#ffd43b'; c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(0, 260 + fly * 80, 50, 0); c.fill(); c.fillStyle = '#ff922b'; c.beginPath(); c.moveTo(-30, 0); c.quadraticCurveTo(0, 160 + fly * 50, 30, 0); c.fill(); });
      floaters(t, 40, (i, life) => circle(RX + (rnd(i) - 0.5) * 500 * life, PAD - 20 - life * 80, 30 + life * 50, `rgba(200,200,210,${0.4 * (1 - life)})`), { every: 0.04, from: LIFT - 1.2, life: 1.2 }); }
    at(RX, ry + (t > LIFT - 1.2 && t < LIFT ? Math.sin(t * 50) * 3 : 0), 1, () => rocket(parts, t));
    // Kai: hammers with a wrench, steps back, counts down, cheers
    const kx = lerp(400, 250, prog(t, 5.0, 5.6)); spot(kx, PAD - 220, 240, 'rgba(57,255,20,0.15)');
    const pose = t < 5 ? wrench(t) : (t < LIFT ? blend(wrench(t), { lean: 0, tilt: -4, armL: [8, 4], armR: [150, 24], legL: [6, 0], legR: [6, 0] }, prog(t, 5, 5.4)) : blend('stand', 'cheer', prog(t, LIFT, LIFT + 0.3)));
    who(t > LIFT ? 'kai2' : 'kai', { x: kx, y: PAD - hop(t, LIFT + 0.3, 60) - hop(t, LIFT + 0.9, 40), s: 0.9, pose, expr: t > LIFT ? 'happy' : 'determined', look: t > LIFT ? 0.5 : 0 });
  });
  if (t > 5.6 && t < LIFT + 0.3) { const n = 3 - Math.floor((t - 5.6) / 0.67); at(280, 820, pop(t, 5.6 + (3 - Math.max(1, n)) * 0.67), () => label(n > 0 ? String(n) : 'LAUNCH!', 0, 0, n > 0 ? 220 : 120, n > 0 ? '#ffffff' : GREEN, { spacing: 4, glow: n > 0 ? undefined : GREEN })); }
  title('BUILD IT.', '#ffffff', 290, 80); title('THEN LAUNCH.', GOLD, 380, 80, GOLD);
});
