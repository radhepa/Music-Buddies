/* mini.js · the banner only shows what the music engine (player.js, in the app window) says, and passes taps back */
'use strict';
const $=id=>document.getElementById(id);
sara.on('state',s=>{
  s=s||{};
  document.body.classList.toggle('playing',!!s.playing);
  $('play').setAttribute('aria-label',s.playing?'Pause':'Play');
  $('t').textContent=s.title||'Nothing on yet';
  $('s').textContent=s.title?(s.sub||''):'Tap to open Music Buddies';
});
const cmd=c=>()=>sara.send('mini-cmd',c);
$('play').onclick=cmd('toggle'); $('next').onclick=cmd('next'); $('prev').onclick=cmd('prev');
$('open').onclick=$('open-now').onclick=()=>sara.send('open-app');
addEventListener('keydown',e=>{ if(e.key==='Escape') sara.send('mini-close'); if(e.key===' '&&e.target===document.body){ e.preventDefault(); sara.send('mini-cmd','toggle'); } });
