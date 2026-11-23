// THE BLANK PAGE. Kai stares at a blank canvas, frozen. He makes one messy stroke. Then another. It becomes a masterpiece.
const K = require('../engine/kit'); const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, card, line, circle, who, rnd } = K;
const { W, dark, label, makeShort, title, camera, hop, ground, confetti, spot } = require('./lib');
const CUT = 6.8; const FY = 1450; const START = 1.8; const DONE = 5.2;
module.exports = makeShort(CUT, (t) => {
  dark(900); const c = K.ctx(); const k = prog(t, START, DONE); const done = t > DONE;
  camera({ x: 600, y: 1080, z: 1.0, t }, () => {
    ground(FY); line([[520, FY], [600, FY - 760]], '#6b4a2f', 10); line([[880, FY], [800, FY - 760]], '#6b4a2f', 10);
    card(460, FY - 900, 480, 600, '#f8f9fa', 6, '#c9a77a', 10);
    c.save(); c.beginPath(); c.rect(470, FY - 890, 460, 580); c.clip();
    if (k > 0) { c.fillStyle = '#ffa94d'; c.fillRect(470, FY - 890, 460, 300 * Math.min(1, k * 1.5)); c.fillStyle = '#ff6b6b'; circle(700, FY - 700, 90 * Math.min(1, k * 2), '#ffd43b'); c.fillStyle = '#2b8a3e'; c.beginPath(); c.moveTo(470, FY - 310); for (let x = 470; x <= 930; x += 20) c.lineTo(x, FY - 480 - Math.sin(x / 50) * 40 * Math.min(1, k * 1.4)); c.lineTo(930, FY - 310); c.closePath(); if (k > 0.3) c.fill(); for (let i = 0; i < 30 * k; i++) circle(470 + rnd(i) * 460, FY - 600 + rnd(i + 4) * 200, 6, ['#74c0fc', '#da77f2', '#ffffff'][i % 3]); }
    c.restore(); if (done) spot(700, FY - 600, 400, 'rgba(242,193,78,0.3)');
    const painting = t > START && !done; who(done ? 'kai2' : 'kai', { x: 300, y: FY - hop(t, DONE + 0.1, 40), s: 0.85, pose: done ? 'cheer' : (painting ? { lean: 6, tilt: 0, armL: [8, 4], armR: [86 + Math.sin(t * 10) * 30, -20], legL: [6, 0], legR: [6, 0] } : { lean: 0, tilt: 8, armL: [22, -100], armR: [22, -100], legL: [5, 0], legR: [5, 0] }), expr: done ? 'happy' : (painting ? 'determined' : 'worried'), look: 0.6 });
    if (done) confetti(t, DONE, 700, FY - 1100, 400);
  });
  title(done ? 'IT STARTED WITH ONE STROKE.' : (t > START ? 'JUST START.' : 'AFRAID OF THE BLANK PAGE?'), done ? GREEN : '#ffffff', 300, done ? 58 : 60, done ? GREEN : undefined);
});
