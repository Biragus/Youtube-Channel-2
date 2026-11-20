// Story short: EGO vs CONFIDENCE. Ego's tree shoots up fast with shallow roots; Kai's grows slowly with deep ones. The storm comes.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, spot, rain, cloud, whichOne } = require('./lib');
const CUT = 17.0; const END = 13.5; const GY = 1150; const STORM = 7.0;
const ego = { hair: { type: 'slick', color: '#2b2b33' }, top: { type: 'tee', color: '#f59f00' }, pants: '#343a40', shoes: '#e5e5e5', acc: ['chain'] };
function tree(x, h, r, rootD, spread, t, lean) { const c = K.ctx();
  c.strokeStyle = 'rgba(232,196,143,0.6)'; c.lineCap = 'round'; for (let i = 0; i < 7; i++) { const a = Math.PI * (0.15 + i * 0.12); c.lineWidth = 6; c.beginPath(); c.moveTo(x, GY + 10); let px = x; let py = GY + 10; for (let k = 0; k < rootD; k++) { px += Math.cos(a + Math.sin(k + i) * 0.4) * spread; py += Math.sin(a) * 30; c.lineTo(px, py); } c.stroke(); }
  c.save(); c.translate(x, GY); c.rotate(lean); card(-12 - h / 60, -h, 24 + h / 30, h, '#6b4a2f', 8); for (let k = 0; k < 6; k++) { const a = k * 1.05; circle(Math.cos(a) * r * 0.5, -h - 40 + Math.sin(a) * r * 0.4 + Math.sin(t * 3 + k) * 4, r * 0.55, k % 2 ? '#2b8a3e' : '#2f9e44'); } c.restore(); }
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(800); const storm = prog(t, STORM, STORM + 0.6) * (1 - prog(t, 11, 11.8)); const fall = ease(prog(t, STORM + 1.2, STORM + 2.2));
  camera({ x: 540, y: 1100, z: 1.0, shake: storm * 6 + impact(t, STORM + 2.2, 18), t }, () => {
    c.fillStyle = '#2a2219'; c.fillRect(-200, GY, 1500, 900); line([[-200, GY], [1300, GY]], '#5a4a36', 6); line([[540, 420], [540, GY + 700]], 'rgba(255,255,255,0.15)', 4);
    label('EGO', 270, 470, 50, '#ffd43b', { spacing: 8 }); label('CONFIDENCE', 810, 470, 50, GREEN, { spacing: 6, glow: GREEN });
    // ego: fast and tall, shallow roots; falls in the storm
    const eh = lerp(40, 560, ease(prog(t, 0.6, 3))); tree(270, eh, lerp(40, 260, ease(prog(t, 0.6, 3))), 3, 30, t, Math.sin(t * 8) * 0.05 * storm + fall * 1.45);
    who(ego, { x: 120, y: GY, s: 0.6, pose: fall > 0.5 ? 'shrug' : 'power', expr: fall > 0.5 ? 'shock' : 'smug' });
    // Kai: slow, deep roots, waters it; stands through the storm
    const kh = lerp(30, 520, ease(prog(t, 0.6, 12))); tree(810, kh, lerp(30, 250, ease(prog(t, 0.6, 12))), Math.floor(lerp(2, 18, prog(t, 0.6, 7))), 22, t, Math.sin(t * 8) * 0.02 * storm);
    const done = t > 11.5; spot(980, GY - 180, 160, 'rgba(57,255,20,0.15)');
    who(done ? 'kai2' : 'kai', { x: 980, y: GY - (done ? hop(t, 11.6, 40) : 0), s: 0.6, flip: true, pose: done ? 'cheer' : { lean: 0, tilt: 6, armL: [8, 4], armR: [70 + Math.sin(t * 6) * 6, -20], legL: [6, 0], legR: [6, 0] }, expr: done ? 'happy' : 'determined' });
    if (!done) floaters(t, 30, (i, life) => circle(890 - life * 30, GY - 230 + life * 220, 6, '#74c0fc'), { every: 0.1, from: 0.5, life: 0.6 });
    if (storm > 0) { cloud(300, 620, 1.4, '#343a52'); cloud(780, 600, 1.4, '#343a52'); rain(t, 0, 600, 1080, 600, 70); }
  });
  title(t > STORM ? 'THE STORM ALWAYS COMES.' : 'FAST vs DEEP', t > STORM ? '#ffffff' : '#ffffff', 300, 66);
  whichOne(t, END, [['EGO', '#ffd43b'], ['CONFIDENCE', GREEN]]);
});
