// START AS A PAWN. Kai is a pawn at the bottom of the board. Square by square he crosses it and becomes the queen.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, circle, who } = K;
const { W, dark, label, makeShort, title, camera, impact, hop, pill, confetti, spot } = require('./lib');
const CUT = 6.8; const SQ = 120; const X0 = 60; const Y0 = 420; const DONE = 4.8;
function piece(x, y, kind, col) { at(x, y, 1, () => { const c = K.ctx(); c.fillStyle = col; card(-36, 30, 72, 18, col, 6); if (kind === 'q') { c.beginPath(); c.moveTo(-30, 30); c.lineTo(-38, -30); c.lineTo(-16, -8); c.lineTo(0, -40); c.lineTo(16, -8); c.lineTo(38, -30); c.lineTo(30, 30); c.closePath(); c.fill(); circle(0, -48, 10, col); } else { c.beginPath(); c.moveTo(-26, 30); c.lineTo(-12, -6); c.lineTo(12, -6); c.lineTo(26, 30); c.closePath(); c.fill(); circle(0, -20, 20, col); } }); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const row = Math.min(7, Math.floor(prog(t, 0.4, DONE - 0.2) * 7.99)); const k = prog(t, 0.4, DONE - 0.2) * 7.99 - row; const queen = t > DONE;
  camera({ x: 540, y: 900, z: 1.0, shake: impact(t, DONE, 12), t }, () => {
    for (let r = 0; r < 8; r++) for (let c2 = 0; c2 < 8; c2++) card(X0 + c2 * SQ, Y0 + r * SQ, SQ, SQ, (r + c2) % 2 ? '#2b3142' : '#3a4158', 0);
    [[1, 0], [3, 1], [6, 0], [5, 2], [2, 3]].forEach(([c2, r]) => piece(X0 + c2 * SQ + 60, Y0 + r * SQ + 50, 'p', '#868e96'));
    const py = Y0 + (7 - (queen ? 7 : row + (row < 7 ? ease(k) : 0))) * SQ + 50; const px = X0 + 4 * SQ + 60;
    spot(px, py, 120, queen ? 'rgba(242,193,78,0.5)' : 'rgba(57,255,20,0.3)'); piece(px, py - (queen ? hop(t, DONE + 0.1, 30) : 0), queen ? 'q' : 'p', queen ? GOLD : GREEN);
    if (queen) confetti(t, DONE, px, Y0 - 100);
  });
  K.at(W / 2, 1450, 1, () => pill(queen ? 'NOW THE QUEEN' : `SQUARE ${Math.min(8, row + 1)}`, 0, 0, 32, queen ? GOLD : '#ffffff', { border: queen ? GOLD : undefined }));
  title(queen ? 'NOBODY STAYS A PAWN.' : 'EVERYONE STARTS AS A PAWN.', queen ? GOLD : '#ffffff', 300, queen ? 66 : 56, queen ? GOLD : undefined);
});
