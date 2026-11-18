// Joins four animated shorts into one: each plays up to its payoff, a white flash cuts to the next,
// and the compilation ends on the sports-car scene with the "link in bio, to learn how" call to action.
//   node shorts/compile.js <name> 01-employee-vs-creator 02-first-sale 03-excuses-vs-action 04-day-1-vs-day-100
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('../engine/kit');
const { lifestyle, shade } = require('./lib');

const [name, ...ids] = process.argv.slice(2);
const parts = ids.map((id) => require(path.join(__dirname, id)));
const END = 3.6; const FPS = 30; const W = 1080; const H = 1920;
const starts = []; let total = 0; for (const p of parts) { starts.push(total); total += p.cut; } const DURATION = total + END;
const canvas = createCanvas(W, H); const ctx = canvas.getContext('2d'); K.use(ctx);

function frame(T) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; K.setTime(T); ctx.save();
  if (T >= total) { lifestyle(T - total); shade('#000000', K.prog(T, DURATION - 0.4, DURATION)); }
  else { let i = parts.length - 1; while (starts[i] > T) i--; const t = T - starts[i]; parts[i].draw(Math.max(t, i ? 0.3 : t)); // later parts skip their fade-in from black
    if (i > 0) shade('#ffffff', 0.85 * (1 - K.prog(t, 0, 0.25))); }
  ctx.restore();
}
(async () => {
  const out = path.join(__dirname, 'out', `${name}.mp4`); fs.mkdirSync(path.dirname(out), { recursive: true });
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(DURATION * FPS);
  for (let i = 0; i < n; i++) { frame(i / FPS); if (!ff.stdin.write(canvas.data())) await new Promise((r) => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); console.log('wrote', out, `${DURATION.toFixed(1)}s`);
})();
