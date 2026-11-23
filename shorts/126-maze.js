// Story short: WHO ESCAPES THE MAZE? Seen from above. Motivation sits down, overthinking freezes, panic runs in circles. Kai follows the wall, steady, and gets out.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, at, card, line, circle } = K;
const { W, dark, label, makeShort, title, pill, whichOne, spot } = require('./lib');
const CUT = 18.5; const END = 15.0; const X0 = 150; const Y0 = 430; const C = 130;
const WALLS = [[0, 0, 6, 0], [0, 0, 0, 7], [6, 0, 6, 6], [0, 7, 5, 7], [1, 1, 5, 1], [1, 1, 1, 6], [1, 6, 4, 6], [2, 2, 2, 5], [2, 2, 5, 2], [5, 2, 5, 6], [3, 3, 3, 6], [4, 3, 4, 5], [3, 3, 4, 3]];
const KAI = [[0.5, 0.5], [5.5, 0.5], [5.5, 6.5], [4.5, 6.5], [4.5, 5.5], [3.5, 5.5], [3.5, 3.5], [4.5, 3.5], [4.5, 4.5], [5.5, 6.9], [5.5, 7.25]];
const pt = (pts, k) => { const n = pts.length - 1; const i = Math.min(n - 1, Math.floor(k * n)); const f = k * n - i; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; };
const dot = (x, y, col, ring) => { spot(X0 + x * C, Y0 + y * C, 60, ring); circle(X0 + x * C, Y0 + y * C, 20, col); };
module.exports = makeShort(CUT, (t) => {
  dark(900); const out = t > 12.6;
  for (const [a, b, c2, d] of WALLS) line([[X0 + a * C, Y0 + b * C], [X0 + c2 * C, Y0 + d * C]], '#495057', 14);
  card(X0 + 5 * C + 10, Y0 + 7 * C - 7, C - 20, 14, '#0d1018', 0); spot(X0 + 5.5 * C, Y0 + 7.5 * C, 120, 'rgba(242,193,78,0.5)'); label('EXIT', X0 + 5.5 * C, Y0 + 7 * C + 80, 28, GOLD, { spacing: 4 });
  // motivation: runs, then sits
  const m = pt([[0.5, 0.5], [0.5, 3.5], [0.5, 4.2]], Math.min(1, t / 3)); dot(m[0], m[1], t > 3.5 ? '#868e96' : '#ffd43b', 'rgba(255,212,59,0.2)'); if (t > 3.5 && t < 9) pill("I'M DONE.", X0 + m[0] * C + 130, Y0 + m[1] * C, 22, '#ffd43b', { pad: 30 });
  // overthinking: never leaves the start
  const o = [0.5 + Math.sin(t * 3) * 0.1, 0.5]; dot(o[0] + 1, o[1], '#74c0fc', 'rgba(116,192,252,0.2)'); if (t > 1 && t < 7) pill('WHICH WAY?', X0 + 1.5 * C + 120, Y0 + 0.5 * C + 70, 22, '#74c0fc', { pad: 30 });
  // panic: loops in the middle
  const p = [3 + Math.cos(t * 2) * 0.5, 4.5 + Math.sin(t * 2) * 0.5]; dot(p[0] - 0.5, p[1], '#ff8787', 'rgba(255,135,135,0.2)');
  // Kai: steady, along the wall, out
  const k = pt(KAI, prog(t, 0.5, 12.6)); dot(k[0], k[1], GREEN, 'rgba(57,255,20,0.35)'); K.head(out ? 'kai2' : 'kai', X0 + k[0] * C, Y0 + k[1] * C, 0.22, out ? 'happy' : 'determined');
  label('MOTIVATION', 150, 1495, 20, '#ffd43b', { spacing: 2 }); label('OVERTHINKING', 390, 1495, 20, '#74c0fc', { spacing: 2 }); label('PANIC', 620, 1495, 20, '#ff8787', { spacing: 2 }); label('DISCIPLINE', 850, 1495, 20, GREEN, { spacing: 2 });
  title(out ? 'SAME MAZE. DIFFERENT MINDSET.' : 'WHO ESCAPES THE MAZE?', out ? GREEN : GOLD, 300, out ? 50 : 66, out ? GREEN : GOLD);
  whichOne(t, END, [['MOTIVATION', '#ffd43b'], ['OVERTHINKING', '#74c0fc'], ['PANIC', '#ff8787'], ['DISCIPLINE', GREEN]]);
});
