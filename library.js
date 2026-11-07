/* library.js · the plain parts of the music: names, links, search pages, what plays next.
   No Electron here, so test/library.test.js can check it with plain node. */
'use strict';
const path=require('path'), {pathToFileURL}=require('url');

const AUDIO=/\.(mp3|m4a|aac|wav|ogg|oga|opus|flac|webm|weba)$/i;

/* "03 - My_Song (live).mp3" → "My Song (live)" */
function titleOf(file){
  const base=path.basename(file).replace(/\.[^.]+$/,'');
  const t=base.replace(/_+/g,' ').replace(/^\s*\d{1,3}\s*[-.)]\s+/,'').replace(/\s+/g,' ').trim();
  return t||base;
}

/* the 11-character video id from any YouTube link (watch, youtu.be, shorts, embed, live, music) */
function ytIdOf(s){
  s=String(s||'').trim();
  const m=s.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})(?![\w-])/);
  return m&&/youtu\.?be/.test(s)?m[1]:null;
}

/* YouTube's results page carries its data as one JSON blob; pull the videos out of it.
   shortcut: scrapes the page's ytInitialData, so a YouTube redesign can break search; links keep working. */
function parseSearch(html){
  const key='var ytInitialData = ';
  const a=html.indexOf(key);
  if(a<0) return [];
  const b=html.indexOf(';</script>',a);
  let data;
  try{ data=JSON.parse(html.slice(a+key.length,b)); }catch(e){ return []; }
  const out=[], seen=new Set();
  const text=o=>o?(o.simpleText||(o.runs||[]).map(r=>r.text).join('')):'';
  (function walk(o){
    if(!o||typeof o!=='object'||out.length>=20) return;
    if(o.videoRenderer&&o.videoRenderer.videoId){
      const v=o.videoRenderer;
      if(!seen.has(v.videoId)&&/^[\w-]{11}$/.test(v.videoId)&&v.lengthText){   // no length: a live stream or a premiere; the id goes into the page's HTML
        seen.add(v.videoId);
        out.push({yt:v.videoId,title:text(v.title),channel:text(v.ownerText||v.longBylineText),length:text(v.lengthText)});
      }
      return;
    }
    for(const k in o) walk(o[k]);
  })(data);
  return out;
}

const {nextIndex}=require('./common.js');   // shared with the player page

/* a folder was moved (Music\Sara to Music\Music Buddies): point its songs, and the
   songs taken out of it, at the new place. Paths on Windows don't care about case. */
function moveFolder(library,old,now){
  const pre=old.toLowerCase().replace(/[\\/]+$/,'')+path.sep;
  const moved=p=>typeof p==='string'&&p.toLowerCase().startsWith(pre)?path.join(now,p.slice(pre.length)):null;
  let n=0;
  for(const t of library.tracks||[]){ const p=moved(t.path); if(!p) continue;
    n++; t.path=p; t.url=pathToFileURL(p).href; if(path.dirname(p)===path.resolve(now)) t.sub=path.basename(now); }
  if(Array.isArray(library.gone)) library.gone=library.gone.map(k=>{ const p=typeof k==='string'&&k.startsWith('f:')&&moved(k.slice(2)); return p?'f:'+p.toLowerCase():k; });
  return n;
}

module.exports={AUDIO,titleOf,ytIdOf,parseSearch,nextIndex,moveFolder};
