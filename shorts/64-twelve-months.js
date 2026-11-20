// Story short: WHO BUILDS IT IN 12 MONTHS? The dreamer only dreams, shiny-object switches idea every month, burnout crashes; Kai compounds.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, money } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, lane, says, whichOne, spot, workstation } = require('./lib'); const { thought } = K;
const CUT = 22.5; const END = 19.0; const M0 = 0.5; const M12 = 18.0;
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['DREAMER', '#74c0fc', person('#1c7ed6', 'curly')], ['SHINY OBJECT', '#da77f2', person('#9c36b5', 'short')], ['BURNOUT', '#ff6b6b', person('#e03131', 'bun')], ['CONSISTENT', GREEN, 'kai']];
const IDEAS = ['CRYPTO', 'DROPSHIPPING', 'AI APP', 'NFTS', 'PODCAST', 'COURSE?'];
const revenue = [() => 0, (m) => Math.round((m % 2) * 40), (m) => (m < 4 ? m * 220 : Math.max(0, 880 - (m - 4) * 400)), (m) => Math.round(9 * 2 ** (m * 0.8))];
module.exports = makeShort(CUT, (t) => {
  dark(900); const mf = lerp(0, 12, prog(t, M0, M12)); const m = Math.min(12, Math.floor(mf));
  L.forEach(([name, col, spec], i) => {
    const crashed = i === 2 && mf > 5;
    lane(i, name, col, (y0, fy) => {
      const rev = Math.min(revenue[i](mf), i === 3 ? 4200 : 99999);
      // a little revenue graph per lane
      const gx = 500; const gy = y0 + 200; K.ctx().strokeStyle = i === 3 ? GREEN : col; K.ctx().lineWidth = 5; K.ctx().beginPath(); for (let k = 0; k <= mf * 10; k++) { const mm = k / 10; const v = Math.min(revenue[i](mm), 4200) / 4200; const x = gx + mm * 30; const y = gy - v * 110; k ? K.ctx().lineTo(x, y) : K.ctx().moveTo(x, y); } K.ctx().stroke(); line([[gx, gy], [gx + 380, gy]], 'rgba(255,255,255,0.2)', 2);
      at(800, y0 + 90, 1, () => pill(`${money(rev)}/MO`, 0, 0, 26, i === 3 && rev > 100 ? GREEN : '#9aa3b5', { pad: 36 }));
      const kx = 250;
      if (i === 0) { who(spec, { x: kx, y: fy, s: 0.45, pose: { lean: 0, tilt: 10, drop: 0, armL: [22, -100], armR: [22, -100], legL: [85, -85], legR: [85, -85] }, expr: 'happy' }); K.card(kx - 90, fy - 70, 180, 70, '#3b3f5c', 20); thought(kx + 150, y0 + 110, 60, 1, () => { K.card(-30, -20, 60, 40, GOLD, 4); label('$$$', 0, 2, 18, INK, { spacing: 0 }); }); says('ONE DAY...', 400, y0 + 210, t, 1, 18, '#74c0fc'); }
      if (i === 1) { workstation(kx, fy, 0.45, spec, t, { phase: 1 }); const idea = IDEAS[Math.floor(mf / 2) % IDEAS.length]; at(kx + 170, y0 + 110, 0.9 + 0.1 * Math.sin(t * 6), () => pill(`NEW IDEA: ${idea}`, 0, 0, 20, '#da77f2', { pad: 26 })); }
      if (i === 2) { if (!crashed) { workstation(kx, fy, 0.45, spec, t, { phase: 2, expr: 'determined' }); floaters(t, 10, (k, life) => circle(kx - 30 + k % 3 * 30, fy - 210 - life * 40, 5, '#74c0fc'), { every: 0.15, from: 0, life: 0.4 }); says('20 HOURS A DAY!', 420, y0 + 80, t, 1, 7, '#ff8787'); } else { at(kx, fy, 1, () => who(spec, { x: 0, y: 0, s: 0.45, pose: 'stand', expr: 'tired', still: true }), -Math.PI / 2); label('BURNT OUT', kx + 150, fy - 120, 30, '#ff8787', { spacing: 4 }); floaters(t, 6, (k, life) => label('z', kx - 100 + k % 2 * 30, fy - 60 - life * 80, 30, '#868e96'), { every: 0.5, from: 9, life: 1.2 }); } }
      if (i === 3) { const done = mf > 11; spot(kx, fy - 120, 150, 'rgba(57,255,20,0.18)'); workstation(kx, fy, 0.45, done ? 'kai2' : 'kai', t, { cheer: done ? 0.6 + 0.4 * Math.sin(t * 5) : 0, hop: done ? Math.abs(Math.sin(t * 5)) * 12 : 0, expr: done ? 'happy' : 'determined', glowColor: 'rgba(57,255,20,0.25)' }); says('SAME THING. EVERY DAY.', 450, y0 + 80, t, 1, 8, GREEN); }
    }, { dim: crashed ? prog(mf, 5, 6) * 0.45 : 0, border: i === 3 && mf > 8 ? GREEN : undefined });
  });
  pill(`MONTH ${Math.max(1, Math.ceil(mf))}`, W / 2, 385, 30, '#ffffff');
  title('WHO BUILDS IT IN 12 MONTHS?', GOLD, 300, 60, GOLD);
  whichOne(t, END, [['DREAMER', '#74c0fc'], ['SHINY OBJECT', '#da77f2'], ['BURNOUT', '#ff6b6b'], ['CONSISTENT', GREEN]]);
});
