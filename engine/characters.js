// Character system for the transformation-story channel.
// One rig, many characters: a solid black round head with white eyes, a coloured outfit, thin black limbs.
// drawCharacter(ctx, spec, opts) draws a front-facing figure standing with its feet at (opts.x, opts.y).

const BLACK = '#111114';
// Skin and eye colour of the character being drawn; set from the spec (c.skin, c.eye) on each draw call.
let SKIN = BLACK;
let EYE = '#ffffff';
let GLOW = false;
function usePalette(c) { SKIN = c.skin ?? BLACK; EYE = c.eye ?? '#ffffff'; GLOW = !!c.eyeGlow; }
const rad = (d) => (d * Math.PI) / 180;

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v) => Math.max(0, Math.min(255, Math.round(f < 0 ? v * (1 + f) : v + (255 - v) * f)));
  return `rgb(${ch(n >> 16)},${ch((n >> 8) & 255)},${ch(n & 255)})`;
}

// ---- expressions and poses ---------------------------------------------
const EXPRESSIONS = {
  neutral: { eyes: 'open', mouth: 'flat' },
  happy: { eyes: 'happy', mouth: 'grin' },
  smile: { eyes: 'open', mouth: 'smile' },
  sad: { eyes: 'sad', mouth: 'frown' },
  cry: { eyes: 'sad', mouth: 'frown', tear: true },
  tired: { eyes: 'tired', mouth: 'flat', bags: true },
  shock: { eyes: 'shock', mouth: 'open' },
  angry: { eyes: 'angry', mouth: 'frown' },
  determined: { eyes: 'angry', mouth: 'flat' },
  smug: { eyes: 'smug', mouth: 'smirk' },
  laugh: { eyes: 'happy', mouth: 'grin' },
  worried: { eyes: 'sad', mouth: 'open', sweat: true },
};

// Arm and leg angles are degrees from "hanging straight down", positive = outward from the body.
// Each limb is [upper, bend]; the lower segment points at upper + bend.
const POSES = {
  stand: { lean: 0, tilt: 0, armL: [8, 4], armR: [8, 4], legL: [5, 0], legR: [5, 0] },
  slump: { lean: 0, tilt: 9, drop: 10, armL: [3, 2], armR: [3, 2], legL: [4, 0], legR: [4, 0] },
  power: { lean: 0, tilt: -3, armL: [40, -110], armR: [40, -110], legL: [11, 0], legR: [11, 0] },
  crossed: { lean: 0, tilt: 3, armL: [22, -104], armR: [18, -98], legL: [6, 0], legR: [6, 0] },
  wave: { lean: 0, tilt: -4, armL: [8, 4], armR: [148, 24], legL: [5, 0], legR: [5, 0] },
  point: { lean: 0, tilt: -5, armL: [8, 4], armR: [84, 4], legL: [7, 0], legR: [7, 0] },
  phone: { lean: 0, tilt: 8, armL: [8, 4], armR: [22, -132], legL: [5, 0], legR: [5, 0] },
  cheer: { lean: 0, tilt: -6, armL: [150, 16], armR: [150, 16], legL: [10, 0], legR: [10, 0] },
  shrug: { lean: 0, tilt: 6, armL: [50, 62], armR: [50, 62], legL: [6, 0], legR: [6, 0] },
  hipHand: { lean: 0, tilt: 5, armL: [8, 4], armR: [40, -110], legL: [8, 0], legR: [4, 0] },
};

// ---- head --------------------------------------------------------------
const HEAD_R = 62;

function eye(ctx, x, y, side, kind) {
  const big = kind === 'shock';
  if (GLOW) { ctx.save(); ctx.shadowColor = EYE; ctx.shadowBlur = 26; ctx.fillStyle = EYE; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.ellipse(x, y + 4, 9, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.save();
  ctx.beginPath(); ctx.ellipse(x, y, big ? 19 : 14, big ? 23 : 19, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = EYE; ctx.fillRect(x - 32, y - 32, 64, 64);
  ctx.fillStyle = SKIN; ctx.beginPath();
  if (kind === 'happy') ctx.ellipse(x, y + 17, 24, 19, 0, 0, Math.PI * 2);
  else if (kind === 'tired') ctx.rect(x - 32, y - 32, 64, 30);
  else if (kind === 'smug') ctx.rect(x - 32, y - 32, 64, 25);
  else if (kind === 'shock') ctx.arc(x, y, 5, 0, Math.PI * 2);
  else if (kind === 'sad' || kind === 'angry') {
    // a slanted eyelid: low on the outside for sad, low on the inside for angry
    const out = kind === 'sad' ? side : -side;
    ctx.moveTo(x - 32, y - 32); ctx.lineTo(x + 32, y - 32);
    ctx.lineTo(x + 32, y + (out > 0 ? 3 : -15)); ctx.lineTo(x - 32, y + (out > 0 ? -15 : 3)); ctx.closePath();
  }
  ctx.fill();
  ctx.restore();
}

function mouth(ctx, x, y, kind, color = '#ffffff') {
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  if (kind === 'smile') { ctx.arc(x, y - 9, 16, rad(25), rad(155)); ctx.stroke(); }
  else if (kind === 'frown') { ctx.arc(x, y + 12, 14, rad(205), rad(335)); ctx.stroke(); }
  else if (kind === 'open') { ctx.ellipse(x, y + 2, 8, 11, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (kind === 'grin') { ctx.arc(x, y - 7, 18, 0, Math.PI); ctx.closePath(); ctx.fill(); }
  else if (kind === 'smirk') { ctx.moveTo(x - 12, y + 2); ctx.quadraticCurveTo(x + 4, y + 8, x + 15, y - 6); ctx.stroke(); }
  else if (kind === 'flat') { ctx.moveTo(x - 11, y); ctx.lineTo(x + 11, y); ctx.stroke(); }
  ctx.restore();
}

// Draws the head centred on (hx, hy). look is -1..1 (which way the face is turned).
function drawHead(ctx, c, hx, hy, exprName = 'neutral', look = 0) {
  const e = EXPRESSIONS[exprName] ?? EXPRESSIONS.neutral;
  usePalette(c);
  const hair = c.hair ?? {};
  const R = HEAD_R;
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // hair that sits behind the head
  if (hair.type === 'long') {
    // two side locks falling past the shoulders, so the chin stays clear
    ctx.fillStyle = hair.color;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.roundRect(hx + s * (R - 8) - 24, hy - R + 4, 48, R * 2 + 62, 24); ctx.fill(); }
  }
  if (hair.type === 'pony') {
    ctx.strokeStyle = hair.color; ctx.lineWidth = 30; ctx.beginPath();
    ctx.moveTo(hx - 30, hy - R + 6); ctx.quadraticCurveTo(hx - R - 46, hy - 10, hx - R - 14, hy + 78); ctx.stroke();
  }
  if (c.acc?.includes('headphones')) {
    ctx.strokeStyle = c.accent ?? '#ff7a1a'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(hx, hy, R + 6, rad(200), rad(340)); ctx.stroke();
  }

  ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(hx, hy, R, 0, Math.PI * 2); ctx.fill();

  // hair on top of the head
  const cap = (a0, a1, extra = 3) => { ctx.beginPath(); ctx.arc(hx, hy, R + extra, rad(a0), rad(a1)); ctx.closePath(); ctx.fill(); };
  ctx.fillStyle = hair.color ?? SKIN;
  if (hair.type === 'tuft') {
    ctx.fillStyle = SKIN;
    for (const [dx, h, w] of [[-20, 22, 15], [2, 34, 16], [24, 20, 14]]) {
      ctx.beginPath(); ctx.moveTo(hx + dx - w, hy - R + 12); ctx.quadraticCurveTo(hx + dx + 4, hy - R - h - 10, hx + dx + 10, hy - R - h); ctx.quadraticCurveTo(hx + dx + 8, hy - R - 6, hx + dx + w, hy - R + 12); ctx.closePath(); ctx.fill();
    }
  } else if (hair.type === 'short') cap(212, 328);
  else if (hair.type === 'slick') cap(214, 336, 2);
  else if (hair.type === 'long' || hair.type === 'pony') cap(208, 332, 4);
  else if (hair.type === 'bun') { cap(210, 330); ctx.beginPath(); ctx.arc(hx, hy - R - 14, 24, 0, Math.PI * 2); ctx.fill(); }
  else if (hair.type === 'curly') {
    for (let a = 205; a <= 335; a += 18.5) { ctx.beginPath(); ctx.arc(hx + Math.cos(rad(a)) * (R - 2), hy + Math.sin(rad(a)) * (R - 2), 19, 0, Math.PI * 2); ctx.fill(); }
  }
  if (hair.beard) { ctx.fillStyle = hair.beard; ctx.beginPath(); ctx.arc(hx, hy, R + 2, rad(18), rad(162)); ctx.closePath(); ctx.fill(); }

  // hats
  if (c.acc?.includes('cap')) {
    ctx.fillStyle = c.accent ?? '#ff7a1a'; ctx.beginPath(); ctx.arc(hx, hy, R + 5, rad(207), rad(333)); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.roundRect(hx + (look >= 0 ? 6 : -R - 36), hy - 40, R + 30, 14, 7); ctx.fill();
  }
  if (c.acc?.includes('beanie')) {
    ctx.fillStyle = c.accent ?? '#ff7a1a'; ctx.beginPath(); ctx.arc(hx, hy, R + 6, rad(205), rad(335)); ctx.closePath(); ctx.fill();
    ctx.fillStyle = shade(c.accent ?? '#ff7a1a', -0.2); ctx.beginPath(); ctx.roundRect(hx - R - 2, hy - 46, (R + 2) * 2, 22, 10); ctx.fill();
  }
  if (c.acc?.includes('headphones')) {
    ctx.fillStyle = c.accent ?? '#ff7a1a';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.roundRect(hx + s * (R + 2) - 11, hy - 20, 22, 44, 9); ctx.fill(); }
  }
  if (c.acc?.includes('earrings')) {
    ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 5;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(hx + s * (R - 4), hy + 44, 9, 0, Math.PI * 2); ctx.stroke(); }
  }

  // face
  const fx = hx + look * 9; const fy = hy - 2;
  eye(ctx, fx - 24, fy, -1, e.eyes); eye(ctx, fx + 24, fy, 1, e.eyes);
  if (e.bags) {
    ctx.strokeStyle = '#7d7d8c'; ctx.lineWidth = 4;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(fx + s * 24, fy + 6, 20, rad(35), rad(145)); ctx.stroke(); }
  }
  if (c.acc?.includes('glasses')) {
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(fx + s * 24, fy, 24, 0, Math.PI * 2); ctx.stroke(); }
  }
  mouth(ctx, fx, hy + 36, e.mouth, hair.beard ? BLACK : EYE); // dark mouth reads on a beard
  if (e.tear) { ctx.fillStyle = '#6ec6ff'; ctx.beginPath(); ctx.moveTo(fx - 24, fy + 20); ctx.quadraticCurveTo(fx - 36, fy + 40, fx - 24, fy + 44); ctx.quadraticCurveTo(fx - 12, fy + 40, fx - 24, fy + 20); ctx.fill(); }
  if (e.sweat) { ctx.fillStyle = '#6ec6ff'; ctx.beginPath(); ctx.moveTo(hx + R - 6, hy - 44); ctx.quadraticCurveTo(hx + R - 20, hy - 20, hx + R - 6, hy - 14); ctx.quadraticCurveTo(hx + R + 8, hy - 20, hx + R - 6, hy - 44); ctx.fill(); }
  ctx.restore();
}

// ---- body --------------------------------------------------------------
const B = { thigh: 78, shin: 78, torso: 150, upArm: 72, foreArm: 68, shoulderX: 48, shoulderY: -138 };

function seg(x, y, side, limb, l1, l2) {
  const a1 = rad(limb[0]) * side; const a2 = rad(limb[0] + limb[1]) * side;
  const mx = x + Math.sin(a1) * l1; const my = y + Math.cos(a1) * l1;
  return { mx, my, ex: mx + Math.sin(a2) * l2, ey: my + Math.cos(a2) * l2 };
}

function stroke(ctx, pts, color, width) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
  ctx.stroke();
}

function drawArm(ctx, c, side, limb) {
  const top = c.top; const a = seg(side * B.shoulderX, B.shoulderY, side, limb, B.upArm, B.foreArm);
  const sx = side * B.shoulderX;
  if (top.sleeves === 'short') {
    stroke(ctx, [[sx, B.shoulderY], [a.mx, a.my], [a.ex, a.ey]], SKIN, 15);
    stroke(ctx, [[sx, B.shoulderY], [(sx + a.mx) / 2, (B.shoulderY + a.my) / 2]], top.color, 32);
  } else {
    stroke(ctx, [[sx, B.shoulderY], [a.mx, a.my], [a.ex, a.ey]], top.color, 30);
  }
  ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(a.ex, a.ey, 15, 0, Math.PI * 2); ctx.fill();
  if (c.acc?.includes('watch') && side === -1) {
    const wx = a.mx + (a.ex - a.mx) * 0.8; const wy = a.my + (a.ey - a.my) * 0.8;
    ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(wx, wy, 13, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff7dc'; ctx.beginPath(); ctx.arc(wx, wy, 6, 0, Math.PI * 2); ctx.fill();
  }
  return a;
}

function drawTorso(ctx, c) {
  const t = c.top; const T = -B.torso;
  ctx.fillStyle = t.color; ctx.beginPath();
  ctx.moveTo(-34, T - 6); ctx.quadraticCurveTo(-58, T - 4, -56, T + 22);
  if (t.type === 'dress') { ctx.lineTo(-46, -20); ctx.lineTo(-78, 74); ctx.quadraticCurveTo(0, 90, 78, 74); ctx.lineTo(46, -20); }
  else { ctx.lineTo(-45, 4); ctx.quadraticCurveTo(0, 20, 45, 4); }
  ctx.lineTo(56, T + 22); ctx.quadraticCurveTo(58, T - 4, 34, T - 6); ctx.closePath(); ctx.fill();

  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (t.type === 'hoodie') {
    ctx.fillStyle = shade(t.color, -0.22); ctx.beginPath(); ctx.roundRect(-30, -52, 60, 34, 12); ctx.fill();
    stroke(ctx, [[-13, T + 2], [-13, T + 38]], '#ffffff', 5); stroke(ctx, [[13, T + 2], [13, T + 38]], '#ffffff', 5);
  } else if (t.type === 'blazer') {
    ctx.fillStyle = t.shirt ?? '#ffffff'; ctx.beginPath(); ctx.moveTo(-20, T - 6); ctx.lineTo(20, T - 6); ctx.lineTo(0, T + 74); ctx.closePath(); ctx.fill();
    stroke(ctx, [[-22, T - 6], [0, T + 76], [22, T - 6]], shade(t.color, -0.3), 7);
    if (t.tie) { ctx.fillStyle = t.tie; ctx.beginPath(); ctx.moveTo(0, T - 2); ctx.lineTo(10, T + 12); ctx.lineTo(4, T + 62); ctx.lineTo(0, T + 70); ctx.lineTo(-4, T + 62); ctx.lineTo(-10, T + 12); ctx.closePath(); ctx.fill(); }
  } else if (t.type === 'turtleneck') {
    ctx.fillStyle = shade(t.color, 0.14); ctx.beginPath(); ctx.roundRect(-24, T - 20, 48, 24, 9); ctx.fill();
  } else if (t.type === 'shirt') {
    stroke(ctx, [[0, T + 2], [0, 6]], shade(t.color, -0.18), 4);
    ctx.fillStyle = shade(t.color, 0.25); ctx.beginPath(); ctx.moveTo(-22, T - 8); ctx.lineTo(0, T + 16); ctx.lineTo(22, T - 8); ctx.closePath(); ctx.fill();
    if (t.tie) { ctx.fillStyle = t.tie; ctx.beginPath(); ctx.moveTo(0, T + 6); ctx.lineTo(9, T + 18); ctx.lineTo(4, T + 70); ctx.lineTo(0, T + 78); ctx.lineTo(-4, T + 70); ctx.lineTo(-9, T + 18); ctx.closePath(); ctx.fill(); }
  } else if (t.type === 'tee' && t.print) {
    ctx.fillStyle = t.print; ctx.beginPath(); ctx.arc(0, T + 58, 17, 0, Math.PI * 2); ctx.fill();
  } else if (t.type === 'cardigan') {
    ctx.fillStyle = t.shirt ?? '#ffffff'; ctx.beginPath(); ctx.roundRect(-15, T - 6, 30, B.torso + 6, 6); ctx.fill();
  }
  if (c.acc?.includes('chain')) { ctx.strokeStyle = '#f2c14e'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, T - 4, 26, rad(20), rad(160)); ctx.stroke(); }
  if (c.acc?.includes('badge')) { ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(18, T + 30, 22, 28, 4); ctx.fill(); }
}

// opts: x, y (feet), s (scale), pose (name or object), expr, look (-1..1), flip
function drawCharacter(ctx, c, opts = {}) {
  const p = typeof opts.pose === 'string' ? POSES[opts.pose] : (opts.pose ?? POSES.stand);
  usePalette(c);
  const s = opts.s ?? 1;
  const hipH = Math.max(
    B.thigh * Math.cos(rad(p.legL[0])) + B.shin * Math.cos(rad(p.legL[0] + p.legL[1])),
    B.thigh * Math.cos(rad(p.legR[0])) + B.shin * Math.cos(rad(p.legR[0] + p.legR[1])),
  ) - (p.drop ?? 0);

  ctx.save();
  ctx.translate(opts.x ?? 0, opts.y ?? 0); ctx.scale(s * (opts.flip ? -1 : 1), s);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.beginPath(); ctx.ellipse(0, 6, 92, 13, 0, 0, Math.PI * 2); ctx.fill();

  // legs
  const dress = c.top.type === 'dress';
  for (const [side, limb] of [[-1, p.legL], [1, p.legR]]) {
    const l = seg(side * 22, -hipH, side, limb, B.thigh, B.shin);
    stroke(ctx, [[side * 22, -hipH], [l.mx, l.my], [l.ex, l.ey - 8]], dress ? SKIN : c.pants, dress ? 15 : 30);
    ctx.fillStyle = c.shoes ?? '#ffffff'; ctx.beginPath(); ctx.ellipse(l.ex + side * 10, l.ey - 4, 27, 14, 0, 0, Math.PI * 2); ctx.fill();
  }

  // upper body leans around the hips
  ctx.translate(0, -hipH); ctx.rotate(rad(p.lean ?? 0));
  if (c.top.type === 'hoodie') { ctx.fillStyle = shade(c.top.color, -0.25); ctx.beginPath(); ctx.ellipse(0, -B.torso - 12, 56, 30, 0, 0, Math.PI * 2); ctx.fill(); }
  stroke(ctx, [[0, -B.torso + 6], [0, -B.torso - 30]], SKIN, 16); // neck
  drawTorso(ctx, c);
  drawArm(ctx, c, -1, p.armL);
  const hand = drawArm(ctx, c, 1, p.armR);
  if (opts.prop === 'phone') { ctx.fillStyle = '#2b2f3a'; ctx.beginPath(); ctx.roundRect(hand.ex - 16, hand.ey - 40, 32, 54, 7); ctx.fill(); ctx.fillStyle = '#9fd8ff'; ctx.beginPath(); ctx.roundRect(hand.ex - 12, hand.ey - 35, 24, 42, 4); ctx.fill(); }

  // head tilts around the neck
  ctx.translate(0, -B.torso); ctx.rotate(rad(p.tilt ?? 0));
  drawHead(ctx, c, 0, -70, opts.expr ?? 'neutral', opts.look ?? 0);
  ctx.restore();
}

// ---- the cast ----------------------------------------------------------
// The hero keeps the same hair tuft and orange accent in both versions so viewers always recognise him.
const CAST = {
  heroBefore: {
    name: 'KAI', role: 'Before: broke, tired, stuck',
    hair: { type: 'tuft' }, eye: '#39ff14', eyeGlow: true, top: { type: 'hoodie', color: '#8b919c' }, pants: '#5d6470', shoes: '#d9d4c7',
  },
  heroAfter: {
    name: 'KAI', role: 'After: built it himself',
    hair: { type: 'tuft' }, eye: '#39ff14', eyeGlow: true, top: { type: 'blazer', color: '#1f2a44', shirt: '#ff7a1a' }, pants: '#1f2a44', shoes: '#ffffff',
    acc: ['watch'],
  },
  ex: {
    name: 'MAYA', role: 'The ex. Left him when he was broke.',
    hair: { type: 'long', color: '#8a4b2a' }, top: { type: 'dress', color: '#d6336c' }, shoes: '#d6336c', acc: ['earrings'],
  },
  friend: {
    name: 'DEX', role: 'The "friend" who laughs at the idea.',
    hair: { type: 'short', color: '#3b3b46' }, top: { type: 'tee', color: '#2f9e44', sleeves: 'short', print: '#ffffff' }, pants: '#3a4a6b', shoes: '#ffffff',
    acc: ['cap', 'chain'], accent: '#e03131',
  },
  boss: {
    name: 'MR. GRAVES', role: 'The boss. "You will never be more than this."',
    hair: { type: 'slick', color: '#b9bcc4' }, top: { type: 'blazer', color: '#4a4f5a', shirt: '#ffffff', tie: '#a61e4d' }, pants: '#4a4f5a', shoes: '#22252b',
    acc: ['glasses'],
  },
  mom: {
    name: 'MOM', role: 'Loves him. Begs him to get a real job.',
    hair: { type: 'bun', color: '#c9c3bd' }, top: { type: 'cardigan', color: '#7c5cbf', shirt: '#f3e9ff' }, pants: '#6b5d54', shoes: '#f3e9ff',
    acc: ['glasses'],
  },
  uncle: {
    name: 'UNCLE RAY', role: 'Family critic at every dinner.',
    hair: { type: 'short', color: '#6e5a48', beard: '#6e5a48' }, top: { type: 'shirt', color: '#c2702b', sleeves: 'short' }, pants: '#5a4634', shoes: '#3a2c20',
  },
  believer: {
    name: 'SAM', role: 'The one friend who believes. First customer.',
    hair: { type: 'curly', color: '#2b2b33' }, top: { type: 'hoodie', color: '#1c7ed6' }, pants: '#343a40', shoes: '#ffffff',
    acc: ['headphones'], accent: '#ffd43b',
  },
  mentor: {
    name: 'THE MENTOR', role: 'The creator in the video that starts it all.',
    hair: { type: 'bald', beard: '#d9d9de' }, top: { type: 'turtleneck', color: '#16181d' }, pants: '#2b2f3a', shoes: '#ffffff',
    acc: ['watch'],
  },
};

module.exports = { BLACK, EXPRESSIONS, POSES, CAST, HEAD_R, shade, drawHead, drawCharacter };
