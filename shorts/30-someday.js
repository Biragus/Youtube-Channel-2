// Short 30: THE SOMEDAY STOP. One waits at the stop for the bus called SOMEDAY, growing old; Kai just starts walking.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop, pill } = require('./lib');
const CUT = 10.4; const FY = 1300;
const waiter = (age) => ({ hair: { type: 'short', color: age > 0.5 ? '#ced4da' : '#2b2b33', beard: age > 0.3 ? (age > 0.6 ? '#ced4da' : '#6e5a48') : undefined }, top: { type: 'tee', color: '#5c6f8a' }, pants: '#3b4252', shoes: '#e5e5e5' });
module.exports = makeShort(CUT, (t) => {
  dark(1000); const c = K.ctx(); const age = prog(t, 2, 9.6); const years = Math.floor(age * 10);
  const kx = lerp(560, 2600, ease(prog(t, 2.0, 9.6))); const pan = prog(t, 6.5, 9.0);
  camera({ x: Math.max(560, Math.min(kx, 2350) - 150), y: 1050, z: 1.0, t }, () => {
    card(-500, FY, 4000, 800, '#1b1f2b', 0); line([[-500, FY], [3500, FY]], 'rgba(255,255,255,0.2)', 5);
    // the bus stop and its sign
    line([[300, FY], [300, FY - 560]], '#868e96', 12); pill('BUS: SOMEDAY', 300, FY - 585, 30, '#ffffff', { fill: '#1c7ed6', border: INK });
    card(380, FY - 300, 340, 20, '#495057', 6); card(380, FY - 470, 20, 190, '#495057', 4);
    // cobwebs and dust as years pass
    if (age > 0.4) alpha(prog(age, 0.4, 0.8), () => { c.strokeStyle = 'rgba(255,255,255,0.35)'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(390, FY - 460); c.lineTo(390 + 60 + i * 12, FY - 460 + i * 22); c.stroke(); } });
    who(waiter(age), { x: 550, y: FY - 4, s: 0.9, pose: { lean: 0, tilt: 6 + age * 12, drop: age * 10, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] }, expr: age > 0.4 ? 'tired' : 'neutral', look: -0.6 });
    at(560, FY - 520, 1, () => { pill(`YEAR ${years + 1}`, 0, 0, 34); });
    // Kai walks off along a road that leads somewhere
    at(2500, FY - 260, 1, () => { spot(0, 0, 300, 'rgba(242,193,78,0.4)'); pill('YOUR GOAL', 0, 0, 40, GOLD, { fill: '#2a2414', border: GOLD }); });
    const done = t > 9.6; spot(kx, FY - 200, 200, 'rgba(57,255,20,0.15)');
    who(done ? 'kai2' : 'kai', { x: Math.min(kx, 2350), y: FY - hop(t, 9.7, 60), s: 0.85, pose: t < 2.0 ? 'stand' : (done ? blend(P.walk(t), 'cheer', prog(t, 9.6, 9.9)) : P.walk(t * 1.5)), expr: done ? 'happy' : 'determined' });
  });
  title('STILL WAITING FOR SOMEDAY?', '#ffffff', 300, 58); if (t > 4) title('JUST START WALKING.', GREEN, 380, 62, GREEN);
});
