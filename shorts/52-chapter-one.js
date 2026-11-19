// Short 52: CHAPTER 1 vs CHAPTER 20. Kai compares his thin book to someone's thick one, then his own pages fly past to chapter 20.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, RED, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const FY = 1500; const FLIP = 2.8; const DONE = 5.2;
const guru = { hair: { type: 'slick', color: '#2b2b33' }, top: { type: 'blazer', color: '#e8590c', shirt: '#ffffff' }, pants: '#3b4252', shoes: '#1b1b1f', acc: ['watch'] };
function book(x, y, thick, ch, col, t, open) { at(x, y, 1, () => { card(-140, -thick, 280, thick, '#f1f3f5', 6, INK, 4); card(-150, -thick - 20, 300, 24, col, 6, INK, 4); card(-150, 0, 300, 24, col, 6, INK, 4); for (let i = 0; i < thick / 12; i++) line([[-130, -i * 12 - 6], [130, -i * 12 - 6]], '#ced4da', 2); label(`CHAPTER ${ch}`, 0, -thick - 70, 40, '#ffffff', { spacing: 3 }); }); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const ch = Math.round(lerp(1, 20, ease(prog(t, FLIP, DONE)))); const done = t > DONE; const thick = lerp(30, 300, ease(prog(t, FLIP, DONE)));
  camera({ x: 540, y: 1150, z: lerp(1.08, 1.0, prog(t, 0, FLIP)) + (done ? 0.04 * Math.exp(-(t - DONE) * 3) : 0), shake: impact(t, DONE, 12), t }, () => {
    card(-300, FY, 1700, 900, '#141823', 0); line([[-300, FY], [1400, FY]], 'rgba(255,255,255,0.15)', 4);
    // their book: thick, chapter 20
    book(800, FY - 380, 300, 20, RED, t); who(guru, { x: 800, y: FY, s: 0.8, pose: 'crossed', expr: 'smug' });
    // Kai's book: thin, then pages fly in as the chapters pass
    book(280, FY - 380, thick, ch, GREEN, t);
    if (t > FLIP && !done) floaters(t, 40, (i, life) => at(280 + (rnd(i) - 0.5) * 600 * (1 - life), FY - 380 - thick - 300 * (1 - life), 1, () => card(-60, -40, 120, 80, '#f1f3f5', 4, '#adb5bd', 2), (1 - life) * (i % 2 ? 2 : -2)), { every: 0.04, from: FLIP, life: 0.5 });
    who(done ? 'kai2' : 'kai', { x: 280, y: FY - hop(t, DONE + 0.1, 50), s: 0.8, pose: done ? blend(P.type, 'cheer', prog(t, DONE, DONE + 0.3)) : (t < FLIP ? blend('stand', 'slump', prog(t, 0.6, 1.4)) : P.type), expr: done ? 'happy' : (t < FLIP ? 'sad' : 'determined'), look: t < FLIP ? 0.7 : 0 });
  });
  title("DON'T COMPARE YOUR CHAPTER 1", '#ffffff', 280, 52); title('TO THEIR CHAPTER 20.', done ? GREEN : GOLD, 360, 62, done ? GREEN : GOLD);
});
