// THE TUNNEL. Everyone walks into a dark tunnel; most turn back in the darkest part, right before the light. Kai keeps walking out into it.
const K = require('../engine/kit'); const M = require('../engine/motion'); const { GREEN, GOLD, lerp, prog, ease, at, line, who, P } = K;
const { W, H, dark, label, makeShort, title, camera, blend, hop, pill, npc, spot } = require('./lib');
const CUT = 6.8; const FY = 1300; const EXIT = 2200;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const kx = lerp(200, 2400, prog(t, 0.3, 6.0)); const out = kx > EXIT;
  camera({ x: kx + 100, y: 1100, z: 1.0, t }, () => {
    c.fillStyle = '#0a0b10'; c.fillRect(300, 700, EXIT - 300, FY - 700); K.line([[300, 700], [EXIT, 700]], '#20253a', 20); K.line([[-500, FY], [3200, FY]], 'rgba(255,255,255,0.15)', 4);
    // the light at the end
    const g = c.createRadialGradient(EXIT, 1000, 0, EXIT, 1000, 900); g.addColorStop(0, 'rgba(255,236,170,0.9)'); g.addColorStop(1, 'rgba(255,236,170,0)'); c.fillStyle = g; c.fillRect(EXIT - 900, 100, 1800, 1800);
    label('THE DARKEST PART', 1500, 760, 30, '#495057', { spacing: 4 });
    for (let i = 0; i < 3; i++) { const turn = 1700 + i * 80; const t0 = 0.3 + i * 0.15; const fx = lerp(120 - i * 60, 2400, prog(t, t0, 6.0)); const back = fx > turn; const x = back ? turn - (fx - turn) : fx;
      if (x > -200) M.walk(npc(['#1c7ed6', '#e8590c', '#9c36b5'][i], ['curly', 'short', 'bun'][i]), x, FY, 0.7, { flip: back, expr: back ? 'sad' : 'neutral' }); if (back && i === 0 && fx - turn < 300) at(turn, FY - 380, 1, () => pill('TOO DARK', 0, 0, 22, '#9aa3b5', { pad: 30 })); }
    M.walk(out ? 'kai2' : 'kai', kx, FY, 0.75, { expr: out ? 'happy' : 'determined', armL: out ? [M.lerp(20, 150, M.smooth(prog(kx, EXIT, EXIT + 150))), 16] : undefined, armR: out ? [M.lerp(20, 150, M.smooth(prog(kx, EXIT, EXIT + 150))), 16] : undefined });
  });
  title(out ? 'THE LIGHT WAS RIGHT THERE.' : 'KEEP WALKING.', out ? GOLD : '#ffffff', 300, out ? 58 : 76, out ? GOLD : undefined);
});
