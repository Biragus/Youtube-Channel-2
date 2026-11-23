// DON'T CHASE. BUILD SOMETHING GOOD. Top: he runs around with a net, catching nothing. Bottom: Kai tends his garden; $ butterflies come to him.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, circle, who, P, rnd } = K;
const { W, dark, label, makeShort, halves, npc } = require('./lib');
const CUT = 6.8;
function fly(x, y, t, i, col) { at(x, y, 1, () => { const f = Math.abs(Math.sin(t * 14 + i)); for (const s of [-1, 1]) { K.ctx().fillStyle = col; K.ctx().beginPath(); K.ctx().ellipse(s * 14 * f, -4, 14 * f + 2, 18, s * 0.4, 0, Math.PI * 2); K.ctx().fill(); } circle(0, 0, 5, INK); }); }
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'BUILD SOMETHING GOOD' : 'CHASING CUSTOMERS', W / 2, y0 + (kai ? 90 : 170), 52, kai ? GREEN : '#ff8787', { spacing: 5, glow: kai ? GREEN : undefined });
    if (!kai) { const x = 300 + Math.sin(t * 1.8) * 230; who(npc('#e8590c'), { x, y: fy, s: 0.75, flip: Math.cos(t * 1.8) < 0, pose: { ...P.walk(t * 3), armR: [120 + Math.sin(t * 9) * 40, -20] }, expr: 'worried' }); line([[x + (Math.cos(t * 1.8) < 0 ? -1 : 1) * 60, fy - 300], [x + (Math.cos(t * 1.8) < 0 ? -1 : 1) * 160, fy - 380 + Math.sin(t * 9) * 40]], '#adb5bd', 5);
      for (let i = 0; i < 3; i++) fly(x + 260 + Math.sin(t * 2 + i * 2) * 80, fy - 380 + Math.cos(t * 3 + i) * 60, t, i, '#9aa3b5'); }
    else { for (let i = 0; i < 7; i++) { const fx = 480 + i * 80; const h = lerp(20, 120, prog(t, 0.4 + i * 0.2, 3)); line([[fx, fy], [fx, fy - h]], '#2f9e44', 6); circle(fx, fy - h, lerp(4, 22, prog(t, 0.4 + i * 0.2, 3)), ['#ff8787', '#ffd43b', '#da77f2'][i % 3]); }
      who('kai', { x: 300, y: fy, s: 0.75, pose: { lean: 0, tilt: 6, armL: [8, 4], armR: [70 + Math.sin(t * 6) * 6, -20], legL: [6, 0], legR: [6, 0] }, expr: 'smile' });
      const n = Math.floor(prog(t, 1.5, 5.5) * 8); for (let i = 0; i < n; i++) { const a = prog(t, 1.5 + i * 0.5, 2.6 + i * 0.5); fly(lerp(1100, 500 + (i % 7) * 80, ease(a)) + Math.sin(t * 3 + i) * 10, lerp(y0 + 200, fy - 170 - (i % 3) * 30, ease(a)), t, i, GOLD); } }
  });
});
