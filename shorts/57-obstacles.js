// Short 57: KEEP RUNNING. Kai runs and jumps NO SALES, BAD REVIEW and BURNOUT. The last wall says QUIT?; he smashes straight through.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const FY = 1450; const SPEED = 520; const OB = [['NO SALES', 1.2], ['BAD REVIEW', 2.3], ['BURNOUT', 3.4]]; const WALL = 4.6;
const kx = (t) => 200 + t * SPEED;
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const x = kx(t); const jump = OB.reduce((s, [, a]) => s + hop(t, a - 0.32, 220, 0.62), 0); const broke = t > WALL; const wx = kx(WALL) + 70;
  camera({ x: x + 260, y: 1150, z: 1.0 + (broke ? 0.08 * Math.exp(-(t - WALL) * 3) : 0), shake: impact(t, WALL, 22), t }, () => {
    card(-400, FY, 6000, 900, '#141823', 0); line([[-400, FY], [5600, FY]], 'rgba(255,255,255,0.15)', 4);
    for (let i = 0; i < 40; i++) line([[i * 150 - ((t * SPEED * 0.4) % 150), FY + 60], [i * 150 + 60 - ((t * SPEED * 0.4) % 150), FY + 60]], 'rgba(255,255,255,0.1)', 4);
    OB.forEach(([s, a]) => { const ox = kx(a) + 40; card(ox - 50, FY - 150, 100, 150, '#3b1f1f', 8, RED, 4); label(s, ox, FY - 200, 30, '#ff8787', { spacing: 2 }); });
    // the last wall, smashed into bricks
    if (!broke) { card(wx - 40, FY - 520, 80, 520, '#495057', 4, INK, 4); for (let r = 0; r < 10; r++) line([[wx - 40, FY - r * 52], [wx + 40, FY - r * 52]], INK, 3); label('QUIT?', wx, FY - 580, 48, '#ff8787', { spacing: 3 }); }
    else for (let i = 0; i < 14; i++) { const u = t - WALL; card(wx - 20 + (i % 3) * 20 + u * (200 + i * 40), FY - 500 + i * 36 - u * 500 + u * u * 1400, 40, 26, '#495057', 3); }
    spot(x, FY - 200, 220, 'rgba(57,255,20,0.18)');
    who(t > WALL + 0.6 ? 'kai2' : 'kai', { x, y: FY - jump, s: 0.8, pose: jump > 5 ? { lean: 10, tilt: -4, armL: [130, 10], armR: [130, 10], legL: [60, -100], legR: [10, -30] } : (t > WALL - 0.15 && t < WALL + 0.25 ? { lean: 20, tilt: 0, armL: [86, 0], armR: [86, 0], legL: [-10, 0], legR: [30, -30] } : P.walk(t * 3.2)), expr: t > WALL ? 'happy' : 'determined' });
    floaters(t, 30, (i, life) => circle(x - 60 - life * 120, FY - 10 - life * 30, 8 * (1 - life), 'rgba(255,255,255,0.3)'), { every: 0.08, from: 0, life: 0.4 });
  });
  title(broke ? 'NOT TODAY.' : 'KEEP RUNNING.', broke ? GREEN : '#ffffff', 300, 90, broke ? GREEN : undefined);
});
