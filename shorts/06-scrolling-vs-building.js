// Short 6: SCROLLING vs BUILDING. Same evenings, one year apart.
const K = require('../engine/kit');
const { GREEN, GOLD, lerp, prog, ease, pop, at, alpha, card, line, circle, who, counter, floaters } = K;
const { W, dark, spot, label, watermark, shade, typing, lifestyle } = require('./lib');
const CUT = 10.6; const YEAR = 5.0;
const scroller = { hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'hoodie', color: '#7048e8' }, pants: '#343a40', shoes: '#e5e5e5' };
const sit = { lean: 0, tilt: 8, drop: 0, armL: [10, 8], armR: [22, -132], legL: [85, -85], legR: [85, -85] };

function half(y0, building, t) {
  const after = t > YEAR; const floorY = y0 + 780;
  label(building ? 'BUILDING' : 'SCROLLING', W / 2, y0 + 90, 64, building ? GREEN : '#ffffff', { spacing: 10, glow: building ? GREEN : undefined });
  line([[60, floorY], [1020, floorY]], 'rgba(255,255,255,0.15)', 4);
  if (!building) { // the couch, every night
    spot(330, y0 + 600, 300, 'rgba(116,192,252,0.35)'); card(110, floorY - 170, 470, 170, '#3b3f5c', 30); card(110, floorY - 260, 470, 110, '#4a4f72', 30);
    who(scroller, { x: 330, y: floorY - 80, s: 0.95, pose: sit, expr: after ? 'tired' : 'neutral', prop: 'phone' });
    counter('SCREEN TIME', after ? '1,168 HRS' : `${Math.floor(lerp(0, 3.2, prog(t, 0.4, YEAR)))}h ${String(Math.floor(lerp(0, 192, prog(t, 0.4, YEAR))) % 60).padStart(2, '0')}m`, 820, y0 + 330, '#9aa3b5', pop(t, 0.4), { size: 64, rot: 0 });
  } else { // the desk, every night
    spot(330, y0 + 560, 380); card(400, floorY - 250, 300, 24, '#3a3f4d', 6); card(420, floorY - 226, 18, 226, '#2b2f3a', 4); card(662, floorY - 226, 18, 226, '#2b2f3a', 4);
    card(470, floorY - 400, 200, 140, '#22252e', 12); card(482, floorY - 388, 176, 112, '#123d1c', 6);
    if (!after) who('kai', { x: 330, y: floorY, s: 0.95, pose: typing(t), expr: 'determined' }); else who('kai2', { x: 330, y: floorY, s: 0.95, pose: 'cheer', expr: 'happy' });
    counter('SALES', after ? Math.round(2140 * ease(prog(t, YEAR + 0.4, YEAR + 3))).toLocaleString('en-US') : '0', 820, y0 + 330, after ? GREEN : '#9aa3b5', pop(t, 0.4), { size: 64, rot: 0 });
    if (after) floaters(t, 20, (i, life) => label('+$9', 470 + (i % 3) * 80, floorY - 300 - life * 200, 44, GREEN, { glow: GREEN }), { every: 0.18, from: YEAR + 0.4, life: 1.1 });
  }
}
module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(960); half(0, false, t); half(980, true, t); line([[0, 960], [W, 960]], 'rgba(255,255,255,0.25)', 4);
    // the jump in time
    const j = prog(t, YEAR - 0.2, YEAR + 1.1);
    if (j > 0 && j < 1) { shade('#000000', 0.6 * Math.sin(j * Math.PI)); at(W / 2, 960, pop(t, YEAR - 0.2), () => { K.card(-330, -70, 660, 140, '#ffffff', 70); label('1 YEAR LATER', 0, 4, 64, K.INK, { spacing: 6 }); }); }
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
