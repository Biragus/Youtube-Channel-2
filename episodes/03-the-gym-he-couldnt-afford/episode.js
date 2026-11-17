// Episode 03 settings for engine/build-episode.js. Sound levels follow the CLAUDE.md defaults (episode 02 review).
module.exports = {
  shots: ['shots-a', 'shots-b', 'shots-c'],
  assets: '../01-nine-dollars/audio',
  files: { 7: [['ch7a', 0, 7], ['ch7b', 7, 9]], 8: [['ch8a', 0, 10], ['ch8b', 10, 21]] },
  hold: {},
  gap: { 2: 0.35, 3: 0.35, 4: 0.35, 5: 0.35, 6: 0.35, 7: 0.35, 8: 0.35, 9: 0.35, 10: 0.35, 11: 0.35 },
  sfxScale: { counter: 1 / 5, paper: 1 / 5, chime: 1 / 5, send: 1 / 5, typing: 1 / 2, buzz: 1 / 3, notif: 1 / 3 },
  extraLevels: { clock: 0.075 },
  musicDips: [],
  music: [['music-sad', 2, 4, 0.22], ['music-curious', 5, 6, 0.21], ['music-drive', 7, 8, 0.24], ['music-warm', 9, 11, 0.24]],
};
