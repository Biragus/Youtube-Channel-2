// Short 42: HOW FAST WOULD YOU FAIL? Kai hops across red FAIL pillars, faster and faster, until a green WIN pillar lifts him up.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 7.0; const FY = 1500; const N = 26; const WIN = 5.2;
const A = Array.from({ length: N }, (_, i) => 0.6 + (WIN - 0.8) * (i / N) ** 0.65);          // landing times, closer and closer together
const PX = (i) => 360 + i * 190; const PH = (i) => 110 + rnd(i + 3) * 90;
module.exports = makeShort(CUT, (t) => {
  dark(900); let i = A.findIndex((a) => a > t); if (i < 0) i = N; const prev = Math.max(0, i - 1);
  const k = i === 0 ? 0 : i >= N ? 1 : prog(t, A[prev], A[i]); const won = t > WIN;
  const winX = PX(N); const winH = lerp(0, 760, easeOut(prog(t, WIN, WIN + 0.9)));
  let kx; let ky;
  if (i >= N) { const j = ease(prog(t, A[N - 1], WIN)); kx = lerp(PX(N - 1), winX, j); ky = lerp(FY - PH(N - 1), FY - 40, j) - Math.sin(j * Math.PI) * 90; if (won) ky = FY - 40 - winH; }
  else if (i === 0) { kx = PX(0) - 150; ky = FY; }
  else { const fromY = prev === 0 && t < A[0] ? FY : FY - PH(prev); kx = lerp(PX(prev), PX(i), ease(k)); ky = lerp(fromY, FY - PH(i), k) - Math.sin(k * Math.PI) * 80; }
  const n = Math.min(99, Math.round(lerp(1, 99, (Math.min(i, N) / N) ** 1.2)));
  camera({ x: kx + 160, y: Math.min(1150, ky - 250), z: won ? lerp(1, 0.9, prog(t, WIN, WIN + 1)) : 1, shake: impact(t, WIN, 18) + (i > 0 && i < N ? impact(t, A[prev], 3, 0.15) : 0), t }, () => {
    card(-400, FY, PX(N) + 2000, 900, '#151925', 0); line([[-400, FY], [PX(N) + 1600, FY]], 'rgba(255,255,255,0.18)', 4);
    for (let j = 0; j < N; j++) { const up = easeOut(prog(t, A[j] - 0.35, A[j] - 0.05)); const down = prog(t, A[j] + 0.25, A[j] + 0.6); const h = PH(j) * up * (1 - down); if (h <= 1) continue;
      card(PX(j) - 60, FY - h, 120, h, '#3b1f1f', 8, RED, 4); if (h > 60) label('FAIL', PX(j), FY - h + 34, 28, '#ff8787', { spacing: 2 }); }
    if (t > WIN - 0.1) { spot(winX, FY - winH - 200, 400, 'rgba(57,255,20,0.3)'); card(winX - 80, FY - 40 - winH, 160, winH + 40, '#123d1c', 10, GREEN, 5); label('WIN', winX, FY - winH + 30, 44, GREEN, { spacing: 4, glow: GREEN }); }
    spot(kx, ky - 180, 200, 'rgba(255,255,255,0.08)');
    who(won ? 'kai2' : 'kai', { x: kx, y: ky, s: 0.75, pose: won ? blend(P.walk(t * 3), 'cheer', prog(t, WIN, WIN + 0.3)) : (i > 0 && k < 0.15 ? { lean: 6, tilt: 8, drop: 14, armL: [30, -20], armR: [30, -20], legL: [25, -50], legR: [25, -50] } : P.walk(t * 3)), expr: won ? 'happy' : 'determined', still: true });
    if (won) floaters(t, 30, (j, life) => card(winX - 200 + rnd(j) * 400, FY - winH - 300 + life * 260, 10, 18, ['#51cf66', '#ffd43b', '#74c0fc'][j % 3], 3), { every: 0.03, from: WIN + 0.5, life: 1.1 });
  });
  pill(won ? 'SUCCESS' : `ATTEMPT ${n}`, W / 2, 450, 44, won ? GREEN : '#ff8787', { border: won ? GREEN : 'rgba(255,135,135,0.6)' });
  title('IF YOU HAD TO FAIL 100 TIMES,', '#ffffff', 280, 52); title('HOW FAST WOULD YOU FAIL?', GOLD, 360, 60, GOLD);
});
