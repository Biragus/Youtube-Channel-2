// Thumbnails: node episodes/03-the-gym-he-couldnt-afford/thumbnail.js -> out/thumbnail-a.png (chosen), thumbnail-b.png
const path = require('path');
const K = require('../../engine/kit');
const { big, bust, stamp, halo, render } = require('../../engine/thumb');
const { priceCard, planCover } = require('./shots-a')._shared;
const out = (n) => path.join(__dirname, 'out', n);

// A (chosen): "TOO BROKE FOR A GYM", Kai, the gym price card stamped DENIED
render(out('thumbnail-a.png'), () => {
  K.bg('#4a1218', '#070203', 1300, 500, 1300);
  K.at(560, 720, 1.05, () => { priceCard(0, 0, 1, { rot: -0.08 }); stamp('DENIED', 10, 30, 1.0, -0.22); });
  halo(1450, 470); bust('kai', 1450, 470, 3.1, 'worried', { look: -0.4 });
  big('TOO BROKE', 70, 150, 190, '#ffffff'); big('FOR A GYM', 70, 330, 190, K.GOLD);
});

// B: "NO GYM. SO HE BUILT THIS", Kai in the suit, the $9 plan
render(out('thumbnail-b.png'), () => {
  K.bg('#1d5a2c', '#030a05', 1300, 480, 1300);
  planCover(560, 760, 0.82, { rot: -0.06 });
  halo(1460, 470); bust('kai2', 1460, 470, 3.1, 'smug', { look: -0.4 });
  big('NO GYM.', 70, 150, 190, '#ffffff'); big('SO HE BUILT THIS', 70, 320, 130, K.GREEN, { glow: K.GREEN });
});
