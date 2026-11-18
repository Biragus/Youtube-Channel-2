// Short 7: START SMALL. Kai pushes a tiny snowball labelled 1 SALE; it rolls down the hill and grows.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, rnd } = K;
const { W, H, dark, spot, label, watermark, shade, lifestyle } = require('./lib');
const CUT = 10.4;
const slope = (x) => 640 + x * 0.9; // the hill's surface
const push = { lean: 22, tilt: 0, armL: [80, -10], armR: [80, -10], legL: [-10, 0], legR: [22, -20] };

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    const c = K.ctx(); dark(500);
    for (let i = 0; i < 50; i++) circle(rnd(i) * W, rnd(i + 3) * 900, 2 + rnd(i + 7) * 2, 'rgba(255,255,255,0.55)');
    c.fillStyle = '#d6e6f5'; c.beginPath(); c.moveTo(0, slope(0)); c.lineTo(W, slope(W)); c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill();
    line([[0, slope(0)], [W, slope(W)]], '#ffffff', 6);
    label('START SMALL.', W / 2, 220, 100, '#ffffff', { spacing: 8 });
    // the ball: slow push, then it rolls on its own and keeps growing
    const roll = prog(t, 2.0, 9.2); const x = t < 2 ? lerp(250, 290, prog(t, 0.6, 2)) : lerp(290, 760, ease(roll)); const r = lerp(26, 290, roll ** 1.6);
    const n = [1, 10, 100, 1000, 10000][Math.min(4, Math.floor(roll * 4.999))];
    // Kai: pushes, then watches it go
    const kx = t < 2 ? lerp(150, 190, prog(t, 0.6, 2)) : 190; spot(kx, slope(kx) - 200, 240);
    who('kai', { x: kx, y: slope(kx) + 4, s: 0.7, pose: t < 2.1 ? push : 'cheer', expr: t < 2.1 ? 'determined' : 'happy' });
    const cy = slope(x) - r * 1.05; const ang = (x - 250) / Math.max(30, r);
    at(x, cy, 1, () => { circle(0, 0, r, '#ffffff'); c.strokeStyle = '#c9dcf0'; c.lineWidth = Math.max(3, r * 0.05); for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(0, 0, r * (0.45 + i * 0.18), ang + i, ang + i + 1.4); c.stroke(); }
      const s = `${n.toLocaleString('en-US')} ${n === 1 ? 'SALE' : 'SALES'}`; const size = Math.min(r * 0.42, (r * 1.6) / (s.length * 0.62)); if (size > 8) label(s, 0, 2, size, n >= 1000 ? '#2b8a3e' : INK, { spacing: 1 }); });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
