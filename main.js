/* main.js · Music Buddies, with Sara the music kappa
   ─────────────────────────────────────────────────────────────────────────
   A desktop pet that plays your music. Sara is a kappa on a lily
   pad who floats a record in the dish on her head. Drop songs (or a whole
   folder) on her and they join her library, named after their files. Anything
   put in Music\Sara joins it too. Tap her for the player: playlists, and
   YouTube by search or link with only the player itself, no feed, no comments,
   nothing to click away to.

   Windows: Sara's own small see-through window, and the player beside her.
   The player page is the music engine (an <audio> for files). A YouTube song
   plays in a small view inside the player (YouTube's own embedded player,
   held on that one video); close the player and the sound carries on. */
'use strict';
const {app,BrowserWindow,WebContentsView,ipcMain,screen,Menu,shell,dialog,globalShortcut,net}=require('electron');
const path=require('path'), fs=require('fs'), {pathToFileURL}=require('url');
const lib=require('./library');

app.setAppUserModelId('music.buddies');
if(!process.argv.includes('--gpu')) app.disableHardwareAcceleration();
{ const p=process.argv.find(x=>x.startsWith('--profile=')); if(p) app.setPath('userData',path.resolve(p.slice(10))); }
if(!app.requestSingleInstanceLock()){ app.quit(); return; }

/* ════════════════════ settings and library (one file in her own folder) ════════════════════ */
const SIZES={xs:80,s:110,m:140,l:180,xl:230};
const FILE=()=>path.join(app.getPath('userData'),'sara.json');
/* the app was first called catching-days-sara: bring that library over once */
try{ const old=path.join(app.getPath('appData'),'catching-days-sara','sara.json');
  if(!fs.existsSync(FILE())&&fs.existsSync(old)){ fs.mkdirSync(path.dirname(FILE()),{recursive:true}); fs.copyFileSync(old,FILE()); } }catch(e){}
const FOLDER=()=>path.join(app.getPath('music'),'Sara');
const DEFAULTS={pos:null,peek:null,win:null,pet:'sara',size:'m',volume:.8,shuffle:false,repeat:'all',view:'all',library:{tracks:[],playlists:[]}};
let S=null;
function load(){
  try{ S=Object.assign({},DEFAULTS,JSON.parse(fs.readFileSync(FILE(),'utf8'))); }catch(e){ S=Object.assign({},DEFAULTS); }
  if(!SIZES[S.size]) S.size='m';
  if(typeof S.pet!=='string'||!S.pet) S.pet='sara';
  if(!S.library||!Array.isArray(S.library.tracks)) S.library={tracks:[],playlists:[]};
  if(!Array.isArray(S.library.playlists)) S.library.playlists=[];
}
let saveT=null;
function save(now){
  clearTimeout(saveT);
  const go=()=>{ try{
    fs.mkdirSync(path.dirname(FILE()),{recursive:true});
    const tmp=FILE()+'.tmp'; fs.writeFileSync(tmp,JSON.stringify(S)); fs.renameSync(tmp,FILE());
  }catch(e){} };
  if(now) go(); else saveT=setTimeout(go,500);
}

/* ════════════════════ turning dropped paths into songs ════════════════════ */
function scan(paths){
  const out=[], seen=new Set();
  const visit=(p,depth)=>{
    if(out.length>=5000||depth>8) return;
    let st; try{ st=fs.statSync(p); }catch(e){ return; }
    if(st.isDirectory()){ let names=[]; try{ names=fs.readdirSync(p).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})); }catch(e){} names.forEach(n=>visit(path.join(p,n),depth+1)); return; }
    if(!lib.AUDIO.test(p)) return;
    const key=p.toLowerCase(); if(seen.has(key)) return; seen.add(key);
    out.push({kind:'file',title:lib.titleOf(p),path:p,url:pathToFileURL(p).href,sub:path.basename(path.dirname(p))});
  };
  (paths||[]).forEach(p=>{ if(typeof p==='string'&&p) visit(path.resolve(p),0); });
  return out;
}
function ensureFolder(){ try{ fs.mkdirSync(FOLDER(),{recursive:true}); }catch(e){} return FOLDER(); }
let folderT=null;
function watchFolder(){
  try{ fs.watch(ensureFolder(),{recursive:true},()=>{ clearTimeout(folderT); folderT=setTimeout(()=>send(playerWin,'add-tracks',{tracks:scan([FOLDER()])}),800); }); }catch(e){}
}

/* ════════════════════ YouTube: search and names, read here (no browser limits) ════════════════════ */
async function ytSearch(q){
  q=String(q||'').trim().slice(0,200); if(!q) return [];
  /* sp=EgIQAQ%3D%3D: videos only, no channels or playlists */
  const r=await net.fetch('https://www.youtube.com/results?sp=EgIQAQ%253D%253D&search_query='+encodeURIComponent(q),{headers:{'Accept-Language':'en-US,en;q=0.9'}});
  return lib.parseSearch(await r.text());
}
async function ytInfo(url){
  const id=lib.ytIdOf(url); if(!id) return null;
  try{
    const r=await net.fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+id));
    const o=await r.json(); return {yt:id,title:o.title||'YouTube video',channel:o.author_name||''};
  }catch(e){ return {yt:id,title:'YouTube video',channel:''}; }
}

/* the YouTube player: YouTube's own embed, in a view inside the player window.
   It is held to that one video: links out of it (the logo, the title, end cards) never open. */
let ytView=null, ytPoll=null, ytSlot={x:0,y:0,width:0,height:0};
const YT_PROBE=`(()=>{const v=document.querySelector('video');const err=!!document.querySelector('.ytp-error');
  if(!v) return {ok:false,err};return {ok:true,err,t:v.currentTime,d:v.duration||0,paused:v.paused,ended:v.ended,ad:!!document.querySelector('.ad-showing')};})()`;
function ytEnsure(){
  if(ytView&&!ytView.webContents.isDestroyed()) return ytView;
  ytView=new WebContentsView({webPreferences:{contextIsolation:true,sandbox:true,nodeIntegration:false,backgroundThrottling:false,
    autoplayPolicy:'no-user-gesture-required',partition:'persist:youtube'}});
  ytView.setBackgroundColor('#0f3b41');
  const wc=ytView.webContents;
  wc.setWindowOpenHandler(()=>({action:'deny'}));
  wc.on('will-navigate',(e,url)=>{ if(!/^https:\/\/www\.youtube-nocookie\.com\/embed\//.test(url)) e.preventDefault(); });
  playerWin.contentView.addChildView(ytView);
  ytView.setBounds(ytSlot);
  return ytView;
}
function yt(o){
  if(!o||!playerWin) return;
  if(o.cmd==='load'&&/^[\w-]{11}$/.test(o.id)){
    const v=ytEnsure(); v.setVisible(true); v.setBounds(ytSlot);
    /* the embed refuses to play with no referrer, or with YouTube's own; any other site's name will do */
    v.webContents.loadURL(`https://www.youtube-nocookie.com/embed/${o.id}?autoplay=1&rel=0&iv_load_policy=3&playsinline=1&fs=0&disablekb=1&modestbranding=1`,{httpReferrer:'https://sara.localhost/'});
    v.webContents.once('did-finish-load',()=>ytRun(`(()=>{const v=document.querySelector('video');if(v){v.volume=${+o.vol||0};v.play().catch(()=>{});}})()`));
    clearInterval(ytPoll);
    ytPoll=setInterval(async()=>{ const s=await ytRun(YT_PROBE); if(s) send(playerWin,'yt-state',s); },500);
    return;
  }
  if(!ytView||ytView.webContents.isDestroyed()) return;
  const js={play:`v.play().catch(()=>{})`,pause:`v.pause()`,seek:`v.currentTime=${+o.t||0}`,volume:`v.volume=${Math.min(1,Math.max(0,+o.v||0))}`}[o.cmd];
  if(js) ytRun(`(()=>{const v=document.querySelector('video');if(v){${js};}})()`);
  if(o.cmd==='stop'){ clearInterval(ytPoll); ytPoll=null; ytView.setVisible(false); ytView.webContents.loadURL('about:blank'); }
}
function ytRun(js){
  if(!ytView||ytView.webContents.isDestroyed()) return Promise.resolve(null);
  return ytView.webContents.executeJavaScript(js,true).catch(()=>null);
}

/* ════════════════════ the pet's window: size, place, peeking (tucked behind a screen edge) ════════════════════
   The window is a little bigger than the pet (room to hop and lean). Its spot on
   screen is "virtual": push the pet past the left, right or bottom edge and the
   window stays at the edge while the distance pushed becomes how far the pet has
   slipped behind it (p, 0..1). Clicks fall through everywhere but the pet. */
let petWin=null, playerWin=null, miniWin=null;
const FOOT=s=>Math.round(s*.08);                 // under the pad, for its ripples
function geo(){ const s=SIZES[S.size]||140; return {S:s,W:Math.round(s*1.6),H:Math.round(s*1.5)+FOOT(s),FOOT:FOOT(s),travel:Math.round(s*.8)}; }
let virt={x:0,y:0}, peek={edge:null,p:0};
function send(win,ch,data){ try{ if(win&&!win.isDestroyed()) win.webContents.send(ch,data); }catch(e){} }
function workAreaAt(x,y){ return screen.getDisplayNearestPoint({x:Math.round(x),y:Math.round(y)}).workArea; }
function layout(vx,vy){
  const g=geo(), wa=workAreaAt(vx+g.W/2,vy+g.H/2);
  const right=wa.x+wa.width, bottom=wa.y+wa.height;
  const x=Math.min(Math.max(vx,wa.x),right-g.W), y=Math.min(Math.max(vy,wa.y),bottom-g.H);
  const o={r:vx+g.W-right,l:wa.x-vx,b:vy+g.H-bottom};
  let edge=null, best=0;
  Object.keys(o).forEach(k=>{ if(o[k]>best){ best=o[k]; edge=k; } });
  return {x:Math.round(x),y:Math.round(y),edge,p:edge?Math.min(1,best/g.travel):0};
}
/* the virtual spot that gives a full peek on an edge, from where the window sits */
function virtFor(x,y,edge){
  const g=geo();
  return edge==='r'?{x:x+g.travel,y}:edge==='l'?{x:x-g.travel,y}:edge==='b'?{x,y:y+g.travel}:{x,y};
}
/* bounds spelled out every time: on a scaled screen setPosition alone lets the window creep bigger */
function setSpot(x,y){
  const g=geo(), b=petWin.getBounds();
  if(b.x!==x||b.y!==y||b.width!==g.W||b.height!==g.H) petWin.setBounds({x,y,width:g.W,height:g.H});
}
function place(vx,vy,animate){
  const L=layout(vx,vy); virt={x:vx,y:vy};
  setSpot(L.x,L.y);
  if(L.edge!==peek.edge||Math.abs(L.p-peek.p)>.004||animate){
    peek={edge:L.edge,p:L.p}; send(petWin,'peek',Object.assign({animate:!!animate},peek));
  }
  return L;
}
function defaultSpot(){ const g=geo(), wa=screen.getPrimaryDisplay().workArea; return {x:wa.x+wa.width-g.W-190,y:wa.y+wa.height-g.H}; }
function restorePlace(){
  const g=geo();
  let p=S.pos&&isFinite(S.pos.x)&&isFinite(S.pos.y)?{x:S.pos.x,y:S.pos.y}:defaultSpot();
  const wa=workAreaAt(p.x+g.W/2,p.y+g.H/2);               // a monitor that's gone: start again in the corner
  if(p.x+g.W<wa.x||p.x>wa.x+wa.width||p.y+g.H<wa.y||p.y>wa.y+wa.height) p=defaultSpot();
  const L=layout(p.x,p.y), v=virtFor(L.x,L.y,S.peek&&S.peek.edge||null);
  place(v.x,v.y,false);
}
function remember(){ const b=petWin.getBounds(); S.pos={x:b.x,y:b.y}; S.peek=peek.edge&&peek.p>.5?{edge:peek.edge}:null; save(); }
/* ── dragging: the cursor is read here every 8ms, so a fast flick never leaves her behind ── */
let drag=null;
function dragStart(press){
  if(drag||!petWin) return;
  setIgnore(false);
  const c=screen.getCursorScreenPoint();
  const start=press&&isFinite(press.x)&&isFinite(press.y)?press:c;   // the IPC can land after the cursor has moved on
  drag={ox:start.x-virt.x,oy:start.y-virt.y,lastX:c.x,t:setInterval(dragTick,8)};
  dragTick();
}
function dragTick(){
  if(!drag) return;
  const c=screen.getCursorScreenPoint();
  place(c.x-drag.ox,c.y-drag.oy,false);
  const dx=c.x-drag.lastX; drag.lastX=c.x;
  send(petWin,'drag',{on:true,dx});
}
function dragEnd(){
  if(!drag) return;
  clearInterval(drag.t); dragTick(); drag=null;
  send(petWin,'drag',{on:false,dx:0});
  /* let go: mostly behind the edge, she tucks in; otherwise she hops back out */
  const b=petWin.getBounds();
  if(peek.edge&&peek.p>=.35){ const v=virtFor(b.x,b.y,peek.edge); place(v.x,v.y,true); }
  else { const L=layout(virt.x,virt.y); place(L.x,L.y,true); }
  remember();
}

/* ── clicks fall through except over the pet. The page says when the cursor is on
   her; in case Windows stops forwarding moves (and while files are dragged over
   from Explorer), the cursor is read here too and handed to the page to test ── */
let ignoreNow=true, probeIn=false;
function setIgnore(on){
  if(!petWin||petWin.isDestroyed()||ignoreNow===on) return;
  try{ petWin.setIgnoreMouseEvents(on,{forward:true}); ignoreNow=on; }catch(e){}
}
setInterval(()=>{
  if(!petWin||petWin.isDestroyed()||drag||!petWin.isVisible()) return;
  const c=screen.getCursorScreenPoint(), b=petWin.getBounds();
  const inside=c.x>=b.x&&c.x<b.x+b.width&&c.y>=b.y&&c.y<b.y+b.height;
  if(inside||probeIn) send(petWin,'probe',{x:c.x-b.x,y:c.y-b.y,inside});
  probeIn=inside;
},100);
setInterval(()=>{ try{ if(petWin&&petWin.isVisible()){ petWin.setAlwaysOnTop(true,'pop-up-menu'); petWin.moveTop(); } }catch(e){} },500);

function createPet(){
  const g=geo();
  petWin=new BrowserWindow({width:g.W,height:g.H,frame:false,transparent:true,resizable:false,movable:false,alwaysOnTop:true,skipTaskbar:true,
    focusable:true,hasShadow:false,fullscreenable:false,maximizable:false,minimizable:false,show:false,backgroundColor:'#00000000',title:'Sara',
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false,backgroundThrottling:false}});
  petWin.setIgnoreMouseEvents(true,{forward:true}); ignoreNow=true;
  petWin.loadFile(path.join(__dirname,'pet.html'));
  petWin.once('ready-to-show',()=>{
    restorePlace();
    setIgnore(false); probeIn=true; send(petWin,'hit-reset',{});
    petWin.showInactive(); petWin.setAlwaysOnTop(true,'pop-up-menu');
  });
  petWin.on('hide',()=>dragEnd());
  petWin.webContents.on('render-process-gone',()=>{ dragEnd(); try{ petWin.reload(); }catch(e){} });
  petWin.on('closed',()=>{ petWin=null; app.quit(); });
}
function resizePet(){
  const g=geo(), b=petWin.getBounds();
  petWin.setResizable(true); petWin.setSize(g.W,g.H); petWin.setResizable(false);
  const nx=b.x+Math.round((b.width-g.W)/2), ny=b.y+(b.height-g.H);      // keep her feet where they were
  const v=virtFor(nx,ny,peek.edge&&peek.p>.5?peek.edge:null);
  place(v.x,v.y,false);
  send(petWin,'geo',g); remember();
}

/* ── which yokai is out: the one picked for the playlist that's playing, else the everyday one ── */
let PETS=[{id:'sara',name:'Sara',kind:'kappa'}], sentPet=null;
const activePet=()=>state.pet||S.pet||'sara';
function syncPet(){
  const id=activePet(); send(playerWin,'pet',{id,everyday:S.pet});   // the window also shows the everyday pick
  if(id===sentPet) return; sentPet=id; send(petWin,'pet',{id}); send(miniWin,'pet',{id});
}

/* ════════════════════ the Music Buddies window: songs, playlists, YouTube, which buddy ════════════════════
   A normal window of its own (in the taskbar, sized and placed where you leave it). Closing it only hides
   it: it is the music engine too, so the music keeps going. */
const ICON=path.join(__dirname,'icon.png');
function onScreen(b){
  return !!b&&screen.getAllDisplays().some(d=>{ const a=d.workArea;
    return b.x<a.x+a.width-80&&b.x+b.width>a.x+80&&b.y>=a.y-10&&b.y<a.y+a.height-80; });
}
function createPlayer(){
  playerWin=new BrowserWindow(Object.assign({width:960,height:640},onScreen(S.win)?S.win:{},{minWidth:760,minHeight:520,show:false,
    title:'Music Buddies',icon:ICON,backgroundColor:'#fbf8f2',autoHideMenuBar:true,
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false,backgroundThrottling:false,
      autoplayPolicy:'no-user-gesture-required'}}));
  playerWin.setMenu(null);
  playerWin.loadFile(path.join(__dirname,'player.html'));
  const keep=()=>{ if(!playerWin.isMaximized()&&!playerWin.isMinimized()){ S.win=playerWin.getBounds(); save(); } };
  playerWin.on('resized',keep); playerWin.on('moved',keep);
  playerWin.on('close',e=>{ if(!quitting){ e.preventDefault(); closePlayer(); } });
}
const playerOpen=()=>!!playerWin&&playerWin.isVisible()&&!playerWin.isMinimized();
function openPlayer(){ if(playerWin.isMinimized()) playerWin.restore(); playerWin.show(); playerWin.focus(); send(playerWin,'open',{}); }
function closePlayer(){ if(playerWin) playerWin.hide(); }
const togglePlayer=()=>playerOpen()?closePlayer():openPlayer();

/* ════════════════════ the banner: a small panel by the pet ════════════════════
   Tapping the pet (or Ctrl+]) brings this up, not the whole app: what's on and its controls, a chat with the
   buddy (who can play things for you), and your playlists with a search. A button opens the whole window.
   It goes away as soon as you click anywhere else. */
const MW=392, MH=584;
function petRect(){
  const g=geo(), b=petWin.getBounds(), s=g.S;
  if(peek.edge==='r'&&peek.p>.5) return {x:b.x+g.W-s*.6,y:b.y+g.H/2-s*.45,w:s*.6,h:s*.8};
  if(peek.edge==='l'&&peek.p>.5) return {x:b.x,y:b.y+g.H/2-s*.45,w:s*.6,h:s*.8};
  if(peek.edge==='b'&&peek.p>.5) return {x:b.x+g.W/2-s*.5,y:b.y+g.H-s*.45,w:s,h:s*.45};
  return {x:b.x+(g.W-s)/2,y:b.y+g.H-g.FOOT-s,w:s,h:s+g.FOOT};
}
function createMini(){
  miniWin=new BrowserWindow({width:MW,height:MH,frame:false,transparent:true,resizable:false,alwaysOnTop:true,skipTaskbar:true,
    hasShadow:false,fullscreenable:false,maximizable:false,minimizable:false,show:false,backgroundColor:'#00000000',title:'Music Buddies · now playing',
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}});
  miniWin.loadFile(path.join(__dirname,'mini.html'));
  miniWin.on('blur',()=>closeMini());
}
let miniShut=0;   // when it last went away: the tap on the pet that blurred it shouldn't bring it straight back
const miniOpen=()=>!!miniWin&&miniWin.isVisible();
function openMini(){
  if(!miniWin||!petWin) return;
  /* beside the pet, on whichever side has room, its foot level with the pet's feet */
  const r=petRect(), wa=workAreaAt(r.x+r.w/2,r.y+r.h/2), h=Math.min(MH,wa.height);
  let x=r.x-MW+6; if(x<wa.x) x=r.x+r.w-6;
  x=Math.round(Math.min(Math.max(x,wa.x),wa.x+wa.width-MW));
  const y=Math.round(Math.min(Math.max(r.y+r.h-h+10,wa.y),wa.y+wa.height-h));
  miniWin.setBounds({x,y,width:MW,height:h});
  send(miniWin,'state',state); send(miniWin,'open',{});
  miniWin.show(); miniWin.focus(); miniWin.setAlwaysOnTop(true,'pop-up-menu');
  send(petWin,'act','wave');
}
function closeMini(){ if(miniOpen()){ miniWin.hide(); miniShut=Date.now(); } }
function toggleMini(){ if(miniOpen()) closeMini(); else if(Date.now()-miniShut>350) openMini(); }
/* Ctrl+]: bring her out with the banner; pressed again, put it away */
function wake(){
  if(petWin&&!petWin.isVisible()) petWin.showInactive();
  if(miniOpen()) closeMini(); else openMini();
}

function addMusic(){
  dialog.showOpenDialog({title:'Give Sara some music',properties:['openFile','multiSelections'],
    filters:[{name:'Music',extensions:['mp3','m4a','aac','wav','ogg','oga','opus','flac','webm','weba']}]})
    .then(r=>{ if(!r.canceled&&r.filePaths.length) send(playerWin,'add-tracks',{tracks:scan(r.filePaths),play:!state.playing,drop:true}); });
}
let state={playing:false,title:'',pet:''};
function petMenu(){
  const cmd=c=>()=>send(playerWin,'cmd',c);
  return Menu.buildFromTemplate([
    {label:playerOpen()?'Close Music Buddies':'Open Music Buddies',click:togglePlayer},
    {label:state.playing?'Pause':'Play',click:cmd('toggle')},
    {label:'Next song',click:cmd('next')},
    {type:'separator'},
    {label:'Add music…',click:addMusic},
    {label:'Open Sara’s folder',click:()=>shell.openPath(ensureFolder())},
    {label:'Pet',submenu:PETS.map(p=>({label:`${p.name} · ${p.kind}`,type:'radio',checked:S.pet===p.id,click:()=>{ S.pet=p.id; save(); syncPet(); }}))
      .concat(state.pet&&state.pet!==S.pet?[{type:'separator'},{label:`This playlist has its own: ${(PETS.find(p=>p.id===state.pet)||{name:state.pet}).name}`,enabled:false}]:[])},
    {label:'Size',submenu:[['xs','Tiny'],['s','Small'],['m','Medium'],['l','Large'],['xl','Huge']].map(([k,l])=>({label:l,type:'radio',checked:S.size===k,click:()=>{
      S.size=k; save(); resizePet();
    }}))},
    {type:'separator'},
    {label:'Quit Music Buddies',click:()=>app.quit()}
  ]);
}

/* ════════════════════ messages from the pages ════════════════════ */
ipcMain.handle('init',()=>({pet:activePet(),everyday:S.pet,volume:S.volume,shuffle:S.shuffle,repeat:S.repeat,view:S.view,library:S.library,folder:ensureFolder(),
  folderTracks:scan([FOLDER()])}));
ipcMain.handle('scan',(e,paths)=>scan(paths));
ipcMain.handle('yt-search',(e,q)=>ytSearch(q).catch(()=>null));
ipcMain.handle('yt-info',(e,url)=>ytInfo(url));
/* a little native menu for a song or playlist row; resolves with the chosen item's id (or null) */
ipcMain.handle('menu',(e,items)=>new Promise(resolve=>{
  const build=list=>(list||[]).map(it=>it.sep?{type:'separator'}:it.items?{label:String(it.label),submenu:build(it.items)}
    :{label:String(it.label),enabled:it.enabled!==false,click:()=>resolve(it.id)});
  /* closing without a pick: the click (if any) can land just after this, so wait a moment */
  Menu.buildFromTemplate(build(items)).popup({window:BrowserWindow.fromWebContents(e.sender),callback:()=>setTimeout(()=>resolve(null),150)});
}));
ipcMain.on('save',(e,o)=>{
  if(!o||typeof o!=='object') return;
  ['volume','shuffle','repeat','view'].forEach(k=>{ if(k in o) S[k]=o[k]; });
  if(o.library&&Array.isArray(o.library.tracks)){ S.library=o.library; send(miniWin,'library',S.library); }
  save();
});
ipcMain.on('state',(e,o)=>{ state=Object.assign(state,o||{}); if(typeof state.pet!=='string') state.pet=''; send(petWin,'state',state); send(miniWin,'state',state); syncPet(); });
ipcMain.handle('pet-init',()=>{ sentPet=activePet(); return {geo:geo(),peek,pet:sentPet,state}; });
ipcMain.on('pets',(e,list)=>{ if(Array.isArray(list)&&list.length) PETS=list.filter(p=>p&&typeof p.id==='string').map(p=>({id:p.id,name:String(p.name),kind:String(p.kind)})); });
ipcMain.on('ignore',(e,on)=>{ if(!drag) setIgnore(!!on); });
ipcMain.on('yt',(e,o)=>yt(o));
ipcMain.on('yt-slot',(e,r)=>{
  if(!r) return;
  ytSlot={x:Math.round(r.x),y:Math.round(r.y),width:Math.max(0,Math.round(r.w)),height:Math.max(0,Math.round(r.h))};
  if(ytView&&!ytView.webContents.isDestroyed()) ytView.setBounds(ytSlot);
});
ipcMain.on('drop-paths',(e,paths)=>{ const tracks=scan(paths); if(tracks.length) send(playerWin,'add-tracks',{tracks,play:!state.playing,drop:true}); });
ipcMain.on('drag-start',(e,press)=>{ closeMini(); dragStart(press); });
ipcMain.on('drag-end',()=>dragEnd());
ipcMain.on('tap',()=>toggleMini());
ipcMain.on('mini-cmd',(e,c)=>{ if(['toggle','next','prev','shuffle','vol-up','vol-down','repeat-one','repeat-off','keep'].includes(c)) send(playerWin,'cmd',c); });
ipcMain.on('mini-close',()=>closeMini());
ipcMain.handle('mini-init',()=>({pet:activePet(),state,library:S.library||{tracks:[],playlists:[]}}));
ipcMain.on('mini-play',(e,o)=>{ if(o&&typeof o.id==='string') send(playerWin,'play-track',{id:o.id,from:String(o.from||'all')}); });
ipcMain.on('mini-yt',(e,r)=>{ if(r&&typeof r.yt==='string') send(playerWin,'play-yt',r); });
ipcMain.on('mini-seek',(e,f)=>{ if(typeof f==='number') send(playerWin,'seek',f); });
ipcMain.on('mini-act',(e,n)=>{ if(typeof n==='string') send(petWin,'act',n); });
ipcMain.on('prog',(e,p)=>{ if(miniOpen()) send(miniWin,'prog',p); });
ipcMain.on('open-app',()=>{ closeMini(); openPlayer(); });
ipcMain.on('pet-menu',()=>petMenu().popup({window:petWin}));
ipcMain.on('player-close',()=>closePlayer());
ipcMain.on('set-pet',(e,id)=>{ if(PETS.some(p=>p.id===id)){ S.pet=id; save(); syncPet(); } });
ipcMain.on('add-music',()=>addMusic());
ipcMain.on('open-folder',()=>shell.openPath(ensureFolder()));
ipcMain.on('show-file',(e,p)=>{ if(typeof p==='string'&&fs.existsSync(p)) shell.showItemInFolder(p); });

let quitting=false;
app.on('before-quit',()=>{ quitting=true; save(true); });
/* started again: from the Music Buddies shortcut (--open) bring up the window; from Ctrl+] in the toad, the banner */
app.on('second-instance',(e,argv)=>{ if(!playerWin) return; if(argv.includes('--open')) openPlayer(); else wake(); });
app.whenReady().then(()=>{
  load();
  createPet(); createPlayer(); createMini(); watchFolder();
  if(process.argv.includes('--open')) playerWin.once('ready-to-show',openPlayer);
  screen.on('display-metrics-changed',()=>{ if(petWin) place(virt.x,virt.y,false); });
  /* the keyboard's media keys work even when Sara isn't in front */
  const key=(k,c)=>{ try{ globalShortcut.register(k,()=>send(playerWin,'cmd',c)); }catch(e){} };
  key('MediaPlayPause','toggle'); key('MediaNextTrack','next'); key('MediaPreviousTrack','prev');
  require('./hotkeys')('Music Buddies',wake);   // Ctrl+] for Music Buddies, Ctrl+\ for the Catching Days toad
});
/* --test: a handle the test harness can reach over the inspector (move her, read where she is) */
if(process.argv.includes('--test')) global.__pet={place,virtFor,layout,geo,resizePet,syncPet,wake,togglePlayer,playerOpen,toggleMini,miniOpen,keys:()=>["CommandOrControl+\\","CommandOrControl+]"].map(k=>globalShortcut.isRegistered(k)),
  get peek(){ return peek; }, get virt(){ return virt; }, get S(){ return S; }, bounds:()=>petWin.getBounds(), dragEnd:()=>{ const b=petWin.getBounds(); place(b.x,b.y,true); }};
app.on('will-quit',()=>globalShortcut.unregisterAll());
app.on('window-all-closed',()=>app.quit());
