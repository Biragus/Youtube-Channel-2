// Short 59: VERSION 1 vs VERSION 10. Kai's first product cover is a messy scribble; it improves version by version into a polished one.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, RED, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill, workstation, planCover } = require('./lib');
const CUT = 6.8; const DONE = 4.8;
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const v = Math.min(10, 1 + Math.floor(prog(t, 0.9, DONE) * 9.99)); const q = (v - 1) / 9; const done = t > DONE;
  camera({ x: 540, y: 1050, z: lerp(1.08, 1.0, prog(t, 0, 2)) + (done ? 0.05 * Math.exp(-(t - DONE) * 3) : 0), shake: impact(t, DONE, 12), t }, () => {
    // the cover: messy at first, cleaner each version
    at(540, 860, 1 + 0.04 * Math.sin(t * 12) * (done ? 0 : 1), () => {
      if (done) spot(0, 0, 500, 'rgba(57,255,20,0.3)');
      card(-230, -320, 460, 640, '#fff7e6', lerp(0, 18, q), INK, 6);
      card(-230 + (1 - q) * 30, -320, 460 - (1 - q) * 60, 220, lerp(0, 1, q) > 0.5 ? '#2f9e44' : '#adb5bd', 10);
      label(q > 0.3 ? 'THE LIVING ROOM' : 'my plan??', (1 - q) * 30, -250, lerp(40, 46, q), q > 0.3 ? '#ffffff' : INK, { spacing: 2 }); if (q > 0.3) label('PLAN', 0, -180, 46, '#ffffff', { spacing: 2 });
      for (let i = 0; i < 6; i++) { const w = lerp(160 + rnd(i + v) * 280, 300, q); line([[-180 + (1 - q) * rnd(i * 3 + v) * 60, -40 + i * 50 + (1 - q) * Math.sin(i + v) * 15], [-180 + w, -40 + i * 50 + (1 - q) * Math.cos(i * 2 + v) * 25]], q > 0.6 ? '#adb5bd' : '#495057', lerp(8, 5, q)); }
      if (q < 0.4) for (let i = 0; i < 4; i++) { c.strokeStyle = RED; c.lineWidth = 5; c.beginPath(); c.arc(-100 + i * 70, 200, 40, 0, Math.PI * 1.6); c.stroke(); }
      if (q > 0.7) { K.star(150, 240, 70 * q, GOLD); label('$9', 150, 246, 40, INK, { spacing: 0 }); }
    }, (1 - q) * 0.06 * Math.sin(v));
    if (!done) floaters(t, 30, (i, life) => at(540 + (rnd(i) - 0.5) * 300 + life * 400 * (i % 2 ? 1 : -1), 860 + life * 600, 1, () => card(-40, -50, 80, 100, '#fff7e6', 4, '#adb5bd', 2), life * 3), { every: 0.4, from: 1.0, life: 0.8 });
    workstation(540, 1620, 0.95, done ? 'kai2' : 'kai', t, { cheer: done ? prog(t, DONE, DONE + 0.3) : 0, hop: done ? hop(t, DONE + 0.3, 40) : 0, expr: done ? 'happy' : 'determined' });
  });
  pill(`VERSION ${v}`, W / 2, 1180, 44, done ? GREEN : '#ffffff', { border: done ? GREEN : undefined });
  title(done ? 'START UGLY. GET BETTER.' : 'YOUR FIRST VERSION WILL BE BAD.', done ? GREEN : '#ffffff', 300, done ? 70 : 52, done ? GREEN : undefined);
});
