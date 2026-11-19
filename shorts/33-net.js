// Short 33: A LINE vs A NET. A job is one fishing line, one fish at a time; a product is a net that keeps catching.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, counter } = K;
const { W, dark, spot, label, makeShort, halves, blend, hop, pulse } = require('./lib');
const CUT = 10.4; const NET = 4.0;
const fisher = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'shirt', color: '#5c6f8a' }, pants: '#3b4252', shoes: '#e5e5e5' };
function fish(x, y, s, col = GOLD) { at(x, y, s, () => { const c = K.ctx(); c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 40, 20, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(-34, 0); c.lineTo(-60, -18); c.lineTo(-60, 18); c.closePath(); c.fill(); circle(20, -5, 4, INK); label('$', 0, 2, 22, '#5c3d00', { spacing: 0 }); }); }
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const sea = y0 + 560; const c = K.ctx();
    c.fillStyle = '#0d3b66'; c.fillRect(-100, sea, 1300, 600); for (let i = 0; i < 6; i++) line([[i * 200 + (t * 40) % 200 - 100, sea + 10], [i * 200 + (t * 40) % 200, sea + 10]], 'rgba(255,255,255,0.3)', 4);
    card(60, sea - 40, 360, 40, '#6b4a2f', 6);
    label(kai ? 'A NET' : 'A LINE', W / 2, y0 + (kai ? 90 : 170), 64, kai ? GREEN : '#ffffff', { spacing: 10, glow: kai ? GREEN : undefined });
    if (!kai) { // one rod, one fish now and then
      const reel = (t % 3) / 3; who(fisher, { x: 240, y: sea - 40, s: 0.8, pose: { lean: 0, tilt: 4, armL: [60, -40], armR: [60, -40], legL: [6, 0], legR: [6, 0] }, expr: 'tired' });
      line([[300, sea - 230], [620, sea - 300]], '#8d939e', 6); line([[620, sea - 300], [620 + Math.sin(t) * 10, sea + 160 - (reel > 0.7 ? (reel - 0.7) * 600 : 0)]], 'rgba(255,255,255,0.4)', 2);
      if (reel > 0.7) fish(620, sea + 180 - (reel - 0.7) * 600, 0.8);
      counter('CAUGHT', String(Math.floor(t / 3)), 860, y0 + 400, '#9aa3b5', pop(t, 0.4), { size: 60, rot: 0 });
    } else { const n = t > NET ? Math.floor((t - NET) ** 1.6 * 9) : 0;
      who(t > NET + 2 ? 'kai2' : 'kai', { x: 240, y: sea - 40 - hop(t, NET + 2, 40), s: 0.8, pose: t < NET ? { lean: 0, tilt: 4, armL: [80, -60 + Math.sin(t * 8) * 20], armR: [80, -60 - Math.sin(t * 8) * 20], legL: [6, 0], legR: [6, 0] } : blend('stand', 'cheer', prog(t, NET + 1.6, NET + 2)), expr: t > NET ? 'happy' : 'determined' });
      // the net: woven before, then full of fish
      const span = lerp(0, 1, ease(prog(t, 0.6, NET))); c.strokeStyle = 'rgba(200,230,255,0.6)'; c.lineWidth = 3; for (let i = 0; i <= 8; i++) { line([[440 + i * 70 * span, sea + 20], [440 + i * 70 * span, sea + 320]], 'rgba(200,230,255,0.5)', 3); } for (let j = 0; j <= 5; j++) line([[440, sea + 20 + j * 60], [440 + 560 * span, sea + 20 + j * 60]], 'rgba(200,230,255,0.5)', 3);
      label('PRODUCT', 720, sea - 30, 30, GREEN, { spacing: 4 });
      for (let i = 0; i < Math.min(n, 30); i++) fish(470 + (i % 7) * 76 + Math.sin(t * 3 + i) * 6, sea + 60 + Math.floor(i / 7) * 60, 0.6);
      counter('CAUGHT', String(n), 860, y0 + 330, GREEN, pop(t, 0.4) * (n ? pulse(t, 0.25, 0.05) : 1), { size: 60, rot: 0 }); }
  });
  require('./lib').pill('BUILD THE NET.', W / 2, 960, 32);
});
