// Story short: EVERY WEATHER. Sun, rain, storm, snow. Each one gives an excuse to stop. Kai shows up and builds in all of them.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, at, circle, who, P, rnd } = K;
const { W, dark, label, makeShort, title, hop, pill, lane, says, whichOne, spot, rain, sun, cloud, workstation } = require('./lib');
const CUT = 20.5; const END = 17.0; const SEASONS = [[0.3, 'SUN'], [4.2, 'RAIN'], [8.4, 'STORM'], [12.6, 'SNOW']];
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['MOTIVATION', '#ffd43b', person('#f59f00', 'curly'), 1, ["I'LL START WHEN IT'S NICER."]], ['EGO', '#ff8787', person('#e03131', 'slick'), 2, ["I DON'T DO RAIN."]], ['OVERTHINKING', '#74c0fc', person('#1c7ed6', 'short'), 3, ['WHAT IF IT GETS WORSE?']], ['DISCIPLINE', GREEN, 'kai', 9, ['WEATHER IS NOT AN EXCUSE.']]];
module.exports = makeShort(CUT, (t) => {
  dark(900); const s = SEASONS.filter(([a]) => t > a).length - 1; const w = SEASONS[Math.max(0, s)][1];
  L.forEach(([name, col, spec, lastS, line1], i) => { const here = s < lastS || i === 3; const done = i === 3 && t > 16;
    lane(i, name, col, (y0, fy) => {
      if (w === 'SUN') sun(900, y0 + 90, 26, t); else if (w === 'SNOW') for (let k = 0; k < 30; k++) circle(((k * 97 + t * 30) % 1000) + 40, y0 + ((t * 80 + k * 53) % 240) + 10, 4, 'rgba(255,255,255,0.8)'); else { cloud(880, y0 + 80, 0.6, w === 'STORM' ? '#343a52' : '#4a5068'); rain(t, 40, y0 + 40, 1000, 250, w === 'STORM' ? 50 : 25); }
      if (here) workstation(260, fy, 0.45, done ? 'kai2' : spec, t, { phase: i, cheer: done ? 0.7 + 0.3 * Math.sin(t * 4) : 0, expr: done ? 'happy' : (i === 3 ? 'determined' : 'neutral'), glowColor: i === 3 ? 'rgba(57,255,20,0.2)' : undefined });
      else label('NO SHOW', 260, fy - 60, 26, '#868e96', { spacing: 4 });
      if (i < 3) says(line1[0], 600, y0 + 140, t, SEASONS[lastS][0] - 0.2, SEASONS[lastS][0] + 2.5, col); else says(line1[0], 620, y0 + 140, t, 9, 13, GREEN);
      const days = Math.round(prog(t, 0.3, here ? 16 : SEASONS[lastS][0]) * (here ? 365 : 365 * SEASONS[lastS][0] / 16)); at(860, fy - 40, 1, () => pill(`${days} DAYS`, 0, 0, 22, i === 3 ? GREEN : col, { pad: 30 }));
    }, { dim: here ? 0 : 0.45, border: done ? GREEN : undefined }); });
  pill(w, W / 2, 385, 30, '#ffffff');
  title('WHO SHOWS UP IN EVERY WEATHER?', GOLD, 300, 48, GOLD);
  whichOne(t, END, [['MOTIVATION', '#ffd43b'], ['EGO', '#ff8787'], ['OVERTHINKING', '#74c0fc'], ['DISCIPLINE', GREEN]]);
});
