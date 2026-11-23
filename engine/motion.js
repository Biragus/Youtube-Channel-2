// Motion system for the shorts: posing by targets instead of fixed angles.
// figure() takes world positions for the hip, feet and (optionally) hands, solves the joint angles with
// two-bone inverse kinematics, and draws the character through the normal rig. On top of that are gaits
// (walk and run with planted feet and a body bob), a jump with anticipation and landing squash, and a
// simple spring for secondary motion. Everything is a pure function of time, so frames render independently.
const K = require('./kit');

const DEG = 180 / Math.PI;
const B = { thigh: 78, shin: 78, upArm: 72, foreArm: 68, shoulderX: 48, shoulderY: -138, hipX: 22 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
const smoother = (k) => { k = clamp(k, 0, 1); return k * k * k * (k * (k * 6 - 15) + 10); };
const backOut = (k, s = 1.6) => { k = clamp(k, 0, 1) - 1; return 1 + k * k * ((s + 1) * k + s); };

// Two-bone IK: from base point a toward target b; bend = +1 or -1 picks which side the middle joint goes.
function twoBone(a, b, l1, l2, bend) {
  let dx = b[0] - a[0]; let dy = b[1] - a[1]; let L = Math.hypot(dx, dy) || 0.001;
  const Lc = clamp(L, Math.abs(l1 - l2) + 0.5, l1 + l2 - 0.5); dx /= L; dy /= L;
  const A = Math.acos(clamp((l1 * l1 + Lc * Lc - l2 * l2) / (2 * l1 * Lc), -1, 1)) * bend;
  const jx = a[0] + (dx * Math.cos(A) - dy * Math.sin(A)) * l1; const jy = a[1] + (dx * Math.sin(A) + dy * Math.cos(A)) * l1;
  return { joint: [jx, jy], end: [a[0] + dx * Lc, a[1] + dy * Lc] };
}
// rig angles (degrees) for a chain, in the rig's mirrored "side" convention
const limb = (base, joint, end, side) => { const a1 = Math.atan2((joint[0] - base[0]) * side, joint[1] - base[1]) * DEG; const a2 = Math.atan2((end[0] - joint[0]) * side, end[1] - joint[1]) * DEG; return [a1, a2 - a1]; };

// figure({ spec, hip:[x,y], ground, s, flip, lean, tilt, footL, footR, handL, handR, armL, armR, expr, look, glow, squash })
// World coordinates throughout. lean/tilt in degrees (positive = forward). armL/armR are fallback rig angles when no hand target.
function figure(o) {
  const s = o.s ?? 1; const dir = o.flip ? -1 : 1; const g = o.ground;
  const toLocal = (p) => [(p[0] - o.hip[0]) / s * dir, (p[1] - g) / s];
  const hipH = (g - o.hip[1]) / s; const lean = (o.lean ?? 0) / DEG;
  const pose = { lean: o.lean ?? 0, tilt: o.tilt ?? 0, drop: 0 };
  // legs: knees bend forward
  const ends = {};
  for (const [side, key, ft] of [[-1, 'legL', o.footL], [1, 'legR', o.footR]]) {
    const base = [side * B.hipX, -hipH]; const target = toLocal(ft ?? [o.hip[0] + side * 22 * s * dir, g]);
    const r = twoBone(base, target, B.thigh, B.shin, -1); pose[key] = limb(base, r.joint, r.end, side); ends[key] = r.end;
  }
  // the rig places the hips from the lowest foot; drop corrects it so the hips sit exactly at o.hip
  pose.drop = Math.max(ends.legL[1], ends.legR[1]);
  // arms: solve in the torso's frame (after the lean), elbows bend back and down
  for (const [side, key, hd] of [[-1, 'armL', o.handL], [1, 'armR', o.handR]]) {
    if (!hd) { pose[key] = o[key] ?? [8, 4]; continue; }
    const p = toLocal(hd); const x = p[0]; const y = p[1] + hipH;
    const tx = x * Math.cos(lean) + y * Math.sin(lean); const ty = -x * Math.sin(lean) + y * Math.cos(lean);
    const base = [side * B.shoulderX, B.shoulderY]; const r = twoBone(base, [tx, ty], B.upArm, B.foreArm, o.elbow ?? 1);
    pose[key] = limb(base, r.joint, r.end, side);
  }
  // report the figure's screen box to the layout checker (head top to lowest foot)
  try { const L = require('../shorts/lib'); if (L.trackBox) { const top = o.hip[1] - (150 + 62 * 2 + 10) * s; const bot = Math.max(o.hip[1], (o.footL ?? [0, g])[1], (o.footR ?? [0, g])[1]); L.trackBox('figure', o.hip[0], (top + bot) / 2, 150 * s, bot - top); } } catch (e) { /* not in a short */ }
  const c = K.ctx(); c.save();
  if (o.squash) { c.translate(o.hip[0], g); c.scale(1 + o.squash * 0.6, 1 - o.squash); c.translate(-o.hip[0], -g); }
  if (o.glow) { c.shadowColor = o.glow; c.shadowBlur = 28 * s; }
  K.who(o.spec, { x: o.hip[0], y: g, s, flip: o.flip, pose, expr: o.expr, look: o.look, still: true, prop: o.prop });
  c.restore();
}

// ---- gaits ---------------------------------------------------------------------------------------
// Body position along the ground is `dist` (world px from the start x0). Feet stay planted during stance.
// Returns everything figure() needs. kind: 'walk' | 'run'.
function gait(x0, dist, ground, s, kind = 'walk', o = {}) {
  const run = kind === 'run'; const stride = (o.stride ?? (run ? 230 : 130)) * s; const dir = o.flip ? -1 : 1;
  const v = dist / stride; const hipBase = (run ? 138 : 148) * s;
  const foot = (phase) => { const w = v + phase; const c = Math.floor(w); const u = w - c; const start = x0 + dir * (c - phase) * stride;
    const st = run ? 0.4 : 0.6; const plant = start + dir * 0.35 * stride;
    if (u < st) return [plant, ground]; const k = (u - st) / (1 - st);
    return [plant + dir * smoother(k) * stride, ground - Math.sin(k * Math.PI) * (run ? 60 : 28) * s]; };
  const bob = run ? Math.abs(Math.sin(v * Math.PI * 2)) * 18 * s : (1 - Math.cos(v * Math.PI * 4)) * 4 * s;
  const sw = Math.sin(v * Math.PI * 2);
  return { hip: [x0 + dir * dist, ground - hipBase - bob], ground, s, flip: o.flip, footL: foot(0), footR: foot(0.5),
    lean: (run ? 12 : 3) + (o.lean ?? 0), tilt: run ? -4 : 2, armL: [sw * (run ? 45 : 22), run ? -80 : -15], armR: [sw * (run ? 45 : 22), run ? -80 : -15] };
}
// Standing with breathing; feet planted shoulder width apart.
function stand(x, ground, s, t, o = {}) { const br = Math.sin(t * 2.2) * 2 * s; const dir = o.flip ? -1 : 1;
  return { hip: [x, ground - 150 * s + br - (o.crouch ?? 0) * s], ground, s, flip: o.flip, footL: [x - 26 * s * dir, ground], footR: [x + 26 * s * dir, ground], lean: o.lean ?? 0, tilt: (o.tilt ?? 0) + Math.sin(t * 1.1) * 1.5, armL: o.armL ?? [10, 6], armR: o.armR ?? [10, 6] }; }
// A jump from (x0, ground0) to (x1, ground1) over [t0, t0+dur], with a crouch before and a squash after.
function jump(t, t0, dur, x0, g0, x1, g1, s, height, o = {}) {
  const pre = 0.28; const land = 0.3; const dir = o.flip ? -1 : 1;
  if (t < t0) { const k = smooth((t - (t0 - pre)) / pre); const r = stand(x0, g0, s, t, { ...o, crouch: k * 45, lean: k * 18 }); r.armL = [lerp(10, -50, k), -20]; r.armR = [lerp(10, -50, k), -20]; return r; }
  if (t > t0 + dur) { const k = clamp((t - t0 - dur) / land, 0, 1); const sq = Math.sin(k * Math.PI) * 0.12 * (1 - k); const r = stand(x1, g1, s, t, { ...o, crouch: (1 - smooth(k)) * 40, lean: (1 - k) * 14 }); r.squash = sq; r.armL = [lerp(60, 10, k), -10]; r.armR = [lerp(60, 10, k), -10]; return r; }
  const k = (t - t0) / dur; const x = lerp(x0, x1, k); const g = lerp(g0, g1, k); const yOff = -Math.sin(k * Math.PI) * height - (g1 - g0) * 0;
  const hy = g - 150 * s + yOff; const tuck = Math.sin(k * Math.PI);
  return { hip: [x, hy], ground: g, s, flip: o.flip, footL: [x - dir * 30 * s * (1 - tuck) + dir * 20 * s * tuck, hy + lerp(150, 95, tuck) * s], footR: [x + dir * 40 * s * (1 - tuck) + dir * 40 * s * tuck, hy + lerp(150, 110, tuck) * s], lean: lerp(18, 4, k), tilt: -6, armL: [lerp(-40, 150, smooth(k * 2)), 10], armR: [lerp(-40, 150, smooth(k * 2)), 10], squash: -0.05 * tuck };
}
// Damped spring: where a value is at time t after jumping from `from` to `to` at time t0.
const spring = (t, t0, from, to, freq = 6, damp = 4) => (t < t0 ? from : to + (from - to) * Math.exp(-damp * (t - t0)) * Math.cos(freq * (t - t0)));
// Piecewise keyframes: keys = [[t, value], ...]; numbers or arrays, smoothstep between keys.
function keys(t, ks, ease = smooth) {
  if (t <= ks[0][0]) return ks[0][1]; for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) { const k = ease((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])); const a = ks[i - 1][1]; const b = ks[i][1]; return Array.isArray(a) ? a.map((v, j) => lerp(v, b[j], k)) : lerp(a, b, k); }
  return ks[ks.length - 1][1];
}
// dust puffs where a foot lands or a body hits the ground
function dust(t, t0, x, y, s = 1, n = 8) { if (t < t0 || t > t0 + 0.7) return; const k = (t - t0) / 0.7; for (let i = 0; i < n; i++) { const a = Math.PI + (i / (n - 1)) * Math.PI; K.alpha((1 - k) * 0.5, () => K.circle(x + Math.cos(a) * k * 80 * s, y + Math.sin(a) * k * 30 * s - 4, (6 + k * 10) * s, '#ced4da')); } }

module.exports = { twoBone, figure, gait, stand, jump, spring, keys, dust, smooth, smoother, backOut, lerp, clamp };
// put a gait (or any pose) onto uneven ground: f(x) gives the ground height at x
function onGround(p, f) { const d = (q) => (q ? [q[0], q[1] - p.ground + f(q[0])] : q); const g0 = p.ground; const gh = f(p.hip[0]); return { ...p, hip: [p.hip[0], p.hip[1] - g0 + gh], footL: d(p.footL), footR: d(p.footR), ground: gh }; }
module.exports.onGround = onGround;

// ---- ready-made actions -----------------------------------------------------------------------------
// walk/run to wherever x is now: the step phase follows the distance, so feet stay planted while x changes
function walk(spec, x, ground, s, o = {}) { const p = gait(0, o.flip ? -x : x, ground, s, o.run ? 'run' : 'walk', { flip: o.flip, lean: o.lean, stride: o.stride }); figure({ spec, ...p, expr: o.expr, look: o.look, glow: o.glow, handL: o.handL, handR: o.handR, elbow: o.elbow, armL: o.armL ?? p.armL, armR: o.armR ?? p.armR, prop: o.prop }); return p; }
// standing still and breathing; arms by angle or hands by target
function idle(spec, x, ground, s, t, o = {}) { const p = stand(x, ground, s, t, o); figure({ spec, ...p, expr: o.expr, look: o.look, glow: o.glow, handL: o.handL, handR: o.handR, elbow: o.elbow, armL: o.armL ?? p.armL, armR: o.armR ?? p.armR, prop: o.prop, squash: o.squash }); return p; }
// a celebration starting at t0: crouch, hop with arms flying up, squash on landing, then bounce gently
function celebrate(spec, x, ground, s, t, t0, o = {}) {
  const k = t - t0; const dir = o.flip ? -1 : 1;
  if (k < 0) return idle(spec, x, ground, s, t, o);
  const crouch = k < 0.15 ? Math.sin((k / 0.15) * Math.PI / 2) * 30 : (k < 0.55 ? 0 : (k < 0.75 ? Math.sin(((k - 0.55) / 0.2) * Math.PI) * 25 : 0));
  const air = k > 0.15 && k < 0.55 ? Math.sin(((k - 0.15) / 0.4) * Math.PI) * (o.height ?? 70) * s : 0;
  const bounce = k > 0.75 ? Math.abs(Math.sin((k - 0.75) * 5)) * 10 * s * Math.exp(-(k - 0.75) * 0.6) : 0;
  const arms = smoother(k / 0.3); const wave = Math.sin(k * 8) * 10;
  const hipY = ground - 150 * s - air - bounce + crouch * s;
  const tuck = air > 0 ? 0.3 : 0;
  const p = { hip: [x, hipY], ground, s, flip: o.flip, footL: [x - 26 * s * dir, air || bounce ? hipY + (150 - tuck * 40) * s : ground], footR: [x + 26 * s * dir, air || bounce ? hipY + (150 - tuck * 30) * s : ground], lean: 0, tilt: -6,
    armL: [lerp(10, 150, arms) + wave, lerp(6, 16, arms)], armR: [lerp(10, 150, arms) - wave, lerp(6, 16, arms)], squash: k > 0.55 && k < 0.75 ? Math.sin(((k - 0.55) / 0.2) * Math.PI) * 0.08 : 0 };
  figure({ spec, ...p, expr: o.expr ?? 'happy', glow: o.glow }); return p;
}
// sitting on a bench or the floor (seatY = where the hips rest)
function sit(spec, x, ground, s, t, o = {}) { const dir = o.flip ? -1 : 1; const seat = o.seat ?? ground - 60 * s; const br = Math.sin(t * 2) * 1.5 * s; const p = { hip: [x, seat + br], ground, s, flip: o.flip, footL: [x + dir * 60 * s, ground], footR: [x + dir * 85 * s, ground], lean: o.lean ?? 6, tilt: (o.tilt ?? 10) + Math.sin(t * 1.2) * 2, armL: o.armL ?? [24, -40], armR: o.armR ?? [24, -40] }; figure({ spec, ...p, expr: o.expr, look: o.look, handL: o.handL, handR: o.handR, elbow: o.elbow, prop: o.prop }); return p; }
Object.assign(module.exports, { walk, idle, celebrate, sit });

// stepping at a fixed x (walking toward or away from the camera, or on a treadmill); dist drives the step cycle
function march(spec, x, ground, s, dist, o = {}) { const p = gait(0, dist, ground, s, o.run ? 'run' : 'walk', { lean: o.lean }); const dx = x - p.hip[0]; const q = { ...p, hip: [x, p.hip[1]], footL: [p.footL[0] + dx, p.footL[1]], footR: [p.footR[0] + dx, p.footR[1]] }; figure({ spec, ...q, flip: o.flip, expr: o.expr, look: o.look, glow: o.glow, armL: o.armL ?? p.armL, armR: o.armR ?? p.armR, prop: o.prop }); return q; }
module.exports.march = march;
