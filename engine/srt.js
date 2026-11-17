// Subtitles from a narration timeline: cues of up to two balanced lines of at most 42 characters,
// each line split at sentence ends and timed by its share of the characters.
// timeline entries: { text, start, speech, d }. offset shifts every cue (e.g. a separately rendered hook).
const fs = require('fs');
const path = require('path');

const ts = (t) => { const ms = Math.round(t * 1000); const p = (n, w = 2) => String(n).padStart(w, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
const wrap = (str, max) => { const out = []; let cur = ''; for (const w of str.split(' ')) { if (cur && (cur + ' ' + w).length > max) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w; } if (cur) out.push(cur); return out; };
const balance = (p) => { if (p.length <= 42) return p; for (let m = Math.ceil(p.length / 2); m <= 42; m++) { const l = wrap(p, m); if (l.length <= 2) return l.join('\n'); } return wrap(p, 42).join('\n'); };

function cuesFor(text, start, span) {
  const pieces = text.match(/[^.!?]+[.!?]+["”]?|[^.!?]+$/g).map((x) => x.trim()).flatMap((x) => { const l = wrap(x, 42); const o = []; for (let i = 0; i < l.length; i += 2) o.push(l.slice(i, i + 2).join(' ')); return o; });
  const merged = []; for (const p of pieces) { const last = merged[merged.length - 1]; if (last && wrap(`${last} ${p}`, 42).length <= 2) merged[merged.length - 1] = `${last} ${p}`; else merged.push(p); }
  const total = merged.reduce((a, p) => a + p.length, 0); let t = start; const cues = [];
  for (const p of merged) { const len = span * p.length / total; cues.push([t, t + len, balance(p)]); t += len; }
  return cues;
}

function writeSrt(timeline, file, o = {}) {
  const cues = [...(o.before ?? [])];
  for (const s of timeline) cues.push(...cuesFor(s.text, (o.offset ?? 0) + s.start + 0.05, Math.min(s.speech + 0.2, s.d - 0.05)));
  const srt = cues.map(([a, b, x], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${x}\n`).join('\n');
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, srt); console.log('wrote', cues.length, 'cues to', file);
}

module.exports = { writeSrt, cuesFor };
