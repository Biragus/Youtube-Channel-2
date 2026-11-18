// Luxury-clip compilation short: 4 clips, white-flash cuts, then a "link in bio" end card. Silent (music is added on YouTube).
//   node shorts/compile.js <name> clip1.mp4 clip2.mp4 clip3.mp4 clip4.mp4  -> shorts/out/<name>.mp4
// Each clip is cropped to fill 1080x1920 and its middle CLIP seconds are used. Only use clips you have the rights to.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('../engine/kit');
const { dark, label, watermark } = require('./lib');

const [name, ...clips] = process.argv.slice(2);
if (!name || clips.length !== 4) throw new Error('usage: node shorts/compile.js <name> <4 clips>');
const CLIP = 3.0; const CARD = 3.0; const FLASH = 0.18;
const OUT = path.join(__dirname, 'out'); const TMP = path.join(OUT, `.${name}`); fs.mkdirSync(TMP, { recursive: true });
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();

// the end card, drawn once as a still
const cv = createCanvas(1080, 1920); K.use(cv.getContext('2d')); K.setTime(0); dark(900);
label('WANT THIS', 540, 760, 92, '#ffffff', { spacing: 6 }); label('LIFE?', 540, 870, 120, K.GOLD, { spacing: 8, glow: K.GOLD });
K.at(540, 1080, 1, () => { K.card(-330, -70, 660, 140, K.GREEN, 70); K.T('LINK IN BIO', 0, 4, 66, K.INK, { spacing: 4 }); });
label('TO LEARN HOW', 540, 1230, 54, '#c9d6cf', { spacing: 8 }); watermark();
const card = path.join(TMP, 'card.png'); fs.writeFileSync(card, cv.toBuffer('image/png'));

// ffmpeg: crop each clip to 9:16, take its middle seconds, flash into the next, end on the card
const inputs = []; const parts = [];
clips.forEach((c, i) => { const start = Math.max(0, dur(c) / 2 - CLIP / 2); inputs.push('-ss', String(start), '-t', String(CLIP), '-i', c);
  parts.push(`[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p,fade=t=in:st=0:d=${FLASH}:color=white,eq=saturation=1.1[v${i}]`); });
inputs.push('-loop', '1', '-t', String(CARD), '-i', card);
parts.push(`[4:v]scale=1080:1920,setsar=1,fps=30,format=yuv420p,fade=t=in:st=0:d=${FLASH}:color=white,fade=t=out:st=${CARD - 0.4}:d=0.4[v4]`);
parts.push('[v0][v1][v2][v3][v4]concat=n=5:v=1:a=0[v]');
const out = path.join(OUT, `${name}.mp4`); const total = 4 * CLIP + CARD;
execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-f', 'lavfi', '-t', String(total), '-i', 'anullsrc=r=44100:cl=stereo', '-filter_complex', parts.join(';'),
  '-map', '[v]', '-map', '5:a', '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-c:a', 'aac', '-shortest', out]);
fs.rmSync(TMP, { recursive: true, force: true }); console.log('wrote', out, `${total}s`);
