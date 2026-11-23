// AGAINST THE WIND. The wind of doubt blows hard against Kai. His kite (MY PRODUCT) doesn't fall: it rises higher.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, blend, hop, ground } = require('./lib');
const CUT = 6.8; const FY = 1480;
module.exports = makeShort(CUT, (t) => {
  dark(800); const c = K.ctx(); const rise = ease(prog(t, 0.5, 5.6)); const kx = lerp(560, 700, rise); const ky = lerp(1200, 520, rise);
  camera({ x: 540, y: lerp(1150, 1000, rise), z: 1.0, t }, () => {
    ground(FY);
    ['DOUBT', 'FEAR', 'CRITICS', 'NO SALES'].forEach((s, i) => { const x = ((t * 420 + i * 330) % 1100) - 200; K.alpha(Math.max(0, Math.min(1, (760 - x) / 120)), () => { line([[x, 700 + i * 170], [x + 180, 700 + i * 170]], 'rgba(200,220,255,0.35)', 5); label(s, x + 90, 672 + i * 170, 22, '#74c0fc', { spacing: 2 }); }); });
    c.strokeStyle = 'rgba(255,255,255,0.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(300, FY - 300); c.quadraticCurveTo(420, (FY - 300 + ky) / 2 + 80, kx, ky + 70); c.stroke();
    at(kx, ky + Math.sin(t * 3) * 14, 1, () => { c.fillStyle = '#2f9e44'; c.beginPath(); c.moveTo(0, -90); c.lineTo(70, 0); c.lineTo(0, 90); c.lineTo(-70, 0); c.closePath(); c.fill(); line([[0, -90], [0, 90]], '#1e7a33', 4); line([[-70, 0], [70, 0]], '#1e7a33', 4); label('MY PRODUCT', 0, -14, 16, '#ffffff', { spacing: 1 }); for (let i = 0; i < 4; i++) line([[Math.sin(t * 6 + i) * 10, 90 + i * 30], [Math.sin(t * 6 + i + 1) * 10, 120 + i * 30]], '#ffd43b', 5); }, Math.sin(t * 2) * 0.2);
    M.idle(rise > 0.95 ? 'kai2' : 'kai', 260, FY, 0.85, t, { lean: -10 + Math.sin(t * 3) * 3, tilt: -6, crouch: 10, armR: [130, -10], expr: rise > 0.7 ? 'happy' : 'determined' });
  });
  title('KITES RISE AGAINST THE WIND.', rise > 0.7 ? GREEN : '#ffffff', 300, 58, rise > 0.7 ? GREEN : undefined);
});
