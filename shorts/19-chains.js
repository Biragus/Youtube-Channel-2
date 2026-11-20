// Short 19: EVERY SALE BREAKS A CHAIN. Kai is held by 9 TO 5, DEBT and DOUBT; sales snap them one by one.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, counter, money } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pulse } = require('./lib');
const CUT = 10.6; const KX = 540; const FY = 1350;
const CHAINS = [{ name: '9 TO 5', ax: 90, ay: 900, snap: 4.0 }, { name: 'DEBT', ax: 990, ay: 940, snap: 6.0 }, { name: 'DOUBT', ax: 160, ay: 1600, snap: 8.0 }];

function chain(x1, y1, x2, y2, t, broken) {
  const n = 14; const sag = 40; const c = K.ctx();
  for (let i = 0; i < n; i++) { const k = i / (n - 1); if (broken > 0 && Math.abs(k - 0.5) < 0.1) continue; let x = lerp(x1, x2, k); let y = lerp(y1, y2, k) + Math.sin(k * Math.PI) * sag + Math.sin(t * 3 + i) * 3;
    if (broken > 0) { const side = k < 0.5 ? -1 : 1; const from = side < 0 ? [x1, y1] : [x2, y2]; x = lerp(x, from[0], broken * 0.4); y += broken * broken * 300 * Math.abs(k - 0.5); }
    c.save(); c.translate(x, y); c.rotate(Math.atan2(y2 - y1, x2 - x1) + (i % 2 ? Math.PI / 2 : 0) * 0.3); c.strokeStyle = '#adb5bd'; c.lineWidth = 9; c.beginPath(); c.ellipse(0, 0, 22, 12, 0, 0, Math.PI * 2); c.stroke(); c.restore(); }
}
module.exports = makeShort(CUT, (t) => {
  dark(1000); const free = t > 8.4; const run = ease(prog(t, 8.6, 10.4));
  const sales = Math.floor(prog(t, 1.4, 8.2) ** 1.2 * 120);
  camera({ x: lerp(540, 760, run), y: lerp(1150, 1100, run), z: lerp(1.05, 1.15, run), shake: CHAINS.reduce((a, ch) => a + impact(t, ch.snap, 20), 0) + (free ? 0 : 1.5), t }, () => {
    K.line([[-200, FY], [1500, FY]], 'rgba(255,255,255,0.15)', 4);
    if (free) spot(1100, FY - 300, 600, `rgba(255,214,120,${0.4 * prog(t, 8.4, 9)})`);
    const strain = Math.sin(t * 8) * (free ? 0 : 6);
    CHAINS.forEach((ch) => { card(ch.ax - 30, ch.ay - 30, 60, 60, '#495057', 10, INK, 4); const b = prog(t, ch.snap, ch.snap + 0.8);
      chain(ch.ax, ch.ay, KX + strain, FY - 230, t, b); if (b < 0.3) label(ch.name, lerp(ch.ax, KX, 0.45), lerp(ch.ay, FY - 230, 0.45) - 60, 38, '#ff8787', { spacing: 4 });
      if (b > 0 && b < 1) { floaters(t, 10, (i, life) => circle(lerp(ch.ax, KX, 0.5) + Math.cos(i) * life * 160, lerp(ch.ay, FY - 230, 0.5) + Math.sin(i) * life * 160, 8 * (1 - life), GOLD), { every: 0.01, from: ch.snap, life: 0.5 }); label('SNAP!', lerp(ch.ax, KX, 0.5), lerp(ch.ay, FY - 230, 0.5) - 110, 50, GOLD, { spacing: 4, glow: GOLD }); } });
    spot(KX, FY - 220, 260, free ? 'rgba(57,255,20,0.25)' : 'rgba(255,135,135,0.12)');
    const pull = { lean: 0, tilt: 8 + Math.sin(t * 8) * 3, armL: [60, -20], armR: [60, -20], legL: [14, 0], legR: [14, 0] };
    who(free ? 'kai2' : 'kai', { x: lerp(KX + strain, 1300, run), y: FY - hop(t, 8.4, 70), s: 1.0, pose: free ? (run > 0 ? P.walk(t * 1.8) : blend(pull, 'cheer', prog(t, 8.2, 8.6))) : pull, expr: free ? 'happy' : 'determined' });
  });
  K.at(W / 2, 470, pop(t, 1.2) * pulse(t, 0.25, 0.05), () => require('./lib').pill(`SALES: ${sales}`, 0, 0, 36, GREEN, { border: GREEN }));
  title('EVERY SALE', '#ffffff', 290, 76); title('BREAKS A CHAIN.', GREEN, 380, 76, GREEN);
});
