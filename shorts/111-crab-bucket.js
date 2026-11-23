// THE BUCKET. Kai climbs up the side of a bucket; the others grab his legs and pull him back ("where are you going?"). He shakes free and climbs out.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, npc, confetti } = require('./lib');
const CUT = 6.8; const BY = 1480; const RIM = 980; const PULL = [1.4, 2.6]; const OUT = 4.4;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); let ky; if (t < PULL[0]) ky = lerp(BY, 1180, prog(t, 0.3, PULL[0])); else if (t < PULL[0] + 0.5) ky = lerp(1180, 1380, prog(t, PULL[0], PULL[0] + 0.3)); else if (t < PULL[1]) ky = lerp(1380, 1120, prog(t, PULL[0] + 0.5, PULL[1])); else if (t < PULL[1] + 0.5) ky = lerp(1120, 1300, prog(t, PULL[1], PULL[1] + 0.3)); else ky = lerp(1300, RIM, prog(t, PULL[1] + 0.6, OUT)); const out = t > OUT;
  camera({ x: 540, y: 1100, z: 1.0, shake: PULL.reduce((s, a) => s + impact(t, a, 8), 0), t }, () => {
    K.line([[-200, BY], [1300, BY]], 'rgba(255,255,255,0.15)', 4);
    c.fillStyle = '#343a52'; c.beginPath(); c.moveTo(220, RIM); c.lineTo(280, BY); c.lineTo(800, BY); c.lineTo(860, RIM); c.closePath(); c.fill(); line([[200, RIM], [880, RIM]], '#adb5bd', 12);
    label('THE BUCKET', 540, BY - 60, 30, '#868e96', { spacing: 4 });
    for (let i = 0; i < 3; i++) { const pulling = PULL.some((a) => t > a - 0.2 && t < a + 0.5); who(npc(['#1c7ed6', '#e8590c', '#9c36b5'][i], ['curly', 'short', 'bun'][i]), { x: 420 + i * 120, y: BY, s: 0.55, pose: pulling && i === 2 ? { lean: 0, tilt: -6, armL: [8, 4], armR: [150, 20], legL: [6, 0], legR: [6, 0] } : 'crossed', expr: out ? 'shock' : 'smug', look: 0.6 }); }
    PULL.forEach((a) => { if (t > a - 0.2 && t < a + 1.0) at(540, BY - 420, 1, () => pill('WHERE ARE YOU GOING?', 0, 0, 22, '#ff8787', { pad: 30 })); });
    const climb = { lean: 0, tilt: 0, armL: [160 + Math.sin(t * 8) * 10, 10], armR: [160 - Math.sin(t * 8) * 10, 10], legL: [30 + Math.sin(t * 8) * 20, -60], legR: [30 - Math.sin(t * 8) * 20, -60] };
    if (out && t > OUT + 0.6) M.celebrate('kai2', 1000, RIM, 0.6, t, OUT + 0.6); else if (out) M.walk('kai', lerp(860, 1000, prog(t, OUT, OUT + 0.6)), RIM, 0.6, { expr: 'happy' }); else { const kx = 830 + (ky - RIM) * 0.12; const sw = Math.sin(t * 8); const hy = ky - 150 * 0.6; M.figure({ spec: 'kai', hip: [kx, hy], ground: ky, s: 0.6, footL: [kx - 20, hy + 80 + sw * 16], footR: [kx + 16, hy + 80 - sw * 16], handL: [kx - 14, hy - 160 - sw * 20], handR: [kx + 22, hy - 160 + sw * 20], expr: 'determined' }); }
    if (out) confetti(t, OUT + 0.6, 1000, RIM - 400, 200);
  });
  title(out ? 'CLIMB OUT ANYWAY.' : 'THEY WILL PULL YOU BACK.', out ? GREEN : '#ffffff', 300, 66, out ? GREEN : undefined);
});
