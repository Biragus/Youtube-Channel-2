// Story short: PROCRASTINATOR vs PLANNER. 30 days to launch. One scrolls until the last night and panics; Kai does a little every day and launches calmly.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, halves, workstation, cloud, rain, whichOne } = require('./lib');
const CUT = 18.5; const END = 15.0; const D0 = 0.5; const D1 = 12.5;
const proc = { hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'hoodie', color: '#e8590c' }, pants: '#343a40', shoes: '#e5e5e5' };
const sit = (t) => ({ lean: 0, tilt: 10 + Math.sin(t * 0.8) * 3, drop: 0, armL: [10, 8], armR: [22, -132], legL: [85, -85], legR: [85, -85] });
module.exports = makeShort(CUT, (t) => {
  dark(960); const left = Math.max(0, Math.ceil(lerp(30, 0, prog(t, D0, D1)))); const panic = left <= 2 && t < D1 + 0.5; const done = t > D1;
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 760;
    line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'PLANNER' : 'PROCRASTINATOR', W / 2, y0 + (kai ? 90 : 170), 60, kai ? GREEN : '#ffa94d', { spacing: 8, glow: kai ? GREEN : undefined });
    const work = kai ? Math.min(1, prog(t, D0, D1 - 1)) : (left <= 2 ? prog(t, lerp(D0, D1, 28 / 30), D1) * 0.6 : 0);
    // stack of finished pages
    for (let k = 0; k < Math.floor(work * 14); k++) card(760, fy - 40 - k * 14, 180, 12, '#f1f3f5', 2, '#adb5bd', 1);
    at(850, y0 + (kai ? 280 : 340), 1, () => pill(`PRODUCT ${Math.round(work * 100)}%`, 0, 0, 26, kai ? GREEN : '#ffa94d', { pad: 36 }));
    if (!kai) { if (!panic) { K.card(150, fy - 160, 380, 160, '#3b3f5c', 30); who(proc, { x: 330, y: fy - 70, s: 0.85, pose: sit(t), expr: 'neutral', prop: 'phone' }); } else { workstation(330, fy, 0.85, proc, t * 2, { expr: 'worried' }); floaters(t, 10, (k, life) => circle(260 + k % 3 * 50, fy - 360 - life * 50, 7, '#74c0fc'), { every: 0.1, from: 0, life: 0.4 }); }
      if (left < 12) { cloud(330, y0 + 330, lerp(0.6, 1.3, prog(left, 12, 0) || prog(t, D0 + (18 / 30) * (D1 - D0), D1)), '#343a52'); if (left < 6) rain(t, 150, y0 + 360, 360, 400, 30); }
      if (done) label('LATE. UNFINISHED.', 650, fy - 380, 32, '#ff8787', { spacing: 3 }); }
    else { workstation(330, fy, 0.85, done ? 'kai2' : 'kai', t, { cheer: done ? prog(t, D1, D1 + 0.3) : 0, hop: done ? hop(t, D1 + 0.3, 40) : 0, expr: done ? 'happy' : 'determined', glowColor: 'rgba(57,255,20,0.25)' }); if (done) { label('LAUNCHED ON TIME.', 650, fy - 380, 32, GREEN, { spacing: 3 }); K.at(850, fy - 300, pop(t, D1 + 0.4), () => pill('+$9  +$9  +$9', 0, 0, 26, GREEN, { border: GREEN })); } }
  });
  K.at(W / 2, 852, 1, () => { K.card(-200, -46, 400, 92, done ? '#123d1c' : '#0d1018', 46, left < 6 && !done ? RED : 'rgba(255,255,255,0.5)', 4); label(done ? 'LAUNCH DAY' : `${left} DAYS LEFT`, 0, 3, 40, '#ffffff', { spacing: 3 }); });
  whichOne(t, END, [['PROCRASTINATOR', '#ffa94d'], ['PLANNER', GREEN]]);
});
