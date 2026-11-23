// EVERY FAILURE BUILDS IT. Kai drops a FAIL boulder into the chasm. Zoom out: hundreds already fill it, and they make a bridge.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, card, line, who, P, rnd } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, ground, rock, pushPose, confetti, spot } = require('./lib');
const CUT = 7.0; const FY = 1200; const DROP = 1.6; const OUT = 2.6; const CROSS = 4.4;
module.exports = makeShort(CUT, (t) => {
  dark(800); const z = ease(prog(t, OUT, OUT + 1.4)); const bx = t < DROP ? lerp(330, 470, prog(t, 0.3, DROP)) : 520; const by = t < DROP ? FY - 80 : FY - 80 + (t - DROP) ** 2 * 1600;
  const kx = t < CROSS ? lerp(220, 340, prog(t, 0.3, DROP)) : lerp(340, 1900, prog(t, CROSS, CUT));
  camera({ x: lerp(500, 1100, z), y: lerp(1150, 1150, z), z: lerp(1.05, 0.45, z), shake: impact(t, DROP + 0.5, 8), t }, () => {
    ground(FY, -1600, 420); ground(FY, 1800, 3400); K.card(420, FY, 1380, 1600, '#07080c', 0);
    // the chasm, filled with old fails up to the edge
    for (let i = 0; i < 70; i++) rock(450 + (i % 14) * 96 + (Math.floor(i / 14) % 2) * 40, FY + 60 + Math.floor(i / 14) * 85 - (i < 14 ? 15 : 0), 52, i % 3 ? 'FAIL' : '', i % 2 ? '#5c6070' : '#495057');
    label('SUCCESS', 2400, FY - 300, 120, GOLD, { spacing: 8, glow: GOLD });
    if (by < FY + 200) rock(bx, by, 70, 'FAIL', '#868e96');
    spot(kx, FY - 200, 180, 'rgba(57,255,20,0.15)');
    who(t > CROSS + 1 ? 'kai2' : 'kai', { x: kx, y: FY, s: 0.75, pose: t < DROP ? pushPose(t) : (t < CROSS ? blend(pushPose(t), 'shrug', prog(t, DROP, DROP + 0.4)) : P.walk(t * 2)), expr: t < CROSS && t > DROP ? 'sad' : 'determined' });
  });
  title(z > 0.5 ? 'EVERY FAIL BUILDS THE BRIDGE.' : 'ANOTHER FAIL...', z > 0.5 ? GOLD : '#ffffff', 300, z > 0.5 ? 52 : 76, z > 0.5 ? GOLD : undefined);
});
