// Short 51: THE FIRST SPARK. Kai rubs two sticks; sparks fizzle again and again, then one catches and becomes a bonfire people gather round.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const FY = 1450; const FX = 600; const CATCH = 3.6;
const guest = (i) => ({ hair: { type: ['curly', 'bun', 'short', 'long'][i % 4], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#9c36b5', '#2f9e44', '#e8590c'][i % 4] }, pants: '#3b4252', shoes: '#e5e5e5' });
const rub = (t) => ({ lean: 18, tilt: 10, drop: 50, armL: [70 + Math.sin(t * 22) * 15, -30], armR: [70 - Math.sin(t * 22) * 15, -30], legL: [40, -100], legR: [10, -30] });
function flame(x, y, size, t) { const c = K.ctx(); for (const [col, s] of [['#e8590c', 1], ['#ffa94d', 0.7], ['#ffe066', 0.4]]) { c.fillStyle = col; c.beginPath(); c.moveTo(x - 60 * size * s, y); c.quadraticCurveTo(x - 50 * size * s, y - 120 * size * s, x + Math.sin(t * 9) * 12 * size, y - 220 * size * s); c.quadraticCurveTo(x + 50 * size * s, y - 120 * size * s, x + 60 * size * s, y); c.closePath(); c.fill(); } }
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const lit = t > CATCH; const size = lerp(0.2, 2.4, ease(prog(t, CATCH, CATCH + 1.6))); const people = lit ? Math.min(4, Math.floor((t - CATCH) * 2)) : 0;
  camera({ x: 560, y: lerp(1300, 1150, prog(t, CATCH, CATCH + 1.5)), z: lerp(1.4, 1.0, ease(prog(t, CATCH, CATCH + 1.6))), shake: impact(t, CATCH, 10), t }, () => {
    card(-300, FY, 1700, 900, '#141823', 0); line([[-300, FY], [1400, FY]], 'rgba(255,255,255,0.15)', 4);
    if (lit) spot(FX, FY - 150, 600 * size / 2.4 + 100, 'rgba(255,169,77,0.35)');
    for (const d of [-1, 1]) line([[FX - 90, FY - 10], [FX + 90, FY - 40 * d - 20]], '#6b4a2f', 18);
    // failed sparks, then the one that catches
    if (!lit) floaters(t, 30, (i, life) => circle(FX + Math.cos(i * 2.1) * life * 80, FY - 40 - life * 80 + life * life * 120, 6 * (1 - life), '#ffd43b'), { every: 0.18, from: 0.4, life: 0.5 });
    if (lit) { flame(FX, FY - 30, size, t); floaters(t, 40, (i, life) => circle(FX + Math.sin(i * 3 + t) * 60 * size * (1 - life), FY - 200 * size - life * 260, 7 * (1 - life), '#ffa94d'), { every: 0.05, from: CATCH, life: 0.9 }); }
    // the people who come to the warmth
    for (let i = 0; i < people; i++) { const side = i % 2 ? 1 : -1; const tx = FX + side * (330 + Math.floor(i / 2) * 140); const arrive = ease(prog(t, CATCH + 0.5 + i * 0.5, CATCH + 1.3 + i * 0.5)); const x = lerp(FX + side * 1200, tx, arrive); who(guest(i), { x, y: FY, s: 0.75, flip: side > 0, pose: arrive < 1 ? P.walk(t * 1.6) : { lean: 0, tilt: 4, armL: [60, -20], armR: [60, -20], legL: [6, 0], legR: [6, 0] }, expr: 'happy' }); }
    who(lit ? 'kai2' : 'kai', { x: FX - 200, y: FY - (lit ? hop(t, CATCH + 0.1, 40) : 0), s: 0.8, pose: lit ? blend(rub(t), 'cheer', prog(t, CATCH, CATCH + 0.3)) : rub(t), expr: lit ? 'happy' : (t > 2 ? 'worried' : 'determined') });
  });
  pill(lit ? 'FIRST SALE' : 'NOTHING YET...', W / 2, 450, 44, lit ? '#ffa94d' : '#ffffff', { border: lit ? '#ffa94d' : undefined });
  title(lit ? 'ONE SPARK IS ENOUGH.' : 'KEEP STRIKING.', lit ? '#ffa94d' : '#ffffff', 300, 80, lit ? '#ffa94d' : undefined);
});
