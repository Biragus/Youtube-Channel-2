// Builds an episode: lays the shots on a timeline from the narration, renders the frames, and mixes
// voice + music + sound effects at the approved levels (see CLAUDE.md).
//   node engine/build-episode.js episodes/<name>              full render -> out/episode.mp4
//   node engine/build-episode.js episodes/<name> --sheets     one still per shot -> out/sheets/*.png
//   node engine/build-episode.js episodes/<name> --reuse-frames   redo only the sound
//   node engine/build-episode.js episodes/<name> --list       where every shot and sound lands
// The episode folder provides narration.js, episode.js (config) and the shot drawings it names.
const fs = require('fs');
const path = require('path');
const { spawn, execFileSync, spawnSync } = require('child_process');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('./kit');
const { align, duration } = require('./align');

const DIR = path.resolve(process.argv[2]);
const narration = require(path.join(DIR, 'narration'));
const cfg = require(path.join(DIR, 'episode'));
const shots = Object.assign({}, ...cfg.shots.map((f) => require(path.join(DIR, f))));
const ASSETS = path.resolve(DIR, cfg.assets); // shared music and sound effects
 const A = path.join(DIR, 'audio'); const OUT = path.join(DIR, 'out');
const W = 1920; const H = 1080; const FPS = 30; const SR = 44100;
const args = process.argv.slice(3); const flag = (n) => args.includes(n); const opt = (n) => (args.includes(n) ? args[args.indexOf(n) + 1] : null);

// ---- timeline -------------------------------------------------------------------
const CHAPTER_GAP = 0.9;              // breath between chapters (cfg.gap overrides per chapter)
const HOLD = cfg.hold ?? {};   // extra silence after a line
const FILES = cfg.files ?? {}; // chapters whose narration is split over several files
const MUSIC = cfg.music;       // [track, first chapter, last chapter, volume, 'raw' to skip levelling]

const timeline = []; const voiceClips = []; const chapterSpan = {};
let cursor = 0.4;
for (const c of narration) {
  chapterSpan[c.ch] = { start: cursor };
  for (const [name, a, b] of FILES[c.ch] || [[`ch${c.ch}`, 0, c.lines.length]]) {
    const file = path.join(A, 'voice', `${name}.mp3`); const lines = c.lines.slice(a, b); const al = align(file, lines.map((l) => l[1])); const total = duration(file);
    lines.forEach(([id, text], i) => {
      const from = i === 0 ? 0 : al[i].start; const to = i < lines.length - 1 ? al[i + 1].start : total;
      voiceClips.push({ file, from, to, at: cursor });
      timeline.push({ id, ch: c.ch, text, start: cursor, speech: al[i].end - al[i].start });
      cursor += (to - from) + (HOLD[id] ?? 0);
    });
  }
  cursor += cfg.gap?.[c.ch] ?? CHAPTER_GAP; chapterSpan[c.ch].end = cursor;
}
const END = cursor + 0.2;
timeline.forEach((s, i) => { s.end = i < timeline.length - 1 ? timeline[i + 1].start : END; s.d = s.end - s.start; });
const missing = timeline.filter((s) => !shots[s.id]).map((s) => s.id);
if (missing.length) console.log('shots without drawings:', missing.join(' '));

// ---- drawing ----------------------------------------------------------------------
const canvas = createCanvas(W, H); const ctx = canvas.getContext('2d'); K.use(ctx);
function shotAt(t) { let lo = 0; let hi = timeline.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (timeline[mid].start <= t) lo = mid; else hi = mid - 1; } return timeline[lo]; }
function drawFrame(t) {
  const s = shotAt(t); const local = Math.max(0, t - s.start); K.setTime(t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0;
  const def = shots[s.id]; const draw = typeof def === 'function' ? def : def?.draw;
  ctx.save();
  try {
    if (draw) draw({ t: local, d: s.d, k: K.clamp(local / s.d), id: s.id, speech: s.speech });
    else { K.bg('#30364a', '#12141c'); K.T(s.id, W / 2, 400, 160, '#ffffff'); K.T(s.text.slice(0, 60), W / 2, 600, 44, '#c9cfe6', { weight: 600 }); }
  } finally { ctx.restore(); }
  const fin = 1 - K.prog(t, 0, 0.35); const fout = K.prog(t, END - 0.8, END);
  if (fin > 0 || fout > 0) K.tint('#000000', Math.max(fin, fout));
}

async function renderVideo(file, from, to) {
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((to - from) * FPS);
  for (let i = 0; i < n; i++) {
    drawFrame(from + i / FPS);
    if (!ff.stdin.write(canvas.data())) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 1500 === 0) console.log(`  frame ${i}/${n}`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}

// ---- sound ------------------------------------------------------------------------
// Everything is decoded to 44.1 kHz stereo float and summed in one buffer.
function decode(file, filter) {
  const a = ['-loglevel', 'error', '-i', file]; if (filter) a.push('-af', filter);
  const r = spawnSync('ffmpeg', [...a, '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 });
  return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength >> 2);
}
// How loud each effect sits before the global gain. Laughs and ticks are a third, as agreed on the hook.
const SFX_GAIN = 0.5;
// Second pass after review: page turns and ticks to a quarter, typing, drips and crowd to a third, pen to a fifth, engine and cash to half.
const LEVEL = { whoosh: 0.26, boom: 1.0, slam: 0.55, riser: 0.4, heartbeat: 0.9, buzz: 0.16, counter: 0.3 / 4, laugh: 0.1, tick: 0.19 / 4,
  cash: 1.1 / 2, notif: 0.8, door: 0.5, typing: 0.8 / 3, paper: 2.6 / 16, error: 0.5, engine: 0.5 / 2, poof: 0.7, scratch: 0.25, drip: 2.6 / 3, chime: 0.7,
  glass: 0.7, pen: 1.8 / 5, crowd: 1.0 / 3, send: 0.8 };
const LOOPY = new Set(['pen', 'typing', 'crowd', 'tick', 'counter', 'clock']);
Object.assign(LEVEL, cfg.extraLevels ?? {});
const SCALE = cfg.sfxScale ?? {}; // episode-wide multipliers from the owner's review // long sounds stop when their shot ends
const TAIL = { boom: 'aecho=0.8:0.7:90|180:0.45|0.3', slam: 'aecho=0.8:0.7:90|180:0.45|0.3' };

function buildAudio(file, from, to) {
  const len = Math.ceil((to - from) * SR) * 2; const mix = new Float32Array(len);
  // env(t) is an optional extra gain over video time, used to dip the music in places
  const add = (pcm, atSec, vol, srcFrom = 0, srcTo = Infinity, fadeIn = 0, fadeOut = 0, env = null) => {
    const s0 = Math.floor(srcFrom * SR); const s1 = Math.min(pcm.length / 2, Math.floor(srcTo * SR)); const n = s1 - s0; const dst0 = Math.round((atSec - from) * SR);
    for (let i = 0; i < n; i++) {
      const d = dst0 + i; if (d < 0) continue; if (d * 2 + 1 >= len) break;
      let g = vol; if (fadeIn && i < fadeIn * SR) g *= i / (fadeIn * SR); if (fadeOut && i > n - fadeOut * SR) g *= (n - i) / (fadeOut * SR);
      if (env) g *= env(from + d / SR);
      mix[d * 2] += pcm[(s0 + i) * 2] * g; mix[d * 2 + 1] += pcm[(s0 + i) * 2 + 1] * g;
    }
  };
  // voice
  const voice = {};
  for (const c of voiceClips) { voice[c.file] ??= decode(c.file); add(voice[c.file], c.at, 1.0, c.from, c.to, 0.004, 0.004); }
  // music dips: [start, end, gain] in video seconds, with half-second ramps
  const dips = cfg.musicDips ?? [];
  const musicEnv = dips.length ? (t) => { let g = 1; for (const [a, b, gain] of dips) { const k = Math.min(1, Math.max(0, Math.min(t - a + 0.5, b - t + 0.5) / 0.5)); g *= 1 - (1 - gain) * k; } return g; } : null;
  // music: one track per group of chapters, looped if the track is shorter than the group
  for (const [name, a, b, vol, raw] of MUSIC) {
    // compress and level each track first, so swells never climb over the voice
    const pcm = decode(path.join(ASSETS, `${name}.mp3`), raw ? null : 'acompressor=threshold=-30dB:ratio=6:attack=20:release=500,loudnorm=I=-24:LRA=3:TP=-2'); const start = chapterSpan[a].start - 0.3; const end = chapterSpan[b].end + 0.6; const tl = pcm.length / 2 / SR;
    for (let t = start, first = true; t < end; t += tl - 2, first = false) add(pcm, t, vol, 0, Math.min(tl, end - t), first ? 1.2 : 2, t + tl >= end ? 2.2 : 2, musicEnv);
  }
  // effects: a soft whoosh on every cut plus whatever each shot asks for
  const fx = {}; const sfx = (n) => (fx[n] ??= decode(fs.existsSync(path.join(DIR, 'audio', 'sfx', `${n}.mp3`)) ? path.join(DIR, 'audio', 'sfx', `${n}.mp3`) : path.join(ASSETS, 'sfx', `${n}.mp3`), TAIL[n]));
  timeline.forEach((s, i) => {
    const def = shots[s.id]; const list = (typeof def === 'object' && def.sfx) || [];
    if (i > 0 && !(def && def.quietCut)) add(sfx('whoosh'), s.start - 0.12, LEVEL.whoosh * SFX_GAIN * 0.8 * (SCALE.whoosh ?? 1));
    for (const [name, off = 0, baseMul = 1] of list) { let mul = baseMul; if (!LEVEL[name]) throw new Error(`unknown sfx ${name} in ${s.id}`); mul *= SCALE[name] ?? 1; if (LOOPY.has(name)) add(sfx(name), s.start + off, LEVEL[name] * SFX_GAIN * mul, 0, Math.max(0.3, s.d - off), 0, 0.2); else add(sfx(name), s.start + off, LEVEL[name] * SFX_GAIN * mul); }
  });
  // soft limiter so peaks never clip
  for (let i = 0; i < len; i++) { const v = mix[i]; mix[i] = Math.abs(v) > 0.7 ? Math.sign(v) * (0.7 + 0.28 * Math.tanh((Math.abs(v) - 0.7) / 0.28)) : v; }
  const raw = `${file}.f32`; fs.writeFileSync(raw, Buffer.from(mix.buffer));
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-i', raw, '-c:a', 'pcm_s16le', file]); fs.unlinkSync(raw);
}

// ---- entry points -----------------------------------------------------------------
async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log(`${timeline.length} shots, body ${END.toFixed(1)}s (${(END / 60).toFixed(2)} min)`);
  if (flag('--list')) { // where every shot and sound lands in the finished video
    const HOOK = 0; const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;
    for (const s of timeline) { const def = shots[s.id]; const list = (typeof def === 'object' && def.sfx) || []; console.log(mmss(s.start + HOOK).padEnd(7), s.id.padEnd(4), list.map(([n, o = 0, m = 1]) => `${n}@${mmss(s.start + HOOK + o)}${m !== 1 ? `x${m}` : ''}`).join(' ')); }
    for (const [n, a2, b2] of MUSIC) console.log('music', n, mmss(chapterSpan[a2].start + HOOK), '-', mmss(chapterSpan[b2].end + HOOK));
    return;
  }
  if (flag('--srt')) { // subtitles from the narration timing -> out/captions.srt (cues of up to two 42-character lines)
    const ts = (t) => { const ms = Math.round(t * 1000); const p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
    const wrap = (str, max) => { const out = []; let cur = ''; for (const w of str.split(' ')) { if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w; } if (cur) out.push(cur); return out; };
    const balance = (p) => { if (p.length <= 42) return p; for (let m = Math.ceil(p.length / 2); m <= 42; m++) { const l = wrap(p, m); if (l.length <= 2) return l.join('\n'); } return wrap(p, 42).join('\n'); };
    const cues = [];
    for (const s of timeline) {
      // split long lines at sentence ends first, then by length; time each piece by its share of the characters
      const pieces = s.text.match(/[^.!?]+[.!?]+["”]?|[^.!?]+$/g).map((x) => x.trim()).flatMap((x) => { const l = wrap(x, 42); const o = []; for (let i = 0; i < l.length; i += 2) o.push(l.slice(i, i + 2).join(' ')); return o; });
      const merged = []; for (const p of pieces) { const last = merged[merged.length - 1]; if (last && wrap(`${last} ${p}`, 42).length <= 2) merged[merged.length - 1] = `${last} ${p}`; else merged.push(p); }
      const total = merged.reduce((a, p) => a + p.length, 0); let t = s.start + 0.05; const span = Math.min(s.speech + 0.2, s.d - 0.05);
      for (const p of merged) { const len = span * p.length / total; cues.push([t, t + len, balance(p)]); t += len; }
    }
    const srt = cues.map(([a, b, x], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${x}\n`).join('\n');
    fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, 'captions.srt'), srt); console.log('wrote', cues.length, 'cues to', path.join(OUT, 'captions.srt'));
    for (const c of narration) console.log('chapter', c.ch, `${Math.floor(chapterSpan[c.ch].start / 60)}:${String(Math.floor(chapterSpan[c.ch].start % 60)).padStart(2, '0')}`, c.name);
    return;
  }
  if (flag('--sheets')) { // one still per shot, tiled, for a quick visual check
    const dir = path.join(OUT, 'sheets'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    const frac = +(opt('--at') ?? 0.6); const cols = 4; const rows = 4; const tw = 480; const th = 270; const only = opt('--ch');
    const list = timeline.filter((s) => !only || String(s.ch) === only);
    for (let p = 0; p * cols * rows < list.length; p++) {
      const sheet = createCanvas(cols * tw, rows * th); const sc = sheet.getContext('2d');
      list.slice(p * cols * rows, (p + 1) * cols * rows).forEach((s, i) => {
        drawFrame(s.start + s.d * frac); const x = (i % cols) * tw; const y = Math.floor(i / cols) * th;
        sc.drawImage(canvas, x, y, tw, th); sc.fillStyle = '#000'; sc.fillRect(x, y, 70, 30); sc.fillStyle = '#fff'; sc.font = '700 22px Inter'; sc.fillText(s.id, x + 6, y + 23);
      });
      fs.writeFileSync(path.join(dir, `sheet-${String(p + 1).padStart(2, '0')}.png`), sheet.toBuffer('image/png'));
    }
    console.log('wrote sheets to', dir); return;
  }
  let from = 0; let to = END; let name = 'body';
  if (opt('--ch')) { const c = chapterSpan[+opt('--ch')]; from = Math.max(0, c.start - 0.3); to = c.end; name = `ch${opt('--ch')}`; }
  const silent = path.join(OUT, `${name}.silent.mp4`); const wav = path.join(OUT, `${name}.wav`); const body = path.join(OUT, `${name}.mp4`);
  if (flag('--reuse-frames') && !fs.existsSync(silent) && fs.existsSync(body)) execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', body, '-an', '-c:v', 'copy', silent]); // take the picture from the last build
  if (!(flag('--reuse-frames') && fs.existsSync(silent))) await renderVideo(silent, from, to); // --reuse-frames: only redo the sound
  buildAudio(wav, from, to);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', silent, '-i', wav, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', body]);
  fs.unlinkSync(silent); fs.unlinkSync(wav);
  if (name !== 'body') { console.log('wrote', body); return; }
  // bring the whole thing to YouTube's usual loudness
  const final = path.join(OUT, 'episode.mp4');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', body, '-c:v', 'copy', '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final]);
  console.log('wrote', final, `${duration(final).toFixed(1)}s`);
}
main();
