// Short 26: THE PIECES. SKILL, PROBLEM, PRODUCT and AUDIENCE fly in and lock together into a glowing $.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 10.2; const CX = 540; const CY = 900; const S = 200;
const PIECES = [['SKILL', -1, -1, '#1c7ed6', 1.2], ['PROBLEM', 1, -1, '#e8590c', 2.6], ['PRODUCT', -1, 1, '#9c36b5', 4.0], ['AUDIENCE', 1, 1, '#2f9e44', 5.4]];
const DONE = 6.4;
module.exports = makeShort(CUT, (t) => {
  dark(900); const done = t > DONE;
  camera({ x: 540, y: 1000, z: lerp(1.0, 1.12, prog(t, 0, DONE)) + (done ? 0.05 * Math.sin((t - DONE) * 3) : 0), shake: PIECES.reduce((a, p) => a + impact(t, p[4], 8, 0.3), 0) + impact(t, DONE, 14), t }, () => {
    if (done) spot(CX, CY, 600 * prog(t, DONE, DONE + 0.6), 'rgba(57,255,20,0.35)');
    PIECES.forEach(([s, dx, dy, col, a], i) => { if (t < a - 0.9) return; const k = easeOut(prog(t, a - 0.9, a)); const fx = CX + dx * 900; const fy = CY + dy * 1100;
      at(lerp(fx, CX + dx * S / 2, k), lerp(fy, CY + dy * S / 2, k), 1, () => { card(-S / 2 + 4, -S / 2 + 4, S - 8, S - 8, done ? '#2f9e44' : col, 18, '#0d1018', 6); circle(dx * -S / 2, 0, 28, done ? '#2f9e44' : col); label(s, 0, 2, 30, '#ffffff', { spacing: 2 }); }, (1 - k) * dx * 3); });
    if (done) at(CX, CY, pop(t, DONE + 0.1), () => label('$', 0, 10, 380, '#ffffff', { spacing: 0, glow: GREEN, blur: 60 }));
    const kx = 260; const ky = 1520; spot(kx, ky - 200, 200, 'rgba(57,255,20,0.15)');
    who(done ? 'kai2' : 'kai', { x: kx, y: ky - hop(t, DONE + 0.3, 60), s: 0.85, pose: done ? blend(P.think, 'cheer', prog(t, DONE, DONE + 0.4)) : { lean: 0, tilt: -6 + Math.sin(t * 2) * 3, armL: [8, 4], armR: [26, -150], legL: [5, 0], legR: [5, 0] }, expr: done ? 'happy' : 'neutral', look: 0.6 });
    K.line([[60, ky], [1020, ky]], 'rgba(255,255,255,0.15)', 4);
  });
  title(done ? 'NOW IT SELLS.' : 'PUT THE PIECES TOGETHER.', done ? GREEN : '#ffffff', 300, done ? 84 : 58, done ? GREEN : undefined);
});
