// Episode 02 settings for engine/build-episode.js. Music and sound effects are shared with episode 01.
module.exports = {
  shots: ['shots-a', 'shots-b'],
  assets: '../01-nine-dollars/audio',
  files: { 8: [['ch8a', 0, 11], ['ch8b', 11, 21]] },
  // extra silence after these lines, so big moments can land
  hold: { '1e': 1.6, '2s': 0.6, '3h': 0.5, '3n': 0.9, '4i': 0.8, '4l': 0.8, '5l': 0.6, '6e': 0.6, '7m': 0, '8g': 0.6, '8i': 0.7, '8u': 0.6, '9g': 1.0, '10j': 1.4, '10l': 0, '11c': 0.6, '11d': 2.4 },
  // shorter breaths after chapters 7 and 10 (owner: pauses too long)
  gap: { 7: 0.35, 10: 0.35 },
  // owner's review of the first cut: these sounds, everywhere in this episode, scaled from the first cut's level
  sfxScale: { counter: 1 / 5, paper: 1 / 5, chime: 1 / 5, send: 1 / 5, typing: 1 / 2 },
  // new slower clock (one tick a second). Its file is about 8.6 dB quieter than the old tick, so this level
  // lands it at roughly a fifth of where the old clock sat in the first cut, as asked
  extraLevels: { clock: 0.075 },
  // music lower from 1:45 to 2:00 (Mr. Graves scenes)
  musicDips: [[105, 120, 0.5]],
  // [track, first chapter, last chapter, volume, 'raw' = use as is]. Levels are the approved ones from episode 01.
  music: [
    ['music-intro-tense', 1, 1, 0.34, 'raw'],
    ['music-sad', 2, 4, 0.22], ['music-curious', 5, 6, 0.21], ['music-drive', 7, 8, 0.24], ['music-warm', 9, 11, 0.24],
  ],
};
