// Story short: EVERYONE SEES THIS / NOBODY SEES THIS. A podium flips upside down to show what each one carries underneath.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, H, dark, label, makeShort, title, camera, blend, hop, pill, spot } = require('./lib');
const CUT = 13.5; const FLIP1 = 3.6; const FLIP2 = 9.2; const PY = 1000;
const luck = { hair: { type: 'slick', color: '#2b2b33' }, top: { type: 'tee', color: '#868e96' }, pants: '#3b4252', shoes: '#e5e5e5', acc: ['chain'] };
const talent = { hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'tee', color: '#74c0fc' }, pants: '#3b4252', shoes: '#e5e5e5' };
const BOX = [[-330, 220, 2, talent, 'TALENT'], [0, 360, 1, 'kai2', 'CONSISTENCY'], [330, 140, 3, luck, 'LUCK']];
const carry = (t, heavy) => ({ lean: heavy ? 20 : 0, tilt: heavy ? 10 : 0, drop: heavy ? 40 : 0, armL: [160, -10 + (heavy ? Math.sin(t * 6) * 6 : 0)], armR: [160, -10], legL: [heavy ? 30 : 8, heavy ? -60 : 0], legR: [heavy ? 30 : 8, heavy ? -60 : 0] });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900);
  const f1 = prog(t, FLIP1, FLIP1 + 0.6); const f2 = prog(t, FLIP2, FLIP2 + 0.6); const under = (f1 >= 0.5 && f2 < 0.5);
  const sq = Math.abs(Math.cos(Math.PI * (t < FLIP2 ? f1 : f2)));
  c.save(); c.translate(W / 2, PY - 200); c.scale(1, Math.max(0.02, sq)); c.translate(-W / 2, -(PY - 200));
  if (!under) {
    spot(W / 2, PY - 300, 600, 'rgba(242,193,78,0.15)');
    BOX.forEach(([dx, h, rank, spec]) => { const x = W / 2 + dx; card(x - 150, PY - h, 300, h, '#1b1f2b', 8, rank === 1 ? GOLD : 'rgba(255,255,255,0.3)', 4); label(String(rank), x, PY - h + 70, 80, rank === 1 ? GOLD : '#ffffff', { spacing: 0 });
      who(spec, { x, y: PY - h, s: 0.75, pose: rank === 1 ? 'cheer' : (rank === 2 ? 'slump' : { lean: 0, tilt: 8, armL: [8, 4], armR: [22, -132], legL: [5, 0], legR: [5, 0] }), expr: rank === 1 ? 'happy' : (rank === 2 ? 'sad' : 'smug'), prop: rank === 3 ? 'phone' : undefined }); });
    floaters(t, 30, (i, life) => card(200 + rnd(i) * 680, 400 + life * 700, 10, 18, ['#ffd43b', '#51cf66', '#74c0fc'][i % 3], 3), { every: 0.08, from: 0, life: 1.5 });
  } else {
    // underneath: each podium is a weight held up from below; the higher the rank, the heavier
    const FL = 1450; line([[60, FL], [1020, FL]], 'rgba(255,255,255,0.2)', 4);
    BOX.forEach(([dx, h, rank, spec]) => { const x = W / 2 + dx; const heavy = rank === 1; const s = 0.75; const handY = FL - 376 * s - 90;
      const load = heavy ? 520 : (rank === 2 ? 260 : 120); const bob = heavy ? Math.sin(t * 6) * 6 : 0;
      card(x - 150, handY - load + bob, 300, load, '#1b1f2b', 8, heavy ? GOLD : 'rgba(255,255,255,0.3)', 4); label(String(rank), x, handY - load + 60 + bob, 70, heavy ? GOLD : '#ffffff', { spacing: 0 });
      (heavy ? ['LATE NIGHTS', '100 FAILS', 'NO SALES', 'DOUBT'] : [rank === 2 ? 'PRACTICE' : 'NOTHING']).forEach((w, k) => label(w, x, handY - load + 140 + k * 70 + bob, 28, '#9aa3b5', { spacing: 2 }));
      who(heavy ? 'kai' : spec, { x, y: FL, s, pose: { lean: 0, tilt: heavy ? 10 : 0, drop: heavy ? 30 + bob : 0, armL: [165, 0], armR: [165, 0], legL: [heavy ? 24 : 8, heavy ? -50 : 0], legR: [heavy ? 24 : 8, heavy ? -50 : 0] }, expr: heavy ? 'determined' : (rank === 2 ? 'neutral' : 'smug'), still: true });
      if (heavy) floaters(t, 6, (k, life) => circle(x - 30 + k % 3 * 30, FL - 376 * s - 20 - life * 40, 6, '#74c0fc'), { every: 0.2, from: 0, life: 0.5 }); });
  }
  c.restore();
  title(t > FLIP2 + 0.4 ? 'THE HIGHER YOU RISE, THE MORE YOU CARRY.' : (under ? 'NOBODY SEES THIS.' : 'EVERYONE SEES THIS.'), t > FLIP2 + 0.4 ? GOLD : '#ffffff', 300, t > FLIP2 + 0.4 ? 40 : 76, t > FLIP2 + 0.4 ? GOLD : undefined);
});
