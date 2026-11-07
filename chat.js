/* chat.js · what a buddy makes of what you type, and what it says back.
   No network and no AI: plain patterns (play X, skip, louder, something chill, who sings this...) and each
   buddy's own lines from voices.js. Pure, so test/chat.test.js can run it with node.

   reply(text, ctx) → {say, act, do, offer?}
     ctx:  {voice, state:{playing,title,sub,id,from,shuffle,up,kind,saved}, library:{tracks,playlists}, rand,
            offer, recent:[lines the buddy just said], prog:{pos,dur}, hour:0-23, last:'the last cmd sent'}
     offer: a mood the buddy just offered ("want something chill?"); pass it back as ctx.offer and "yes" plays it
     recent: so the buddy doesn't say the same line twice in a row
     say:  the buddy's answer          act: which pet act goes with it ('talk', 'nod', 'wave', 'bow', 'special')
     do:   what the music should do, or null:
           {cmd:'toggle'|'next'|'prev'|'shuffle'|'vol-up'|'vol-down'|'vol-N' (N 0-100)|'repeat-one'|'repeat-off'|'keep'}
           {play:{id,from}}            a song from the library, queued from that list ('all' or a playlist id)
           {yt:'query', say:{found,missing,offline}}   nothing in the library fits: look on YouTube, play the first result
   Typos: a message nothing understood gets a second try with near-miss words fixed ("skp" → "skip"). */
(function(root){
'use strict';
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[’‘]/g,"'").replace(/[^a-z0-9'% ]+/g,' ').replace(/\s+/g,' ').trim();
const words=s=>norm(s).split(' ').filter(w=>w&&!STOP.has(w));
const STOP=new Set(['the','a','an','some','my','me','please','pls','song','songs','music','track','by','to','for','of','on','up','can','you','could','would','put','play','i','want','wanna','hear','listen','lets','let','us','something','any','that','this','one','kind','playlist','list']);
const pick=(list,rand)=>list[Math.floor((rand||Math.random)()*list.length)%list.length];
/* a song name short enough to say: no "[Official Video]" or "(lyrics)", cut at a word near 46 letters */
const short=t=>{ t=String(t||'').replace(/\s*[\[(【][^\])】]*[\])】]/g,'').replace(/\s+[-|·]\s+.*$/,m=>t.length>46?'':m).trim()||String(t||'');
  return t.length<=46?t:t.slice(0,46).replace(/\s+\S*$/,'')+'…'; };
const fill=(s,v)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>v[k]==null?m:k==='t'?short(v[k]):v[k]);
const {fmt}=typeof module!=='undefined'&&module.exports?require('./common.js'):root.Common;   // 3:07, 1:02:09

/* moods: words people say → words that might be in a song or playlist name, and a YouTube search */
const MOODS={
  chill:{say:['chill','calm','relax','relaxing','lofi','lo fi','study','studying','focus','sleep','soft','quiet','cozy','rain','jazz','piano','ambient'],look:['chill','lofi','lo fi','study','calm','relax','sleep','piano','ambient','acoustic','jazz'],yt:'lofi hip hop chill beats'},
  hype:{say:['hype','energy','energetic','pump','pumped','workout','gym','party','upbeat','dance','loud','banger','bangers','fast','running','run'],look:['hype','workout','gym','party','dance','remix','edm','rock'],yt:'upbeat energetic music mix'},
  sad:{say:['sad','cry','crying','down','blue','heartbreak','lonely','emo','rainy day'],look:['sad','slow','acoustic','piano','rain','cry'],yt:'sad songs playlist'},
  happy:{say:['happy','good mood','sunny','cheerful','fun','feel good','joy','bright'],look:['happy','summer','sun','good','fun','pop'],yt:'feel good happy songs'}
};
const moodOf=t=>{ const n=' '+norm(t)+' '; for(const [k,m] of Object.entries(MOODS)) if(m.say.some(w=>n.includes(' '+w+' '))) return k; return null; };
/* "I'm ..." feelings: the buddy answers the feeling and offers music for it, instead of playing straight away */
const FEEL=[
  [/^(sad|down|blue|lonely|upset|depressed|bummed|heartbroken|miserable|crying)$/,'feelSad','happy'],
  [/^(tired|sleepy|exhausted|stressed|anxious|nervous|overwhelmed|burnt|burned|drained|done)$/,'feelTired','chill'],
  [/^(happy|good|great|excited|amazing|awesome|fine|ok|okay|pumped|hyped)$/,'feelGood','happy'],
  [/^(bored|meh|restless)$/,'feelBored','hype']
];

/* the best song or playlist for some words; null if nothing is close */
function find(q,lib){
  const qn=norm(q), qw=words(q); if(!qw.length) return null;
  const score=name=>{ const n=norm(name); if(!n) return 0;
    if(n===qn) return 100; if(n.startsWith(qn)) return 80;
    const nw=new Set(n.split(' ')); const hit=qw.filter(w=>nw.has(w)||n.includes(w)).length;
    return hit===qw.length?60+hit:hit/qw.length>=.6&&qw.length>1?40:0; };
  let best=null;
  for(const p of lib.playlists||[]){ const s=score(p.name)+5; if(s>5&&(!best||s>best.s)) best={s,pl:p}; }
  for(const t of lib.tracks||[]){ if(t.bad) continue; const s=Math.max(score(t.title),score((t.title||'')+' '+(t.channel||t.sub||''))-5); if(s>0&&(!best||s>best.s)) best={s,t}; }
  return best;
}
const playable=lib=>(lib.tracks||[]).filter(t=>!t.bad);
function firstOf(pl,lib){ const ok=new Set(playable(lib).map(t=>t.id)); return (pl.ids||[]).find(id=>ok.has(id))||null; }
const lookHas=(mood,name)=>{ const n=' '+norm(name)+' '; return MOODS[mood].look.some(w=>n.includes(' '+w)); };
function moodPick(mood,lib,rand,not){
  const pl=(lib.playlists||[]).find(p=>lookHas(mood,p.name)&&firstOf(p,lib));
  if(pl&&!not) return {pl};
  const ts=playable(lib).filter(t=>lookHas(mood,t.title)&&t.id!==not);
  return ts.length?{t:pick(ts,rand)}:null;
}
/* who made a song: YouTube says the channel (a mix's "Cafe - Slow Jazz..." name isn't an artist);
   a file's "Artist - Song" name says it; else the file's folder */
function artistOf(st){
  const sub=String(st.sub||'');
  if(st.kind==='yt'){ const c=sub.replace(/^YouTube( · )?/,''); if(c) return {a:c}; }
  const m=String(st.title||'').match(/^(.{2,40}?)\s+[-–—]\s+\S/); if(m) return {a:m[1].trim()};
  return sub&&st.kind!=='yt'&&sub!=='On your computer'?{folder:sub}:null;
}

/* typos: a word one letter off (two for long words) from a word the chat knows */
const VOCAB=['skip','next','pause','resume','unpause','continue','louder','quieter','softer','shuffle','repeat','loop','previous','play','hello','thanks','thank','playing','volume','surprise','random','help','favorite','favourite','playlists','something','chill','relax','another','again','what','whats'];
function osa(a,b){                                     // edit distance, a swap of two letters counts as one
  const d=[]; for(let i=0;i<=a.length;i++){ d[i]=[i]; for(let j=1;j<=b.length;j++) d[i][j]=i?0:j; }
  for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++){
    const c=a[i-1]===b[j-1]?0:1; d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+c);
    if(i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1]) d[i][j]=Math.min(d[i][j],d[i-2][j-2]+1);
  }
  return d[a.length][b.length];
}
const REAL=new Set(['look','lose','lost','loot','same','text','best','rest','test','ship','skin','step','plan','pay','pray','when','that','with','have','hell','sure','last','past','nest','paws','cause']);   // real words a letter off a command
function fixTypos(n){
  return n.split(' ').map(w=>{
    if(w.length<3||VOCAB.includes(w)||REAL.has(w)) return w;
    const max=w.length>=7?2:1; let best=w, bd=max+1;
    for(const v of VOCAB){ if(Math.abs(v.length-w.length)>max) continue; const d=osa(w,v); if(d<bd){ bd=d; best=v; } }
    return bd<=max?best:w;
  }).join(' ');
}

function reply(text,ctx){
  const r=understand(text,ctx);
  if(r.unknown){ const n=norm(text), f=fixTypos(n); if(f!==n){ const r2=understand(f,ctx); if(!r2.unknown) return r2; } }
  delete r.unknown; return r;
}
function understand(text,ctx){
  const V=ctx.voice, st=ctx.state||{}, lib=ctx.library||{tracks:[],playlists:[]}, rand=ctx.rand, recent=ctx.recent||[];
  /* a line from the buddy, filled in: one it hasn't said lately, or else the one it said longest ago */
  const line=(k,v={})=>{ const all=(V[k]||V.unknown).map(s=>fill(s,Object.assign({t:st.title||''},v)));
    const fresh=all.filter(s=>!recent.includes(s)); if(fresh.length) return pick(fresh,rand);
    return all.reduce((a,b)=>recent.lastIndexOf(b)<recent.lastIndexOf(a)?b:a); };
  const say=(k,v={},act='talk',d=null)=>({say:line(k,v),act,do:d});
  let n=norm(text);
  /* "kon, skip" / "hey sara play lofi": the buddy's name is just who you're talking to */
  const named=n.replace(/^((hey|hi|yo|ok|okay|oi) )?(sara|kon|kasa) (?=\S)/,'');
  if(named!==n&&!/^(hi|hey|hello|yo)$/.test(named)) n=named;
  const has=re=>re.test(n);
  if(!n) return say('unknown');

  /* "no" to an offer, before "nah" means skip */
  if(ctx.offer&&has(/^(no|nah|nope|not now|no thanks|maybe later|i'?m good|im good|nevermind|never mind)\b/)) return say('decline');
  /* "yes" to the last thing the buddy offered */
  if(ctx.offer&&has(/^(yes|yeah|yep|yup|sure|ok|okay|please|go|do it|sounds good|alright|go for it|why not)\b/)) return reply('play something '+ctx.offer,Object.assign({},ctx,{offer:null}));

  /* the controls (looping first, so "stop repeating" isn't a pause) */
  if(has(/\b(loop\w*|repeat\w*)\b/)) return has(/\b(stop|no|off|dont|don't|unloop|enough)\b/)?say('repeatOff',{},'nod',{cmd:'repeat-off'})
    :st.title?say('repeatOne',{},'nod',{cmd:'repeat-one'}):say('nothingOn');
  if(has(/\b(more|another|something|songs?|anything)( one| song)? (like|similar to) (this|that|it)\b|\bsimilar\b|\bsame vibe\b/)) return similar();
  if(has(/\b(shuffle (off|no more)|stop shuffl\w*|no shuffle|unshuffle|in order)\b/)) return st.shuffle?say('shuffleOff',{},'nod',{cmd:'shuffle'}):say('shuffleOff');
  if(has(/\b(shuffle on|turn on shuffle|shuffle it)\b/)) return st.shuffle?say('shuffleOn'):say('shuffleOn',{},'nod',{cmd:'shuffle'});
  if(has(/^(mute|silence)\b/)) return st.playing?say('pause',{},'nod',{cmd:'toggle'}):say('alreadyPaused');
  if(has(/^unmute\b/)) return st.title&&!st.playing?say('resume',{},'nod',{cmd:'toggle'}):st.playing?say('nowPlaying'):startAny();
  if(has(/^(pause|stop|hold on|wait|shh+|quiet please)\b/)) return st.playing?say('pause',{},'nod',{cmd:'toggle'}):say('alreadyPaused');
  if(has(/^(resume|unpause|continue|keep going|go on|play)$/)) return st.title&&!st.playing?say('resume',{},'nod',{cmd:'toggle'}):st.playing?say('nowPlaying'):startAny();
  if(has(/^(next|skip|another|next one|skip (it|this|this one)|nah|not this one|change it|change the song)\b/)) return st.title?say('next',{},'nod',{cmd:'next'}):startAny();
  if(has(/\b(save|keep|add) (this|it|that|this song|this one)\b|^(i )?(like|love) (this|it)( one| song)?$/))
    return !st.title?say('nothingOn'):st.kind==='yt'&&!st.saved?say('keep',{},'bow',{cmd:'keep'}):say('alreadyKept');
  if(has(/^(back|previous|prev|go back|last one|again|replay|one more time)\b/)) return st.title?say('prev',{},'nod',{cmd:'prev'}):startAny();
  if(has(/\bshuffle\b|\bmix it up\b/)) return say(st.shuffle?'shuffleOff':'shuffleOn',{},'nod',{cmd:'shuffle'});
  const vol=n.match(/\b(?:volume|vol|turn it|set it|put it)(?: to| at)? (\d{1,3}) ?%?$|^(\d{1,3}) ?%$/);
  if(vol){ const v=Math.min(100,+(vol[1]||vol[2])); return say('volSet',{v},'nod',{cmd:'vol-'+v}); }
  if(has(/\b(max|full|maximum) volume\b|\bvolume (max|all the way up)\b/)) return say('volSet',{v:100},'nod',{cmd:'vol-100'});
  if(has(/\b(louder|turn (it )?up|volume up|crank|pump it up)\b/)) return say('louder',{},'nod',{cmd:'vol-up'});
  if(has(/\b(quieter|softer|turn (it )?down|volume down|too loud|lower)\b/)) return say('quieter',{},'nod',{cmd:'vol-down'});
  /* "more" right after louder/quieter/a volume: the same way again (after "volume 30", up) */
  if(has(/^((a )?(bit|little|tiny bit) )?(more|even more|more more|louder still)( please)?$/)&&/^vol-/.test(ctx.last||''))
    return ctx.last==='vol-down'?say('quieter',{},'nod',{cmd:'vol-down'}):say('louder',{},'nod',{cmd:'vol-up'});

  /* questions about the music */
  if(has(/\b(what'?s next|what is next|up next|after this|whats after)\b/)) return st.up?say('upNext',{t:st.up}):st.shuffle?say('upShuffle'):say('upNone');
  if(has(/\b(who (sings|sang|made|wrote|is singing|performs)|who is (this|it) by|who'?s (this|it) by|what artist|which artist|whose song|who'?s singing|what band)\b/)){
    if(!st.title) return say('nothingOn');
    const a=artistOf(st); return a?a.a?say('whoSings',{a:a.a}):say('whoFolder',{a:a.folder}):say('whoUnknown');
  }
  if(has(/\b(how (long|much)( time)?( is)? (left|longer|remaining|to go)|time left|how long is (this|it)|when does (this|it) end)\b/)){
    const p=ctx.prog||{}; if(!st.title) return say('nothingOn'); if(!p.dur) return say('timeUnknown');
    return say('timeLeft',{left:fmt(p.dur-(p.pos||0)),len:fmt(p.dur)});
  }
  if(has(/\b(do you like (this|it|this song|this one)|is this (good|a good song)|you like this|thoughts on this|what do you think( of (this|it))?|rate this)\b/)) return st.title?say('likeThis'):say('nothingOn');
  if(has(/\b(what('?s| is) (this|playing|on)|what song|which song|whats this|now playing|song name|what am i listening to)\b/)) return st.title?say('nowPlaying'):say('nothingOn');
  if(has(/\b(what|which|show|list|see) (are )?(my )?(playlists|lists)\b|\bmy playlists\b|\bhow many songs\b|\bwhat (songs )?do i have\b|\bmy library\b/)) return library();
  if(has(/\b(surprise me|random|anything|whatever|you pick|you choose|dealer'?s choice|something good|dealers choice)\b/)) return startAny(true);
  if(has(/^(can you |please )?(dance|do a dance|do a trick|show me a (move|trick)|do something( cool)?|spin)( for me)?( please)?$/)) return say('dance',{},'special');

  /* feelings: "I'm so tired" gets an answer and an offer, not music out of nowhere */
  const fm=n.match(/^(?:i'?m|im|i am|i feel|feeling|i'?m feeling|im feeling|i feel so|so)(?: so| really| very| kinda| kind of| a bit| pretty| super| a little)* (\w+)/);
  if(fm&&!has(/\b(play|put on|want|wanna)\b/)) for(const [re,k,mood] of FEEL) if(re.test(fm[1])) return Object.assign(say(k),{offer:mood});

  /* play X, or a mood */
  const m=n.match(/^(?:can you |could you |please |pls )?(?:play|put on|queue|i want(?: to hear)?|i wanna hear|let'?s hear|throw on|spin|find)\s+(.+)$/);
  const mood=moodOf(n);
  if(m||mood){
    const q=m?m[1]:n;
    if(mood){ const got=moodPick(mood,lib,rand); if(got) return got.pl?playList(got.pl):playTrack(got.t,'all'); }
    const hit=m&&find(q,lib);
    if(hit) return hit.pl?playList(hit.pl):playTrack(hit.t,'all');
    const yq=mood?MOODS[mood].yt:q;
    return {say:line('ytLooking',{q:mood?mood:q}),act:'talk',do:{yt:yq,say:{found:pick(V.ytPlay,rand),missing:fill(pick(V.notFound,rand),{q}),offline:pick(V.offline,rand)}}};
  }
  if(has(/^(hi|hey|hello|yo|hiya|heya|sup|howdy|good (morning|afternoon|evening)|morning|evening)\b/)){
    const h=ctx.hour;
    if(!st.playing&&h!=null&&h<5) return Object.assign(say('late',{},'wave'),{offer:'chill'});
    if(!st.playing&&h!=null&&h>=5&&h<11) return Object.assign(say('morning',{},'wave'),{offer:'chill'});
    return say(st.playing?'helloPlaying':'hello',{},'wave');
  }
  if(has(/\b(how are you|how'?s it going|how are u|you ok|how do you feel|how r u|hows it going|how you doing)\b/)) return say('howAreYou');
  if(has(/\b(who are you|what are you|your name|about you|tell me about yourself)\b/)) return say('who');
  if(has(/\b(thank|thanks|thx|ty|appreciate)\b/)) return say('thanks',{},'nod');
  if(has(/\b(bye|goodbye|see you|see ya|later|gotta go|good ?night|gn)\b/)) return say('bye',{},'wave');
  if(has(/\b(love you|you'?re (cute|the best|great|adorable|awesome)|good (boy|girl|buddy|job)|cute|best buddy)\b/)) return say('love',{},'bow');
  if(has(/\b(joke|make me laugh|something funny|cheer me up)\b/)) return say('joke');
  if(has(/\b(study|studying|homework|exam|focus|work|stressed|tired|essay|deadline|test|midterm|finals?|lab report|project)\b/)) return Object.assign(say('focus'),{offer:'chill'});
  if(has(/\b(help|what (else )?can (you|i) (do|say|ask)|commands|how do i|what (else )?do you do|what else)\b/)) return say('help');
  if(has(/\b(favou?rite)\b/)) return say('favorite');
  if(has(/^(ok|okay|k|kk|cool|nice|neat|alright|got it|lol|haha\w*|lmao|hehe\w*|wow|oh|hmm+)$/)) return say('ack');
  return Object.assign(say('unknown'),{unknown:true});

  function playTrack(t,from){ return say('play',{t:t.title},'nod',{play:{id:t.id,from}}); }
  function playList(pl){ const id=firstOf(pl,lib); return id?say('playList',{pl:pl.name},'nod',{play:{id,from:pl.id}}):say('emptyList',{pl:pl.name}); }
  function startAny(surprise){
    const ts=playable(lib).filter(t=>!surprise||t.id!==st.id||playable(lib).length<2); if(!ts.length) return say('empty');
    const t=surprise||!st.title?pick(ts,rand):null;
    return t?say('random',{t:t.title},'nod',{play:{id:t.id,from:'all'}}):say('nowPlaying');
  }
  /* more like this: the same artist first, then the same mood, then the playlist it came from */
  function similar(){
    if(!st.title) return startAny(true);
    const ts=playable(lib).filter(t=>t.id!==st.id), a=artistOf(st);
    const same=a&&a.a&&ts.filter(t=>{ const b=artistOf({title:t.title,sub:t.kind==='yt'?'YouTube · '+(t.channel||''):t.sub,kind:t.kind}); return b&&b.a&&norm(b.a)===norm(a.a); });
    if(same&&same.length){ const t=pick(same,rand); return say('similar',{t:t.title},'nod',{play:{id:t.id,from:'all'}}); }
    const mood=moodOf(st.title)||Object.keys(MOODS).find(k=>lookHas(k,st.title));
    const got=mood&&moodPick(mood,lib,rand,st.id);
    if(got&&got.t) return say('similar',{t:got.t.title},'nod',{play:{id:got.t.id,from:'all'}});
    if(mood) return {say:line('ytLooking',{q:mood}),act:'talk',do:{yt:MOODS[mood].yt,say:{found:pick(V.ytPlay,rand),missing:fill(pick(V.notFound,rand),{q:mood}),offline:pick(V.offline,rand)}}};
    const pl=st.from&&(lib.playlists||[]).find(p=>p.id===st.from), inPl=pl&&ts.filter(t=>pl.ids.includes(t.id));
    if(inPl&&inPl.length){ const t=pick(inPl,rand); return say('similar',{t:t.title},'nod',{play:{id:t.id,from:pl.id}}); }
    return say('similarNone');
  }
  function library(){
    const pls=(lib.playlists||[]).map(p=>p.name), n=playable(lib).length;
    if(!n&&!pls.length) return say('empty');
    return say(pls.length?'library':'libraryNoLists',{n,pl:pls.slice(0,4).map(s=>'“'+s+'”').join(', ')+(pls.length>4?' and more':'')});
  }
}

/* a line for when a song starts while the chat is open (not every time: chatter is a distraction) */
function onSong(title,voice,rand){ return fill(pick(voice.songChange,rand),{t:title}); }
function greet(st,voice,rand){ return fill(pick(voice[st&&st.playing?'helloPlaying':'hello'],rand),{t:st&&st.title||''}); }

const api={reply,onSong,greet,find,norm,moodOf,fill,short,fixTypos,artistOf};
if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.Chat=api;
})(this);
