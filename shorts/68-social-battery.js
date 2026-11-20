// Story short: YOUR ENERGY IS LIMITED. Doubters plug into Kai and drain his battery; he unplugs them, and one supporter charges it back up.
const K = require('../engine/kit');
const { GREEN, GOLD, RED, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, spot } = require('./lib');
const CUT = 13.5; const FY = 1450; const KX = 540; const CUTOFF = 5.4; const FRIEND = 7.6;
const doubter = (i) => ({ hair: { type: ['short', 'slick', 'curly'][i], color: '#2b2b33' }, top: { type: 'tee', color: '#495057' }, pants: '#343a40', shoes: '#868e96', eye: '#ff6b6b' });
const friend = withFriend(); function withFriend() { return { hair: { type: 'bun', color: '#7a4a2a' }, top: { type: 'hoodie', color: '#1c7ed6' }, pants: '#343a40', shoes: '#e5e5e5' }; }
const SAY = ['TOO RISKY', 'GET A REAL JOB', "IT WON'T WORK"];
module.exports = makeShort(CUT, (t) => {
  const c = K.ctx(); dark(1000);
  const level = t < CUTOFF ? lerp(1, 0.12, prog(t, 0.8, CUTOFF)) : (t < FRIEND ? 0.12 : lerp(0.12, 1, prog(t, FRIEND + 0.3, FRIEND + 3.5)));
  const col = level > 0.6 ? GREEN : (level > 0.3 ? '#ffd43b' : RED);
  camera({ x: 540, y: 1080, z: lerp(1.0, 1.1, prog(t, 0, CUTOFF)) - 0.1 * ease(prog(t, CUTOFF, CUTOFF + 1)), shake: impact(t, CUTOFF, 16), t }, () => {
    line([[60, FY], [1020, FY]], 'rgba(255,255,255,0.15)', 4);
    // the doubters, each with a cable into Kai's battery, until he pulls them out
    for (let i = 0; i < 3; i++) { const dx = [160, 920, 840][i]; const away = ease(prog(t, CUTOFF, CUTOFF + 1.2)); const x = lerp(dx, dx + (dx < KX ? -500 : 500), away);
      if (t < CUTOFF + 0.1) { c.strokeStyle = 'rgba(255,107,107,0.7)'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, FY - 260); c.quadraticCurveTo((x + KX) / 2, FY - 600, KX, FY - 560); c.stroke(); floaters(t, 4, (k, life) => circle(lerp(KX, x, life), FY - 560 + Math.sin(life * Math.PI) * -80, 7, col), { every: 0.25, from: i * 0.1, life: 0.9 }); }
      who(doubter(i), { x, y: FY + (i === 2 ? 40 : 0), s: 0.65, flip: dx > KX, pose: away > 0 ? P.walk(t * 2) : 'crossed', expr: 'smug' });
      if (t < CUTOFF) alpha(pop(t, 0.6 + i * 0.6), () => pill(SAY[i], dx, FY - 420 - (i === 2 ? -40 : 0), 22, '#ff8787', { pad: 28 })); }
    // the friend who plugs in and charges him
    if (t > FRIEND) { const x = lerp(1250, 780, ease(prog(t, FRIEND, FRIEND + 1))); who(friend, { x, y: FY, s: 0.7, flip: true, pose: x > 790 ? P.walk(t * 1.8) : 'wave', expr: 'happy' }); if (x < 800) { c.strokeStyle = 'rgba(57,255,20,0.8)'; c.lineWidth = 6; c.beginPath(); c.moveTo(x, FY - 260); c.quadraticCurveTo((x + KX) / 2, FY - 600, KX, FY - 560); c.stroke(); floaters(t, 6, (k, life) => circle(lerp(x, KX, life), FY - 260 - Math.sin(life * Math.PI) * 300, 7, GREEN), { every: 0.12, from: FRIEND + 1, life: 0.8 }); pill('YOU GOT THIS.', x, FY - 440, 24, GREEN, { border: GREEN }); } }
    // Kai and his battery
    spot(KX, FY - 220, 260, `rgba(57,255,20,${0.1 + 0.2 * level})`);
    const yank = t > CUTOFF - 0.3 && t < CUTOFF + 0.4;
    who(level > 0.9 && t > FRIEND ? 'kai2' : 'kai', { x: KX, y: FY - (t > FRIEND + 3.5 ? hop(t, FRIEND + 3.6, 50) : 0), s: 0.85, pose: yank ? { lean: 0, tilt: -6, armL: [160, 20], armR: [160, 20], legL: [12, 0], legR: [12, 0] } : (level < 0.3 ? 'slump' : (t > FRIEND + 3.5 ? 'cheer' : 'stand')), expr: level < 0.3 ? 'tired' : 'happy' });
    at(KX, FY - 620, 1, () => { card(-70, -36, 140, 72, '#0d1018', 10, '#ffffff', 4); card(70, -14, 10, 28, '#ffffff', 3); card(-62, -28, 124 * level, 56, col, 6); label(`${Math.round(level * 100)}%`, 0, 3, 28, '#ffffff', { spacing: 1 }); });
  });
  title(t < CUTOFF ? 'YOUR ENERGY IS LIMITED.' : (t < FRIEND ? 'UNPLUG THE DOUBTERS.' : 'KEEP THE ONES WHO CHARGE YOU.'), t < CUTOFF ? '#ffffff' : GREEN, 300, t < FRIEND ? 64 : 50, t < CUTOFF ? undefined : GREEN);
});
