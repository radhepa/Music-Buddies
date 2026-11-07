# Ten design and mechanics checks

Ten rounds of checks on the banner (chat and songs), the pets' new moves and Kon's
redraw. Each round tested the real app in a test profile, driven over the DevTools
protocol, with screenshots. Three testers, role-played, rated how helpful it was
(out of 10), and asked for things. A request was taken only when it helps the app's
job (music while you work, with a small friend) at a cost that fits; refusals say why.

- **Maya**, college student: studies with music on, wants it quick and not distracting.
- **Theo**, music student: listens closely, cares about songs, queues and timing.
- **Priya**, engineering student: pokes at edge cases, speed and code quality.

| Round | Focus | Maya | Theo | Priya |
|---|---|---|---|---|
| 1 | First real use of the chat | 6 | 5 | 6 |
| 2 | Three voices, switching buddies | 7 | 6 | 6 |
| 3 | Banner placement at screen edges | 7 | 6 | 7 |
| 4 | Speed: frames, CPU, memory | 7 | 6 | 8 |
| 5 | Typing, keyboard, contrast | 7 | 7 | 8 |
| 6 | Features the testers asked for | 8 | 8 | 8 |
| 7 | Songs tab and the main window | 8 | 8 | 8 |
| 8 | Art: Kon's face and tails, Kasa's eye | 9 | 8 | 8 |
| 9 | Every move live in the pet window | 9 | 9 | 9 |
| 10 | Full run again, docs | 9 | 9 | 9 |

## Round 1 · first real use of the chat
Played a library song by name, asked what's on, paused, asked Kasa who she is, asked
for "something chill" (found a lofi mix on YouTube).
- Found: YouTube titles were said in full ("Rainy Jazz Cafe - Slow Jazz Music in Coffee
  Shop Ambience for Work, Study and Relaxation") in every line. **Fixed:** buddies say a
  short name (no "[Official Video]", cut at a word near 46 letters).
- Found: a 3½-hour video showed `214:00`. **Fixed:** hours shown as `3:34:00`.
- Theo: "a song the chat finds is gone once it ends." **Taken:** *save this* (or the
  heart on the banner) keeps it in your songs.
- Theo: "let me loop one song." **Taken:** *loop this* / *stop repeating*.

## Round 2 · three voices, switching buddies
Swapped Sara, Kon, Kasa with the banner open; asked each "how are you".
- Passed: name, face, placeholder and voice switch at once; each buddy keeps its own
  chat history.
- Maya: "Kasa shouts while I study." **Not taken:** the loud one is the point of Kasa;
  Sara is the quiet one, a click away under *Your buddy*.

## Round 3 · placement at screen edges
Pet in each corner, hidden in the left edge, at the bottom, in the middle.
- Passed: the banner always opens beside the pet and fully on screen, flips to the
  pet's right side at the left edge, and fits short screens.

## Round 4 · speed
- Moves step 64 times a second (smooth); standing still the pet steps 16 times a second.
- Banner closed: every process near 0% CPU.
- Priya: "the YouTube view holds about 435 MB." **Not taken:** that's YouTube's own
  player page; tearing it down after each song would cost a reload and lose your place
  on resume.

## Round 5 · typing, keyboard, contrast
- Found: sending a second message while the buddy was "typing" threw away what you
  typed. **Fixed:** the text stays in the box till it can be sent.
- Found: every playlist pill was its own Tab stop. **Fixed:** one stop, arrows move.
- Found: the small grey times and numbers were 3.7:1 contrast. **Fixed:** 5.3:1 (AA).
- Passed: Esc closes, Space plays/pauses outside the text box, the seek bar takes
  arrows/Home, reduced motion turns animation off.

## Round 6 · what the testers asked for
- Theo: "what's next?" **Taken:** buddies tell you the next song (or that shuffle
  decides).
- Maya: "when I say I'm studying and it offers something calm, let me just say yes."
  **Taken:** *yes* plays what the buddy offered.
- Priya: "run the tests on every push." **Taken:** GitHub Actions runs `npm test`.
- Maya: a Pomodoro timer. **Not taken:** focus timing is Catching Days' job; this app
  stays about music.
- Theo: lyrics. **Not taken:** no free lyrics source without an account or API key.
- Priya: an AI chat model. **Not taken:** it would need an API key, a network and
  sending what you type away; the scripted chat is instant, offline and private.
- Theo: dances in time with the song's BPM. **Not taken:** YouTube plays in its own
  player, so its sound can't be analysed; the dances keep one steady beat.
- Maya: a volume slider in the banner. **Not taken:** the banner stays small; *louder*
  / *quieter* in the chat and the window's slider cover it.

## Round 7 · songs tab and main window
Made a playlist, picked it, searched it, searched for nothing.
- Passed: counts, current song marked with moving bars, empty and no-match messages,
  the window shows loop-one and the song.
- Found: the chat's grey system scrollbar. **Fixed:** a thin one in the app's colours.

## Round 8 · art: Kon's face and tails, Kasa's eye
Kon was redrawn from the reference: a white nine-tailed fox with red flame tips and red
markings, no mask.
- Found: his first face had a tall bare forehead, a "bald baby" look. **Fixed:** lower
  crown, wider head, cheek fluff and a small muzzle.
- Found: the tails read as red spikes, then as blunt drops. **Fixed:** longer white tails
  fanned in even steps, with only the last fifth red, in soft licks of flame.
- Found: Kon's shut eyes looked like goggles, and Kasa's shut eye looked like a blank
  disc. **Fixed:** shut eyes are one lash line; Kasa's eye fades into its closed arc while
  it stretches and yawns.
- Passed: the foxfire stays inside the window in every move.

## Round 9 · every move live in the pet window
Fired all 13 acts on each buddy in the real pet window and caught two frames of each
(39 moves, 78 frames). The three dances were checked while music played.
- Passed: no move pokes out of the window; every act lets go on time and the pet goes
  back to standing; Kasa's *skip* and *special* fold it shut like a real umbrella.
- Theo: "can Kasa dance faster to fast songs?" **Not taken:** same reason as round 6;
  the app can't hear YouTube's sound.

## Round 10 · full run again, docs
- `npm test` passes (library and chat), every script passes `node --check`, and a search
  finds no API keys.
- Each buddy answered "hi! what's playing?" in its own voice ("I love how it ripples",
  "My tails keep the beat", "I can't stop hopping!").
- Exam talk, *yes*, *what's next*, the Songs tab and the playlist pills all work on all
  three.
- Maya: "the banner's title cuts off long YouTube names." **Not taken:** the whole name
  is in the song list just below, and a second line would push the chat down.
