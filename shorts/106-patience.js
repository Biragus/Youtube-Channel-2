// WAIT FOR IT. Two at the lake. One yanks his rod every second and catches nothing. Kai waits; the line goes tight; a huge fish.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, circle, who } = K; const M = require('../engine/motion'); const A = require('../engine/actions');
const { W, dark, label, makeShort, halves, npc, confetti } = require('./lib');
const CUT = 6.8; const BITE = 4.0;
function fish(x, y, s) { at(x, y, s, () => { const c = K.ctx(); c.fillStyle = GOLD; c.beginPath(); c.ellipse(0, 0, 60, 30, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(-50, 0); c.lineTo(-90, -28); c.lineTo(-90, 28); c.closePath(); c.fill(); circle(30, -8, 6, INK); label('$', 0, 3, 34, '#5c3d00', { spacing: 0 }); }); }
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const sea = y0 + 560; const c = K.ctx(); c.fillStyle = '#0d3b66'; c.fillRect(-100, sea, 1300, 600); card(60, sea - 40, 340, 40, '#6b4a2f', 6);
    label(kai ? 'PATIENT' : 'IMPATIENT', W / 2, y0 + (kai ? 90 : 170), 56, kai ? GREEN : '#ff8787', { spacing: 6, glow: kai ? GREEN : undefined });
    if (!kai) { const yank = Math.abs(Math.sin(t * 5)); const rn = A.work(npc('#e8590c'), 220, sea - 40, 0.75, t, { lean: -4 - yank * 14, handL: [262, sea - 220 - yank * 40], handR: [282, sea - 236 - yank * 50], expr: 'angry' }); line([rn.handR, [640, sea - 380 - yank * 80]], '#8d939e', 6); line([[640, sea - 380 - yank * 80], [640, sea + 40 - yank * 120]], 'rgba(255,255,255,0.4)', 2); }
    else { const bite = t > BITE; const reel = prog(t, BITE + 0.4, BITE + 1.6); let rk = { handR: [282, sea - 234] }; if (reel >= 1) M.celebrate('kai2', 220, sea - 40, 0.75, t, BITE + 1.6); else rk = bite ? A.pull('kai', 220, sea - 40, 0.75, t, { lean: -20 - Math.sin(t * 20) * 4, hands: [[262, sea - 226], [282, sea - 240]] }) : A.work('kai', 220, sea - 40, 0.75, t, { handL: [262, sea - 220], handR: [282, sea - 234], expr: 'smile' });
      const tip = [640, sea - 380 + (bite && reel < 1 ? 60 : 0)]; line([rk.handR, tip], '#8d939e', 6); const fy2 = lerp(sea + 200, sea - 220, reel); line([tip, [640, bite ? fy2 : sea + 200]], 'rgba(255,255,255,0.5)', 2);
      if (bite) fish(640 + Math.sin(t * 10) * 20 * (1 - reel), fy2 + 40, lerp(0.8, 1.6, reel)); else circle(640, sea + 4 + Math.sin(t * 2) * 4, 10, '#ff6b6b'); if (reel >= 1) confetti(t, BITE + 1.6, 640, y0 + 200, 300); }
  });
});
