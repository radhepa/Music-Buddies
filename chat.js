/* chat.js · what a buddy makes of what you type, and what it says back.
   No network and no AI: a few plain patterns (play X, skip, louder, something chill...) and each buddy's
   own lines from voices.js. Pure, so test/chat.test.js can run it with node.

   reply(text, ctx) → {say, act, do, offer?}
     ctx:  {pet, voice, state:{playing,title,id,from,shuffle,up,kind,saved}, library:{tracks,playlists}, rand, offer}
     offer: a mood the buddy just offered ("want something chill?"); pass it back as ctx.offer and "yes" plays it
     say:  the buddy's answer          act: which pet act goes with it ('talk' or 'nod')
     do:   what the music should do, or null:
           {cmd:'toggle'|'next'|'prev'|'shuffle'|'vol-up'|'vol-down'|'repeat-one'|'repeat-off'|'keep'}
           {play:{id,from}}            a song from the library, queued from that list ('all' or a playlist id)
           {yt:'query', say:{found,missing}}   nothing in the library fits: look on YouTube, play the first result */
(function(root){
'use strict';
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
const words=s=>norm(s).split(' ').filter(w=>w&&!STOP.has(w));
const STOP=new Set(['the','a','an','some','my','me','please','pls','song','songs','music','track','by','to','for','of','on','up','can','you','could','would','put','play','i','want','wanna','hear','listen','lets','let','us','something','any','that','this','one','kind']);
const pick=(list,rand)=>list[Math.floor((rand||Math.random)()*list.length)%list.length];
/* a song name short enough to say: no "[Official Video]" or "(lyrics)", cut at a word near 46 letters */
const short=t=>{ t=String(t||'').replace(/\s*[\[(【][^\])】]*[\])】]/g,'').replace(/\s+[-|·]\s+.*$/,m=>t.length>46?'':m).trim()||String(t||'');
  return t.length<=46?t:t.slice(0,46).replace(/\s+\S*$/,'')+'…'; };
const fill=(s,v)=>String(s).replace(/\{(\w+)\}/g,(m,k)=>v[k]==null?m:k==='t'?short(v[k]):v[k]);

/* moods: words people say → words that might be in a song or playlist name, and a YouTube search */
const MOODS={
  chill:{say:['chill','calm','relax','relaxing','lofi','lo fi','study','studying','focus','sleep','soft','quiet','cozy','rain'],look:['chill','lofi','lo fi','study','calm','relax','sleep','piano','ambient','acoustic'],yt:'lofi hip hop chill beats'},
  hype:{say:['hype','energy','energetic','pump','pumped','workout','gym','party','upbeat','dance','loud','banger','bangers','fast'],look:['hype','workout','gym','party','dance','remix','edm','rock'],yt:'upbeat energetic music mix'},
  sad:{say:['sad','cry','crying','down','blue','heartbreak','lonely','emo'],look:['sad','slow','acoustic','piano','rain','cry'],yt:'sad songs playlist'},
  happy:{say:['happy','good mood','sunny','cheerful','fun','feel good','joy'],look:['happy','summer','sun','good','fun','pop'],yt:'feel good happy songs'}
};
const moodOf=t=>{ const n=' '+norm(t)+' '; for(const [k,m] of Object.entries(MOODS)) if(m.say.some(w=>n.includes(' '+w+' '))) return k; return null; };

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
function moodPick(mood,lib,rand){
  const look=MOODS[mood].look, has=n=>{ n=' '+norm(n)+' '; return look.some(w=>n.includes(' '+w)); };
  const pl=(lib.playlists||[]).find(p=>has(p.name)&&firstOf(p,lib));
  if(pl) return {pl};
  const ts=playable(lib).filter(t=>has(t.title));
  return ts.length?{t:pick(ts,rand)}:null;
}

function reply(text,ctx){
  const V=ctx.voice, st=ctx.state||{}, lib=ctx.library||{tracks:[],playlists:[]}, rand=ctx.rand;
  const say=(k,v={},act='talk',d=null)=>({say:fill(pick(V[k]||V.unknown,rand),Object.assign({t:st.title||''},v)),act,do:d});
  const n=norm(text), has=re=>re.test(n);
  if(!n) return say('unknown');

  /* the controls (looping first, so "stop repeating" isn't a pause) */
  if(has(/\b(loop\w*|repeat\w*)\b/)) return has(/\b(stop|no|off|dont|don't|unloop|enough)\b/)?say('repeatOff',{},'nod',{cmd:'repeat-off'})
    :st.title?say('repeatOne',{},'nod',{cmd:'repeat-one'}):say('nothingOn');
  if(has(/^(pause|stop|hold on|wait|shh+|quiet please)\b/)) return st.playing?say('pause',{},'nod',{cmd:'toggle'}):say('alreadyPaused');
  if(has(/^(resume|unpause|continue|keep going|go on|play)$/)) return st.title&&!st.playing?say('resume',{},'nod',{cmd:'toggle'}):st.playing?say('nowPlaying'):startAny();
  if(has(/^(next|skip|another|next one|skip (it|this|this one)|nah|not this one)\b/)) return st.title?say('next',{},'nod',{cmd:'next'}):startAny();
  if(has(/\b(save|keep|add) (this|it|that|this song|this one)\b|^(i )?(like|love) (this|it)( one| song)?$/))
    return !st.title?say('nothingOn'):st.kind==='yt'&&!st.saved?say('keep',{},'bow',{cmd:'keep'}):say('alreadyKept');
  if(has(/^(back|previous|prev|go back|last one|again|replay)\b/)) return st.title?say('prev',{},'nod',{cmd:'prev'}):startAny();
  if(has(/\bshuffle\b|\bmix it up\b/)) return say(st.shuffle?'shuffleOff':'shuffleOn',{},'nod',{cmd:'shuffle'});
  if(has(/\b(louder|turn (it )?up|volume up|crank)\b/)) return say('louder',{},'nod',{cmd:'vol-up'});
  if(has(/\b(quieter|softer|turn (it )?down|volume down|too loud)\b/)) return say('quieter',{},'nod',{cmd:'vol-down'});

  /* "yes" to the last thing the buddy offered */
  if(ctx.offer&&has(/^(yes|yeah|yep|yup|sure|ok|okay|please|go|do it|sounds good|alright)\b/)) return reply('play something '+ctx.offer,Object.assign({},ctx,{offer:null}));
  if(has(/\b(what'?s next|what is next|up next|after this)\b/)) return st.up?say('upNext',{t:st.up}):st.shuffle?say('upShuffle'):say('upNone');

  /* questions about the music */
  if(has(/\b(what('?s| is) (this|playing|on)|what song|which song|whats this|now playing|song name)\b/)) return st.title?say('nowPlaying'):say('nothingOn');
  if(has(/\b(surprise me|random|anything|whatever|you pick|dealer'?s choice|something good)\b/)) return startAny(true);

  /* play X, or a mood */
  const m=n.match(/^(?:can you |could you |please |pls )?(?:play|put on|queue|i want(?: to hear)?|i wanna hear|let'?s hear|throw on|spin)\s+(.+)$/);
  const mood=moodOf(n);
  if(m||mood){
    const q=m?m[1]:n;
    if(mood){ const got=moodPick(mood,lib,rand); if(got) return got.pl?playList(got.pl):playTrack(got.t,'all'); }
    const hit=m&&find(q,lib);
    if(hit) return hit.pl?playList(hit.pl):playTrack(hit.t,'all');
    const yq=mood?MOODS[mood].yt:q;
    return {say:fill(pick(V.ytLooking,rand),{q:mood?mood:q}),act:'talk',do:{yt:yq,say:{found:pick(V.ytPlay,rand),missing:fill(pick(V.notFound,rand),{q})}}};
  }
  if(has(/^(hi|hey|hello|yo|hiya|heya|sup|howdy|good (morning|afternoon|evening))\b/)) return say(st.playing?'helloPlaying':'hello',{},'wave');
  if(has(/\b(how are you|how'?s it going|how are u|you ok|how do you feel)\b/)) return say('howAreYou');
  if(has(/\b(who are you|what are you|your name|about you|tell me about yourself)\b/)) return say('who');
  if(has(/\b(thank|thanks|thx|ty|appreciate)\b/)) return say('thanks',{},'nod');
  if(has(/\b(bye|goodbye|see you|see ya|later|gotta go|good ?night)\b/)) return say('bye',{},'wave');
  if(has(/\b(love you|you'?re (cute|the best|great|adorable)|good (boy|girl|buddy))\b/)) return say('love',{},'bow');
  if(has(/\b(study|studying|homework|exam|focus|work|stressed|tired|essay|deadline)\b/)) return Object.assign(say('focus'),{offer:'chill'});
  if(has(/\b(help|what can you do|commands|how do i)\b/)) return say('help');
  if(has(/\b(favou?rite)\b/)) return say('favorite');
  return say('unknown');

  function playTrack(t,from){ return say('play',{t:t.title},'nod',{play:{id:t.id,from}}); }
  function playList(pl){ const id=firstOf(pl,lib); return id?say('playList',{pl:pl.name},'nod',{play:{id,from:pl.id}}):say('emptyList',{pl:pl.name}); }
  function startAny(surprise){
    const ts=playable(lib); if(!ts.length) return say('empty');
    const t=surprise||!st.title?pick(ts,rand):null;
    return t?say('random',{t:t.title},'nod',{play:{id:t.id,from:'all'}}):say('nowPlaying');
  }
}

/* a line for when a song starts while the chat is open (not every time: chatter is a distraction) */
function onSong(title,voice,rand){ return fill(pick(voice.songChange,rand),{t:title}); }
function greet(st,voice,rand){ return fill(pick(voice[st&&st.playing?'helloPlaying':'hello'],rand),{t:st&&st.title||''}); }

const api={reply,onSong,greet,find,norm,moodOf,fill,short};
if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.Chat=api;
})(this);
