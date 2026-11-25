// WHAT YOU WATER GROWS. Two plants: SCROLLING and BUILDING. Kai stops watering the first; the second grows tall and blooms with $.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, floaters } = K; const M = require('../engine/motion'); const A = require('../engine/actions');
const { W, dark, label, makeShort, title, camera, blend, hop, ground, coin } = require('./lib');
const CUT = 6.8; const FY = 1450; const SWITCH = 2.4;
function plant(x, h, wilt, col, name) { const c = K.ctx(); c.strokeStyle = col; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, FY - 120); c.quadraticCurveTo(x + wilt * 120, FY - 120 - h * 0.6, x + wilt * 200, FY - 120 - h + wilt * h * 0.6); c.stroke(); for (let k = 1; k < h / 90; k++) { c.fillStyle = col; c.beginPath(); c.ellipse(x + wilt * 100 * (k / (h / 90)) + (k % 2 ? 40 : -40), FY - 120 - k * 90 + wilt * k * 30, 40, 14, k % 2 ? -0.5 : 0.5, 0, Math.PI * 2); c.fill(); } card(x - 90, FY - 120, 180, 120, '#8a5a3c', 10, INK, 4); label(name, x, FY - 60, 26, '#ffffff', { spacing: 2 }); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const sw = t > SWITCH; const a = sw ? lerp(500, 140, ease(prog(t, SWITCH, 5))) : lerp(140, 500, prog(t, 0.3, SWITCH)); const b = sw ? lerp(140, 760, ease(prog(t, SWITCH, 5.4))) : 140; const wilt = sw ? prog(t, SWITCH, 5) : 0;
  camera({ x: 540, y: lerp(1150, 1000, prog(t, SWITCH, 5.4)), z: lerp(1.0, 0.92, prog(t, SWITCH, 5.4)), t }, () => {
    ground(FY); plant(280, a, wilt, wilt > 0.5 ? '#868e96' : '#2f9e44', 'SCROLLING'); plant(800, b, 0, '#2f9e44', 'BUILDING');
    if (b > 600) for (let k = 0; k < 4; k++) coin(800 + (k % 2 ? 60 : -60), FY - 220 - k * 140, 24, t * 3 + k);
    const kx = M.lerp(460, 620, M.smooth(prog(t, SWITCH - 0.2, SWITCH + 0.5))); if (t > 5.4) M.celebrate('kai2', kx, FY, 0.8, t, 5.45); else { const dir = sw ? 1 : -1; const moving = t > SWITCH - 0.2 && t < SWITCH + 0.5; const hand = [kx + dir * 96, FY - 250 + Math.sin(t * 6) * 4]; const r = moving ? M.walk('kai', kx, FY, 0.8, { flip: !sw, handR: hand, expr: 'determined' }) : A.work('kai', kx, FY, 0.8, t, { flip: !sw, handR: hand, expr: 'determined' }); at(hand[0], hand[1], 1, () => { K.ctx().scale(dir, 1); card(-6, -10, 46, 40, '#74c0fc', 8); line([[34, 0], [58, -30]], '#74c0fc', 8); }); }
    floaters(t, 30, (i, life) => circle(kx + (sw ? 140 : -140) + life * (sw ? 20 : -20), FY - 320 + life * 220, 6, '#74c0fc'), { every: 0.08, from: 0.3, life: 0.6 });
  });
  title('WHAT YOU WATER GROWS.', GREEN, 300, 70, GREEN);
});
