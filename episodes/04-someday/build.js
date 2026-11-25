// Builds episode 04: node episodes/04-someday/build.js [--still t1,t2] [--sheet] [--reuse-frames]
// Wordless, so the music is the bed. Effects keep the approved per-effect levels and the 0.5 global gain.
const fs = require('fs'); const path = require('path'); const { spawn, spawnSync, execFileSync } = require('child_process');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('../../engine/kit'); const V = require('./video');
const DIR = __dirname; const OUT = path.join(DIR, 'out'); const ASSETS = path.join(DIR, '..', '01-nine-dollars', 'audio'); const FPS = 30; const SR = 44100;
fs.mkdirSync(OUT, { recursive: true });
const canvas = createCanvas(V.W, V.H); const ctx = canvas.getContext('2d'); K.use(ctx);
const frame = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; ctx.save(); V.draw(t); ctx.restore(); };
const arg = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };

if (arg('--still')) { for (const t of arg('--still').split(',').map(Number)) { frame(t); fs.writeFileSync(path.join(OUT, `still-${t}.png`), canvas.toBuffer('image/png')); } console.log('stills'); process.exit(0); }
if (process.argv.includes('--sheet')) { // one still per scene at 60%
  const tw = 480; const th = 270; const cols = 4; const rows = Math.ceil(V.S.length / cols); const sh = createCanvas(cols * tw, rows * th); const sc = sh.getContext('2d');
  V.S.forEach((s, i) => { frame(s.start + s.d * +(arg('--at') ?? 0.6)); sc.drawImage(canvas, (i % cols) * tw, Math.floor(i / cols) * th, tw, th); sc.fillStyle = '#fff'; sc.font = '700 22px Inter'; sc.fillText(String(i + 1), (i % cols) * tw + 8, Math.floor(i / cols) * th + 26); });
  fs.writeFileSync(path.join(OUT, 'sheet.png'), sh.toBuffer('image/png')); console.log('sheet'); process.exit(0);
}

function decode(file, filter) { const a = ['-loglevel', 'error', '-i', file]; if (filter) a.push('-af', filter); const r = spawnSync('ffmpeg', [...a, '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'], { maxBuffer: 1 << 30 }); return new Float32Array(r.stdout.buffer, r.stdout.byteOffset, r.stdout.byteLength >> 2); }
// approved levels (episode 01 table, with the episode 02 reductions already folded into each shot's multiplier)
const SFX_GAIN = 0.5;
const LEVEL = { whoosh: 0.26, boom: 1.0, slam: 0.55, riser: 0.4, heartbeat: 0.9, buzz: 0.16 * 3, counter: 0.075, laugh: 0.1, cash: 0.55, notif: 0.8, typing: 0.27, paper: 0.1625 * 0.2,
  poof: 0.7, chime: 0.7, glass: 0.7, pen: 0.36, send: 0.8, clock: 0.075 / SFX_GAIN,
  alarm: 0.35, rain: 0.9, thunder: 0.6, rumble: 0.55, punch: 0.5 };
const TAIL = { boom: 'aecho=0.8:0.7:90|180:0.45|0.3', slam: 'aecho=0.8:0.7:90|180:0.45|0.3' };
const MUSIC_LEVEL = 0.42; // no narration: the music carries the video, effects sit under it

function buildAudio(file) {
  const len = Math.ceil(V.duration * SR) * 2; const mix = new Float32Array(len);
  const add = (pcm, at, vol, dur = Infinity, fadeIn = 0, fadeOut = 0, srcFrom = 0) => { const s0 = Math.floor(srcFrom * SR); const n = Math.min(pcm.length / 2 - s0, Math.floor(dur * SR)); const d0 = Math.round(at * SR);
    for (let i = 0; i < n; i++) { const d = d0 + i; if (d < 0) continue; if (d * 2 + 1 >= len) break; let g = vol; if (fadeIn && i < fadeIn * SR) g *= i / (fadeIn * SR); if (fadeOut && i > n - fadeOut * SR) g *= Math.max(0, (n - i) / (fadeOut * SR)); mix[d * 2] += pcm[(s0 + i) * 2] * g; mix[d * 2 + 1] += pcm[(s0 + i) * 2 + 1] * g; } };
  const lev = (n) => decode(path.join(ASSETS, `${n}.mp3`), 'acompressor=threshold=-30dB:ratio=6:attack=20:release=500,loudnorm=I=-24:LRA=3:TP=-2');
  const S = V.S; const driveAt = S[7].start + 1.6; const warmAt = S.findIndex((s) => s.music === 'warm');
  add(lev('music-sad'), 0.3, MUSIC_LEVEL, driveAt - 0.3, 2.5, 1.2);
  add(lev('music-drive'), driveAt, MUSIC_LEVEL, S[warmAt].start - driveAt + 0.4, 0.05, 1.4);
  add(lev('music-warm'), S[warmAt].start, MUSIC_LEVEL, V.duration - S[warmAt].start, 1.5, 3.0);
  const fx = {}; const sfx = (n) => { const own = path.join(DIR, 'audio', 'sfx', `${n}.mp3`); return (fx[n] ??= decode(fs.existsSync(own) ? own : path.join(ASSETS, 'sfx', `${n}.mp3`), TAIL[n])); };
  S.forEach((s, i) => {
    if (i > 0 && !s.quietCut) add(sfx('whoosh'), s.start - 0.12, LEVEL.whoosh * SFX_GAIN * 0.8);
    for (const [n, off = 0, mul = 1, dur] of s.sfx) { if (!LEVEL[n]) throw new Error(`unknown sfx ${n}`); if (mul > 1) throw new Error('multipliers stay at 1 or below');
      const lim = dur ?? Infinity; const pcm = sfx(n); const loops = dur ? Math.ceil(dur / (pcm.length / 2 / SR)) : 1;
      for (let k = 0; k < loops; k++) { const tl = pcm.length / 2 / SR; const st = k * tl; add(pcm, s.start + off + st, LEVEL[n] * SFX_GAIN * mul, Math.min(tl, lim - st), k ? 0.02 : 0, dur && st + tl >= lim ? 0.2 : 0); } }
  });
  for (let i = 0; i < len; i++) { const v = mix[i]; mix[i] = Math.abs(v) > 0.7 ? Math.sign(v) * (0.7 + 0.28 * Math.tanh((Math.abs(v) - 0.7) / 0.28)) : v; }
  const raw = `${file}.f32`; fs.writeFileSync(raw, Buffer.from(mix.buffer)); execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-i', raw, '-c:a', 'pcm_s16le', file]); fs.unlinkSync(raw);
}

(async () => {
  const silent = path.join(OUT, 'silent.mp4'); const wav = path.join(OUT, 'mix.wav'); const final = path.join(OUT, 'episode.mp4');
  if (!(process.argv.includes('--reuse-frames') && fs.existsSync(silent))) {
    const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${V.W}x${V.H}`, '-r', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(V.duration * FPS); for (let i = 0; i < n; i++) { frame(i / FPS); if (!ff.stdin.write(canvas.data())) await new Promise((r) => ff.stdin.once('drain', r)); if (i % 900 === 0) console.log('frame', i, '/', n); }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  }
  buildAudio(wav);
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', silent, '-i', wav, '-c:v', 'copy', '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final]);
  fs.unlinkSync(wav);
  // cold open: 20 seconds from the ending (the transformation, the shadow vanishing, the sunrise money), a white flash and a record scratch, then the story from the start
  const A = 116; const B = 136; const L = B - A; const story = path.join(OUT, 'story.mp4'); fs.renameSync(final, story);
  const scratch = path.join(ASSETS, 'sfx', 'scratch.mp3');
  // two separate reads of the story (the cut, then the whole), so nothing has to be held in memory
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-ss', String(A), '-t', String(L), '-i', story, '-i', story, '-i', scratch, '-filter_complex',
    `[0:v]setpts=PTS-STARTPTS,fade=t=out:st=${L - 0.35}:d=0.35:color=white[v1];[1:v]setpts=PTS-STARTPTS[v2];[v1][v2]concat=n=2:v=1:a=0[v];` +
    `[0:a]asetpts=PTS-STARTPTS,afade=t=out:st=${L - 0.5}:d=0.5[a1];[1:a]asetpts=PTS-STARTPTS[a2];[a1][a2]concat=n=2:v=0:a=1[ab];` +
    `[2:a]volume=${0.25 * SFX_GAIN},adelay=${Math.round((L - 0.45) * 1000)}|${Math.round((L - 0.45) * 1000)}[sc];[ab][sc]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-15:TP=-1.5:LRA=11[a]`,
    '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final]);
  fs.unlinkSync(story); console.log('wrote', final, (V.duration + L).toFixed(1) + 's');
})();
