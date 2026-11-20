// Story short: POSTING WITH HATERS. Comments roll in; the quitter deletes, anger argues, ego brags; Kai keeps posting and the comments turn.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, blend, hop, pill, lane, says, whichOne, spot } = require('./lib');
const CUT = 21.5; const END = 18.0;
const person = (col, hair) => ({ hair: { type: hair, color: '#2b2b33' }, top: { type: 'hoodie', color: col }, pants: '#343a40', shoes: '#e5e5e5' });
const L = [['QUITTER', '#868e96', person('#868e96', 'short')], ['ANGER', '#ff6b6b', person('#e03131', 'curly')], ['EGO', '#ffd43b', person('#f59f00', 'slick')], ['CONSISTENT', GREEN, 'kai']];
const HATE = ['cringe', 'who asked?', 'lol', 'get a real job', 'nobody cares', 'flop'];
const LOVE = ['this helped!', "where's the link?", 'bought it!', 'day 1 starting', 'underrated', 'thank you'];
function phoneMini(x, y, posts, col) { card(x - 50, y - 90, 100, 180, '#111114', 14); card(x - 42, y - 80, 84, 160, col, 8); label(`#${posts}`, x, y, 26, '#ffffff', { spacing: 1 }); }
module.exports = makeShort(CUT, (t) => {
  dark(900); const turn = 11.0;
  L.forEach(([name, col, spec], i) => {
    const gone = i === 0 && t > 4.4;
    lane(i, name, col, (y0, fy) => {
      const posts = i === 3 ? Math.max(1, Math.floor(prog(t, 0.5, 17) ** 1.1 * 120)) : (i === 0 ? 1 : Math.max(1, Math.floor(prog(t, 0.5, 17) * [1, 6, 4][i])));
      // comments flying in from the right
      const n = Math.floor((t - 0.4) / 0.5); for (let j = Math.max(0, n - 4); j <= n; j++) { const a = 0.4 + j * 0.5; const f = prog(t, a, a + 1.6); if (f <= 0 || f >= 1 || (i === 0 && t > 4.4)) continue; const good = i === 3 && a > turn; const s = good ? LOVE[j % LOVE.length] : HATE[(j + i) % HATE.length];
        alpha(1 - f * f, () => pill(s, lerp(1050, 520, f), y0 + 90 + ((j * 53 + i * 31) % 170), 22, good ? GREEN : '#ff8787', { pad: 30, border: good ? GREEN : 'rgba(255,135,135,0.5)' })); }
      const kx = 230; phoneMini(kx + 110, fy - 150, posts, i === 3 && t > turn ? '#123d1c' : '#1b2a45');
      const follows = i === 3 ? Math.floor(prog(t, 2, 17.5) ** 2.2 * 10000) : (i === 0 ? 0 : (i === 1 ? Math.max(0, Math.floor(40 - t * 3)) : 12));
      at(840, fy - 20, 1, () => pill(i === 0 && gone ? 'DELETED' : `${follows.toLocaleString('en-US')} FOLLOWERS`, 0, 0, 22, i === 3 && follows > 50 ? GREEN : '#9aa3b5', { pad: 30 }));
      if (i === 0) { const x = gone ? lerp(kx, -120, prog(t, 4.4, 5.6)) : kx; if (x > -100) who(spec, { x, y: fy, s: 0.42, flip: gone, pose: gone ? P.walk(t * 2) : { lean: 0, tilt: 8, armL: [8, 4], armR: [22, -132], legL: [5, 0], legR: [5, 0] }, expr: 'sad', prop: gone ? undefined : 'phone' }); says('DELETE ACCOUNT.', 520, y0 + 70, t, 3.0, 5, '#ced4da'); }
      if (i === 1) { who(spec, { x: kx, y: fy, s: 0.42, pose: { lean: 0, tilt: -4, armL: [34 + Math.sin(t * 20) * 5, -70 + Math.sin(t * 20) * 14], armR: [34 - Math.sin(t * 20) * 5, -70], legL: [6, 0], legR: [6, 0] }, expr: 'angry' }); says('REPLYING TO EVERY HATER...', 560, y0 + 70, t, 2.0, 15, '#ff8787'); }
      if (i === 2) { who(spec, { x: kx, y: fy, s: 0.42, pose: 'power', expr: 'smug' }); says("I'M THE BEST.", 520, y0 + 70, t, 1.5, 15, '#ffd43b'); }
      if (i === 3) { const done = t > 15.5; spot(kx, fy - 120, 150, 'rgba(57,255,20,0.18)'); who(done ? 'kai2' : 'kai', { x: kx, y: fy - (done ? Math.abs(Math.sin(t * 5)) * 14 : 0), s: 0.42, pose: done ? 'cheer' : { lean: 0, tilt: 6, armL: [8, 4], armR: [22, -132 + (Math.sin(t * 8) > 0.5 ? 10 : 0)], legL: [5, 0], legR: [5, 0] }, expr: done ? 'happy' : 'determined', prop: done ? undefined : 'phone' }); says('POST. AGAIN.', 520, y0 + 70, t, 1.5, 9, GREEN); says('THE COMMENTS CHANGED.', 560, y0 + 70, t, turn + 0.5, 16.5, GREEN); }
    }, { dim: gone ? prog(t, 5, 6) * 0.5 : 0, border: i === 3 && t > turn ? GREEN : undefined });
  });
  title('POSTING WITH HATERS', '#ffffff', 300, 68);
  whichOne(t, END, [['QUITTER', '#868e96'], ['ANGER', '#ff6b6b'], ['EGO', '#ffd43b'], ['CONSISTENT', GREEN]]);
});
