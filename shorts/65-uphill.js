// Story short: WHO REACHES THE TOP? Four push their product up a hill: motivation sprints and rolls back, overthinking never moves, shortcut quits, Kai keeps a steady pace.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, blend, hop, pill, lane, says, whichOne, spot } = require('./lib');
const CUT = 21.5; const END = 18.0;
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['MOTIVATION', '#ffd43b', person('#f59f00', 'curly')], ['OVERTHINKING', '#74c0fc', person('#1c7ed6', 'short')], ['SHORTCUTS', '#da77f2', person('#9c36b5', 'bun')], ['DISCIPLINE', GREEN, 'kai']];
const push = (t, eff) => ({ lean: 26, tilt: 0, armL: [80, -10], armR: [80, -10], legL: [-14 + Math.sin(t * 7 * eff) * 14, 0], legR: [24 - Math.sin(t * 7 * eff) * 14, -20] });
// progress 0..1 up the hill for each mindset
const pos = [(t) => (t < 4 ? ease(prog(t, 0.5, 4)) * 0.55 : 0.55 * (1 - ease(prog(t, 4.6, 6.2)))), () => 0, (t) => Math.min(0.3, prog(t, 0.5, 6) * 0.3), (t) => prog(t, 0.5, 16.5) * 1];
module.exports = makeShort(CUT, (t) => {
  dark(900);
  L.forEach(([name, col, spec], i) => {
    const quit = i === 2 && t > 6.5; const sat = i === 0 && t > 6.2;
    lane(i, name, col, (y0, fy) => {
      const hx = (k) => lerp(80, 820, k); const hy = (k) => lerp(fy, y0 + 200, k);
      K.ctx().fillStyle = '#20253a'; K.ctx().beginPath(); K.ctx().moveTo(60, fy + 40); K.ctx().lineTo(hx(0), hy(0)); K.ctx().lineTo(hx(1), hy(1)); K.ctx().lineTo(1060, hy(1)); K.ctx().lineTo(1060, fy + 40); K.ctx().closePath(); K.ctx().fill(); line([[hx(0), hy(0)], [hx(1), hy(1)]], 'rgba(255,255,255,0.25)', 4);
      at(hx(1) + 40, hy(1) - 60, 1, () => { line([[0, 50], [0, -30]], '#dee2e6', 4); K.ctx().fillStyle = GOLD; K.ctx().beginPath(); K.ctx().moveTo(0, -30); K.ctx().lineTo(50, -18); K.ctx().lineTo(0, -6); K.ctx().fill(); });
      const k = pos[i](t); const bx = hx(k) + 40; const by = hy(k) - 50; const r = 46;
      at(bx, by, 1, () => { K.ctx().rotate(k * 14); circle(0, 0, r, i === 3 ? '#2f9e44' : '#868e96'); label('$', 0, 3, 40, '#ffffff', { spacing: 0 }); });
      const kk = Math.max(0, k - 0.06); const done = i === 3 && t > 16.5;
      if (i === 2 && quit) { const x = lerp(hx(0.3) - 30, -100, prog(t, 6.5, 8)); who(spec, { x, y: hy(0.3) + 30 * prog(t, 6.5, 8), s: 0.4, flip: true, pose: P.walk(t * 2), expr: 'sad' }); }
      else if (i === 0 && sat) who(spec, { x: hx(0.04), y: hy(0.04), s: 0.4, pose: { lean: 0, tilt: 14, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] }, expr: 'tired' });
      else if (i === 1) who(spec, { x: hx(0) - 60 + Math.sin(t * 1.4) * 40, y: hy(0), s: 0.4, flip: Math.cos(t * 1.4) < 0, pose: { lean: 0, tilt: -6, armL: [8, 4], armR: [26, -150], legL: [5, 0], legR: [5, 0] }, expr: 'worried' });
      else { if (i === 3) spot(hx(kk), hy(kk) - 100, 120, 'rgba(57,255,20,0.2)'); who(done ? 'kai2' : spec, { x: done ? hx(1) - 40 : hx(kk), y: (done ? hy(1) : hy(kk)) - (done ? hop(t, 16.7, 20) : 0), s: 0.4, pose: done ? 'cheer' : push(t, i === 0 ? 2 : 1), expr: done ? 'happy' : 'determined' }); }
      at(900, fy - 10, 1, () => pill(`${Math.round(k * 500)} M`, 0, 0, 22, i === 3 ? GREEN : col, { pad: 30 }));
      if (i === 0) { says("LET'S GO!", 360, y0 + 70, t, 0.5, 3, '#ffd43b'); says("I'M TIRED.", 360, y0 + 70, t, 4.2, 6.2, '#ffd43b'); }
      if (i === 1) { says("WHAT'S THE BEST ANGLE?", 420, y0 + 70, t, 1, 8, '#74c0fc'); says('IF THE SLOPE IS 5 DEGREES...', 440, y0 + 70, t, 9, 17, '#74c0fc'); }
      if (i === 2) { says('THERE MUST BE A HACK.', 420, y0 + 70, t, 1, 6.3, '#da77f2'); }
      if (i === 3) { says('SAME PACE.', 360, y0 + 70, t, 1.5, 6, GREEN); says('REST. THEN GO.', 360, y0 + 70, t, 8, 12, GREEN); }
    }, { dim: (quit ? prog(t, 7, 8) : 0) * 0.5, border: i === 3 && t > 16.5 ? GREEN : undefined });
  });
  title('WHO REACHES THE TOP?', GOLD, 300, 70, GOLD);
  whichOne(t, END, [['MOTIVATION', '#ffd43b'], ['OVERTHINKING', '#74c0fc'], ['SHORTCUTS', '#da77f2'], ['DISCIPLINE', GREEN]]);
});
