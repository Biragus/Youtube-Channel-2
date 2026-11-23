// BUILD THE LADDER. The ladder to the goal has missing rungs. Kai learns each skill, slots the rung in, and climbs.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, easeOut, pop, at, card, line, who } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, hop, pill, ground, confetti, spot } = require('./lib');
const CUT = 6.8; const FY = 1480; const TOP = 780; const RUNGS = 9; const MISSING = { 2: 'WRITING', 4: 'DESIGN', 6: 'SELLING' }; const ADD = { 2: 1.2, 4: 2.2, 6: 3.2 }; const CLIMB = 3.8;
module.exports = makeShort(CUT, (t) => {
  dark(900); const climb = prog(t, CLIMB, 5.8); const ky = lerp(FY, TOP + 80, climb); const done = t > 5.8;
  camera({ x: 540, y: Math.max(TOP + 300, Math.min(1150, ky - 150)), z: 1.0, t }, () => {
    ground(FY); line([[480, FY], [480, TOP]], '#c9a43a', 10); line([[600, FY], [600, TOP]], '#c9a43a', 10);
    spot(540, TOP - 80, 200, 'rgba(242,193,78,0.4)'); if (!done) label('GOAL', 540, TOP - 70, 50, GOLD, { spacing: 6, glow: GOLD });
    for (let r = 0; r < RUNGS; r++) { const y = FY - 90 - r * ((FY - TOP - 90) / (RUNGS - 1)); const m = MISSING[r]; if (m) { if (t < ADD[r] - 0.4) { label(m, 760, y, 26, '#868e96', { spacing: 2 }); continue; } const f = easeOut(prog(t, ADD[r] - 0.4, ADD[r])); line([[lerp(800, 480, f), y], [lerp(920, 600, f), y]], GREEN, 10); label(m, 760, y - 34, 24, GREEN, { spacing: 2 }); } else line([[480, y], [600, y]], '#c9a43a', 8); }
    const climbP = { lean: 0, tilt: 0, armL: [160 + Math.sin(t * 8) * 10, 10], armR: [160 - Math.sin(t * 8) * 10, 10], legL: [30 + Math.sin(t * 8) * 20, -60], legR: [30 - Math.sin(t * 8) * 20, -60] };
    if (done) M.celebrate('kai2', 540, TOP + 80, 0.75, t, 5.85); else if (t < CLIMB) M.idle('kai', 320, FY, 0.75, t, { tilt: 8, armL: [40, -110], armR: [40, -110], expr: 'determined' }); else { const sw = Math.sin(t * 8); const hy = ky - 150 * 0.75; M.figure({ spec: 'kai', hip: [540, hy], ground: ky, s: 0.75, footL: [520, hy + 90 + sw * 22], footR: [560, hy + 90 - sw * 22], handL: [515, hy - 210 - sw * 26], handR: [565, hy - 210 + sw * 26], expr: 'determined' }); }
  });
  title(done ? 'EVERY SKILL IS A RUNG.' : 'MISSING A FEW RUNGS?', done ? GREEN : '#ffffff', 300, 66, done ? GREEN : undefined);
});
