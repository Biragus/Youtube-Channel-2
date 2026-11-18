// Short 8: THEY LAUGHED. A year later, they ask how.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, withSpec, counter, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, impact, hop, pulse } = require('./lib');
const CUT = 10.6; const SKIP = 4.8;
const crowd = ['dex', 'driver2', 'driver5'];

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(1000); const after = t > SKIP + 0.6; const fy = 1420;
    const face = ease(prog(t, SKIP + 0.6, SKIP + 1.0)) * (1 - ease(prog(t, SKIP + 1.9, SKIP + 2.6)));
    camera({ x: lerp(540, 780, face), y: lerp(980 - Math.sin(t * 0.6) * 8, 1180, face), z: lerp(lerp(1.08, 1, prog(t, 0, SKIP)), 1.6, face), shake: after ? 0 : 3, t }, () => {
    line([[40, fy], [1040, fy]], 'rgba(255,255,255,0.15)', 4);
    // the crowd on the right
    crowd.forEach((n, i) => { const x = 640 + i * 150; spot(x, fy - 260, 200, 'rgba(255,135,135,0.15)'); const step = after ? ease(prog(t, SKIP + 0.6, SKIP + 1.4)) * 60 : 0; const laughHop = after ? 0 : Math.abs(Math.sin(t * 9 + i * 1.3)) * 22;
      who(n, { x: x + step, y: fy + (i % 2) * 30 - laughHop, s: 0.85, flip: true, expr: after ? 'shock' : 'laugh', pose: after ? { lean: 0, tilt: 8, armL: [30, -20], armR: [30, -20], legL: [6, 0], legR: [6, 0] } : { lean: 0, tilt: -10 + Math.sin(t * 9 + i) * 6, armL: [40, -110], armR: [40, -110], legL: [8, 0], legR: [8, 0] }, still: !after }); });
    if (!after) floaters(t, 18, (i, life) => label('HA', 620 + (i % 3) * 150 + Math.sin(i) * 30, fy - 470 - life * 220, 40 + (i % 3) * 14, '#ff8787'), { every: 0.22, from: 0.4, life: 1.0 });
    // Kai on the left
    spot(260, fy - 260, 300, after ? 'rgba(57,255,20,0.25)' : undefined);
    if (!after) { who('kai', { x: 260, y: fy, s: 1.0, pose: K.P.give, expr: t > 2.5 ? 'determined' : 'sad' }); at(430, fy - 300 + Math.sin(t * 6) * 4, 1, () => { card(-70, -50, 140, 100, '#ffffff', 10, INK, 5); label('$9', 0, 4, 54, INK, { spacing: 0 }); }, 0.06); }
    else { const walk = ease(prog(t, SKIP + 0.6, SKIP + 2.0)); who('kai2', { x: lerp(-120, 260, walk), y: fy, s: 1.0, pose: walk < 1 ? K.P.walk(t * 1.6) : 'power', expr: 'smug' }); counter('SALES', Math.round(30000 * ease(prog(t, SKIP + 0.8, SKIP + 3))).toLocaleString('en-US'), W / 2, 640, GREEN, pop(t, SKIP + 2.0) * pulse(t, 0.2, 0.05), { size: 130, rot: Math.sin(t * 2) * 0.03 }); }
    });
    label(after ? 'NOW THEY ASK HOW.' : 'THEY LAUGHED.', W / 2, 320, after ? 80 : 100, after ? GREEN : '#ffffff', { spacing: 6, glow: after ? GREEN : undefined });
    // the jump in time
    const j = prog(t, SKIP - 0.1, SKIP + 1.0);
    if (j > 0 && j < 1) { shade('#000000', 0.75 * Math.sin(j * Math.PI)); at(W / 2, 960, pop(t, SKIP - 0.1), () => { card(-330, -70, 660, 140, '#ffffff', 70); label('1 YEAR LATER', 0, 4, 64, INK, { spacing: 6 }); }); }
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
