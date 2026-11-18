// Short 3: WHAT WEIGHS MORE? A pile of excuses on one side of the scale, one small action on the other.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, easeOut, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, watermark, linkTag, shade, lifestyle } = require('./lib');
const CUT = 10.8; // the payoff: cut to the lifestyle scene

const PX = 540; const PY = 680; const ARM = 320; const ROPE = 230;
const EXCUSES = ['NO TIME', 'NO MONEY', 'NOT READY', 'TOO LATE', 'WHAT IF I FAIL?'];
const DROP = (i) => 1.2 + i * 0.85;            // when each excuse lands
const PLACE = 8.0;                               // when the action lands
// beam angle: positive tips the left pan down
function angle(t) {
  const n = EXCUSES.filter((_, i) => t > DROP(i) + 0.35).length;
  if (t < PLACE) return lerp(0, 0.34, ease(Math.min(1, (n + prog(t, DROP(Math.max(0, n - 1)) + 0.35, DROP(Math.max(0, n - 1)) + 0.8) * 0 ) / 5)));
  const u = t - PLACE; return -0.42 + 0.76 * Math.exp(-2.6 * u) * Math.cos(6 * u);
}
const ends = (a) => [[PX - ARM * Math.cos(a), PY + ARM * Math.sin(a)], [PX + ARM * Math.cos(a), PY - ARM * Math.sin(a)]];

function pan(x, y, glow) { // hanging from (x, y); the pan's rim is ROPE below
  const c = K.ctx(); line([[x, y], [x - 120, y + ROPE]], 'rgba(255,255,255,0.55)', 4); line([[x, y], [x + 120, y + ROPE]], 'rgba(255,255,255,0.55)', 4);
  if (glow) spot(x, y + ROPE, 260, glow);
  c.fillStyle = '#c9a43a'; c.beginPath(); c.moveTo(x - 140, y + ROPE); c.quadraticCurveTo(x, y + ROPE + 110, x + 140, y + ROPE); c.closePath(); c.fill();
  card(x - 150, y + ROPE - 8, 300, 16, '#e6c35a', 8);
}

module.exports = {
  duration: 13.8,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, 13.3, 13.8)); return; }
    dark(800);
    at(W / 2, 180, pop(t, 0.2), () => { label('WHAT WEIGHS', 0, -45, 70, '#ffffff', { spacing: 6 }); label('MORE?', 0, 45, 90, GOLD, { spacing: 8, glow: GOLD }); });
    const a = angle(t); const [L, R] = ends(a); const won = t > PLACE + 0.4;
    line([[PX, 300], [PX, PY]], 'rgba(255,255,255,0.6)', 5); line([L, R], '#e6c35a', 12); circle(PX, PY, 16, '#e6c35a');
    pan(L[0], L[1], null); pan(R[0], R[1], won ? 'rgba(57,255,20,0.35)' : null);
    // the excuses stack up on the left pan, then get thrown off
    const toss = prog(t, PLACE + 0.25, PLACE + 1.6);
    EXCUSES.forEach((s, i) => {
      const land = DROP(i); if (t < land - 0.5) return;
      const fall = easeOut(prog(t, land - 0.5, land)); const bx = L[0] + (i % 2 ? 12 : -10); const by = L[1] + ROPE - 40 - i * 62;
      const fx = bx + toss * (i % 2 ? -1 : 1) * (200 + i * 60); const fy = lerp(by - 500, by, fall) - toss * (300 - i * 40) + toss * toss * 900;
      alpha(1 - toss, () => at(fx, fy, 1, () => { const w = K.textWidth(s, 30, false, 2) + 50; card(-w / 2, -28, w, 56, '#3b1f1f', 10, RED, 4); label(s, 0, 2, 30, '#ffb3b3', { spacing: 2 }); }, (i % 2 ? 0.05 : -0.04) + toss * (i % 2 ? -2 : 2)));
    });
    // the one action: a small glowing product, thrown up onto the right pan
    if (t > 6.2) {
      const k = easeOut(prog(t, 6.6, PLACE)); const sx = lerp(640, R[0], k); const sy = lerp(1270, R[1] + ROPE - 46, k) - Math.sin(k * Math.PI) * 220;
      at(sx, sy, pop(t, 6.2), () => { spot(0, 0, 140, 'rgba(57,255,20,0.45)'); card(-40, -50, 80, 100, '#2f9e44', 10, '#b2f2bb', 4); card(-40, -50, 80, 30, '#1e7a33', 10); line([[-16, 18], [-4, 30], [18, 4]], '#ffffff', 7); });
    }
    alpha(prog(t, 2, 2.6), () => label('EXCUSES', L[0], L[1] + ROPE + 110, 40, '#ff8787', { spacing: 6 }));
    alpha(prog(t, PLACE - 0.4, PLACE), () => label('ONE ACTION', R[0], R[1] + ROPE + 110, 40, GREEN, { spacing: 6, glow: GREEN }));
    // Kai watches, then acts
    spot(540, 1440, 400);
    const throwing = t > 6.2 && t < PLACE + 0.3;
    who('kai', { x: 540, y: 1700, s: 1.1, pose: won ? 'cheer' : (throwing ? 'wave' : 'stand'), expr: won ? 'happy' : (t > 5.6 ? 'determined' : 'worried') });
    if (won) floaters(t, 24, (i, life) => card(R[0] - 180 + rnd(i) * 360, R[1] + 120 - life * 260, 12, 20, ['#51cf66', '#ffd43b', '#74c0fc'][i % 3], 3), { every: 0.05, from: PLACE + 0.4, life: 1.2 });
    watermark();
    shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
