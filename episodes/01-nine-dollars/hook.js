// Chapter 1 (the hook) of episode 01, cut to a voiceover.
// Usage: node episodes/01-nine-dollars/hook.js <charliee|noah>   ->  out/hook-<voice>.mp4
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync } = require('child_process');
const { createCanvas } = require('@napi-rs/canvas');
const { CAST, drawCharacter, drawHead } = require('../../engine/characters');

const W = 1920; const H = 1080; const FPS = 30;
const GREEN = '#39ff14';

// When each sentence starts in each voiceover (seconds), measured from the pauses in the audio.
// laugh, boss, ex, uncle, months, tonight, hours, end of speech
const CUES = {
  charliee: [0, 2.97, 3.99, 5.01, 6.18, 10.11, 13.01, 15.75],
  noah: [0, 3.29, 4.18, 5.07, 6.52, 10.83, 13.98, 17.2],
};
const voice = process.argv[2] ?? 'charliee';
const cue = CUES[voice];
if (!cue) throw new Error(`unknown voice ${voice}`);
const TITLE_AT = cue[7] + 0.15; // title slams in right after the last word
const END = TITLE_AT + 2.2;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = (k) => k * k * (3 - 2 * k);
const pop = (k) => { k = clamp(k); return k === 0 ? 0 : 1 + Math.sin(k * Math.PI) * 0.18 * (1 - k) - Math.pow(1 - k, 3); };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

function radial(ctx, cx, cy, r, inner, outer) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
function text(ctx, str, x, y, size, color, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 900} ${size}px ${o.font ?? 'Inter'}`;
  ctx.textAlign = o.align ?? 'center'; ctx.textBaseline = 'middle'; ctx.letterSpacing = `${o.spacing ?? 0}px`;
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.strokeWidth ?? 16; ctx.strokeStyle = o.stroke; ctx.strokeText(str, x, y); }
  ctx.fillStyle = color; ctx.fillText(str, x, y); ctx.restore();
}
// scale the whole frame around its centre (push-ins and punch cuts)
function zoom(ctx, z, draw) { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); draw(); ctx.restore(); }

// ---- shot 1: they laughed ------------------------------------------------
function shotLaugh(ctx, t, d) {
  zoom(ctx, 1 + 0.07 * (t / d), () => {
    radial(ctx, W / 2, 520, 1100, '#8e2136', '#2a070f');
    const heads = [[CAST.boss, 520, 560, 0.12], [CAST.ex, 960, 470, 0.5], [CAST.uncle, 1400, 560, 0.88]];
    heads.forEach(([c, x, y, at], i) => {
      const k = pop(prog(t, at, at + 0.28)); if (k <= 0) return;
      const bob = Math.abs(Math.sin((t - at) * 11 + i)) * 26;
      ctx.save(); ctx.translate(x, y - bob); ctx.scale(2.3 * k, 2.3 * k); ctx.rotate(Math.sin((t - at) * 11 + i) * 0.06);
      drawHead(ctx, c, 0, 0, 'laugh', 0); ctx.restore();
    });
    // floating HA HA
    for (let i = 0; i < 9; i++) {
      const at = 0.3 + i * 0.26; const life = prog(t, at, at + 0.9); if (life <= 0 || life >= 1) continue;
      ctx.save(); ctx.globalAlpha = 1 - life; ctx.translate(200 + rnd(i) * 1520, 300 + rnd(i + 5) * 380 - life * 90); ctx.rotate((rnd(i + 9) - 0.5) * 0.6);
      text(ctx, 'HA', 0, 0, 70 + rnd(i + 2) * 60, '#ffffff'); ctx.restore();
    }
  });
  const k = pop(prog(t, 0.25, 0.55));
  if (k > 0) { ctx.save(); ctx.translate(W / 2, 930); ctx.scale(k, k); text(ctx, 'THEY LAUGHED.', 0, 0, 120, '#ffffff', { stroke: '#16060a', spacing: 4 }); ctx.restore(); }
}

// ---- shot 2: boss / ex / uncle -------------------------------------------
function shotDoubter(ctx, t, c, label, bg, pose, flip) {
  const z = 1 + 0.22 * (1 - ease(prog(t, 0, 0.16))) + 0.03 * t; // punch in, then drift
  zoom(ctx, z, () => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // speed lines
    ctx.save(); ctx.globalAlpha = 0.16; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 10;
    for (let i = 0; i < 16; i++) { const y = rnd(i + 30) * H; const x = ((rnd(i + 60) * 2600 + t * 2600) % 2600) - 340; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 260, y); ctx.stroke(); }
    ctx.restore();
    drawCharacter(ctx, c, { x: flip ? 620 : 1300, y: 1330, s: 2.35, pose, expr: 'smug', flip });
  });
  const k = pop(prog(t, 0.04, 0.26));
  ctx.save(); ctx.translate(flip ? 1320 : 600, 500); ctx.scale(k, k); ctx.rotate(-0.04);
  text(ctx, 'YOUR', 0, -110, 110, '#16161a', { spacing: 6 }); text(ctx, label, 0, 40, 200, '#ffffff', { stroke: '#16161a', strokeWidth: 22 }); ctx.restore();
}

// ---- shot 3: eighteen months from now -------------------------------------
function shotFuture(ctx, t, d) {
  const snap = d * 0.42; const open = t >= snap;
  zoom(ctx, 1 + 0.1 * ease(t / d), () => {
    radial(ctx, W / 2, 430, 1050, open ? '#3d5aa8' : '#2a3a6e', '#080b18');
    const giant = { ...CAST.heroAfter, top: { type: 'blazer', color: '#0b0d14', shirt: '#0b0d14' }, pants: '#0b0d14', shoes: '#0b0d14', acc: [], eye: open ? GREEN : '#111114', eyeGlow: open };
    drawCharacter(ctx, giant, { x: W / 2, y: 1560, s: 2.5, pose: 'power', expr: 'determined' });
    // the three doubters, now small, looking up
    [[CAST.boss, 300], [CAST.ex, 520], [CAST.uncle, 1560]].forEach(([c, x], i) => {
      const shake = open ? Math.sin(t * 40 + i) * 4 * (1 - prog(t, snap, snap + 0.5)) : 0;
      drawCharacter(ctx, c, { x: x + shake, y: 1050, s: 0.62, pose: open ? 'shrug' : 'stand', expr: open ? 'shock' : 'neutral' });
    });
  });
  // green flash when the eyes open
  const f = 1 - prog(t, snap, snap + 0.35);
  if (open && f > 0) { ctx.save(); ctx.globalAlpha = f * 0.55; ctx.fillStyle = GREEN; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  const k = pop(prog(t, 0.05, 0.3));
  ctx.save(); ctx.translate(W / 2, 120); ctx.scale(k, k); text(ctx, '18 MONTHS FROM NOW', 0, 0, 84, '#ffffff', { stroke: '#080b18', spacing: 8 }); ctx.restore();
}

// ---- shot 4: tonight, forty-three dollars ---------------------------------
function shotTonight(ctx, t, d) {
  zoom(ctx, 1.06 - 0.06 * ease(t / d), () => {
    radial(ctx, 900, 900, 1200, '#3a4f7a', '#090b14');
    // phone light from below
    const g = ctx.createRadialGradient(900, 1120, 0, 900, 1120, 760);
    g.addColorStop(0, 'rgba(170,215,255,0.55)'); g.addColorStop(1, 'rgba(170,215,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    drawCharacter(ctx, CAST.heroBefore, { x: 900, y: 1540, s: 2.7, pose: 'phone', expr: 'tired', prop: 'phone' });
  });
  // balance counter drains to $43.18
  const k = pop(prog(t, 0.1, 0.36)); if (k <= 0) return;
  const val = 43.18 + (212.4 - 43.18) * (1 - ease(prog(t, 0.2, 1.1)));
  ctx.save(); ctx.translate(1500, 250); ctx.scale(k, k); ctx.rotate(0.03);
  ctx.fillStyle = '#0d1018'; ctx.beginPath(); ctx.roundRect(-330, -150, 660, 300, 40); ctx.fill();
  ctx.strokeStyle = '#ff4d4d'; ctx.lineWidth = 8; ctx.stroke();
  text(ctx, 'BALANCE', 0, -82, 46, '#9aa3b5', { spacing: 10, weight: 700 });
  text(ctx, `$${val.toFixed(2)}`, 0, 34, 150, '#ff4d4d', { font: 'JetBrains Mono', weight: 800 });
  ctx.restore();
}

// ---- shot 5: nine hours, then the title -----------------------------------
function shotClock(ctx, t, d) {
  radial(ctx, W / 2, 480, 1100, '#27325c', '#0a0d1a');
  const k = ease(prog(t, 0.1, d - 0.2)); const hours = 23 + 9 * k; // 11pm -> 8am
  const cx = W / 2; const cy = 470; const r = 310;
  ctx.fillStyle = '#f4efe6'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#111114'; ctx.lineWidth = 22; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ctx.lineWidth = i % 3 ? 8 : 16; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * (r - 30), cy - Math.cos(a) * (r - 30)); ctx.lineTo(cx + Math.sin(a) * (r - 68), cy - Math.cos(a) * (r - 68)); ctx.stroke(); }
  const hand = (frac, len, w, col) => { const a = frac * Math.PI * 2; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len); ctx.stroke(); };
  hand((hours % 12) / 12, 160, 24, '#111114'); hand(hours % 1, 240, 14, '#ff4d4d');
  ctx.fillStyle = '#111114'; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fill();
  const h24 = Math.floor(hours) % 24; const mins = Math.floor((hours % 1) * 60);
  const label = `${((h24 + 11) % 12) + 1}:${String(mins).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
  text(ctx, label, cx, 900, 130, '#ffffff', { font: 'JetBrains Mono', weight: 800 });
  text(ctx, `${Math.max(0, 9 - 9 * k).toFixed(0)} HOURS LEFT`, cx, 1000, 50, '#ff4d4d', { spacing: 10, weight: 800 });
}

function shotTitle(ctx, t) {
  const k = prog(t, 0, 0.22); const s = 3.2 - 2.2 * ease(k);
  const shake = (1 - prog(t, 0.2, 0.75)) * (t > 0.2 ? 22 : 0);
  ctx.fillStyle = '#07080c'; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate(W / 2 + Math.sin(t * 90) * shake, H / 2 + Math.cos(t * 70) * shake); ctx.scale(s, s); ctx.globalAlpha = clamp(k * 2);
  // lay the three words out from their measured widths so they never collide
  const words = [['THE', 200, '#ffffff'], ['$9', 300, GREEN], ['IDEA', 200, '#ffffff']];
  const widths = words.map(([w, size]) => { ctx.font = `900 ${size}px Inter`; return ctx.measureText(w).width; });
  const gap = 56; let x = -(widths.reduce((a, b) => a + b, 0) + gap * 2) / 2;
  words.forEach(([w, size, color], i) => {
    ctx.save(); if (color === GREEN) { ctx.shadowColor = GREEN; ctx.shadowBlur = 60; }
    text(ctx, w, x + widths[i] / 2, 0, size, color); ctx.restore();
    x += widths[i] + gap;
  });
  ctx.restore();
  const f = 1 - prog(t, 0.2, 0.5); if (t > 0.2 && f > 0) { ctx.save(); ctx.globalAlpha = f * 0.7; ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

function drawFrame(ctx, t) {
  if (t < cue[1]) shotLaugh(ctx, t, cue[1]);
  else if (t < cue[2]) shotDoubter(ctx, t - cue[1], CAST.boss, 'BOSS.', '#8f9ab3', 'crossed', false);
  else if (t < cue[3]) shotDoubter(ctx, t - cue[2], CAST.ex, 'EX.', '#ff8fb3', 'hipHand', true);
  else if (t < cue[4]) shotDoubter(ctx, t - cue[3], CAST.uncle, 'UNCLE.', '#ffb066', 'point', false);
  else if (t < cue[5]) shotFuture(ctx, t - cue[4], cue[5] - cue[4]);
  else if (t < cue[6]) shotTonight(ctx, t - cue[5], cue[6] - cue[5]);
  else if (t < TITLE_AT) shotClock(ctx, t - cue[6], TITLE_AT - cue[6]);
  else shotTitle(ctx, t - TITLE_AT);
  // fade out at the very end
  const f = prog(t, END - 0.35, END); if (f > 0) { ctx.save(); ctx.globalAlpha = f; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
}

async function main() {
  const dir = __dirname; const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
  const silent = path.join(out, `hook-${voice}.silent.mp4`); const final = path.join(out, `hook-${voice}.mp4`);
  const canvas = createCanvas(W, H); const ctx = canvas.getContext('2d');
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(END * FPS);
  for (let i = 0; i < frames; i++) {
    drawFrame(ctx, i / FPS);
    if (!ff.stdin.write(canvas.data())) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));

  // sound: voice, the tense intro track, and a dense layer of quiet effects on every beat
  const A = path.join(dir, 'audio'); const sfx = (n) => path.join(A, 'sfx', `${n}.mp3`);
  const snap = cue[4] + (cue[5] - cue[4]) * 0.42;
  const tail = 'aecho=0.8:0.7:90|180:0.45|0.3'; // gives the short hits a longer tail
  // [file, start time, volume, extra filter, max length in seconds]
  const layers = [
    [sfx('laugh'), 0.12, 0.1], [sfx('laugh'), 0.95, 0.08], [sfx('laugh'), 1.8, 0.067],
    [sfx('whoosh'), cue[1] - 0.12, 0.3], [sfx('whoosh'), cue[2] - 0.12, 0.3], [sfx('whoosh'), cue[3] - 0.12, 0.3],
    [sfx('whoosh'), cue[4] - 0.12, 0.26], [sfx('heartbeat'), cue[4] + 0.1, 0.9],
    [sfx('riser'), snap - 0.5, 0.4], [sfx('boom'), snap, 1.0, tail],
    [sfx('whoosh'), cue[5] - 0.12, 0.26], [sfx('buzz'), cue[5] + 0.05, 0.16], [sfx('counter'), cue[5] + 0.25, 0.3 / 4, null, 1.0], // quarter volume, cut after a second
    [sfx('heartbeat'), cue[5] + 1.0, 0.9],
    [sfx('whoosh'), cue[6] - 0.12, 0.26], [sfx('tick'), cue[6] + 0.1, 0.183, null, 1.6], // one short burst, gone before the next line
    [sfx('riser'), TITLE_AT - 0.35, 0.45], [sfx('slam'), TITLE_AT + 0.18, 0.55, tail], [sfx('boom'), TITLE_AT + 0.18, 0.9, tail],
  ].filter(([, at]) => at < END);
  const SFX_GAIN = 0.5; // one knob for how loud all effects sit under the voice
  const ms = (x) => Math.max(0, Math.round(x * 1000));
  const inputs = ['-i', silent, '-i', path.join(A, `hook-${voice}.mp3`), '-i', path.join(A, 'music-intro-tense.mp3')];
  const parts = ['[1:a]volume=1.0[v]', `[2:a]atrim=0:${END},volume=0.34,afade=t=in:d=0.3,afade=t=out:st=${END - 0.9}:d=0.9[m]`];
  const mix = ['[v]', '[m]'];
  layers.forEach(([file, at, vol, extra, dur], i) => {
    inputs.push('-i', file);
    parts.push(`[${i + 3}:a]${dur ? `atrim=0:${dur},afade=t=out:st=${(dur - 0.2).toFixed(2)}:d=0.2,` : ''}${extra ? `${extra},` : ''}volume=${(vol * SFX_GAIN).toFixed(3)},adelay=${ms(at)}:all=1[s${i}]`); mix.push(`[s${i}]`);
  });
  // soft synthesised pops as each face and each label appears
  [0.12, 0.5, 0.88, cue[1] + 0.05, cue[2] + 0.05, cue[3] + 0.05, cue[4] + 0.06, cue[5] + 0.12].forEach((at, i) => {
    parts.push(`sine=f=${520 + i * 40}:d=0.09,afade=t=out:st=0.01:d=0.08,volume=${(0.22 * SFX_GAIN).toFixed(3)},adelay=${ms(at)}:all=1[p${i}]`); mix.push(`[p${i}]`);
  });
  parts.push(`${mix.join('')}amix=inputs=${mix.length}:normalize=0:duration=longest,alimiter=limit=0.95[a]`);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', parts.join(';'),
    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(END), final]);
  fs.unlinkSync(silent);
  console.log('wrote', final, `${END.toFixed(1)}s`);
}
main();
