// CUT THE STRINGS. Kai moves like a puppet, strings labelled WHAT WILL THEY THINK? He cuts them one by one and stands on his own.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, who, P } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const SNIP = [2.0, 2.8, 3.6]; const S = ['OPINIONS', 'APPROVAL', 'FEAR'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const cut = SNIP.filter((a) => t > a).length; const free = cut === 3;
  camera({ x: 540, y: 1100, z: 1.0, shake: SNIP.reduce((s, a) => s + impact(t, a, 6, 0.2), 0), t }, () => {
    ground(FY); card(240, 560, 600, 30, '#6b4a2f', 8);
    const jerk = free ? 0 : Math.sin(t * 5); const hands = [[400, 1020 - jerk * 40], [680, 1020 + jerk * 40], [540, 900]];
    S.forEach((s, i) => { const done = t > SNIP[i]; const [hx, hy] = hands[i]; const tx = 300 + i * 240; if (!done) { line([[tx, 590], [hx, hy]], 'rgba(255,255,255,0.6)', 3); label(s, (tx + hx) / 2 + 40, (590 + hy) / 2, 22, '#9aa3b5', { spacing: 2 }); } else { const f = prog(t, SNIP[i], SNIP[i] + 0.6); line([[tx, 590], [tx + 10, 590 + 200 * (1 - f)]], 'rgba(255,255,255,0.4)', 3); } });
    spot(540, FY - 250, 260, free ? 'rgba(57,255,20,0.25)' : 'rgba(255,255,255,0.05)');
    const pose = free ? blend('stand', 'power', prog(t, 3.8, 4.4)) : { lean: 0, tilt: jerk * 8, armL: [120 + jerk * 30, -20], armR: [120 - jerk * 30, -20], legL: [10 + jerk * 10, 0], legR: [10 - jerk * 10, 0] };
    who(free && t > 4.6 ? 'kai2' : 'kai', { x: 540, y: FY - (free ? hop(t, 4.6, 30) : Math.abs(jerk) * 20), s: 0.95, pose, expr: free ? 'smug' : 'worried', still: true });
    if (!free) at(lerp(800, 560, prog(t, 1.4, 1.9)), 860, 1, () => { line([[-30, -30], [30, 30]], '#adb5bd', 8); line([[30, -30], [-30, 30]], '#adb5bd', 8); });
  });
  title(free ? 'MOVE ON YOUR OWN.' : 'WHO IS PULLING THE STRINGS?', free ? GREEN : '#ffffff', 300, free ? 70 : 54, free ? GREEN : undefined);
});
