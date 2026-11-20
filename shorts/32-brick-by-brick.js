// Short 32: BRICK BY BRICK. Each day a brick; in a year, a house. Kai lays them, the walls rise, the lights come on.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 10.6; const FY = 1450; const HX = 600; const BW = 70; const BH = 36; const COLS = 8; const ROWS = 12; const N = COLS * ROWS; const BUILT = 8.4;
const brickAt = (i) => 0.8 + (BUILT - 0.8) * (i / N) ** 0.85;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const n = Array.from({ length: N }, (_, i) => i).filter((i) => t > brickAt(i)).length; const done = t > BUILT; const lights = prog(t, BUILT + 0.2, BUILT + 0.8);
  camera({ x: 560, y: lerp(1250, 1050, prog(t, 0, BUILT)), z: lerp(1.35, 0.95, ease(prog(t, 0.5, BUILT))), t }, () => {
    line([[-200, FY], [1300, FY]], 'rgba(255,255,255,0.2)', 5);
    for (let i = 0; i < n; i++) { const r = Math.floor(i / COLS); const col = i % COLS; const off = r % 2 ? BW / 2 : 0; const x = HX - (COLS * BW) / 2 + col * BW + off - (r % 2 ? BW / 2 : 0); const y = FY - (r + 1) * BH; const drop = easeOut(prog(t, brickAt(i), brickAt(i) + 0.18));
      if ((r >= 3 && r <= 7) && (col === 1 || col === 2 || col === 5 || col === 6)) { card(x + 2, y + 2, BW - 4, BH - 4, `rgba(255,214,120,${0.15 + 0.75 * lights})`, 2); continue; } // windows
      if (r <= 5 && (col === 3 || col === 4)) { card(x + 2, y + 2, BW - 4, BH - 4, '#4a2f1d', 2); continue; } // door
      card(x + 2, lerp(y - 300, y, drop) + 2, BW - 4, BH - 4, i % 3 ? '#b5543c' : '#a24a33', 4, '#5c2a1c', 2); }
    if (done) { c.fillStyle = '#3a2a4a'; c.beginPath(); const ry = FY - ROWS * BH; const k = easeOut(prog(t, BUILT, BUILT + 0.5)); c.moveTo(HX - 330, ry); c.lineTo(HX, ry - 260 * k); c.lineTo(HX + 330, ry); c.closePath(); c.fill(); spot(HX, FY - 250, 500 * lights, 'rgba(255,214,120,0.25)'); }
    // Kai carries bricks back and forth
    const walk = Math.sin(t * 2.2); const kx = lerp(110, 230, (walk + 1) / 2); spot(kx, FY - 200, 200, 'rgba(57,255,20,0.15)');
    who(done ? 'kai2' : 'kai', { x: done ? 180 : kx, y: FY - hop(t, BUILT + 0.6, 60), s: 0.85, flip: !done && Math.cos(t * 2.2) < 0, pose: done ? blend('stand', 'cheer', prog(t, BUILT + 0.4, BUILT + 0.8)) : { ...P.walk(t * 2), armL: [30, -100], armR: [30, -100] }, expr: done ? 'happy' : 'determined' });
    if (!done) at(done ? 0 : kx + (Math.cos(t * 2.2) < 0 ? -40 : 40), FY - 200, 0.6, () => card(-BW / 2, -BH / 2, BW, BH, '#b5543c', 4, '#5c2a1c', 2));
  });
  K.at(W / 2, 450, 1, () => { K.card(-170, -44, 340, 88, '#0d1018', 44, 'rgba(255,255,255,0.4)', 3); label(`DAY ${Math.max(1, Math.round(n / N * 365))}`, 0, 3, 40, '#ffffff', { spacing: 4 }); });
  title('BRICK BY BRICK.', done ? GOLD : '#ffffff', 300, 86, done ? GOLD : undefined);
});
