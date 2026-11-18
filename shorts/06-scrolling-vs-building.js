// Short 6: SCROLLING vs BUILDING. Same evenings, one year apart.
const K = require('../engine/kit');
const { GREEN, GOLD, lerp, prog, ease, pop, at, alpha, card, line, circle, who, counter, floaters } = K;
const { W, dark, spot, label, watermark, shade, typing, lifestyle, camera, hop, pulse, workstation } = require('./lib');
const CUT = 10.6; const YEAR = 5.0;
const scroller = { hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'hoodie', color: '#7048e8' }, pants: '#343a40', shoes: '#e5e5e5' };
const sit = (t, after) => ({ lean: 0, tilt: after ? 16 + Math.sin(t * 0.8) * 3 : 8 + Math.sin(t * 0.7) * 2, drop: 0, armL: [10, 8], armR: [22, -132 + (Math.sin(t * 9) > 0.6 ? 10 : 0)], legL: [85, -85], legR: [85, -85] });

function half(y0, building, t) {
  const after = t > YEAR; const floorY = y0 + 780;
  label(building ? 'BUILDING' : 'SCROLLING', W / 2, y0 + 90, 64, building ? GREEN : '#ffffff', { spacing: 10, glow: building ? GREEN : undefined });
  line([[60, floorY], [1020, floorY]], 'rgba(255,255,255,0.15)', 4);
  if (!building) { // the couch, every night
    spot(330, y0 + 600, 300, `rgba(116,192,252,${0.25 + 0.12 * Math.abs(Math.sin(t * 7))})`); card(110, floorY - 170, 470, 170, '#3b3f5c', 30); card(110, floorY - 260, 470, 110, '#4a4f72', 30);
    who(scroller, { x: 330, y: floorY - 80, s: 0.95, pose: sit(t, after), expr: after ? 'tired' : 'neutral', prop: 'phone' });
    counter('SCREEN TIME', after ? '1,168 HRS' : `${Math.floor(lerp(0, 3.2, prog(t, 0.4, YEAR)))}h ${String(Math.floor(lerp(0, 192, prog(t, 0.4, YEAR))) % 60).padStart(2, '0')}m`, 790, y0 + 330, '#9aa3b5', pop(t, 0.4), { size: 64, rot: 0 });
  } else { // the desk, every night
    workstation(330, floorY, 1.05, after ? 'kai2' : 'kai', t, { cheer: after ? 0.5 + 0.5 * Math.sin(t * 5) : 0, hop: after ? Math.abs(Math.sin(t * 5)) * 30 : 0, expr: after ? 'happy' : 'determined', glowColor: 'rgba(57,255,20,0.25)' });
    counter('SALES', after ? Math.round(2140 * ease(prog(t, YEAR + 0.4, YEAR + 3))).toLocaleString('en-US') : '0', 790, y0 + 330, after ? GREEN : '#9aa3b5', pop(t, 0.4) * (after ? pulse(t, 0.2, 0.05) : 1), { size: 64, rot: Math.sin(t * 2) * 0.03 });
    if (after) floaters(t, 20, (i, life) => label('+$9', 470 + (i % 3) * 80, floorY - 300 - life * 200, 44, GREEN, { glow: GREEN }), { every: 0.18, from: YEAR + 0.4, life: 1.1 });
  }
}
module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(960); for (const [y0, b] of [[0, false], [980, true]]) { const c = K.ctx(); c.save(); c.beginPath(); c.rect(0, y0 - 20, W, 960); c.clip(); camera({ x: 540 + Math.sin(t * 0.5 + y0) * 10, y: 960, z: t < YEAR ? lerp(1, 1.08, t / YEAR) : lerp(1.12, 1.02, ease(prog(t, YEAR, YEAR + 1.5))), t }, () => half(y0, b, t)); c.restore(); } line([[0, 960], [W, 960]], 'rgba(255,255,255,0.25)', 4);
    // the jump in time
    const j = prog(t, YEAR - 0.2, YEAR + 1.1);
    if (j > 0 && j < 1) { shade('#000000', 0.6 * Math.sin(j * Math.PI)); at(W / 2, 960, pop(t, YEAR - 0.2), () => { K.card(-330, -70, 660, 140, '#ffffff', 70); label('1 YEAR LATER', 0, 4, 64, K.INK, { spacing: 6 }); }); }
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
