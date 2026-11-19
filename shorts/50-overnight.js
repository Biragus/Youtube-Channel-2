// Short 50: OVERNIGHT SUCCESS. A headline pops: "OVERNIGHT SUCCESS!". Zoom out: it sits on a tower of 730 days of work.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, workstation } = require('./lib');
const CUT = 6.8; const OUT = 2.6; const PILE = 50; const BASE = 1700;
module.exports = makeShort(CUT, (t) => {
  dark(800); const z = ease(prog(t, OUT, OUT + 2.0)); const top = BASE - PILE * 40;
  camera({ x: 540, y: lerp(top - 180, 700, z), z: lerp(1.05, 0.42, z), t }, () => {
    // the tower of calendar pages, each one a day
    for (let i = 0; i < PILE; i++) { const y = BASE - (i + 1) * 40; const wob = Math.sin(i * 1.7) * 14; card(340 + wob, y, 400, 38, i % 2 ? '#e9ecef' : '#dee2e6', 4, '#adb5bd', 2); card(340 + wob, y, 400, 10, RED, 2); alpha(z, () => label(`DAY ${730 - Math.round((i / PILE) * 729)}`, 540 + wob, y + 24, 26, '#495057', { spacing: 2 })); }
    // the newspaper headline on top, and suit Kai
    at(540, top - 300, pop(t, 0.3), () => { card(-330, -110, 660, 220, '#f8f9fa', 6, INK, 4); label('THE DAILY NEWS', 0, -70, 26, '#495057', { spacing: 4 }); label('OVERNIGHT', 0, -10, 64, INK, { spacing: 2 }); label('SUCCESS!', 0, 60, 64, RED, { spacing: 2 }); }, Math.sin(t * 2) * 0.02);
    spot(540, top - 140, 200, 'rgba(242,193,78,0.3)'); who('kai2', { x: 760, y: top, s: 0.6, pose: z > 0.3 ? 'shrug' : 'power', expr: z > 0.3 ? 'smile' : 'smug' });
    alpha(z, () => workstation(150, BASE + 200, 0.7, 'kai', t, { expr: 'determined' }));
  });
  title(z > 0.5 ? '730 DAYS IN THE MAKING.' : '"OVERNIGHT SUCCESS"', z > 0.5 ? GOLD : '#ffffff', 300, z > 0.5 ? 64 : 76, z > 0.5 ? GOLD : undefined);
});
