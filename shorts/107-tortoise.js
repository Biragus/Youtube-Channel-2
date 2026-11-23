// SLOW AND STEADY. The speedster sprints off, then stops to rest and scroll. Kai walks at the same pace the whole way and wins.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, at, line, who, P } = K;
const { W, dark, label, makeShort, halves, npc, sitPose, confetti, pill } = require('./lib');
const CUT = 6.8; const FIN = 960;
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4); line([[FIN, fy], [FIN, fy - 300]], GOLD, 6); label('FINISH', FIN - 20, fy - 330, 30, GOLD, { spacing: 3, align: 'right' });
    label(kai ? 'STEADY' : 'SPRINTS AND STOPS', W / 2, y0 + (kai ? 90 : 170), 54, kai ? GREEN : '#ffa94d', { spacing: 5, glow: kai ? GREEN : undefined });
    if (!kai) { const x = t < 1.2 ? lerp(100, 620, ease(prog(t, 0.2, 1.2))) : 620; const rest = t > 1.4; who(npc('#e8590c'), { x, y: fy, s: 0.7, pose: rest ? sitPose : P.walk(t * 4), expr: rest ? 'smug' : 'determined', prop: rest ? 'phone' : undefined }); if (rest) at(x + 40, fy - 300, 1, () => pill("I'M WAY AHEAD", 0, 0, 22, '#ffa94d', { pad: 30 })); }
    else { const x = lerp(100, FIN + 20, prog(t, 0.2, 5.6)); const won = t > 5.6; who(won ? 'kai2' : 'kai', { x, y: fy, s: 0.7, pose: won ? 'cheer' : P.walk(t * 1.6), expr: won ? 'happy' : 'determined' }); if (won) confetti(t, 5.6, FIN, y0 + 250, 300); }
  });
});
