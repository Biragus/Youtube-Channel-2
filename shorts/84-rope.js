// THE CLIMB. Kai climbs a rope; each knot is a month. His arms shake, he slips once, keeps going, reaches the top.
const K = require('../engine/kit'); const { GREEN, GOLD, lerp, prog, ease, pop, at, line, circle, who, floaters } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, confetti, spot } = require('./lib');
const CUT = 6.8; const TOP = 760; const BOT = 1500; const SLIP = 2.4; const DONE = 5.2;
const ky = (t) => (t < SLIP ? lerp(BOT, 1050, prog(t, 0.3, SLIP)) : t < SLIP + 0.4 ? lerp(1050, 1180, prog(t, SLIP, SLIP + 0.3)) : lerp(1180, TOP + 140, prog(t, SLIP + 0.6, DONE)));
module.exports = makeShort(CUT, (t) => {
  dark(900); const y = ky(t); const done = t > DONE;
  camera({ x: 540, y: Math.max(TOP + 200, y - 200), z: 1.0, shake: impact(t, SLIP, 10), t }, () => {
    card0(); line([[540, TOP], [540, BOT + 100]], '#c9a43a', 12);
    for (let m = 1; m <= 9; m++) { const yy = BOT - m * 75; circle(540, yy, 14, '#a08030'); label(`M${m}`, 600, yy, 22, '#9aa3b5', { spacing: 1 }); }
    spot(540, TOP - 60, 200, 'rgba(242,193,78,0.4)'); label('TOP', 760, TOP, 46, GOLD, { spacing: 6, glow: GOLD });
    const climb = { lean: 0, tilt: 0, armL: [160 + Math.sin(t * 8) * 10, 10], armR: [160 - Math.sin(t * 8) * 10, 10], legL: [30 + Math.sin(t * 8) * 20, -60], legR: [30 - Math.sin(t * 8) * 20, -60] };
    who(done ? 'kai2' : 'kai', { x: 540 + (t > SLIP && t < SLIP + 0.5 ? Math.sin(t * 50) * 8 : 0), y: done ? TOP - hop(t, DONE + 0.1, 40) : y, s: 0.8, pose: done ? 'cheer' : climb, expr: done ? 'happy' : (t > SLIP && t < SLIP + 0.8 ? 'worried' : 'determined') });
    if (!done) floaters(t, 8, (i, life) => circle(500 + i % 2 * 80, y - 380 - life * 40, 6, '#74c0fc'), { every: 0.4, from: 1, life: 0.5 });
    if (done) confetti(t, DONE, 540, TOP - 300);
  });
  title(done ? 'ONE KNOT AT A TIME.' : 'THE CLIMB IS SLOW.', done ? GREEN : '#ffffff', 300, 72, done ? GREEN : undefined);
});
function card0() { K.card(-200, BOT + 100, 1500, 900, '#141823', 0); K.line([[-200, BOT + 100], [1300, BOT + 100]], 'rgba(255,255,255,0.18)', 4); K.card(380, TOP - 20, 320, 24, '#495057', 6); }
