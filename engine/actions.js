// Side-view actions for the shorts. Each one moves the whole body for the job: the tool or ball drives the hands,
// the hands drive the arms (IK), and the lean, crouch and feet follow the phase of the action.
// All functions are pure in time and return where the hands (and any tool head or ball) are, for effects and props.
const K = require('./kit');
const M = require('./motion');
const { lerp, clamp, smooth, smoother, keys } = M;
const DEG = Math.PI / 180;
const c = () => K.ctx();

// standing side-on: back foot behind, front foot ahead, gentle breathing
function sideStand(x, g, s, t, o = {}) {
  const dir = o.flip ? -1 : 1; const br = Math.sin(t * 2.2) * 2 * s; const cr = (o.crouch ?? 0) * s; const st = (o.stance ?? 1) * s;
  return { hip: [x + dir * (o.shift ?? 0) * s, g - 150 * s + br + cr], ground: g, s, flip: o.flip, profile: true, footL: [x - dir * 26 * st, g], footR: [x + dir * 30 * st, g], lean: o.lean ?? 2, tilt: o.tilt ?? 0 };
}
const shoulder = (p) => { const l = (p.lean ?? 0) * DEG; const dir = p.flip ? -1 : 1; return [p.hip[0] + Math.sin(l) * 134 * p.s * dir, p.hip[1] - Math.cos(l) * 134 * p.s]; };
const along = (from, deg, r, dir) => [from[0] + Math.cos(deg * DEG) * r * dir, from[1] + Math.sin(deg * DEG) * r];

// a two-handed swing with a tool: axe, hammer or sledge. period = one full swing; hit = fraction of the cycle at impact
function chop(spec, x, g, s, t, o = {}) {
  const dir = o.flip ? -1 : 1; const P = o.period ?? 1.1; const u = (((t - (o.t0 ?? 0)) / P) % 1 + 1) % 1; const n = Math.floor((t - (o.t0 ?? 0)) / P);
  const low = o.low ?? 25; // tool angle at impact (0 = straight forward, + = downward)
  const ang = u < 0.5 ? lerp(low + 20, -135, smooth(u / 0.5)) : (u < 0.62 ? lerp(-135, low, smoother((u - 0.5) / 0.12) ** 1.4) : lerp(low, low + 20, smooth((u - 0.62) / 0.38)));
  const lean = u < 0.5 ? lerp(4, -10, smooth(u / 0.5)) : (u < 0.62 ? lerp(-10, 24, smoother((u - 0.5) / 0.12)) : lerp(24, 4, smooth((u - 0.62) / 0.38)));
  const crouch = u < 0.5 ? lerp(10, 0, smooth(u / 0.5)) : (u < 0.62 ? lerp(0, 34, smoother((u - 0.5) / 0.12)) : lerp(34, 10, smooth((u - 0.62) / 0.38)));
  const p = sideStand(x, g, s, t, { flip: o.flip, crouch, lean, stance: 1.5 });
  const sh = shoulder(p); const hb = along(sh, ang, 70 * s, dir); const hf = along(sh, ang, 102 * s, dir);
  const len = (o.len ?? 190) * s; const end = along(sh, ang, 70 * s + len, dir); const butt = along(sh, ang, 56 * s, dir);
  const r = M.figure({ spec, ...p, handL: hb, handR: hf, expr: o.expr ?? 'determined', glow: o.glow });
  tool(o.tool ?? 'axe', butt, end, ang, s, dir);
  return { ...r, head: end, impact: u > 0.6 && u < 0.66, swing: n, u };
}
function tool(kind, a, b, ang, s, dir) {
  const cx = c(); cx.save(); cx.lineCap = 'round'; K.line([a, b], '#8a5a3c', 14 * s);
  cx.translate(b[0], b[1]); cx.rotate(ang * DEG * dir + (dir < 0 ? Math.PI : 0)); cx.scale(s, s);
  if (kind === 'axe') { cx.fillStyle = '#ced4da'; cx.beginPath(); cx.moveTo(-14, -18); cx.lineTo(14, -18); cx.quadraticCurveTo(52, 0, 14, 40); cx.lineTo(-14, 18); cx.closePath(); cx.fill(); cx.fillStyle = '#868e96'; cx.fillRect(-16, -18, 12, 36); }
  else if (kind === 'sledge') { cx.fillStyle = '#495057'; cx.fillRect(-20, -34, 40, 68); cx.fillStyle = '#868e96'; cx.fillRect(-20, -34, 40, 10); }
  else { cx.fillStyle = '#868e96'; cx.fillRect(-14, -24, 28, 48); }
  cx.restore();
}

// bowling: three approach steps, the arm swings back like a pendulum, forward, the ball leaves the hand low, follow-through
function bowl(spec, x0, g, s, t, t0, o = {}) {
  const dir = o.flip ? -1 : 1; const k = t - t0;
  const walkD = 150 * smooth(clamp(k / 0.9, 0, 1)); const x = x0 + dir * walkD;
  const phi = k < 0.3 ? -8 : (k < 0.85 ? lerp(-8, -80, smooth((k - 0.3) / 0.55)) : (k < 1.15 ? lerp(-80, 30, smoother((k - 0.85) / 0.3)) : lerp(30, 125, smooth((k - 1.15) / 0.4))));
  const crouch = k < 0.85 ? 10 * clamp(k / 0.85, 0, 1) : (k < 1.15 ? lerp(10, 55, smooth((k - 0.85) / 0.3)) : lerp(55, 40, smooth((k - 1.15) / 0.6)));
  const lean = k < 0.85 ? 8 : (k < 1.15 ? lerp(8, 30, smooth((k - 0.85) / 0.3)) : 30);
  let p;
  if (k < 0.9) { p = M.gait(x0, walkD, g, s, 'walk', { profile: true, flip: o.flip }); p.hip = [x, p.hip[1] + crouch * s * 0.3]; }
  else { p = { hip: [x, g - (150 - crouch) * s], ground: g, s, flip: o.flip, profile: true, footL: [x - dir * 95 * s, g], footR: [x + dir * 60 * s, g] }; }
  p.lean = lean; p.armR = [phi, 6]; p.armL = [lerp(-10, -50, smooth((k - 0.8) / 0.4)), 20];
  const r = M.figure({ spec, ...p, armL: p.armL, armR: p.armR, expr: o.expr ?? 'determined' });
  const released = k > 1.1;
  return { ...r, ball: r.handR, released, x };
}

// overhand throw (a paper plane, a stone): wind up behind the head, step and whip forward, release, follow through
function throwOver(spec, x, g, s, t, t0, o = {}) {
  const dir = o.flip ? -1 : 1; const k = t - t0;
  const phi = k < 0 ? 20 : (k < 0.35 ? lerp(20, -160, smooth(k / 0.35)) : (k < 0.5 ? lerp(-160, 95, smoother((k - 0.35) / 0.15)) : lerp(95, 40, smooth((k - 0.5) / 0.4))));
  const lean = k < 0 ? 2 : (k < 0.35 ? lerp(2, -12, smooth(k / 0.35)) : (k < 0.5 ? lerp(-12, 18, smooth((k - 0.35) / 0.15)) : lerp(18, 4, smooth((k - 0.5) / 0.6))));
  const step = smooth((k - 0.3) / 0.2);
  const p = sideStand(x, g, s, t, { flip: o.flip, lean, crouch: 12 * step });
  p.footR = [x + dir * lerp(30, 70, step) * s, g];
  const r = M.figure({ spec, ...p, armR: [phi, k > 0.35 && k < 0.5 ? 0 : -30], armL: [k < 0.35 ? lerp(10, 80, smooth(k / 0.35)) : lerp(80, -30, smooth((k - 0.35) / 0.3)), 10], expr: o.expr ?? 'determined' });
  return { ...r, released: k > 0.45 };
}

// pushing something heavy: leaning in, arms out to the hands' targets, back leg driving; pass dist to step slowly forward
function push(spec, x, g, s, t, o = {}) {
  const dir = o.flip ? -1 : 1; const strain = Math.sin(t * 9) * 2 * s;
  const ph = ((o.dist ?? 0) / (70 * s)); const a = Math.sin(ph * Math.PI); const b = Math.sin((ph + 0.5) * Math.PI);
  const p = { hip: [x, g - 128 * s + strain], ground: g, s, flip: o.flip, profile: true, lean: o.lean ?? 34,
    footL: [x - dir * (80 - 30 * Math.max(0, a)) * s, g - Math.max(0, a) * 14 * s], footR: [x + dir * (20 - 30 * Math.max(0, b)) * s, g - Math.max(0, b) * 14 * s] };
  return M.figure({ spec, ...p, handL: o.hands?.[0], handR: o.hands?.[1] ?? o.hands?.[0], expr: o.expr ?? 'determined', elbow: -1 });
}
// pulling: leaning back, braced, hands forward on the rope or handle
function pull(spec, x, g, s, t, o = {}) {
  const dir = o.flip ? -1 : 1; const strain = Math.sin(t * 9) * 2 * s;
  const p = { hip: [x, g - 132 * s + strain], ground: g, s, flip: o.flip, profile: true, lean: o.lean ?? -22, footL: [x - dir * 40 * s, g], footR: [x + dir * 70 * s, g] };
  return M.figure({ spec, ...p, handL: o.hands?.[0], handR: o.hands?.[1] ?? o.hands?.[0], expr: o.expr ?? 'determined', elbow: -1 });
}
// standing side-on with hands on targets (holding, reaching, working)
function work(spec, x, g, s, t, o = {}) {
  const p = sideStand(x, g, s, t, o);
  return M.figure({ spec, ...p, handL: o.handL, handR: o.handR, armL: o.armL ?? [8, 10], armR: o.armR ?? [8, 10], expr: o.expr, look: o.look, glow: o.glow, elbow: o.elbow });
}
// walking or running side-on along x (dist from x0); returns the pose
function go(spec, x0, dist, g, s, o = {}) {
  const p = M.gait(x0, dist, g, s, o.run ? 'run' : 'walk', { flip: o.flip, lean: o.lean, stride: o.stride, profile: true });
  M.figure({ spec, ...p, expr: o.expr, glow: o.glow, armL: o.armL ?? p.armL, armR: o.armR ?? p.armR, handL: o.handL, handR: o.handR });
  return p;
}

module.exports = { sideStand, chop, tool, bowl, throwOver, push, pull, work, go };
