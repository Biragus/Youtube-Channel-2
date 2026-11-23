// WIPEOUT. Kai paddles out and falls off wave after wave; then he catches the big one and rides it.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, card, line, circle, who, floaters } = K;
const { W, H, dark, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const SEA = 1200; const RIDE = 4.0; const FALLS = [0.8, 1.8, 2.8];
module.exports = makeShort(CUT, (t) => {
  dark(800); const c = K.ctx(); const ride = t > RIDE; const falls = FALLS.filter((f) => t > f).length;
  const waveH = ride ? lerp(200, 520, ease(prog(t, RIDE - 0.4, RIDE + 0.6))) : 160; const waveX = ride ? 540 : 540 + ((t * 200) % 300) - 150;
  camera({ x: 540, y: 1100 - (ride ? 120 : 0), z: lerp(1, 0.95, prog(t, RIDE, CUT)), t }, () => {
    c.fillStyle = '#0d3b66'; c.beginPath(); c.moveTo(-400, H + 400); for (let x = -400; x <= 1500; x += 20) { const d = x - waveX; c.lineTo(x, SEA - waveH * Math.exp(-((d / 260) ** 2)) - Math.sin(x / 80 + t * 3) * 10); } c.lineTo(1500, H + 400); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 8; c.beginPath(); for (let x = waveX - 300; x <= waveX + 120; x += 20) { const d = x - waveX; const y = SEA - waveH * Math.exp(-((d / 260) ** 2)); x === waveX - 300 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke();
    const wipe = FALLS.find((f) => t > f && t < f + 0.7); const kx = ride ? waveX - 140 + Math.sin(t * 2) * 20 : waveX - 40; const ky = ride ? SEA - waveH * Math.exp(-((140 / 260) ** 2)) - 10 : SEA - 60;
    if (wipe) { at(kx, ky + (t - wipe) * 300, 1, () => who('kai', { x: 0, y: 0, s: 0.6, pose: { lean: 0, tilt: 0, armL: [150, 30], armR: [150, -30], legL: [40, 0], legR: [40, 0] }, expr: 'shock', still: true }), (t - wipe) * 5); floaters(t, 10, (i, life) => circle(kx + Math.cos(i) * life * 100, ky - Math.sin(i * 0.7) * life * 120, 8, '#ffffff'), { every: 0.02, from: wipe, life: 0.5 }); }
    else { at(kx, ky, 1, () => { card(-90, -8, 180, 16, ride ? '#2f9e44' : '#adb5bd', 8); who(ride ? 'kai2' : 'kai', { x: 0, y: -8, s: 0.6, pose: ride ? { lean: 0, tilt: -6, armL: [100, 10], armR: [100, 10], legL: [20, -20], legR: [20, -20] } : { lean: 10, tilt: 4, armL: [70, -20], armR: [70, -20], legL: [20, -30], legR: [20, -30] }, expr: ride ? 'happy' : 'determined', still: true }); }, ride ? -0.25 : 0); }
  });
  K.at(W / 2, 400, 1, () => pill(ride ? 'CAUGHT IT' : `WIPEOUTS: ${falls}`, 0, 0, 34, ride ? GREEN : '#ffffff', { border: ride ? GREEN : undefined }));
  title(ride ? 'WORTH EVERY FALL.' : 'YOU WILL FALL.', ride ? GREEN : '#ffffff', 300, 76, ride ? GREEN : undefined);
});
