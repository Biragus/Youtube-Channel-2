// Story short: LATER STACKS. 9 AM to 5 PM. Every "later" drops a box behind the procrastinator. Kai does each task now; his desk stays clear.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, at, card, line, who, rnd } = K;
const { W, dark, label, makeShort, halves, pill, npc, workstation, whichOne } = require('./lib');
const CUT = 17.5; const END = 14.0; const DAY = 12.5;
module.exports = makeShort(CUT, (t) => {
  dark(960); const hour = Math.min(17, 9 + Math.floor(prog(t, 0.3, DAY) * 8)); const boxes = Math.floor(prog(t, 0.6, DAY) * 18);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740;
    label(kai ? 'DOES IT NOW' : 'DOES IT LATER', W / 2, y0 + (kai ? 90 : 170), 56, kai ? GREEN : '#ff8787', { spacing: 6, glow: kai ? GREEN : undefined });
    if (!kai) { for (let i = 0; i < boxes; i++) { const d = 0.6 + (i / 18) * (DAY - 0.6); const f = easeOut(prog(t, d, d + 0.3)); at(700 + (i % 3) * 100 + (rnd(i) - 0.5) * 20, lerp(y0 + 200, fy - 40 - Math.floor(i / 3) * 78, f), 1, () => { card(-46, -38, 92, 76, '#c99a5b', 6, INK, 3); label('LATER', 0, 2, 18, INK, { spacing: 1 }); }, (rnd(i) - 0.5) * 0.15); }
      workstation(330, fy, 0.85, npc('#e8590c'), t, { sigh: t > DAY ? 1 : 0.8, expr: t > DAY ? 'shock' : 'neutral' }); }
    else { workstation(330, fy, 0.85, t > DAY ? 'kai2' : 'kai', t, { cheer: t > DAY ? 0.7 + 0.3 * Math.sin(t * 4) : 0, expr: t > DAY ? 'happy' : 'determined', glowColor: 'rgba(57,255,20,0.25)' }); at(780, y0 + 340, 1, () => pill(`DONE: ${boxes}`, 0, 0, 30, GREEN, { border: GREEN })); }
  });
  K.at(W / 2, 852, 1, () => pill(`${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`, 0, 0, 30, '#ffffff'));
  if (t > DAY) K.at(W / 2, 1560 - 100, 1, () => {});
  whichOne(t, END, [['DOES IT LATER', '#ff8787'], ['DOES IT NOW', GREEN]]);
});
