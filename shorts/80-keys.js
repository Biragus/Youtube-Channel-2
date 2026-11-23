// THE 100TH KEY. Kai tries key after key in a locked door; the counter climbs; key 100 turns and the door swings open.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, floaters } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1400; const OPEN = 4.8; const DX = 700;
module.exports = makeShort(CUT, (t) => {
  dark(900); const n = t < OPEN ? Math.min(99, Math.floor(1 + 98 * prog(t, 0.4, OPEN - 0.2) ** 1.6)) : 100; const o = ease(prog(t, OPEN, OPEN + 0.6));
  camera({ x: 600, y: 1100, z: lerp(1.25, 1.05, prog(t, 0, OPEN)) - o * 0.05, shake: impact(t, OPEN, 12) + (t < OPEN ? 1.5 : 0), t }, () => {
    ground(FY); card(DX - 40, FY - 640, 400, 640, '#2b2f3a', 10);
    if (o > 0) { spot(DX + 160, FY - 320, 600 * o, `rgba(255,214,120,${0.7 * o})`); card(DX, FY - 600, 320, 600, `rgba(255,236,170,${o})`, 6); }
    at(DX, FY - 600, 1, () => { K.ctx().scale(1 - o * 0.85, 1); card(0, 0, 320, 600, '#6b4a2f', 8, INK, 6); circle(40, 320, 18, GOLD); label('YOUR GOAL', 160, 120, 34, '#fff3bf', { spacing: 3 }); });
    // Kai at the lock, with a big ring of keys
    who(t > OPEN + 0.6 ? 'kai2' : 'kai', { x: DX - 140 + o * 260, y: FY - hop(t, OPEN + 0.1, 40), s: 0.85, pose: t > OPEN ? blend({ lean: 0, tilt: 0, armL: [8, 4], armR: [86, -10], legL: [6, 0], legR: [6, 0] }, 'cheer', prog(t, OPEN, OPEN + 0.3)) : { lean: 4, tilt: 4, armL: [8, 4], armR: [86, -10 + Math.sin(t * 16) * 8], legL: [6, 0], legR: [6, 0] }, expr: t > OPEN ? 'happy' : 'determined' });
    if (t < OPEN) { at(DX + 20, FY - 290, 1, () => { line([[-50, 0], [0, 0]], GOLD, 8); circle(-60, 0, 14, GOLD); }, Math.sin(t * 30) * 0.15); floaters(t, 30, (i, life) => at(DX - 60 - life * 80, FY - 280 + life * life * 260, 1, () => line([[-24, 0], [24, 0]], '#adb5bd', 6), life * 6), { every: 0.12, from: 0.5, life: 0.6 }); }
  });
  K.at(W / 2, 400, pop(t, 0.4), () => pill(`KEY ${n}`, 0, 0, 36, t > OPEN ? GREEN : '#ffffff', { border: t > OPEN ? GREEN : undefined }));
  title(t > OPEN ? 'IT WAS THE 100TH.' : 'KEEP TRYING KEYS.', t > OPEN ? GOLD : '#ffffff', 300, 72, t > OPEN ? GOLD : undefined);
});
