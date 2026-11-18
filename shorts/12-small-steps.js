// Short 12: ONE BIG LEAP vs SMALL STEPS. One keeps trying to jump to the top and falls; Kai climbs tiny steps and gets there.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, impact, blend, hop } = require('./lib');
const CUT = 10.8; const FY = 1620; const TOPY = 620; const STEPS = 14;
const jumper = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'tee', color: '#e03131' }, pants: '#3b4252', shoes: '#e5e5e5' };
// the jumper: crouch, leap, fall back, land on his back; three times
function jumperState(t) { const lt = (t - 0.6) % 3.0; const n = Math.floor((t - 0.6) / 3.0); if (t < 0.6 || n > 2) return { y: 0, pose: n > 2 ? 'sit' : 'stand', fall: n > 2 };
  if (lt < 0.5) return { y: 0, pose: blend('stand', { lean: 0, tilt: 10, drop: 40, armL: [30, -20], armR: [30, -20], legL: [30, -60], legR: [30, -60] }, lt / 0.5) };
  const air = lt - 0.5; const h = Math.max(0, 900 * air - 700 * air * air); return { y: h, pose: { lean: 0, tilt: -10, armL: [160, 10], armR: [160, 10], legL: [10, -30], legR: [10, -30] }, rot: air > 0.7 ? Math.min(1.4, (air - 0.7) * 3) : 0 }; }

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(900); const c = K.ctx(); const top = prog(t, 1.0, 9.0); const stepN = Math.min(STEPS, top * STEPS);
    camera({ x: 540, y: lerp(1100, 980, top), z: lerp(1.05, 0.98, top), shake: [1.6, 4.6, 7.6].reduce((a, x) => a + impact(t, x + 0.95, 8), 0), t }, () => {
      line([[540, 380], [540, FY + 100]], 'rgba(255,255,255,0.2)', 4);
      label('ONE BIG LEAP', 270, 500, 40, '#ff8787', { spacing: 4 }); label('SMALL STEPS', 810, 500, 40, GREEN, { spacing: 4 });
      for (const x0 of [40, 580]) { card(x0 + 300, TOPY, 200, FY - TOPY, '#262a36', 6); line([[x0 + 300, TOPY], [x0 + 500, TOPY]], GOLD, 6); circle(x0 + 400, TOPY - 40, 26 + Math.sin(t * 3) * 3, GOLD); }
      line([[40, FY], [1040, FY]], 'rgba(255,255,255,0.2)', 4);
      // left: the leap
      const j = jumperState(t); at(220, FY - j.y, 1, () => who(jumper, { x: 0, y: 0, s: 0.75, pose: j.pose === 'sit' ? { lean: 0, tilt: 14, drop: 0, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] } : j.pose, expr: j.fall ? 'sad' : (j.y > 10 ? 'determined' : 'neutral'), still: true }), j.rot ?? 0);
      // right: tiny steps, one at a time
      for (let i = 0; i < STEPS; i++) { const sx = 620 + i * 17; const sy = FY - (i + 1) * ((FY - TOPY) / STEPS); if (i < Math.ceil(stepN)) card(sx, sy, 300 - i * 17, (FY - TOPY) / STEPS + 2, '#2f3a4e', 2, 'rgba(255,255,255,0.15)', 2); }
      const k = Math.min(STEPS, stepN); const kx = 640 + k * 17 + 20; const ky = FY - k * ((FY - TOPY) / STEPS);
      spot(kx, ky - 180, 180, 'rgba(57,255,20,0.18)');
      who('kai', { x: kx + (top >= 1 ? 40 : 0), y: ky - Math.abs(Math.sin(t * 9)) * 6 * (top < 1 ? 1 : 0) - hop(t, 9.1, 50), s: 0.62, pose: top >= 1 ? blend(P.walk(t * 1.6), 'cheer', prog(t, 9.0, 9.4)) : P.walk(t * 1.6), expr: top >= 1 ? 'happy' : 'determined' });
      if (top >= 1) floaters(t, 24, (i, life) => card(800 + rnd(i) * 220, TOPY - 300 + life * 250, 10, 18, ['#ffd43b', '#51cf66', '#74c0fc'][i % 3], 3), { every: 0.05, from: 9.0, life: 1.1 });
    });
    label('HOW DO YOU GET TO THE TOP?', W / 2, 220, 56, '#ffffff', { spacing: 4 });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
