// Short 39: 99%. Most people quit when the bar gets slow near the end. Kai waits it out, and it hits 100%.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, workstation } = require('./lib');
const CUT = 10.4; const FULL = 8.4;
const pct = (t) => (t < 3 ? lerp(0, 90, ease(prog(t, 0.6, 3))) : t < FULL ? lerp(90, 99, prog(t, 3, 4.5)) : 100);
const quitter = (i) => ({ hair: { type: ['curly', 'short', 'bun'][i], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#e8590c', '#9c36b5'][i] }, pants: '#3b4252', shoes: '#e5e5e5' });
module.exports = makeShort(CUT, (t) => {
  dark(900); const p = pct(t); const done = t > FULL;
  camera({ x: 540, y: 1080, z: lerp(1.0, 1.08, prog(t, 3, FULL)), shake: impact(t, FULL, 16), t }, () => {
    at(540, 760, 1 + (done ? 0.05 * Math.sin((t - FULL) * 8) * Math.exp(-(t - FULL) * 2) : 0), () => { card(-420, -60, 840, 120, '#0d1018', 60, done ? GREEN : 'rgba(255,255,255,0.4)', 5); card(-400, -40, 800 * p / 100, 80, done ? GREEN : (p > 95 ? '#f59f00' : '#4dabf7'), 40); label(`${Math.floor(p)}%`, 0, 4, 54, '#ffffff', { spacing: 2 }); });
    // three people leave as it stalls at 99%
    for (let i = 0; i < 3; i++) { const leave = 4.6 + i * 0.9; const lt = t - leave; const x = 200 + i * 140 - (lt > 0 ? lt * 380 : 0); if (x < -150) continue; who(quitter(i), { x, y: 1380, s: 0.7, flip: lt > 0, pose: lt > 0 ? P.walk(t * 1.6) : { lean: 0, tilt: 10, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] }, expr: lt > 0 ? 'sad' : 'tired' }); if (lt > 0 && lt < 0.8) label('I QUIT', x, 1050, 30, '#ff8787', { spacing: 2 }); }
    line([[40, 1380], [1040, 1380]], 'rgba(255,255,255,0.15)', 4);
    workstation(760, 1500, 1.0, done ? 'kai2' : 'kai', t, { sigh: done ? 0 : prog(t, 4.5, 5.2) * 0.5, cheer: done ? prog(t, FULL, FULL + 0.4) : 0, hop: done ? hop(t, FULL + 0.4, 60) : 0, expr: done ? 'happy' : 'determined', glowColor: 'rgba(57,255,20,0.25)' });
    if (done) floaters(t, 30, (i, life) => card(200 + rnd(i) * 700, 600 + life * 600, 12, 20, ['#ffd43b', '#51cf66', '#74c0fc'][i % 3], 3), { every: 0.04, from: FULL, life: 1.2 });
  });
  title(done ? 'IT WAS ALMOST THERE.' : 'MOST PEOPLE QUIT AT 99%.', done ? GREEN : '#ffffff', 300, 62, done ? GREEN : undefined);
});
