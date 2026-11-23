// DONE BEATS PERFECT. Blocks drop in. Kai catches each one and stacks it, crooked or not. The perfectionist inspects each one and throws it away.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, pop, at, card, line, rnd } = K;
const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, pill, ground, npc, confetti } = require('./lib');
const CUT = 7.0; const FY = 1450; const S = 0.9; const N = 9; const BH = 62; const EVERY = 0.58; const GOAL = FY - N * BH - 10;
const KX = 170; const PX = 890; const SKX = 380; const SPX = 710;            // characters and their stacks
// one block's cycle: falls into hands (0-0.25), carried (0.25-0.45), placed (0.45-0.55)
function block(i, t, kai) { const a = 0.4 + i * EVERY; const k = (t - a) / EVERY; const crook = rnd(i + 7) > 0.45;
  const hand = kai ? [KX + 70, FY - 330] : [PX - 70, FY - 360];
  if (k < 0) return null;
  if (k < 0.25) { const f = M.smooth(k / 0.25); return { x: hand[0], y: lerp(520, hand[1], f * f), rot: crook ? 0.3 : 0, crook, held: f > 0.95 }; }
  if (kai) { const top = FY - (i + 1) * BH + BH / 2; if (k < 0.55) { const f = M.smooth((k - 0.25) / 0.3); return { x: lerp(hand[0], SKX, f), y: lerp(hand[1], top, f) - Math.sin(f * Math.PI) * 60, rot: crook ? 0.3 * (1 - f) + 0.12 : 0, crook, held: f < 0.95 }; } return { x: SKX + (rnd(i) - 0.5) * 16, y: top, rot: crook ? 0.12 : 0, crook }; }
  if (!crook && i < 3) { const top = FY - (i + 1) * BH + BH / 2; if (k < 0.55) { const f = M.smooth((k - 0.25) / 0.3); return { x: lerp(hand[0], SPX, f), y: lerp(hand[1], top, f), rot: 0, crook, held: f < 0.95 }; } return { x: SPX, y: top, rot: 0, crook }; }
  if (k < 0.55) { const f = (k - 0.25) / 0.3; return { x: hand[0] + Math.sin(f * 20) * 6, y: hand[1] - 40 * M.smooth(f), rot: Math.sin(f * 9) * 0.3, crook, held: true, inspect: true }; }
  const f = (k - 0.55) / 0.6; return f > 1 ? null : { x: hand[0] + f * 520, y: hand[1] - 40 - Math.sin(f * Math.PI) * 200 + f * f * 700, rot: f * 8, crook };
}
module.exports = makeShort(CUT, (t) => {
  dark(900); const done = t > 0.4 + N * EVERY;
  camera({ x: 540, y: lerp(1180, 1080, prog(t, 0, 5)), z: 1.0, t }, () => {
    ground(FY); line([[280, GOAL], [480, GOAL]], done ? GREEN : 'rgba(242,193,78,0.5)', 4); label('SUCCESS', SKX, GOAL - 40, 40, done ? GREEN : GOLD, { spacing: 6, glow: done ? GREEN : GOLD });
    card(SKX - 90, FY - 16, 180, 16, '#3a4158', 4); card(SPX - 90, FY - 16, 180, 16, '#3a4158', 4);
    let kh = null; let ph = null;
    for (let i = 0; i < N; i++) for (const kai of [true, false]) { const b = block(i, t, kai); if (!b) continue; if (b.held) { if (kai) kh = b; else ph = b; }
      K.alpha(K.clamp((b.y - 500) / 120), () => at(b.x, b.y, 1, () => card(-72, -BH / 2 + 2, 144, BH - 4, kai ? (b.crook ? '#2b8a3e' : '#2f9e44') : '#868e96', b.crook ? 3 : 10, INK, 3), b.rot)); }
    // Kai: arms reach to the block he holds; otherwise ready, then cheers
    const kp = M.stand(KX, FY, S, t, { lean: kh ? 8 : 0, crouch: kh ? 12 : 0 });
    M.figure({ spec: done ? 'kai2' : 'kai', ...kp, handL: kh ? [kh.x - 50, kh.y + 20] : null, handR: kh ? [kh.x + 50, kh.y + 20] : null, armL: done ? [150, 16] : [40, -60], armR: done ? [150, 16] : [40, -60], expr: done ? 'happy' : 'determined' });
    const pp = M.stand(PX, FY, S, t, { flip: true, tilt: ph && ph.inspect ? -10 : 0 });
    M.figure({ spec: npc('#9c36b5', 'bun'), ...pp, handL: ph ? [ph.x - 40, ph.y + 20] : null, handR: ph ? [ph.x + 40, ph.y + 20] : null, armL: [14, 4], armR: [14, 4], expr: ph && ph.inspect ? 'worried' : 'neutral' });
    label('CONSISTENCY', SKX, FY + 60, 26, GREEN, { spacing: 3 }); label('PERFECTIONISM', SPX + 20, FY + 60, 26, '#da77f2', { spacing: 3 });
    if (done) confetti(t, 0.4 + N * EVERY, SKX, GOAL - 200);
  });
  title('DONE BEATS PERFECT.', done ? GREEN : '#ffffff', 300, 76, done ? GREEN : undefined);
});
