// Renders a silent vertical short: node shorts/build.js shorts/<name>.js [--still t] -> shorts/out/<name>.mp4 (1080x1920, 30 fps)
// A short file exports { duration, draw(t) }. No voice or music: the owner adds music on YouTube.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('../engine/kit');

const file = path.resolve(process.argv[2]); const name = path.basename(file, '.js'); const short = require(file);
const W = 1080; const H = 1920; const FPS = 30; const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const canvas = createCanvas(W, H); const ctx = canvas.getContext('2d'); K.use(ctx);
const frame = (t) => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.shadowBlur = 0; K.setTime(t); ctx.save(); short.draw(t); ctx.restore(); };

const at = process.argv.indexOf('--still');
if (at > 0) { // stills for checking: --still 2,6,10
  for (const t of process.argv[at + 1].split(',').map(Number)) { frame(t); fs.writeFileSync(path.join(OUT, `${name}-${t}.png`), canvas.toBuffer('image/png')); }
  console.log('stills written'); return;
}
(async () => {
  const out = path.join(OUT, `${name}.mp4`);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'aac', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(short.duration * FPS);
  for (let i = 0; i < n; i++) { frame(i / FPS); if (!ff.stdin.write(canvas.data())) await new Promise((r) => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r)); console.log('wrote', out);
})();
