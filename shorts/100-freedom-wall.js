// ONE BRICK A DAY. Kai lays one brick each day; nothing to see for weeks. By day 365 the bricks spell FREEDOM.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, hop, pill, ground, confetti, spot } = require('./lib');
const CUT = 7.0; const FY = 1400; const DONE = 5.6;
// FREEDOM in a 5-row pixel font, each letter 3 wide
const FONT = { F: ['111', '100', '110', '100', '100'], R: ['110', '101', '110', '101', '101'], E: ['111', '100', '110', '100', '111'], D: ['110', '101', '101', '101', '110'], O: ['111', '101', '101', '101', '111'], M: ['101', '111', '111', '101', '101'] };
const CELLS = []; 'FREEDOM'.split('').forEach((ch, li) => FONT[ch].forEach((row, r) => row.split('').forEach((v, cI) => { if (v === '1') CELLS.push([li * 4 + cI, r]); }))); CELLS.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
const BS = 30; const X0 = 540 - (27 * BS) / 2; const Y0 = FY - 5 * BS - 40;
module.exports = makeShort(CUT, (t) => {
  dark(900); const n = Math.floor(prog(t, 0.4, DONE) ** 1.3 * CELLS.length); const done = t > DONE;
  camera({ x: 540, y: lerp(1250, 1150, prog(t, 0, DONE)), z: lerp(1.4, 1.0, ease(prog(t, 0.4, DONE))), t }, () => {
    ground(FY); if (done) spot(540, Y0 + 80, 600, 'rgba(242,193,78,0.25)');
    for (let i = 0; i < n; i++) { const [cx, r] = CELLS[i]; card(X0 + cx * BS, Y0 + r * BS, BS - 3, BS - 3, done ? '#e0a92e' : '#b5543c', 3, '#5c2a1c', 2); }
    const [nx] = CELLS[Math.min(n, CELLS.length - 1)]; const kx = done ? 70 : Math.min(800, X0 + nx * BS - 60);
    if (done) M.celebrate('kai2', kx, FY, 0.6, t, DONE); else { const b = Math.abs(Math.sin(t * 5)); M.idle('kai', kx, FY, 0.6, t, { crouch: 40 * b, lean: 18 * b, handL: [kx + 50, FY - 150 + 60 * b], handR: [kx + 80, FY - 150 + 60 * b], elbow: -1, expr: 'determined' }); }
    if (done) confetti(t, DONE, 540, Y0 - 300, 700);
  });
  K.at(W / 2, 410, 1, () => pill(`DAY ${Math.max(1, Math.round(prog(t, 0.4, DONE) * 365))}`, 0, 0, 34, done ? GOLD : '#ffffff', { border: done ? GOLD : undefined }));
  title(done ? 'BRICK BY BRICK.' : 'ONE BRICK A DAY.', done ? GOLD : '#ffffff', 300, 76, done ? GOLD : undefined);
});
