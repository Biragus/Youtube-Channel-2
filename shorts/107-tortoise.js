// SLOW AND STEADY. The speedster sprints off, then stops to rest and scroll. Kai walks at the same pace the whole way and wins.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, at, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, halves, npc, sitPose, confetti, pill } = require('./lib');
const CUT = 6.8; const FIN = 960;
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4); line([[FIN, fy], [FIN, fy - 300]], GOLD, 6); label('FINISH', FIN - 20, fy - 330, 30, GOLD, { spacing: 3, align: 'right' });
    label(kai ? 'STEADY' : 'SPRINTS AND STOPS', W / 2, y0 + (kai ? 90 : 170), 54, kai ? GREEN : '#ffa94d', { spacing: 5, glow: kai ? GREEN : undefined });
    if (!kai) { const x = t < 1.2 ? lerp(100, 620, ease(prog(t, 0.2, 1.2))) : 620; const rest = t > 1.4; if (rest) M.sit(npc('#e8590c'), x, fy, 0.7, t, { seat: fy - 30, expr: 'smug', prop: 'phone', armR: [22, -132] }); else M.walk(npc('#e8590c'), x, fy, 0.7, { run: true, expr: 'determined' }); if (rest) at(x + 40, fy - 300, 1, () => pill("I'M WAY AHEAD", 0, 0, 22, '#ffa94d', { pad: 30 })); }
    else { const x = lerp(100, FIN + 20, prog(t, 0.2, 5.6)); const won = t > 5.6; if (won) M.celebrate('kai2', x, fy, 0.7, t, 5.6); else M.walk('kai', x, fy, 0.7, { expr: 'determined' }); if (won) confetti(t, 5.6, FIN, y0 + 250, 300); }
  });
});
