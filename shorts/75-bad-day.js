// A BAD DAY IS NOT A BAD LIFE. Kai slides down a red dip and sits, sad. Zoom out: the dip is a blip on a huge green climb.
const K = require('../engine/kit'); const { GREEN, RED, lerp, prog, ease, at, who, P } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, sitPose } = require('./lib');
const CUT = 6.8; const OUT = 2.6;
const curve = (x) => 1400 - x * 0.55 + 120 * Math.exp(-(((x - 1500) / 80) ** 2)) - 40 * Math.sin(x / 260);
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const z = ease(prog(t, OUT, OUT + 1.8)); const kx = lerp(1440, 1500, ease(prog(t, 0.4, 1.4)));
  camera({ x: lerp(1500, 1500, z), y: lerp(curve(1500) - 100, 700, z), z: lerp(1.6, 0.38, z), t }, () => {
    c.lineWidth = 14; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let x = 0; x < 3200; x += 10) { const dip = x > 1430 && x < 1520; c.strokeStyle = dip ? RED : GREEN; c.beginPath(); c.moveTo(x, curve(x)); c.lineTo(x + 10, curve(x + 10)); c.stroke(); }
    who(t > 5 ? 'kai2' : 'kai', { x: kx, y: curve(kx) - 4 - (t > 5 ? hop(t, 5.1, 40) : 0), s: 0.45, pose: t < 1.4 ? P.walk(t * 2) : (t < 5 ? sitPose : blend(sitPose, 'cheer', prog(t, 5, 5.4))), expr: t > 5 ? 'happy' : 'sad' });
  });
  title('A BAD DAY', '#ffffff', 290, 76); if (t > OUT + 0.6) title('IS NOT A BAD LIFE.', GREEN, 380, 70, GREEN);
});
