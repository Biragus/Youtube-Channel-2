// Short 1: EMPLOYEE vs CREATOR. Both work all day; at night only the creator's money keeps coming in.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, counter, floaters, money } = K;
const { W, dark, spot, label, watermark, linkTag, shade } = require('./lib');

const NIGHT = 7.0; // seconds: when the sun goes down
const worker = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'shirt', color: '#5c6f8a' }, pants: '#3b4252', shoes: '#e5e5e5', acc: ['badge'] };
const asleep = (spec, x, y, s, expr) => at(x, y, 1, () => who(spec, { x: 0, y: 0, s, pose: 'stand', expr, still: true }), -Math.PI / 2);

function half(y0, f) { // y0 = top of the half (0 or 980); f = { creator, t }
  const { creator, t } = f; const floorY = y0 + 780; const night = prog(t, NIGHT, NIGHT + 0.6);
  spot(360, y0 + 560, 420); line([[60, floorY], [1020, floorY]], 'rgba(255,255,255,0.15)', 4);
  label(creator ? 'CREATOR' : 'EMPLOYEE', W / 2, y0 + 90, 64, creator ? GREEN : '#ffffff', { spacing: 10, glow: creator ? GREEN : undefined });
  const spec = creator ? 'kai' : worker;
  // day: working at a desk
  alpha(1 - night, () => {
    card(400, floorY - 250, 300, 24, '#3a3f4d', 6); card(420, floorY - 226, 18, 226, '#2b2f3a', 4); card(662, floorY - 226, 18, 226, '#2b2f3a', 4);
    card(470, floorY - 400, 200, 140, '#22252e', 12); card(482, floorY - 388, 176, 112, creator ? '#123d1c' : '#2b3a55', 6);
    if (creator) { const k = prog(t, 0.8, NIGHT - 0.4); card(500, floorY - 300, 140, 12, '#0b1a0f', 6); card(500, floorY - 300, 140 * k, 12, GREEN, 6); }
    who(spec, { x: 330, y: floorY, s: 0.95, pose: P.type, expr: creator ? 'determined' : 'tired' });
  });
  // night: asleep in bed
  alpha(night, () => { card(150, floorY - 90, 560, 90, '#2a3150', 18); card(150, floorY - 120, 130, 50, '#3a4368', 16); asleep(spec, 640, floorY - 100, 0.8, creator ? 'smile' : 'tired'); floaters(t, 12, (i, life) => label('z', 260 + (i % 3) * 30, floorY - 200 - life * 150, 44, '#9aa3b5'), { every: 0.6, from: NIGHT + 0.6, life: 1.6 }); });
  // money: the employee earns only by the hour, the creator only once the product exists
  if (!creator) floaters(t, 14, (i, life) => label('+$', 560 + (i % 2) * 70, floorY - 430 - life * 160, 48, GOLD), { every: 0.5, from: 0.6, life: 1.0 });
  if (creator) floaters(t, 40, (i, life) => label('+$9', 470 + (i % 3) * 90, floorY - 260 - life * 220, 50, GREEN, { glow: GREEN }), { every: lerp(0.45, 0.16, prog(t, NIGHT + 1, 14)), from: NIGHT + 0.9, life: 1.2 });
  const v = creator ? Math.round(9 * Math.floor(prog(t, NIGHT + 0.9, 15) ** 1.4 * 60)) : Math.round(144 * prog(t, 0.6, NIGHT));
  counter(creator ? 'EARNED' : 'EARNED', money(v), 860, y0 + 300, creator ? GREEN : GOLD, pop(t, 0.4), { size: 70, rot: 0 });
  shade('#0a1030', 0.35 * night, 0, y0, W, 940);
}

module.exports = {
  duration: 16,
  draw: (t) => {
    dark(960);
    half(0, { creator: false, t }); half(980, { creator: true, t });
    line([[0, 960], [W, 960]], 'rgba(255,255,255,0.25)', 4);
    const night = prog(t, NIGHT, NIGHT + 0.6);
    at(W / 2, 960, 1, () => { circle(0, 0, 56, '#0b0c12'); K.ctx().strokeStyle = 'rgba(255,255,255,0.5)'; K.ctx().lineWidth = 4; K.ctx().beginPath(); K.ctx().arc(0, 0, 56, 0, Math.PI * 2); K.ctx().stroke();
      alpha(1 - night, () => { circle(0, 0, 26, GOLD); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; line([[Math.cos(a) * 34, Math.sin(a) * 34], [Math.cos(a) * 44, Math.sin(a) * 44]], GOLD, 5); } });
      alpha(night, () => { circle(0, 0, 28, '#f6f1c9'); circle(12, -8, 24, '#0b0c12'); }); });
    linkTag(pop(t, 13.4)); watermark();
    shade('#000000', 1 - prog(t, 0, 0.3)); shade('#000000', prog(t, 15.5, 16));
  },
};
