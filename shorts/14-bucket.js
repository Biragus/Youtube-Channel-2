// Short 14: DROP BY DROP. One sale at a time drips into a bucket, faster and faster, until it overflows.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, counter, floaters, rnd, money } = K;
const { W, dark, spot, label, watermark, shade, lifestyle, camera, impact, blend, hop, pulse } = require('./lib');
const CUT = 10.6; const FULL = 8.2; const BX = 620; const BY = 1480; const TAPY = 560;
// drop times: slow at first, faster every time
const DROPS = []; { let tt = 1.0; let gap = 1.1; while (tt < FULL + 2) { DROPS.push(tt); tt += gap; gap = Math.max(0.06, gap * 0.8); } }

module.exports = {
  cut: CUT, duration: CUT + 3,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, CUT + 2.5, CUT + 3)); return; }
    dark(1000); const c = K.ctx(); const fall = 0.55;
    const landed = DROPS.filter((d) => t > d + fall).length; const level = Math.min(1, landed / DROPS.filter((d) => d < FULL).length); const over = prog(t, FULL, FULL + 0.4);
    camera({ x: 560, y: lerp(1050, 1120, prog(t, 0, FULL)), z: lerp(1.0, 1.12, prog(t, 0, FULL)), shake: impact(t, FULL, 14), t }, () => {
      line([[60, BY + 10], [1020, BY + 10]], 'rgba(255,255,255,0.15)', 4);
      // the tap
      card(BX - 260, TAPY - 60, 300, 60, '#868e96', 20, INK, 5); card(BX - 30, TAPY - 60, 60, 100, '#868e96', 14, INK, 5); label('SALES', BX - 120, TAPY - 30, 30, INK, { spacing: 4 });
      // drops falling, each one a little green $9
      for (const d of DROPS) { const k = prog(t, d, d + fall); if (k <= 0 || k >= 1) continue; at(BX, lerp(TAPY + 50, BY - 230 * level - 20, k * k), 1, () => { c.fillStyle = GREEN; c.beginPath(); c.moveTo(0, -26); c.quadraticCurveTo(20, 4, 0, 18); c.quadraticCurveTo(-20, 4, 0, -26); c.fill(); }); }
      floaters(t, 60, (i, life) => circle(BX + Math.cos(i * 2.3) * life * 80, BY - 230 * level - 20 - Math.sin(life * Math.PI) * 40, 6 * (1 - life), '#8ce99a'), { every: Math.max(0.06, 0.6 - t * 0.06), from: 1.6, life: 0.4 });
      // the bucket
      c.fillStyle = 'rgba(57,255,20,0.75)'; c.beginPath(); c.moveTo(BX - 150 + 20 * (1 - level), BY - 230 * level); c.lineTo(BX + 150 - 20 * (1 - level), BY - 230 * level); c.lineTo(BX + 130, BY); c.lineTo(BX - 130, BY); c.closePath(); c.fill();
      c.strokeStyle = '#c9ccd2'; c.lineWidth = 12; c.beginPath(); c.moveTo(BX - 160, BY - 250); c.lineTo(BX - 130, BY); c.lineTo(BX + 130, BY); c.lineTo(BX + 160, BY - 250); c.stroke();
      c.lineWidth = 8; c.beginPath(); c.arc(BX, BY - 250, 160, Math.PI, 0); c.stroke();
      // overflowing
      if (over > 0) { floaters(t, 80, (i, life) => { const sx = i % 2 ? 1 : -1; at(BX + sx * (170 + life * 260), BY - 250 + life * life * 300 - Math.sin(life * 3) * 60, 1, () => { circle(0, 0, 18, GOLD); label('$', 0, 2, 22, '#5c3d00', { spacing: 0 }); }); }, { every: 0.03, from: FULL, life: 0.9 }); spot(BX, BY - 260, 420 * over, 'rgba(57,255,20,0.3)'); }
      // Kai: waits, checks, then jumps when it overflows
      const kx = 260; spot(kx, BY - 230, 240, 'rgba(57,255,20,0.15)');
      const waitPose = { lean: 0, tilt: 6 + Math.sin(t * 1.5) * 4, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] };
      who(over > 0.5 ? 'kai2' : 'kai', { x: kx, y: BY + 10 - hop(t, FULL + 0.2, 80) - hop(t, FULL + 0.8, 60) - hop(t, FULL + 1.4, 40), s: 0.95, pose: blend(waitPose, 'cheer', prog(t, FULL, FULL + 0.3)), expr: over > 0 ? 'happy' : (t > 5 ? 'smile' : 'neutral'), look: 0.5 });
    });
    counter('EARNED', money(Math.round(9 * landed)), W / 2, 1720, GREEN, pop(t, 1.0) * pulse(t, Math.max(0.1, 1.1 - t * 0.1), 0.05), { size: 80, rot: 0 });
    label('DROP BY DROP.', W / 2, 290, 90, '#ffffff', { spacing: 6 });
    watermark(); shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
