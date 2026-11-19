// Short 58: THE SHORTCUT IS OUT OF ORDER. A crowd waits for the elevator marked SHORTCUT; Kai takes the stairs and reaches the top.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 7.0; const FY = 1550; const FLOORS = 6; const FH = 300; const TOPY = FY - FLOORS * FH; const ARRIVE = 5.0;
const waiter = (i) => ({ hair: { type: ['short', 'curly', 'bun'][i], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#9c36b5', '#e8590c'][i] }, pants: '#3b4252', shoes: '#e5e5e5' });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(800); const k = prog(t, 0.6, ARRIVE); const fl = k * FLOORS; const f = Math.floor(fl); const fk = fl - f; const done = t > ARRIVE;
  const kx = 660 + (f % 2 ? (1 - fk) : fk) * 260; const ky = FY - fl * FH;
  camera({ x: 560, y: Math.max(TOPY + 250, Math.min(1150, ky - 100)), z: 1.0, t }, () => {
    card(80, TOPY - 40, 920, FLOORS * FH + 40, '#161a24', 0); line([[-300, FY], [1400, FY]], 'rgba(255,255,255,0.2)', 5);
    for (let i = 0; i <= FLOORS; i++) line([[80, FY - i * FH], [1000, FY - i * FH]], 'rgba(255,255,255,0.12)', 4);
    // the stairs zig-zag up the right side
    for (let i = 0; i < FLOORS; i++) { const y0 = FY - i * FH; const x0 = i % 2 ? 920 : 660; const x1 = i % 2 ? 660 : 920; line([[x0, y0], [x1, y0 - FH]], '#495057', 10); }
    // the elevator: doors shut, sign OUT OF ORDER
    card(140, FY - 360, 280, 360, '#495057', 6, INK, 4); line([[280, FY - 360], [280, FY]], INK, 4); pill('SHORTCUT', 280, FY - 420, 30, '#ffffff', { fill: '#1c7ed6', border: INK });
    if (t > 1.6) at(280, FY - 200, pop(t, 1.6), () => { card(-120, -30, 240, 60, '#fff3bf', 6, RED, 4); label('OUT OF ORDER', 0, 3, 24, RED, { spacing: 1 }); }, -0.08);
    for (let i = 0; i < 3; i++) who(waiter(i), { x: 140 + i * 100, y: FY, s: 0.6, pose: { lean: 0, tilt: 8 + Math.sin(t * 1.5 + i) * 4, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] }, expr: t > 3 ? 'tired' : 'neutral', look: -0.4 });
    // the top floor: the goal
    spot(800, TOPY - 60, 300, 'rgba(242,193,78,0.35)'); pill('THE TOP', 790, TOPY - 90, 36, GOLD, { fill: '#2a2414', border: GOLD });
    spot(kx, ky - 160, 180, 'rgba(57,255,20,0.2)');
    who(done ? 'kai2' : 'kai', { x: done ? 800 : kx, y: (done ? TOPY : ky) - hop(t, ARRIVE + 0.1, 50), s: 0.6, flip: !done && f % 2 === 1, pose: done ? blend(P.walk(t), 'cheer', prog(t, ARRIVE, ARRIVE + 0.3)) : { ...P.walk(t * 2.6), lean: 6 }, expr: done ? 'happy' : 'determined' });
  });
  pill(done ? 'FLOOR 6' : `FLOOR ${Math.min(6, f + 1)}`, W / 2, 1720, 44, done ? GREEN : '#ffffff', { border: done ? GREEN : undefined });
  title(done ? 'TAKE THE STAIRS.' : 'WAITING FOR A SHORTCUT?', done ? GREEN : '#ffffff', 300, done ? 86 : 62, done ? GREEN : undefined);
});
