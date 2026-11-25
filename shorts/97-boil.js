// 99 DEGREES. The thermometer climbs to 99: nothing. People leave. Kai adds one more log: 100, and it boils.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, card, line, circle, who, floaters, rnd } = K; const M = require('../engine/motion'); const A = require('../engine/actions');
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, ground } = require('./lib');
const CUT = 6.8; const FY = 1450; const BOIL = 4.6;
module.exports = makeShort(CUT, (t) => {
  dark(900); const temp = t < BOIL ? Math.min(99, Math.round(lerp(20, 99, prog(t, 0.4, 3.4) ** 0.8))) : 100; const boil = t > BOIL;
  camera({ x: 560, y: 1100, z: 1.0, shake: impact(t, BOIL, 12), t }, () => {
    ground(FY);
    // the pot over the fire
    for (let i = 0; i < 4; i++) line([[480 + i * 40, FY], [520 + i * 20, FY - 50]], '#6b4a2f', 14); K.ctx().fillStyle = '#e8590c'; K.ctx().beginPath(); K.ctx().moveTo(470, FY - 40); K.ctx().quadraticCurveTo(540, FY - 160 - Math.sin(t * 9) * 10, 610, FY - 40); K.ctx().fill();
    card(400, FY - 420, 280, 260, '#495057', 20, INK, 5); card(410, FY - 400, 260, 40, boil ? '#74c0fc' : '#4dabf7', 10);
    if (temp > 80 && !boil) floaters(t, 6, (i, life) => circle(440 + i * 40, FY - 400 - life * 20, 5, '#a5d8ff'), { every: 0.3, from: 0, life: 0.3 });
    if (boil) { floaters(t, 40, (i, life) => circle(430 + rnd(i) * 220, FY - 420 - life * 300, 14 * (1 - life) + 6, 'rgba(255,255,255,0.6)'), { every: 0.04, from: BOIL, life: 1 }); for (let i = 0; i < 8; i++) circle(430 + i * 30, FY - 400 - Math.abs(Math.sin(t * 12 + i)) * 20, 12, '#a5d8ff'); }
    // the thermometer
    card(820, FY - 780, 60, 600, '#f1f3f5', 30, INK, 4); card(832, FY - 190 - (temp / 100) * 560, 36, (temp / 100) * 560, temp >= 100 ? GREEN : RED, 18); circle(850, FY - 170, 46, temp >= 100 ? GREEN : RED);
    if (boil) M.celebrate('kai2', 230, FY, 0.85, t, BOIL + 0.15); else { const k = M.smooth(prog(t, BOIL - 1.2, BOIL - 0.55)); const back = M.smooth(prog(t, BOIL - 0.3, BOIL)); const kk = k * (1 - back); const hx = M.lerp(330, 470, kk); const hy = M.lerp(FY - 200, FY - 70, kk); const r = A.work('kai', M.lerp(250, 310, kk), FY, 0.85, t, { crouch: 75 * kk, lean: 48 * kk, handL: [hx - 26, hy], handR: [hx + 10, hy + 4], expr: temp > 95 ? 'determined' : 'neutral' }); if (t < BOIL - 0.35) { const m = [(r.handL[0] + r.handR[0]) / 2, (r.handL[1] + r.handR[1]) / 2]; line([[m[0] - 55, m[1] - 2], [m[0] + 55, m[1] + 4]], '#6b4a2f', 18); } }
  });
  K.at(W / 2, 410, 1, () => pill(`${temp}°`, 0, 0, 44, temp >= 100 ? GREEN : '#ff8787', { border: temp >= 100 ? GREEN : 'rgba(255,135,135,0.6)' }));
  title(boil ? 'ONE MORE DEGREE.' : '99° CHANGES NOTHING.', boil ? GREEN : '#ffffff', 300, 72, boil ? GREEN : undefined);
});
