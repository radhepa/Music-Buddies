# Music Buddies

A little yokai who lives on your desktop and plays your music: Sara, a kappa
on a lily pad who floats a record in the dish on her head, or one of her
friends. Your own songs, and YouTube without the feed.

**Start her:** double-click `Start Music Buddies.bat` (the first run downloads Electron,
about 100 MB). Or `npm install` then `npm start`. `npm start -- --open` starts with the
window open (the desktop and Start-menu shortcuts use it).

No accounts and no API keys: the chat runs offline, and YouTube is searched the way a
browser would.

## Giving her music

- **Drop songs or a whole folder on Sara**, or on the open player. Each song is
  named after its file (`03 - My_Song.mp3` becomes *My Song*).
- **Put files in `Music\Sara`** (right-click Sara, *Open Sara's folder*). Anything
  there joins her library by itself.
- **Add music…** in the player, or on her right-click menu.

mp3, m4a, aac, wav, ogg, opus, flac and webm all play.

## Playlists

*All songs* holds everything. *+ New playlist* makes one; songs dropped while a
playlist is open go into it. Use ⋯ on a song to add it to a playlist, take it
out, or remove it from Sara. Right-click a playlist to delete it (the songs stay).

## Three yokai

Sara has two friends, both yokai, and any of them can be out:

- **Sara**, a kappa who floats a record in the dish on her head
- **Kon**, a kitsune with a shamisen and foxfire
- **Kasa**, a one-eyed paper umbrella who hops to the beat

Pick the one who is out every day under *Your buddy* in the window (or
right-click the pet, then *Pet*). A
playlist can have its own: right-click the playlist, then *Pet for this
playlist*. While a song from that playlist plays, its pet comes out.

Each pet breathes and blinks, and has sixteen moves of its own, all drawn for it:
three dances (each song gets one of them, always the same one for that song),
and a wave, look around, stretch, yawn, shake, head tilt, a skip when the song
changes, a startled "oh!" when it stops, talking, nodding, a startle when it
wakes, a bow, and one special trick each (Sara rolls her record round her dish,
Kon fans out his nine tails, Kasa furls up and pops open). Now and then it does
one on its own; it dozes off after five minutes of quiet. Moves play at the
screen's full 60 frames a second; standing still it drops to 15 to save power.

## YouTube, without YouTube

The YouTube tab searches YouTube, or takes a pasted link. Tap a result to play
it; **+** keeps it in your library. It plays in YouTube's own player, shown
small and held to that one video: no recommendations, comments or feed, and
nothing in it opens a page. Close the window and the music keeps going while
Sara sits there with her record turning.

## The banner: talk to your buddy

Tap the pet and a banner pops up beside it: the song, play, back, skip and a
seek bar, then two tabs.

- **Chat.** Type to your buddy. Each one talks its own way: Sara is gentle and
  watery, Kon is sly and theatrical, Kasa shouts. Ask for things in plain words:
  *play Bohemian Rhapsody*, *put on my gym playlist*, *something chill*, *hype*,
  *surprise me*, *skip*, *pause*, *louder*, *shuffle*, *loop this*, *what's this?*,
  *what's next?*, *save this*, *who sings this?*, *how long left?*, *more like
  this*, *volume 40*, *what playlists do I have?*. A song or playlist you have
  wins; otherwise it looks on YouTube and plays the first video. Tell it you're
  studying, tired or sad and it answers and offers music for it; say *yes* and it
  plays, *no* and it doesn't. It greets you differently late at night and in the
  morning, tells jokes, dances when asked, gets past small typos (*skp*, *puase*),
  and doesn't say the same line twice in a row. The chips under the chat are
  shortcuts.
- **Songs.** Pick a playlist, search it, tap a song. The song plays with that
  list as its queue.
- A YouTube song found from the chat isn't kept until you say *save this* or tap
  the heart.

Esc or a click anywhere else puts the banner away. The arrow button opens the
whole window.

## The window

Music Buddies has its own window, like any app: your buddy and your playlists
down the left, the songs in the middle, what's playing along the bottom. It
sits in the taskbar, resizes, and remembers where you left it. Closing it only
puts it away; the music and the pet carry on. *Quit Music Buddies* on the
pet's right-click menu really quits.

## Controls

- **Ctrl+]** from anywhere: bring out Music Buddies with its little banner.
  Press it again to put the banner away.
- **Ctrl+\** from anywhere: bring out the Catching Days desktop toad. Each app
  starts the other if it isn't running (once each has been started one time).
- Tap the pet: the banner pops up by it (see above). Drag the pet to move it.
- **Hide it in an edge:** drag it past the left, right or bottom of the screen.
  On a side it leans in from behind the edge; at the bottom it sinks till only
  its eyes show. Drag it out again whenever you like.
- Clicks go straight through the empty space round the pet.
- Right-click the pet: play/pause, next, add music, the folder, which pet, size
  (tiny to huge), quit.
- Media keys (play/pause, next, previous) work from anywhere.
- In the window: Space plays or pauses.

Her library and settings live in `%APPDATA%\Music Buddies\sara.json`.
Removing a song never deletes the file.

## For the curious

`main.js` runs the windows, reads folders, searches YouTube; `player.js` is
the player and the music engine; `pet.js` is the pet's window (peeking,
dragging, moods). The drawings are in `pets/`: `kit.js` is what they share,
and each pet has its own file. `pets/preview.html?pets=sara,kon` shows them in
every mood (`&acts=1` replays the sixteen moves). `mini.html`/`mini.js` is the
banner; `chat.js` reads what you type and `voices.js` holds every line each buddy
can say. `library.js`, `common.js` and `chat.js` hold the plain rules (names, links,
what plays next, times, what a message means), checked by `npm test` here and on
every push. `common.js` is shared by the pages and node. The checks the app went
through are in [docs/CHECKS.md](docs/CHECKS.md).
