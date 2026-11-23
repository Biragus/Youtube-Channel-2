// A BAD DAY IS NOT A BAD LIFE. Kai walks down into a red dip and sits, head down. Zoom out: it's a blip on a huge green climb. He gets up and walks on.
const K = require('../engine/kit'); const { GREEN, RED, lerp, prog } = K;
const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera } = require('./lib');
const CUT = 7.0; const OUT = 2.8; const RISE = 4.8; const S = 0.42;
const curve = (x) => 1400 - x * 0.55 + 120 * Math.exp(-(((x - 1500) / 80) ** 2)) - 40 * Math.sin(x / 260);
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const z = M.smooth(prog(t, OUT, OUT + 1.8));
  let p; let expr;
  if (t < 1.6) { p = M.onGround(M.gait(1400, M.smooth(prog(t, 0, 1.6)) * 100, 0, S, 'walk'), curve); expr = 'sad'; }
  else if (t < RISE + 0.6) { const x = 1500; const g = curve(x); const sit = M.keys(t, [[1.6, 0], [2.2, 1], [RISE, 1], [RISE + 0.6, 0]]);
    p = { hip: [x, g - lerp(150, 60, sit) * S], ground: g, s: S, footL: [x + lerp(-20, 70, sit) * S, g], footR: [x + lerp(20, 90, sit) * S, g], lean: lerp(0, 10, sit), tilt: lerp(0, 24, sit) * (t < RISE ? 1 : 1 - prog(t, RISE, RISE + 0.6)), armL: [lerp(8, 30, sit), -40 * sit], armR: [lerp(8, 30, sit), -40 * sit] }; expr = t < RISE ? 'sad' : 'determined'; }
  else { p = M.onGround(M.gait(1500, (t - RISE - 0.6) * 120, 0, S, 'walk'), curve); expr = 'happy'; }
  camera({ x: 1500, y: lerp(curve(1500) - 100, 700, z), z: lerp(1.6, 0.38, z), t }, () => {
    c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let x = 0; x < 3200; x += 10) { const dip = x > 1430 && x < 1520; c.strokeStyle = dip ? RED : GREEN; c.beginPath(); c.moveTo(x, curve(x)); c.lineTo(x + 10, curve(x + 10)); c.stroke(); }
    M.figure({ spec: t > RISE + 1 ? 'kai2' : 'kai', ...p, expr });
  });
  title('A BAD DAY', '#ffffff', 290, 76); if (t > OUT + 0.6) title('IS NOT A BAD LIFE.', GREEN, 380, 70, GREEN);
});
