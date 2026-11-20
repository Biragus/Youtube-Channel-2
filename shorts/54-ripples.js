// Short 54: ONE POST. Kai drops a stone into still water; the ripples spread and light up people further and further away.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, H, dark, spot, label, makeShort, title, camera, impact, blend, hop, pill } = require('./lib');
const CUT = 6.8; const DROP = 1.2; const CX = 540; const CY = 1100;
const dots = Array.from({ length: 70 }, (_, i) => { const a = i * 2.39996; const r = 160 + Math.sqrt(i) * 150; return [CX + Math.cos(a) * r, CY + Math.sin(a) * r * 0.75, r]; });
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(1000); const since = t - DROP; const reach = since > 0 ? since * 520 : 0; const lit = dots.filter((d) => d[2] < reach).length;
  camera({ x: CX, y: CY, z: lerp(1.5, 0.75, ease(prog(t, DROP, DROP + 3.5))), shake: impact(t, DROP, 10), t }, () => {
    c.fillStyle = '#0d2236'; c.beginPath(); c.ellipse(CX, CY, 1500, 1150, 0, 0, Math.PI * 2); c.fill();
    // ripples
    for (let k = 0; k < 6; k++) { const r = (since - k * 0.45) * 520; if (r <= 0) continue; c.strokeStyle = `rgba(116,192,252,${Math.max(0, 0.6 - r / 3000)})`; c.lineWidth = 8; c.beginPath(); c.ellipse(CX, CY, r, r * 0.75, 0, 0, Math.PI * 2); c.stroke(); }
    // the people the ripples reach: dim heads that light up green
    dots.forEach(([x, y, r], i) => { const on = r < reach; if (on) spot(x, y, 70, 'rgba(57,255,20,0.3)'); K.head(on ? 'kai' : { hair: { type: 'short', color: '#2b2b33' }, eye: '#495057' }, x, y + (on ? -Math.abs(Math.sin(t * 5 + i)) * 8 : 0), 0.32, on ? 'happy' : 'neutral'); });
    // the stone, falling in
    if (t < DROP) at(CX, lerp(CY - 900, CY, prog(t, 0.2, DROP) ** 2), 1, () => { circle(0, 0, 26, '#adb5bd'); label('1 POST', 0, -60, 30, '#ffffff', { spacing: 2 }); });
    if (t > DROP && t < DROP + 0.6) floaters(t, 16, (i, life) => circle(CX + Math.cos(i) * life * 90, CY - Math.sin(i * 0.5 + 1) * 150 * life + life * life * 200, 8, '#74c0fc'), { every: 0.01, from: DROP, life: 0.6 });
  });
  pill(`REACHED: ${Math.round(lit * 143).toLocaleString('en-US')}`, W / 2, 450, 44, GREEN, { border: GREEN });
  title('ONE POST.', '#ffffff', 280, 80); if (t > 2.6) title('ENDLESS REACH.', GREEN, 380, 70, GREEN);
});
