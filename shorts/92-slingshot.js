// SETBACKS PULL YOU BACK. Each setback pulls Kai further back in a giant slingshot... then it launches him far beyond where he was.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, lerp, prog, ease, easeOut, pop, at, card, line, who } = K;
const { W, dark, label, makeShort, title, camera, impact, hop, pill, ground, confetti } = require('./lib');
const CUT = 6.8; const FY = 1450; const AX = 640; const FIRE = 3.6; const SET = ['LOST JOB', 'NO SALES', 'BAD REVIEW'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const pull = Math.min(3, Math.floor(prog(t, 0.4, FIRE - 0.2) * 3.01)); const back = lerp(0, 360, ease(prog(t, 0.4, FIRE - 0.2)));
  const fly = prog(t, FIRE, FIRE + 1.4); const kx = t < FIRE ? AX - 60 - back : lerp(AX - 420, 2400, easeOut(fly)); const ky = t < FIRE ? FY - 260 : FY - 260 - Math.sin(fly * Math.PI) * 500 + (fly >= 1 ? 0 : 0);
  camera({ x: t < FIRE ? 540 : lerp(540, 2200, easeOut(fly)), y: 1100, z: t < FIRE ? 1 : lerp(1, 0.8, Math.sin(fly * Math.PI)), shake: impact(t, FIRE, 16), t }, () => {
    ground(FY, -600, 3400); card(AX - 20, FY - 300, 40, 300, '#6b4a2f', 8); card(AX + 140, FY - 300, 40, 300, '#6b4a2f', 8);
    if (t < FIRE) { line([[AX, FY - 290], [kx + 40, ky]], '#c9a43a', 8); line([[AX + 160, FY - 290], [kx + 40, ky]], '#c9a43a', 8); }
    SET.forEach((s, i) => { if (i < pull && t < FIRE) at(AX - 300 - i * 20, FY - 560 - i * 70, 1, () => pill(s, 0, 0, 24, '#ff8787', { pad: 30 })); });
    label('YOUR GOAL', 2300, FY - 360, 50, GOLD, { spacing: 4, glow: GOLD }); line([[2300, FY], [2300, FY - 300]], GOLD, 6);
    who(fly >= 1 ? 'kai2' : 'kai', { x: fly >= 1 ? 2200 : kx, y: fly >= 1 ? FY - hop(t, FIRE + 1.5, 40) : ky + 260 * (t < FIRE ? 1 : 0), s: 0.75, pose: fly >= 1 ? 'cheer' : (t < FIRE ? { lean: -20, tilt: 6, armL: [80, -20], armR: [80, -20], legL: [-20, 0], legR: [30, -20] } : { lean: 10, tilt: 0, armL: [160, 10], armR: [160, 10], legL: [40, -60], legR: [10, -20] }), expr: fly >= 1 ? 'happy' : (t < FIRE ? 'worried' : 'determined') });
    if (fly >= 1) confetti(t, FIRE + 1.4, 2200, FY - 600);
  });
  title(t > FIRE ? 'IT WAS LOADING YOU UP.' : 'PULLED BACK AGAIN?', t > FIRE ? GREEN : '#ffffff', 300, 68, t > FIRE ? GREEN : undefined);
});
