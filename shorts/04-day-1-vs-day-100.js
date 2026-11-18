// Short 4: DAY 1 vs DAY 100. Same desk, same laptop; a hundred days of showing up in between.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, counter, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, typing, lifestyle, camera, impact, hop, pulse, workstation } = require('./lib');
const CUT = 11.0; const FLIP = 4.0; const D100 = 6.6;

function desk(t, late) {
  spot(400, 1050, 460); line([[60, 1300], [1020, 1300]], 'rgba(255,255,255,0.15)', 4);
  const done = late && t > D100 + 3.0; const sigh = !late && t > 2.4;
  // a wall clock whose hands race round
  at(900, 780, 0.8, () => { circle(0, 0, 70, '#e9ecef'); circle(0, 0, 60, '#ffffff'); line([[0, 0], [Math.sin(t * 3) * 44, -Math.cos(t * 3) * 44]], INK, 6); line([[0, 0], [Math.sin(t * 0.25) * 30, -Math.cos(t * 0.25) * 30]], INK, 8); });
  workstation(W / 2, 1300, 1.3, done ? 'kai2' : 'kai', t, { sigh: late ? 0 : prog(t, 2.3, 2.9), cheer: late ? prog(t, D100 + 2.8, D100 + 3.2) : 0, hop: late ? hop(t, D100 + 3.2, 60) + hop(t, D100 + 3.7, 40) : 0, expr: late ? (done ? 'happy' : 'smile') : (sigh ? 'sad' : 'tired'), glowColor: late ? 'rgba(57,255,20,0.28)' : undefined });
}
module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(900);
    const zoomK = t < FLIP ? lerp(1, 1.1, t / FLIP) : (t < D100 ? 1 + Math.sin(t * 18) * 0.015 : lerp(1.15, 1.02, ease(prog(t, D100, D100 + 1.2))));
    camera({ x: 540, y: 900, z: zoomK, shake: (t > FLIP && t < D100 ? 5 : 0) + impact(t, D100, 22), t }, () => {
    if (t < FLIP) { // day 1: nothing happens
      label('DAY 1', W / 2, 230, 130, '#ffffff', { spacing: 10 }); desk(t, false);
      counter('SALES', '0', W / 2, 560, '#9aa3b5', pop(t, 0.3), { size: 150, rot: Math.sin(t * 1.4) * 0.02 });
      at(840, 1000, pop(t, 2.0), () => { card(-120, -40, 240, 80, '#2b2f3a', 40); label('+1 VIEW', 0, 2, 34, '#9aa3b5', { spacing: 2 }); });
    } else if (t < D100) { // the days fly past
      const k = ease(prog(t, FLIP, D100 - 0.3)); const n = Math.max(2, Math.round(lerp(2, 100, k)));
      for (let i = 0; i < 4; i++) { const ph = ((t * 6 + i / 4) % 1); alpha(1 - ph, () => at(W / 2 + ph * 300 * (i % 2 ? 1 : -1), 900 - ph * 700, 1 - ph * 0.4, () => card(-300, -320, 600, 640, '#f1f3f5', 30), ph * (i % 2 ? 1.2 : -1.2))); }
      at(W / 2, 900, 1, () => { card(-300, -320, 600, 640, '#ffffff', 30); card(-300, -320, 600, 150, RED, 30); label('DAY', 0, -245, 70, '#ffffff', { spacing: 10 }); label(String(n), 0, 80, 240, INK, { spacing: 0 }); });
    } else { // day 100: it all comes back
      label('DAY 100', W / 2, 230, 130, GREEN, { spacing: 10, glow: GREEN }); desk(t, true);
      const v = Math.round(1284 * easeOut(prog(t, D100 + 0.3, D100 + 3.2)));
      counter('SALES', v.toLocaleString('en-US'), W / 2, 560, GREEN, pop(t, D100 + 0.1) * pulse(t, 0.18, 0.05), { size: 150, rot: Math.sin(t * 3) * 0.03 });
      floaters(t, 30, (i, life) => { at(780 + (i % 3) * 90, 1000 - life * 380, 1, () => { card(-70, -30, 140, 60, '#123d1c', 30, GREEN, 3); label('+$9', 0, 2, 32, GREEN, { spacing: 1 }); }); }, { every: 0.12, from: D100 + 0.3, life: 1.1 });
    }
    });
    shade('#ffffff', 0.7 * (1 - prog(t, D100, D100 + 0.25)) * (t > D100 ? 1 : 0));
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
