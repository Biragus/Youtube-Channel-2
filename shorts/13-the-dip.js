// Short 13: THE DIP. Everyone starts up the line; at the dip most turn back. Kai walks through it, and the line climbs.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, blend, hop } = require('./lib');
const CUT = 10.8; const X0 = 120; const X1 = 2500; const DIPX = 1150;
const curve = (x) => 1250 - (x - X0) * 0.12 + 420 * Math.exp(-(((x - DIPX) / 260) ** 2)) - Math.max(0, x - 1550) ** 1.15 * 0.4;
const walker = (i) => ({ hair: { type: ['short', 'curly', 'bun'][i], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#e8590c', '#9c36b5'][i] }, pants: '#3b4252', shoes: '#e5e5e5' });
const kaiX = (t) => lerp(X0 + 40, X1 - 80, prog(t, 0.5, 9.6) ** 1.15);

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(900); const c = K.ctx(); const kx = kaiX(t); const ky = curve(kx);
    camera({ x: kx + 120, y: ky - 160, z: 1.0 + 0.15 * Math.exp(-(((kx - DIPX) / 200) ** 2)), t }, () => {
      // the line, drawn as far as the walkers have got, plus the rest faintly
      c.strokeStyle = 'rgba(255,255,255,0.12)'; c.lineWidth = 10; c.beginPath(); for (let x = X0; x <= X1; x += 10) x === X0 ? c.moveTo(x, curve(x)) : c.lineTo(x, curve(x)); c.stroke();
      c.strokeStyle = GREEN; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); for (let x = X0; x <= kx; x += 10) x === X0 ? c.moveTo(x, curve(x)) : c.lineTo(x, curve(x)); c.stroke();
      label('THE DIP', DIPX, curve(DIPX) + 90, 54, '#ff8787', { spacing: 8 });
      at(X1, curve(X1) - 120 + Math.sin(t * 2) * 10, 1, () => { spot(0, 0, 220, 'rgba(242,193,78,0.4)'); K.ctx().scale(0.4 + 0.6 * Math.abs(Math.cos(t * 1.4)), 1); circle(0, 0, 70, GOLD); circle(0, 0, 56, '#e0a92e'); label('$', 0, 5, 84, '#5c3d00', { spacing: 0 }); });
      // three others walk with Kai, then turn back in the dip
      for (let i = 0; i < 3; i++) { const turn = 3.4 + i * 0.7; const lead = (i - 1) * 90; const fwd = lerp(X0 + 40, X1 - 80, prog(Math.min(t, turn), 0.5, 9.6) ** 1.15) + lead; const x = t < turn ? fwd : fwd - (t - turn) * 220; const back = t > turn;
        alpha(1 - prog(t, turn + 1.2, turn + 2.2), () => { who(walker(i), { x, y: curve(x) - (i + 1) * 4, s: 0.6, flip: back, pose: P.walk(t * 1.5 + i), expr: back ? 'sad' : 'neutral' }); if (back && t < turn + 1.2) label('I QUIT', x, curve(x) - 290, 32, '#ff8787', { spacing: 2 }); }); }
      // Kai keeps going; at the bottom he slows, then speeds up out of it
      spot(kx, ky - 140, 200, 'rgba(57,255,20,0.2)');
      const end = prog(t, 9.6, 9.9);
      who(end > 0 ? 'kai2' : 'kai', { x: kx, y: ky - hop(t, 9.9, 50), s: 0.62, pose: blend(P.walk(t * 1.6), 'cheer', end), expr: end > 0 ? 'happy' : (Math.abs(kx - DIPX) < 200 ? 'tired' : 'determined') });
    });
    label('MOST PEOPLE QUIT', W / 2, 280, 66, '#ffffff', { spacing: 4 }); label('RIGHT BEFORE IT WORKS.', W / 2, 370, 56, GOLD, { spacing: 4, glow: GOLD });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
