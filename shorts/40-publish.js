// Short 40: JUST PRESS IT. Kai's finger hovers over PUBLISH for days of "not yet"; he finally presses and it all lights up.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd, counter, button, finger } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pulse } = require('./lib');
const CUT = 10.2; const PRESS = 6.2;
const DAYS = ['DAY 1: NOT YET', 'DAY 9: ONE MORE FIX', 'DAY 23: WHAT IF NOBODY BUYS?', 'DAY 41: MAYBE NEXT WEEK'];
module.exports = makeShort(CUT, (t) => {
  dark(900); const pressed = prog(t, PRESS, PRESS + 0.12); const after = t > PRESS + 0.2;
  const hover = t < PRESS - 0.4 ? Math.sin(t * 2.2) * 120 + 140 : lerp(140, 0, ease(prog(t, PRESS - 0.4, PRESS)));
  camera({ x: 540, y: 980, z: t < PRESS ? lerp(1.0, 1.25, prog(t, 0, PRESS)) : lerp(1.25, 1.0, ease(prog(t, PRESS, PRESS + 1))), shake: impact(t, PRESS, 22), t }, () => {
    if (after) { spot(540, 900, 700 * prog(t, PRESS, PRESS + 0.6), 'rgba(57,255,20,0.3)'); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + t * 0.3; line([[540 + Math.cos(a) * 300, 900 + Math.sin(a) * 300], [540 + Math.cos(a) * (420 + 200 * prog(t, PRESS, PRESS + 1)), 900 + Math.sin(a) * (420 + 200 * prog(t, PRESS, PRESS + 1))]], 'rgba(57,255,20,0.35)', 10); } }
    button('PUBLISH', 540, 900, 640, pressed > 0 ? '#1e7a33' : '#2fb344', 1.6, pressed);
    finger(620 + hover * 0.3, 1000 + hover, 2.0);
    if (!after) DAYS.forEach((s, i) => { const a = 0.5 + i * 1.35; alpha(prog(t, a, a + 0.2) * (1 - prog(t, a + 1.1, a + 1.35)), () => label(s, 540, 1350, 44, '#ff8787', { spacing: 2 })); });
    if (after) { floaters(t, 30, (i, life) => at(200 + rnd(i) * 680, 1300 - life * 500, 1, () => { card(-70, -30, 140, 60, '#123d1c', 30, GREEN, 3); label('+$9', 0, 2, 32, GREEN, { spacing: 1 }); }), { every: 0.12, from: PRESS + 0.5, life: 1.2 }); }
  });
  if (after) counter('SALES', String(Math.floor(prog(t, PRESS + 0.5, CUT) ** 1.3 * 240)), W / 2, 1650, GREEN, pop(t, PRESS + 0.5) * pulse(t, 0.25, 0.05), { size: 90, rot: 0 });
  title(after ? 'THAT WAS IT.' : 'JUST PRESS IT.', after ? GREEN : '#ffffff', 300, 90, after ? GREEN : undefined);
});
