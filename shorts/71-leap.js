// THEY SAID YOU CAN'T. Doubters shout from below; Kai backs up, runs and clears the gap.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, who, P } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, ground, npc, confetti, spot } = require('./lib');
const CUT = 6.8; const FY = 1300; const RUN = 2.6; const LAND = 4.0;
const kx = (t) => (t < 1.6 ? 300 : t < RUN ? lerp(300, 180, ease(prog(t, 1.6, RUN))) : t < LAND ? lerp(180, 880, prog(t, RUN, LAND)) : 880);
module.exports = makeShort(CUT, (t) => {
  dark(900); const x = kx(t); const air = t > RUN + 0.6 && t < LAND ? Math.sin(prog(t, RUN + 0.6, LAND) * Math.PI) * 260 : 0; const done = t > LAND;
  camera({ x: lerp(540, 620, prog(t, RUN, LAND)), y: 1150, z: 1.0, shake: impact(t, LAND, 14), t }, () => {
    ground(FY, -600, 420); ground(FY, 700, 1700); K.card(420, FY + 4, 280, 1400, '#07080c', 0);
    ['YOU CAN\'T', 'TOO RISKY', 'BE REALISTIC'].forEach((s, i) => { if (done) return; const dx = 470 + i * 90; who(npc('#495057'), { x: dx, y: FY + 520, s: 0.45, pose: 'point', expr: 'smug', flip: i % 2 === 1 }); at(dx, FY + 220 + i * 70, pop(t, 0.3 + i * 0.4), () => pill(s, 0, 0, 22, '#ff8787', { pad: 30 })); });
    spot(x, FY - 200 - air, 200, 'rgba(57,255,20,0.18)');
    who(done ? 'kai2' : 'kai', { x, y: FY - air - hop(t, LAND + 0.1, 40), s: 0.8, flip: t > 1.6 && t < RUN, pose: done ? blend(P.walk(t * 2), 'cheer', prog(t, LAND, LAND + 0.3)) : (t < 1.6 ? 'stand' : (air > 0 ? { lean: 10, tilt: -4, armL: [150, 10], armR: [150, 10], legL: [60, -100], legR: [10, -30] } : P.walk(t * 3))), expr: done ? 'happy' : (t < 1.6 ? 'worried' : 'determined'), look: t < 1.6 ? 0.6 : 0 });
    if (done) { confetti(t, LAND, 880, FY - 500); at(880, FY - 520, pop(t, LAND + 0.2), () => pill('I CAN DO IT.', 0, 0, 34, GOLD, { border: GOLD })); }
  });
  title(done ? 'SO YOU DID IT.' : "THEY SAID YOU CAN'T.", done ? GREEN : '#ffffff', 300, 72, done ? GREEN : undefined);
});
