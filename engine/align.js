// Finds when each narration line starts inside a chapter's voiceover.
// The voice pauses between lines; we detect the pauses with ffmpeg and pick the ones that best match
// where each line should fall given its length (dynamic programming over pause candidates).
const { execFileSync, spawnSync } = require('child_process');

function silences(file) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'silencedetect=noise=-35dB:d=0.16', '-f', 'null', '-'], { encoding: 'utf8' });
  const out = []; const re = /silence_end: ([\d.]+) \| silence_duration: ([\d.]+)/g; let m;
  while ((m = re.exec(r.stderr))) out.push({ end: +m[1], dur: +m[2], start: +m[1] - +m[2] });
  return out;
}
function duration(file) {
  return +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
}

// lines: array of strings. Returns [{start, end}] in seconds within the file.
function align(file, lines) {
  const total = duration(file); const sil = silences(file).filter((s) => s.start > 0.2 && s.end < total - 0.15);
  // spoken "weight" of a line: characters plus a little extra for each sentence pause inside it
  const w = lines.map((l) => l.length + 14 * (l.match(/[.?!]/g) || []).length);
  const sum = w.reduce((a, b) => a + b, 0);
  // expected spoken length of each line, from its share of the chapter
  const speech = total - sil.reduce((x, y) => x + y.dur, 0) * 0.6;
  const exp = w.map((x) => (x / sum) * speech);
  const n = lines.length - 1; const m = sil.length;
  if (m < n) throw new Error(`${file}: only ${m} pauses for ${n} boundaries`);
  // dp[i][j]: best cost with line i ending at pause j. Each line is scored on how far its length is
  // from the expected one, with a bonus for ending on a long pause (line breaks pause longer than commas).
  const segCost = (i, from, to) => { const d = to - from; return d <= 0.3 ? 1e6 : 7 * ((d - exp[i]) / exp[i]) ** 2; };
  const bonus = (j) => 1.1 * Math.min(sil[j].dur, 1.0);
  const dp = Array.from({ length: n }, () => new Array(m).fill(Infinity)); const from = Array.from({ length: n }, () => new Array(m).fill(-1));
  for (let j = 0; j < m; j++) dp[0][j] = segCost(0, 0, sil[j].start) - bonus(j);
  for (let i = 1; i < n; i++) for (let j = i; j < m; j++) for (let k = i - 1; k < j; k++) {
    const c = dp[i - 1][k] + segCost(i, sil[k].end, sil[j].start) - bonus(j);
    if (c < dp[i][j]) { dp[i][j] = c; from[i][j] = k; }
  }
  let j = -1; let best = Infinity;
  for (let k = n - 1; k < m; k++) { const c = dp[n - 1][k] + segCost(n, sil[k].end, total); if (c < best) { best = c; j = k; } }
  const picks = new Array(n);
  for (let i = n - 1; i >= 0; i--) { picks[i] = j; j = from[i][j]; }
  const out = []; let start = 0;
  for (let i = 0; i < lines.length; i++) {
    const p = i < n ? sil[picks[i]] : null;
    out.push({ start, end: p ? p.start : total, pause: p ? p.dur : 0 });
    start = p ? p.end - 0.06 : total;
  }
  return out;
}

module.exports = { align, duration };

if (require.main === module) {
  const path = require('path');
  const nar = require(path.resolve('episodes/01-nine-dollars/narration.js'));
  const parts = { 8: [['ch8a', 0, 12], ['ch8b', 12, 24]] };
  for (const c of nar) {
    for (const [name, a, b] of parts[c.ch] || [[`ch${c.ch}`, 0, c.lines.length]]) {
      const lines = c.lines.slice(a, b); const r = align(`episodes/01-nine-dollars/audio/voice/${name}.mp3`, lines.map((l) => l[1]));
      console.log(name);
      r.forEach((x, i) => console.log(`  ${lines[i][0].padEnd(4)} ${x.start.toFixed(2).padStart(6)}-${x.end.toFixed(2).padStart(6)}  ${((lines[i][1].length) / (x.end - x.start)).toFixed(1).padStart(5)} c/s  pause ${x.pause.toFixed(2)}  ${lines[i][1].slice(0, 44)}`));
    }
  }
}
