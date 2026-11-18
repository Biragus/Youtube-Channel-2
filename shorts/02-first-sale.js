// Short 2: WHO GETS THE FIRST SALE? Four lanes; only the one who ships and keeps going reaches the $.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, watermark, linkTag, shade, lifestyle, camera, impact, hop } = require('./lib');
const CUT = 15.0; // the payoff: cut to the lifestyle scene

const GOAL = 930; const START = 150; const ARRIVE = 13.5;
const person = (i, col) => ({ hair: { type: ['curly', 'short', 'bun'][i], color: '#2b2b33' }, top: { type: 'tee', color: col }, pants: '#3b4252', shoes: '#e5e5e5' });
const sitPose = { lean: 0, tilt: 10, drop: 0, armL: [10, 8], armR: [10, 8], legL: [85, -85], legR: [85, -85] };
// a line of thought above a character, like a whispered excuse
const says = (str, x, y, t, a, b) => alpha(prog(t, a, a + 0.2) * (1 - prog(t, b - 0.3, b)), () => label(str, x, y, 34, '#ff6b6b', { spacing: 2 }));
// x position along a list of [time, x] keyframes
const path = (t, keys) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], ease(prog(t, keys[i - 1][0], keys[i][0]))); return keys[keys.length - 1][1]; };

function lane(i, name, color, t, draw) {
  const y0 = 360 + i * 372; const floorY = y0 + 308; const won = i === 3 && t > ARRIVE;
  card(40, y0, 1000, 345, won ? '#0f2414' : '#101219', 22, won ? GREEN : 'rgba(255,255,255,0.12)', 4);
  circle(80, y0 + 40, 8, color); label(name, 100, y0 + 41, 30, color, { align: 'left', spacing: 4 });
  line([[70, floorY], [1010, floorY]], 'rgba(255,255,255,0.12)', 3);
  // the goal: a gold coin with a dollar sign
  const g = won ? 1 + 0.15 * Math.sin((t - ARRIVE) * 8) * Math.exp(-(t - ARRIVE)) : 1;
  at(GOAL, floorY - 130 + Math.sin(t * 2.5 + i) * 8, g, () => { spot(0, 0, 120, won ? 'rgba(57,255,20,0.35)' : 'rgba(242,193,78,0.25)'); K.ctx().scale(0.35 + 0.65 * Math.abs(Math.cos(t * (won ? 9 : 1.6) + i)), 1); circle(0, 0, 54, GOLD); circle(0, 0, 44, '#e0a92e'); label('$', 0, 4, 64, '#5c3d00', { spacing: 0 }); });
  draw(floorY);
  if (t > 15 && i < 3) shade('#000000', 0.45 * prog(t, 15, 15.6), 40, y0, 1000, 345);
}

module.exports = {
  cut: CUT,
  duration: 18.0,
  draw: (t) => {
    if (t >= CUT) { lifestyle(t - CUT); shade('#000000', prog(t, 17.5, 18.0)); return; }
    dark(900);
    const zin = ease(prog(t, ARRIVE - 0.6, ARRIVE + 0.5)); const zout = ease(prog(t, 0, 1.4));
    camera({ x: 540 + Math.sin(t * 0.5) * 6, y: lerp(lerp(700, 960, zout), 1080, zin), z: lerp(lerp(1.22, 1, zout), 1.12, zin), shake: impact(t, ARRIVE, 14), t }, () => {
    at(W / 2, 235, pop(t, 0.2), () => { label('WHO GETS THE', 0, -45, 64, '#ffffff', { spacing: 6 }); label('FIRST SALE?', 0, 40, 84, GOLD, { spacing: 6, glow: GOLD }); });
    // 1. the planner: plans forever, never starts
    lane(0, 'THE PLANNER', '#74c0fc', t, (fy) => { who(person(0, '#1c7ed6'), { x: START + 40, y: fy, s: 0.48, pose: { lean: 0, tilt: -6 + Math.sin(t * 2) * 4, armL: [34 + Math.sin(t * 14) * 8, -100 + Math.sin(t * 14) * 10], armR: [26, -150], legL: [5, 0], legR: [5, 0] }, expr: t > 8 ? 'worried' : 'neutral' }); at(START + 130, fy - 175, 0.8, () => { card(-40, -50, 80, 100, '#ffffff', 6); for (let k = 0; k < 4; k++) card(-28, -36 + k * 22, 56 - (k % 2) * 16, 8, '#adb5bd', 3); }, 0.1); says('NOT READY YET', 540, fy - 150, t, 2.5, 6.5); says('NEED A BETTER PLAN', 560, fy - 150, t, 8, 12.5); });
    // 2. the perfectionist: starts, then keeps going back to fix things
    lane(1, 'THE PERFECTIONIST', '#da77f2', t, (fy) => { const keys = [[0.8, START], [4.5, 520], [6.0, 330], [9.0, 580], [10.6, 360], [13.5, 600], [15.0, 420]]; const x = path(t, keys); const back = (t > 4.5 && t < 6) || (t > 9 && t < 10.6) || (t > 13.5 && t < 15); const moving = t > 0.8 && t < 15; who(person(1, '#9c36b5'), { x, y: fy, s: 0.48, pose: moving ? P.walk(t * 1.4) : 'stand', flip: back, expr: back ? 'worried' : 'neutral' }); says('ONE MORE FIX', 290, fy - 150, t, 4.3, 6.2); says('STILL NOT PERFECT', 310, fy - 150, t, 8.8, 10.8); });
    // 3. the quitter: fast start, gives up halfway
    lane(2, 'THE QUITTER', '#ffa94d', t, (fy) => { const x = path(t, [[0.6, START], [3.6, 600], [5.0, 640]]); const sat = t > 5.6; who(person(2, '#e8590c'), { x, y: fy, s: 0.48, pose: sat ? { ...sitPose, tilt: 14 + Math.sin(t * 1.5) * 4 } : (t < 5 ? P.walk(t * 1.8) : 'slump'), expr: t > 4.6 ? 'sad' : 'happy' }); says('NOT WORTH IT', x - 220, fy - 150, t, 5.0, 9.5); });
    // 4. Kai: slow and steady, ships and keeps going
    lane(3, 'THE ONE WHO SHIPS', '#39ff14', t, (fy) => { const x = lerp(START, GOAL - 150, prog(t, 1.0, ARRIVE)); spot(x, fy - 120, 180); who('kai', { x, y: fy - hop(t, ARRIVE, 60) - hop(t, ARRIVE + 0.55, 40) - hop(t, ARRIVE + 1.0, 25), s: 0.48, pose: t > ARRIVE ? 'cheer' : P.walk(t * 1.1), expr: t > ARRIVE ? 'happy' : 'determined' });
      if (t > ARRIVE) { at(460, fy - 150, pop(t, ARRIVE + 0.1), () => label('FIRST SALE!', 0, 0, 56, GREEN, { glow: GREEN })); floaters(t, 30, (k, life) => card(GOAL - 150 + rnd(k) * 260, fy - 300 + life * 260 - 100, 12, 20, ['#ffd43b', '#51cf66', '#74c0fc', '#ff8787'][k % 4], 3), { every: 0.04, from: ARRIVE, life: 1.2 }); } });
    });
    watermark();
    shade('#000000', 1 - prog(t, 0, 0.3));
  },
};
