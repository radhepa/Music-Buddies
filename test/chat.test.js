/* chat.test.js · the banner chat: every buddy has every line, and plain requests do the right thing */
'use strict';
const assert=require('assert');
const Chat=require('../chat.js'), VOICES=require('../voices.js');
const keys=Object.keys(VOICES.sara);
for(const [id,v] of Object.entries(VOICES)){
  assert.deepStrictEqual(Object.keys(v).sort(),[...keys].sort(),id+' has the same keys as sara');
  for(const k of keys) assert(v[k].length&&v[k].every(s=>typeof s==='string'&&s.length<=170),id+'.'+k);
}
const lib={tracks:[{id:'a',title:'Lofi Rain Study'},{id:'b',title:'Bohemian Rhapsody',sub:'Queen'},{id:'c',title:'Broken',bad:true}],
  playlists:[{id:'p1',name:'Gym Hype',ids:['b']},{id:'p2',name:'Empty one',ids:[]}]};
const r=(t,st={})=>Chat.reply(t,{voice:VOICES.kon,state:st,library:lib,rand:()=>0});
assert.deepStrictEqual(r('play bohemian rhapsody').do,{play:{id:'b',from:'all'}});
assert.deepStrictEqual(r('put on gym hype').do,{play:{id:'b',from:'p1'}});
assert.deepStrictEqual(r('play something chill').do,{play:{id:'a',from:'all'}});         // a mood, found by name in the library
assert.deepStrictEqual(r('I want something hype').do,{play:{id:'b',from:'p1'}});
assert.strictEqual(r('play never gonna give you up').do.yt,'never gonna give you up');    // not here: YouTube
assert.strictEqual(r('play broken').do.yt,'broken');                                      // a broken song is never picked
assert(/empty/i.test(r('play empty one').say));
assert.deepStrictEqual(r('skip',{title:'x',playing:true}).do,{cmd:'next'});
assert.deepStrictEqual(r('pause',{title:'x',playing:true}).do,{cmd:'toggle'});
assert.strictEqual(r('pause',{title:'x',playing:false}).do,null);
assert.deepStrictEqual(r('louder').do,{cmd:'vol-up'});
assert.deepStrictEqual(r('shuffle').do,{cmd:'shuffle'});
assert(r("what's this?",{title:'Song X',playing:true}).say.includes('Song X'));
assert.strictEqual(r('hey').act,'wave');
assert.strictEqual(r('surprise me').do.play.from,'all');
assert.strictEqual(r('asdf qwerty').do,null);
const yt={title:'Found',playing:true,kind:'yt',saved:false};
assert.deepStrictEqual(r('save this',yt).do,{cmd:'keep'});
assert.deepStrictEqual(r('i love this song',yt).do,{cmd:'keep'});
assert.strictEqual(r('save this',Object.assign({},yt,{saved:true})).do,null);              // already kept
assert.strictEqual(r('keep this',{title:'File',kind:'file'}).do,null);                    // files are already in the library
assert.deepStrictEqual(r('loop this',{title:'x'}).do,{cmd:'repeat-one'});
assert.deepStrictEqual(r('stop repeating',{title:'x'}).do,{cmd:'repeat-off'});
assert.strictEqual(r('love you').act,'bow');
const f=r('ugh I have an exam tomorrow');
assert.strictEqual(f.offer,'chill');
assert.deepStrictEqual(Chat.reply('yes please',{voice:VOICES.kon,state:{},library:lib,rand:()=>0,offer:f.offer}).do,{play:{id:'a',from:'all'}});   // yes plays what was offered
assert.strictEqual(r('yes').do,null);                                                     // no offer: yes does nothing
assert(r("what's next?",{title:'x',up:'Song Y'}).say.includes('Song Y'));
assert.strictEqual(Chat.reply('play x',{voice:VOICES.sara,state:{},library:{tracks:[],playlists:[]}}).do.yt,'x');
/* smarter replies */
const c=(t,o={})=>Chat.reply(t,Object.assign({voice:VOICES.kon,state:{},library:lib,rand:()=>0},o));
assert.deepStrictEqual(c('skp',{state:{title:'x',playing:true}}).do,{cmd:'next'});                 // typos get a second try
assert.deepStrictEqual(c('puase',{state:{title:'x',playing:true}}).do,{cmd:'toggle'});
assert.deepStrictEqual(c('shuflle').do,{cmd:'shuffle'});
assert.strictEqual(Chat.fixTypos('look for lofi'),'look for lofi');                                // real words stay
assert.deepStrictEqual(c('kon, skip',{state:{title:'x'}}).do,{cmd:'next'});                        // its name is just who you're talking to
assert.strictEqual(c('hey kon').act,'wave');
assert.strictEqual(c('nah',{offer:'chill',state:{title:'x'}}).do,null);                            // "no" to an offer isn't a skip
assert.strictEqual(c('shuffle off',{state:{shuffle:false}}).do,null);                              // already off: don't turn it on
assert.deepStrictEqual(c('shuffle off',{state:{shuffle:true}}).do,{cmd:'shuffle'});
assert.deepStrictEqual(c('volume 40').do,{cmd:'vol-40'});
assert.deepStrictEqual(c('set it to 250%').do,{cmd:'vol-100'});
assert.deepStrictEqual(c('a bit more',{last:'vol-up'}).do,{cmd:'vol-up'});                         // more of the last thing
assert.strictEqual(c('more').do,null);
assert(c('who sings this?',{state:{title:'Queen - Bohemian Rhapsody'}}).say.includes('Queen'));
assert(c('who made this',{state:{title:'Found',kind:'yt',sub:'YouTube · Lofi Girl'}}).say.includes('Lofi Girl'));
assert(c('how long left',{state:{title:'x'},prog:{pos:60,dur:200}}).say.includes('2:20'));
assert(/Gym Hype/.test(c('what playlists do i have').say));
assert.strictEqual(c("i'm so tired").offer,'chill');                                              // a feeling gets an offer, not music
assert.strictEqual(c("i'm so tired").do,null);
assert.strictEqual(c('im sad').offer,'happy');
assert.strictEqual(c('i want something sad').do.yt!=null||c('i want something sad').do.play!=null,true);   // asking for sad music still plays
assert.strictEqual(c('hi',{hour:2}).offer,'chill');                                               // late at night
assert.strictEqual(c('dance for me').act,'special');
assert.deepStrictEqual(c('more like this',{state:{title:'Lofi Rain Study',id:'x'}}).do,{play:{id:'a',from:'all'}});
assert.strictEqual(c('surprise me',{state:{id:'a',title:'Lofi Rain Study'}}).do.play.id,'b');       // never the song already on
const said=c('pause',{state:{title:'x',playing:true}}).say;
assert.notStrictEqual(c('pause',{state:{title:'x',playing:true},recent:[said]}).say,said);            // no line twice in a row
const three=VOICES.kon.next, seen=[three[1],three[2],three[0]];                                 // all said: the oldest comes back
assert.strictEqual(c('skip',{state:{title:'x'},recent:seen}).say,three[1]);
assert(c('play zzz').do.say.offline);
assert(c('how long left',{state:{title:'x'},prog:{pos:0,dur:3729}}).say.includes('1:02:09'));
assert.deepStrictEqual(c('more',{last:'vol-30'}).do,{cmd:'vol-up'});
assert(VOICES.kon.help.includes(c('what else can you do').say));
assert.strictEqual(c('remove this song',{state:{title:'x'}}).do,null);                            // never removes from chat
assert(VOICES.kon.removeHow.includes(c('delete this',{state:{title:'x'}}).say));
assert(c('play delete').do.yt);                                                                    // a song called that still plays
/* another buddy, by name */
assert.deepStrictEqual(c('switch to kasa',{pet:'kon'}).do,{pet:'kasa'});
assert.deepStrictEqual(c('can i talk to sara',{pet:'kon'}).do,{pet:'sara'});
assert.deepStrictEqual(c('swtich to sara',{pet:'kon'}).do,{pet:'sara'});                          // typo
assert.strictEqual(c('switch to kon',{pet:'kon'}).do,null);                                       // already out
assert(VOICES.kon.swapList.includes(c('switch to sara',{pet:'kon',state:{title:'x',pet:'kon',from:'p1'}}).say.replace('Sara','{b}').replace('Gym Hype','{pl}')));   // a playlist's own pet stays
assert(VOICES.kon.about.includes(c('what is music buddies').say));
assert(VOICES.kon.friends.includes(c('who are your friends').say));
assert(c("what's this?",{state:{title:'Song X'}}).say.includes('Song X'));                       // still the song, not the app
/* rounds 26-45 */
assert.deepStrictEqual(c('next buddy',{pet:'sara'}).do,{pet:'kon'});                              // buddies go round
assert.deepStrictEqual(c('switch buddy',{pet:'kasa'}).do,{pet:'sara'});
assert.deepStrictEqual(c('add this to gym hype',{state:{title:'x',id:'a'}}).do,{cmd:'to-p1'});
assert.strictEqual(c('add this to gym hype',{state:{title:'x',id:'b'}}).do,null);                 // already in it
assert.strictEqual(c('add this to nowhere',{state:{title:'x',id:'a'}}).do,null);                  // no such playlist
assert.strictEqual(c('check https://youtu.be/dQw4w9WgXcQ').do.link,'https://youtu.be/dQw4w9WgXcQ');               // a pasted link
assert.deepStrictEqual(c('can you pause please',{state:{title:'x',playing:true}}).do,{cmd:'toggle'});   // polite words don't hide the ask
assert.strictEqual(c('yes but no',{offer:'chill'}).do,null);                                     // only a plain yes takes the offer
assert.strictEqual(c('play turn it up').do.yt,'turn it up');                                     // "play" + a title beats the control words
assert.deepStrictEqual(c('play it again',{state:{title:'x'}}).do,{seek:0});
assert.deepStrictEqual(c('restart',{state:{title:'x'}}).do,{seek:0});
assert.deepStrictEqual(c('turn off shuffle',{state:{shuffle:true}}).do,{cmd:'shuffle'});
assert.deepStrictEqual(c('im tired of this song',{state:{title:'x'}}).do,{cmd:'next'});
assert.deepStrictEqual(c('too quiet').do,{cmd:'vol-up'});
assert.strictEqual(c('put some music on').do.play.from,'all');
assert.strictEqual(c('put on some music').do.play.from,'all');
assert(c('open the window').do.open);
assert(c('where are my files').do.open);
assert(VOICES.kon.sing.includes(c('sing me a song').say));
assert.strictEqual(Chat.short('Rainy Jazz Cafe - Slow Jazz Music in Coffee Shop Ambience for Work, Study and Relaxation'),'Rainy Jazz Cafe');
assert.strictEqual(Chat.short('Chill Lofi Mix [chill lo-fi hip hop beats]'),'Chill Lofi Mix');
assert.strictEqual(Chat.short('[only brackets]'),'[only brackets]');
assert.strictEqual(Chat.short('Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)'),'Rick Astley - Never Gonna Give You Up');   // the song, not just the artist
console.log('chat ok');
