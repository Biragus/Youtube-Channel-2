// GROW ANYWAY. Concrete slab labelled NO MONEY, NO TIME, NO CONNECTIONS. A tiny sprout pushes through the crack and grows into a tree.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, impact, hop, ground, coin } = require('./lib');
const CUT = 6.8; const FY = 1300; const BREAK = 2.6;
module.exports = makeShort(CUT, (t) => {
  dark(800); const g = ease(prog(t, BREAK, 5.6)); const h = lerp(0, 520, g); const c = K.ctx();
  camera({ x: 540, y: lerp(1200, FY - h * 0.45, g), z: lerp(1.5, 0.85, ease(prog(t, 0.5, 5))), shake: impact(t, BREAK, 10), t }, () => {
    c.fillStyle = '#2a2219'; c.fillRect(-300, FY + 60, 1700, 900);
    // the slab, cracking open
    const gap = ease(prog(t, BREAK - 0.2, BREAK + 0.4)) * 40; card(-300, FY, 820 - gap / 2, 60, '#868e96', 4); card(560 + gap / 2, FY, 820, 60, '#868e96', 4);
    label('NO MONEY', 300, FY + 30, 26, INK, { spacing: 2 }); label('NO TIME', 780, FY + 30, 26, INK, { spacing: 2 });
    // the sprout, then the trunk and crown
    const sh = t < BREAK ? lerp(0, 40, prog(t, 0.8, BREAK)) : 40 + h; line([[540, FY + 60], [540, FY + 60 - sh]], g > 0.2 ? '#6b4a2f' : '#2f9e44', lerp(6, 40, g)); circle(530, FY + 60 - sh, lerp(12, 0, g), '#51cf66');
    if (g > 0.2) { const r = lerp(0, 300, prog(g, 0.2, 1)); for (let k = 0; k < 7; k++) circle(540 + Math.cos(k * 0.9) * r * 0.55, FY - h - 40 + Math.sin(k * 0.9) * r * 0.4 + Math.sin(t * 2 + k) * 4, r * 0.55, k % 2 ? '#2b8a3e' : '#2f9e44'); if (g > 0.8) for (let k = 0; k < 8; k++) coin(540 + Math.cos(k * 2.4) * r * 0.6, FY - h - 40 + Math.sin(k * 2.4) * r * 0.4, 20, t * 3 + k); }
    if (t < BREAK) floaters(t, 6, (i, life) => circle(540 + (rnd(i) - 0.5) * 30, FY - life * 20, 4, '#adb5bd'), { every: 0.3, from: 1.6, life: 0.4 });
  });
  title(g > 0.3 ? 'GROW ANYWAY.' : 'NO SPACE TO GROW?', g > 0.3 ? GREEN : '#ffffff', 300, 80, g > 0.3 ? GREEN : undefined);
});
