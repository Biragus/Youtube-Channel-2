// BREAK THE WALL. A wall labelled COMFORT ZONE blocks Kai. He swings a wrecking ball labelled FIRST STEP; the wall shatters.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, rnd } = K; const M = require('../engine/motion'); const A = require('../engine/actions');
const { W, dark, label, makeShort, title, camera, impact, blend, hop, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const HIT = 3.0; const WX = 700;
module.exports = makeShort(CUT, (t) => {
  dark(900); const hit = t > HIT; const REL = HIT - 0.45; const sw = t < REL ? M.smooth(prog(t, 1.2, 2.3)) * 0.42 : (t < HIT ? M.lerp(0.42, -0.04, M.smoother(prog(t, REL, HIT))) : -0.04 * Math.cos((t - HIT) * 6) * Math.exp(-(t - HIT) * 2)); const bx = WX - 100 - Math.sin(sw) * 760; const by = 380 + Math.cos(sw) * 760;
  camera({ x: 560, y: 1100, z: 1.0, shake: impact(t, HIT, 26), t }, () => {
    ground(FY, -600, 2200); if (hit) { spot(WX + 300, FY - 400, 500 * prog(t, HIT, HIT + 0.8), 'rgba(255,214,120,0.4)'); label('FREEDOM', WX + 260, FY - 480, 60, GOLD, { spacing: 6, glow: GOLD }); }
    for (let r = 0; r < 10; r++) for (let c2 = 0; c2 < 2; c2++) { const i = r * 2 + c2; const bx = WX + c2 * 60 + (r % 2) * 20; const by = FY - (r + 1) * 52; const f = hit ? prog(t, HIT, HIT + 1.2) : 0; at(bx + f * (200 + rnd(i) * 400), by - f * (200 * rnd(i + 3)) + f * f * 900, 1, () => card(0, 0, 58, 50, '#a24a33', 4, '#5c2a1c', 2), f * (rnd(i) * 6)); }
    if (!hit) at(WX + 60, FY - 580, 1, () => { K.ctx().rotate(Math.PI / 2); label('COMFORT ZONE', 0, 0, 30, '#ffffff', { spacing: 4 }); });
    // the crane arm and the ball
    line([[200, 380], [WX - 100, 380]], '#495057', 14); at(WX - 100, 380, 1, () => { line([[0, 0], [0, 690]], '#adb5bd', 6); circle(0, 760, 80, '#343a40'); label('FIRST STEP', 0, 764, 22, '#ffffff', { spacing: 1 }); }, sw);
    if (hit) M.celebrate('kai2', 300, FY, 0.95, t, HIT + 0.2); else if (t < 1.2) A.go('kai', 80, M.smooth(prog(t, 0.2, 1.1)) * (WX - 100 - 160 - 80), FY, 0.95, { expr: 'determined' }); else if (t < REL) A.pull('kai', bx - 160, FY, 0.95, t, { lean: -16 - 8 * M.smooth(prog(t, 1.2, 2.3)), hands: [[bx - 72, by + 18], [bx - 70, by + 44]], expr: 'determined' }); else { const k = M.smooth(prog(t, REL, REL + 0.25)); A.push('kai', 290 - 160 + k * 60, FY, 0.95, t, { lean: M.lerp(-10, 30, k), hands: [[M.lerp(218, 400, k), M.lerp(by + 20, FY - 260, k)]], expr: 'determined' }); }
  });
  title(hit ? 'IT WAS ONLY BRICKS.' : 'THE WALL LOOKS HUGE.', hit ? GREEN : '#ffffff', 300, 74, hit ? GREEN : undefined);
});
