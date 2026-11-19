// Short 55: TUG OF WAR WITH DOUBT. Kai alone gets dragged towards the line; every sale adds someone behind him, and they pull DOUBT over.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const FY = 1450; const WIN = 5.0; const JOIN = [1.8, 2.6, 3.3, 3.9];
const fan = (i) => ({ hair: { type: ['curly', 'bun', 'short', 'long'][i], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#9c36b5', '#2f9e44', '#e8590c'][i] }, pants: '#3b4252', shoes: '#e5e5e5' });
const pullPose = (t, i) => ({ lean: -26, tilt: 6, armL: [80, 0], armR: [80, 0], legL: [-24 + Math.sin(t * 7 + i) * 8, 0], legR: [28 - Math.sin(t * 7 + i) * 8, -30] });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const joined = JOIN.filter((a) => t > a).length; const won = t > WIN;
  const shift = t < 1.6 ? lerp(0, 120, ease(prog(t, 0.3, 1.6))) : lerp(120, -380, ease(prog(t, 1.8, WIN)));   // + means dragged towards doubt
  camera({ x: 560 + shift * 0.3, y: 1150, z: 1.0, shake: impact(t, WIN, 16) + (won ? 0 : 2), t }, () => {
    card(-500, FY, 2200, 900, '#141823', 0); line([[-500, FY], [1700, FY]], 'rgba(255,255,255,0.15)', 4);
    card(536, FY - 20, 8, 60, '#ffffff', 2); label('THE LINE', 540, FY + 70, 26, '#9aa3b5', { spacing: 3 });
    // the rope
    const rx = shift; line([[160 + rx - joined * 110, FY - 230], [980 + rx, FY - 230]], '#c9a43a', 8); card(536 + rx, FY - 260, 8, 60, RED, 2);
    // doubt: a dark, big shape on the right
    at(860 + rx, FY, 1, () => { c.fillStyle = '#0a0b10'; c.beginPath(); c.moveTo(-90, 0); c.bezierCurveTo(-140, -300, -60, -520, 40, -520); c.bezierCurveTo(140, -520, 200, -300, 140, 0); c.closePath(); c.fill(); for (const e of [-10, 60]) { c.fillStyle = '#ff2b2b'; c.beginPath(); c.ellipse(e, -400, 20, 12, 0, 0, Math.PI * 2); c.fill(); } label('DOUBT', 25, -250, 40, '#ff8787', { spacing: 4 }); }, won ? (t - WIN) * 0.8 : 0);
    // Kai and the people who join him
    spot(330 + rx, FY - 220, 260, 'rgba(57,255,20,0.18)');
    who(won ? 'kai2' : 'kai', { x: 330 + rx, y: FY - hop(t, WIN + 0.2, 50), s: 0.8, pose: won ? blend(pullPose(t, 0), 'cheer', prog(t, WIN, WIN + 0.3)) : pullPose(t, 0), expr: won ? 'happy' : (joined ? 'determined' : 'worried') });
    for (let i = 0; i < joined; i++) { const run = ease(prog(t, JOIN[i], JOIN[i] + 0.5)); who(fan(i), { x: lerp(-200, 220 + rx - i * 110, run), y: FY, s: 0.75, pose: run < 1 ? P.walk(t * 2) : (won ? 'cheer' : pullPose(t, i + 1)), expr: 'determined' }); }
    floaters(t, 10, (i, life) => label('+1 SALE', 100 + (i % 2) * 120, FY - 520 - life * 120, 32, GREEN, { spacing: 2 }), { every: 0.7, from: JOIN[0] - 0.1, life: 0.8 });
  });
  title(won ? "YOU'RE NOT ALONE ANYMORE." : 'YOU vs DOUBT', won ? GREEN : '#ffffff', 300, won ? 60 : 80, won ? GREEN : undefined);
});
