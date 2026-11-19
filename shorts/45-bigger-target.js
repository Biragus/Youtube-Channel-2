// Short 45: FEELS LIKE A MISS? Kai's arrow sails over the small target. Zoom out: it was heading for a much bigger one.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const FY = 1450; const SHOOT = 1.3; const HIT = 4.8; const FROM = [500, 1080]; const BIG = [2400, -260];
function target(x, y, r, name, col) { at(x, y, 1, () => { for (let i = 0; i < 5; i++) circle(0, 0, r * (1 - i * 0.2), i % 2 ? '#ffffff' : col); line([[0, r], [0, r + 220]], '#6b4a2f', r * 0.12); label(name, 0, -r - 50, r * 0.3, '#ffffff', { spacing: 3 }); }); }
const arrowAt = (k) => { const cx = 1350; const cy = -200; const x = (1 - k) ** 2 * FROM[0] + 2 * (1 - k) * k * cx + k * k * BIG[0]; const y = (1 - k) ** 2 * FROM[1] + 2 * (1 - k) * k * cy + k * k * BIG[1]; return [x, y]; };
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(800); const z = ease(prog(t, 2.4, 3.8)); const hit = t > HIT; const k = Math.min(1, prog(t, SHOOT, HIT));
  camera({ x: lerp(640, 1450, z), y: lerp(1150, 600, z), z: lerp(1.0, 0.36, z), shake: impact(t, HIT, 16) + impact(t, SHOOT, 6, 0.2), t }, () => {
    card(-800, FY, 4600, 1500, '#141823', 0); line([[-800, FY], [3800, FY]], 'rgba(255,255,255,0.18)', 5);
    target(920, 1150, 90, 'QUICK WIN', RED);
    spot(BIG[0], BIG[1], 700 * Math.max(z, hit ? 1 : 0), 'rgba(242,193,78,0.25)'); target(BIG[0], BIG[1], 340, 'YOUR BIGGER GOAL', GOLD);
    // the arrow
    if (t > SHOOT) { const [ax, ay] = arrowAt(k); const [bx, by] = arrowAt(Math.max(0, k - 0.01)); const ang = Math.atan2(ay - by, ax - bx); at(ax, ay, 1 + z * 1.6, () => { line([[-90, 0], [0, 0]], '#e9ecef', 8); c.fillStyle = '#e9ecef'; c.beginPath(); c.moveTo(16, 0); c.lineTo(-6, -12); c.lineTo(-6, 12); c.closePath(); c.fill(); c.fillStyle = RED; c.fillRect(-96, -10, 18, 20); }, ang);
      if (!hit) floaters(t, 20, (i, life) => { const p = arrowAt(Math.max(0, k - life * 0.06)); circle(p[0], p[1], 6 * (1 - life), 'rgba(255,255,255,0.6)'); }, { every: 0.03, from: SHOOT, life: 0.4 }); }
    if (hit) floaters(t, 30, (i, life) => circle(BIG[0] + Math.cos(i * 2.4) * life * 600, BIG[1] + Math.sin(i * 2.4) * life * 600, 18 * (1 - life), GOLD), { every: 0.01, from: HIT, life: 0.7 });
    // Kai with the bow
    const draw = prog(t, 0.3, SHOOT); spot(400, FY - 220, 220, 'rgba(255,255,255,0.08)');
    who(hit ? 'kai2' : 'kai', { x: 400, y: FY - hop(t, HIT + 0.2, 60), s: 0.95, pose: hit ? blend('stand', 'cheer', prog(t, HIT, HIT + 0.3)) : (t < SHOOT ? { lean: -4, tilt: 0, armL: [86, 0], armR: [86 - draw * 10, -draw * 90], legL: [10, 0], legR: [10, 0] } : (t > 2.0 ? blend({ lean: 0, tilt: 0, armL: [86, 0], armR: [76, -10], legL: [10, 0], legR: [10, 0] }, 'shrug', prog(t, 2.0, 2.4)) : { lean: 0, tilt: 0, armL: [86, 0], armR: [76, -10], legL: [10, 0], legR: [10, 0] })), expr: hit ? 'happy' : (t > 2.0 ? 'sad' : 'determined') });
    if (!hit) at(400 + 0.95 * 150, FY - 0.95 * 250, 1, () => { c.strokeStyle = '#8a5a3c'; c.lineWidth = 8; c.beginPath(); c.arc(0, 0, 90, -1.2, 1.2); c.stroke(); line([[Math.cos(-1.2) * 90, Math.sin(-1.2) * 90], [t < SHOOT ? -draw * 60 : 0, 0], [Math.cos(1.2) * 90, Math.sin(1.2) * 90]], '#dee2e6', 3); });
  });
  title(hit ? 'IT WAS AIMED HIGHER.' : 'FEELS LIKE A MISS?', hit ? GOLD : '#ffffff', 300, 76, hit ? GOLD : undefined);
});
