// Short 16: BUYING vs BUILDING. One keeps buying courses and gadgets; Kai builds one product and sells it.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, counter, floaters, rnd, money } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, blend, hop, pulse, workstation } = require('./lib');
const CUT = 10.6; const LAUNCH = 5.8;
const buyer = { hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'hoodie', color: '#e03131' }, pants: '#343a40', shoes: '#e5e5e5' };
const BOXES = [0.6, 1.5, 2.3, 3.0, 3.6, 4.2, 4.7, 5.2, 5.6, 6.0, 6.4, 6.8, 7.2, 7.6, 8.0, 8.4];
const NAMES = ['COURSE', 'MIC', 'COURSE', 'LIGHTS', 'EBOOK', 'COURSE', 'CAMERA', 'COACHING'];

function half(y0, building, t) {
  const floorY = y0 + 780; line([[60, floorY], [1020, floorY]], 'rgba(255,255,255,0.15)', 4);
  label(building ? 'BUILDING ONE THING' : 'BUYING EVERYTHING', W / 2, y0 + (y0 ? 110 : 180), 56, building ? GREEN : '#ff8787', { spacing: 6, glow: building ? GREEN : undefined });
  if (!building) {
    spot(330, y0 + 560, 320, 'rgba(255,135,135,0.15)');
    // parcels drop in and pile up around him
    BOXES.forEach((b, i) => { if (t < b) return; const k = easeOut(prog(t, b, b + 0.35)); const col = i % 4; const row = Math.floor(i / 4); const bx = 120 + col * 120 + (row % 2) * 40; const by = floorY - 60 - row * 95;
      at(bx, lerp(y0 - 120, by, k) + (t > b + 0.35 ? Math.sin((t - b) * 20) * 6 * Math.exp(-(t - b) * 6) : 0), 1, () => { card(-55, -45, 110, 90, '#c99a5b', 6, INK, 4); card(-8, -45, 16, 90, '#a97a3f', 2); label(NAMES[i % NAMES.length], 0, 0, 18, INK, { spacing: 1 }); }); });
    const happy = prog(t, 0, 3); who(buyer, { x: 700, y: floorY, s: 0.95, pose: blend('cheer', 'slump', prog(t, 5, 7)), expr: t < 5 ? 'happy' : 'worried', still: false });
    const spent = BOXES.filter((b) => t > b).length * 97; counter('SPENT', `-${money(spent)}`, 870, y0 + (y0 ? 300 : 380), RED, pop(t, 0.5) * pulse(t, 0.6, 0.05), { size: 64, rot: Math.sin(t * 2) * 0.03 });
  } else {
    const live = t > LAUNCH; workstation(330, floorY, 1.05, live ? 'kai2' : 'kai', t, { cheer: live ? prog(t, LAUNCH, LAUNCH + 0.4) * (0.7 + 0.3 * Math.sin(t * 4)) : 0, hop: live ? Math.abs(Math.sin(t * 4)) * 20 : 0, expr: live ? 'happy' : 'determined', glowColor: 'rgba(57,255,20,0.25)' });
    at(760, y0 + 520, pop(t, LAUNCH - 0.3), () => { card(-90, -120, 180, 240, '#fff7e6', 12, INK, 5); card(-90, -120, 180, 80, '#2f9e44', 12); label('MY PLAN', 0, -80, 28, '#ffffff', { spacing: 2 }); star(); }, Math.sin(t * 2) * 0.05);
    const sales = live ? Math.round(9 * Math.floor(prog(t, LAUNCH + 0.3, CUT) ** 1.3 * 140)) : 0;
    counter('EARNED', `+${money(sales)}`, 870, y0 + (y0 ? 300 : 380), live ? GREEN : '#9aa3b5', pop(t, 0.5) * (live ? pulse(t, 0.2, 0.05) : 1), { size: 64, rot: Math.sin(t * 2) * 0.03 });
    if (live) floaters(t, 30, (i, life) => label('+$9', 600 + (i % 3) * 70, y0 + 640 - life * 160, 36, GREEN, { glow: GREEN }), { every: 0.15, from: LAUNCH + 0.3, life: 1.0 });
  }
}
function star() { K.star(55, 75, 40, GOLD); K.T('$9', 55, 78, 26, INK); }
module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(960);
    for (const [y0, b] of [[0, false], [980, true]]) { const c = K.ctx(); c.save(); c.beginPath(); c.rect(0, y0 - 20, W, 960); c.clip(); camera({ x: 540 + Math.sin(t * 0.5 + y0) * 10, y: 960, z: lerp(1, 1.07, t / CUT), t }, () => half(y0, b, t)); c.restore(); }
    line([[0, 960], [W, 960]], 'rgba(255,255,255,0.25)', 4);
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
