// BUSY vs PROGRESS. Top: running flat out on a treadmill, going nowhere (busy). Bottom: Kai walks on a real road and gets somewhere.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, halves, npc, pill, confetti } = require('./lib');
const CUT = 6.8; const DONE = 5.6;
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740;
    label(kai ? 'PROGRESS' : 'BUSY', W / 2, y0 + (kai ? 90 : 170), 58, kai ? GREEN : '#ff8787', { spacing: 8, glow: kai ? GREEN : undefined });
    if (!kai) { card(300, fy - 30, 480, 30, '#343a40', 10); line([[300, fy - 30], [300, fy - 260]], '#495057', 10); for (let i = 0; i < 8; i++) line([[300 + ((i * 60 - t * 400) % 480 + 480) % 480, fy - 24], [320 + ((i * 60 - t * 400) % 480 + 480) % 480, fy - 24]], '#868e96', 4); M.march(npc('#e8590c'), 540, fy - 30, 0.75, t * 400, { run: true, expr: 'tired' }); at(860, y0 + 330, 1, () => pill('0 KM', 0, 0, 28, '#ff8787')); }
    else { line([[0, fy], [1080, fy]], 'rgba(255,255,255,0.2)', 4); const x = lerp(140, 900, prog(t, 0.3, DONE)); for (let i = 0; i < 10; i++) line([[i * 120 + 20, fy + 20], [i * 120 + 80, fy + 20]], 'rgba(255,255,255,0.15)', 4); line([[920, fy], [920, fy - 280]], GOLD, 6); label('GOAL', 920, fy - 310, 30, GOLD, { spacing: 3 }); if (t > DONE) M.celebrate('kai2', x, fy, 0.75, t, DONE); else M.walk('kai', x, fy, 0.75, { expr: 'determined' }); at(200, y0 + 330, 1, () => pill(`${Math.round(prog(t, 0.3, DONE) * 42)} KM`, 0, 0, 28, GREEN, { border: GREEN })); if (t > DONE) confetti(t, DONE, 900, y0 + 250, 300); }
  });
});
