// IT WAS NEVER LOCKED. Kai pushes and shoves the door to OPPORTUNITY for ages. Then he reads the sign: PULL. It opens.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who } = K; const M = require('../engine/motion');
const { W, dark, label, makeShort, title, camera, impact, blend, hop, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const READ = 3.4; const OPEN = 4.2; const DX = 620;
module.exports = makeShort(CUT, (t) => {
  dark(900); const o = ease(prog(t, OPEN, OPEN + 0.6));
  camera({ x: lerp(600, 680, prog(t, READ - 0.5, READ)), y: lerp(1100, 980, prog(t, READ - 0.5, READ)) + (t > OPEN ? 120 * prog(t, OPEN, OPEN + 0.5) : 0), z: t < READ - 0.5 ? 1 : (t < OPEN ? lerp(1, 1.5, prog(t, READ - 0.5, READ)) : lerp(1.5, 1, prog(t, OPEN, OPEN + 0.6))), shake: t < READ - 0.5 ? impact(t, Math.floor(t * 2) / 2, 4, 0.2) : 0, t }, () => {
    ground(FY); card(DX - 40, FY - 640, 400, 640, '#2b2f3a', 10);
    if (o > 0) { spot(DX + 160, FY - 320, 600 * o, `rgba(255,214,120,${0.7 * o})`); card(DX, FY - 600, 320, 600, `rgba(255,236,170,${o})`, 6); }
    at(DX, FY - 600, 1, () => { K.ctx().scale(1 - o * 0.85, 1); card(0, 0, 320, 600, '#6b4a2f', 8, INK, 6); circle(40, 320, 18, GOLD); label('OPPORTUNITY', 160, 110, 30, '#fff3bf', { spacing: 2 }); card(110, 220, 100, 50, '#f1f3f5', 6); label('PULL', 160, 247, 28, INK, { spacing: 3 }); });
    const pose = t < READ ? { lean: 30, tilt: 0, armL: [86, -20 + Math.sin(t * 12) * 10], armR: [86, -20 - Math.sin(t * 12) * 10], legL: [-20, 0], legR: [30, -20] } : (t < OPEN ? 'stand' : (o > 0.5 ? blend({ lean: -14, tilt: 0, armL: [86, 0], armR: [86, 0], legL: [10, 0], legR: [-10, 0] }, 'cheer', prog(t, OPEN + 0.6, OPEN + 0.9)) : { lean: -14, tilt: 0, armL: [86, 0], armR: [86, 0], legL: [10, 0], legR: [-10, 0] }));
    if (t > OPEN + 0.9) M.celebrate('kai2', DX - 110, FY, 0.85, t, OPEN + 0.9); else if (t < READ) M.figure({ spec: 'kai', ...M.stand(DX - 110, FY, 0.85, t, { crouch: 20 }), footL: [DX - 190, FY], footR: [DX - 120, FY], lean: 26 + Math.sin(t * 12) * 4, handL: [DX - 12, FY - 210 + Math.sin(t * 12) * 8], handR: [DX - 12, FY - 170 - Math.sin(t * 12) * 8], elbow: -1, expr: 'angry' }); else if (t < OPEN) M.idle('kai', DX - 110, FY, 0.85, t, { expr: 'shock', look: 0.6 }); else M.idle('kai', DX - 110, FY, 0.85, t, { lean: -14, crouch: 15, handL: [DX - 20 - o * 60, FY - 190], handR: [DX - 20 - o * 60, FY - 175], elbow: -1, expr: 'happy' });
  });
  title(t > OPEN ? 'IT WAS NEVER LOCKED.' : (t > READ ? '...WAIT.' : 'PUSHING HARDER?'), t > OPEN ? GREEN : '#ffffff', 300, 70, t > OPEN ? GREEN : undefined);
});
