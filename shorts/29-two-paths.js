// Short 29: EASY NOW, HARD LATER. Two paths: the easy one slopes down to REGRET, the hard one climbs to FREEDOM.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 10.6; const SX = 540; const SY = 1350; const CHOOSE = 2.6;
const easyP = (k) => [lerp(SX, 110, k), lerp(SY, 1850, k)]; const hardP = (k) => [lerp(SX, 980, k), lerp(SY, 1000, k)];
const crowd = (i) => ({ hair: { type: ['short', 'curly', 'bun'][i % 3], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#e8590c', '#9c36b5', '#e03131'][i % 4] }, pants: '#3b4252', shoes: '#e5e5e5' });
module.exports = makeShort(CUT, (t) => {
  dark(1000); const c = K.ctx(); const kk = ease(prog(t, CHOOSE + 0.5, 9.4)); const top = t > 9.4;
  camera({ x: lerp(540, 640, prog(t, CHOOSE + 0.5, 9.4)), y: 1260, z: lerp(0.92, 1.0, prog(t, 2, 9)), t }, () => {
    c.lineCap = 'round'; c.strokeStyle = '#3b1f1f'; c.lineWidth = 70; c.beginPath(); c.moveTo(...easyP(0)); c.lineTo(...easyP(1)); c.stroke(); c.strokeStyle = '#123d1c'; c.beginPath(); c.moveTo(...hardP(0)); c.lineTo(...hardP(1)); c.stroke();
    for (let i = 0; i < 10; i++) { const [x, y] = hardP(i / 10); card(x - 20, y - 12, 40, 12, '#2f9e44', 3); }
    label('EASY', 230, 1550, 44, '#ff8787', { spacing: 6 }); label('HARD', 860, 1200, 44, GREEN, { spacing: 6 });
    at(...easyP(1).map((v, i) => v + (i ? -70 : 60)), 1, () => { card(-110, -40, 220, 80, '#3b1f1f', 16, RED, 4); label('REGRET', 0, 2, 36, '#ff8787', { spacing: 4 }); });
    at(hardP(1)[0] - 280, hardP(1)[1] + 20, 1, () => { spot(0, 0, 220, 'rgba(242,193,78,0.4)'); card(-120, -40, 240, 80, '#2a2414', 16, GOLD, 4); label('FREEDOM', 0, 2, 36, GOLD, { spacing: 4 }); });
    // the crowd slides down the easy path
    for (let i = 0; i < 4; i++) { const k = ease(prog(t, 0.8 + i * 0.35, 4.5 + i * 0.5)); const [x, y] = easyP(k); alpha(1 - prog(k, 0.9, 1), () => who(crowd(i), { x: x + i * 30 - 45, y, s: 0.65, pose: k > 0 && k < 1 ? P.walk(t * 1.6 + i) : 'stand', expr: k > 0.6 ? 'sad' : 'happy' })); }
    // Kai thinks at the fork, then climbs the hard path
    const [kx, ky] = hardP(kk); spot(kx, ky - 160, 200, 'rgba(57,255,20,0.18)');
    who(top ? 'kai2' : 'kai', { x: kx, y: ky - hop(t, 9.5, 60), s: 0.7, pose: t < CHOOSE + 0.5 ? { lean: 0, tilt: -6 + Math.sin(t * 2) * 4, armL: [8, 4], armR: [26, -150], legL: [5, 0], legR: [5, 0] } : (top ? blend(P.walk(t * 1.2), 'cheer', prog(t, 9.4, 9.8)) : { ...P.walk(t * 1.2), lean: -8 }), expr: top ? 'happy' : 'determined', look: t < CHOOSE ? Math.sin(t * 2) : 0.5 });
  });
  title('EASY NOW, HARD LATER.', '#ffffff', 290, 62); title('HARD NOW, EASY LATER.', GREEN, 370, 62, GREEN);
});
