/* common.js · small rules the pages and node share: one copy, tested in test/library.test.js.
   Loaded with a <script> tag in player.html and mini.html, and with require() in library.js. */
(function(root){
'use strict';
/* where the queue goes after index i of n: shuffle picks any other song,
   repeat 'all' wraps round, 'off' stops at the end (-1), 'one' replays when a song ends by itself (auto) */
function nextIndex(n,i,{shuffle,repeat,auto},dir=1,rnd=Math.random){
  if(n<=0) return -1;
  if(repeat==='one'&&auto&&i>=0) return i;
  if(shuffle&&n>1){ let j=Math.floor(rnd()*(n-1)); if(j>=i) j++; return j; }
  const j=i+dir;
  if(j>=n) return repeat==='all'?0:-1;
  if(j<0) return repeat==='all'?n-1:0;
  return j;
}
/* seconds as 3:07, or 1:02:09 past an hour */
const fmt=s=>{ s=Math.max(0,Math.floor(s||0)); const h=Math.floor(s/3600), m=Math.floor(s/60)%60, x=String(s%60).padStart(2,'0'); return h?`${h}:${String(m).padStart(2,'0')}:${x}`:`${m}:${x}`; };
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const api={nextIndex,fmt,esc};
if(typeof module!=='undefined'&&module.exports) module.exports=api; else root.Common=api;
})(this);
