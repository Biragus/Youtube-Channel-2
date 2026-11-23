// SHARPEN THE AXE. Top: he hacks away with a dull axe, one tree. Bottom: Kai stops to sharpen (LEARN), then fells tree after tree.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, at, card, line, circle, who, floaters, rnd } = K;
const { W, dark, label, makeShort, halves, pill, npc } = require('./lib');
const CUT = 6.8; const SHARP = 2.4;
const chop = (t, sp) => ({ lean: 10, tilt: 4, armL: [100 + Math.sin(t * sp) * 50, -20], armR: [100 + Math.sin(t * sp) * 50, -20], legL: [12, 0], legR: [12, 0] });
function tree(x, fy, fall, cuts) { at(x, fy, 1, () => { card(-22, -360, 44, 360, '#6b4a2f', 6); if (cuts) card(-22, -60, 22 * Math.min(1, cuts), 20, '#c9a77a', 2); for (let k = 0; k < 4; k++) circle(Math.cos(k * 1.6) * 60, -380 + Math.sin(k * 1.6) * 40, 70, '#2f9e44'); }, fall * 1.45); }
module.exports = makeShort(CUT, (t) => {
  dark(960);
  halves(t, CUT, (y0) => { const kai = y0 > 0; const fy = y0 + 740; line([[60, fy], [1020, fy]], 'rgba(255,255,255,0.15)', 4);
    label(kai ? 'SHARPEN FIRST' : 'JUST WORK HARDER', W / 2, y0 + (kai ? 90 : 170), 54, kai ? GREEN : '#ffa94d', { spacing: 5, glow: kai ? GREEN : undefined });
    if (!kai) { tree(700, fy, 0, prog(t, 0, CUT) * 0.6); who(npc('#e8590c'), { x: 560, y: fy, s: 0.75, pose: chop(t, 12), expr: 'tired' }); floaters(t, 10, (i, life) => circle(560, fy - 300 - life * 40, 6, '#74c0fc'), { every: 0.3, from: 0, life: 0.5 }); at(250, y0 + 300, 1, () => pill('TREES: 0', 0, 0, 26, '#ffa94d', { pad: 34 })); }
    else { const felled = t < SHARP ? 0 : Math.min(4, Math.floor((t - SHARP) / 0.9) + 0); for (let i = 0; i < 4; i++) { const x = 640 + i * 110 - felled * 110; if (i < felled) continue; tree(x, fy, i === felled ? prog(t, SHARP + i * 0.9 + 0.6, SHARP + i * 0.9 + 0.9) : 0, 0); }
      if (t < SHARP) { card(330, fy - 80, 120, 80, '#495057', 8, INK, 3); label('LEARN', 390, fy - 40, 22, '#ffffff', { spacing: 2 }); floaters(t, 30, (i, life) => circle(400 + Math.cos(i) * life * 60, fy - 110 - life * 60, 5, GOLD), { every: 0.04, from: 0.3, life: 0.4 }); who('kai', { x: 280, y: fy, s: 0.75, pose: { lean: 18, tilt: 8, armL: [70 + Math.sin(t * 20) * 10, -40], armR: [70 - Math.sin(t * 20) * 10, -40], legL: [12, 0], legR: [12, 0] }, expr: 'determined' }); }
      else who(felled >= 3 ? 'kai2' : 'kai', { x: 520, y: fy, s: 0.75, pose: felled >= 4 ? 'cheer' : chop(t, 9), expr: 'happy' });
      at(250, y0 + 230, 1, () => pill(`TREES: ${felled}`, 0, 0, 26, GREEN, { pad: 34, border: GREEN })); }
  });
});
