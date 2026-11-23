// FOLLOW YOUR COMPASS. Signs point everyone to TRENDS. They run in circles; Kai follows his own compass straight to the X.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, card, line, circle, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, hop, pill, npc, confetti, spot } = require('./lib');
const CUT = 6.8; const DONE = 5.0;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const k = prog(t, 1.0, DONE); const kx = lerp(540, 540, k); const ky = lerp(1420, 860, k); const done = t > DONE;
  camera({ x: 540, y: lerp(1150, 950, k), z: 1.0, t }, () => {
    c.fillStyle = '#1b2a1f'; c.fillRect(-400, -200, 1900, 2200);
    // the X on the map
    spot(540, 760, 180, 'rgba(242,193,78,0.4)'); line([[500, 720], [580, 800]], RED, 14); line([[580, 720], [500, 800]], RED, 14); if (!done) label('YOUR GOAL', 540, 670, 34, GOLD, { spacing: 4 });
    // trend signs and the people circling them
    for (const [sx, sy] of [[220, 1000], [860, 900]]) { line([[sx, sy], [sx, sy - 160]], '#6b4a2f', 10); card(sx - 90, sy - 220, 180, 60, '#e03131', 8); label('TRENDS →', sx, sy - 190, 24, '#ffffff', { spacing: 2 }); }
    for (let i = 0; i < 3; i++) { const a = t * 2 + i * 2.1; const cx = i < 2 ? 220 : 860; const cy = i < 2 ? 1060 : 960; { const fl = Math.sin(a) > 0; const p = M.gait(0, (t * 2 + i) * 120, cy + Math.sin(a) * 40, 0.45, 'run'); const dx = cx + Math.cos(a) * 120 - p.hip[0]; const sh = (q) => [fl ? 2 * (q[0] + dx) - (cx + Math.cos(a) * 120) * 2 + (cx + Math.cos(a) * 120) : q[0] + dx, q[1]]; M.figure({ spec: npc(['#1c7ed6', '#9c36b5', '#e8590c'][i], ['curly', 'bun', 'short'][i]), ...p, hip: [cx + Math.cos(a) * 120, p.hip[1]], footL: sh(p.footL), footR: sh(p.footR), flip: fl, expr: 'worried' }); } }
    // Kai with a compass, walking straight up the map
    if (done) M.celebrate('kai2', kx, ky, 0.55, t, DONE + 0.05); else { const p = M.gait(0, (1420 - ky) * 0.6, ky, 0.55, 'walk'); const dx = kx - p.hip[0]; M.figure({ spec: 'kai', ...p, hip: [kx, p.hip[1]], footL: [p.footL[0] + dx, p.footL[1]], footR: [p.footR[0] + dx, p.footR[1]], armR: [70, -70], expr: 'determined' }); }
    if (!done) at(kx + 50, ky - 220, 1, () => { circle(0, 0, 26, '#f1f3f5'); line([[0, 12], [0, -18]], RED, 5); });
    if (done) confetti(t, DONE, 540, 500, 300);
  });
  title(done ? 'YOUR OWN DIRECTION.' : 'EVERYONE CHASES TRENDS.', done ? GREEN : '#ffffff', 300, 64, done ? GREEN : undefined);
});
