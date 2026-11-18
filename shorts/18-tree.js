// Short 18: PLANT IT ONCE. Kai plants one product, waters it every day, and it grows into a tree that drops money.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, H, dark, spot, label, makeShort, title, camera, blend, hop, sun } = require('./lib');
const CUT = 10.6; const FY = 1400; const TX = 600;
const kneel = { lean: 0, tilt: 14, drop: 60, armL: [40, -20], armR: [60, -20], legL: [40, -100], legR: [10, -20] };
const water = (t) => ({ lean: 0, tilt: 6, armL: [8, 4], armR: [70 + Math.sin(t * 6) * 6, -20], legL: [6, 0], legR: [6, 0] });

module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); const grow = ease(prog(t, 2.2, 8.4)); const days = Math.floor(prog(t, 2.2, 8.4) * 365);
  // the sky cycles day and night as it grows
  const cyc = (t - 2.2) * 1.6; const night = t > 2.2 && t < 8.4 ? (Math.sin(cyc) < 0 ? 0.6 : 0) : 0;
  dark(700);
  camera({ x: 560, y: lerp(1100, 860, grow), z: lerp(1.25, 0.95, grow), t }, () => {
    if (t > 2.2 && t < 8.4) { const a = cyc % (Math.PI * 2); if (Math.sin(cyc) > 0) sun(560 + Math.cos(a) * 520, 900 - Math.sin(a) * 600, 34, t); else circle(560 + Math.cos(a + Math.PI) * 520, 900 - Math.sin(a + Math.PI) * 600, 30, '#f6f1c9'); }
    c.fillStyle = '#2a2219'; c.fillRect(-500, FY, 2100, 1200); line([[-500, FY], [1600, FY]], '#5a4a36', 6);
    // the tree: a sprout, then a trunk and a canopy full of $ leaves
    if (t > 1.6) { const h = lerp(30, 640, grow); const r = lerp(0, 300, ease(prog(t, 3.2, 8.4)));
      card(TX - lerp(4, 34, grow), FY - h, lerp(8, 68, grow), h, '#6b4a2f', 10);
      if (grow < 0.15) { circle(TX - 18, FY - h, 14, GREEN); circle(TX + 18, FY - h - 6, 14, GREEN); }
      for (let i = 0; i < 7; i++) { const a = i * 0.9; circle(TX + Math.cos(a) * r * 0.55, FY - h - 80 + Math.sin(a) * r * 0.4 + Math.sin(t * 2 + i) * 4, r * 0.55, i % 2 ? '#2b8a3e' : '#2f9e44'); }
      for (let i = 0; i < 14 * grow; i++) { const a = i * 2.4; at(TX + Math.cos(a) * r * 0.75, FY - h - 80 + Math.sin(a) * r * 0.5 + Math.sin(t * 3 + i) * 5, 1, () => { circle(0, 0, 22, GOLD); label('$', 0, 2, 26, '#5c3d00', { spacing: 0 }); }); } }
    // falling money into the basket
    if (t > 8.4) floaters(t, 40, (i, life) => at(TX - 260 + rnd(i) * 520, lerp(FY - 700, FY - 60, life), 1, () => { circle(0, 0, 18, GOLD); label('$', 0, 2, 22, '#5c3d00', { spacing: 0 }); }, life * 6), { every: 0.05, from: 8.4, life: 0.9 });
    card(TX + 160, FY - 90, 180, 90, '#8a5a3c', 16, INK, 5);
    // seed label
    if (t > 0.6 && t < 2.4) at(TX, FY - 40, pop(t, 0.6), () => { card(-90, -26, 180, 52, '#123d1c', 26, GREEN, 3); label('1 PRODUCT', 0, 2, 26, GREEN, { spacing: 2 }); });
    // Kai: kneels to plant, then waters, then celebrates under it
    const kx = 330; spot(kx, FY - 220, 240, 'rgba(57,255,20,0.15)');
    const pose = t < 2.2 ? kneel : (t < 8.4 ? blend(kneel, water(t), prog(t, 2.2, 2.7)) : blend(water(t), 'cheer', prog(t, 8.4, 8.8)));
    who(t > 8.4 ? 'kai2' : 'kai', { x: kx, y: FY - hop(t, 8.8, 60) - hop(t, 9.4, 40), s: 0.95, pose, expr: t > 8.4 ? 'happy' : 'determined' });
    if (t > 2.2 && t < 8.4) { at(kx + 150, FY - 300, 1, () => { card(-40, -30, 80, 60, '#1c7ed6', 10, INK, 4); line([[40, -10], [80, -40]], '#1c7ed6', 10); }, 0.3); floaters(t, 30, (i, life) => circle(kx + 240 + life * 40, FY - 330 + life * 300, 6, '#74c0fc'), { every: 0.08, from: 2.2, life: 0.6 }); }
  });
  K.at(W / 2, 1720, 1, () => { K.card(-170, -44, 340, 88, '#0d1018', 44, 'rgba(255,255,255,0.4)', 3); label(`DAY ${Math.max(1, days)}`, 0, 3, 40, '#ffffff', { spacing: 4 }); });
  title(t < 8.4 ? 'PLANT IT ONCE.' : 'HARVEST FOREVER.', t < 8.4 ? '#ffffff' : GREEN, 300, 80, t < 8.4 ? undefined : GREEN);
});
