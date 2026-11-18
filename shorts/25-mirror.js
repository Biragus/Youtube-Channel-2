// Short 25: WHO YOU COULD BE. Kai looks in a mirror; his future self in the suit looks back, beckons, and Kai walks in.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 10.4; const MX = 680; const FY = 1400; const WALK = 6.0;
module.exports = makeShort(CUT, (t) => {
  dark(1000); const c = K.ctx(); const go = ease(prog(t, WALK, WALK + 2.2)); const flash = prog(t, WALK + 2.0, WALK + 2.5);
  camera({ x: lerp(560, MX, go), y: lerp(1080, 1120, go), z: lerp(1.0, 1.1, go), t }, () => {
    K.line([[0, FY], [W, FY]], 'rgba(255,255,255,0.15)', 4);
    // the mirror, with the future self inside
    card(MX - 200, FY - 760, 400, 760, '#c9a43a', 30); const g = c.createLinearGradient(0, FY - 740, 0, FY); g.addColorStop(0, '#2b3a55'); g.addColorStop(1, '#141a2a'); card(MX - 180, FY - 740, 360, 740, g, 20);
    c.save(); c.beginPath(); c.roundRect(MX - 180, FY - 740, 360, 740, 20); c.clip();
    spot(MX, FY - 300, 260, 'rgba(242,193,78,0.35)');
    const beckon = t > 3.2 && t < WALK + 1 ? { lean: 0, tilt: -4, armL: [8, 4], armR: [100 + Math.sin(t * 6) * 25, -60], legL: [6, 0], legR: [6, 0] } : 'stand';
    alpha(prog(t, 1.2, 2.4), () => who('kai2', { x: MX + 20, y: FY - 20, s: 0.95, flip: true, pose: blend('stand', beckon, prog(t, 3.2, 3.6)), expr: 'smile' }));
    line([[MX - 140, FY - 700], [MX - 40, FY - 600]], 'rgba(255,255,255,0.25)', 10); c.restore();
    // Kai: looks, steps back surprised, then walks into it
    const kx = lerp(lerp(260, 200, prog(t, 2.2, 2.6)), MX, go); spot(kx, FY - 220, 240, 'rgba(57,255,20,0.15)');
    alpha(1 - flash, () => who('kai', { x: kx, y: FY - hop(t, 2.2, 30), s: 0.95, pose: t < WALK ? (t > 2.2 && t < 3 ? 'shrug' : blend('slump', 'stand', prog(t, 3.2, 4))) : P.walk(t * 1.3), expr: t < 2.2 ? 'sad' : (t < 3.6 ? 'shock' : 'determined'), look: 0.6 }));
  });
  K.tint('#ffffff', 0.9 * Math.sin(flash * Math.PI));
  title(t < 3.6 ? 'WHO YOU COULD BE' : 'IS WAITING FOR YOU.', t < 3.6 ? '#ffffff' : GOLD, 300, 70, t < 3.6 ? undefined : GOLD);
});
