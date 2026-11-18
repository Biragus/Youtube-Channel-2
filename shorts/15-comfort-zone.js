// Short 15: COMFORT ZONE. Kai sits in a small warm circle; he gets up, steps out, and the world opens up.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, H, dark, spot, label, watermark, shade, lifestyle, camera, impact, blend, hop } = require('./lib');
const CUT = 10.6; const STAND = 2.6; const EDGE = 5.0; const OUT = 6.6; const FY = 1320; const CX = 540;
const sit = { lean: 0, tilt: 8, drop: 0, armL: [22, -132], armR: [10, 8], legL: [85, -85], legR: [85, -85] };

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    const c = K.ctx(); const burst = easeOut(prog(t, OUT, OUT + 1.4)); const r = lerp(330, 2200, burst);
    // outside: dark at first, then a bright world of what he wanted
    dark(900);
    camera({ x: CX, y: FY - 250, z: lerp(1.25, 0.95, ease(prog(t, OUT - 0.2, OUT + 1.6))) - 0.03 * Math.sin(t), shake: impact(t, OUT, 16), t }, () => {
      alpha(burst, () => { const g = c.createRadialGradient(CX, FY - 300, 0, CX, FY - 300, 1400); g.addColorStop(0, '#2b6e3d'); g.addColorStop(1, '#0a1a10'); c.fillStyle = g; c.fillRect(-600, -400, 2300, 2900);
        [['FREEDOM', 210, 620], ['YOUR OWN PRODUCT', 820, 520], ['GROWTH', 160, 1010], ['MORE TIME', 280, 1240], ['INCOME', 540, 430]].forEach(([s, x, y], i) => at(x, y + Math.sin(t * 2 + i) * 12, pop(t, OUT + 0.6 + i * 0.25), () => { const w = K.textWidth(s, 38, false, 3) + 60; card(-w / 2, -40, w, 80, 'rgba(57,255,20,0.15)', 40, GREEN, 3); label(s, 0, 2, 38, '#ffffff', { spacing: 3 }); })); });
      // the comfort zone: a warm circle with a couch
      c.save(); c.beginPath(); c.arc(CX, FY - 120, r, 0, Math.PI * 2); c.clip();
      const g2 = c.createRadialGradient(CX, FY - 120, 0, CX, FY - 120, 330); g2.addColorStop(0, `rgba(255,190,110,${0.45 * (1 - burst)})`); g2.addColorStop(1, `rgba(255,150,80,${0.12 * (1 - burst)})`); c.fillStyle = g2; c.fillRect(CX - 2300, FY - 2400, 4600, 4600); c.restore();
      c.strokeStyle = `rgba(255,190,110,${(0.8 + 0.2 * Math.sin(t * 6)) * (1 - burst)})`; c.lineWidth = 8 + (t > EDGE - 0.6 && t < OUT ? 6 * Math.abs(Math.sin(t * 10)) : 0); c.setLineDash([22, 16]); c.lineDashOffset = -t * 40; c.beginPath(); c.arc(CX, FY - 120, r, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      alpha(1 - burst, () => label('COMFORT ZONE', CX, FY + 120, 40, '#ffc078', { spacing: 6 }));
      card(CX - 230, FY - 170, 300, 170, '#5c4a6e', 30); card(CX - 230, FY - 250, 300, 100, '#6e5a82', 30);
      // Kai: on the couch with his phone, stands, hesitates at the edge, steps out
      const walk = ease(prog(t, EDGE - 1.6, EDGE)); const step = ease(prog(t, OUT - 0.4, OUT + 0.3));
      const kx = lerp(lerp(CX - 80, CX + 250, walk), CX + 420, step); const sitting = t < STAND;
      const pose = sitting ? sit : (t < EDGE - 1.6 ? blend(sit, 'stand', prog(t, STAND, STAND + 0.6)) : (t < EDGE ? P.walk(t * 1.4) : (t < OUT - 0.4 ? blend('stand', 'slump', 0.5 + 0.5 * Math.sin(t * 3)) : (t < OUT + 0.3 ? P.walk(t * 1.4) : blend('stand', 'cheer', prog(t, OUT + 0.3, OUT + 0.7))))));
      who(burst > 0.3 ? 'kai2' : 'kai', { x: kx, y: (sitting ? FY - 80 : FY) - hop(t, OUT + 0.7, 60), s: 0.85, pose, expr: t < EDGE ? 'neutral' : (t < OUT ? 'worried' : 'happy'), prop: sitting ? 'phone' : undefined, look: t > EDGE && t < OUT ? 0.7 : 0 });
    });
    label(t < OUT ? 'EVERYTHING YOU WANT' : 'IS ON THE OTHER SIDE.', W / 2, 300, 66, t < OUT ? '#ffffff' : GREEN, { spacing: 4, glow: t < OUT ? undefined : GREEN });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
