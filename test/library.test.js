/* node test/library.test.js */
'use strict';
const assert=require('assert');
const {AUDIO,titleOf,ytIdOf,parseSearch,nextIndex}=require('../library');

assert.strictEqual(titleOf('C:\\Music\\03 - My_Song (live).mp3'),'My Song (live)');
assert.strictEqual(titleOf('/x/2024 Mix.flac'),'2024 Mix');           // a year is a name, not a track number
assert.strictEqual(titleOf('/x/___.mp3'),'___');
assert.ok(AUDIO.test('a.M4A')&&!AUDIO.test('a.txt'));

const id='dQw4w9WgXcQ';
for(const u of [`https://www.youtube.com/watch?v=${id}&t=3`,`https://youtu.be/${id}?si=x`,`https://www.youtube.com/shorts/${id}`,
  `https://music.youtube.com/watch?v=${id}&list=RD`,`youtube.com/embed/${id}`]) assert.strictEqual(ytIdOf(u),id,u);
assert.strictEqual(ytIdOf('lofi beats'),null);
assert.strictEqual(ytIdOf(`https://example.com/?v=${id}`),null);

const blob={contents:{a:[{videoRenderer:{videoId:id,title:{runs:[{text:'Lo-fi '},{text:'beats'}]},ownerText:{runs:[{text:'Chan'}]},lengthText:{simpleText:'3:12'}}},
  {videoRenderer:{videoId:'live0000000',title:{runs:[{text:'Live'}]}}},{videoRenderer:{videoId:'"><img src=x>',title:{runs:[{text:'odd id'}]},lengthText:{simpleText:'1:00'}}},{videoRenderer:{videoId:id,title:{runs:[{text:'dup'}]},lengthText:{simpleText:'1:00'}}}]}};
const html=`<script>var ytInitialData = ${JSON.stringify(blob)};</script>`;
assert.deepStrictEqual(parseSearch(html),[{yt:id,title:'Lo-fi beats',channel:'Chan',length:'3:12'}]);
assert.deepStrictEqual(parseSearch('<html>nothing</html>'),[]);

assert.strictEqual(nextIndex(3,2,{repeat:'all'}),0);
assert.strictEqual(nextIndex(3,2,{repeat:'off'}),-1);
assert.strictEqual(nextIndex(3,1,{repeat:'one',auto:true}),1);
assert.strictEqual(nextIndex(3,1,{repeat:'one'}),2);                  // pressing next still moves on
assert.strictEqual(nextIndex(3,0,{repeat:'all'},-1),2);
assert.strictEqual(nextIndex(3,0,{repeat:'off'},-1),0);
assert.strictEqual(nextIndex(3,1,{shuffle:true},1,()=>.6),2);         // never the song that just played
assert.strictEqual(nextIndex(3,1,{shuffle:true},1,()=>0),0);
assert.strictEqual(nextIndex(0,0,{}),-1);

const {moveFolder}=require('../library.js');
if(process.platform==='win32'){
  const L={tracks:[{kind:'file',path:'C:\\M\\Sara\\a.mp3',sub:'Sara'},{kind:'file',path:'C:\\M\\Sara\\Rock\\b.mp3',sub:'Rock'},
    {kind:'file',path:'C:\\M\\Sarah\\c.mp3',sub:'Sarah'},{kind:'yt',yt:'abcdefghijk'}],gone:['f:c:\\m\\sara\\d.mp3','yt:x']};
  assert.strictEqual(moveFolder(L,'C:\\M\\Sara','C:\\M\\Music Buddies'),2);
  assert.strictEqual(L.tracks[0].path,'C:\\M\\Music Buddies\\a.mp3');
  assert.strictEqual(L.tracks[0].sub,'Music Buddies');
  assert.strictEqual(L.tracks[0].url,'file:///C:/M/Music%20Buddies/a.mp3');
  assert.strictEqual(L.tracks[1].sub,'Rock');                           // a subfolder keeps its name
  assert.strictEqual(L.tracks[2].path,'C:\\M\\Sarah\\c.mp3');           // a different folder that starts the same is left alone
  assert.deepStrictEqual(L.gone,['f:c:\\m\\music buddies\\d.mp3','yt:x']);
}

const {fmt,esc}=require('../common.js');
assert.strictEqual(fmt(187),'3:07');
assert.strictEqual(fmt(3729),'1:02:09');
assert.strictEqual(fmt(NaN),'0:00');
assert.strictEqual(esc('<b a="1">&'),'&lt;b a=&quot;1&quot;&gt;&amp;');
console.log('library ok');
