// Thumbnail: node episodes/01-nine-dollars/thumbnail.js -> out/thumbnail.png
const path = require('path');
const K = require('../../engine/kit');
const { big, bust, stamp, halo, render } = require('../../engine/thumb');

// "THE $9 IDEA", Kai, his driver badge stamped FIRED
render(path.join(__dirname, 'out', 'thumbnail.png'), () => {
  K.bg('#4a1218', '#070203', 1300, 500, 1300);
  K.at(540, 760, 1.0, () => {
    K.card(-12, -270, 24, 90, '#495057', 4);
    K.card(-300, -200, 600, 400, '#ffffff', 26, K.INK, 9); K.card(-300, -200, 600, 110, '#e8590c', 26);
    K.T('DRIVER', 0, -144, 52, '#ffffff', { spacing: 8 }); K.T('4471', 0, 70, 150, K.INK, { mono: true, weight: 800 });
    stamp('FIRED', 20, 40, 1.0, -0.22);
  }, -0.06);
  halo(1450, 470); bust('kai', 1450, 470, 3.1, 'worried', { look: -0.4 });
  big('THE $9', 70, 150, 190, '#ffffff'); big('IDEA', 70, 330, 190, K.GOLD);
});
