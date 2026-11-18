// Short 31: BUILD A MAGNET. Chasing money: it runs away. Building something people need: it comes to you.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop, halves } = require('./lib');
const CUT = 10.4; const PULL = 4.5;
const chaser = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: '#e03131' }, pants: '#3b4252', shoes: '#e5e5e5' };
const coin = (x, y) => at(x, y, 1, () => { circle(0, 0, 26, GOLD); label('$', 0, 2, 30, '#5c3d00', { spacing: 0 }); });
module.exports = makeShort(CUT, (t) => {
  K.ctx(); require('./lib').dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 760; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'BUILDING' : 'CHASING', W / 2, y0 + (kai ? 90 : 170), 64, kai ? GREEN : '#ff8787', { spacing: 10, glow: kai ? GREEN : undefined });
    if (!kai) { // the chaser runs right, the coins keep fleeing
      const x = 160 + ((t * 260) % 700); for (let i = 0; i < 3; i++) coin(x + 220 + i * 70 + Math.sin(t * 6 + i) * 10, fy - 120 - Math.abs(Math.sin(t * 5 + i)) * 60);
      who(chaser, { x, y: fy, s: 0.85, pose: P.walk(t * 2.6), expr: t > 5 ? 'tired' : 'determined' }); if (t > 5) floaters(t, 8, (i, life) => circle(x - 40, fy - 330 - life * 40, 6, '#74c0fc'), { every: 0.3, from: 5, life: 0.5 });
    } else { const mx = 760; const on = t > PULL; const won = t > PULL + 2;
      // Kai builds the magnet, then money flies to it
      at(mx, fy - 180, pop(t, 1.2), () => { const c = K.ctx(); c.lineCap = 'butt'; c.strokeStyle = RED; c.lineWidth = 60; c.beginPath(); c.arc(0, 0, 90, Math.PI * 0.05, Math.PI * 0.95, true); c.stroke(); card(-120, -6, 60, 50, '#dee2e6', 4); card(60, -6, 60, 50, '#dee2e6', 4); label('PRODUCT', 0, -40, 26, '#ffffff', { spacing: 2 }); }, 0);
      if (on) { spot(mx, fy - 180, 300, 'rgba(242,193,78,0.25)'); for (let i = 0; i < 18; i++) { const k = ((t - PULL) * 0.8 + i / 18) % 1; const a = i * 2.1; coin(lerp(mx + Math.cos(a) * 700, mx, k * k), lerp(fy - 180 + Math.sin(a) * 400, fy - 180, k * k)); }
        for (let i = 0; i < 4; i++) K.ctx().strokeStyle = 'rgba(242,193,78,0.3)'; }
      who(won ? 'kai2' : 'kai', { x: 330, y: fy - hop(t, PULL + 2.1, 50), s: 0.85, pose: t < PULL ? { lean: 0, tilt: 4, armL: [8, 4], armR: [90 + Math.sin(t * 12) * 20, -40 + Math.sin(t * 12) * 30], legL: [6, 0], legR: [6, 0] } : blend('stand', 'cheer', prog(t, PULL + 2, PULL + 2.4)), expr: won ? 'happy' : 'determined' }); }
  });
  K.at(W / 2, 960, 1, () => { K.card(-200, -40, 400, 80, '#0d1018', 40, 'rgba(255,255,255,0.5)', 3); label("DON'T CHASE. ATTRACT.", 0, 3, 28, '#ffffff', { spacing: 2 }); });
});
