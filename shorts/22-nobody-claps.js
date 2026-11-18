// Short 22: NOBODY CLAPS AT THE START. Kai keeps posting to an empty room; post by post the seats fill and they cheer.
const K = require('../engine/kit');
const { GREEN, GOLD, INK, lerp, prog, ease, pop, at, alpha, card, line, circle, who, P, floaters, rnd } = K;
const { W, dark, spot, label, makeShort, title, camera, blend, hop } = require('./lib');
const CUT = 10.6; const STAGE = 1060; const ROWS = 4; const COLS = 7;
const fan = (i) => ({ hair: { type: ['short', 'curly', 'bun', 'long'][i % 4], color: ['#2b2b33', '#7a4a2a', '#3a2a4a'][i % 3] }, top: { type: 'tee', color: ['#1c7ed6', '#e8590c', '#9c36b5', '#2f9e44', '#e03131', '#f08c00'][i % 6] }, pants: '#3b4252', shoes: '#e5e5e5' });
const post = (t) => ({ lean: 0, tilt: -4, armL: [8, 4], armR: [150 + Math.sin(t * 3) * 6, 10], legL: [6, 0], legR: [6, 0] });

module.exports = makeShort(CUT, (t) => {
  dark(700); const c = K.ctx(); const fill = prog(t, 3.0, 8.6) ** 1.3; const filled = Math.floor(fill * ROWS * COLS); const posts = Math.max(1, Math.round(lerp(1, 100, prog(t, 0.8, 8.6) ** 1.2))); const party = t > 8.6;
  camera({ x: 540, y: lerp(820, 1120, ease(prog(t, 1.8, 4.5))), z: lerp(1.55, 0.98, ease(prog(t, 1.8, 4.5))), shake: party ? 3 : 0, t }, () => {
    // stage and spotlight
    spot(540, STAGE - 250, 340, 'rgba(255,240,200,0.28)'); card(140, STAGE, 800, 50, '#5a3a20', 8); c.fillStyle = 'rgba(255,240,200,0.06)'; c.beginPath(); c.moveTo(470, 300); c.lineTo(610, 300); c.lineTo(820, STAGE); c.lineTo(260, STAGE); c.closePath(); c.fill();
    // Kai on stage, holding up his phone and posting
    who(party ? 'kai2' : 'kai', { x: 540, y: STAGE - hop(t, 8.7, 60) - hop(t, 9.3, 40), s: 0.95, pose: party ? blend(post(t), 'cheer', prog(t, 8.6, 9.0)) : post(t), expr: party ? 'happy' : (t < 4 ? 'neutral' : 'determined'), prop: party ? undefined : 'phone' });
    at(760, STAGE - 420, pop(t, 0.8), () => { card(-110, -36, 220, 72, '#0d1018', 36, 'rgba(255,255,255,0.4)', 3); label(`POST #${posts}`, 0, 3, 32, '#ffffff', { spacing: 2 }); });
    // the seats, filling up row by row
    for (let r = 0; r < ROWS; r++) for (let k = 0; k < COLS; k++) { const i = r * COLS + k; const sx = 140 + k * 133 + (r % 2) * 30; const sy = STAGE + 220 + r * 150;
      card(sx - 50, sy - 30, 100, 60, '#2b2f3a', 10); if (i < filled) { const jump = party ? Math.abs(Math.sin(t * 8 + i)) * 20 : 0; at(sx, sy - 40 - jump, pop(t, 3.0 + (i / (ROWS * COLS)) * 5.6 / 1.3), () => K.head(fan(i), 0, 0, 0.42, party ? 'happy' : 'smile')); } }
    if (party) floaters(t, 40, (i, life) => label('CLAP', 140 + rnd(i) * 800, STAGE + 200 - life * 220, 30, GOLD, { spacing: 2 }), { every: 0.06, from: 8.6, life: 0.8 });
  });
  title(party ? 'NOW THEY CLAP.' : 'NOBODY CLAPS AT THE START.', party ? GOLD : '#ffffff', 300, party ? 84 : 56, party ? GOLD : undefined);
});
