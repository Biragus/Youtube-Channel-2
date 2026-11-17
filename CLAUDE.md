# Transformation-story YouTube channel

Animated stickman videos, 8 minutes or longer, drawn entirely in code. Episode 01 (`episodes/01-nine-dollars/`) is the approved reference for look, pacing and sound. Copy its structure for new episodes.

## Working rules from the channel owner

- Keep chat replies very short. They dislike long messages.
- Never generate voice without approval. Show the script first, then generate.
- Videos must be over 8 minutes (mid-roll ads). Charliee reads about 175 words per minute, so a script needs roughly 1,550 to 1,600 words.
- Large emoji look blurry. Anything drawn bigger than about 130 px must be a code-drawn icon (`engine/icons.js`).
- On-screen captions should be sparse; they called a busy end caption "ugly".

## Channel goal

The channel sells the owner's own product: teaching people how to make and sell digital products. Every story should show a digital product (template, guide, course, tool, kit) built from the hero's own experience, and the closing call to action points viewers there. That CTA is the most important line in the video.

## Story format

From episode 03: no hook or title card. Open straight into the story ("You work in a call centre…"). Episodes 01–02 had a hook.
Starting situation → the problem → work toward the fix, failing first → the problem solved, new life → doubters return → close.
The call to action comes only at the very end, with the subscribe line, and points to the guide: "the step-by-step guide is linked in my bio" (from episode 03; earlier episodes said "comment LEARN").
The hero is usually broke as well as stuck, and the digital product fixes his money too.
Quick cuts: one shot per narration line, about 5 seconds each.

## Characters

Hero: Kai, black head, neon green glowing eyes, spiky hair. Grey hoodie before, navy suit with orange shirt after. Supporting cast and the rig are in `engine/characters.js`.

## Voice

ElevenLabs "Charliee - Calm Cinematic Narrator", voice id `e70vjI59gG5dZUD6cZTQ`, model `eleven_v4`, one take per chapter, each line as its own paragraph (the pauses are used to time the shots).

## Approved sound mix (owner signed off on episode 01, version 3)

These levels live in `episodes/01-nine-dollars/build.js` and `hook.js`. Reuse them unchanged.

- Voice at full level (1.0).
- Effects: every effect is multiplied by a global gain of 0.5, on top of its own level below.
- Music after the hook: compress and level each track first (`acompressor=threshold=-30dB:ratio=6:attack=20:release=500,loudnorm=I=-24:LRA=3:TP=-2`), then volume 0.21 to 0.24. That is about 11 dB under the voice. New generated tracks get the same treatment, so their raw loudness does not matter.
- Hook music: the raw tense intro track at volume 0.34 (the owner wanted the opening more impactful).
- Final file: `loudnorm=I=-15:TP=-1.5:LRA=11`.
- Long sounds (pen, typing, crowd, ticking, counter) are cut when their shot ends.

Per-effect level before the 0.5 gain:

| Effect | Level | Effect | Level |
|---|---|---|---|
| whoosh (every cut, ×0.8) | 0.26 | boom | 1.0 |
| slam | 0.55 | riser | 0.4 |
| heartbeat | 0.9 | buzz | 0.16 |
| counter | 0.075 | laugh | 0.1 |
| clock tick | 0.0475 | cash | 0.55 |
| notification | 0.8 | door | 0.5 |
| typing | 0.27 | page turn | 0.1625 |
| error | 0.5 | engine | 0.25 |
| poof | 0.7 | record scratch | 0.25 |
| water drip | 0.87 | chime | 0.7 |
| glass | 0.7 | pen | 0.36 |
| crowd | 0.33 | send | 0.8 |

Shot-level multipliers the owner asked for: scroll "send" dings ×0.1 to 0.12, video-post "send" ×0.3, refund "send" ×0.33, transformation poof ×0.7.
### Episode 02 review: use these as the current defaults

The owner's notes on episode 02 lowered several sounds further. New episodes should start from these, not from the table above. They live in `episodes/02-rejected-100-times/episode.js` (`sfxScale`, `extraLevels`) and the shot files, and `engine/build-episode.js` applies them.

- Counter, page turn, chime/ding, send/beep: a fifth of the table level, everywhere.
- Typing: half of the table level (a quarter for a long typing shot).
- Shot multipliers must stay at 1 or below. Episode 02's first cut used ×3–×5 on ticks, counters and page turns, and every one of them came back as "too loud".
- Clocks and second-counting use the slow clock (`episodes/02-rejected-100-times/audio/sfx/clock.mp3`, one tick a second) at level 0.075, never the fast tick.
- Phone buzz and notification pop-ups: about a third.
- Music: dip it (`musicDips`) under any long dialogue scene; the owner heard it climb under Mr. Graves.
- Pauses: no more than about half a second of silence after a chapter's last line (`gap` 0.35, `hold` 0).
- Captions and corner tags are drawn in screen space so the camera push-in never crops them; keep tag text short.

The owner's ear is the test: the general direction of every note was "quieter effects, music well under the voice".

## Building

Episode 01 has its own scripts (`episodes/01-nine-dollars/hook.js` and `build.js`). Every later episode uses the shared builder with an `episode.js` settings file:

```bash
node engine/build-episode.js episodes/02-rejected-100-times
```

`--sheets` writes one still per shot for checking, `--reuse-frames` redoes only the sound, `--list` prints where each shot and sound lands.
