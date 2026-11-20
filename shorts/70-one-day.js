// Story short: "ONE DAY" vs "DAY ONE". Kai sits dreaming of the trophy on a tall pillar. The words flip; he places one block, then another, and climbs.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, spot } = require('./lib'); const { thought } = K;
const CUT = 13.0; const FY = 1450; const FLIP = 3.6; const N = 9; const PX = 880; const TOPY = FY - N * 80;
const stepAt = (i) => FLIP + 0.8 + i * 0.75;
module.exports = makeShort(CUT, (t) => {
  dark(900); const built = Math.min(N, Math.floor(Math.max(0, t - FLIP - 0.8) / 0.75) + (t > FLIP + 0.8 ? 1 : 0)); const top = t > stepAt(N - 1) + 0.6;
  const kx = built ? lerp(240, PX - 100 - 0 + 0, 0) + built * 72 : 240; const ky = FY - built * 80;
  camera({ x: 560, y: lerp(1150, 900, prog(t, FLIP, stepAt(N - 1))), z: 1.0, shake: built ? impact(t, stepAt(built - 1), 4, 0.15) : 0, t }, () => {
    line([[40, FY], [1040, FY]], 'rgba(255,255,255,0.15)', 4);
    card(PX - 70, TOPY, 140, FY - TOPY, '#262b3a', 6); spot(PX, TOPY - 120, 240, 'rgba(242,193,78,0.35)');
    at(PX, TOPY - 90 + Math.sin(t * 2) * 6, 1, () => { card(-40, 40, 80, 20, '#c9a43a', 4); card(-14, 0, 28, 44, '#c9a43a', 4); circle(0, -30, 48, GOLD); label('$', 0, -26, 50, '#5c3d00', { spacing: 0 }); });
    for (let i = 0; i < built; i++) { const d = easeOut(prog(t, stepAt(i), stepAt(i) + 0.3)); card(240 + i * 72 + 20, lerp(FY - (i + 1) * 80 - 300, FY - (i + 1) * 80, d), 80, (i + 1) * 80, '#2f3a4e', 6, 'rgba(255,255,255,0.2)', 2); }
    if (t < FLIP) { thought(470, 820, 110, pop(t, 0.6), () => { K.circle(0, -10, 40, GOLD); label('$', 0, -6, 44, '#5c3d00', { spacing: 0 }); }); who('kai', { x: 240, y: FY, s: 0.85, pose: { lean: 0, tilt: 10, armL: [22, -100], armR: [22, -100], legL: [85, -85], legR: [85, -85] }, expr: 'happy', look: 0.6 }); }
    else { spot(kx, ky - 180, 200, 'rgba(57,255,20,0.18)'); who(top ? 'kai2' : 'kai', { x: top ? PX - 30 : kx + 20, y: (top ? TOPY : ky) - hop(t, stepAt(N - 1) + 0.7, 50), s: 0.75, pose: top ? blend('stand', 'cheer', prog(t, stepAt(N - 1) + 0.6, stepAt(N - 1) + 0.9)) : (Math.abs(t - stepAt(Math.max(0, built - 1))) < 0.3 ? { lean: 14, tilt: 0, armL: [60, -20], armR: [60, -20], legL: [6, 0], legR: [6, 0] } : P.walk(t * 2)), expr: top ? 'happy' : 'determined' }); }
  });
  const flipK = ease(prog(t, FLIP - 0.3, FLIP + 0.3)); K.at(W / 2, 300, 1, () => { K.ctx().scale(1, Math.abs(Math.cos(flipK * Math.PI))); label(flipK < 0.5 ? 'ONE DAY.' : 'DAY ONE.', 0, 0, 120, flipK < 0.5 ? '#ffffff' : GREEN, { spacing: 8, glow: flipK < 0.5 ? undefined : GREEN }); });
});
