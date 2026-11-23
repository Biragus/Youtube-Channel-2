// CONSISTENCY vs PERFECTIONISM. Blocks rain down; Kai stacks every one, even the crooked ones; the perfectionist throws them away.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, card, line, who, rnd } = K;
const { W, dark, label, makeShort, title, camera, hop, pill, ground, npc, confetti, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const DROPS = Array.from({ length: 14 }, (_, i) => 0.4 + i * 0.36); const GOAL = FY - 14 * 56;
module.exports = makeShort(CUT, (t) => {
  dark(900); const n = DROPS.filter((d) => t > d + 0.3).length; const won = n >= 14;
  camera({ x: 540, y: lerp(1150, 1000, prog(t, 0, 5.6)), z: 1.0, t }, () => {
    ground(FY); line([[60, GOAL], [1020, GOAL]], won ? GREEN : 'rgba(242,193,78,0.5)', 4); label('SUCCESS', 540, GOAL - 40, 40, won ? GREEN : GOLD, { spacing: 6, glow: won ? GREEN : GOLD });
    for (const [px, kai] of [[320, true], [760, false]]) { card(px - 110, FY - 30, 220, 30, '#3a4158', 6);
      DROPS.forEach((d, i) => { if (t < d) return; const f = easeOut(prog(t, d, d + 0.3)); const rot = (rnd(i) - 0.5) * 0.5; const crooked = rnd(i + 7) > 0.5;
        if (kai) { at(px + (rnd(i) - 0.5) * 30, lerp(GOAL - 400, FY - 30 - i * 56 - 28, f), 1, () => card(-70, -26, 140, 52, crooked ? '#2b8a3e' : '#2f9e44', crooked ? 2 : 10, INK, 3), crooked ? rot * f : 0); }
        else { const keep = !crooked && i < 4; const toss = prog(t, d + 0.3, d + 0.9); at(px + (keep ? 0 : toss * 500), lerp(GOAL - 400, FY - 30 - (keep ? i * 56 : 0) - 28, f) - (keep ? 0 : Math.sin(toss * Math.PI) * 200 - toss * 400), 1, () => card(-70, -26, 140, 52, '#868e96', crooked ? 2 : 10, INK, 3), crooked ? rot : 0); } }); }
    label('CONSISTENCY', 320, FY + 60, 34, GREEN, { spacing: 3 }); label('PERFECTIONISM', 760, FY + 60, 34, '#da77f2', { spacing: 3 });
    spot(160, FY - 200, 160, 'rgba(57,255,20,0.15)'); who(won ? 'kai2' : 'kai', { x: 150, y: FY - hop(t, 5.8, 40), s: 0.65, pose: won ? 'cheer' : { lean: 0, tilt: 0, armL: [100, -20], armR: [100, -20], legL: [6, 0], legR: [6, 0] }, expr: won ? 'happy' : 'determined' });
    who(npc('#9c36b5', 'bun'), { x: 950, y: FY, s: 0.65, flip: true, pose: 'shrug', expr: 'worried' });
    if (won) confetti(t, 5.8, 320, GOAL - 200);
  });
  title('DONE BEATS PERFECT.', won ? GREEN : '#ffffff', 300, 76, won ? GREEN : undefined);
});
