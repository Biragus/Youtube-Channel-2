// FOCUS. Kai juggles five ideas and drops them all. He picks up one, and it grows in his hands.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const DROP = 2.4; const PICK = 3.4; const IDEAS = ['APP', 'PODCAST', 'COURSE', 'STORE', 'BLOG'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const dropped = t > DROP; const grow = ease(prog(t, PICK + 0.3, 5.6));
  camera({ x: 540, y: 1100, z: 1.0, shake: impact(t, DROP + 0.4, 10), t }, () => {
    ground(FY); spot(540, FY - 300, 300, 'rgba(255,255,255,0.08)');
    IDEAS.forEach((s, i) => { const ph = t * 4 + i * (Math.PI * 2 / 5); let x = 540 + Math.cos(ph) * 160; let y = FY - 600 - Math.abs(Math.sin(ph)) * 260;
      if (dropped) { const f = prog(t, DROP + i * 0.05, DROP + 0.5 + i * 0.05); x = lerp(x, 240 + i * 150, f); y = lerp(y, FY - 40, f * f); if (i === 2 && t > PICK) { x = 540; y = FY - 520 - grow * 120; } }
      const big = i === 2 && t > PICK; const r = big ? lerp(40, 150, grow) : 40; circle(x, y, r, big ? '#2f9e44' : ['#1c7ed6', '#e8590c', '#2f9e44', '#9c36b5', '#f08c00'][i]); label(s, x, y + 3, big ? lerp(18, 50, grow) : 18, '#ffffff', { spacing: 1 }); });
    const pose = t < DROP ? { lean: 0, tilt: -6, armL: [100 + Math.sin(t * 8) * 30, -40], armR: [100 - Math.sin(t * 8) * 30, -40], legL: [8, 0], legR: [8, 0] } : (t < PICK ? 'slump' : { lean: 0, tilt: -6, armL: [150, 10], armR: [150, 10], legL: [8, 0], legR: [8, 0] });
    who(grow > 0.9 ? 'kai2' : 'kai', { x: 540, y: FY - (grow > 0.9 ? hop(t, 5.7, 30) : 0), s: 0.9, pose, expr: t < DROP ? 'worried' : (t < PICK ? 'sad' : 'happy') });
  });
  title(t > PICK ? 'ONE THING. DONE WELL.' : 'TOO MANY IDEAS?', t > PICK ? GREEN : '#ffffff', 300, 72, t > PICK ? GREEN : undefined);
});
