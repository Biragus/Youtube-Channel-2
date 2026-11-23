// +1 KG A WEEK. Kai can barely lift the empty bar. Every week he adds one small plate. By week 52 the bar is full.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, who } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, hop, pill, ground } = require('./lib');
const CUT = 6.8; const FY = 1450;
module.exports = makeShort(CUT, (t) => {
  dark(900); const wk = Math.max(1, Math.round(prog(t, 0.4, 5.4) * 52)); const plates = Math.floor(wk / 7); const done = t > 5.4; const lift = Math.max(0, Math.sin(t * 3)); const s = lerp(0.85, 1.05, wk / 52);
  camera({ x: 540, y: 1100, z: 1.0, t }, () => {
    ground(FY); const hy = FY - s * 376 + lerp(100, -150, done ? 1 : lift) * s;
    M.idle(done ? 'kai2' : 'kai', 540, FY - (done ? hop(t, 5.5, 30) : 0), s, t, { tilt: wk < 10 ? 8 : 0, crouch: (1 - (done ? 1 : lift)) * 40, armL: [lerp(30, 160, done ? 1 : lift), lerp(-110, 10, done ? 1 : lift)], armR: [lerp(30, 160, done ? 1 : lift), lerp(-110, 10, done ? 1 : lift)], squash: done ? 0 : (1 - lift) * 0.03, expr: done ? 'happy' : 'determined' });
    line([[200, hy], [880, hy]], '#adb5bd', 12); for (let i = 0; i < plates; i++) for (const sd of [-1, 1]) card(540 + sd * (240 + i * 24) - 10, hy - 70 + i * 3, 20, 140 - i * 6, i % 2 ? '#495057' : '#343a40', 4, INK, 3);
  });
  K.at(W / 2, 410, 1, () => pill(`WEEK ${wk}`, 0, 0, 36, done ? GREEN : '#ffffff', { border: done ? GREEN : undefined }));
  title(done ? 'SMALL WINS STACK UP.' : 'START LIGHT.', done ? GREEN : '#ffffff', 300, 72, done ? GREEN : undefined);
});
