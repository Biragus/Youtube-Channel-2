// Short 60: PLANT ANYWAY. Kai scatters a row of seeds (his posts); most stay buried, a few sprout, and one grows into a huge tree.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 7.0; const GY = 1350; const N = 12; const BIG = 8; const GROW = 3.4;
const plantAt = (i) => 0.4 + i * 0.22;
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(800); const g = ease(prog(t, GROW, GROW + 1.8)); const bigH = g * 1100;
  camera({ x: lerp(560, 640, g), y: lerp(1200, GY - bigH * 0.45, g), z: lerp(1.0, 0.7, g), shake: impact(t, GROW + 0.4, 8), t }, () => {
    c.fillStyle = '#2a2219'; c.fillRect(-500, GY, 2200, 1200); line([[-500, GY], [1700, GY]], '#5a4a36', 6);
    for (let i = 0; i < N; i++) { const x = 90 + i * 82; if (t < plantAt(i)) continue; const fall = prog(t, plantAt(i), plantAt(i) + 0.3);
      if (fall < 1) circle(x, lerp(GY - 200, GY + 20, fall * fall), 8, '#e9c48f'); else circle(x, GY + 20, 8, '#8a6a45');
      const sprout = [2, 5, BIG, 10].includes(i); if (!sprout || t < GROW) continue;
      if (i === BIG) { const h = bigH; card(x - lerp(4, 30, g), GY - h, lerp(8, 60, g), h, '#6b4a2f', 10); const r = lerp(0, 330, g); for (let k = 0; k < 7; k++) { const a = k * 0.9; circle(x + Math.cos(a) * r * 0.55, GY - h - 60 + Math.sin(a) * r * 0.4 + Math.sin(t * 2 + k) * 4, r * 0.55, k % 2 ? '#2b8a3e' : '#2f9e44'); } if (g > 0.6) for (let k = 0; k < 10; k++) { const a = k * 2.4; at(x + Math.cos(a) * r * 0.7, GY - h - 60 + Math.sin(a) * r * 0.45, 1, () => { circle(0, 0, 24, GOLD); label('$', 0, 2, 28, '#5c3d00', { spacing: 0 }); }); } }
      else { const h = ease(prog(t, GROW, GROW + 1)) * 90; line([[x, GY], [x, GY - h]], '#2f9e44', 6); circle(x - 12, GY - h, 12, GREEN); circle(x + 12, GY - h - 6, 12, GREEN); } }
    // Kai walks along scattering, then celebrates by the tree
    const kx = t < 3.2 ? lerp(60, 1000, prog(t, 0.3, 3.0)) : 1000; const done = t > GROW + 1.4; spot(kx, GY - 220, 200, 'rgba(57,255,20,0.15)');
    who(done ? 'kai2' : 'kai', { x: kx, y: GY - hop(t, GROW + 1.5, 50), s: 0.75, flip: done, pose: t < 3.0 ? { ...P.walk(t * 1.8), armR: [80 + Math.sin(t * 9) * 20, -30] } : (done ? blend('stand', 'cheer', prog(t, GROW + 1.4, GROW + 1.7)) : 'stand'), expr: done ? 'happy' : 'determined', look: t > GROW ? -0.6 : 0 });
  });
  pill(t > GROW + 0.3 ? '12 POSTS. 1 HIT.' : '12 POSTS', W / 2, 450, 44, t > GROW ? GREEN : '#ffffff', { border: t > GROW ? GREEN : undefined });
  title(t > GROW + 1 ? 'ONE IS ENOUGH.' : 'MOST WON\'T GROW.', t > GROW + 1 ? GREEN : '#ffffff', 280, 76, t > GROW + 1 ? GREEN : undefined); if (t > 1.2 && t < GROW + 1) title('PLANT ANYWAY.', GOLD, 370, 66, GOLD);
});
