// ONE LIGHT. In the dark, Kai lights his candle. He uses it to light another, and another; the whole room glows.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, circle, who, P } = K; const M = require('../engine/motion'); const A = require('../engine/actions');
const { W, dark, label, makeShort, title, camera, hop, npc, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const N = 6; const litAt = (i) => (i === 0 ? 0.8 : 1.6 + (i - 1) * 0.6);
function candle(x, y, lit, t) { card(x - 14, y - 90, 28, 90, '#f1f3f5', 6); if (lit) { spot(x, y - 120, 140, 'rgba(255,200,120,0.35)'); const c = K.ctx(); c.fillStyle = '#ffa94d'; c.beginPath(); c.ellipse(x + Math.sin(t * 10) * 2, y - 112, 10, 22, 0, 0, Math.PI * 2); c.fill(); } }
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const lit = Array.from({ length: N }, (_, i) => t > litAt(i)).filter(Boolean).length; c.fillStyle = `rgba(0,0,0,${0.6 * (1 - lit / N)})`;
  camera({ x: 540, y: 1100, z: lerp(1.3, 1.0, prog(t, 0.5, 4.8)), t }, () => {
    K.line([[-200, FY], [1300, FY]], 'rgba(255,255,255,0.15)', 4);
    for (let i = 1; i < N; i++) { const x = 190 + (i - 1) * 150; M.idle(npc(['#1c7ed6', '#e8590c', '#9c36b5', '#2f9e44', '#f08c00'][i - 1], ['curly', 'short', 'bun', 'long', 'short'][i - 1]), x, FY, 0.55, t + i, { tilt: 4, armR: [60, -60], expr: t > litAt(i) ? 'happy' : 'sad' }); candle(x + 50, FY - 190, t > litAt(i), t); }
    const pos = (i) => Math.max(120, 190 + (i - 1) * 150 - 90); const ks = [[0, 120], [litAt(0) + 0.2, 120]]; for (let i = 1; i < N; i++) ks.push([litAt(i) - 0.12, pos(i)]); ks.push([litAt(N - 1) + 0.3, pos(N - 1)]); const kxAt = (tt) => M.keys(tt, ks); const kx = kxAt(t); const moving = Math.abs(kxAt(t + 0.05) - kx) > 0.6;
    if (lit >= N) M.celebrate('kai2', kx, FY, 0.6, t, litAt(N - 1) + 0.3); else if (moving) M.walk('kai', kx, FY, 0.6, { handR: [kx + 50, FY - 190], expr: 'smile' }); else A.work('kai', kx, FY, 0.6, t, { handR: [kx + 50, FY - 190], expr: 'smile' }); if (lit < N) candle(kx + 50, FY - 180, t > litAt(0), t);
  });
  K.tint('#000000', 0.5 * (1 - lit / N));
  title(lit >= N ? 'SHARE WHAT YOU KNOW.' : 'ONE LIGHT IS ENOUGH TO START.', lit >= N ? GOLD : '#ffffff', 300, lit >= N ? 66 : 52, lit >= N ? GOLD : undefined);
});
