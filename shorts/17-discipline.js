// Short 17: MOTIVATION vs DISCIPLINE. One works only on sunny days; Kai works every day, rain or shine.
const K = require('../engine/kit');
const { GREEN, GOLD, lerp, prog, pop, counter, floaters } = K;
const { W, spot, label, makeShort, halves, rain, sun, cloud, workstation, pulse, dark } = require('./lib');
const CUT = 10.6; const DAY = 1.05; const WEATHER = ['sun', 'rain', 'sun', 'storm', 'rain', 'rain', 'sun', 'storm', 'rain'];
const other = { hair: { type: 'short', color: '#2b2b33' }, top: { type: 'hoodie', color: '#e8590c' }, pants: '#343a40', shoes: '#e5e5e5' };
const dayAt = (t) => Math.min(WEATHER.length - 1, Math.max(0, Math.floor((t - 0.5) / DAY)));

module.exports = makeShort(CUT, (t) => {
  dark(960); const d = dayAt(t); const w = WEATHER[d]; const done = t > 0.5 + WEATHER.length * DAY;
  const worked = (who) => WEATHER.slice(0, d + (t > 0.5 + (d + 0.7) * DAY ? 1 : 0)).filter((x) => who === 'kai' || x === 'sun').length;
  halves(t, CUT, (y0) => {
    const kai = y0 > 0; const floorY = y0 + 780;
    K.line([[60, floorY], [1020, floorY]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'DISCIPLINE' : 'MOTIVATION', W / 2, y0 + (kai ? 90 : 170), 64, kai ? GREEN : '#ffa94d', { spacing: 10, glow: kai ? GREEN : undefined });
    // the weather, the same for both
    if (w === 'sun') sun(150, y0 + (kai ? 230 : 300), 40, t); else { cloud(170, y0 + (kai ? 220 : 290), 0.8, w === 'storm' ? '#343a52' : '#4a5068'); rain(t, 0, y0 + 260, W, 700, w === 'storm' ? 70 : 40); if (w === 'storm' && Math.sin(t * 9) > 0.92) K.alpha(0.25, () => { K.ctx().fillStyle = '#ffffff'; K.ctx().fillRect(0, y0, W, 960); }); }
    const working = kai || w === 'sun';
    workstation(330, floorY, 1.05, kai ? (done ? 'kai2' : 'kai') : other, t, { phase: kai ? 0 : 1.7, sigh: working ? 0 : 1, cheer: kai && done ? prog(t, 0.5 + WEATHER.length * DAY, 0.9 + WEATHER.length * DAY) : 0, expr: working ? (kai && done ? 'happy' : 'determined') : 'sad', glowColor: working ? 'rgba(57,255,20,0.25)' : 'rgba(0,0,0,0)' });
    counter('DAYS WORKED', String(worked(kai ? 'kai' : 'other')), 720, y0 + (kai ? 330 : 400), kai ? GREEN : '#ffa94d', pop(t, 0.4) * (kai ? pulse(t - 0.5, DAY, 0.06) : 1), { size: 70, rot: Math.sin(t * 2) * 0.02 });
  });
  K.at(W / 2, 960, 1, () => { K.card(-110, -40, 220, 80, '#0d1018', 40, 'rgba(255,255,255,0.5)', 3); label(`DAY ${d + 1}`, 0, 3, 40, '#ffffff', { spacing: 4 }); });
});
