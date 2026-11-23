// THE TRAIN. The doors open on OPPORTUNITY. One waits for a "better time" and the doors close. Kai jumps on.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, P } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, blend, hop, pill, npc } = require('./lib');
const CUT = 6.8; const FY = 1400; const CLOSE = 3.4; const LEAVE = 4.0;
module.exports = makeShort(CUT, (t) => {
  dark(900); const doors = t < 1 ? prog(t, 0.3, 1) : (t < CLOSE ? 1 : 1 - prog(t, CLOSE, CLOSE + 0.3)); const tx = t < LEAVE ? 0 : (t - LEAVE) ** 2 * 900; const inside = t > 2.2;
  camera({ x: 540, y: 1100, z: 1.0, t }, () => {
    K.line([[-300, FY], [1400, FY]], '#495057', 8); K.card(-300, FY, 1700, 20, '#343a40', 0);
    at(tx, 0, 1, () => { card(80, FY - 560, 920, 520, '#1c7ed6', 30, INK, 6); for (let i = 0; i < 3; i++) card(140 + i * 300, FY - 500, 200, 140, '#a5d8ff', 10); label('OPPORTUNITY', 540, FY - 610, 40, '#ffffff', { spacing: 4 }); card(440, FY - 420, 200 * (1 - doors) / 2 + 2, 360, '#1864ab', 4); card(640 - 200 * (1 - doors) / 2, FY - 420, 200 * (1 - doors) / 2 + 2, 360, '#1864ab', 4); if (doors > 0) card(440 + 100 * (1 - doors), FY - 420, 200 * doors, 360, '#0d1018', 4); for (const wx of [200, 880]) circle(wx, FY - 30, 40, INK); if (inside) who('kai2', { x: 540, y: FY - 70, s: 0.65, pose: 'cheer', expr: 'happy', still: true }); });
    if (!inside) M.walk('kai', lerp(300, 540, prog(t, 1.4, 2.2)), FY - 40 - Math.sin(prog(t, 1.6, 2.2) * Math.PI) * 60, 0.7, { run: t > 1.4, expr: 'determined' });
    M.idle(npc('#868e96'), 820, FY, 0.7, t, { flip: true, tilt: 8, armL: [22, -100], armR: [22, -100], expr: t > CLOSE ? 'shock' : 'neutral' }); if (t > 0.8 && t < CLOSE) at(830, FY - 420, 1, () => pill('NEXT ONE...', 0, 0, 24, '#9aa3b5', { pad: 30 }));
  });
  title(t > LEAVE ? "IT DOESN'T WAIT." : 'THE DOORS ARE OPEN.', t > LEAVE ? GOLD : '#ffffff', 300, 72, t > LEAVE ? GOLD : undefined);
});
