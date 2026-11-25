// Story short: KEEP SWINGING. Four hammer at rocks. They quit at 12, 40, 99. Kai hits #100 and the rock splits open on gold.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, at, line, circle, who, P, floaters } = K; const A = require('../engine/actions'); const M = require('../engine/motion');
const { W, dark, label, makeShort, title, hop, pill, lane, says, whichOne, spot, rock, coin } = require('./lib');
const CUT = 18.5; const END = 15.0; const BREAK = 12.5;
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'tee', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['QUITS AT 12', '#ffd43b', person('#f59f00', 'curly'), 12], ['QUITS AT 40', '#ff8787', person('#e03131', 'short'), 40], ['QUITS AT 99', '#74c0fc', person('#1c7ed6', 'bun'), 99], ['KEEPS SWINGING', GREEN, 'kai', 100]];
const hitsAt = (t) => Math.floor(prog(t, 0.4, BREAK) ** 1.2 * 100);
const swing = (t) => ({ lean: 10, tilt: 4, armL: [110 + Math.sin(t * 10) * 50, -20], armR: [110 + Math.sin(t * 10) * 50, -20], legL: [12, 0], legR: [12, 0] });
module.exports = makeShort(CUT, (t) => {
  dark(900); const h = hitsAt(t);
  L.forEach(([name, col, spec, stop], i) => { const quit = h >= stop && i < 3; const won = i === 3 && t > BREAK;
    lane(i, name, col, (y0, fy) => { K.line([[40, fy], [W - 40, fy]], 'rgba(255,255,255,0.12)', 3);
      if (!won) rock(560, fy - 70, 80, '', '#5c6070'); else { for (let k = 0; k < 2; k++) rock(560 + (k ? 1 : -1) * (40 + (t - BREAK) * 120), fy - 50, 50, '', '#5c6070'); for (let k = 0; k < 5; k++) coin(520 + k * 22, fy - 40 - Math.abs(Math.sin(t * 4 + k)) * 20, 18, t * 4 + k); spot(560, fy - 60, 150, 'rgba(242,193,78,0.4)'); }
      if (!quit) { if (won) M.celebrate('kai2', 420, fy, 0.42, t, BREAK + 0.2); else A.chop(spec, 432, fy, 0.42, t, { tool: 'sledge', period: 0.62, t0: i * 0.17, low: 48, len: 170, expr: 'determined' }); }
      else who(spec, { x: 420 - Math.min(400, (t - prog(stop / 100, 0, 1)) * 0), y: fy, s: 0.42, pose: { lean: 0, tilt: 14, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] }, expr: 'sad' });
      at(840, y0 + 150, 1, () => pill(`HITS: ${Math.min(h, stop)}`, 0, 0, 24, won ? GREEN : col, { pad: 30, border: won ? GREEN : undefined }));
      if (i === 2 && quit) says('1 HIT AWAY...', 820, y0 + 50, t, BREAK - 0.2, END, '#74c0fc');
    }, { dim: quit ? 0.4 : 0, border: won ? GREEN : undefined }); });
  title('YOU NEVER KNOW WHICH HIT BREAKS IT.', '#ffffff', 300, 44);
  whichOne(t, END, [['QUITS AT 12', '#ffd43b'], ['QUITS AT 40', '#ff8787'], ['QUITS AT 99', '#74c0fc'], ['KEEPS SWINGING', GREEN]]);
});
