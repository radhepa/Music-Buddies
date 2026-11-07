/* pets/kasa.js · Kasa, the kasa-obake who hops to the beat */
'use strict';
(function(){
const {r2,notes,zz}=PetKit;
/* ═══════════ Kasa, a karakasa (folklore) ═══════════
   A paper umbrella left a hundred years grows one eye, a tongue and a single
   leg, and hops about on it. Kasa is a half-closed oiled-paper wagasa, tilted
   a little: four big folds (koi outside, cream in the middle), a scalloped
   hem with the rib tips poking out below it, one big eye, a mouth with the
   long pink tongue lolling past the hem, one bamboo leg bent at the knee in a
   geta, two short arms, and a glass fūrin (wind chime) hung from a rib tip.
   He stands on a rounded wet rock in a rain puddle. Same box and grammar as
   the toads: ground y = 0, one skin gradient pearl → koi → pond-deep, light
   from the upper left, outlines about .55 wide in darker koi. */
const AY=-104;                                                     /* the rounded tip of the canopy */
const DARK='#8a3a1a';
/* where the five ribs meet the hem */
const HEM=[[-36,-30],[-18,-33],[0,-34],[18,-33],[36,-30]];
const sag=([x0,y0],[x1,y1])=>`Q${(x0+x1)/2} ${(y0+y1)/2+3} ${x1} ${y1}`;   /* the paper bellies out between ribs */
const SCALLOPS=HEM.slice(1).map((p,i)=>sag(HEM[i],p)).join(' ');
const CANOPY=`M0 ${AY} C-7 ${AY} -11 -98 -13 -88 C-22 -70 -36 -50 -36 -30 ${SCALLOPS} C36 -50 22 -70 13 -88 C11 -98 7 ${AY} 0 ${AY}Z`;
/* the three inner folds, tip to hem */
const FOLDS='M0 -100 Q-11 -66 -18 -33 M0 -100 L0 -34 M0 -100 Q11 -66 18 -33';
/* the two cream folds in the middle */
const CREAM=`M0 -100 Q-11 -66 -18 -33 ${sag(HEM[1],HEM[2])} ${sag(HEM[2],HEM[3])} Q11 -66 0 -100Z`;
/* a plum blossom: five petals round a gold heart */
const blossom=(x,y,r)=>`<g transform="translate(${x} ${y})">${[0,72,144,216,288].map(a=>{ const t=a*Math.PI/180;
  return `<circle cx="${r2(r*.62*Math.cos(t))}" cy="${r2(r*.62*Math.sin(t))}" r="${r2(r*.42)}"/>`; }).join('')}<circle r="${r2(r*.22)}" fill="#f3c35a"/></g>`;
/* a short arm from the side of the canopy, s = -1 viewer's left, 1 viewer's right; a bamboo twig with a mitten hand */
const arm=s=>`<g transform="translate(${26*s} -52)"><g class="${s<0?'ks-armL':'ks-armR'}">
    <path d="M0 0 Q${7*s} 3 ${7*s} 11" fill="none" stroke="#7a5a2a" stroke-width="3" stroke-linecap="round"/>
    <path d="M0 0 Q${7*s} 3 ${7*s} 11" fill="none" stroke="#e2c88e" stroke-width="1.7" stroke-linecap="round"/>
    <circle cx="${7*s}" cy="11.8" r="2.7" fill="#f3d9a8" stroke="#7a5a2a" stroke-width=".5"/><circle cx="${6.3*s}" cy="11" r=".8" fill="#fff8e9" opacity=".8"/>
  </g></g>`;
/* the leg: one bamboo handle, bent at the knee */
const LEG='M0 -33 C-2 -25 -9 -21 -8 -13 C-7.2 -8 -3 -6 0 -5.4';
/* his perch: a rounded wet rock in a rain puddle, with a ring or two from the last drops */
const perch=ID=>`<linearGradient id="${ID}stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b3c6c4"/><stop offset=".5" stop-color="#7d9699"/><stop offset="1" stop-color="#4a6467"/></linearGradient>
  <linearGradient id="${ID}rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5f7a7c"/><stop offset="1" stop-color="#2f4749"/></linearGradient>
  <ellipse cx="0" cy="6.5" rx="54" ry="7" fill="#9fd0c8" opacity=".45"/>
  <ellipse cx="0" cy="6.5" rx="54" ry="7" fill="none" stroke="#cfe9e3" stroke-width=".6" opacity=".7"/>
  <ellipse cx="-40" cy="8" rx="7" ry="1.8" fill="none" stroke="#e8f4f0" stroke-width=".5" opacity=".7"/>
  <ellipse cx="42" cy="5" rx="4.5" ry="1.2" fill="none" stroke="#e8f4f0" stroke-width=".5" opacity=".7"/>
  <ellipse cx="2" cy="11" rx="34" ry="3.6" fill="#173a3b" opacity=".3"/>
  <path d="M-27 -1 C-31 4 -28 12 -15 13 C-4 14 8 14 17 13 C29 12 32 4 27 -1Z" fill="url(#${ID}rock)" stroke="#2b4446" stroke-width=".55"/>
  <path d="M-22 6 C-18 9 -12 10.6 -6 11" fill="none" stroke="#1d3335" stroke-width=".5" opacity=".5"/>
  <ellipse cx="0" cy="-1" rx="27" ry="6.5" fill="url(#${ID}stone)" stroke="#2b4446" stroke-width=".55"/>
  <ellipse cx="-9" cy="-3" rx="11" ry="2" fill="#ffffff" opacity=".4" transform="rotate(-4 -9 -3)"/>
  <ellipse cx="13" cy="1.6" rx="5" ry="1" fill="#ffffff" opacity=".22"/>`;
function kasa(ID){
  return `<defs>
    <linearGradient id="${ID}skin" gradientUnits="userSpaceOnUse" x1="0" y1="${AY}" x2="0" y2="-27"><stop offset="0" stop-color="#fff8e9"/><stop offset=".14" stop-color="#f9c7a2"/><stop offset=".42" stop-color="#ec7a45"/><stop offset=".8" stop-color="#d4602f"/><stop offset=".95" stop-color="#9b4524"/><stop offset="1" stop-color="#173a3b"/></linearGradient>
    <linearGradient id="${ID}paper" gradientUnits="userSpaceOnUse" x1="0" y1="${AY}" x2="0" y2="-27"><stop offset="0" stop-color="#fffdf7"/><stop offset=".4" stop-color="#fff0cf"/><stop offset=".85" stop-color="#ecd09a"/><stop offset="1" stop-color="#b9955e"/></linearGradient>
    <radialGradient id="${ID}edge" cx=".5" cy=".5" r=".6"><stop offset=".5" stop-color="${DARK}" stop-opacity="0"/><stop offset="1" stop-color="${DARK}" stop-opacity=".36"/></radialGradient>
    <radialGradient id="${ID}iris" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#f8d98a"/><stop offset=".55" stop-color="#e2a63c"/><stop offset="1" stop-color="#a8702a"/></radialGradient>
    <linearGradient id="${ID}glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfdf6"/><stop offset=".5" stop-color="#d6ebdc"/><stop offset="1" stop-color="#8fbfaa"/></linearGradient>
    <linearGradient id="${ID}wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6ab70"/><stop offset=".6" stop-color="#96693c"/><stop offset="1" stop-color="#5a3f28"/></linearGradient>
    <linearGradient id="${ID}tongue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3838f"/><stop offset="1" stop-color="#d9475a"/></linearGradient>
    <clipPath id="${ID}cc"><path d="${CANOPY}"/></clipPath>
    <clipPath id="${ID}ec"><circle cx="0" cy="-66" r="13"/></clipPath>
  </defs>
  ${perch(ID)}
  <g class="pk-body"><g class="mp-breathe"><g class="ks-hop">
    <!-- the geta: two teeth, a platform, a koi thong -->
    <g fill="url(#${ID}wood)" stroke="#4a3424" stroke-width=".55"><rect x="-7.6" y="-2" width="3.4" height="3" rx="1"/><rect x="4.2" y="-2" width="3.4" height="3" rx="1"/></g>
    <path d="M-11.5 -4 C-11.5 -7.4 -6.5 -8.4 0 -8.4 C6.5 -8.4 11.5 -7.4 11.5 -4 C11.5 -1.6 6.5 -1 0 -1 C-6.5 -1 -11.5 -1.6 -11.5 -4Z" fill="url(#${ID}wood)" stroke="#4a3424" stroke-width=".55"/>
    <ellipse cx="0" cy="-5.5" rx="10" ry="2.3" fill="#e9cf98" stroke="#7a5a2a" stroke-width=".4"/>
    <!-- everything above the geta leans a little, from the sandal up -->
    <g transform="translate(0 -5)"><g class="ks-lean"><g transform="translate(0 5)">
      <!-- the leg, knee bent -->
      <path d="${LEG}" fill="none" stroke="#7a5a2a" stroke-width="5.4" stroke-linecap="round"/>
      <path d="${LEG}" fill="none" stroke="#e2c88e" stroke-width="3.8" stroke-linecap="round"/>
      <path d="${LEG}" fill="none" stroke="#fff8e9" stroke-width=".9" stroke-linecap="round" opacity=".5" transform="translate(-1 0)"/>
      <path d="M-10.4 -13.6 C-9 -12.6 -7 -12.6 -5.6 -13.6" fill="none" stroke="#7a5a2a" stroke-width=".9" stroke-linecap="round"/>
      <path d="M-8 -5.4 Q0 -10.4 8 -5.4" fill="none" stroke="#ec7a45" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M-8 -6 Q0 -11 8 -6" fill="none" stroke="#fff8e9" stroke-width=".5" stroke-linecap="round" opacity=".5"/>
      <!-- the canopy: it pivots on the handle top, and sits a few degrees off true -->
      <g transform="translate(0 -31)"><g class="ks-canopy"><g transform="rotate(-5) translate(0 31)">
        <g stroke="#7a5a2a" stroke-width="1.7" stroke-linecap="round">${HEM.map(([x,y])=>`<path d="M${x} ${y} v3.6"/>`).join('')}</g>
        <path d="${CANOPY}" fill="url(#${ID}skin)" stroke="${DARK}" stroke-width=".6" stroke-linejoin="round"/>
        <g clip-path="url(#${ID}cc)">
          <path d="${CREAM}" fill="url(#${ID}paper)"/>
          <g fill="#ec7a45" opacity=".9">${blossom(-25,-52,3.2)}${blossom(25,-52,3.2)}</g>
          <path d="${FOLDS}" fill="none" stroke="${DARK}" stroke-width="5" stroke-linecap="round" opacity=".12"/>
          <path d="${FOLDS}" fill="none" stroke="${DARK}" stroke-width=".6" opacity=".7"/>
          <path d="M-10 -92 Q0 -89 10 -92" fill="none" stroke="#2f7a74" stroke-width=".7" opacity=".8"/>
          <rect x="-40" y="${AY-2}" width="80" height="80" fill="url(#${ID}edge)"/>
          <ellipse cx="0" cy="-31" rx="36" ry="4.5" fill="#173a3b" opacity=".2"/>
          <ellipse cx="-23" cy="-62" rx="3" ry="12" fill="#ffffff" opacity=".36" transform="rotate(22 -23 -62)"/>
          <ellipse cx="-5" cy="-96" rx="4" ry="2" fill="#ffffff" opacity=".5" transform="rotate(-40 -5 -96)"/>
        </g>
        <path d="M-36 -30 ${SCALLOPS}" fill="none" stroke="${DARK}" stroke-width=".6" stroke-linejoin="round"/>
        <!-- the tip -->
        <circle cx="0" cy="${AY-1}" r="2.4" fill="#d9bd7c" stroke="#7a5a2a" stroke-width=".5"/><circle cx="-.7" cy="${AY-1.7}" r=".7" fill="#fff8e9" opacity=".8"/>
        <!-- short arms from the folds -->
        ${arm(-1)}${arm(1)}
        <!-- the fūrin, hung from the outer rib tip: glass bell, clapper, paper strip -->
        <g transform="translate(36 -27)"><g class="ks-chime">
          <path d="M0 0 V3" stroke="#4a3424" stroke-width=".6"/>
          <path d="M0 2.6 C3.8 2.6 5.6 5.4 5.4 10 L-5.4 10 C-5.6 5.4 -3.8 2.6 0 2.6Z" fill="url(#${ID}glass)" stroke="#5f9a86" stroke-width=".5" opacity=".92"/>
          <path d="M0 4 V11.2" stroke="#7a5a2a" stroke-width=".5"/>
          <ellipse cx="0" cy="10" rx="5.4" ry="1.5" fill="#a3d2c8" stroke="#5f9a86" stroke-width=".5" opacity=".9"/>
          <ellipse cx="-2.2" cy="5" rx="1.4" ry=".6" fill="#ffffff" opacity=".75" transform="rotate(-50 -2.2 5)"/>
          <path d="M-2.6 7.4 Q0 8.4 2.6 7.4" fill="none" stroke="#ec7a45" stroke-width=".55" opacity=".8"/>
          <circle cx="0" cy="11.4" r="1" fill="#7a5a2a"/>
          <g transform="translate(0 12)"><g class="ks-strip">
            <path d="M-2.2 0 H2.2 V9.4 L0 10.6 L-2.2 9.4Z" fill="#fff8e9" stroke="#b98a44" stroke-width=".4" stroke-linejoin="round"/>
            <path d="M-1.3 2.6 Q0 1.6 1.3 2.6 M-1.3 5 Q0 4 1.3 5" fill="none" stroke="#2f7a74" stroke-width=".5" stroke-linecap="round"/>
          </g></g>
        </g></g>
        <!-- the face: blush, one big eye (gold rim, wide dark pupil, two glints), a mouth and the long tongue -->
        <ellipse cx="-11.5" cy="-50" rx="4.8" ry="2.7" fill="#f48a78" opacity=".6"/>
        <ellipse cx="11.5" cy="-50" rx="4.8" ry="2.7" fill="#f48a78" opacity=".6"/>
        <circle class="pk-look" cx="0" cy="-66" r="13" fill="#fff8e9"/>
        <g clip-path="url(#${ID}ec)">
          <g class="ks-open">
            <circle cx="0" cy="-65.6" r="10" fill="url(#${ID}iris)"/>
            <circle cx="0" cy="-65.6" r="10" fill="none" stroke="#7a5326" stroke-width=".5" opacity=".7"/>
            <g transform="translate(0 -65.2)"><g class="ks-gaze">
              <ellipse rx="6.4" ry="6" fill="#1f2e2c"/>
              <circle cx="2.4" cy="-2.2" r="2.3" fill="#ffffff" opacity=".95"/>
              <circle cx="-2.8" cy="2.6" r=".9" fill="#ffffff" opacity=".6"/>
            </g></g>
            <g transform="translate(0 -84)"><g class="ks-blink"><g transform="translate(0 84)">
              <path d="M-14 -74 L-14 -84 L14 -84 L14 -74 C6 -77.2 -6 -77.2 -14 -74Z" fill="url(#${ID}paper)"/>
              <path d="M-12 -74.2 C-6 -76.6 6 -76.6 12 -74.2" fill="none" stroke="${DARK}" stroke-width="1.1" stroke-linecap="round"/>
            </g></g></g>
            <circle cx="0" cy="-66" r="13" fill="none" stroke="${DARK}" stroke-width=".6"/>
          </g>
          <g class="ks-closed">
            <circle cx="0" cy="-66" r="13.2" fill="url(#${ID}paper)"/>
            <path d="${FOLDS}" fill="none" stroke="${DARK}" stroke-width="5" stroke-linecap="round" opacity=".12"/>
            <path d="${FOLDS}" fill="none" stroke="${DARK}" stroke-width=".6" opacity=".7"/>
            <path d="M-8.4 -68 Q0 -59.6 8.4 -68" fill="none" stroke="${DARK}" stroke-width="1.8" stroke-linecap="round"/>
          </g>
          <g class="ks-doze">
            <circle cx="0" cy="-66" r="13.2" fill="url(#${ID}paper)"/>
            <path d="${FOLDS}" fill="none" stroke="${DARK}" stroke-width="5" stroke-linecap="round" opacity=".12"/>
            <path d="${FOLDS}" fill="none" stroke="${DARK}" stroke-width=".6" opacity=".7"/>
            <path d="M-8.4 -66 Q0 -62 8.4 -66 M-7.6 -64.8 L-8.4 -62.2 M0 -63 L0 -60.4 M7.6 -64.8 L8.4 -62.2" fill="none" stroke="${DARK}" stroke-width="1.4" stroke-linecap="round"/>
          </g>
        </g>
        <path class="ks-lip" d="M-5 -48 Q0 -43.6 5 -48" fill="none" stroke="${DARK}" stroke-width="1.2" stroke-linecap="round"/>
        <path class="ks-grin" d="M-7.4 -48 C-3 -47.4 3 -47.4 7.4 -48 C6.4 -40 -6.4 -40 -7.4 -48Z" fill="#7a2a2a" stroke="${DARK}" stroke-width=".6" stroke-linejoin="round"/>
        <!-- an open mouth, hidden until he talks or yawns; it hinges on its top lip -->
        <g transform="translate(0 -48)"><g class="ks-mouth"><path d="M-5 0 C-3 -.5 3 -.5 5 0 C4.6 8.6 -4.6 8.6 -5 0Z" fill="#7a2a2a" stroke="${DARK}" stroke-width=".6" stroke-linejoin="round"/></g></g>
        <g transform="translate(0 -46)"><g class="ks-tongue">
          <path d="M-3.2 0 C-5.4 8 -4.6 17 1.6 24 C7 19 6 9 3.4 0Z" fill="url(#${ID}tongue)" stroke="#b23a4a" stroke-width=".5" stroke-linejoin="round"/>
          <path d="M.2 3 C-.6 10 .2 16 1.8 21" fill="none" stroke="#b23a4a" stroke-width=".5" opacity=".55"/>
          <ellipse cx="-1.6" cy="6" rx=".9" ry="2.6" fill="#ffffff" opacity=".4"/>
        </g></g>
      </g></g></g>
    </g></g></g>
  </g></g></g>
  ${notes(40,-96,'#e2a63c')}
  ${zz(30,-84)}`;
}
PetKit.register({id:'kasa',name:'Kasa',kind:'kasa-obake',blurb:'Hops on one leg to the beat, wind chime ringing.',art:kasa,css:`/* the karakasa: a lean, a slow blink and a glance while he waits; hops, wobbles, wags and rings while it plays */
.ks-lean{transform:rotate(-2.5deg);transition:transform .9s ease-in-out}
.ks-canopy{transition:transform 1.4s ease-in-out}
.ks-tongue{transition:transform .9s ease-in-out}
.ks-blink{animation:ks-blink 5.8s ease-in-out infinite}
.ks-gaze{animation:ks-gaze 11s ease-in-out infinite}
.ks-closed,.ks-doze,.ks-grin,.ks-mouth{opacity:0}
.playing .ks-lean{transform:none}
.playing .ks-open,.playing .ks-lip{opacity:0}
.playing .ks-closed,.playing .ks-grin{opacity:1}
.playing .ks-hop{animation:ks-hop .86s cubic-bezier(.4,0,.6,1) infinite}
.playing .ks-canopy{animation:ks-wobble 1.72s ease-in-out infinite}
.playing .ks-tongue{animation:ks-wag .86s ease-in-out infinite}
.playing .ks-chime{animation:ks-swing .86s ease-in-out infinite}
.playing .ks-strip{animation:ks-flutter .43s ease-in-out infinite}
.playing .ks-armL{animation:ks-armL 1.72s ease-in-out infinite}
.playing .ks-armR{animation:ks-armR 1.72s ease-in-out infinite}
@keyframes ks-blink{0%,88%,97%,100%{transform:scaleY(1)}91.5%,93.5%{transform:scaleY(4.2)}}
@keyframes ks-gaze{0%,36%,92%,100%{transform:translate(0,0)}40%,56%{transform:translate(-2px,.4px)}60%,76%{transform:translate(1.8px,.4px)}80%{transform:translate(0,0)}}
@keyframes ks-hop{0%,100%{transform:translateY(0) scale(1.07,.93)}14%{transform:translateY(-1.5px) scale(1,1)}50%{transform:translateY(-6px) scale(.975,1.02)}86%{transform:translateY(-.6px) scale(1,1)}}
@keyframes ks-wobble{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes ks-wag{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}}
@keyframes ks-swing{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
@keyframes ks-flutter{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes ks-armL{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(12deg)}}
@keyframes ks-armR{0%,100%{transform:rotate(10deg)}50%{transform:rotate(-12deg)}}
/* now and then: a quick lick (the tongue curls up), then a half-twirl of the canopy */
.fidget .ks-tongue{animation:ks-lick 2.4s ease-in-out}
.fidget .ks-canopy{animation:ks-twirl 2.4s ease-in-out}
@keyframes ks-lick{0%,34%,100%{transform:rotate(0) scale(1,1)}10%,22%{transform:rotate(-70deg) scale(1,.7)}16%{transform:rotate(-55deg) scale(1,.75)}}
@keyframes ks-twirl{0%,40%,100%{transform:rotate(0) scaleX(1)}56%{transform:rotate(3deg) scaleX(.7)}72%{transform:rotate(-2deg) scaleX(1.04)}84%{transform:rotate(1deg) scaleX(.98)}}
/* paused a long while: he droops, canopy closing further, eye shut */
.sleepy .ks-open{opacity:0}
.sleepy .ks-doze{opacity:1}
.sleepy .ks-lean{transform:rotate(4deg)}
.sleepy .ks-canopy{transform:translateY(3px) rotate(3deg) scale(.85,.97)}
.sleepy .ks-tongue{transform:rotate(6deg)}
/* ── the three dances: each replaces the plain playing hop, wobble and wag for a whole song.
   :where() keeps them at the same weight as .playing, so source order decides: dances beat .playing, acts beat both ── */
/* dance-1, the pogo: big hops with a hard squash and stretch, the canopy flaring at the top, arms up */
.playing:where(.dance-1) .ks-hop{animation:ks-d1-body .86s cubic-bezier(.4,0,.6,1) infinite}
.playing:where(.dance-1) .ks-canopy{animation:ks-d1-canopy .86s ease-in-out infinite}
.playing:where(.dance-1) .ks-tongue{animation:ks-d1-tongue .86s ease-in-out infinite}
.playing:where(.dance-1) .ks-chime{animation:ks-d1-chime .86s ease-in-out infinite}
.playing:where(.dance-1) .ks-strip{animation:ks-d1-strip .43s ease-in-out infinite}
.playing:where(.dance-1) .ks-armL{animation:ks-d1-armL .86s ease-in-out infinite}
.playing:where(.dance-1) .ks-armR{animation:ks-d1-armR .86s ease-in-out infinite}
@keyframes ks-d1-body{0%,100%{transform:translate(0,0) scale(1.14,.86)}18%{transform:translate(0,-4px) scale(.98,1.04)}50%{transform:translate(0,-16px) scale(.92,1.1)}82%{transform:translate(0,-3px) scale(1,1)}}
@keyframes ks-d1-canopy{0%,100%{transform:scale(1.06,.94)}22%{transform:scale(.96,1.04)}58%{transform:scale(1.14,.96)}84%{transform:scale(.98,1.02)}}
@keyframes ks-d1-tongue{0%,100%{transform:rotate(0) scale(1,.85)}30%{transform:rotate(-6deg) scale(1,1.1)}62%{transform:rotate(0) scale(1,1.2)}84%{transform:rotate(5deg) scale(1,1)}}
@keyframes ks-d1-chime{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(14deg)}}
@keyframes ks-d1-strip{0%,100%{transform:rotate(-12deg)}50%{transform:rotate(12deg)}}
@keyframes ks-d1-armL{0%,100%{transform:rotate(95deg)}50%{transform:rotate(130deg)}}
@keyframes ks-d1-armR{0%,100%{transform:rotate(-95deg)}50%{transform:rotate(-130deg)}}
/* dance-2, the sway: he rocks side to side on the geta while the canopy swings wide; tongue, chime, strip and arms trail behind */
.playing:where(.dance-2) .ks-hop{animation:ks-d2-body 1.72s ease-in-out infinite}
.playing:where(.dance-2) .ks-canopy{animation:ks-d2-canopy 1.72s ease-in-out infinite}
.playing:where(.dance-2) .ks-tongue{animation:ks-d2-tongue 1.72s ease-in-out -1.58s infinite}
.playing:where(.dance-2) .ks-chime{animation:ks-d2-chime 1.72s ease-in-out -1.55s infinite}
.playing:where(.dance-2) .ks-strip{animation:ks-d2-strip 1.72s ease-in-out -1.48s infinite}
.playing:where(.dance-2) .ks-armL,.playing:where(.dance-2) .ks-armR{animation:ks-d2-arm 1.72s ease-in-out -1.6s infinite}
@keyframes ks-d2-body{0%,100%{transform:translate(-7px,0) scale(1.04,.96)}25%{transform:translate(0,-4px) scale(.98,1.03)}50%{transform:translate(7px,0) scale(1.04,.96)}75%{transform:translate(0,-4px) scale(.98,1.03)}}
@keyframes ks-d2-canopy{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(16deg)}}
@keyframes ks-d2-tongue{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}}
@keyframes ks-d2-chime{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-22deg)}}
@keyframes ks-d2-strip{0%,100%{transform:rotate(18deg)}50%{transform:rotate(-18deg)}}
@keyframes ks-d2-arm{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-22deg)}}
/* dance-3, stomp stomp spin: two stamps of the geta, then a hop with a full twirl of the canopy */
.playing:where(.dance-3) .ks-hop{animation:ks-d3-body 1.72s ease-in-out infinite}
.playing:where(.dance-3) .ks-canopy{animation:ks-d3-canopy 1.72s ease-in-out infinite}
.playing:where(.dance-3) .ks-tongue{animation:ks-d3-tongue 1.72s ease-in-out infinite}
.playing:where(.dance-3) .ks-chime{animation:ks-d3-chime 1.72s ease-in-out infinite}
.playing:where(.dance-3) .ks-strip{animation:ks-d3-strip 1.72s ease-in-out infinite}
.playing:where(.dance-3) .ks-armL{animation:ks-d3-armL 1.72s ease-in-out infinite}
.playing:where(.dance-3) .ks-armR{animation:ks-d3-armR 1.72s ease-in-out infinite}
@keyframes ks-d3-body{0%,100%{transform:translate(0,0) scale(1,1)}12%{transform:translate(0,-6px) scale(.97,1.03)}25%{transform:translate(0,0) scale(1.12,.88)}37%{transform:translate(0,-6px) scale(.97,1.03)}50%{transform:translate(0,0) scale(1.12,.88)}60%{transform:translate(0,0) scale(1.06,.94)}75%{transform:translate(0,-12px) scale(.94,1.06)}92%{transform:translate(0,0) scale(1.08,.92)}}
@keyframes ks-d3-canopy{0%,100%{transform:rotate(0) scale(1,1)}14%{transform:rotate(-5deg) scale(1.03,.98)}27%{transform:rotate(0) scale(1.05,.95)}39%{transform:rotate(5deg) scale(1.03,.98)}52%{transform:rotate(0) scale(1.05,.95)}62%{transform:rotate(-3deg) scale(1,1.02)}72%{transform:rotate(2deg) scale(.08,1.04)}82%{transform:rotate(0) scale(-1,1.02)}92%{transform:rotate(-2deg) scale(.08,1.04)}}
@keyframes ks-d3-tongue{0%,100%{transform:rotate(0) scale(1,1)}14%{transform:rotate(-8deg) scale(1,1.05)}27%{transform:rotate(6deg) scale(1,.92)}39%{transform:rotate(-8deg) scale(1,1.05)}52%{transform:rotate(6deg) scale(1,.92)}78%{transform:rotate(20deg) scale(1,.9)}90%{transform:rotate(-12deg) scale(1,1.05)}}
@keyframes ks-d3-chime{0%,100%{transform:rotate(0)}14%{transform:rotate(-10deg)}27%{transform:rotate(8deg)}39%{transform:rotate(-10deg)}52%{transform:rotate(8deg)}70%{transform:rotate(20deg)}84%{transform:rotate(-24deg)}94%{transform:rotate(8deg)}}
@keyframes ks-d3-strip{0%,100%{transform:rotate(0)}16%{transform:rotate(-12deg)}29%{transform:rotate(10deg)}41%{transform:rotate(-12deg)}54%{transform:rotate(10deg)}72%{transform:rotate(28deg)}86%{transform:rotate(-28deg)}95%{transform:rotate(10deg)}}
@keyframes ks-d3-armL{0%,100%{transform:rotate(20deg)}25%{transform:rotate(90deg)}37%{transform:rotate(20deg)}50%{transform:rotate(90deg)}75%{transform:rotate(120deg)}}
@keyframes ks-d3-armR{0%,100%{transform:rotate(-20deg)}25%{transform:rotate(-90deg)}37%{transform:rotate(-20deg)}50%{transform:rotate(-90deg)}75%{transform:rotate(-120deg)}}
/* ── acts: each starts and ends at the rest pose; the tongue, chime and paper strip lag a beat behind the body ── */
/* wave: the right arm waves high, the canopy leaning into it */
.act-wave .ks-armR{animation:ks-wave-arm 1.6s ease-in-out both}
.act-wave .ks-canopy{animation:ks-wave-canopy 1.6s ease-in-out both}
.act-wave .ks-tongue{animation:ks-wave-tongue 1.6s ease-in-out both}
@keyframes ks-wave-arm{0%,100%{transform:rotate(0)}18%{transform:rotate(-150deg)}34%{transform:rotate(-118deg)}50%{transform:rotate(-160deg)}66%{transform:rotate(-122deg)}80%{transform:rotate(-146deg)}}
@keyframes ks-wave-canopy{0%,100%{transform:rotate(0)}24%,76%{transform:rotate(4deg)}}
@keyframes ks-wave-tongue{0%,100%{transform:rotate(0)}32%,82%{transform:rotate(-8deg)}}
/* look: the eye darts left, then right; the canopy and tongue follow late */
.act-look .ks-gaze{animation:ks-look-gaze 2.4s ease-in-out both}
.act-look .ks-canopy{animation:ks-look-canopy 2.4s ease-in-out both}
.act-look .ks-tongue{animation:ks-look-tongue 2.4s ease-in-out both}
@keyframes ks-look-gaze{0%,100%{transform:translate(0,0)}14%,40%{transform:translate(-4px,.3px)}54%,82%{transform:translate(4px,.3px)}}
@keyframes ks-look-canopy{0%,100%{transform:rotate(0)}24%,42%{transform:rotate(-4deg)}64%,84%{transform:rotate(4deg)}}
@keyframes ks-look-tongue{0%,100%{transform:rotate(0)}28%,44%{transform:rotate(6deg)}68%,86%{transform:rotate(-6deg)}}
/* stretch: a crouch, then the handle shoots tall and the canopy opens wide, arms up, the eye shut in a happy arc (the white fades so no blank disc is left) */
.act-stretch .ks-hop{animation:ks-stretch-body 2.2s ease-in-out both}
.act-stretch .ks-canopy{animation:ks-stretch-canopy 2.2s ease-in-out both}
.act-stretch .ks-armL{animation:ks-stretch-armL 2.2s ease-in-out both}
.act-stretch .ks-armR{animation:ks-stretch-armR 2.2s ease-in-out both}
.act-stretch .ks-open,.act-stretch .pk-look{animation:ks-stretch-eye 2.2s ease-in-out both}
.act-stretch .ks-closed{animation:ks-stretch-shut 2.2s ease-in-out both}
.act-stretch .ks-tongue{animation:ks-stretch-tongue 2.2s ease-in-out both}
.act-stretch .ks-chime{animation:ks-stretch-chime 2.2s ease-in-out both}
@keyframes ks-stretch-body{0%,100%{transform:scale(1,1)}16%{transform:scale(1.08,.92)}40%,62%{transform:scale(.95,1.12)}82%{transform:scale(1.03,.97)}}
@keyframes ks-stretch-canopy{0%,100%{transform:scale(1,1)}16%{transform:scale(.96,.98)}42%,62%{transform:scale(1.18,.97)}82%{transform:scale(.98,1.01)}}
@keyframes ks-stretch-armL{0%,100%{transform:rotate(0)}44%,60%{transform:rotate(115deg)}}
@keyframes ks-stretch-armR{0%,100%{transform:rotate(0)}44%,60%{transform:rotate(-115deg)}}
@keyframes ks-stretch-eye{0%,26%,100%{opacity:1}36%,66%{opacity:0}}
@keyframes ks-stretch-shut{0%,26%,100%{opacity:0}36%,66%{opacity:1}}
@keyframes ks-stretch-tongue{0%,100%{transform:scale(1,1) rotate(0)}22%{transform:scale(1,.9) rotate(0)}48%,66%{transform:scale(1,1.2) rotate(3deg)}86%{transform:scale(1,.96) rotate(-2deg)}}
@keyframes ks-stretch-chime{0%,100%{transform:rotate(0)}30%{transform:rotate(10deg)}52%{transform:rotate(-8deg)}74%{transform:rotate(4deg)}}
/* yawn: the mouth opens wide, the eye shuts into a droopy sleepy arc, the tongue curls up, the canopy rolls back then sags */
.act-yawn .ks-mouth{animation:ks-yawn-mouth 2.4s ease-in-out both}
.act-yawn .ks-open,.act-yawn .pk-look{animation:ks-yawn-eye 2.4s ease-in-out both}
.act-yawn .ks-doze{animation:ks-yawn-shut 2.4s ease-in-out both}
.act-yawn .ks-tongue{animation:ks-yawn-tongue 2.4s ease-in-out both}
.act-yawn .ks-canopy{animation:ks-yawn-canopy 2.4s ease-in-out both}
.act-yawn .ks-hop{animation:ks-yawn-body 2.4s ease-in-out both}
@keyframes ks-yawn-mouth{0%,100%{opacity:0;transform:scale(1,.3)}14%{opacity:1;transform:scale(1,.6)}36%,62%{opacity:1;transform:scale(1.3,1.6)}80%{opacity:1;transform:scale(1,.5)}90%{opacity:0;transform:scale(1,.3)}}
@keyframes ks-yawn-eye{0%,24%,100%{opacity:1}36%,66%{opacity:0}}
@keyframes ks-yawn-shut{0%,24%,100%{opacity:0}36%,66%{opacity:1}}
@keyframes ks-yawn-tongue{0%,100%{transform:rotate(0) scale(1,1)}18%{transform:rotate(4deg) scale(1,1.05)}40%,62%{transform:rotate(-48deg) scale(1,.72)}84%{transform:rotate(3deg) scale(1,1.03)}}
@keyframes ks-yawn-canopy{0%,100%{transform:translate(0,0) rotate(0) scale(1,1)}36%,60%{transform:translate(0,-2px) rotate(4deg) scale(1.05,1.03)}84%{transform:translate(0,2px) rotate(1deg) scale(.98,.98)}}
@keyframes ks-yawn-body{0%,100%{transform:scale(1,1)}38%,58%{transform:scale(.97,1.05)}84%{transform:scale(1.03,.97)}}
/* shake: shakes off the rain, canopy rattling side to side, chime and strip flapping, the tongue a beat behind */
.act-shake .ks-canopy{animation:ks-shake-canopy 1.2s ease-in-out both}
.act-shake .ks-hop{animation:ks-shake-body 1.2s ease-in-out both}
.act-shake .ks-tongue{animation:ks-shake-tongue 1.2s ease-in-out both}
.act-shake .ks-chime{animation:ks-shake-chime 1.2s ease-in-out both}
.act-shake .ks-strip{animation:ks-shake-strip 1.2s ease-in-out both}
@keyframes ks-shake-canopy{0%,100%{transform:rotate(0) scale(1,1)}10%{transform:rotate(-9deg) scale(1.04,.98)}24%{transform:rotate(9deg) scale(1.04,.98)}38%{transform:rotate(-8deg) scale(1.03,.99)}52%{transform:rotate(7deg) scale(1.02,.99)}66%{transform:rotate(-5deg) scale(1.01,1)}80%{transform:rotate(3deg) scale(1,1)}92%{transform:rotate(-1deg) scale(1,1)}}
@keyframes ks-shake-body{0%,100%{transform:scale(1,1)}8%{transform:scale(1.06,.94)}30%{transform:scale(.98,1.02)}60%{transform:scale(1.02,.98)}}
@keyframes ks-shake-tongue{0%,100%{transform:rotate(0)}16%{transform:rotate(22deg)}30%{transform:rotate(-22deg)}44%{transform:rotate(18deg)}58%{transform:rotate(-14deg)}72%{transform:rotate(9deg)}86%{transform:rotate(-4deg)}}
@keyframes ks-shake-chime{0%,100%{transform:rotate(0)}14%{transform:rotate(24deg)}28%{transform:rotate(-24deg)}42%{transform:rotate(20deg)}56%{transform:rotate(-15deg)}70%{transform:rotate(9deg)}84%{transform:rotate(-4deg)}}
@keyframes ks-shake-strip{0%,100%{transform:rotate(0)}18%{transform:rotate(30deg)}32%{transform:rotate(-30deg)}46%{transform:rotate(26deg)}60%{transform:rotate(-20deg)}74%{transform:rotate(12deg)}88%{transform:rotate(-5deg)}}
/* tilt: the canopy cocks to one side, curious; the eye drifts up, the chime hangs plumb and the tongue swings late */
.act-tilt .ks-canopy{animation:ks-tilt-canopy 1.4s ease-in-out both}
.act-tilt .ks-gaze{animation:ks-tilt-gaze 1.4s ease-in-out both}
.act-tilt .ks-chime{animation:ks-tilt-chime 1.4s ease-in-out both}
.act-tilt .ks-tongue{animation:ks-tilt-tongue 1.4s ease-in-out both}
.act-tilt .ks-strip{animation:ks-tilt-strip 1.4s ease-in-out both}
@keyframes ks-tilt-canopy{0%,100%{transform:rotate(0)}30%,66%{transform:rotate(16deg)}}
@keyframes ks-tilt-gaze{0%,100%{transform:translate(0,0)}34%,68%{transform:translate(1.6px,-1.4px)}}
@keyframes ks-tilt-chime{0%,100%{transform:rotate(0)}36%,66%{transform:rotate(-11deg)}84%{transform:rotate(4deg)}}
@keyframes ks-tilt-tongue{0%,100%{transform:rotate(0)}38%,66%{transform:rotate(-10deg)}86%{transform:rotate(3deg)}}
@keyframes ks-tilt-strip{0%,100%{transform:rotate(0)}40%,64%{transform:rotate(-8deg)}86%{transform:rotate(5deg)}}
/* skip: a quick whoosh: the canopy spins a full turn on its handle while he hops */
.act-skip .ks-canopy{animation:ks-skip-canopy 1s ease-in-out both}
.act-skip .ks-hop{animation:ks-skip-body 1s ease-in-out both}
.act-skip .ks-strip{animation:ks-skip-strip 1s ease-in-out both}
.act-skip .ks-chime{animation:ks-skip-chime 1s ease-in-out both}
.act-skip .ks-tongue{animation:ks-skip-tongue 1s ease-in-out both}
@keyframes ks-skip-canopy{0%,100%{transform:rotate(0) scale(1,1)}12%{transform:rotate(-4deg) scale(1.06,.97)}30%{transform:rotate(3deg) scale(.08,1.04)}50%{transform:rotate(0) scale(-1,1.02)}70%{transform:rotate(-3deg) scale(.08,1.04)}86%{transform:rotate(2deg) scale(1.06,.98)}}
@keyframes ks-skip-body{0%,100%{transform:translate(0,0) scale(1,1)}12%{transform:translate(0,0) scale(1.08,.92)}44%{transform:translate(0,-9px) scale(.94,1.06)}72%{transform:translate(0,0) scale(1.07,.93)}88%{transform:translate(0,0) scale(.98,1.02)}}
@keyframes ks-skip-strip{0%,100%{transform:rotate(0)}30%{transform:rotate(28deg)}60%{transform:rotate(-26deg)}84%{transform:rotate(10deg)}}
@keyframes ks-skip-chime{0%,100%{transform:rotate(0)}26%{transform:rotate(22deg)}56%{transform:rotate(-20deg)}82%{transform:rotate(8deg)}}
@keyframes ks-skip-tongue{0%,100%{transform:rotate(0) scale(1,1)}36%{transform:rotate(18deg) scale(1,.9)}64%{transform:rotate(-16deg) scale(1,1.08)}88%{transform:rotate(5deg) scale(1,1)}}
/* pause: a little "oh!": he stiffens, the pupil pins, the tongue pulls in and the chime swings on alone */
.act-pause .ks-hop{animation:ks-pause-body 1s ease-in-out both}
.act-pause .ks-gaze{animation:ks-pause-gaze 1s ease-in-out both}
.act-pause .ks-tongue{animation:ks-pause-tongue 1s ease-in-out both}
.act-pause .ks-chime{animation:ks-pause-chime 1s ease-in-out both}
.act-pause .ks-strip{animation:ks-pause-strip 1s ease-in-out both}
@keyframes ks-pause-body{0%,100%{transform:scale(1,1)}10%{transform:scale(1.06,.94)}24%,70%{transform:scale(.98,1.04)}}
@keyframes ks-pause-gaze{0%,100%{transform:translate(0,0) scale(1)}20%,72%{transform:translate(0,-1px) scale(.7)}}
@keyframes ks-pause-tongue{0%,100%{transform:scale(1,1)}18%,70%{transform:scale(1,.72)}}
@keyframes ks-pause-chime{0%,100%{transform:rotate(0)}18%{transform:rotate(-20deg)}42%{transform:rotate(16deg)}66%{transform:rotate(-9deg)}86%{transform:rotate(3deg)}}
@keyframes ks-pause-strip{0%,100%{transform:rotate(0)}24%{transform:rotate(-22deg)}48%{transform:rotate(20deg)}72%{transform:rotate(-10deg)}90%{transform:rotate(3deg)}}
/* talk: a bob on each word, the mouth opening and closing over the lip, the tongue bouncing after it */
.act-talk .ks-hop{animation:ks-talk-body 1.4s ease-in-out both}
.act-talk .ks-mouth{animation:ks-talk-mouth 1.4s ease-in-out both}
.act-talk .ks-canopy{animation:ks-talk-canopy 1.4s ease-in-out both}
.act-talk .ks-tongue{animation:ks-talk-tongue 1.4s ease-in-out both}
@keyframes ks-talk-body{0%,100%{transform:translate(0,0) scale(1,1)}14%{transform:translate(0,-3px) scale(.98,1.03)}28%{transform:translate(0,0) scale(1.03,.97)}42%{transform:translate(0,-3px) scale(.98,1.03)}56%{transform:translate(0,0) scale(1.03,.97)}70%{transform:translate(0,-2px) scale(.99,1.02)}84%{transform:translate(0,0) scale(1.02,.98)}}
@keyframes ks-talk-mouth{0%,100%{opacity:0;transform:scale(1,.3)}8%{opacity:1;transform:scale(1,.5)}18%{opacity:1;transform:scale(1,1.1)}30%{opacity:1;transform:scale(1.1,.45)}42%{opacity:1;transform:scale(1,1.15)}54%{opacity:1;transform:scale(1.1,.5)}66%{opacity:1;transform:scale(.95,1)}78%{opacity:1;transform:scale(1.1,.4)}88%{opacity:1;transform:scale(1,.75)}94%{opacity:0;transform:scale(1,.3)}}
@keyframes ks-talk-canopy{0%,100%{transform:rotate(0)}20%{transform:rotate(3deg)}48%{transform:rotate(-2deg)}76%{transform:rotate(2deg)}}
@keyframes ks-talk-tongue{0%,100%{transform:rotate(0) scale(1,1)}20%{transform:rotate(-6deg) scale(1,1.1)}34%{transform:rotate(4deg) scale(1,.94)}48%{transform:rotate(-6deg) scale(1,1.1)}62%{transform:rotate(4deg) scale(1,.94)}76%{transform:rotate(-4deg) scale(1,1.06)}90%{transform:rotate(2deg) scale(1,.98)}}
/* nod: two quick dips of the canopy, the tongue and chime bobbing after each */
.act-nod .ks-canopy{animation:ks-nod-canopy 1s ease-in-out both}
.act-nod .ks-tongue{animation:ks-nod-tongue 1s ease-in-out both}
.act-nod .ks-chime{animation:ks-nod-chime 1s ease-in-out both}
.act-nod .ks-hop{animation:ks-nod-body 1s ease-in-out both}
@keyframes ks-nod-canopy{0%,100%{transform:translate(0,0) rotate(0) scale(1,1)}22%{transform:translate(0,3px) rotate(-3deg) scale(1.06,.88)}44%{transform:translate(0,-1px) rotate(1deg) scale(.99,1.03)}66%{transform:translate(0,3px) rotate(-3deg) scale(1.06,.88)}88%{transform:translate(0,-1px) rotate(1deg) scale(.99,1.02)}}
@keyframes ks-nod-tongue{0%,100%{transform:scale(1,1) rotate(0)}30%{transform:scale(1,1.15) rotate(4deg)}50%{transform:scale(1,.95) rotate(-2deg)}74%{transform:scale(1,1.15) rotate(4deg)}92%{transform:scale(1,.97) rotate(-1deg)}}
@keyframes ks-nod-chime{0%,100%{transform:rotate(0)}30%{transform:rotate(12deg)}52%{transform:rotate(-8deg)}74%{transform:rotate(10deg)}92%{transform:rotate(-3deg)}}
@keyframes ks-nod-body{0%,100%{transform:scale(1,1)}20%{transform:scale(1.03,.97)}44%{transform:scale(1,1)}64%{transform:scale(1.03,.97)}}
/* startle: woken: a squash, then he pops clean off the rock, arms flung, pupil pinned, tongue and chime flying late */
.act-startle .ks-hop{animation:ks-startle-body .9s cubic-bezier(.4,0,.5,1) both}
.act-startle .ks-gaze{animation:ks-startle-gaze .9s ease-in-out both}
.act-startle .ks-armL{animation:ks-startle-armL .9s ease-in-out both}
.act-startle .ks-armR{animation:ks-startle-armR .9s ease-in-out both}
.act-startle .ks-tongue{animation:ks-startle-tongue .9s ease-in-out both}
.act-startle .ks-chime{animation:ks-startle-chime .9s ease-in-out both}
.act-startle .ks-strip{animation:ks-startle-strip .9s ease-in-out both}
@keyframes ks-startle-body{0%,100%{transform:translate(0,0) scale(1,1)}12%{transform:translate(0,0) scale(1.14,.84)}40%{transform:translate(0,-20px) scale(.9,1.12)}66%{transform:translate(0,0) scale(1.1,.9)}82%{transform:translate(0,0) scale(.97,1.03)}}
@keyframes ks-startle-gaze{0%,100%{transform:scale(1)}26%,74%{transform:scale(.62)}}
@keyframes ks-startle-armL{0%,100%{transform:rotate(0)}36%,56%{transform:rotate(120deg)}}
@keyframes ks-startle-armR{0%,100%{transform:rotate(0)}36%,56%{transform:rotate(-120deg)}}
@keyframes ks-startle-tongue{0%,100%{transform:rotate(0) scale(1,1)}20%{transform:rotate(0) scale(1,1.12)}50%{transform:rotate(-30deg) scale(1,.84)}76%{transform:rotate(10deg) scale(1,1.08)}}
@keyframes ks-startle-chime{0%,100%{transform:rotate(0)}30%{transform:rotate(16deg)}54%{transform:rotate(-26deg)}76%{transform:rotate(14deg)}92%{transform:rotate(-4deg)}}
@keyframes ks-startle-strip{0%,100%{transform:rotate(0)}34%{transform:rotate(22deg)}58%{transform:rotate(-30deg)}80%{transform:rotate(16deg)}94%{transform:rotate(-4deg)}}
/* special, his signature: the canopy furls shut like a put-away umbrella, shivers, then pops open with a flourish, arms flung, strip flaring */
.act-special .ks-canopy{animation:ks-special-canopy 2.8s ease-in-out both}
.act-special .ks-hop{animation:ks-special-body 2.8s ease-in-out both}
.act-special .ks-armL{animation:ks-special-armL 2.8s ease-in-out both}
.act-special .ks-armR{animation:ks-special-armR 2.8s ease-in-out both}
.act-special .ks-chime{animation:ks-special-chime 2.8s ease-in-out both}
.act-special .ks-strip{animation:ks-special-strip 2.8s ease-in-out both}
.act-special .ks-tongue{animation:ks-special-tongue 2.8s ease-in-out both}
@keyframes ks-special-canopy{0%,100%{transform:translate(0,0) rotate(0) scale(1,1)}12%{transform:translate(0,-1px) rotate(-2deg) scale(1.06,1.01)}30%{transform:translate(0,1px) rotate(2deg) scale(.16,1.1)}40%{transform:translate(0,1px) rotate(-3deg) scale(.16,1.1)}50%{transform:translate(0,1px) rotate(3deg) scale(.16,1.1)}58%{transform:translate(0,2px) rotate(0) scale(.12,1.06)}68%{transform:translate(0,-3px) rotate(-2deg) scale(1.3,.9)}78%{transform:translate(0,0) rotate(2deg) scale(.94,1.05)}88%{transform:translate(0,0) rotate(-1deg) scale(1.03,.98)}}
@keyframes ks-special-body{0%,28%,100%{transform:translate(0,0) scale(1,1)}36%{transform:translate(0,0) scale(1.02,.98)}44%{transform:translate(0,0) scale(.98,1.02)}52%{transform:translate(0,0) scale(1.02,.98)}60%{transform:translate(0,0) scale(1.1,.88)}70%{transform:translate(0,-12px) scale(.94,1.08)}82%{transform:translate(0,0) scale(1.08,.92)}92%{transform:translate(0,0) scale(.98,1.02)}}
@keyframes ks-special-armL{0%,100%{transform:rotate(0)}30%,58%{transform:rotate(-30deg)}70%{transform:rotate(130deg)}80%{transform:rotate(95deg)}90%{transform:rotate(20deg)}}
@keyframes ks-special-armR{0%,100%{transform:rotate(0)}30%,58%{transform:rotate(30deg)}70%{transform:rotate(-130deg)}80%{transform:rotate(-95deg)}90%{transform:rotate(-20deg)}}
@keyframes ks-special-chime{0%,100%{transform:rotate(0)}20%,58%{transform:rotate(-8deg)}72%{transform:rotate(-30deg)}84%{transform:rotate(18deg)}94%{transform:rotate(-6deg)}}
@keyframes ks-special-strip{0%,56%,100%{transform:rotate(0)}74%{transform:rotate(34deg)}86%{transform:rotate(-24deg)}95%{transform:rotate(8deg)}}
@keyframes ks-special-tongue{0%,100%{transform:rotate(0) scale(1,1)}24%,58%{transform:rotate(0) scale(1,.7)}72%{transform:rotate(-20deg) scale(1,1.15)}84%{transform:rotate(12deg) scale(1,1)}94%{transform:rotate(-4deg) scale(1,1)}}
/* bow: a polite dip: the canopy bends forward and down, arms tucked, the chime swinging out and the tongue following */
.act-bow .ks-canopy{animation:ks-bow-canopy 1.4s ease-in-out both}
.act-bow .ks-hop{animation:ks-bow-body 1.4s ease-in-out both}
.act-bow .ks-armL{animation:ks-bow-armL 1.4s ease-in-out both}
.act-bow .ks-armR{animation:ks-bow-armR 1.4s ease-in-out both}
.act-bow .ks-chime{animation:ks-bow-chime 1.4s ease-in-out both}
.act-bow .ks-tongue{animation:ks-bow-tongue 1.4s ease-in-out both}
.act-bow .ks-strip{animation:ks-bow-strip 1.4s ease-in-out both}
@keyframes ks-bow-canopy{0%,100%{transform:translate(0,0) rotate(0) scale(1,1)}12%{transform:translate(0,-1px) rotate(1deg) scale(.99,1.02)}36%,62%{transform:translate(0,6px) rotate(-4deg) scale(1.08,.8)}86%{transform:translate(0,-1px) rotate(1deg) scale(.99,1.02)}}
@keyframes ks-bow-body{0%,100%{transform:scale(1,1)}40%,60%{transform:scale(1.03,.95)}}
@keyframes ks-bow-armL{0%,100%{transform:rotate(0)}38%,62%{transform:rotate(-28deg)}}
@keyframes ks-bow-armR{0%,100%{transform:rotate(0)}38%,62%{transform:rotate(28deg)}}
@keyframes ks-bow-chime{0%,100%{transform:rotate(0)}40%,58%{transform:rotate(14deg)}80%{transform:rotate(-7deg)}}
@keyframes ks-bow-tongue{0%,100%{transform:rotate(0) scale(1,1)}44%,64%{transform:rotate(5deg) scale(1,1.2)}86%{transform:rotate(-2deg) scale(1,.97)}}
@keyframes ks-bow-strip{0%,100%{transform:rotate(0)}46%,60%{transform:rotate(12deg)}82%{transform:rotate(-7deg)}}`});
})();
