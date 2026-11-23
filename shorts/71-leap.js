// THEY SAID YOU CAN'T. Kai walks to the edge, looks down at the doubters, backs up, sprints and jumps the gap.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, pop, at, who } = K;
const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, impact, pill, ground, npc, confetti, spot } = require('./lib');
const CUT = 7.2; const FY = 1300; const S = 0.95; const EDGE = 380; const FAR = 760;
const T = { stop: 1.3, look: 1.7, back: 2.4, run: 3.0, jump: 4.0, air: 0.75 };
function kaiPose(t) {
  if (t < T.stop) return M.gait(60, M.smooth(t / T.stop) * 260 , FY, S, 'walk');                       // walks up to the edge, slowing down
  if (t < T.back) { const p = M.stand(320, FY, S, t, { tilt: M.keys(t, [[T.stop, 0], [T.look, 22], [T.back - 0.2, 22], [T.back, 0]]), lean: M.keys(t, [[T.stop, 0], [T.look, 10], [T.back, 0]]) }); p.look = 0.5; return p; }
  if (t < T.run) return M.gait(320, -M.smooth((t - T.back) / (T.run - T.back)) * 150, FY, S, 'walk');   // backs up
  if (t < T.jump - 0.28) return M.gait(170, ((t - T.run) / (T.jump - 0.28 - T.run)) ** 1.4 * (EDGE - 60 - 170), FY, S, 'run');
  return M.jump(t, T.jump, T.air, EDGE - 60, FY, FAR + 60, FY, S, 230);
}
module.exports = makeShort(CUT, (t) => {
  dark(900); const landed = t > T.jump + T.air; const p = kaiPose(t);
  camera({ x: lerp(500, 620, prog(t, T.run, T.jump + T.air)), y: 1160, z: 1.12, shake: impact(t, T.jump + T.air, 12), t }, () => {
    ground(FY, -600, EDGE); ground(FY, FAR, 1700); K.card(EDGE, FY + 4, FAR - EDGE, 1400, '#07080c', 0);
    ["YOU CAN'T", 'TOO RISKY', 'BE REALISTIC'].forEach((s, i) => { const dx = EDGE + 70 + i * 130; const shout = Math.abs(Math.sin(t * 6 + i)); who(npc('#495057', ['short', 'curly', 'bun'][i]), { x: dx, y: FY + 560, s: 0.45, pose: { lean: 0, tilt: -6, armL: [8, 4], armR: [100 + shout * 30, -20], legL: [6, 0], legR: [6, 0] }, expr: landed ? 'shock' : 'smug', still: true });
      if (!landed) at(dx, FY + 250 - i * 70, pop(t, 0.6 + i * 0.4), () => pill(s, 0, 0, 22, '#ff8787', { pad: 30 })); });
    spot(p.hip[0], p.hip[1] - 60, 200, 'rgba(57,255,20,0.16)');
    M.figure({ spec: landed && t > T.jump + T.air + 0.4 ? 'kai2' : 'kai', ...p, expr: landed ? 'happy' : (t < T.back ? 'worried' : 'determined'), look: p.look });
    M.dust(t, T.jump + T.air, FAR + 60, FY, 1); M.dust(t, T.jump - 0.05, EDGE - 60, FY, 0.6);
    if (landed) { confetti(t, T.jump + T.air + 0.2, FAR + 60, FY - 500); at(FAR + 60, FY - 470, pop(t, T.jump + T.air + 0.3), () => pill('I CAN DO IT.', 0, 0, 32, GOLD, { border: GOLD })); }
  });
  title(landed ? 'SO YOU DID IT.' : "THEY SAID YOU CAN'T.", landed ? GREEN : '#ffffff', 300, 72, landed ? GREEN : undefined);
});
