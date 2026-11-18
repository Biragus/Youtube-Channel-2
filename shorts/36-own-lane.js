// Short 36: YOUR OWN LANE. A crowd runs the same track to the same office; Kai steps out and runs his own lane to his own finish line.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 10.6; const TURN = 3.0;
const runner = (i) => ({ hair: { type: 'short', color: '#2b2b33' }, top: { type: 'shirt', color: '#5c6f8a' }, pants: '#3b4252', shoes: '#e5e5e5', acc: i % 2 ? ['badge'] : [] });
module.exports = makeShort(CUT, (t) => {
  dark(800); const c = K.ctx(); const turnK = ease(prog(t, TURN, TURN + 0.8)); const prog2 = prog(t, TURN + 0.8, 9.6); const done = t > 9.6;
  // Kai moves up the screen into his own lane; the camera rises with him
  const ky = lerp(1500, 1180, turnK) - prog2 * 1600; const kx = lerp(520, 760, turnK);
  camera({ x: 560, y: Math.min(1100, ky - 200), z: 1.0, t }, () => {
    // the crowded lane, heading to a grey office block
    card(200, -1000, 400, 3000, '#262b3a', 0); for (let y = -1000; y < 2000; y += 140) card(395, y + (t * 300) % 140, 10, 70, 'rgba(255,255,255,0.15)', 2);
    card(220, 560, 360, 260, '#495057', 6); label('SAME JOB', 400, 690, 36, '#ced4da', { spacing: 4 });
    for (let i = 0; i < 8; i++) { const yy = 1600 - ((t * 120 + i * 180) % 1300); who(runner(i), { x: 280 + (i % 3) * 110, y: yy, s: 0.55, pose: P.walk(t * 1.4 + i), expr: 'tired' }); }
    // Kai's lane: bright, empty, leading to his own finish line
    alpha(prog(t, TURN - 0.3, TURN + 0.5), () => { card(640, -1000, 240, 3000, '#123d1c', 0); for (let y = -1000; y < 2000; y += 140) card(755, y + (t * 500) % 140, 10, 70, 'rgba(57,255,20,0.35)', 2); });
    at(760, -260, 1, () => { card(-140, -20, 280, 40, GREEN, 6); label('YOUR GOAL', 0, -70, 40, GREEN, { spacing: 4, glow: GREEN }); });
    spot(kx, ky - 140, 200, 'rgba(57,255,20,0.2)');
    who(done ? 'kai2' : 'kai', { x: kx, y: Math.max(-240, ky) - hop(t, 9.7, 60), s: 0.65, pose: done ? blend(P.walk(t), 'cheer', prog(t, 9.6, 9.9)) : P.walk(t * (t > TURN ? 2.2 : 1.4)), expr: t < TURN ? 'tired' : (done ? 'happy' : 'determined'), look: t > TURN - 0.6 && t < TURN ? 0.8 : 0 });
  });
  title('STOP RUNNING THEIR RACE.', '#ffffff', 300, 58); if (t > TURN) title('RUN YOUR OWN.', GREEN, 380, 70, GREEN);
});
