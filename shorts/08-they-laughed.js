// Short 8: THEY LAUGHED. A year later, they ask how.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, withSpec, counter, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, lifestyle } = require('./lib');
const CUT = 10.6; const SKIP = 4.8;
const crowd = ['dex', 'driver2', 'driver5'];

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(1000); const after = t > SKIP + 0.6; const fy = 1420;
    line([[40, fy], [1040, fy]], 'rgba(255,255,255,0.15)', 4);
    // the crowd on the right
    crowd.forEach((n, i) => { const x = 640 + i * 150; spot(x, fy - 260, 200, 'rgba(255,135,135,0.15)'); who(n, { x, y: fy + (i % 2) * 30, s: 0.85, flip: true, expr: after ? 'shock' : 'laugh', pose: after ? 'stand' : 'shrug' }); });
    if (!after) floaters(t, 18, (i, life) => label('HA', 620 + (i % 3) * 150 + Math.sin(i) * 30, fy - 470 - life * 220, 40 + (i % 3) * 14, '#ff8787'), { every: 0.22, from: 0.4, life: 1.0 });
    // Kai on the left
    spot(260, fy - 260, 300, after ? 'rgba(57,255,20,0.25)' : undefined);
    if (!after) { who('kai', { x: 260, y: fy, s: 1.0, pose: K.P.give, expr: 'determined' }); at(430, fy - 300, 1, () => { card(-70, -50, 140, 100, '#ffffff', 10, INK, 5); label('$9', 0, 4, 54, INK, { spacing: 0 }); }, 0.06); }
    else { who('kai2', { x: 260, y: fy, s: 1.0, pose: 'power', expr: 'smug' }); counter('SALES', Math.round(30000 * ease(prog(t, SKIP + 0.8, SKIP + 3))).toLocaleString('en-US'), W / 2, 640, GREEN, pop(t, SKIP + 0.7), { size: 130, rot: 0 }); }
    label(after ? 'NOW THEY ASK HOW.' : 'THEY LAUGHED.', W / 2, 260, after ? 80 : 100, after ? GREEN : '#ffffff', { spacing: 6, glow: after ? GREEN : undefined });
    // the jump in time
    const j = prog(t, SKIP - 0.1, SKIP + 1.0);
    if (j > 0 && j < 1) { shade('#000000', 0.75 * Math.sin(j * Math.PI)); at(W / 2, 960, pop(t, SKIP - 0.1), () => { card(-330, -70, 660, 140, '#ffffff', 70); label('1 YEAR LATER', 0, 4, 64, INK, { spacing: 6 }); }); }
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
