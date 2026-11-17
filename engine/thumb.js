// Thumbnail helpers: draw at 1920x1080, save at 1280x720. Three subjects at most: one text, Kai's head, one object.
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('./kit');

const big = (str, x, y, size, color, o = {}) => K.T(str, x, y, size, color, { stroke: '#000000', strokeWidth: size * 0.2, spacing: 2, align: o.align ?? 'left', glow: o.glow, blur: 50 });
// a head-and-shoulders shot of a character, head centred on (x, hy)
const bust = (spec, x, hy, s, expr, o = {}) => K.who(spec, { x, y: hy + 376 * s, s, expr, still: true, flip: o.flip, look: o.look });
// a rubber stamp
function stamp(str, x, y, s, rot, size = 120) { K.at(x, y, s, () => { const w = K.textWidth(str, size, false, 6) + 80; const c = K.ctx(); c.strokeStyle = K.RED; c.lineWidth = 16; c.beginPath(); c.roundRect(-w / 2, -size * 0.75, w, size * 1.5, 24); c.stroke(); K.T(str, 0, 6, size, K.RED, { spacing: 6 }); }, rot); }
// soft green light behind the head
function halo(x, y) { const c = K.ctx(); const g = c.createRadialGradient(x, y, 0, x, y, 520); g.addColorStop(0, 'rgba(57,255,20,0.45)'); g.addColorStop(1, 'rgba(57,255,20,0)'); c.fillStyle = g; c.fillRect(x - 600, y - 600, 1200, 1200); }
function render(file, draw) {
  const cv = createCanvas(1920, 1080); K.use(cv.getContext('2d')); K.setTime(0); draw();
  const small = createCanvas(1280, 720); small.getContext('2d').drawImage(cv, 0, 0, 1280, 720);
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, small.toBuffer('image/png')); console.log('wrote', file);
}
module.exports = { big, bust, stamp, halo, render };
