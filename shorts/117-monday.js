// "I'LL START MONDAY." Calendar pages flip: every Monday crossed out, the pile of Mondays grows. Kai starts on a Tuesday.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, card, line, who, rnd } = K;
const { W, dark, label, makeShort, halves, npc, workstation, sitPose } = require('./lib');
const CUT = 6.8;
module.exports = makeShort(CUT, (t) => {
  dark(960); const mondays = Math.floor(prog(t, 0.3, 6) * 13);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'STARTS TODAY' : "I'LL START MONDAY", W / 2, y0 + (kai ? 90 : 170), 54, kai ? GREEN : '#ff8787', { spacing: 5, glow: kai ? GREEN : undefined });
    if (!kai) { K.card(150, fy - 160, 360, 160, '#3b3f5c', 30); who(npc('#e8590c'), { x: 330, y: fy - 70, s: 0.75, pose: sitPose, expr: 'neutral' });
      for (let i = 0; i < mondays; i++) at(780 + (rnd(i) - 0.5) * 60, fy - 40 - i * 18, 1, () => { card(-80, -50, 160, 100, '#f1f3f5', 6, INK, 3); card(-80, -50, 160, 24, RED, 6); label('MONDAY', 0, -38, 16, '#ffffff', { spacing: 1 }); line([[-50, -10], [50, 40]], RED, 6); line([[50, -10], [-50, 40]], RED, 6); }, (rnd(i) - 0.5) * 0.4); }
    else { workstation(330, fy, 0.85, t > 4 ? 'kai2' : 'kai', t, { cheer: t > 5 ? 0.6 + 0.4 * Math.sin(t * 4) : 0, expr: 'determined', glowColor: 'rgba(57,255,20,0.25)' }); at(780, y0 + 330, 1, () => { card(-100, -60, 200, 120, '#f1f3f5', 8, INK, 3); card(-100, -60, 200, 30, GREEN, 8); label('TUESDAY', 0, -45, 18, INK, { spacing: 1 }); label('DAY 1', 0, 20, 34, INK, { spacing: 2 }); }); const prog2 = Math.min(100, Math.round(prog(t, 0.3, 6) * 100)); K.pill ? 0 : 0; label(`PRODUCT ${prog2}%`, 780, y0 + 470, 26, GREEN, { spacing: 2 }); }
  });
});
