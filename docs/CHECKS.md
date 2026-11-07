# Design and mechanics checks

Fifty rounds of checks. The first ten on the banner (chat and songs), the pets' new moves and Kon's
redraw. Each round tested the real app in a test profile, driven over the DevTools
protocol, with screenshots. Three testers, role-played, rated how helpful it was
(out of 10), and asked for things. A request was taken only when it helps the app's
job (music while you work, with a small friend) at a cost that fits; refusals say why.
Rounds 11 to 25 came after a full code audit and are about a smarter chat. Rounds 26
to 45 came after the rename to Music Buddies and a second audit; 46 to 50 test a bad
day (a damaged file, no internet). All are at the end.

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

## Twenty more checks (rounds 26 to 45)

The app was renamed from Sara to Music Buddies: Sara is now only the kappa, one of three
buddies. A second full code audit found 15 things; all are fixed below. A sweep of about
100 everyday phrases found the chat's misses. Same testers, same way of testing: the
real app in a test profile, over the DevTools protocol, with screenshots.

| Round | Focus | Maya | Theo | Priya |
|---|---|---|---|---|
| 26 | The new name | 10 | 9 | 10 |
| 27 | Upgrading from Sara | 10 | 9 | 10 |
| 28 | Switching buddies in the chat | 10 | 10 | 10 |
| 29 | The quick chips again | 10 | 9 | 10 |
| 30 | Songs in the folder | 10 | 10 | 10 |
| 31 | Second code audit | 10 | 9 | 10 |
| 32 | YouTube: search, replay, broken videos | 10 | 10 | 10 |
| 33 | Speed with 5000 songs | 10 | 9 | 10 |
| 34 | Slow network, unplugged monitor | 10 | 9 | 10 |
| 35 | Polite words and a plain yes | 10 | 10 | 10 |
| 36 | "play" plus a title | 10 | 10 | 10 |
| 37 | Add to a playlist by name | 10 | 10 | 10 |
| 38 | Removing stays a click | 10 | 10 | 10 |
| 39 | Pasted links | 10 | 10 | 10 |
| 40 | A hundred everyday phrases | 10 | 10 | 10 |
| 41 | Open, sing, who is this | 10 | 10 | 10 |
| 42 | Keyboard and screen readers | 10 | 9 | 10 |
| 43 | Long titles | 10 | 10 | 10 |
| 44 | Memory and startup | 10 | 10 | 10 |
| 45 | Full run again, docs | 10 | 10 | 10 |

## Round 26 · the new name
- Every window, menu, dialog and the app's description say Music Buddies. The pages talk
  to the app through `window.buddies`; nothing is called `sara` except the kappa.
- The main window's folder button is now "Open the music folder".

## Round 27 · upgrading from Sara
- On first start the app copies `sara.json` to `library.json` and moves `Music\Sara` to
  `Music\Music Buddies`, and every song's path moves with it. Checked live.
- Found by the audit: an empty `Music Buddies` folder (made by an earlier start) stopped
  the move. **Fixed:** an empty one is removed first. A full one is never touched.
- A test checks that a folder called "Sarah" is not moved by mistake.

## Round 28 · switching buddies in the chat
- *switch to Kon*, *can I talk to Sara*, *swtich to kasa* (typo), *next buddy* and
  *switch buddy* work. The buddy says goodbye, the next one comes out and says hello.
- *who is Kasa?*, *who are your friends?* and *what is Music Buddies?* get answers.
- Theo: "switch buddy by chat." **Taken** (this round).

## Round 29 · the quick chips again
- Found: round 24 said the chips fit. They did not: the Hype chip was cut off (the row was
  439 pixels wide in a 371-pixel banner). That check measured the wrong box. **Fixed:**
  the Skip chip is gone (typing *skip* works) and the chips are a little smaller. Now the
  row is 371 of 371.

## Round 30 · songs in the folder
- Test songs dropped into the folder showed up by themselves, with names from the file
  ("01 - Test_Tone A" became "Test Tone A") and the folder as the album.
- Kasa played them and answered who sings it (the folder), what's next and time left.

## Round 31 · second code audit
Fifteen findings, each fixed in the round named after it.
- **1.** A removed song stayed in the queue and played anyway (round 32).
- **2.** A YouTube song that was playing was lost after a new search (round 32).
- **3.** A broken video tried a second time froze the player (round 32). This came from the
   round 11 fix.
- **4.** A YouTube song on repeat never played a second time (round 32).
- **5.** The folder move stopped on an empty folder (round 27).
- **6.** The list was slow with 5000 songs, and the folder watch redrew it for nothing (round 33).
- **7 to 12.** Chat misses: "play" plus a song called *turn it up*, links, polite words, a long
   yes, shuffle in other words, "play delete" (rounds 35 to 39).
- **13.** A stalled network left the chat waiting forever (round 34).
- **14.** An unplugged monitor left the buddy off screen (round 34).
- **15.** YouTube was still checked twice a second while paused, and each new song added one
    more listener (round 32).
- Checked and fine: the messages between the pages and the app only accept the commands
  on their lists.

## Round 32 · YouTube: search, replay, broken videos
- A new search while a YouTube song plays: the song keeps its name and controls. Live.
- *repeat this song* on a YouTube song, seeking to the end twice: it played again both
  times. Live.
- A broken video is handled each time it is tried, so the player never freezes.
- Pause: the player stops checking YouTube a moment later; play starts again. Live.
- A song removed from the list leaves the queue too.

## Round 33 · speed with 5000 songs
- Drawing the list: 191 ms (was 337 ms). Each row no longer searches all 5000 songs.
- The folder watch with nothing new: 9 ms, no save and no redraw (was a full redraw).
- Priya: "show the list in pages?" **Not taken:** 191 ms once, when the list changes, is
  fine at this size.

## Round 34 · slow network, unplugged monitor
- YouTube search and names give up after 10 seconds, and the buddy says it can't reach
  YouTube.
- When a monitor is unplugged, the buddy goes back to its saved spot or the corner.

## Round 35 · polite words and a plain yes
- *can you pause please*, *could you skip*, *pls louder* work.
- A yes takes the buddy's offer only when it is just a yes (*yes please*, *sure thanks*).
  *yes but no* does not.

## Round 36 · "play" plus a title
- *play turn it up* searches for that song instead of turning up the volume. *play it
  again* and *restart* start the song over. *play the next one* skips.
- *put some music on*, *put on some music*, *start the music* play something.

## Round 37 · add to a playlist by name
- *add this to Study Mix* adds the song; asked again, the buddy says it's already there.
  A name that isn't a playlist gets a hint. A YouTube song is saved first. Live.
- *make a playlist* explains how (the + New playlist button).
- Maya: "add to a playlist from the chat." **Taken** (this round).

## Round 38 · removing stays a click
- *remove this* and *delete this song* never remove anything. The buddy says where the ⋯
  button is and that the file stays on the computer.
- *play delete* still plays a song called that.
- Priya: "remove from the chat." **Not taken:** one wrong word should never take a song
  out of your list.

## Round 39 · pasted links
- A YouTube link pasted in the chat plays that video. Live with a real video.
- A link to a video that is gone was marked broken, and the player stopped.
- Found: the buddy called the linked song "Rick Astley" (the singer). The shortening cut
  long titles at " - " before taking off "(Official Video)". **Fixed:** the brackets come
  off first. The song is "Rick Astley - Never Gonna Give You Up" now.

## Round 40 · a hundred everyday phrases
- About 100 things people say (*I'm tired of this song*, *too quiet*, *turn off shuffle*,
  *this is boring*, *are you there*, *can you hear me*) ran through Kon's chat. The misses
  were fixed in rounds 35 to 41. Only questions the app has no answer for are left.
- Maya: "what time is it?" **Not taken:** the clock is in the taskbar.
- Theo: "tell me a story?" **Not taken:** too much text for a small banner.

## Round 41 · open, sing, who is this
- *open the window* opens the main window; *open my folder* and *where are my files* open
  the music folder.
- *sing me a song* gets a little song in the buddy's voice.
- *who is this* and *is this Queen* say who sings it; *what's it called* names the song.

## Round 42 · keyboard and screen readers
- Every button and field in the three windows has a name a screen reader can read, and
  none is left out of the Tab order.

## Round 43 · long titles
- A 90-letter title fits in the list, in the player bar (cut with …) and in the chat
  ("Rainy Jazz Cafe").

## Round 44 · memory and startup
- Found: the chat kept its last 60 messages, but the bubbles on screen were never removed
  (93 after 60 more messages). **Fixed:** the screen keeps 60 too. Memory did not grow.
- Each window is ready in under half a second.

## Round 45 · full run again, docs
- `npm test` passes (about 25 new checks), every script passes `node --check`, and a
  search finds no API keys. The chat is still all offline rules.
- Live: Sara and Kasa, from hello to bye: put music on, what's this, who sings it, add to
  Study Mix, louder, studying, skip, pause. Every reply read right.

## Five more checks (rounds 46 to 50)

These rounds tested what goes wrong on a real day: a damaged save file, no internet, a
stalled connection, a long chat, and a second copy of the app. Two problems were found,
and both are fixed.

| Round | Focus | Maya | Theo | Priya |
|---|---|---|---|---|
| 46 | A damaged save file | 10 | 10 | 10 |
| 47 | No internet, a stalled connection | 10 | 10 | 10 |
| 48 | Pause really stops YouTube | 10 | 10 | 10 |
| 49 | A long chat, two buddies | 10 | 10 | 10 |
| 50 | A second copy, the hotkeys | 10 | 10 | 10 |

## Round 46 · a damaged save file
- Found: when `library.json` could not be read (cut short, edited by hand), the app
  started empty and the next save wrote over it. Every song and playlist was lost.
  **Fixed:** the damaged file is renamed `library-damaged-<time>.json` and kept, and the
  app starts fresh. Live: a file cut to 300 bytes was kept, and the app started.
- Priya: "repair it on its own?" **Not taken:** a cut-short file can't be read back
  safely. Kept aside, it can still be fixed by hand.

## Round 47 · no internet, a stalled connection
- With no network, *play* plus an unknown song gets "I can't reach YouTube".
- Found: a pasted link with no network said "Found it!", and then nothing played.
  **Fixed:** a network error now gets the offline line, in the chat and in the main
  window's search box. A link YouTube doesn't know gets "couldn't find it".
- With a connection that never answers, the buddy gives up after about 11 seconds and
  says it can't reach YouTube. Back online, the same request plays.

## Round 48 · pause really stops YouTube
- The YouTube status reports were counted. Playing: 8 in 4 seconds. Paused: 0. Played
  again: 9. This checks the round 32 fix for real.

## Round 49 · a long chat, two buddies
- 19 messages with Kon and then Kasa: good morning, an exam in an hour, *sure*, what's
  this, a typo'd skip, louder and *more*, time left, shuffle, who are your friends,
  switch to Kasa, play Study Mix, add this to Study Mix (already in), loop and stop,
  thanks, good night. Every reply did the right thing, in each buddy's voice.
- Maya: "remember what we talked about after a restart?" **Not taken:** the chat is
  meant to be light. Your songs, playlists and buddy are what's kept.

## Round 50 · a second copy, the hotkeys
- Starting the app a second time opens the first copy's window and quits in under a
  second. Only one copy runs.
- Ctrl+] and Ctrl+\ are shared with Catching Days through `hotkeys.js`: the app that
  started first holds both keys and wakes the other. The test copy found both keys held
  by the running app, as it should.
- `npm test` passes, every script passes `node --check`, and no API keys are used.
