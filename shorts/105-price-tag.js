// SELL ONCE vs SELL FOREVER. Top: his hours, $14 each, a clock that stops when he sleeps. Bottom: Kai's $9 product, sold again and again.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, circle, who, money } = K;
const { W, dark, label, makeShort, halves, pill, npc, workstation } = require('./lib');
const CUT = 6.8; const NIGHT = 3.4;
module.exports = makeShort(CUT, (t) => {
  dark(960); const night = t > NIGHT;
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'SELLING A PRODUCT' : 'SELLING HOURS', W / 2, y0 + (kai ? 90 : 170), 54, kai ? GREEN : '#ffa94d', { spacing: 5, glow: kai ? GREEN : undefined });
    const hours = Math.floor(prog(t, 0.3, NIGHT) * 8); const sales = Math.floor(prog(t, 0.3, CUT) ** 1.3 * 180);
    if (!kai) { workstation(330, fy, 0.9, npc('#5c6f8a'), t, { sigh: night ? 1 : 0, expr: night ? 'tired' : 'determined' }); at(760, y0 + 370, 1, () => { card(-140, -60, 280, 120, '#fff3bf', 12, INK, 4); label('$14 / HOUR', 0, -14, 30, INK, { spacing: 2 }); label(night ? 'STOPPED' : `${hours} HOURS`, 0, 30, 24, night ? '#e03131' : '#495057', { spacing: 2 }); }, -0.04); at(760, y0 + 560, 1, () => pill(money(hours * 14), 0, 0, 30, '#ffa94d')); }
    else { workstation(330, fy, 0.9, night ? 'kai2' : 'kai', t, { cheer: night ? 0.5 + 0.5 * Math.sin(t * 4) : 0, expr: 'happy', glowColor: 'rgba(57,255,20,0.25)' }); at(760, y0 + 300, 1, () => { card(-140, -60, 280, 120, '#d3f9d8', 12, INK, 4); label('$9 PRODUCT', 0, -14, 30, INK, { spacing: 2 }); label('SOLD AGAIN AND AGAIN', 0, 30, 18, '#2b8a3e', { spacing: 1 }); }, 0.04); at(760, y0 + 490, 1, () => pill(money(sales * 9), 0, 0, 30, GREEN, { border: GREEN })); }
  });
  K.line([[0, 0], [0, 0]], '#000', 0);
});
