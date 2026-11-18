// Short 4: DAY 1 vs DAY 100. Same desk, same laptop; a hundred days of showing up in between.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, counter, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, typing, lifestyle } = require('./lib');
const CUT = 11.0; const FLIP = 4.0; const D100 = 6.6;

function desk(t, late) {
  spot(400, 1050, 460); line([[60, 1300], [1020, 1300]], 'rgba(255,255,255,0.15)', 4);
  card(560, 1060, 400, 26, '#3a3f4d', 6); card(580, 1086, 20, 214, '#2b2f3a', 4); card(920, 1086, 20, 214, '#2b2f3a', 4);
  card(640, 880, 260, 180, '#22252e', 14); card(654, 894, 232, 140, late ? '#123d1c' : '#2b3a55', 8);
  const done = late && t > D100 + 3.2;
  who(done ? 'kai2' : 'kai', { x: 400, y: 1300, s: 1.25, pose: done ? 'cheer' : typing(t), expr: late ? (done ? 'happy' : 'smile') : 'tired' });
}
module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(900);
    if (t < FLIP) { // day 1: nothing happens
      label('DAY 1', W / 2, 230, 130, '#ffffff', { spacing: 10 }); desk(t, false);
      counter('SALES', '0', W / 2, 560, '#9aa3b5', pop(t, 0.3), { size: 150, rot: 0 });
      at(820, 760, pop(t, 2.0), () => { card(-120, -40, 240, 80, '#2b2f3a', 40); label('+1 VIEW', 0, 2, 34, '#9aa3b5', { spacing: 2 }); });
    } else if (t < D100) { // the days fly past
      const k = ease(prog(t, FLIP, D100 - 0.3)); const n = Math.max(2, Math.round(lerp(2, 100, k)));
      for (let i = 0; i < 4; i++) { const ph = ((t * 6 + i / 4) % 1); alpha(1 - ph, () => at(W / 2 + ph * 300 * (i % 2 ? 1 : -1), 900 - ph * 700, 1 - ph * 0.4, () => card(-300, -320, 600, 640, '#f1f3f5', 30), ph * (i % 2 ? 1.2 : -1.2))); }
      at(W / 2, 900, 1, () => { card(-300, -320, 600, 640, '#ffffff', 30); card(-300, -320, 600, 150, RED, 30); label('DAY', 0, -245, 70, '#ffffff', { spacing: 10 }); label(String(n), 0, 80, 240, INK, { spacing: 0 }); });
    } else { // day 100: it all comes back
      label('DAY 100', W / 2, 230, 130, GREEN, { spacing: 10, glow: GREEN }); desk(t, true);
      const v = Math.round(1284 * easeOut(prog(t, D100 + 0.3, D100 + 3.2)));
      counter('SALES', v.toLocaleString('en-US'), W / 2, 560, GREEN, pop(t, D100 + 0.1), { size: 150, rot: 0 });
      floaters(t, 30, (i, life) => { at(780 + (i % 3) * 90, 1000 - life * 380, 1, () => { card(-70, -30, 140, 60, '#123d1c', 30, GREEN, 3); label('+$9', 0, 2, 32, GREEN, { spacing: 1 }); }); }, { every: 0.12, from: D100 + 0.3, life: 1.1 });
    }
    shade('#ffffff', 0.7 * (1 - prog(t, D100, D100 + 0.25)) * (t > D100 ? 1 : 0));
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
