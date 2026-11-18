// Short 7: START SMALL. Kai pushes a tiny snowball labelled 1 SALE; it rolls down a long hill, growing,
// and the camera chases it with Kai running behind.
const K = require('../engine/kit');
const { GREEN, INK, lerp, prog, ease, at, card, line, circle, who, P, rnd, floaters } = K;
const { W, H, dark, label, watermark, shade, lifestyle, camera, impact } = require('./lib');
const CUT = 10.4;
const slope = (x) => 700 + x * 0.5;          // the hill's surface, rising to the left
const push = { lean: 24, tilt: 0, armL: [80, -10], armR: [80, -10], legL: [-12, 0], legR: [24, -20] };
// where the ball is: a slow push, then it rolls on its own, faster and bigger
const ballX = (t) => (t < 2 ? lerp(300, 340, prog(t, 0.5, 2)) : lerp(340, 3600, prog(t, 2, CUT) ** 1.5));
const ballR = (t) => lerp(26, 300, prog(t, 2, CUT) ** 1.25);
// how far it has turned: distance rolled divided by the radius, summed up
const SPIN = []; { let a = 0; let px = ballX(0); for (let i = 0; i <= 1000; i++) { const tt = (i / 1000) * CUT; const x = ballX(tt); a += (x - px) / ballR(tt); px = x; SPIN.push(a); } }
const spin = (t) => SPIN[Math.min(1000, Math.max(0, Math.round((t / CUT) * 1000)))];

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    const c = K.ctx(); dark(400);
    for (let i = 0; i < 60; i++) circle(rnd(i) * W, rnd(i + 3) * 1100, 2 + rnd(i + 7) * 2, `rgba(255,255,255,${0.3 + 0.4 * Math.abs(Math.sin(t * 2 + i))})`);
    const x = ballX(t); const r = ballR(t); const cy = slope(x) - r;
    const kx = t < 2.1 ? lerp(190, 230, prog(t, 0.5, 2)) : Math.max(230, x - r - 130 - Math.sin(t * 3) * 20); // Kai chases it
    const roll = prog(t, 2, CUT);
    camera({ x: lerp(300, (kx + x) / 2 + 40, ease(prog(t, 1.8, 3))), y: lerp(slope(300) - 160, (slope(kx) - 150 + cy) / 2, ease(prog(t, 1.8, 3))), z: lerp(1.5, 0.82, ease(roll)), shake: impact(t, 2.0, 6) + r * 0.012 * (t > 2 ? 1 : 0), t }, () => {
      // the hill, with pine trees to show the speed
      c.fillStyle = '#d6e6f5'; c.beginPath(); c.moveTo(-1000, slope(-1000)); c.lineTo(5000, slope(5000)); c.lineTo(5000, 6000); c.lineTo(-1000, 6000); c.closePath(); c.fill();
      line([[-1000, slope(-1000)], [5000, slope(5000)]], '#ffffff', 8);
      for (let i = 0; i < 14; i++) { const tx = 600 + i * 330; const ty = slope(tx) + 10; c.fillStyle = '#1f3b2d'; c.beginPath(); c.moveTo(tx, ty - 260); c.lineTo(tx - 80, ty - 60); c.lineTo(tx + 80, ty - 60); c.closePath(); c.fill(); card(tx - 12, ty - 70, 24, 70, '#4a3426', 4); }
      // Kai: pushes, then runs after it
      who('kai', { x: kx, y: slope(kx) + 6, s: 0.72, pose: t < 2.1 ? push : P.walk(t * 2.6), expr: t < 2.1 ? 'determined' : 'happy' });
      // snow kicked up behind the ball
      floaters(t, 60, (i, life) => circle(ballX(t - life * 0.4) - r * 0.6 - life * 120, slope(ballX(t - life * 0.4)) - 10 - life * (60 + (i % 4) * 40), 6 + r * 0.03, '#ffffff'), { every: 0.05, from: 2.1, life: 0.6 });
      // the ball: patches turn with it so it reads as rolling, the label stays upright
      at(x, cy, 1, () => {
        circle(0, 0, r, '#ffffff'); c.save(); c.rotate(spin(t));
        for (let i = 0; i < 6; i++) { const a = i * 1.05; circle(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.13, '#c9dcf0'); }
        c.strokeStyle = '#b8cde3'; c.lineWidth = Math.max(3, r * 0.04); c.beginPath(); c.arc(0, 0, r * 0.82, 0, 1.2); c.stroke(); c.restore();
        const n = [1, 10, 100, 1000, 10000][Math.min(4, Math.floor(roll * 4.999))]; const s = `${n.toLocaleString('en-US')} ${n === 1 ? 'SALE' : 'SALES'}`;
        const size = Math.min(r * 0.42, (r * 1.5) / (s.length * 0.62)); if (size > 7) label(s, 0, 2, size, n >= 1000 ? '#2b8a3e' : INK, { spacing: 1 });
      });
    });
    label('START SMALL.', W / 2, 200, 100, '#ffffff', { spacing: 8 });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
