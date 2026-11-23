// THE SEESAW. Kai sits alone on one end, outweighed by a pile of doubts. Each sale adds a coin to his side until it tips.
const K = require('../engine/kit'); const { GREEN, GOLD, RED, lerp, prog, ease, pop, at, card, line, circle, who } = K;
const { W, dark, label, makeShort, title, camera, impact, blend, hop, pill, ground, coin, sitPose, confetti } = require('./lib');
const CUT = 6.8; const FY = 1400; const PX = 540; const TIP = 4.4; const L = 380;
module.exports = makeShort(CUT, (t) => {
  dark(900); const coins = Math.min(12, Math.floor(prog(t, 0.6, TIP) * 13)); const a = t < TIP ? 0.22 - coins * 0.004 : lerp(0.17, -0.25, ease(prog(t, TIP, TIP + 0.6)));
  camera({ x: 540, y: 1150, z: 1.0, shake: impact(t, TIP + 0.6, 12), t }, () => {
    ground(FY); K.ctx().fillStyle = '#495057'; K.ctx().beginPath(); K.ctx().moveTo(PX - 60, FY); K.ctx().lineTo(PX, FY - 120); K.ctx().lineTo(PX + 60, FY); K.ctx().closePath(); K.ctx().fill();
    at(PX, FY - 120, 1, () => { card(-L - 20, -14, 2 * L + 40, 28, '#8a5a3c', 8);
      // right: the doubts
      ['DOUBT', 'FEAR', 'EXCUSES', '"LATER"'].forEach((s, i) => { card(L - 220 + (i % 2) * 110, -60 - Math.floor(i / 2) * 50, 100, 46, '#3b1f1f', 6, RED, 3); label(s, L - 170 + (i % 2) * 110, -36 - Math.floor(i / 2) * 50, 18, '#ffb3b3', { spacing: 1 }); });
      // left: Kai and the coins that land beside him
      for (let i = 0; i < coins; i++) coin(-L + 130 + (i % 4) * 44, -36 - Math.floor(i / 4) * 40, 20, 0);
      who(t > TIP + 0.6 ? 'kai2' : 'kai', { x: -L + 40, y: -14, s: 0.6, pose: t > TIP + 0.6 ? 'cheer' : sitPose, expr: t > TIP + 0.6 ? 'happy' : 'determined', still: true });
    }, a);
    if (t > TIP + 0.6) confetti(t, TIP + 0.6, PX - L, FY - 600);
  });
  K.at(W / 2, 400, 1, () => pill(`${coins} SALES`, 0, 0, 34, GREEN, { border: GREEN }));
  title(t > TIP ? 'IT TIPPED.' : 'ONE SALE AT A TIME.', t > TIP ? GREEN : '#ffffff', 300, 76, t > TIP ? GREEN : undefined);
});
