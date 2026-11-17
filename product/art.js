// Renders the illustrations used in the guide and the Payhip images: node product/art.js -> product/build/art/*.png
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('@napi-rs/canvas');
const K = require('../engine/kit');
const { CAST, drawCharacter, drawHead } = require('../engine/characters');

const OUT = path.join(__dirname, 'build', 'art'); fs.mkdirSync(OUT, { recursive: true });
const save = (name, cv) => fs.writeFileSync(path.join(OUT, `${name}.png`), cv.toBuffer('image/png'));

// transparent figure sheets: [name, spec, pose, expr, extra]
const figures = [
  ['kai-before', CAST.heroBefore, 'slump', 'tired'],
  ['kai-after', CAST.heroAfter, 'power', 'smug'],
  ['kai-think', CAST.heroBefore, K.P.think, 'determined'],
  ['kai-point', CAST.heroAfter, 'point', 'smile'],
  ['kai-cheer', CAST.heroAfter, 'cheer', 'happy'],
  ['kai-phone', CAST.heroBefore, 'phone', 'hopeful', { prop: 'phone' }],
  ['kai-wave', CAST.heroAfter, 'wave', 'happy'],
  ['kai-shrug', CAST.heroBefore, 'shrug', 'worried'],
  ['kai-type', CAST.heroBefore, K.P.type, 'determined'],
  ['sam-wave', CAST.believer, 'wave', 'happy'],
];
for (const [name, spec, pose, expr, extra] of figures) {
  const cv = createCanvas(700, 1000); const c = cv.getContext('2d'); K.use(c); K.setTime(0);
  drawCharacter(c, spec, { x: 350, y: 960, s: 1.45, pose, expr, ...(extra ?? {}) });
  save(name, cv);
}

// Kai typing at a laptop (scene with transparent background)
{
  const cv = createCanvas(1400, 900); const c = cv.getContext('2d'); K.use(c); K.setTime(0);
  drawCharacter(c, CAST.heroBefore, { x: 380, y: 1180, s: 1.6, pose: K.P.type, expr: 'determined' });
  K.laptop(930, 760, 1.05, () => { K.sheet(20, 20, 600, 360, 8, 5, { seed: 4 }); });
  K.card(0, 790, 1400, 110, '#3b2a1a', 18);
  save('kai-laptop', cv);
}

// big face for the cover
{
  const cv = createCanvas(900, 900); const c = cv.getContext('2d');
  c.save(); c.translate(450, 520); c.scale(5.2, 5.2); drawHead(c, CAST.heroBefore, 0, 0, 'determined', 0); c.restore();
  save('kai-face', cv);
}

// icons used as section markers
for (const [name, e] of [['i-doc', '📄'], ['i-clip', '📋'], ['i-book', '📘'], ['i-tools', '🛠️'], ['i-money', '💰'], ['i-map', '🗺️'], ['i-receipt', '🧾'], ['i-shield', '🛡️'], ['i-laptop', '💻'], ['i-stop', '🛑'], ['i-bag', '🧳'], ['i-key', '🔑']]) {
  const cv = createCanvas(240, 240); const c = cv.getContext('2d'); K.use(c); K.E(e, 120, 120, 200); save(name, cv);
}
console.log('art written to', OUT);
