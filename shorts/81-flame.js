// PROTECT THE SPARK. The wind of doubt tries to blow out Kai's small flame; he shields it, it grows into a torch.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, line, circle, who, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, ground, spot } = require('./lib');
const CUT = 6.8; const FY = 1400; const GROW = 4.0;
function flame(x, y, s, t) { const c = K.ctx(); for (const [col, k] of [['#e8590c', 1], ['#ffa94d', 0.7], ['#ffe066', 0.4]]) { c.fillStyle = col; c.beginPath(); c.moveTo(x - 30 * s * k, y); c.quadraticCurveTo(x - 30 * s * k, y - 70 * s * k, x + Math.sin(t * 10) * 6 * s, y - 120 * s * k); c.quadraticCurveTo(x + 30 * s * k, y - 70 * s * k, x + 30 * s * k, y); c.closePath(); c.fill(); } }
module.exports = makeShort(CUT, (t) => {
  dark(900); const big = ease(prog(t, GROW, GROW + 1)); const s = lerp(0.5, 2.6, big); const wind = t < GROW ? 1 : 1 - prog(t, GROW, GROW + 0.6);
  camera({ x: 560, y: 1100, z: lerp(1.35, 1.0, ease(prog(t, GROW - 0.5, GROW + 1))), t }, () => {
    ground(FY); spot(620, FY - 300, 200 + 300 * big, 'rgba(255,169,77,0.35)');
    // wind streaks labelled with doubts
    if (wind > 0) ['WHAT IF?', 'NOT NOW', 'TOO HARD', 'GIVE UP'].forEach((s2, i) => { const x = 1100 - ((t * 500 + i * 300) % 1300); K.alpha(wind, () => { line([[x, 900 + i * 80], [x + 160, 900 + i * 80]], 'rgba(200,220,255,0.35)', 5); label(s2, x + 80, 870 + i * 80, 22, '#74c0fc', { spacing: 2 }); }); });
    line([[640, FY - 220], [640, FY - 220 + 200 * big]], '#6b4a2f', 14 * big);
    flame(640 + (1 - big) * Math.sin(t * 7) * 10 * wind, FY - 220, s * (0.8 + 0.2 * Math.sin(t * 13) * wind), t);
    const pose = big > 0.5 ? blend({ lean: 0, tilt: 0, armL: [8, 4], armR: [150, 30], legL: [8, 0], legR: [8, 0] }, 'cheer', prog(t, GROW + 1, GROW + 1.4)) : { lean: 14, tilt: 6, armL: [70, -60], armR: [80, -40], legL: [10, 0], legR: [10, 0] };
    who(big > 0.5 ? 'kai2' : 'kai', { x: 470, y: FY - hop(t, GROW + 1.4, 40), s: 0.85, pose, expr: big > 0.5 ? 'happy' : 'determined' });
    floaters(t, 30, (i, life) => circle(640 + Math.sin(i * 3 + t) * 40 * s * (1 - life), FY - 220 - 120 * s - life * 200, 6 * (1 - life), '#ffa94d'), { every: 0.06, from: GROW, life: 0.9 });
  });
  title(big > 0.5 ? 'NOW IT LIGHTS THE WAY.' : 'PROTECT YOUR SPARK.', big > 0.5 ? '#ffa94d' : '#ffffff', 300, 70, big > 0.5 ? '#ffa94d' : undefined);
});
