// A REASON. Criticism rains down: lol, cringe, why? Kai opens an umbrella labelled MY WHY, and keeps walking.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, line, circle, who, P, rnd } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, blend, hop, ground, cloud } = require('./lib');
const CUT = 6.8; const FY = 1450; const OPEN = 2.0; const WORDS = ['lol', 'cringe', 'why?', 'flop', 'quit', 'nobody cares'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const o = ease(prog(t, OPEN, OPEN + 0.4)); const kx = t < OPEN ? 300 : lerp(300, 820, prog(t, OPEN + 0.4, CUT)); const c = K.ctx();
  camera({ x: 560, y: 1100, z: 1.0, t }, () => {
    ground(FY); cloud(300, 560, 1.4, '#343a52'); cloud(760, 540, 1.3, '#343a52');
    for (let i = 0; i < 18; i++) { const x = 130 + (i % 6) * 150; const y = 640 + ((t * 300 + Math.floor(i / 6) * 273 + (i % 6) * 97) % 820); const under = o > 0.5 && Math.abs(x - kx) < 220 && y > FY - 740; if (under) continue; label(WORDS[i % WORDS.length], x, y, 22, '#ff8787', { spacing: 1 }); }
    if (o > 0) { at(kx, FY - 520, 1, () => { c.fillStyle = '#2f9e44'; c.beginPath(); c.arc(0, 0, 170 * o, Math.PI, 0); c.closePath(); c.fill(); label('MY WHY', 0, -60 * o, 30 * o + 1, '#ffffff', { spacing: 3 }); line([[0, 0], [0, 210]], '#adb5bd', 6); }); }
    if (o > 0.5) M.walk(t > 5.4 ? 'kai2' : 'kai', kx, FY, 0.85, { armR: [150, 30], expr: 'smile' }); else M.idle('kai', kx, FY, 0.85, t, { crouch: 18, lean: 10, tilt: 8, armL: [6, 4], armR: [6, 4], expr: 'sad' });
  });
  title(o > 0.5 ? 'KNOW YOUR WHY.' : 'THE CRITICS WILL COME.', o > 0.5 ? GREEN : '#ffffff', 300, 70, o > 0.5 ? GREEN : undefined);
});
