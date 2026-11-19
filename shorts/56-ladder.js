// Short 56: THE RIGHT WALL. Kai climbs fast to the top of a ladder, then sees it leans on SOMEONE ELSE'S DREAM. He moves it to his own wall.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 7.0; const FY = 1550; const TOP = 650; const SEE = 2.2; const MOVE = 3.2; const UP2 = 4.4;
function ladder(x) { line([[x - 50, FY], [x - 50, TOP]], '#c9a43a', 10); line([[x + 50, FY], [x + 50, TOP]], '#c9a43a', 10); for (let y = FY - 60; y > TOP; y -= 80) line([[x - 50, y], [x + 50, y]], '#c9a43a', 8); }
const climb = (t) => ({ lean: 0, tilt: 0, armL: [150 + Math.sin(t * 10) * 15, 20], armR: [150 - Math.sin(t * 10) * 15, 20], legL: [20 + Math.sin(t * 10) * 20, -40], legR: [20 - Math.sin(t * 10) * 20, -40] });
module.exports = makeShort(CUT, (t) => {
  dark(900); const moved = ease(prog(t, MOVE, MOVE + 0.8)); const lx = lerp(330, 760, moved);
  const up1 = ease(prog(t, 0.3, SEE)); const down = ease(prog(t, SEE + 0.4, MOVE)); const up2 = ease(prog(t, MOVE + 0.9, UP2 + 0.8)); const done = t > UP2 + 0.8;
  const ky = t < MOVE ? lerp(FY, TOP + 60, up1 * (1 - down)) : lerp(FY, TOP + 60, up2);
  camera({ x: 540, y: lerp(1150, ky - 150, 0.3), z: 1.0, shake: impact(t, UP2 + 0.8, 10), t }, () => {
    card(-300, FY, 1700, 900, '#141823', 0); line([[-300, FY], [1400, FY]], 'rgba(255,255,255,0.15)', 4);
    // two walls: theirs and yours
    card(170, TOP - 60, 180, FY - TOP + 60, '#2b3142', 6); alpha(1, () => label("SOMEONE ELSE'S", 260, TOP - 140, 30, '#9aa3b5', { spacing: 2 })); label('DREAM', 260, TOP - 100, 30, '#9aa3b5', { spacing: 2 });
    card(840, TOP - 60, 180, FY - TOP + 60, '#2a2414', 6, GOLD, 3); spot(930, TOP - 100, 260, 'rgba(242,193,78,0.3)'); label('YOUR OWN', 930, TOP - 140, 30, GOLD, { spacing: 2 }); label('PRODUCT', 930, TOP - 100, 30, GOLD, { spacing: 2 });
    ladder(lx);
    const onLadder = (t < MOVE && up1 > 0 && down < 1) || (t > MOVE + 0.9);
    who(done ? 'kai2' : 'kai', { x: onLadder ? lx : lerp(lx - 120, lx - 120, 0), y: ky - hop(t, UP2 + 0.9, 40), s: 0.75, pose: done ? blend(climb(t), 'cheer', prog(t, UP2 + 0.8, UP2 + 1.1)) : (onLadder ? (t > SEE && t < SEE + 0.4 ? 'shrug' : climb(t)) : (t < MOVE + 0.9 && t > MOVE ? P.walk(t * 2) : 'stand')), expr: done ? 'happy' : (t > SEE && t < MOVE + 0.9 ? 'worried' : 'determined'), look: t > SEE && t < MOVE ? -0.8 : 0 });
    if (t > SEE && t < SEE + 0.8) label('?!', lx + 100, TOP - 30, 70, '#ff8787', { spacing: 0 });
  });
  title(t > MOVE ? 'CLIMB YOUR OWN WALL.' : 'CLIMBING FAST...', t > MOVE ? GREEN : '#ffffff', 300, 72, t > MOVE ? GREEN : undefined);
});
