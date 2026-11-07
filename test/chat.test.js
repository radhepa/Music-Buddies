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
assert.strictEqual(Chat.short('Rainy Jazz Cafe - Slow Jazz Music in Coffee Shop Ambience for Work, Study and Relaxation'),'Rainy Jazz Cafe');
assert.strictEqual(Chat.short('Chill Lofi Mix [chill lo-fi hip hop beats]'),'Chill Lofi Mix');
assert.strictEqual(Chat.short('[only brackets]'),'[only brackets]');
console.log('chat ok');
