// Story short: WHO'S STILL POSTING? Day 1, 30, 100, 365. Motivation stops, ego blames the algorithm, talent gets bored; Kai keeps going.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, who, P, money } = K;
const { W, dark, label, makeShort, title, hop, pill, lane, says, whichOne, spot } = require('./lib');
const CUT = 21.5; const END = 18.0; const STAGES = [[0.3, 'DAY 1'], [4.5, 'DAY 30'], [9, 'DAY 100'], [13.5, 'DAY 365']];
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['MOTIVATION', '#ffd43b', person('#f59f00', 'curly'), 1], ['EGO', '#ff8787', person('#e03131', 'slick'), 2], ['TALENT', '#74c0fc', person('#1c7ed6', 'short'), 2], ['DISCIPLINE', GREEN, 'kai', 9]];
const LINES = [["LET'S GO!", 'NOT FEELING IT.', '...', '...'], ['I WAS BORN FOR THIS.', 'THE ALGORITHM HATES ME.', 'GONE.', 'GONE.'], ['EASY.', 'GOOD ENOUGH.', 'BORED. QUIT.', '...'], ['POST #1.', 'POST #30.', 'POST #100.', 'POST #365.']];
module.exports = makeShort(CUT, (t) => {
  dark(900); const st = STAGES.filter(([a]) => t > a).length - 1;
  L.forEach(([name, col, spec, lastStage], i) => { const active = st < lastStage || i === 3; const done = i === 3 && st === 3;
    lane(i, name, col, (y0, fy) => { K.line([[40, fy], [W - 40, fy]], 'rgba(255,255,255,0.12)', 3);
      if (active) { spot(220, fy - 100, 130, i === 3 ? 'rgba(57,255,20,0.18)' : 'rgba(255,255,255,0.05)'); who(done ? 'kai2' : spec, { x: 220, y: fy, s: 0.42, pose: done ? 'cheer' : { lean: 0, tilt: 6, armL: [8, 4], armR: [22, -132 + (Math.sin(t * 8 + i) > 0.6 ? 10 : 0)], legL: [5, 0], legR: [5, 0] }, expr: done ? 'happy' : (i === 3 ? 'determined' : (st > 0 ? 'tired' : 'happy')), prop: done ? undefined : 'phone' }); }
      else label('STOPPED', 220, fy - 60, 26, '#868e96', { spacing: 4 });
      says(LINES[i][Math.max(0, st)], 560, y0 + 70, t, STAGES[Math.max(0, st)][0] + 0.2, (STAGES[st + 1] || [END])[0] - 0.1, col);
      const followers = i === 3 ? Math.round(prog(t, 0.3, 17) ** 2.4 * 48000) : Math.round(Math.min(prog(t, 0.3, STAGES[lastStage][0]), 1) * [40, 120, 300][i]);
      at(760, y0 + 190, 1, () => pill(`${followers.toLocaleString('en-US')} FOLLOWERS`, 0, 0, 22, i === 3 && followers > 500 ? GREEN : '#9aa3b5', { pad: 30 }));
    }, { dim: active ? 0 : 0.5, border: done ? GREEN : undefined }); });
  pill(STAGES[Math.max(0, st)][1], W / 2, 385, 30, '#ffffff');
  title("WHO'S STILL POSTING?", GOLD, 300, 64, GOLD);
  whichOne(t, END, [['MOTIVATION', '#ffd43b'], ['EGO', '#ff8787'], ['TALENT', '#74c0fc'], ['DISCIPLINE', GREEN]]);
});
