// EVERY FAILURE BUILDS IT. Kai pushes a FAIL boulder to the edge, it drops into the chasm, he slumps. Zoom out: hundreds fill the gap. He walks across.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, at } = K;
const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, impact, ground, rock, spot } = require('./lib');
const CUT = 7.2; const FY = 1200; const S = 0.85; const EDGE = 420; const PUSH = 1.8; const OUT = 2.8; const CROSS = 4.4;
module.exports = makeShort(CUT, (t) => {
  dark(800); const z = M.smooth(prog(t, OUT, OUT + 1.4)); const R = 70;
  const bx = t < PUSH ? lerp(260, EDGE + 10, M.smooth(prog(t, 0.2, PUSH))) : EDGE + 10 + (t - PUSH) * 60; const by = t < PUSH ? FY - R : FY - R + (t - PUSH) ** 2 * 1700;
  let p; let hands = null; let expr = 'determined';
  if (t < PUSH) { p = M.gait(70, M.smooth(prog(t, 0.2, PUSH)) * (EDGE + 10 - 260), FY, S, 'walk', { stride: 90, lean: 22 }); p.hip[0] += 0; hands = [[bx - R + 4, by - 10], [bx - R + 10, by + 20]]; }
  else if (t < CROSS) { p = M.stand(EDGE - R - 40 + 30, FY, S, t, { tilt: M.keys(t, [[PUSH, 0], [PUSH + 0.6, 26], [CROSS - 0.4, 26], [CROSS, 0]]), crouch: M.keys(t, [[PUSH, 0], [PUSH + 0.6, 14], [CROSS - 0.4, 14], [CROSS, 0]]) }); expr = t < OUT + 0.8 ? 'sad' : 'hopeful'; }
  else { p = M.gait(EDGE - R - 10, (t - CROSS) * 520, FY, S, 'run'); expr = 'happy'; }
  camera({ x: lerp(480, 1150, z), y: 1150, z: lerp(1.15, 0.48, z), shake: impact(t, PUSH + 0.55, 10), t }, () => {
    ground(FY, -1600, EDGE); ground(FY, 1800, 3400); K.alpha(1, () => {}); K.card(EDGE, FY, 1380, 1600, '#07080c', 0);
    for (let i = 0; i < 70; i++) rock(470 + (i % 14) * 94 + (Math.floor(i / 14) % 2) * 40, FY + 60 + Math.floor(i / 14) * 85 - (i < 14 ? 15 : 0), 52, i % 3 && t > OUT + 1 ? 'FAIL' : '', i % 2 ? '#5c6070' : '#495057');
    K.alpha(1 - prog(t, OUT, OUT + 0.9), () => K.card(EDGE, FY - 10, 1380, 1600, '#07080c', 0)); label('SUCCESS', 1990, FY - 230, 90, GOLD, { spacing: 8, glow: GOLD });
    if (by < FY + 300) at(bx, by, 1, () => rock(0, 0, R, 'FAIL', '#868e96'), (bx - 260) / R);
    if (t > CROSS) spot(p.hip[0], p.hip[1], 220, 'rgba(57,255,20,0.15)');
    M.figure({ spec: t > CROSS + 1.2 ? 'kai2' : 'kai', ...p, handL: hands && hands[0], handR: hands && hands[1], elbow: -1, expr, armL: p.armL, armR: p.armR });
  });
  title(z > 0.5 ? 'EVERY FAIL BUILDS THE BRIDGE.' : 'ANOTHER FAIL...', z > 0.5 ? GOLD : '#ffffff', 300, z > 0.5 ? 52 : 76, z > 0.5 ? GOLD : undefined);
});
