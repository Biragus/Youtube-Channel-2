// THE DARKEST HOUR. A clock ticks from 11 PM to 4 AM; the sky gets darker; Kai keeps working. At 5 AM the sun comes up.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who } = K;
const { W, H, dark, label, makeShort, title, camera, hop, pill, workstation, sun } = require('./lib');
const CUT = 6.8; const FY = 1450; const DAWN = 4.4;
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); const hour = Math.min(5, Math.floor(lerp(23, 29, prog(t, 0.3, DAWN))) % 24); const d = ease(prog(t, DAWN, DAWN + 1.4)); const darkness = prog(t, 0.3, DAWN);
  const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `rgb(${lerp(20, 255, d) * (1 - darkness * 0.5 * (1 - d))},${lerp(24, 150, d)},${lerp(44, 90, d)})`); g.addColorStop(1, '#0d0f16'); c.fillStyle = g; c.fillRect(0, 0, W, H);
  camera({ x: 540, y: 1100, z: 1.0, t }, () => {
    if (d > 0) sun(540, lerp(1300, 760, d), 90, t);
    c.fillStyle = '#0d0f16'; c.fillRect(-200, 1150, 1500, 900); for (let i = 0; i < 8; i++) card(i * 150 - 40, 1150 - 120 - (i * 37 % 140), 120, 140 + (i * 37 % 140), '#151925', 0);
    workstation(300, FY, 1.0, d > 0.6 ? 'kai2' : 'kai', t, { sigh: darkness > 0.7 && d === 0 ? 0.4 : 0, cheer: d > 0.6 ? prog(t, DAWN + 0.8, DAWN + 1.1) : 0, hop: d > 0.6 ? hop(t, DAWN + 1.1, 40) : 0, expr: d > 0.6 ? 'happy' : (darkness > 0.6 ? 'tired' : 'determined') });
    for (let i = 0; i < 40; i++) K.alpha(1 - d, () => circle((i * 197) % 1080, (i * 113) % 900 + 300, 2, 'rgba(255,255,255,0.7)'));
  });
  K.at(W / 2, 410, 1, () => pill(`${hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour)}:00 ${hour >= 12 && hour < 24 && hour !== 0 ? 'PM' : 'AM'}`, 0, 0, 36, d > 0 ? GOLD : '#ffffff', { border: d > 0 ? GOLD : undefined }));
  title(d > 0.3 ? 'THE SUN ALWAYS COMES UP.' : "IT'S DARKEST BEFORE DAWN.", d > 0.3 ? GOLD : '#ffffff', 300, 60, d > 0.3 ? GOLD : undefined);
});
