// Short 5: WHAT THEY SEE vs WHAT IT TOOK. The success on top of the iceberg, everything else under the water.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, lerp, prog, ease, pop, at, alpha, card, line, circle, who, rnd } = K;
const { W, H, dark, spot, label, watermark, shade, lifestyle } = require('./lib');
const CUT = 10.8; const SEA = 820; const PAN = 760;
const BELOW = ['NO SALES FOR WEEKS', 'LATE NIGHTS', 'BEING LAUGHED AT', 'STARTING OVER', 'SHOWING UP. EVERY DAY.'];

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    const c = K.ctx(); const cam = lerp(0, PAN, ease(prog(t, 2.2, 8.6))); const bob = Math.sin(t * 1.3) * 10;
    const z = lerp(1.14, 1, ease(prog(t, 0, 2.2))) + 0.04 * Math.sin(prog(t, 2.2, 8.6) * Math.PI);
    dark(500); c.save(); c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2 - cam);
    // sky and sea
    for (let i = 0; i < 40; i++) circle(rnd(i) * W, rnd(i + 9) * (SEA - 100), 2 + rnd(i + 4) * 2, 'rgba(255,255,255,0.5)');
    const sea = c.createLinearGradient(0, SEA, 0, SEA + 1900); sea.addColorStop(0, '#0d3b66'); sea.addColorStop(1, '#020a14'); c.fillStyle = sea; c.fillRect(0, SEA, W, 1900);
    // the iceberg: a small tip, a huge body
    c.save(); c.translate(0, bob); c.fillStyle = '#dff3ff'; c.beginPath(); c.moveTo(380, SEA); c.lineTo(500, 610); c.lineTo(590, 600); c.lineTo(700, SEA); c.closePath(); c.fill();
    c.fillStyle = 'rgba(160,215,245,0.55)'; c.beginPath(); c.moveTo(380, SEA); c.lineTo(150, 1250); c.lineTo(70, 1850); c.lineTo(290, 2420); c.lineTo(800, 2480); c.lineTo(1010, 1900); c.lineTo(950, 1250); c.lineTo(700, SEA); c.closePath(); c.fill();
    spot(545, 480, 260, 'rgba(242,193,78,0.35)'); who('kai2', { x: 545, y: 602, s: 0.72, pose: t < 2.2 ? 'power' : (Math.floor(t * 0.8) % 2 ? 'wave' : 'power'), expr: 'smug' }); c.restore();
    // bubbles rising past the iceberg
    for (let i = 0; i < 26; i++) { const by = SEA + 1700 - ((t * (60 + (i % 5) * 20) + i * 130) % 1650); circle(80 + rnd(i) * 920 + Math.sin(t * 2 + i) * 10, by, 4 + (i % 4) * 3, 'rgba(255,255,255,0.25)'); }
    line([[0, SEA], [W, SEA]], 'rgba(255,255,255,0.7)', 6);
    for (let i = 0; i < 6; i++) line([[i * 200 + (t * 40) % 200 - 100, SEA + 14], [i * 200 + (t * 40) % 200, SEA + 14]], 'rgba(255,255,255,0.3)', 4);
    // on top: the suit, the success
    label('WHAT THEY SEE', W / 2, 270, 76, GOLD, { spacing: 6, glow: GOLD });
    // underneath: what it took
    alpha(prog(t, 2.6, 3.2), () => label('WHAT IT TOOK', W / 2, SEA + 110, 70, '#a5d8ff', { spacing: 6 }));
    BELOW.forEach((s, i) => { const y = 1180 + i * 250; at(W / 2 + Math.sin(t * 1.6 + i) * 14, y + bob, pop(t, 3.2 + i * 1.05), () => { K.ctx().rotate(Math.sin(t * 1.2 + i) * 0.03); const w = K.textWidth(s, 46, false, 3) + 80; card(-w / 2, -50, w, 100, 'rgba(2,10,20,0.75)', 50, '#74c0fc', 4); label(s, 0, 2, 46, '#ffffff', { spacing: 3 }); }); });
    c.restore();
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
