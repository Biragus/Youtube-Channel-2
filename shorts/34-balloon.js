// Short 34: DROP THE WEIGHT. Kai's balloon is held down by sandbags of excuses; he cuts them one by one and rises to the top.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 10.6; const FY = 1500; const BAGS = [['FEAR', 2.0], ['DOUBT', 3.4], ['EXCUSES', 4.8], ['"LATER"', 6.2]];
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); const cut = BAGS.filter(([, a]) => t > a).length; const rise = lerp(0, 1, cut / BAGS.length); const lift = ease(prog(t, 6.3, 9.6)) * 2200 + rise * 160; const by = FY - 120 - lift + Math.sin(t * 2) * 10;
  dark(700); const g = c.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, `rgba(255,178,107,${prog(t, 6, 9.6) * 0.6})`); g.addColorStop(1, 'rgba(43,16,85,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 1920);
  camera({ x: 540, y: Math.min(1100, by - 300), z: 1.0, shake: BAGS.reduce((a, [, x]) => a + impact(t, x, 6, 0.3), 0), t }, () => {
    for (let i = 0; i < 18; i++) at(rnd(i) * W, -2600 + rnd(i + 4) * 3400 + (t * 30) % 100, 0.8 + rnd(i) * 0.6, () => K.ctx() && (circle(-40, 0, 40, 'rgba(255,255,255,0.08)'), circle(10, -10, 50, 'rgba(255,255,255,0.08)'), circle(60, 0, 40, 'rgba(255,255,255,0.08)')));
    card(-300, FY, 1700, 900, '#1b1f2b', 0); line([[-300, FY], [1400, FY]], 'rgba(255,255,255,0.2)', 5);
    // the balloon, basket and Kai
    at(540, by - 520, 1, () => { const bg = c.createRadialGradient(-60, -60, 10, 0, 0, 260); bg.addColorStop(0, '#69db7c'); bg.addColorStop(1, '#2b8a3e'); c.fillStyle = bg; c.beginPath(); c.ellipse(0, 0, 230, 260, 0, 0, Math.PI * 2); c.fill(); for (const x of [-120, 0, 120]) line([[x, -250], [x * 0.5, 250]], 'rgba(0,0,0,0.12)', 6); });
    line([[400, by - 300], [460, by - 90]], '#8d939e', 4); line([[680, by - 300], [620, by - 90]], '#8d939e', 4);
    const done = t > 9.0; who(done ? 'kai2' : 'kai', { x: 540, y: by - 40, s: 0.6, pose: done ? blend('stand', 'cheer', prog(t, 9, 9.3)) : (BAGS.some(([, a]) => t > a - 0.4 && t < a + 0.1) ? { lean: 0, tilt: 10, armL: [8, 4], armR: [60, 40], legL: [6, 0], legR: [6, 0] } : 'stand'), expr: done ? 'happy' : 'determined' });
    card(450, by - 100, 180, 110, '#8a5a3c', 10, INK, 5);
    BAGS.forEach(([s, a], i) => { const side = i % 2 ? 1 : -1; const hx = 540 + side * (60 + Math.floor(i / 2) * 50); const dropY = t > a ? (t - a) ** 2 * 1400 : 0; const y = by + 80 + Math.floor(i / 2) * 40 + dropY;
      if (t < a) line([[hx, by], [hx, y - 40]], '#8d939e', 3);
      if (dropY < 2000) at(hx, Math.min(y, FY - 40), 1, () => { card(-62, -44, 124, 88, '#7a6a52', 22, INK, 4); label(s, 0, 2, 22, '#fff3bf', { spacing: 1 }); }, t > a ? (t - a) * side : 0); });
  });
  title('DROP THE WEIGHT.', t > 6.2 ? GREEN : '#ffffff', 300, 84, t > 6.2 ? GREEN : undefined);
});
