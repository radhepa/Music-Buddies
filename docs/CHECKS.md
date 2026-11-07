# Design and mechanics checks

Twenty-five rounds of checks. The first ten on the banner (chat and songs), the pets' new moves and Kon's
redraw. Each round tested the real app in a test profile, driven over the DevTools
protocol, with screenshots. Three testers, role-played, rated how helpful it was
(out of 10), and asked for things. A request was taken only when it helps the app's
job (music while you work, with a small friend) at a cost that fits; refusals say why.
Rounds 11 to 25 came after a full code audit and are about a smarter chat; they are
at the end.

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

## Fifteen more checks (rounds 11 to 25)

A full code audit came first: one real bug (below, round 11), some copied helpers, and an
unchecked id from YouTube's page. Then the chat got smarter and every buddy got more
lines (81 to 143 each, 39 to 60 kinds of reply). Each round ran in the real app, with
the same testers, over the DevTools protocol, with screenshots.

| Round | Focus | Maya | Theo | Priya |
|---|---|---|---|---|
| 11 | A broken YouTube video | 9 | 8 | 9 |
| 12 | Shared helpers, checked video ids | 9 | 8 | 9 |
| 13 | Typos, the buddy's name, "ok" and "lol" | 9 | 9 | 9 |
| 14 | Who sings this, how long left | 9 | 9 | 9 |
| 15 | Volume and shuffle in words | 10 | 9 | 9 |
| 16 | Feelings and offers | 10 | 9 | 9 |
| 17 | Late night and morning | 10 | 9 | 9 |
| 18 | More like this, surprise me | 10 | 9 | 9 |
| 19 | No line twice in a row | 10 | 9 | 10 |
| 20 | Jokes and dancing | 10 | 9 | 10 |
| 21 | Questions about your library | 10 | 9 | 10 |
| 22 | Help, and the longest line | 10 | 9 | 10 |
| 23 | Speed and CPU | 10 | 9 | 10 |
| 24 | The quick chips | 10 | 9 | 10 |
| 25 | Full run again, docs | 10 | 9 | 10 |

## Round 11 · a broken YouTube video
- Found: when a YouTube video failed, the player marked it broken, stopped, and saved the
  library, then did it again every half second for as long as the app stayed open (the
  page keeps reporting the error). **Fixed:** a song already marked broken is left alone.
  Live: one save in 14 seconds instead of 28.
- Priya: "retry broken videos on their own?" **Not taken:** that is the same loop again.
  Clicking the song tries it once more.

## Round 12 · shared helpers, checked video ids
- Found: "what plays next", times (3:07) and HTML escaping were written twice, once for
  the player and once for the banner. **Fixed:** one copy in `common.js`, used by both
  pages and by the tests.
- Found: video ids read from YouTube's search page went into the list's HTML unchecked.
  **Fixed:** only real 11-character ids are kept; a test feeds it a bad one.
- Priya: "add a linter or types?" **Not taken:** the app has no build step. Every file
  passes `node --check`, and the tests run on every push.

## Round 13 · typos, the buddy's name, "ok" and "lol"
- *skp*, *puase*, *shuflle* now work. Only messages nothing else understood get a typo
  pass, so real words like *look* are never "fixed" into *loop*.
- "kon, skip" and "hey kasa" work: the name is just who you're talking to.
- *ok*, *lol*, *haha* get a short answer instead of "I don't get it".
- Maya: "two things in one message, like 'skip and turn it up'?" **Not taken:** one thing
  per message keeps the answers predictable, and each is one quick line.

## Round 14 · who sings this, how long left
- Found: a YouTube mix title was read as the singer. **Fixed:** YouTube songs use the
  channel; files use "Artist - Song" in the name, then the folder.
- Found: a 3-hour mix said "213:52 left". **Fixed:** times over an hour show hours
  (3:33:52).
- Theo: "show the lyrics or the BPM?" **Not taken:** both need an online service and a
  key, and the app can't hear YouTube's sound.

## Round 15 · volume and shuffle in words
- *volume 40*, *max volume*, *mute* work, and *a bit more* right after a volume change
  goes the same way again (live: *volume 3*, then *a bit more*, gave 18%).
- Found: "stop shuffling" paused the music. **Fixed:** shuffle on and off are read before
  pause, and turning off shuffle when it is off does nothing.
- Maya: "a volume slider in the banner?" **Not taken:** *volume 40* and the main window's
  slider cover it, and the banner is small.

## Round 16 · feelings and offers
- *I'm tired*, *stressed*, *sad*, *bored* and *good* get an answer in the buddy's voice
  and an offer (calm, happy or upbeat music). *yes* plays it.
- Found: *nah* to an offer skipped the song. **Fixed:** "no" to an offer is just no.
- Found: Kasa called stress "sleepy". **Fixed:** stress has its own words.
- Asking for music by a feeling ("something sad") still plays right away.
- Maya: "a study mode that runs the whole session?" **Not taken:** that is Catching Days'
  job; Music Buddies is the music.

## Round 17 · late night and morning
- A hello after midnight gets a gentle "it's late" and an offer of calm music; in the
  morning, a morning hello.
- Priya: "let me set the quiet hours?" **Not taken:** one more setting for a single line
  of text.

## Round 18 · more like this, surprise me
- *more like this* tries the same singer, then the same mood, then YouTube, then the same
  playlist. *another one like this* no longer skips.
- *surprise me* never picks the song already on.
- Theo: "learn from what I skip?" **Not taken:** a few skips say little, and a buddy that
  quietly changes what it plays is harder to trust.

## Round 19 · no line twice in a row
- Each buddy now has 143 lines (was 81). A reply skips lines said lately; when all were
  said, the oldest one comes back.
- Found: the fourth skip in a row repeated the last line. **Fixed** by that fallback.
- Found: "I'm offline" was always the same line. **Fixed:** it picks like the rest.

## Round 20 · jokes and dancing
- *tell me a joke* gets a short one in the buddy's voice; *dance* plays the special move.
- Maya: "more jokes!" **Taken:** each buddy has several now.
- Theo: "let me write my own lines?" **Not taken:** `voices.js` is plain text anyone can
  edit, and a settings screen for it is a lot for few users.

## Round 21 · questions about your library
- *what playlists do I have?* names them; with none, it says how to make one.
- Priya: "list every song in the chat?" **Not taken:** the Songs tab is right there and
  scrolls.

## Round 22 · help, and the longest line
- *help* and *what else can you do* list the new things.
- The longest line (Kon's help, 139 letters) fits in four lines of the banner.

## Round 23 · speed and CPU
- A reply takes 7 ms with 5000 songs; 200 letters of nonsense take 1 ms.
- Idle, the app uses about 0% CPU.

## Round 24 · the quick chips
- The chips under the chat still fit and still work with the new replies.
- Maya: "a 'Who sings this?' chip?" **Not taken:** the row is full; typing it works.

## Round 25 · full run again, docs
- `npm test` passes (library and chat, about 30 new checks), every script passes
  `node --check`, and a search finds no API keys. The chat is still all offline rules.
- Live chats with Sara, Kon and Kasa read right, in each one's voice.
