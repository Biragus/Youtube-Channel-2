// Thumbnails: node episodes/03-the-gym-he-couldnt-afford/thumbnail.js -> out/thumbnail-a.png, thumbnail-b.png (1280x720)
// Three subjects at most: one line of text, Kai's head, one object.
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('../../engine/kit');
const { GREEN, GOLD, INK, RED, bg, at, T, card, who, withSpec, tint } = K;
const { hood, priceCard, planCover } = require('./shots-a')._shared;

const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const big = (str, x, y, size, color, o = {}) => T(str, x, y, size, color, { stroke: '#000000', strokeWidth: size * 0.2, spacing: 2, align: o.align ?? 'left', glow: o.glow, blur: 50 });
// a head-and-shoulders shot of a character, head centred on (x, hy)
const bust = (spec, x, hy, s, expr, o = {}) => who(spec, { x, y: hy + 376 * s, s, expr, still: true, flip: o.flip, look: o.look });
function stamp(str, x, y, s, rot) { at(x, y, s, () => { const w = K.textWidth(str, 120, false, 6) + 80; K.ctx().strokeStyle = RED; K.ctx().lineWidth = 16; K.ctx().beginPath(); K.ctx().roundRect(-w / 2, -90, w, 180, 24); K.ctx().stroke(); T(str, 0, 6, 120, RED, { spacing: 6 }); }, rot); }

// soft green light behind the head
function halo(x, y) { const c = K.ctx(); const g = c.createRadialGradient(x, y, 0, x, y, 520); g.addColorStop(0, 'rgba(57,255,20,0.45)'); g.addColorStop(1, 'rgba(57,255,20,0)'); c.fillStyle = g; c.fillRect(x - 600, y - 600, 1200, 1200); }
function render(name, draw) {
  const cv = createCanvas(1920, 1080); K.use(cv.getContext('2d')); K.setTime(0); draw();
  const small = createCanvas(1280, 720); small.getContext('2d').drawImage(cv, 0, 0, 1280, 720);
  fs.writeFileSync(path.join(OUT, name), small.toBuffer('image/png')); console.log('wrote', path.join(OUT, name));
}

// A: the problem. "TOO BROKE FOR A GYM", Kai in his hood, the gym price card stamped DENIED
render('thumbnail-a.png', () => {
  bg('#4a1218', '#070203', 1300, 500, 1300);
  at(560, 720, 1.05, () => { priceCard(0, 0, 1, { rot: -0.08 }); stamp('DENIED', 10, 30, 1.0, -0.22); });
  halo(1450, 470); bust('kai', 1450, 470, 3.1, 'worried', { look: -0.4 });
  hood(1450, 470 + 376 * 3.1 + 22, 3.1);
  big('TOO BROKE', 70, 150, 190, '#ffffff'); big('FOR A GYM', 70, 330, 190, GOLD);
});

// B: the fix. "SO HE BUILT THIS", Kai in the suit, the $9 plan
render('thumbnail-b.png', () => {
  bg('#1d5a2c', '#030a05', 1300, 480, 1300);
  planCover(560, 760, 0.82, { rot: -0.06 });
  halo(1460, 470); bust('kai2', 1460, 470, 3.1, 'smug', { look: -0.4 });
  big('NO GYM.', 70, 150, 190, '#ffffff'); big('SO HE BUILT THIS', 70, 320, 130, GREEN, { glow: GREEN });
});
