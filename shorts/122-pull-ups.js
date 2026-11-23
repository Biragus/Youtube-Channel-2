// Story short: THE PULL-UP BAR. Four on one bar. Motivation fades, ego burns out showing off, talent stops at good enough. Kai keeps going.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, card, line, who, P } = K;
const { W, dark, label, makeShort, title, camera, hop, pill, whichOne, spot, ground } = require('./lib');
const CUT = 17.5; const END = 14.0; const BAR = 900; const FY = 1450;
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'tee', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const P4 = [['MOTIVATION', '#ffd43b', person('#f59f00', 'curly'), 3.0, 1.6, 'MOTIVATION FADES WHEN IT HURTS.'], ['EGO', '#ff8787', person('#e03131', 'slick'), 5.4, 2.2, 'EGO BURNS OUT SHOWING OFF.'], ['TALENT', '#74c0fc', person('#1c7ed6', 'short'), 8.0, 2.6, 'TALENT STOPS AT GOOD ENOUGH.'], ['DISCIPLINE', GREEN, 'kai', 99, 1.4, '']];
module.exports = makeShort(CUT, (t) => {
  dark(900); const msg = P4.filter(([, , , q]) => t > q && q < 99).pop();
  camera({ x: 540, y: 1080, z: 1, t }, () => {
    ground(FY); line([[60, BAR], [1020, BAR]], '#adb5bd', 12); line([[60, BAR], [60, FY]], '#495057', 14); line([[1020, BAR], [1020, FY]], '#495057', 14);
    P4.forEach(([name, col, spec, quit, rate], i) => { const x = 180 + i * 240; const gone = t > quit; const reps = Math.floor(Math.min(t, quit) * rate); const up = gone ? 0 : (Math.sin(t * rate * Math.PI * 2) + 1) / 2;
      label(name, x, BAR - 250, 24, col, { spacing: 2 }); at(x, BAR - 190, 1, () => pill(i === 3 && t > 11 ? 'NONSTOP' : String(reps), 0, 0, 30, col, { pad: 40 }));
      if (!gone) { if (i === 3) spot(x, BAR + 150, 180, 'rgba(57,255,20,0.2)'); who(i === 3 && t > 12 ? 'kai2' : spec, { x, y: BAR + 376 * 0.6 - 20 + lerp(120, -20, up), s: 0.6, pose: { lean: 0, tilt: 0, armL: [lerp(170, 140, up), lerp(-10, -60, up)], armR: [i === 1 ? lerp(10, 10, up) : lerp(170, 140, up), i === 1 ? 8 : lerp(-10, -60, up)], legL: [10, -20], legR: [10, -20] }, expr: i === 3 ? 'determined' : (quit - t < 1 ? 'tired' : 'smile'), still: true }); }
      else who(spec, { x: x - Math.min(300, (t - quit) * 260), y: FY, s: 0.6, flip: true, pose: P.walk(t * 1.5), expr: 'sad' }); });
  });
  if (msg) K.alpha(prog(t, msg[3], msg[3] + 0.3) * (1 - prog(t, msg[3] + 2.2, msg[3] + 2.5)), () => pill(msg[5], W / 2, 420, 30, msg[1]));
  if (t > 10.5) { title('MOTIVATION STARTS.', '#ffffff', 300, 56); if (t > 11.5) pill('DISCIPLINE KEEPS GOING.', W / 2, 420, 34, GREEN, { border: GREEN }); } else title('WHO LASTS LONGEST?', GOLD, 300, 66, GOLD);
  whichOne(t, END, [['MOTIVATION', '#ffd43b'], ['EGO', '#ff8787'], ['TALENT', '#74c0fc'], ['DISCIPLINE', GREEN]]);
});
