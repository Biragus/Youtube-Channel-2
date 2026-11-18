// Short 23: BLOCK THE NOISE. Doubts swarm Kai while he builds; he puts his headphones on, the noise fades, the sales come.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, withSpec } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, workstation, hop } = require('./lib');
const CUT = 10.4; const ON = 4.6; const FY = 1350;
const NOISE = ["IT WON'T WORK", 'GET A REAL JOB', 'WHO ARE YOU?', 'TOO LATE', 'LOL', 'NOBODY WILL BUY', 'BE REALISTIC', 'WASTE OF TIME'];
const kaiPhones = withSpec('kai', { acc: ['headphones'], accent: GREEN }); const kai2Phones = withSpec('kai2', { acc: ['headphones'], accent: GREEN });

module.exports = makeShort(CUT, (t) => {
  dark(1000); const quiet = ease(prog(t, ON, ON + 1.2)); const sold = t > ON + 1.6;
  camera({ x: 540, y: 1060, z: lerp(lerp(1.0, 1.25, prog(t, 0, ON)), 1.05, quiet), shake: (1 - quiet) * prog(t, 0.5, ON) * 4, t }, () => {
    // the doubts: speech bubbles closing in, then pushed away
    NOISE.forEach((s, i) => { const a = i * (Math.PI * 2 / NOISE.length) + t * 0.25; const r = lerp(lerp(470, 280, prog(t, 0.5 + i * 0.3, ON)), 900, quiet); const x = 540 + Math.cos(a) * r * 0.85; const y = 1080 + Math.sin(a) * r * 0.75;
      alpha(pop(t, 0.4 + i * 0.35) * (1 - quiet), () => at(x, y, 1, () => { const w = K.textWidth(s, 34, false, 2) + 60; card(-w / 2, -40, w, 80, '#3b1f1f', 40, RED, 3); label(s, 0, 2, 34, '#ffb3b3', { spacing: 2 }); }, Math.sin(t * 2 + i) * 0.06)); });
    // calm green ring once the headphones are on
    if (quiet > 0) { K.ctx().strokeStyle = `rgba(57,255,20,${0.5 * (1 - prog(t, ON, ON + 1.5))})`; K.ctx().lineWidth = 10; K.ctx().beginPath(); K.ctx().arc(540, 1080, lerp(100, 700, quiet), 0, Math.PI * 2); K.ctx().stroke(); }
    workstation(540, FY, 1.25, t > ON ? (sold ? kai2Phones : kaiPhones) : 'kai', t, { sigh: t < ON ? prog(t, 2.5, 3.2) * (1 - prog(t, ON - 0.6, ON)) : 0, cheer: sold ? prog(t, ON + 1.6, ON + 2.0) * (0.6 + 0.4 * Math.sin(t * 4)) : 0, hop: sold ? Math.abs(Math.sin(t * 4)) * 20 : 0, expr: sold ? 'happy' : (t > ON ? 'determined' : 'worried'), glowColor: t > ON ? 'rgba(57,255,20,0.3)' : undefined });
    if (sold) floaters(t, 30, (i, life) => at(300 + (i % 4) * 160, 900 - life * 260, 1, () => { card(-70, -30, 140, 60, '#123d1c', 30, GREEN, 3); label('+$9', 0, 2, 32, GREEN, { spacing: 1 }); }), { every: 0.14, from: ON + 1.6, life: 1.0 });
  });
  title(t < ON ? 'EVERYONE HAS AN OPINION.' : 'BLOCK THE NOISE.', t < ON ? '#ffffff' : GREEN, 300, t < ON ? 56 : 84, t < ON ? undefined : GREEN);
});
