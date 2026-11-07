/* mini.js · the banner by the pet. The music engine is player.js (in the app window); this page shows what it says
   and asks it to do things. Two tabs: talk to the buddy (chat.js + voices.js, offline), or pick from your songs. */
'use strict';
const $=id=>document.getElementById(id);
const {fmt,esc}=Common;                          // common.js
PetKit.injectCSS();

let PET='sara', ST={}, LIB={tracks:[],playlists:[]}, LIST='all', DUR=0, POS=0, lastCmd='', quiet=0, faceAct=0;
const LOG={};                                    // chat history per buddy, so swapping buddies keeps each one's talk
const log=()=>LOG[PET]||(LOG[PET]=[]);
const voice=()=>VOICES[PET]||VOICES.sara;

/* ── the buddy ── */
function drawPet(){
  const d=PetKit.get(PET); PET=d.id;
  $('face').innerHTML=PetKit.svg(d.id);
  $('nm').textContent=d.name; $('kind').textContent=d.kind+' · your music buddy';
  $('in').placeholder=`Talk to ${d.name}…`;
  $('face').classList.toggle('playing',!!ST.playing);
  drawLog();
}
function faceDo(name){                           // the little face in the banner acts too
  const ms=PetKit.ACTS[name]; if(!ms) return; const f=$('face');
  f.className=f.className.replace(/\bact-\S+/g,'').trim(); void f.offsetWidth; f.classList.add('act-'+name);
  clearTimeout(faceAct); faceAct=setTimeout(()=>f.classList.remove('act-'+name),ms);
}

/* ── the song ── */
function drawState(s){
  const was=ST; ST=s||{};
  document.body.classList.toggle('playing',!!ST.playing);
  document.body.classList.toggle('idle',!ST.title);
  $('face').classList.toggle('playing',!!ST.playing);
  $('play').setAttribute('aria-label',ST.playing?'Pause':'Play');
  $('keep').hidden=!(ST.title&&ST.kind==='yt'&&!ST.saved);
  $('t').textContent=ST.title||'Nothing on yet';
  $('s').textContent=ST.title?(ST.sub||''):'Ask your buddy, or pick a song below';
  if(!ST.title){ DUR=0; prog({pos:0,dur:0}); }
  // a buddy remarks on a new song, but only one it didn't just start itself
  if(ST.title&&ST.title!==was.title&&was.title!==undefined&&Date.now()>quiet&&document.hasFocus()&&!$('pane-chat').hidden)
    say(Chat.onSong(ST.title,voice()),false);
  if(ST.id!==was.id||ST.playing!==was.playing) drawSongs();
}
function prog(p){
  DUR=p.dur||0; POS=p.pos||0; const f=DUR?Math.min(1,(p.pos||0)/DUR):0;
  $('fill').style.width=(f*100).toFixed(2)+'%';
  $('t0').textContent=fmt(p.pos); $('t1').textContent=DUR?fmt(DUR):'0:00';
  $('track').setAttribute('aria-valuenow',Math.round(f*100));
  $('track').setAttribute('aria-valuetext',`${fmt(p.pos)} of ${fmt(DUR)}`);
}
const cmd=c=>{ quiet=Date.now()+2500; lastCmd=c; buddies.send('mini-cmd',c); };
$('keep').onclick=()=>{ cmd('keep'); act('bow'); };
$('play').onclick=()=>cmd('toggle'); $('next').onclick=()=>cmd('next'); $('prev').onclick=()=>cmd('prev');
$('track').onclick=e=>{ if(!DUR) return; const r=$('track').getBoundingClientRect(); buddies.send('mini-seek',Math.min(1,Math.max(0,(e.clientX-r.left)/r.width))); };
$('track').onkeydown=e=>{
  if(!DUR) return; const now=parseFloat($('fill').style.width)/100||0;
  const step={ArrowRight:5,ArrowUp:5,ArrowLeft:-5,ArrowDown:-5,PageUp:30,PageDown:-30}[e.key];
  if(step!=null){ e.preventDefault(); buddies.send('mini-seek',Math.min(1,Math.max(0,now+step/DUR))); }
  else if(e.key==='Home'){ e.preventDefault(); buddies.send('mini-seek',0); }
};

/* ── chat ── */
function bubble(m){
  return m.me?`<div class="m me"><p>${esc(m.text)}</p></div>`
    :`<div class="m"><span class="av" aria-hidden="true">${PetKit.svg(PET)}</span><p>${esc(m.text)}</p></div>`;
}
function drawLog(){ $('msgs').innerHTML=log().map(bubble).join(''); scrollDown(); }
function scrollDown(){ const m=$('msgs'); m.scrollTop=m.scrollHeight; }
function add(m){ const L=log(); L.push(m); if(L.length>60) L.splice(0,L.length-60); const box=$('msgs'); box.insertAdjacentHTML('beforeend',bubble(m)); while(box.children.length>60) box.firstElementChild.remove(); scrollDown(); }
function say(text,talk=true){ add({text}); if(talk) faceDo('talk'); }
let typing=null;
function dots(on){
  if(on&&!typing){ typing=document.createElement('div'); typing.className='m typing';
    typing.innerHTML=`<span class="av" aria-hidden="true">${PetKit.svg(PET)}</span><p aria-label="typing"><i></i><i></i><i></i></p>`;
    $('msgs').appendChild(typing); scrollDown(); }
  if(!on&&typing){ typing.remove(); typing=null; }
}
let busy=false, offer=null;   // offer: a mood the buddy just suggested, so yes plays it
async function ask(text){
  text=String(text||'').trim().slice(0,200); if(!text||busy) return;
  busy=true; add({me:true,text}); dots(true);
  await new Promise(r=>setTimeout(r,380+Math.random()*260));
  const recent=log().filter(m=>!m.me).slice(-8).map(m=>m.text);
  const r=Chat.reply(text,{voice:voice(),pet:PET,state:ST,library:LIB,offer,recent,prog:{pos:POS,dur:DUR},hour:new Date().getHours(),last:lastCmd}); offer=r.offer||null;
  dots(false); say(r.say); act(r.act);
  const d=r.do;
  if(!d||!d.cmd) lastCmd='';
  if(d&&d.pet) setTimeout(()=>buddies.send('set-pet',d.pet),1200);      // let the goodbye be read first
  if(d&&d.cmd) cmd(d.cmd);
  else if(d&&d.seek!=null) buddies.send('mini-seek',d.seek);
  else if(d&&d.open) setTimeout(()=>buddies.send(d.open==='app'?'open-app':'open-folder'),600);
  else if(d&&d.link){
    dots(true); let one=null;
    try{ one=await buddies.ask('yt-info',d.link); }catch(e){ one=null; }
    dots(false);
    if(!one) say(d.say.missing);
    else { quiet=Date.now()+4000; buddies.send('mini-yt',one); say(Chat.fill(d.say.found,{t:one.title})); act('nod'); }
  }
  else if(d&&d.play){ quiet=Date.now()+2500; buddies.send('mini-play',d.play); }
  else if(d&&d.yt){
    dots(true); let found=null;
    try{ found=await buddies.ask('yt-search',d.yt); }catch(e){ found=null; }
    dots(false);
    if(found==null) say(d.say.offline);
    else if(!found.length) say(d.say.missing);
    else { quiet=Date.now()+4000; buddies.send('mini-yt',found[0]); say(Chat.fill(d.say.found,{t:found[0].title})); act('nod'); }
  }
  busy=false;
}
function act(n){ if(!n) return; buddies.send('mini-act',n); faceDo(n); }
$('say').onsubmit=e=>{ e.preventDefault(); if(busy) return; const v=$('in').value; $('in').value=''; ask(v); };   // busy: keep what was typed
$('quick').onclick=e=>{ const b=e.target.closest('[data-say]'); if(b) ask(b.dataset.say); };

/* ── songs ── */
function lists(){
  const ok=LIB.tracks.filter(t=>!t.bad);
  return [{id:'all',name:'All songs',n:ok.length}].concat((LIB.playlists||[]).map(p=>({id:p.id,name:p.name,n:(p.ids||[]).length})));
}
function drawLists(){
  if(LIST!=='all'&&!(LIB.playlists||[]).some(p=>p.id===LIST)) LIST='all';
  $('lists').innerHTML=lists().map(l=>`<button role="radio" aria-checked="${l.id===LIST}" tabindex="${l.id===LIST?0:-1}" data-list="${esc(l.id)}">${esc(l.name)}<i>${l.n}</i></button>`).join('');
}
function songsOf(id){
  if(id==='all') return LIB.tracks;
  const p=(LIB.playlists||[]).find(p=>p.id===id); if(!p) return [];
  const by=new Map(LIB.tracks.map(t=>[t.id,t])); return (p.ids||[]).map(i=>by.get(i)).filter(Boolean);
}
function drawSongs(){
  const q=Chat.norm($('q').value), all=songsOf(LIST);
  const ts=q?all.filter(t=>Chat.norm(t.title+' '+(t.channel||t.sub||'')).includes(q)):all;
  if(!LIB.tracks.length){ $('songs').innerHTML=`<div class="empty"><b>No songs yet</b>Drop music files on ${esc(PetKit.get(PET).name)}, or ask in the chat and they’ll find one on YouTube.</div>`; return; }
  if(!all.length){ $('songs').innerHTML=`<div class="empty"><b>This list is empty</b>Add songs to it in the Music Buddies window.</div>`; return; }
  if(!ts.length){ $('songs').innerHTML=`<div class="empty"><b>Nothing matches “${esc($('q').value)}”</b>Try fewer words, or ask in the chat to look on YouTube.</div>`; return; }
  $('songs').innerHTML=ts.map((t,i)=>{
    const cur=t.id===ST.id, sub=t.kind==='yt'?'YouTube'+(t.channel?' · '+t.channel:''):(t.sub||'On your computer');
    return `<button class="row${cur?' cur':''}${t.bad?' bad':''}" data-id="${esc(t.id)}"${t.bad?' disabled title="Can’t play this one"':''} aria-current="${cur}">
      ${cur?'<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>':`<span class="n">${i+1}</span>`}
      <span class="tx"><b>${esc(t.title)}</b><span>${esc(sub)}</span></span></button>`;
  }).join('');
}
$('lists').onclick=e=>{ const b=e.target.closest('[data-list]'); if(!b) return; LIST=b.dataset.list; drawLists(); drawSongs(); $('songs').scrollTop=0; };
$('lists').onkeydown=e=>{
  const d={ArrowRight:1,ArrowLeft:-1}[e.key]; if(!d) return; e.preventDefault();
  const L=lists(), i=(L.findIndex(l=>l.id===LIST)+d+L.length)%L.length; LIST=L[i].id; drawLists(); drawSongs();
  $('lists').querySelector(`[data-list="${CSS.escape(LIST)}"]`).focus();
};
$('q').oninput=drawSongs;
$('songs').onclick=e=>{ const b=e.target.closest('[data-id]'); if(!b||b.disabled) return; quiet=Date.now()+2500; buddies.send('mini-play',{id:b.dataset.id,from:LIST}); act('nod'); };

/* ── tabs ── */
function tab(which){
  const chat=which==='chat';
  $('tab-chat').setAttribute('aria-selected',chat); $('tab-songs').setAttribute('aria-selected',!chat);
  $('pane-chat').hidden=!chat; $('pane-songs').hidden=chat;
  if(chat){ scrollDown(); $('in').focus(); } else { drawLists(); drawSongs(); $('q').focus(); }
}
$('tab-chat').onclick=()=>tab('chat'); $('tab-songs').onclick=()=>tab('songs');
document.querySelector('.tabs').onkeydown=e=>{ if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ e.preventDefault(); const c=$('pane-chat').hidden; tab(c?'chat':'songs'); $(c?'tab-chat':'tab-songs').focus(); } };

/* ── the window ── */
$('open').onclick=()=>buddies.send('open-app');
$('close').onclick=()=>buddies.send('mini-close');
addEventListener('keydown',e=>{
  if(e.key==='Escape') buddies.send('mini-close');
  const typing=e.target.closest&&e.target.closest('input,textarea');
  if(e.key===' '&&!typing&&!(e.target.closest&&e.target.closest('button,[role=slider]'))){ e.preventDefault(); cmd('toggle'); }
});

buddies.on('state',drawState);
buddies.on('prog',prog);
buddies.on('library',l=>{ LIB=l||{tracks:[],playlists:[]}; if(!$('pane-songs').hidden){ drawLists(); drawSongs(); } });
buddies.on('pet',p=>{ const id=PetKit.get(p&&p.id||p).id; if(id!==PET){ PET=id; drawPet(); if(!log().length&&document.hasFocus()) say(Chat.greet(ST,voice())); } });
buddies.on('open',()=>{
  if(!log().length) say(Chat.greet(ST,voice()));
  if($('pane-chat').hidden) $('q').focus(); else $('in').focus();
});

buddies.ask('mini-init').then(o=>{
  o=o||{}; PET=PetKit.get(o.pet).id; LIB=o.library||LIB;
  drawPet(); drawState(o.state||{}); ST.title=ST.title||''; drawLists(); drawSongs();
});
