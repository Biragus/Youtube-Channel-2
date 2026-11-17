// Thumbnail: node episodes/02-rejected-100-times/thumbnail.js -> out/thumbnail.png
const path = require('path');
const K = require('../../engine/kit');
const { big, bust, stamp, halo, render } = require('../../engine/thumb');
const { email } = require('./shots-a')._shared;

// "REJECTED 100 TIMES", Kai, the rejection email stamped #100
render(path.join(__dirname, 'out', 'thumbnail.png'), () => {
  K.bg('#4a1218', '#070203', 1300, 500, 1300);
  K.at(560, 740, 1.15, () => { email(0, 0, 1, { rot: -0.08 }); stamp('#100', 60, 40, 1.0, -0.2, 130); });
  halo(1450, 470); bust('kai', 1450, 470, 3.1, 'sad', { look: -0.4 });
  big('REJECTED', 70, 150, 190, '#ffffff'); big('100 TIMES', 70, 330, 190, K.GOLD);
});
