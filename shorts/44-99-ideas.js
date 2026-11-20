// Short 44: 99 BAD IDEAS. Kai crumples draft after draft into the bin; the balls fly up and build one glowing lightbulb.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill, workstation } = require('./lib');
const CUT = 7.2; const FY = 1560; const BIN = [860, 1500]; const ASSEMBLE = 4.4; const LIGHT = 5.4; const N = 40;
const toss = (i) => 0.4 + 3.6 * (i / N) ** 0.8;
const bulbPt = (i) => { const a = (i / N) * Math.PI * 2; return i < N * 0.8 ? [540 + Math.cos(a / 0.8) * 150, 720 + Math.sin(a / 0.8) * 160] : [480 + ((i - N * 0.8) / (N * 0.2)) * 120, 920 + (i % 2) * 30]; };
module.exports = makeShort(CUT, (t) => {
  dark(900); const lit = t > LIGHT; const count = t < ASSEMBLE ? Math.min(99, Math.round(lerp(1, 99, prog(t, 0.4, 4.0) ** 1.1))) : 99;
  camera({ x: 540, y: lerp(1150, 1050, prog(t, ASSEMBLE, LIGHT)), z: lerp(1.05, 1.0, prog(t, 0, 4)), shake: impact(t, LIGHT, 16), t }, () => {
    card(BIN[0] - 80, BIN[1] - 160, 160, 160, '#495057', 12, INK, 5);
    for (let i = 0; i < N; i++) { const a = toss(i); if (t < a) continue; const f = prog(t, a, a + 0.5); const rest = [BIN[0] - 60 + (i % 5) * 30, BIN[1] - 170 - Math.floor(i / 5) * 22];
      let p = [lerp(560, rest[0], f), lerp(1250, rest[1], f) - Math.sin(f * Math.PI) * 260];
      if (t > ASSEMBLE) { const g = ease(prog(t, ASSEMBLE + (i / N) * 0.5, ASSEMBLE + 0.6 + (i / N) * 0.5)); const b = bulbPt(i); p = [lerp(rest[0], b[0], g), lerp(rest[1], b[1], g) - Math.sin(g * Math.PI) * 120]; }
      circle(p[0], p[1], 20, lit ? '#ffd43b' : '#e9ecef'); if (!lit) circle(p[0] - 5, p[1] - 5, 6, '#adb5bd'); }
    if (lit) { spot(540, 760, 520 * prog(t, LIGHT, LIGHT + 0.5), 'rgba(255,214,120,0.55)'); for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7 + t * 0.3; line([[540 + Math.cos(a) * 230, 740 + Math.sin(a) * 230], [540 + Math.cos(a) * 300, 740 + Math.sin(a) * 300]], 'rgba(255,214,120,0.6)', 8); } }
    workstation(400, FY, 1.0, lit ? 'kai2' : 'kai', t, { sigh: t > 4.0 && t < LIGHT ? prog(t, 4.0, 4.4) : 0, cheer: lit ? prog(t, LIGHT, LIGHT + 0.3) : 0, hop: lit ? hop(t, LIGHT + 0.3, 40) : 0, expr: lit ? 'happy' : (t > 3.2 ? 'tired' : 'determined'), glowColor: lit ? 'rgba(255,214,120,0.3)' : undefined });
  });
  pill(lit ? '1 GREAT IDEA' : `${count} BAD IDEAS`, W / 2, 450, 46, lit ? GOLD : '#ffffff', { border: lit ? GOLD : undefined });
  title(lit ? 'ONE IS ALL IT TAKES.' : 'MOST IDEAS ARE BAD.', lit ? GOLD : '#ffffff', 300, 72, lit ? GOLD : undefined);
});
