// Story short: WHO MAKES THE FIRST SALE? Motivation quits, overthinking never starts, perfectionism never ships, Kai ships and sells.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, lane, says, bar, whichOne, workstation } = require('./lib');
const CUT = 24.5; const END = 21.0; const DAYS = 20.5;
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['MOTIVATION', '#ffd43b', person('#f59f00', 'curly')], ['OVERTHINKING', '#74c0fc', person('#1c7ed6', 'short')], ['PERFECTIONISM', '#da77f2', person('#9c36b5', 'bun')], ['DISCIPLINE', GREEN, 'kai']];
// how far each one's product gets
const prodK = [(t) => Math.min(0.45, prog(t, 0.5, 3.5) * 0.45 + 0), (t) => 0.06 * prog(t, 2, 18), (t) => { const cyc = [[0.5, 0.88, 0], [5.5, 0.6, 1], [8, 0.93, 0], [11.5, 0.7, 1], [14, 0.95, 0], [17.5, 0.72, 1]]; let v = 0; let last = 0; for (const [a, to] of cyc) { v = lerp(v, to, ease(prog(t, a, a + (to > v ? 2.4 : 0.4)))); } return v; }, (t) => prog(t, 0.5, 9.5)];
module.exports = makeShort(CUT, (t) => {
  dark(900); const pub = t > 10.0; const sales = Math.floor(prog(t, 13.5, 20) ** 1.4 * 100);
  camera({ x: 540, y: 960 + (t > 18 ? 60 * ease(prog(t, 18, 19)) : 0), z: t > 18 ? lerp(1, 1.04, prog(t, 18, 19)) : 1, t }, () => {
    L.forEach(([name, col, spec], i) => {
      const quit = i === 0 && t > 6.5; const done = i === 3 && t > 18;
      lane(i, name, col, (y0, fy) => {
        const k = prodK[i](t); const kx = quit ? lerp(250, -120, prog(t, 6.5, 8)) : 250;
        if (!quit) workstation(kx, fy, 0.5, done ? 'kai2' : spec, t, { phase: i, sigh: i === 0 ? prog(t, 4, 4.6) : (i === 1 ? 0.6 : 0), cheer: done ? 0.7 + 0.3 * Math.sin(t * 5) : (i === 3 && t > 13.5 && t < 14.5 ? 1 : 0), hop: done ? Math.abs(Math.sin(t * 5)) * 12 : 0, expr: done ? 'happy' : ['determined', 'worried', 'neutral', 'determined'][i], glowColor: i === 3 ? 'rgba(57,255,20,0.2)' : undefined });
        else who(spec, { x: kx, y: fy, s: 0.5, flip: true, pose: P.walk(t * 1.6), expr: 'sad' });
        bar(520, y0 + 110, 420, k, i === 3 ? GREEN : col, i === 3 && pub ? 'PUBLISHED' : `PRODUCT ${Math.round(k * 100)}%`);
        if (i === 3) { at(730, y0 + 220, 1, () => pill(`SALES: ${sales}`, 0, 0, 30, sales ? GREEN : '#9aa3b5', { border: sales ? GREEN : undefined })); if (t > 13.5) floaters(t, 20, (j, life) => label('+$9', 560 + (j % 3) * 70, y0 + 200 - life * 120, 26, GREEN), { every: 0.3, from: 13.5, life: 0.9 }); }
        // what they say
        if (i === 0) { says("LET'S GO!", 250, y0 + 70, t, 0.5, 2.6, '#ffd43b'); says("I'M TIRED.", 250, y0 + 70, t, 4.0, 6.5, '#ffd43b'); if (quit) alpha(prog(t, 8, 8.5), () => label('QUIT', 730, y0 + 220, 34, '#868e96', { spacing: 6 })); }
        if (i === 1) { says('WHAT IF IT FAILS?', 250, y0 + 70, t, 1.0, 5.5, '#74c0fc'); says('NEED MORE RESEARCH...', 260, y0 + 70, t, 6.0, 11.5, '#74c0fc'); says('WHAT IF NOBODY BUYS?', 260, y0 + 70, t, 12, 18, '#74c0fc'); }
        if (i === 2) { says('NOT PERFECT YET', 250, y0 + 70, t, 5.0, 8, '#da77f2'); says('START OVER.', 250, y0 + 70, t, 11, 13.5, '#da77f2'); says('ONE MORE FIX...', 250, y0 + 70, t, 17, 20.5, '#da77f2'); }
        if (i === 3) { says('DAY BY DAY.', 250, y0 + 70, t, 1.5, 5, GREEN); if (pub && t < 13.2) says('0 SALES. KEEP GOING.', 270, y0 + 70, t, 10.6, 13.2, GREEN); says('FIRST SALE!', 250, y0 + 70, t, 13.6, 16, GOLD); }
      }, { dim: quit ? prog(t, 8, 9) * 0.6 : 0, border: i === 3 && t > 13.5 ? GREEN : undefined });
    });
  });
  pill(`DAY ${Math.max(1, Math.round(prog(t, 0.5, DAYS) * 90))}`, W / 2, 1830, 34, '#ffffff');
  title('WHO MAKES THE FIRST SALE?', GOLD, 300, 62, GOLD);
  whichOne(t, END, [['MOTIVATION', '#ffd43b'], ['OVERTHINKING', '#74c0fc'], ['PERFECTIONISM', '#da77f2'], ['DISCIPLINE', GREEN]]);
});
