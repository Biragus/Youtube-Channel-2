// Short 28: ONE SMALL PUSH. A tiny domino "1 POST" topples bigger and bigger ones, all the way to FREEDOM. The camera follows.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 10.6; const FY = 1400; const PUSH = 1.4;
const D = ['1 POST', '10 VIEWS', '1 SALE', '100 VIEWS', '10 SALES', '1K FOLLOWERS', '100 SALES', 'FULL-TIME', 'FREEDOM'];
const dom = D.map((s, i) => { const h = 70 * 1.42 ** i; return { s, h, w: h * 0.22, x: 0 }; }); { let x = 420; dom.forEach((d, i) => { d.x = x; x += d.h * 0.62 + (dom[i + 1]?.w ?? 0); }); }
const fallAt = (i) => PUSH + 0.2 + i * 0.85;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const cur = Math.max(0, Math.min(D.length - 1, Math.floor((t - PUSH) / 0.85)));
  const focus = dom[cur]; const last = t > fallAt(D.length - 1) + 0.5;
  camera({ x: lerp(500, focus.x + focus.h * 0.3, ease(prog(t, PUSH, PUSH + 0.6))), y: FY - focus.h * 0.5 - 100, z: Math.max(0.42, 1.3 * (300 / (focus.h + 220))), shake: D.reduce((a, _, i) => a + impact(t, fallAt(i) + 0.4, 3 + i * 1.5, 0.3), 0), t }, () => {
    card(-500, FY, dom[D.length - 1].x + 3000, 2000, '#1b1f2b', 0); line([[-500, FY], [dom[D.length - 1].x + 3000, FY]], 'rgba(255,255,255,0.25)', 6);
    dom.forEach((d, i) => { const k = ease(prog(t, fallAt(i), fallAt(i) + 0.45)); const ang = k * 1.15;
      at(d.x + d.w / 2, FY, 1, () => { card(-d.w, -d.h, d.w, d.h, i === D.length - 1 ? '#2f9e44' : '#f1f3f5', d.w * 0.15, INK, Math.max(3, d.w * 0.06)); c.save(); c.translate(-d.w / 2, -d.h / 2); c.rotate(-Math.PI / 2); label(d.s, 0, 0, Math.min(d.w * 0.5, d.h / (d.s.length * 0.75)), i === D.length - 1 ? '#ffffff' : INK, { spacing: 1 }); c.restore(); }, ang); });
    // Kai flicks the first one, then runs along behind the wave
    const kx = t < PUSH ? 300 : lerp(300, focus.x - 120, ease(prog(t, PUSH, PUSH + 0.5))); spot(kx, FY - 180, 200, 'rgba(57,255,20,0.15)');
    who(last ? 'kai2' : 'kai', { x: kx, y: FY - hop(t, fallAt(D.length - 1) + 0.6, 60 / 1), s: t < PUSH + 0.5 ? 0.7 : 0.7 * Math.max(1, (focus.h + 220) / 400), pose: t < PUSH ? blend('stand', { lean: 14, tilt: 0, armL: [8, 4], armR: [86, 0], legL: [6, 0], legR: [6, 0] }, prog(t, PUSH - 0.4, PUSH)) : (last ? 'cheer' : P.walk(t * 2)), expr: last ? 'happy' : 'determined' });
  });
  title('ONE SMALL PUSH.', last ? GREEN : '#ffffff', 300, 84, last ? GREEN : undefined);
});
