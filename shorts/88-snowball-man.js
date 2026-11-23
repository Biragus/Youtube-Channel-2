// SMALL THINGS ADD UP. Tiny flakes fall on Kai's hand, then pile up; by the end he's standing next to a giant snowman.
const K = require('../engine/kit'); const M = require('../engine/motion'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, ground } = require('./lib');
const CUT = 6.8; const FY = 1400; const SX = 680;
module.exports = makeShort(CUT, (t) => {
  dark(800); const g = ease(prog(t, 0.8, 5.2)); const done = t > 5.4; const flakes = Math.floor(lerp(1, 100000, prog(t, 0.6, 5.2) ** 3));
  camera({ x: lerp(380, 560, g), y: lerp(1200, 1000, g), z: lerp(1.6, 0.9, g), t }, () => {
    for (let i = 0; i < 70; i++) circle(rnd(i) * 1400 - 150 + Math.sin(t + i) * 20, ((t * (60 + i % 5 * 20) + rnd(i + 3) * 1800) % 1800), 3 + (i % 3) * 2, 'rgba(255,255,255,0.8)');
    ground(FY); K.card(-600, FY - 30 * g, 2200, 40, '#e9ecef', 20);
    // the snowman grows from a lump to three big balls
    const r1 = lerp(10, 210, g); const r2 = lerp(0, 150, prog(g, 0.35, 1)); const r3 = lerp(0, 100, prog(g, 0.65, 1));
    circle(SX, FY - r1, r1, '#f1f3f5'); if (r2 > 2) circle(SX, FY - 2 * r1 - r2 + 20, r2, '#f1f3f5'); if (r3 > 2) { const hy = FY - 2 * r1 - 2 * r2 - r3 + 40; circle(SX, hy, r3, '#f1f3f5'); circle(SX - 30, hy - 15, 9, INK); circle(SX + 30, hy - 15, 9, INK); K.ctx().fillStyle = '#ff922b'; K.ctx().beginPath(); K.ctx().moveTo(SX, hy); K.ctx().lineTo(SX + 70, hy + 10); K.ctx().lineTo(SX, hy + 20); K.ctx().fill(); card(SX - 70, hy - r3 - 10, 140, 20, INK, 4); card(SX - 45, hy - r3 - 90, 90, 80, INK, 6); }
    if (done) M.celebrate('kai2', 300, FY - 20 * g, 0.8, t, 5.4); else M.idle('kai', 300, FY - 20 * g, 0.8, t, { handR: [400 + Math.sin(t * 4) * 10, FY - 20 * g - 220 + Math.cos(t * 4) * 10], lean: 6, expr: 'smile', look: 0.6 });
  });
  K.at(W / 2, 400, 1, () => pill(`${flakes.toLocaleString('en-US')} FLAKES`, 0, 0, 32, '#ffffff'));
  title(done ? 'SMALL THINGS ADD UP.' : 'ONE FLAKE IS NOTHING.', done ? GREEN : '#ffffff', 300, 70, done ? GREEN : undefined);
});
