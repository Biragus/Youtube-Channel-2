// Short 53: THE ROOTS. Kai waters bare ground for years with nothing to show; underground the roots spread. Then it shoots up.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 7.0; const GY = 1250; const BX = 620; const SHOOT = 4.2;
const water = (t) => ({ lean: 0, tilt: 6, armL: [8, 4], armR: [70 + Math.sin(t * 6) * 6, -20], legL: [6, 0], legR: [6, 0] });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(800); const year = Math.min(5, 1 + Math.floor(prog(t, 0.3, SHOOT) * 4)); const roots = ease(prog(t, 0.3, SHOOT)); const up = ease(prog(t, SHOOT, SHOOT + 1.6)); const h = up * 2400;
  camera({ x: 560, y: lerp(lerp(1150, 1500, prog(t, 1.2, 2.4) * (1 - prog(t, 3.4, SHOOT))), GY - h * 0.4, up), z: lerp(1.0, 0.55, up), shake: impact(t, SHOOT, 14), t }, () => {
    c.fillStyle = '#2a2219'; c.fillRect(-500, GY, 2100, 1400); line([[-500, GY], [1600, GY]], '#5a4a36', 6);
    // roots growing in the dark
    c.strokeStyle = 'rgba(232,196,143,0.55)'; c.lineCap = 'round';
    for (let i = 0; i < 9; i++) { const a = Math.PI * (0.15 + i * 0.09); c.lineWidth = 8 - i * 0.4; c.beginPath(); c.moveTo(BX, GY + 20); let x = BX; let y = GY + 20; const n = Math.floor(roots * 14); for (let k = 0; k < n; k++) { x += Math.cos(a + Math.sin(k + i) * 0.4) * 40; y += Math.sin(a + Math.sin(k * 1.3 + i) * 0.4) * 40; c.lineTo(x, y); } c.stroke(); }
    alpha(roots * (1 - up), () => label('WHAT YOU CAN\'T SEE', BX, GY + 560, 40, '#e9c48f', { spacing: 4 }));
    // the shoot: tall bamboo stalks once it breaks through
    for (let s = 0; s < 3; s++) { const sh = h * (1 - s * 0.15); if (sh < 2) { if (s === 0) { circle(BX - 14, GY - 10, 10, '#2f9e44'); } continue; } const sx = BX + (s - 1) * 60;
      card(sx - 16, GY - sh, 32, sh, '#2f9e44', 10); for (let k = 1; k < sh / 200; k++) { line([[sx - 18, GY - k * 200], [sx + 18, GY - k * 200]], '#2b8a3e', 6); c.fillStyle = '#51cf66'; c.beginPath(); c.ellipse(sx + (k % 2 ? 60 : -60), GY - k * 200 - 30, 60, 18, (k % 2 ? -0.4 : 0.4), 0, Math.PI * 2); c.fill(); } }
    const done = t > SHOOT + 0.4; spot(320, GY - 220, 220, 'rgba(57,255,20,0.15)');
    who(done ? 'kai2' : 'kai', { x: 320, y: GY - hop(t, SHOOT + 0.6, 60), s: 0.85, pose: done ? blend(water(t), 'cheer', prog(t, SHOOT + 0.4, SHOOT + 0.8)) : water(t), expr: done ? 'happy' : (year >= 3 ? 'tired' : 'determined'), look: done ? 0.8 : 0 });
    if (!done) { at(320 + 130, GY - 280, 1, () => { card(-40, -30, 80, 60, '#1c7ed6', 10, INK, 4); line([[40, -10], [80, -40]], '#1c7ed6', 10); }, 0.3); floaters(t, 30, (i, life) => circle(530 + life * 30, GY - 300 + life * 290, 6, '#74c0fc'), { every: 0.08, from: 0.3, life: 0.6 }); }
  });
  pill(t > SHOOT ? 'YEAR 5' : `YEAR ${year}`, W / 2, 1720, 44, t > SHOOT ? GREEN : '#ffffff', { border: t > SHOOT ? GREEN : undefined });
  title(t > SHOOT ? 'THEN IT ALL SHOWS UP.' : 'NOTHING TO SHOW FOR IT?', t > SHOOT ? GREEN : '#ffffff', 300, 66, t > SHOOT ? GREEN : undefined);
});
