// Short 9: THE CLOSER YOU GET... A huge shadow labelled WHAT IF IT FAILS? shrinks with every step Kai takes towards it.
const K = require('../engine/kit');
const { GREEN, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, impact, blend, hop } = require('./lib');
const CUT = 10.6; const GO = 3.0; const ARRIVE = 8.4; const FY = 1500;

function monster(x, y, s, t, fade) { // feet at (x, y)
  const c = K.ctx(); at(x, y, s, () => {
    const sway = Math.sin(t * 1.6) * 14; c.fillStyle = '#05060a'; c.beginPath(); c.moveTo(-230, 0);
    for (let i = 0; i <= 8; i++) c.lineTo(-230 + i * 57.5, Math.sin(t * 5 + i) * 14); // ragged hem
    c.bezierCurveTo(260, -300, 230 + sway, -760, sway, -820); c.bezierCurveTo(-230 + sway, -760, -260, -300, -230, 0); c.fill();
    spot(sway, -560, 260, 'rgba(255,40,40,0.18)');
    const blink = Math.abs(Math.sin(t * 0.9)) > 0.97 ? 0.15 : 1;
    for (const ex of [-70, 70]) { c.fillStyle = '#ff2b2b'; c.beginPath(); c.ellipse(ex + sway * 0.8, -600, 34, 20 * blink, ex > 0 ? -0.3 : 0.3, 0, Math.PI * 2); c.fill(); }
    alpha(fade, () => label('WHAT IF', sway * 0.6, -400, 70, '#ff8787', { spacing: 4 }));
    alpha(fade, () => label('IT FAILS?', sway * 0.6, -320, 70, '#ff8787', { spacing: 4 }));
  });
}
module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(1100); const walk = ease(prog(t, GO, ARRIVE)); const kx = lerp(170, 640, walk);
    const ms = lerp(1.15, 0.12, prog(t, GO, ARRIVE) ** 0.8); const mx = 820;
    camera({ x: lerp(560, 720, walk), y: lerp(980, 1250, walk), z: lerp(1.0, 1.55, walk), shake: t < GO ? 2 : 0, t }, () => {
      line([[-200, FY], [1300, FY]], 'rgba(255,255,255,0.15)', 4);
      if (t < ARRIVE + 0.6) monster(mx, FY, ms, t, 1);
      if (t > ARRIVE + 0.6) floaters(t, 16, (i, life) => circle(mx + Math.cos(i) * life * 120, FY - 50 - Math.sin(i * 2) * life * 120, 10 * (1 - life), '#2b2f3a'), { every: 0.01, from: ARRIVE + 0.6, life: 0.8 });
      spot(kx, FY - 220, 260, 'rgba(57,255,20,0.18)');
      // Kai: shaking at first, a deep breath, then steady steps forward
      const shiver = t < GO ? Math.sin(t * 40) * 3 : 0; const breathe = prog(t, GO - 0.9, GO - 0.2);
      const pose = t < GO ? blend('slump', { lean: 0, tilt: -8, armL: [20, 0], armR: [20, 0], legL: [6, 0], legR: [6, 0] }, breathe) : (t < ARRIVE ? P.walk(t * 1.1) : blend(P.walk(t * 1.1), 'power', prog(t, ARRIVE, ARRIVE + 0.4)));
      who('kai', { x: kx + shiver, y: FY - hop(t, ARRIVE + 0.7, 40), s: 1.0, pose, expr: t < GO - 0.6 ? 'worried' : (t > ARRIVE + 0.5 ? 'smug' : 'determined'), look: t > ARRIVE ? 0.6 : 0 });
    });
    label(t < 6 ? 'THE CLOSER YOU GET...' : '...THE SMALLER IT IS.', W / 2, 300, 70, t < 6 ? '#ffffff' : GREEN, { spacing: 4, glow: t < 6 ? undefined : GREEN });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
