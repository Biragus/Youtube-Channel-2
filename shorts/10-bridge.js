// Short 10: THE GAP. Kai builds a bridge plank by plank, from where he is to where he wants to be, and walks across.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, rnd, floaters } = K;
const { W, H, dark, spot, label, watermark, shade, lifestyle, camera, impact, blend, hop } = require('./lib');
const CUT = 11.0; const TOP = 1180; const L = 460; const R = 1640;
const PLANKS = ['IDEA', 'PRODUCT', 'SHOP PAGE', 'FIRST POST', 'FIRST SALE']; const PW = (R - L) / PLANKS.length;
const lands = (i) => 0.9 + i * 1.7;          // when each plank drops into place
const kaiX = (t) => { let x = L - 80; for (let i = 0; i < PLANKS.length; i++) if (t > lands(i) + 0.3) x = Math.max(x, lerp(Math.max(L - 80, L - 60 + i * PW), L - 60 + (i + 1) * PW, ease(prog(t, lands(i) + 0.3, lands(i) + 1.3)))); return lerp(x, R + 160, ease(prog(t, lands(4) + 1.3, lands(4) + 2.3))); };

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(900); const c = K.ctx(); const kx = kaiX(t); const done = t > lands(4) + 2.3;
    camera({ x: lerp(500, 1500, prog(kx, L - 80, R + 160)), y: 1020, z: 1.0, shake: PLANKS.reduce((a, _, i) => a + impact(t, lands(i), 7, 0.25), 0), t }, () => {
      // the two cliffs over a dark drop
      for (const [x0, x1, gold] of [[-400, L, false], [R, 2700, true]]) { c.fillStyle = gold ? '#3a3018' : '#2b3142'; c.fillRect(x0, TOP, x1 - x0, 1200); line([[x0, TOP], [x1, TOP]], gold ? GOLD : 'rgba(255,255,255,0.3)', 6); }
      spot(R + 350, TOP - 200, 420, 'rgba(242,193,78,0.35)');
      label('WHERE YOU ARE', 180, TOP + 120, 38, '#9aa3b5', { spacing: 4 }); label('WHERE YOU WANT TO BE', R + 360, TOP + 120, 38, GOLD, { spacing: 4 });
      at(R + 380, TOP - 160 + Math.sin(t * 2) * 10, 1, () => { K.ctx().scale(0.4 + 0.6 * Math.abs(Math.cos(t * 1.5)), 1); circle(0, 0, 70, GOLD); circle(0, 0, 56, '#e0a92e'); label('$', 0, 5, 84, '#5c3d00', { spacing: 0 }); });
      // planks drop in, bounce and settle, each with what it stands for
      PLANKS.forEach((s, i) => { const a = lands(i); if (t < a - 0.5) return; const k = easeOut(prog(t, a - 0.5, a)); const bounce = t > a ? Math.sin((t - a) * 18) * 10 * Math.exp(-(t - a) * 6) : 0;
        at(L + i * PW + PW / 2, lerp(TOP - 700, TOP + 18, k) - bounce, 1, () => { card(-PW / 2 + 4, -18, PW - 8, 36, '#8a5a3c', 6, '#3a2414', 4); label(s, 0, -54, 30, i === 4 ? GREEN : '#ffffff', { spacing: 3 }); }); });
      // Kai walks onto each new plank, then across to the other side
      const moving = PLANKS.some((_, i) => t > lands(i) + 0.3 && t < lands(i) + 1.3) || (t > lands(4) + 1.3 && t < lands(4) + 2.3);
      spot(kx, TOP - 200, 220, 'rgba(57,255,20,0.15)');
      who(done ? 'kai2' : 'kai', { x: kx, y: TOP - hop(t, lands(4) + 2.4, 70) - hop(t, lands(4) + 2.9, 45), s: 0.95, pose: done ? blend('stand', 'cheer', prog(t, lands(4) + 2.3, lands(4) + 2.6)) : (moving ? P.walk(t * 1.3) : blend('stand', { lean: 0, tilt: 6, armL: [30, -60], armR: [30, -60], legL: [6, 0], legR: [6, 0] }, 0.5 + 0.5 * Math.sin(t * 3))), expr: done ? 'happy' : 'determined' });
      if (done) floaters(t, 30, (i, life) => card(R + 100 + rnd(i) * 400, TOP - 500 + life * 300, 12, 20, ['#ffd43b', '#51cf66', '#74c0fc'][i % 3], 3), { every: 0.04, from: lands(4) + 2.3, life: 1.2 });
    });
    label('THE GAP', W / 2, 290, 100, '#ffffff', { spacing: 10 }); label('IS BUILT ONE PIECE AT A TIME', W / 2, 380, 40, '#9aa3b5', { spacing: 4 });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
