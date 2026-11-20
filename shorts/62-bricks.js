// Story short: WHEN LIFE THROWS BRICKS. The quitter runs, anger smashes them, ego ignores them; Kai stacks them and rises.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, lane, says, whichOne, spot } = require('./lib');
const CUT = 19.5; const END = 16.0; const NAMES = ['NO SALES', 'RENT DUE', 'HATERS', 'REJECTED', 'DOUBT', 'BAD REVIEW', 'BROKE', 'LAID OFF'];
const person = (col, hair, acc = []) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5', acc });
const L = [['QUITTER', '#868e96', person('#868e96', 'short')], ['ANGER', '#ff6b6b', person('#e03131', 'curly')], ['EGO', '#ffd43b', person('#f59f00', 'slick', ['chain'])], ['BUILDER', GREEN, 'kai']];
const THROW = Array.from({ length: 22 }, (_, j) => 0.6 + j * 0.62);       // the same bricks come at every lane
const brick = (x, y, s, rot, name) => at(x, y, s, () => { card(-60, -22, 120, 44, '#b5543c', 5, '#5c2a1c', 3); label(name, 0, 2, 16, '#fff3bf', { spacing: 1 }); }, rot);
module.exports = makeShort(CUT, (t) => {
  dark(900); const stacked = THROW.filter((a) => t > a + 0.55).length;
  L.forEach(([name, col, spec], i) => {
    const gone = i === 0 && t > 3.2; const buried = i === 1 && t > 9; const down = i === 2 && t > 7.4;
    lane(i, name, col, (y0, fy) => {
      line([[40, fy], [W - 40, fy]], 'rgba(255,255,255,0.12)', 3);
      // the thrower on the right
      const thrower = { hair: { type: 'short', color: '#111' }, top: { type: 'tee', color: '#212529' }, pants: '#111', shoes: '#111', eye: '#ff2b2b' };
      who(thrower, { x: 930, y: fy, s: 0.42, flip: true, pose: { lean: 0, tilt: 0, armL: [8, 4], armR: [100 + Math.max(0, Math.sin(t * 10.1)) * 60, -20], legL: [6, 0], legR: [6, 0] }, expr: 'smug', still: true });
      // Kai's stack grows under him; the others' bricks scatter
      const kx = 300; const towerH = i === 3 ? stacked * 22 : 0;
      THROW.forEach((a, j) => { if (t < a) return; const f = easeOut(prog(t, a, a + 0.55)); const nm = NAMES[j % NAMES.length];
        if (i === 3) { const ty = fy - 22 - (j * 22); const x = lerp(900, kx, f); const y = lerp(fy - 120, ty + 11, f) - Math.sin(f * Math.PI) * 120; if (f >= 1) card(kx - 60, ty, 120, 22, '#b5543c', 3, '#5c2a1c', 2); else brick(x, y, 0.8, f * 6, nm); return; }
        if (i === 0 && gone) return;
        const land = [kx + (rnd(j + i) - 0.5) * 200, fy - 14]; const x = lerp(900, land[0], f); const y = lerp(fy - 120, land[1], f) - Math.sin(f * Math.PI) * 90;
        if (i === 1 && f >= 1) { brick(land[0], fy - 14 - (j % 6) * 18, 0.7, rnd(j) * 2, nm); return; }
        if (i === 1 && f > 0.8 && f < 1) floaters(t, 6, (k, life) => circle(land[0] + Math.cos(k) * life * 60, land[1] - 40 - life * 40, 6, RED), { every: 0.01, from: a + 0.45, life: 0.3 });
        brick(x, y, 0.7, f * 5, nm); });
      // the characters
      if (i === 0) { const x = gone ? lerp(kx, -120, prog(t, 3.2, 4.4)) : kx; if (x > -100) who(spec, { x, y: fy, s: 0.42, flip: gone, pose: gone ? P.walk(t * 2) : 'slump', expr: 'worried' }); says('I GIVE UP.', 560, y0 + 120, t, 2.4, 4.6, '#ced4da'); }
      if (i === 1) { who(spec, { x: kx, y: fy + (buried ? 0 : 0), s: 0.42, pose: { lean: 0, tilt: 0, armL: [80 + Math.sin(t * 12) * 40, -20], armR: [80 - Math.sin(t * 12) * 40, -20], legL: [10, 0], legR: [10, 0] }, expr: 'angry' }); if (buried) for (let k = 0; k < 10; k++) card(kx - 80 + (k % 4) * 40, fy - 30 - Math.floor(k / 4) * 30 - 60 * prog(t, 9, 11), 40, 30, '#b5543c', 3, '#5c2a1c', 2); says('HOW DARE YOU!', 560, y0 + 120, t, 1.5, 8.5, '#ff8787'); }
      if (i === 2) { at(kx, fy, 1, () => who(spec, { x: 0, y: 0, s: 0.42, pose: down ? 'stand' : 'crossed', expr: down ? 'shock' : 'smug', still: true }), down ? -Math.PI / 2 * ease(prog(t, 7.4, 7.8)) : 0); if (!down) at(kx, fy - 190, 1, () => { K.ctx().fillStyle = GOLD; K.ctx().beginPath(); K.ctx().moveTo(-24, 0); K.ctx().lineTo(-24, -24); K.ctx().lineTo(-10, -10); K.ctx().lineTo(0, -28); K.ctx().lineTo(10, -10); K.ctx().lineTo(24, -24); K.ctx().lineTo(24, 0); K.ctx().fill(); }); says("I'M ABOVE THIS.", 560, y0 + 120, t, 1.0, 7.2, '#ffd43b'); }
      if (i === 3) { const done = t > 13.5; spot(kx, fy - towerH - 120, 160, 'rgba(57,255,20,0.18)'); who(done ? 'kai2' : 'kai', { x: kx, y: fy - towerH - hop(t, 13.6, 30), s: 0.42, pose: done ? 'cheer' : { lean: 0, tilt: 0, armL: [70, -40], armR: [70, -40], legL: [6, 0], legR: [6, 0] }, expr: done ? 'happy' : 'determined' }); says('THANKS FOR THE BRICKS.', 600, y0 + 120, t, 6, 12.5, GREEN); }
    }, { dim: i === 0 && gone ? prog(t, 4, 5) * 0.5 : 0, border: i === 3 && t > 10 ? GREEN : undefined });
  });
  title(t > 11 ? 'BUILD WITH THEM.' : 'WHEN LIFE THROWS BRICKS...', t > 11 ? GREEN : '#ffffff', 300, t > 11 ? 80 : 60, t > 11 ? GREEN : undefined);
  whichOne(t, END, [['QUITTER', '#868e96'], ['ANGER', '#ff6b6b'], ['EGO', '#ffd43b'], ['BUILDER', GREEN]]);
});
