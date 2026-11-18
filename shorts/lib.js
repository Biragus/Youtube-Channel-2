// Shared look for the shorts: near-black background, soft spotlights so the black-headed characters read, short labels.
const K = require('../engine/kit');
const W = 1080; const H = 1920;
function dark(cy = 900) { const c = K.ctx(); const g = c.createRadialGradient(W / 2, cy, 0, W / 2, cy, 1300); g.addColorStop(0, '#1c202c'); g.addColorStop(1, '#040506'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function spot(x, y, r, color = 'rgba(120,140,190,0.22)') { const c = K.ctx(); const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
const label = (str, x, y, size, color = '#ffffff', o = {}) => K.T(str, x, y, size, color, { spacing: o.spacing ?? 4, glow: o.glow, blur: o.blur ?? 30, align: o.align, weight: o.weight });
function watermark() { K.T('FROM ZERO', W / 2, 1855, 26, 'rgba(255,255,255,0.28)', { spacing: 8, weight: 800 }); }
function linkTag(k) { if (k <= 0) return; K.at(W / 2, 1765, k, () => { K.card(-190, -44, 380, 88, K.GREEN, 44); K.T('LINK IN BIO', 0, 3, 40, K.INK, { spacing: 3 }); }); }
function shade(color, a, x = 0, y = 0, w = W, h = H) { K.alpha(a, () => { K.ctx().fillStyle = color; K.ctx().fillRect(x, y, w, h); }); }
module.exports = { W, H, dark, spot, label, watermark, linkTag, shade };
