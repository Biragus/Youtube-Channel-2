// Short 48: WORK SMARTER. Kai and two friends drag a huge rock; Kai gets an idea, POOF, it's a cart, and they roll off easily.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop } = require('./lib');
const CUT = 6.8; const FY = 1450; const IDEA = 2.4; const POOF = 3.2;
const helper = (i) => ({ hair: { type: ['curly', 'short'][i], color: '#2b2b33' }, top: { type: 'tee', color: ['#1c7ed6', '#e8590c'][i] }, pants: '#3b4252', shoes: '#e5e5e5' });
const pull = (t, i) => ({ lean: -28, tilt: 6, armL: [100, 10], armR: [100, 10], legL: [-20 + Math.sin(t * 6 + i) * 10, 0], legR: [26 - Math.sin(t * 6 + i) * 10, -30] });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(900); const cart = t > POOF; const move = cart ? (t - POOF) * 260 : Math.sin(t * 6) * 4 + t * 12;
  camera({ x: 560 + (cart ? (t - POOF) * 200 : 0), y: 1150, z: 1.0, shake: impact(t, POOF, 16), t }, () => {
    card(-500, FY, 4000, 900, '#141823', 0); line([[-500, FY], [3500, FY]], 'rgba(255,255,255,0.18)', 4);
    for (let i = 0; i < 20; i++) circle(i * 160 - 200, FY + 40, 4, 'rgba(255,255,255,0.15)');
    const rx = 260 + move; const ropeY = FY - 130;
    // the load: a rock, then a cart labelled PRODUCT
    if (!cart) { c.fillStyle = '#868e96'; c.beginPath(); c.ellipse(rx, FY - 140, 180, 140, 0, Math.PI, 0); c.lineTo(rx + 180, FY); c.lineTo(rx - 180, FY); c.closePath(); c.fill(); label('MANUAL WORK', rx, FY - 120, 30, INK, { spacing: 2 }); }
    else { card(rx - 180, FY - 200, 360, 130, '#2f9e44', 14, INK, 5); label('PRODUCT', rx, FY - 135, 40, '#ffffff', { spacing: 3 }); for (const wx of [-110, 110]) { circle(rx + wx, FY - 50, 50, INK); circle(rx + wx, FY - 50, 24, '#c9ccd2'); line([[rx + wx + Math.cos(t * 9) * 22, FY - 50 + Math.sin(t * 9) * 22], [rx + wx - Math.cos(t * 9) * 22, FY - 50 - Math.sin(t * 9) * 22]], '#495057', 5); } }
    if (t > POOF - 0.1 && t < POOF + 0.6) for (let i = 0; i < 12; i++) { const a = i * 0.52; alpha(1 - prog(t, POOF, POOF + 0.6), () => circle(rx + Math.cos(a) * (120 + (t - POOF) * 300), FY - 120 + Math.sin(a) * (90 + (t - POOF) * 200), 70, '#dee2e6')); }
    // the pullers in front
    const xs = [rx + 300, rx + 430, rx + 560]; line([[rx + 180, ropeY], [xs[2] + 40, ropeY - 120]], '#c9a43a', 6);
    xs.forEach((x, i) => { const kai = i === 2; const spec = kai ? (cart ? 'kai2' : 'kai') : helper(i);
      const pose = cart ? P.walk(t * 1.6 + i) : (kai && t > IDEA - 0.3 && t < POOF ? blend(pull(t, i), { lean: 0, tilt: -6, armL: [8, 4], armR: [150, 20], legL: [6, 0], legR: [6, 0] }, prog(t, IDEA - 0.3, IDEA)) : pull(t, i));
      who(spec, { x, y: FY, s: 0.75, pose, expr: cart ? 'happy' : (kai && t > IDEA ? 'hopeful' : 'tired'), still: !cart });
      if (!cart) floaters(t, 4, (k, life) => circle(x - 30, FY - 300 - life * 40, 5, '#74c0fc'), { every: 0.6 + i * 0.2, from: 0.3, life: 0.5 }); });
    if (t > IDEA && t < POOF + 0.4) at(xs[2], FY - 420 + Math.sin(t * 6) * 6, pop(t, IDEA), () => { spot(0, 0, 120, 'rgba(255,214,120,0.5)'); circle(0, 0, 34, '#ffd43b'); card(-14, 30, 28, 22, '#adb5bd', 4); });
  });
  title(t > POOF ? 'WORK SMARTER.' : 'WORKING HARD...', t > POOF ? GREEN : '#ffffff', 300, 84, t > POOF ? GREEN : undefined);
});
