// Drawing toolkit for the stickman story videos: easing, the stick-figure rig, and shared props.
// Everything draws onto a 1920x1080 canvas 2D context.

const W = 1920;
const H = 1080;
const INK = '#16161a';
const PAPER = '#f4efe6';
const ACCENT = '#ff7a1a';
const FONT = 'Inter';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (k) => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeOut = (k) => 1 - Math.pow(1 - clamp(k), 3);
// 0..1 progress of t between a and b
const prog = (t, a, b) => clamp((t - a) / (b - a));
const between = (t, a, b) => t >= a && t < b;
const rad = (d) => (d * Math.PI) / 180;

// ---- poses -------------------------------------------------------------
// Angles in degrees, measured from "hanging straight down"; positive swings forward (the way the figure faces).
// arm/leg: [upper, lowerBend]
const POSES = {
  stand: { lean: 0, head: 0, armF: [8, 8], armB: [-8, 8], legF: [6, 0], legB: [-6, 0] },
  slump: { lean: 14, head: 32, armF: [4, 4], armB: [2, 4], legF: [5, 0], legB: [-5, 0] },
  cheer: { lean: -4, head: -10, armF: [150, 20], armB: [-150, -20], legF: [8, 0], legB: [-8, 0] },
  point: { lean: 2, head: 0, armF: [82, 6], armB: [-8, 10], legF: [8, 0], legB: [-8, 0] },
  shock: { lean: -8, head: -8, armF: [40, 95], armB: [-30, -80], legF: [10, 0], legB: [-12, 0] },
  armsCrossed: { lean: 0, head: 4, armF: [28, 118], armB: [22, 112], legF: [5, 0], legB: [-5, 0] },
  sit: { lean: 4, head: 6, armF: [38, 60], armB: [30, 60], legF: [84, -84], legB: [78, -80] },
  carry: { lean: 10, head: 6, armF: [48, 62], armB: [40, 62], legF: [6, 0], legB: [-6, 0] },
  phone: { lean: 6, head: 22, armF: [30, 112], armB: [-6, 8], legF: [5, 0], legB: [-5, 0] },
  pay: { lean: 4, head: 6, armF: [62, 30], armB: [-6, 8], legF: [84, -84], legB: [78, -80] },
};

function lerpPose(a, b, k) {
  const o = {};
  for (const key of Object.keys(a)) {
    o[key] = Array.isArray(a[key]) ? [lerp(a[key][0], b[key][0], k), lerp(a[key][1], b[key][1], k)] : lerp(a[key], b[key], k);
  }
  return o;
}

// phase advances by 1 per full stride cycle
function walkPose(phase, sad = false) {
  const s = Math.sin(phase * Math.PI * 2);
  const c = Math.cos(phase * Math.PI * 2);
  const swing = sad ? 20 : 30;
  return {
    lean: sad ? 14 : 5,
    head: sad ? 30 : 0,
    armF: [-s * (sad ? 8 : 28), 12],
    armB: [s * (sad ? 8 : 28), 12],
    legF: [s * swing, -Math.max(0, -c) * 38],
    legB: [-s * swing, -Math.max(0, c) * 38],
  };
}

// ---- figure ------------------------------------------------------------
// opts: x (hip x), y (ground y), s (scale), face (1 right, -1 left), pose, bob,
//       color, mouth: smile|flat|sad|open|laugh, hair: none|pony|bob, hat, skirt, tie, eyes: dot|wide|closed
function figure(ctx, o) {
  const s = o.s ?? 1;
  const face = o.face ?? 1;
  const p = o.pose ?? POSES.stand;
  const color = o.color ?? INK;
  const L = { torso: 112, upArm: 56, foreArm: 52, thigh: 64, shin: 64, head: 36 };
  // hip height depends on how bent the legs are, so sitting figures drop
  const legReach = (leg) => L.thigh * Math.cos(rad(leg[0])) + L.shin * Math.cos(rad(leg[0] + leg[1]));
  const hipH = o.hipH ?? Math.max(legReach(p.legF), legReach(p.legB));

  ctx.save();
  ctx.translate(o.x, o.y - (o.bob ?? 0) * s);
  ctx.scale(s * face, s);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 14;

  const hip = { x: 0, y: -hipH };
  const dir = (deg, len) => ({ x: Math.sin(rad(deg)) * len, y: Math.cos(rad(deg)) * len });
  const limb = (from, seg, l1, l2) => {
    const a = dir(seg[0], l1);
    const mid = { x: from.x + a.x, y: from.y + a.y };
    const b = dir(seg[0] + seg[1], l2);
    const end = { x: mid.x + b.x, y: mid.y + b.y };
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(mid.x, mid.y); ctx.lineTo(end.x, end.y); ctx.stroke();
    return end;
  };
  const up = dir(180 - p.lean, L.torso); // torso goes up from hip, leaning forward by p.lean
  const neck = { x: hip.x + up.x, y: hip.y + up.y };
  const shoulder = { x: lerp(hip.x, neck.x, 0.9), y: lerp(hip.y, neck.y, 0.9) };

  // back limbs first
  limb(hip, p.legB, L.thigh, L.shin);
  const handB = limb(shoulder, p.armB, L.upArm, L.foreArm);
  // torso
  ctx.beginPath(); ctx.moveTo(hip.x, hip.y); ctx.lineTo(neck.x, neck.y); ctx.stroke();
  if (o.skirt) {
    ctx.fillStyle = o.skirt;
    ctx.beginPath(); ctx.moveTo(shoulder.x - 6, shoulder.y + 34); ctx.lineTo(hip.x + 44, hip.y + 40); ctx.lineTo(hip.x - 44, hip.y + 40); ctx.closePath(); ctx.fill();
    ctx.fillStyle = color;
  }
  limb(hip, p.legF, L.thigh, L.shin);
  const handF = limb(shoulder, p.armF, L.upArm, L.foreArm);

  // head
  const hd = dir(180 - p.lean - p.head * 0.5, L.head + 4);
  const head = { x: neck.x + hd.x + Math.sin(rad(p.head)) * 12, y: neck.y + hd.y + (1 - Math.cos(rad(p.head))) * 10 };
  if (o.hair === 'pony') {
    ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(head.x - 26, head.y - 18); ctx.quadraticCurveTo(head.x - 78, head.y - 6, head.x - 64, head.y + 54); ctx.stroke();
    ctx.lineWidth = 14;
  }
  ctx.fillStyle = o.headFill ?? PAPER;
  ctx.beginPath(); ctx.arc(head.x, head.y, L.head, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = color;
  if (o.hair === 'bob' || o.hair === 'pony') {
    ctx.beginPath(); ctx.arc(head.x, head.y, L.head + 2, rad(175), rad(335)); ctx.lineTo(head.x - 4, head.y - 12); ctx.closePath(); ctx.fill();
  }
  if (o.hat) {
    ctx.fillStyle = o.hat;
    ctx.beginPath(); ctx.arc(head.x, head.y - 8, L.head + 3, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillRect(head.x - 6, head.y - 16, 62, 10);
    ctx.fillStyle = color;
  }
  // face (looks toward +x)
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.rotate(rad(p.head * 0.6));
  const eyes = o.eyes ?? 'dot';
  ctx.lineWidth = 6;
  for (const ex of [4, 22]) {
    if (eyes === 'closed') { ctx.beginPath(); ctx.moveTo(ex - 6, -6); ctx.lineTo(ex + 6, -6); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(ex, -6, eyes === 'wide' ? 7.5 : 5, 0, Math.PI * 2); ctx.fill(); }
  }
  const mouth = o.mouth ?? 'flat';
  ctx.beginPath();
  if (mouth === 'smile') ctx.arc(13, 8, 11, rad(20), rad(160));
  else if (mouth === 'sad') ctx.arc(13, 22, 11, rad(200), rad(340));
  else if (mouth === 'open') ctx.ellipse(14, 15, 7, 10, 0, 0, Math.PI * 2);
  else if (mouth === 'laugh') { ctx.arc(13, 8, 13, 0, Math.PI); ctx.closePath(); }
  else { ctx.moveTo(4, 14); ctx.lineTo(22, 14); }
  if (mouth === 'open' || mouth === 'laugh') ctx.fill(); else ctx.stroke();
  ctx.restore();
  ctx.restore();

  // return world-space anchors so scenes can attach props and bubbles
  const world = (pt) => ({ x: o.x + pt.x * s * face, y: o.y - (o.bob ?? 0) * s + pt.y * s });
  return { head: world(head), handF: world(handF), handB: world(handB), hip: world(hip) };
}

// ---- text and bubbles --------------------------------------------------
function text(ctx, str, x, y, o = {}) {
  ctx.save();
  ctx.font = `${o.weight ?? 800} ${o.size ?? 64}px ${o.font ?? FONT}`;
  ctx.textAlign = o.align ?? 'center';
  ctx.textBaseline = o.baseline ?? 'middle';
  ctx.globalAlpha *= o.alpha ?? 1;
  if (o.letterSpacing) ctx.letterSpacing = `${o.letterSpacing}px`;
  if (o.stroke) { ctx.lineWidth = o.strokeWidth ?? 10; ctx.strokeStyle = o.stroke; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
  ctx.fillStyle = o.color ?? INK;
  ctx.fillText(str, x, y);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

// Speech bubble anchored above a point; k is a 0..1 pop-in amount.
function bubble(ctx, str, x, y, k = 1, o = {}) {
  if (k <= 0) return;
  const size = o.size ?? 46;
  ctx.save();
  ctx.font = `700 ${size}px ${FONT}`;
  const lines = str.split('\n');
  const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 64;
  const h = lines.length * size * 1.25 + 44;
  const sc = easeOut(k) * (1 + 0.08 * Math.sin(Math.min(k, 1) * Math.PI));
  ctx.translate(x, y); ctx.scale(sc, sc);
  const side = o.side ?? 1; // which way the tail leans
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-18 * side, -34); ctx.lineTo(0, 0); ctx.lineTo(22 * side, -34); ctx.closePath(); ctx.fill(); ctx.stroke();
  roundRect(ctx, -w / 2, -h - 30, w, h, 28); ctx.fill(); ctx.stroke();
  ctx.fillRect(-16 * side - (side < 0 ? 38 : 0), -36, 38, 8); // hide the seam where the tail meets the box
  lines.forEach((l, i) => text(ctx, l, 0, -h - 30 + 22 + size * 0.62 + i * size * 1.25, { size, weight: 700 }));
  ctx.restore();
}

// Lower-third caption used for key narration words.
function caption(ctx, str, k = 1, o = {}) {
  if (k <= 0) return;
  ctx.save();
  ctx.globalAlpha = ease(k);
  text(ctx, str, W / 2, o.y ?? 968, { size: o.size ?? 58, weight: 800, color: o.color ?? '#ffffff', stroke: o.stroke ?? INK, strokeWidth: 14 });
  ctx.restore();
}

// ---- environment -------------------------------------------------------
function background(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(1, bottom ?? top);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function ground(ctx, y, color, line = INK) {
  ctx.fillStyle = color; ctx.fillRect(0, y, W, H - y);
  ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
}

// deterministic pseudo-random so every render is identical
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function stars(ctx, t, n = 70, maxY = 520) {
  ctx.save(); ctx.fillStyle = '#ffffff';
  for (let i = 0; i < n; i++) {
    ctx.globalAlpha = 0.35 + 0.45 * Math.abs(Math.sin(t * (0.6 + rnd(i + 9)) + i));
    ctx.beginPath(); ctx.arc(rnd(i) * W, rnd(i + 50) * maxY, 1.5 + rnd(i + 99) * 2.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function rain(ctx, t, amount = 1, color = 'rgba(190,205,225,0.55)') {
  if (amount <= 0) return;
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
  const n = Math.floor(260 * amount);
  for (let i = 0; i < n; i++) {
    const speed = 1500 + rnd(i + 3) * 700;
    const y = ((rnd(i) * (H + 200) + t * speed) % (H + 200)) - 100;
    const x = ((rnd(i + 20) * (W + 400) - (y * 0.22)) % (W + 400)) - 100;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 9, y + 40); ctx.stroke();
  }
  ctx.restore();
}

// City skyline silhouette with lit windows.
function skyline(ctx, baseY, color, windowColor, seed = 0, lit = 0.35) {
  let x = -40; let i = seed;
  while (x < W + 40) {
    const w = 110 + rnd(i) * 150; const h = 160 + rnd(i + 7) * 330;
    ctx.fillStyle = color; ctx.fillRect(x, baseY - h, w, h);
    if (windowColor) {
      ctx.fillStyle = windowColor;
      for (let wy = baseY - h + 26; wy < baseY - 30; wy += 46) for (let wx = x + 20; wx < x + w - 30; wx += 40) {
        if (rnd(wx * 0.13 + wy * 0.71 + i) < lit) ctx.fillRect(wx, wy, 18, 24);
      }
    }
    x += w + 8; i += 1;
  }
}

// ---- vehicles ----------------------------------------------------------
function wheel(ctx, x, y, r, spin) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c9ccd2'; ctx.beginPath(); ctx.arc(0, 0, r * 0.56, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(spin); ctx.strokeStyle = INK; ctx.lineWidth = 6;
  for (let i = 0; i < 5; i++) { ctx.rotate((Math.PI * 2) / 5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r * 0.56, 0); ctx.stroke(); }
  ctx.restore();
}

// Low wedge supercar, nose pointing +x. x is the centre, y the ground. door: 0 closed .. 1 scissor door fully up.
function supercar(ctx, x, y, o = {}) {
  const s = o.s ?? 1; const color = o.color ?? ACCENT; const door = o.door ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (o.lights) {
    const g = ctx.createLinearGradient(300, 0, 900, 0);
    g.addColorStop(0, 'rgba(255,240,190,0.55)'); g.addColorStop(1, 'rgba(255,240,190,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(300, -78); ctx.lineTo(900, -150); ctx.lineTo(900, 0); ctx.lineTo(300, -52); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.beginPath(); ctx.ellipse(0, 4, 330, 16, 0, 0, Math.PI * 2); ctx.fill();
  // body
  ctx.fillStyle = color; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-318, -40); ctx.lineTo(-322, -92); ctx.lineTo(-250, -118); ctx.lineTo(-150, -166); ctx.lineTo(10, -170);
  ctx.lineTo(150, -112); ctx.lineTo(300, -84); ctx.lineTo(326, -58); ctx.lineTo(322, -34); ctx.lineTo(-318, -34); ctx.closePath();
  ctx.fill(); ctx.stroke();
  // window
  ctx.fillStyle = '#20242c';
  ctx.beginPath(); ctx.moveTo(-140, -156); ctx.lineTo(4, -160); ctx.lineTo(112, -116); ctx.lineTo(-170, -116); ctx.closePath(); ctx.fill(); ctx.stroke();
  // side intake and stripe
  ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-232, -98); ctx.lineTo(-176, -104); ctx.lineTo(-192, -62); ctx.lineTo(-236, -62); ctx.closePath(); ctx.fill();
  ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-160, -62); ctx.lineTo(210, -62); ctx.stroke();
  // lamps
  ctx.fillStyle = '#fff3c4'; ctx.beginPath(); ctx.moveTo(250, -88); ctx.lineTo(306, -78); ctx.lineTo(300, -66); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e02b2b'; ctx.fillRect(-322, -90, 10, 26);
  // scissor door swings up around its front hinge
  ctx.save(); ctx.translate(96, -112); ctx.rotate(-rad(62) * ease(door));
  ctx.fillStyle = color; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-250, -2); ctx.lineTo(-236, 62); ctx.lineTo(-14, 62); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
  wheel(ctx, -205, -42, 50, o.spin ?? 0); wheel(ctx, 210, -42, 50, o.spin ?? 0);
  ctx.restore();
}

// ---- buildings and interiors ------------------------------------------
function restaurantFront(ctx, x, groundY, name = 'LUMIÈRE', glow = 1) {
  ctx.save(); ctx.translate(x, groundY);
  ctx.fillStyle = '#2b2233'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.fillRect(-520, -640, 1040, 640); ctx.strokeRect(-520, -640, 1040, 640);
  // awning
  ctx.fillStyle = '#8c1c2c'; ctx.beginPath(); ctx.moveTo(-560, -430); ctx.lineTo(560, -430); ctx.lineTo(520, -520); ctx.lineTo(-520, -520); ctx.closePath(); ctx.fill(); ctx.stroke();
  // windows with warm light
  for (const wx of [-430, 150]) {
    ctx.fillStyle = `rgba(255,206,120,${0.92 * glow})`; ctx.fillRect(wx, -390, 280, 250); ctx.strokeRect(wx, -390, 280, 250);
    ctx.beginPath(); ctx.moveTo(wx + 140, -390); ctx.lineTo(wx + 140, -140); ctx.stroke();
  }
  // door
  ctx.fillStyle = '#4a2f1d'; ctx.fillRect(-110, -400, 220, 400); ctx.strokeRect(-110, -400, 220, 400);
  ctx.fillStyle = '#e8c36a'; ctx.beginPath(); ctx.arc(70, -200, 10, 0, Math.PI * 2); ctx.fill();
  text(ctx, name, 0, -574, { size: 76, weight: 800, color: '#ffe2a0', letterSpacing: 14 });
  ctx.restore();
}

function box(ctx, x, y, w, h) {
  ctx.fillStyle = '#c99a5b'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.fillRect(x - w / 2, y - h, w, h); ctx.strokeRect(x - w / 2, y - h, w, h);
  ctx.fillStyle = '#a97a3f'; ctx.fillRect(x - 12, y - h, 24, h);
}

// Big phone screen overlay; draw(ctx, w, h) paints the screen content.
function phone(ctx, cx, cy, k, draw) {
  if (k <= 0) return;
  const w = 430; const h = 760;
  ctx.save(); ctx.translate(cx, cy + (1 - easeOut(k)) * 900); ctx.rotate(rad(-4) * (1 - easeOut(k)));
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; roundRect(ctx, -w / 2 + 16, -h / 2 + 22, w, h, 54); ctx.fill();
  ctx.fillStyle = INK; roundRect(ctx, -w / 2, -h / 2, w, h, 54); ctx.fill();
  ctx.fillStyle = '#ffffff'; roundRect(ctx, -w / 2 + 18, -h / 2 + 18, w - 36, h - 36, 38); ctx.fill();
  ctx.save(); ctx.clip(); ctx.translate(-w / 2 + 18, -h / 2 + 18); draw(ctx, w - 36, h - 36); ctx.restore();
  ctx.fillStyle = INK; roundRect(ctx, -60, -h / 2 + 30, 120, 26, 13); ctx.fill();
  ctx.restore();
}

// Fade the whole frame toward a colour (scene transitions).
function fade(ctx, k, color = '#000000') {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(k); ctx.fillStyle = color; ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Slow push-in / pan: wraps a draw call in a camera transform.
function camera(ctx, zoom, cx, cy, draw) {
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy); draw(); ctx.restore();
}

module.exports = {
  W, H, INK, PAPER, ACCENT, FONT, clamp, lerp, ease, easeOut, prog, between, rad, rnd,
  POSES, lerpPose, walkPose, figure, text, roundRect, bubble, caption, background, ground, stars, rain,
  skyline, wheel, supercar, restaurantFront, box, phone, fade, camera,
};
