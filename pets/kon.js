/* pets/kon.js · Kon, the white nine-tailed kitsune with the little shamisen */
'use strict';
(function(){
const {r2,notes,zz}=PetKit;
/* ═══════════ Kon, the nine-tailed fox spirit with a shamisen (folklore) ═══════════
   A kyubi no kitsune: pearl-white fur, nine big tails fanned out behind him like
   a halo, each one tipped in koi-red flame cut as jagged zig-zag bands. Tall ears
   with red insides and red tips; red swirl and comma marks on the forehead (a
   flame mark centred on it), the cheeks and the paws. A smug little smile, a dark
   button nose and the big low-set eyes the other buddies have (no mask, ever).
   He sits chibi-style on a mossy shrine stone fringed with higanbana, a small
   shamisen across his lap: the bachi in his right paw (viewer's left) strums the
   beat, the other paw holds the neck. Three tongues of kitsunebi, foxfire, hover
   about him. Same box and grammar as the toads: ground line y = 0, light from the
   upper left, soft tan outlines about .55 wide under the white fur.
   Moving groups each sit in their own translate() (see kit.js): kn-bob the whole
   body, kn-rock the head, kn-t the nine tails (with --o the side, -1 left / 0 /
   1 right, --k the distance from the middle tail 0..4, --n the order left to
   right 0..8), kn-earR/L (--e the side), kn-armR, kn-armL, kn-bachi, kn-gaze,
   kn-blink, kn-mouthO (open mouth, hidden at rest) and kn-orbit round the fire. */
const LINE='#b98f5c', TLINE='#c0925e', MARK='#d8342a';
const K_BODY='M0 0 C13 .5 24 -3 27 -11 C30 -20 26 -30 19 -36 L-19 -36 C-26 -30 -30 -20 -27 -11 C-24 -3 -13 .5 0 0Z';
/* the head: wider than tall, a short crown, and a jagged ruff of cheek fluff sticking out each side */
const K_HEAD='M0 -36 C12 -36 24 -39 31 -45 C36 -44 40 -46 42 -50 C38 -53 39 -56.5 44 -60 C40 -63 40 -67 43 -71 C38 -72 36 -74 36 -76 C33 -83 18 -86 0 -86 C-18 -86 -33 -83 -36 -76 C-36 -74 -38 -72 -43 -71 C-40 -67 -40 -63 -44 -60 C-39 -56.5 -38 -53 -42 -50 C-40 -46 -36 -44 -31 -45 C-24 -39 -12 -36 0 -36Z';
/* one tongue of foxfire, a teardrop with a licking tip */
const FLAME='M1.6 -9.6 C.2 -6.4 4.8 -4.2 5.1 .6 C5.3 4.6 2.8 6.8 0 6.8 C-2.8 6.8 -5.2 4.6 -5.2 .8 C-5.2 -2.6 -2.4 -4.4 -1.4 -7 C-.9 -8.3 .2 -9.2 1.6 -9.6Z';
/* one eye: the toads' eye (gold iris, wide pupil, heavy lid that droops at the
   outer corner). Open while he waits, shut and smiling while the music plays. */
function kEye(cx,cy,o,ID){
  const R=9, top=r2(cy-R), c=o>0?'er':'el', yl=r2(cy-2.9+(o<0?.5:0)), yr=r2(cy-2.9+(o>0?.5:0));
  const lid=`M${cx-R-1} ${yl} L${cx-R-1} ${cy-R-1} L${cx+R+1} ${cy-R-1} L${cx+R+1} ${yr} C${r2(cx+5.4)} ${r2(cy-5.5)} ${r2(cx-5.4)} ${r2(cy-5.5)} ${cx-R-1} ${yl}Z`;
  return `<clipPath id="${ID}${c}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
    <circle class="pk-look" cx="${cx}" cy="${cy}" r="${R}" fill="#fff8e9"/>
    <g clip-path="url(#${ID}${c})">
      <g class="kn-open">
        <ellipse cx="${cx}" cy="${r2(cy+1.2)}" rx="${R+.5}" ry="${R}" fill="#173a3b" opacity=".08"/>
        <circle cx="${cx}" cy="${r2(cy+.4)}" r="6.9" fill="url(#${ID}iris)"/>
        <circle cx="${cx}" cy="${r2(cy+.4)}" r="6.9" fill="none" stroke="#7a5326" stroke-width=".5" opacity=".7"/>
        <g transform="translate(${cx} ${r2(cy+.8)})"><g class="kn-gaze">
          <ellipse rx="4" ry="3.3" fill="#1f2e2c"/>
          <circle cx="1.8" cy="-1" r="1.45" fill="#ffffff" opacity=".94"/>
          <circle cx="-2.2" cy="1.5" r=".5" fill="#ffffff" opacity=".55"/>
        </g></g>
        <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${LINE}" stroke-width="1.1"/>
        <g transform="translate(${cx} ${top})"><g class="kn-blink"><g transform="translate(${-cx} ${-top})">
          <path d="${lid}" fill="url(#${ID}skin)"/>
          <path d="M${r2(cx-8.3)} ${r2(yl+.25)} C${r2(cx-5.2)} ${r2(cy-5.3)} ${r2(cx+5.2)} ${r2(cy-5.3)} ${r2(cx+8.3)} ${r2(yr+.25)}" fill="none" stroke="#6b3a2a" stroke-width="1.4" stroke-linecap="round"/>
        </g></g></g>
      </g>
      <g class="kn-closed">
        <circle cx="${cx}" cy="${cy}" r="${R+.5}" fill="url(#${ID}skin)"/>
        <path d="M${r2(cx-6.4)} ${r2(cy+2.6)} Q${cx} ${r2(cy-4.2)} ${r2(cx+6.4)} ${r2(cy+2.6)}" fill="none" stroke="#6b3a2a" stroke-width="1.5" stroke-linecap="round"/>
      </g>
    </g>`;
}
/* a tall ear, root at 0,0, tip up and a little out (+x): red inside, red tip; mirrored for the other side */
function kEar(cls,x,ID,o){
  return `<g transform="translate(${x} -78)"><g class="${cls}" style="--e:${o}"><g transform="scale(${o*1.15} 1.15) rotate(14)">
    <path d="M-8 4 C-8.5 -6 -3.5 -16 4 -24 C9.5 -18.5 10.5 -6 9.5 4Z" fill="url(#${ID}skin)" stroke="${LINE}" stroke-width=".55" stroke-linejoin="round"/>
    <path d="M-4 2.5 C-4 -5 -1 -12 3.6 -18.5 C6.2 -13.6 6.6 -5 6 2.5Z" fill="#f07a66"/>
    <path d="M-4.6 -13.2 C-3 -17.4 0 -21 4 -24 C6.8 -20.6 8.6 -17 8.8 -13.4 C4.4 -15.2 -.4 -15 -4.6 -13.2Z" fill="url(#${ID}red)"/>
    <path d="M-5.6 1 C-6.4 -2.4 -4.6 -5.4 -2.4 -4.6" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
  </g></g></g>`;
}
/* one tail, root at 0,0, tip at 0,-L: a plump white plume with a scalloped fur edge, a red flame tip
   with soft licks on its last fifth, and a thin red swirl near the base */
function kTail(i,ID){
  const k=Math.abs(i), L=[106,98,90,72,60][k], w=[12.5,12.5,12,11.5,10.5][k], side=i<0?'kn-tl':i>0?'kn-tr':'kn-tm';
  const X=(x,y)=>`${r2(x*w)} ${r2(-y*L)}`;
  const F=[[0,.15],[.1,.68],[.26,.92],[.42,1.02],[.58,.98],[.78,.78]];   /* [how far up, half-width] where the fur tufts meet */
  const scallop=(a,b,o)=>`Q${X(o*((a[1]+b[1])/2+.3),(a[0]+b[0])/2)} ${X(o*b[1],b[0])}`;
  let left='', right='';
  for(let j=1;j<F.length;j++){ left+=scallop(F[j-1],F[j],-1)+' '; right+=scallop(F[F.length-j],F[F.length-j-1],1)+' '; }
  const cap=`C${X(-.7,.9)} ${X(-.35,1)} 0 ${-L} C${X(.35,1)} ${X(.7,.9)} ${X(.78,.78)}`;
  const leaf=`M0 2 ${left}${cap} ${right}Z`;
  const tip=`M${X(-.78,.78)} ${cap} C${X(.6,.75)} ${X(.5,.75)} ${X(.3,.84)} C${X(.18,.76)} ${X(.08,.76)} 0 ${r2(-L*.77)} C${X(-.08,.76)} ${X(-.18,.76)} ${X(-.3,.84)} C${X(-.5,.75)} ${X(-.6,.75)} ${X(-.78,.78)}Z`;
  const lick=`M${X(-.22,.88)} C${X(-.15,.86)} ${X(.15,.86)} ${X(.22,.88)} C${X(.15,.95)} ${X(.06,.98)} 0 ${r2(-L*.985)} C${X(-.06,.98)} ${X(-.15,.95)} ${X(-.22,.88)}Z`;
  const swirl=`M${X(.05,.12)} C${X(.38,.15)} ${X(.42,.3)} ${X(.1,.32)} C${X(-.14,.32)} ${X(-.12,.22)} ${X(.08,.22)}`;
  return `<g transform="translate(0 -14)"><g class="kn-t ${side}" style="--o:${Math.sign(i)};--k:${k};--n:${i+4}"><g transform="rotate(${i*20})">
    <path d="${leaf}" fill="url(#${ID}fur)" stroke="${TLINE}" stroke-width=".8" stroke-linejoin="round"/>
    <path d="${swirl}" fill="none" stroke="${MARK}" stroke-width=".9" stroke-linecap="round" opacity=".75"/>
    <path d="${tip}" fill="url(#${ID}red)" stroke="#9c1a18" stroke-width=".45" stroke-linejoin="round"/>
    <path d="${lick}" fill="#ff9a66" opacity=".6"/>
  </g></g></g>`;
}
/* a tongue of foxfire at x,y: a wide pale halo, the flame, a side lick and a cream core */
function kFire(cls,x,y,s,ID){
  return `<g transform="translate(${x} ${y})"><g class="kn-fire ${cls}"><g class="kn-flick"><g transform="scale(${s})">
    <path d="${FLAME}" transform="scale(1.9 1.7)" fill="#8fe6d6" opacity=".14"/>
    <path d="${FLAME}" transform="scale(1.35 1.3)" fill="#8fe6d6" opacity=".24"/>
    <path d="${FLAME}" fill="url(#${ID}fire)"/>
    <path d="${FLAME}" transform="translate(-3.6 -.6) rotate(-34) scale(.5 .62)" fill="url(#${ID}fire)"/>
    <path d="${FLAME}" transform="translate(3.4 1.2) rotate(26) scale(.38 .5)" fill="url(#${ID}fire)"/>
    <path d="${FLAME}" transform="translate(0 1.6) scale(.5 .55)" fill="#fff8e9" opacity=".9"/>
    <circle cx="2.2" cy="-10.6" r=".8" fill="#f8d98a" opacity=".9"/>
  </g></g></g></g>`;
}
/* a higanbana, the red spider lily: six curled petals and long stamens from one point */
function kLily(x,y,s){
  const petals=[-150,-115,-80,-50,-20,10].map(a=>`<path d="M0 0 Q4.5 -1.5 7.6 -1" transform="rotate(${a})"/>`).join('');
  const stamens=[-140,-100,-62,-28].map(a=>`<path d="M1 0 Q6 -2.2 10.2 -1.8" transform="rotate(${a})"/>`).join('');
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <path d="M0 0 L0 7" fill="none" stroke="#4f8a4a" stroke-width=".8" stroke-linecap="round"/>
    <g fill="none" stroke="#cf3f2a" stroke-width="1.4" stroke-linecap="round">${petals}</g>
    <g fill="none" stroke="#ec7a45" stroke-width=".55" stroke-linecap="round" opacity=".9">${stamens}</g>
    <circle r="1.1" fill="#f8d98a" stroke="#cf3f2a" stroke-width=".4"/>
  </g>`;
}
function kon(ID){
  const paw=(x,y)=>`<g transform="translate(${x} ${y})">
    <ellipse rx="4.6" ry="3.8" fill="#fff8e9" stroke="${LINE}" stroke-width=".5"/>
    <path d="M-2 -3 L-1.8 -.6 M1.3 -3.2 L1.5 -.8" fill="none" stroke="#d4a872" stroke-width=".6" stroke-linecap="round"/>
    <ellipse cx="-1.3" cy="-1.5" rx="2.2" ry=".9" fill="#ffffff" opacity=".5"/></g>`;
  /* a hind paw, red swirl marks up the leg */
  const foot=o=>`<g transform="translate(${o*12} -1.5) scale(${o} 1)">
    <path d="M-7.5 -2.6 C-7.5 -7 7.5 -7 7.5 -2.6 C7.5 1.2 3.5 2.6 0 2.6 C-3.5 2.6 -7.5 1.2 -7.5 -2.6Z" fill="#f8ecd6" stroke="${LINE}" stroke-width=".5"/>
    <path d="M-2.6 -4.2 L-2.4 .2 M2.6 -4.2 L2.4 .2" fill="none" stroke="#d4a872" stroke-width=".6" stroke-linecap="round"/>
    <path d="M-5.2 -4.8 C-3.6 -3.6 -3.8 -1.4 -5.4 -.4 M4.8 -4.8 C6.2 -3.6 6 -1.4 4.4 -.4" fill="none" stroke="${MARK}" stroke-width="1" stroke-linecap="round" opacity=".9"/>
    <ellipse cx="-1.6" cy="-3.8" rx="2.6" ry="1" fill="#ffffff" opacity=".5"/></g>`;
  /* a magatama comma on each cheek, head up and out, tail curling down toward the eye */
  const comma=o=>`<g transform="translate(${o*33} -66) scale(${o*.8} .8)">
    <path d="M0 0 C-1.4 -3.8 1.8 -7 4.8 -5.6 C7.6 -4.4 7 -.8 4.2 .1 C2.8 .5 1.2 .4 0 0Z" fill="${MARK}"/>
    <circle cx="4.4" cy="-3.6" r=".8" fill="#fff8e9" opacity=".85"/></g>`;
  return `<defs>
    <linearGradient id="${ID}skin" gradientUnits="userSpaceOnUse" x1="0" y1="-95" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".25" stop-color="#fff9ef"/><stop offset=".6" stop-color="#fbf3e6"/><stop offset=".85" stop-color="#efe0c4"/><stop offset=".96" stop-color="#d9bf95"/><stop offset="1" stop-color="#173a3b"/></linearGradient>
    <linearGradient id="${ID}fur" gradientUnits="userSpaceOnUse" x1="-12" y1="-70" x2="13" y2="-2"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#f1ede5"/><stop offset="1" stop-color="#c4b9aa"/></linearGradient>
    <radialGradient id="${ID}edge" cx=".5" cy=".44" r=".62"><stop offset=".58" stop-color="#b8864c" stop-opacity="0"/><stop offset="1" stop-color="#b8864c" stop-opacity=".36"/></radialGradient>
    <linearGradient id="${ID}red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6603c"/><stop offset=".5" stop-color="#dc3024"/><stop offset="1" stop-color="#a81c1c"/></linearGradient>
    <radialGradient id="${ID}iris" cx=".45" cy=".42" r=".6"><stop offset="0" stop-color="#f8d98a"/><stop offset=".55" stop-color="#e2a63c"/><stop offset="1" stop-color="#a8702a"/></radialGradient>
    <radialGradient id="${ID}fire" cx=".5" cy=".64" r=".56"><stop offset="0" stop-color="#fff6c8"/><stop offset=".42" stop-color="#8ae6d4"/><stop offset="1" stop-color="#1f8f88"/></radialGradient>
    <linearGradient id="${ID}wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a86e3e"/><stop offset=".5" stop-color="#6e4426"/><stop offset="1" stop-color="#3f2616"/></linearGradient>
    <linearGradient id="${ID}dou" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf3dc"/><stop offset=".6" stop-color="#eedcb4"/><stop offset="1" stop-color="#d5b985"/></linearGradient>
    <linearGradient id="${ID}bachi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffbf0"/><stop offset=".6" stop-color="#efe1c0"/><stop offset="1" stop-color="#cdb27e"/></linearGradient>
    <linearGradient id="${ID}stone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9a49a"/><stop offset=".55" stop-color="#6f6b64"/><stop offset="1" stop-color="#2f3331"/></linearGradient>
    <linearGradient id="${ID}stonetop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6d1c6"/><stop offset=".55" stop-color="#b4afa4"/><stop offset="1" stop-color="#8f8a80"/></linearGradient>
    <clipPath id="${ID}hc"><path d="${K_HEAD}"/></clipPath>
    <clipPath id="${ID}bc"><path d="${K_BODY}"/></clipPath>
    <clipPath id="${ID}top"><path d="M-46 0 C-46 -6 -30 -8 0 -8 C30 -8 46 -6 46 0 C46 5.5 30 7.5 0 7.5 C-30 7.5 -46 5.5 -46 0Z"/></clipPath>
  </defs>
  <!-- his perch: a mossy shrine stone with a fringe of higanbana -->
  <ellipse cx="0" cy="10" rx="56" ry="5.6" fill="#173a3b" opacity=".22"/>
  <path d="M-46 0 C-46 9 -30 13.5 0 13.5 C30 13.5 46 9 46 0Z" fill="url(#${ID}stone)"/>
  <path d="M-46 0 C-46 9 -30 13.5 0 13.5 C30 13.5 46 9 46 0" fill="none" stroke="#3c3b36" stroke-width=".6" opacity=".7"/>
  <path d="M-14 7.6 L-9.6 9.4 L-11.4 12.2 M22 8.2 L26.6 10.4" fill="none" stroke="#3c3b36" stroke-width=".7" stroke-linecap="round" opacity=".55"/>
  <path d="M-13.4 8.2 L-9 10 M22.4 8.8 L27 11" fill="none" stroke="#c9c4b8" stroke-width=".5" stroke-linecap="round" opacity=".45"/>
  <path d="M-46 0 C-46 -6 -30 -8 0 -8 C30 -8 46 -6 46 0 C46 5.5 30 7.5 0 7.5 C-30 7.5 -46 5.5 -46 0Z" fill="url(#${ID}stonetop)" stroke="#6f6b64" stroke-width=".6"/>
  <g clip-path="url(#${ID}top)">
    <path d="M-38 -2 C-34 -6 -22 -6.5 -17 -3 C-19 -1 -34 .5 -38 -2Z" fill="#79ad66" opacity=".8"/>
    <path d="M18 -3.5 C24 -6.5 34 -6 38 -2.5 C34 -1 24 -1 18 -3.5Z" fill="#79ad66" opacity=".8"/>
    <g fill="#79ad66" opacity=".6"><circle cx="-12" cy="-4.6" r="1.1"/><circle cx="-42" cy="1.4" r="1"/><circle cx="12" cy="-5.2" r="1"/><circle cx="42" cy="1" r="1.1"/></g>
    <path d="M-6 -6.6 C-2 -3 3 -2 7 2.2" fill="none" stroke="#6f6b64" stroke-width=".55" opacity=".6"/>
    <ellipse cx="0" cy="1" rx="30" ry="3.2" fill="#173a3b" opacity=".2"/>
  </g>
  ${kLily(-55,-4,.9)}${kLily(-46,3,.7)}${kLily(47,-4,1)}${kLily(39,-1,.7)}
  <g class="pk-body"><g class="mp-breathe"><g class="kn-bob">
    <!-- the nine tails, a halo behind him: outer ones first, the middle one last -->
    ${[-4,4,-3,3,-2,2,-1,1,0].map(i=>kTail(i,ID)).join('')}
    <!-- hind paws, out in front -->
    ${foot(1)}${foot(-1)}
    <!-- the body, small and round, a brighter ruff down the chest -->
    <path d="${K_BODY}" fill="url(#${ID}skin)" stroke="${LINE}" stroke-width=".6"/>
    <g clip-path="url(#${ID}bc)">
      <path d="M-14 -36 C-15 -27 -10 -17 -3 -13 L0 -15 L3 -13 C10 -17 15 -27 14 -36Z" fill="#ffffff" opacity=".7"/>
      <rect x="-30" y="-38" width="60" height="40" fill="url(#${ID}edge)"/>
      <ellipse cx="0" cy="-34" rx="22" ry="6.5" fill="#173a3b" opacity=".22"/>
      <ellipse cx="0" cy="-2" rx="22" ry="3" fill="#173a3b" opacity=".14"/>
    </g>
    <!-- the head: it sways with the music -->
    <g transform="translate(0 -36)"><g class="kn-rock"><g transform="translate(0 36)">
      ${kEar('kn-earR',23,ID,1)}${kEar('kn-earL',-23,ID,-1)}
      <path d="${K_HEAD}" fill="url(#${ID}skin)" stroke="${LINE}" stroke-width=".6" stroke-linejoin="round"/>
      <g clip-path="url(#${ID}hc)">
        <rect x="-48" y="-88" width="96" height="54" fill="url(#${ID}edge)"/>
        <ellipse cx="-16" cy="-79" rx="8" ry="3" fill="#ffffff" opacity=".5" transform="rotate(-22 -16 -79)"/>
      </g>
      <path d="M-41 -61 L-36 -60 M41 -61 L36 -60 M-40 -51 L-35.5 -50.5 M40 -51 L35.5 -50.5" fill="none" stroke="#ffffff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>
      <!-- the short muzzle, a lighter cream patch, the nose at its tip -->
      <path d="M-12 -53 C-12 -59 12 -59 12 -53 C12 -43 6.5 -38.5 0 -38.5 C-6.5 -38.5 -12 -43 -12 -53Z" fill="#ffffff" stroke="#e6d3b2" stroke-width=".45" opacity=".95"/>
      <ellipse cx="-4.5" cy="-54" rx="4" ry="1.4" fill="#ffffff" opacity=".8" transform="rotate(-12 -4.5 -54)"/>
      <!-- the red marks: a flame on the forehead, a comma on each cheek -->
      <path d="M0 -84.5 C2.6 -81.6 3 -78 0 -75.4 C-3 -78 -2.6 -81.6 0 -84.5Z" fill="url(#${ID}red)"/>
      <path d="M-4.6 -78.4 C-4 -80.8 -2.6 -82.2 -1.2 -82.4 M4.6 -78.4 C4 -80.8 2.6 -82.2 1.2 -82.4" fill="none" stroke="${MARK}" stroke-width="1" stroke-linecap="round"/>
      ${comma(1)}${comma(-1)}
      <ellipse cx="-25" cy="-49" rx="5" ry="2.8" fill="#f48a78" opacity=".45"/>
      <ellipse cx="25" cy="-49" rx="5" ry="2.8" fill="#f48a78" opacity=".45"/>
      ${kEye(-15,-60,-1,ID)}
      ${kEye(15,-60,1,ID)}
      <!-- the nose, the smug smile, and the open mouth that only shows when he talks or yawns -->
      <ellipse cx="0" cy="-50.4" rx="2.2" ry="1.6" fill="#3a2a26"/>
      <circle cx="-.8" cy="-51" r=".55" fill="#ffffff" opacity=".7"/>
      <path d="M-4.4 -46.6 Q-1.6 -43.8 1 -46 Q3.6 -44 5.6 -47.8" fill="none" stroke="#6b3a2a" stroke-width="1" stroke-linecap="round"/>
      <g transform="translate(0 -47.6)"><g class="kn-mouthO">
        <ellipse cy="3.2" rx="3.2" ry="3.4" fill="#5b2622"/>
        <ellipse cy="4.8" rx="1.9" ry="1.3" fill="#f07a7a"/>
      </g></g>
    </g></g></g>
    <!-- the small shamisen across his lap: the square dou at the left, the neck up to the pegs -->
    <g transform="translate(-13 -17) rotate(-22) scale(.62)">
      <rect x="-10.6" y="-2.2" width="3.4" height="4.4" rx=".9" fill="#3a2a22"/>
      <rect x="-8.5" y="-8.5" width="17" height="17" rx="3" fill="url(#${ID}wood)" stroke="#3a2416" stroke-width=".7"/>
      <rect x="-7.1" y="-7.1" width="14.2" height="14.2" rx="2" fill="url(#${ID}dou)" stroke="#8a6a40" stroke-width=".5"/>
      <ellipse cx="-3" cy="-3" rx="3.6" ry="2" fill="#ffffff" opacity=".35"/>
      <rect x="5" y="-1.6" width="60" height="3.2" fill="url(#${ID}wood)" stroke="#3a2416" stroke-width=".7"/>
      <path d="M7 -.8 L63 -.8" fill="none" stroke="#d9a46c" stroke-width=".5" opacity=".5"/>
      <rect x="63" y="-2.5" width="9" height="5" rx="1.2" fill="#4a2c1a" stroke="#2a1810" stroke-width=".6"/>
      <g fill="#2e1c12" stroke="#1a100a" stroke-width=".4">
        <rect x="64.8" y="-6.6" width="1.6" height="4.6"/><rect x="69" y="-6.6" width="1.6" height="4.6"/><rect x="66.9" y="2" width="1.6" height="4.6"/>
        <circle cx="65.6" cy="-6.8" r="1.4"/><circle cx="69.8" cy="-6.8" r="1.4"/><circle cx="67.7" cy="6.8" r="1.4"/>
      </g>
      <path d="M-8.8 -1.1 L64 -1.1 M-8.8 0 L64 0 M-8.8 1.1 L64 1.1" fill="none" stroke="#f6ecd2" stroke-width=".5" opacity=".9"/>
      <rect x="-2.6" y="-2.6" width="1.5" height="5.2" fill="#fff8e9" stroke="#a88a58" stroke-width=".3"/>
    </g>
    <!-- the stubby paw on the neck (viewer's right): it waves -->
    <g transform="translate(16 -26)"><g class="kn-armR"><g transform="translate(-16 26)">
      <path d="M16 -26 C20 -27.5 23 -30 25 -33" fill="none" stroke="${LINE}" stroke-width="7.6" stroke-linecap="round"/>
      <path d="M16 -26 C20 -27.5 23 -30 25 -33" fill="none" stroke="url(#${ID}skin)" stroke-width="6.4" stroke-linecap="round"/>
      ${paw(25,-33.5)}
    </g></g></g>
    <!-- the strumming arm (viewer's left) and the bachi in its paw -->
    <g transform="translate(-16 -26)"><g class="kn-armL"><g transform="translate(16 26)">
      <path d="M-16 -26 C-16.5 -23 -13.5 -20 -9 -19.5" fill="none" stroke="${LINE}" stroke-width="7.6" stroke-linecap="round"/>
      <path d="M-16 -26 C-16.5 -23 -13.5 -20 -9 -19.5" fill="none" stroke="url(#${ID}skin)" stroke-width="6.4" stroke-linecap="round"/>
      <g transform="translate(-8 -19)"><g class="kn-bachi"><g transform="rotate(40) scale(.85)">
        <path d="M-1.2 -2 L1.2 -2 L5.4 10.4 Q0 12 -5.4 10.4Z" fill="url(#${ID}bachi)" stroke="#a88a58" stroke-width=".5" stroke-linejoin="round"/>
        <path d="M-1.1 1.8 L-3.4 9.4" fill="none" stroke="#ffffff" stroke-width=".8" stroke-linecap="round" opacity=".7"/>
      </g></g></g>
      ${paw(-8,-19)}
    </g></g></g>
  </g></g>
  <!-- the foxfire: three tongues about him, lowest when nothing plays; they circle him for his special -->
  <g transform="translate(0 -56)"><g class="kn-orbit"><g transform="translate(0 56)">
    ${kFire('kn-f1',-46,-86,1,ID)}${kFire('kn-f2',46,-86,.9,ID)}${kFire('kn-f3',-26,-106,.65,ID)}
  </g></g></g>
  </g>
  ${notes(-4,-104,'#ec7a45')}
  ${zz(38,-82)}`;
}
/* an act: every selector gets .pk-body in it so acts outrank the dances (.playing.dance-N .kn-x) and win mid-song */
const A=(name,rules)=>Object.entries(rules).map(([sel,anim])=>`.act-${name} .pk-body ${sel}{animation:${anim}}`).join('\n');
PetKit.register({id:'kon',name:'Kon',kind:'kitsune',blurb:'Strums a shamisen while his nine tails fan and his foxfire keeps time.',art:kon,css:`/* the nine-tail: blink, glance, an ear flick and a slow roll through the tails while he waits; strum, sway, swish and blaze while it plays */
.kn-blink{animation:kn-blink 6.4s ease-in-out infinite}
.kn-gaze{animation:kn-gaze 11s ease-in-out infinite}
.kn-earR{animation:kn-flick 9s ease-in-out infinite}
.kn-earL{animation:kn-flick 13s ease-in-out infinite;animation-delay:-5s}
.kn-t{animation:kn-sway 5.4s ease-in-out infinite;animation-delay:calc(var(--n)*-.3s)}
.kn-fire{transform:translateY(3px) scale(.82);opacity:.62;transition:transform .9s ease,opacity .9s ease}
.kn-flick{animation:kn-flicker 2.3s ease-in-out infinite}
.kn-f2 .kn-flick{animation-delay:-.8s}.kn-f3 .kn-flick{animation-delay:-1.5s}
.kn-closed,.kn-mouthO{opacity:0}
.playing .kn-open{opacity:0}.playing .kn-closed{opacity:1}
.playing .kn-bob{animation:kn-bob .86s ease-in-out infinite}
.playing .kn-rock{animation:kn-rock 1.72s ease-in-out infinite}
.playing .kn-t{animation:kn-swish 1.72s ease-in-out infinite;animation-delay:calc(var(--n)*-.1s)}
.playing .kn-bachi{animation:kn-strum .86s cubic-bezier(.2,.9,.3,1) infinite}
.playing .kn-earR,.playing .kn-earL{animation:none}
.playing .kn-fire{transform:none;opacity:1}
.playing .kn-flick{animation:kn-blaze 1.72s ease-in-out infinite}
.playing .kn-f2 .kn-flick{animation-delay:-.57s}.playing .kn-f3 .kn-flick{animation-delay:-1.15s}
@keyframes kn-blink{0%,91%,97%,100%{transform:scaleY(1)}93.5%,95%{transform:scaleY(3.8)}}
@keyframes kn-gaze{0%,36%,92%,100%{transform:translate(0,0)}40%,56%{transform:translate(-1.4px,.3px)}60%,76%{transform:translate(1.3px,.3px)}80%{transform:translate(0,0)}}
@keyframes kn-flick{0%,60%,67%,100%{transform:rotate(0)}62%{transform:rotate(calc(var(--e)*-17deg))}65%{transform:rotate(calc(var(--e)*5deg))}}
@keyframes kn-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes kn-swish{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@keyframes kn-bob{0%,100%{transform:none}50%{transform:translateY(1.1px) scale(1.014,.984)}}
@keyframes kn-rock{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes kn-strum{0%,100%{transform:rotate(-15deg)}22%{transform:rotate(13deg)}}
@keyframes kn-flicker{0%,100%{transform:scale(1,1)}50%{transform:scale(.93,1.06)}}
@keyframes kn-blaze{0%,66%,100%{transform:translateY(0) scale(.94);opacity:.78}33%{transform:translateY(-3px) scale(1.16);opacity:1}}
/* the three dances, each in place of the plain playing body motion */
/* 1 · a head-bob groove, the whole fan of tails swishing side to side */
.playing.dance-1 .kn-bob{animation:kn-d1-bob .86s ease-in-out infinite}
.playing.dance-1 .kn-rock{animation:kn-d1-head .86s ease-in-out infinite}
.playing.dance-1 .kn-t{animation:kn-d1-tail 1.72s ease-in-out infinite;animation-delay:calc(var(--k)*-.08s)}
@keyframes kn-d1-bob{0%,100%{transform:translateY(0) scale(1.03,.96)}50%{transform:translateY(-2px) scale(.98,1.03)}}
@keyframes kn-d1-head{0%,100%{transform:translateY(1.5px) rotate(-4deg)}50%{transform:translateY(-1.5px) rotate(4deg)}}
@keyframes kn-d1-tail{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
/* 2 · a side-to-side strum sway, head leaning against it, tails dragging a beat behind, the bachi twice as quick */
.playing.dance-2 .kn-bob{animation:kn-d2-bob 1.72s ease-in-out infinite}
.playing.dance-2 .kn-rock{animation:kn-d2-head 1.72s ease-in-out infinite}
.playing.dance-2 .kn-t{animation:kn-d2-tail 1.72s ease-in-out infinite;animation-delay:calc(var(--n)*-.05s - .18s)}
.playing.dance-2 .kn-bachi{animation:kn-strum .43s cubic-bezier(.2,.9,.3,1) infinite}
@keyframes kn-d2-bob{0%,100%{transform:translateX(-5px) rotate(-5deg)}50%{transform:translateX(5px) rotate(5deg)}}
@keyframes kn-d2-head{0%,100%{transform:rotate(6deg)}50%{transform:rotate(-6deg)}}
@keyframes kn-d2-tail{0%,100%{transform:rotate(8deg)}50%{transform:rotate(-8deg)}}
/* 3 · a bouncy hop, the tails waving one after another, ears flopping */
.playing.dance-3 .kn-bob{animation:kn-d3-hop .86s ease-in-out infinite}
.playing.dance-3 .kn-rock{animation:kn-d3-head .86s ease-in-out infinite}
.playing.dance-3 .kn-t{animation:kn-d3-tail .86s ease-in-out infinite;animation-delay:calc(var(--n)*-.09s)}
.playing.dance-3 .kn-earR,.playing.dance-3 .kn-earL{animation:kn-d3-ear .86s ease-in-out infinite}
@keyframes kn-d3-hop{0%,100%{transform:translateY(0) scale(1.06,.92)}45%{transform:translateY(-9px) scale(.97,1.04)}}
@keyframes kn-d3-head{0%,100%{transform:translateY(1px) scale(1,.97)}45%{transform:translateY(-1.5px) scale(1,1.03)}}
@keyframes kn-d3-tail{0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(9deg) translateY(2px)}}
@keyframes kn-d3-ear{0%,100%{transform:rotate(calc(var(--e)*-6deg))}45%{transform:rotate(calc(var(--e)*10deg))}}
/* now and then: a big ear flick and the tails curl outward */
.fidget .kn-earR{animation:kn-bigflick 2.4s ease-in-out}
.fidget .kn-earL{animation:kn-bigflick 2.4s ease-in-out;animation-delay:.25s}
.fidget .kn-t{animation:kn-curl 2.2s ease-in-out;animation-delay:calc(var(--k)*.05s)}
@keyframes kn-bigflick{0%,100%{transform:rotate(0)}18%{transform:rotate(calc(var(--e)*-30deg))}32%{transform:rotate(calc(var(--e)*9deg))}44%{transform:rotate(calc(var(--e)*-22deg))}60%{transform:rotate(0)}}
@keyframes kn-curl{0%,100%{transform:rotate(0)}30%,55%{transform:rotate(calc(var(--o)*8deg))}42%{transform:rotate(calc(var(--o)*6deg))}}
/* paused a long while: eyes shut, ears back, tails drooping inward, fire almost out */
.sleepy .kn-open{opacity:0}.sleepy .kn-closed{opacity:1}
.sleepy .kn-rock{transform:rotate(4deg) translateY(1.5px);transition:transform 1.2s ease-in-out}
.sleepy .kn-earR,.sleepy .kn-earL{animation:none;transform:rotate(calc(var(--e)*22deg));transition:transform 1s ease-in-out}
.sleepy .kn-t{animation:none;transform:rotate(calc(var(--o)*-10deg)) scale(.96);transition:transform 1.4s ease-in-out}
.sleepy .kn-fire{transform:translateY(5px) scale(.45);opacity:.2}
/* ── the acts: each starts and ends at the rest pose, transform and opacity only ── */
${A('wave',{'.kn-armR':'kn-a-wave 1.6s ease-in-out','.kn-rock':'kn-a-wave-head 1.6s ease-in-out','.kn-t':'kn-a-wave-tail 1.4s ease-in-out calc(var(--k)*.05s)'})}
@keyframes kn-a-wave{0%,100%{transform:translate(0,0) rotate(0)}16%{transform:translate(2px,-5px) rotate(-34deg)}30%{transform:translate(2px,-5px) rotate(16deg)}44%{transform:translate(2px,-5px) rotate(-34deg)}58%{transform:translate(2px,-5px) rotate(16deg)}72%{transform:translate(2px,-5px) rotate(-28deg)}}
@keyframes kn-a-wave-head{0%,100%{transform:rotate(0)}22%,70%{transform:rotate(6deg)}}
@keyframes kn-a-wave-tail{0%,100%{transform:rotate(0)}30%{transform:rotate(calc(var(--o)*7deg))}62%{transform:rotate(calc(var(--o)*-3deg))}}
${A('look',{'.kn-rock':'kn-a-look 2.4s ease-in-out','.kn-gaze':'kn-a-look-eye 2.4s ease-in-out','.kn-t':'kn-a-look-tail 2.2s ease-in-out calc(var(--k)*.04s)'})}
@keyframes kn-a-look{0%,100%{transform:translateX(0) rotate(0)}18%,38%{transform:translateX(-3px) rotate(-5deg)}60%,80%{transform:translateX(3px) rotate(5deg)}}
@keyframes kn-a-look-eye{0%,100%{transform:translate(0,0)}14%,40%{transform:translate(-2.6px,.3px)}56%,82%{transform:translate(2.6px,.3px)}}
@keyframes kn-a-look-tail{0%,100%{transform:rotate(0)}24%,42%{transform:rotate(3deg)}64%,84%{transform:rotate(-3deg)}}
${A('stretch',{'.kn-bob':'kn-a-stretch 2.2s ease-in-out','.kn-rock':'kn-a-stretch-head 2.2s ease-in-out','.kn-armR':'kn-a-stretch-armR 2.2s ease-in-out','.kn-armL':'kn-a-stretch-armL 2.2s ease-in-out','.kn-t':'kn-a-stretch-tail 2s ease-in-out calc(var(--k)*.05s)','.kn-blink':'kn-a-squeeze 2.2s ease-in-out'})}
@keyframes kn-a-stretch{0%,100%{transform:scale(1,1)}15%{transform:scale(1.06,.94)}45%,65%{transform:scale(.95,1.1)}85%{transform:scale(1.02,.98)}}
@keyframes kn-a-stretch-head{0%,100%{transform:translateY(0) rotate(0)}45%,65%{transform:translateY(-3px) rotate(-3deg)}}
@keyframes kn-a-stretch-armR{0%,100%{transform:rotate(0)}45%,65%{transform:rotate(50deg)}}
@keyframes kn-a-stretch-armL{0%,100%{transform:rotate(0)}45%,65%{transform:rotate(28deg)}}
@keyframes kn-a-stretch-tail{0%,100%{transform:rotate(0) scale(1)}45%,65%{transform:rotate(calc(var(--o)*9deg)) scale(1.05)}}
@keyframes kn-a-squeeze{0%,100%{transform:scaleY(1)}40%,70%{transform:scaleY(3.8)}}
${A('yawn',{'.kn-rock':'kn-a-yawn-head 2.4s ease-in-out','.kn-mouthO':'kn-a-yawn-mouth 2.4s ease-in-out','.kn-blink':'kn-a-yawn-eye 2.4s ease-in-out','.kn-earR, .act-yawn .pk-body .kn-earL':'kn-a-yawn-ear 2.4s ease-in-out','.kn-bob':'kn-a-yawn-body 2.4s ease-in-out'})}
@keyframes kn-a-yawn-head{0%,100%{transform:translateY(0) rotate(0)}30%,60%{transform:translateY(-2px) rotate(-4deg)}80%{transform:translateY(1px) rotate(1deg)}}
@keyframes kn-a-yawn-mouth{0%,12%,100%{transform:scale(.2,.1);opacity:0}30%,60%{transform:scale(1,1.3);opacity:1}76%{transform:scale(.4,.2);opacity:0}}
@keyframes kn-a-yawn-eye{0%,100%{transform:scaleY(1)}30%,62%{transform:scaleY(3.8)}}
@keyframes kn-a-yawn-ear{0%,100%{transform:rotate(0)}30%,60%{transform:rotate(calc(var(--e)*18deg))}}
@keyframes kn-a-yawn-body{0%,100%{transform:scale(1,1)}30%,60%{transform:scale(1.03,1.04)}}
${A('shake',{'.kn-rock':'kn-a-shake-head 1.2s ease-in-out','.kn-bob':'kn-a-shake-body 1.2s ease-in-out','.kn-t':'kn-a-shake-tail 1s ease-in-out calc(var(--k)*.05s)','.kn-earR, .act-shake .pk-body .kn-earL':'kn-a-shake-ear 1.2s ease-in-out'})}
@keyframes kn-a-shake-head{0%,100%{transform:rotate(0)}15%{transform:rotate(-10deg)}30%{transform:rotate(10deg)}45%{transform:rotate(-9deg)}60%{transform:rotate(8deg)}75%{transform:rotate(-5deg)}88%{transform:rotate(2deg)}}
@keyframes kn-a-shake-body{0%,100%{transform:scale(1,1)}15%{transform:scale(1.05,.97)}30%{transform:scale(.96,1.04)}45%{transform:scale(1.05,.97)}60%{transform:scale(.97,1.03)}80%{transform:scale(1.01,.99)}}
@keyframes kn-a-shake-tail{0%,100%{transform:rotate(0)}20%{transform:rotate(-9deg)}40%{transform:rotate(9deg)}60%{transform:rotate(-7deg)}80%{transform:rotate(4deg)}}
@keyframes kn-a-shake-ear{0%,100%{transform:rotate(0)}15%{transform:rotate(14deg)}30%{transform:rotate(-14deg)}45%{transform:rotate(12deg)}60%{transform:rotate(-10deg)}80%{transform:rotate(4deg)}}
${A('tilt',{'.kn-rock':'kn-a-tilt 1.4s ease-in-out','.kn-earL':'kn-a-tilt-ear 1.4s ease-in-out','.kn-t':'kn-a-tilt-tail 1.3s ease-in-out calc(var(--k)*.025s)'})}
@keyframes kn-a-tilt{0%,100%{transform:rotate(0)}25%,70%{transform:rotate(14deg)}}
@keyframes kn-a-tilt-ear{0%,30%,60%,100%{transform:rotate(0)}38%{transform:rotate(20deg)}48%{transform:rotate(-8deg)}}
@keyframes kn-a-tilt-tail{0%,100%{transform:rotate(0)}35%,70%{transform:rotate(-4deg)}}
${A('skip',{'.kn-bob':'kn-a-skip 1s ease-in-out','.kn-rock':'kn-a-skip-head 1s ease-in-out','.kn-t':'kn-a-skip-tail .85s cubic-bezier(.4,0,.2,1) calc(var(--n)*.016s)'})}
@keyframes kn-a-skip{0%,100%{transform:translateX(0) scale(1,1) rotate(0)}20%{transform:translateX(-4px) scale(1.05,.95) rotate(-5deg)}50%{transform:translateX(5px) scale(.96,1.05) rotate(6deg)}75%{transform:translateX(-1px) scale(1.02,.98) rotate(-2deg)}}
@keyframes kn-a-skip-head{0%,100%{transform:rotate(0)}25%{transform:rotate(-8deg)}55%{transform:rotate(8deg)}80%{transform:rotate(-2deg)}}
@keyframes kn-a-skip-tail{0%,100%{transform:rotate(0)}30%{transform:rotate(-22deg)}65%{transform:rotate(14deg)}85%{transform:rotate(-4deg)}}
${A('pause',{'.kn-bob':'kn-a-pause 1s ease-in-out','.kn-earR, .act-pause .pk-body .kn-earL':'kn-a-ears-up 1s ease-in-out','.kn-mouthO':'kn-a-pause-mouth 1s ease-in-out','.kn-gaze':'kn-a-wide 1s ease-in-out','.kn-t':'kn-a-pause-tail .9s ease-in-out calc(var(--k)*.02s)'})}
@keyframes kn-a-pause{0%,100%{transform:translateY(0) scale(1,1)}15%{transform:translateY(0) scale(1.05,.95)}35%,65%{transform:translateY(-2px) scale(.97,1.04)}}
@keyframes kn-a-ears-up{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(calc(var(--e)*-12deg))}}
@keyframes kn-a-pause-mouth{0%,100%{transform:scale(.3,.3);opacity:0}30%,70%{transform:scale(.7,.8);opacity:1}}
@keyframes kn-a-wide{0%,100%{transform:scale(1)}30%,70%{transform:scale(1.18)}}
@keyframes kn-a-pause-tail{0%,100%{transform:rotate(0)}30%,70%{transform:rotate(calc(var(--o)*5deg))}}
${A('talk',{'.kn-bob':'kn-a-talk 1.4s ease-in-out','.kn-mouthO':'kn-a-talk-mouth 1.4s ease-in-out','.kn-rock':'kn-a-talk-head 1.4s ease-in-out'})}
@keyframes kn-a-talk{0%,100%{transform:translateY(0) scale(1,1)}20%,60%{transform:translateY(-1.5px) scale(.99,1.02)}40%,80%{transform:translateY(.5px) scale(1.02,.98)}}
@keyframes kn-a-talk-mouth{0%,100%{transform:scale(.6,.1);opacity:0}10%,30%,52%,74%{transform:scale(1,1);opacity:1}20%,42%,64%{transform:scale(.9,.25);opacity:1}88%{transform:scale(.6,.1);opacity:0}}
@keyframes kn-a-talk-head{0%,100%{transform:rotate(0)}25%{transform:rotate(2deg)}55%{transform:rotate(-2deg)}80%{transform:rotate(1deg)}}
${A('nod',{'.kn-rock':'kn-a-nod 1s ease-in-out','.kn-earR, .act-nod .pk-body .kn-earL':'kn-a-nod-ear 1s ease-in-out','.kn-bob':'kn-a-nod-body 1s ease-in-out'})}
@keyframes kn-a-nod{0%,100%{transform:translateY(0) scale(1,1)}22%{transform:translateY(4px) scale(1.03,.95)}45%{transform:translateY(-1px) scale(.99,1.02)}68%{transform:translateY(4px) scale(1.03,.95)}88%{transform:translateY(-.5px) scale(1,1.01)}}
@keyframes kn-a-nod-ear{0%,100%{transform:rotate(0)}30%,76%{transform:rotate(calc(var(--e)*9deg))}52%{transform:rotate(calc(var(--e)*-3deg))}}
@keyframes kn-a-nod-body{0%,100%{transform:scale(1,1)}22%,68%{transform:scale(1.01,.985)}}
${A('startle',{'.kn-bob':'kn-a-startle .9s ease-in-out','.kn-earR, .act-startle .pk-body .kn-earL':'kn-a-startle-ear .9s ease-in-out','.kn-gaze':'kn-a-wide .9s ease-in-out','.kn-t':'kn-a-startle-tail .8s ease-in-out calc(var(--k)*.02s)','.kn-rock':'kn-a-startle-head .9s ease-in-out'})}
@keyframes kn-a-startle{0%,100%{transform:translateY(0) scale(1,1)}12%{transform:translateY(0) scale(1.1,.88)}38%{transform:translateY(-16px) scale(.92,1.1)}66%{transform:translateY(0) scale(1.08,.92)}84%{transform:translateY(0) scale(.98,1.02)}}
@keyframes kn-a-startle-ear{0%,100%{transform:rotate(0)}20%,70%{transform:rotate(calc(var(--e)*-16deg))}}
@keyframes kn-a-startle-tail{0%,100%{transform:rotate(0) scale(1)}25%,60%{transform:rotate(calc(var(--o)*14deg)) scale(1.08)}}
@keyframes kn-a-startle-head{0%,100%{transform:translateY(0)}20%,60%{transform:translateY(-2px)}}
${A('special',{'.kn-t':'kn-a-special-tail 2.2s cubic-bezier(.4,0,.2,1) calc(var(--k)*.12s)','.kn-tm':'kn-a-special-mid 2.2s cubic-bezier(.4,0,.2,1)','.kn-bob':'kn-a-special-body 2.8s ease-in-out','.kn-rock':'kn-a-special-head 2.8s ease-in-out'})}
.act-special .kn-orbit{animation:kn-a-orbit 2.8s cubic-bezier(.45,0,.3,1)}
@keyframes kn-a-special-tail{0%,100%{transform:rotate(0) scale(1)}18%{transform:rotate(calc(var(--o)*-22deg)) scale(.92)}48%{transform:rotate(calc(var(--o)*16deg)) scale(1.1)}66%{transform:rotate(calc(var(--o)*7deg)) scale(1.06)}}
@keyframes kn-a-special-mid{0%,100%{transform:scale(1)}18%{transform:scale(.9)}48%{transform:scale(1.12)}66%{transform:scale(1.06)}}
@keyframes kn-a-special-body{0%,100%{transform:translateY(0) scale(1,1)}20%{transform:translateY(0) scale(1.04,.96)}50%,70%{transform:translateY(-2px) scale(.98,1.04)}}
@keyframes kn-a-special-head{0%,100%{transform:translateY(0) rotate(0)}50%,70%{transform:translateY(-2px) rotate(-3deg)}}
@keyframes kn-a-orbit{0%{transform:rotate(0) scale(1)}20%{transform:rotate(60deg) scale(.78)}80%{transform:rotate(300deg) scale(.78)}100%{transform:rotate(360deg) scale(1)}}
${A('bow',{'.kn-rock':'kn-a-bow 1.4s ease-in-out','.kn-bob':'kn-a-bow-body 1.4s ease-in-out','.kn-earR, .act-bow .pk-body .kn-earL':'kn-a-bow-ear 1.4s ease-in-out','.kn-blink':'kn-a-bow-eye 1.4s ease-in-out','.kn-t':'kn-a-bow-tail 1.3s ease-in-out calc(var(--k)*.025s)'})}
@keyframes kn-a-bow{0%,100%{transform:translateY(0) scale(1,1)}30%,65%{transform:translateY(7px) scale(1.04,.9)}}
@keyframes kn-a-bow-body{0%,100%{transform:scale(1,1)}30%,65%{transform:scale(1.03,.95)}}
@keyframes kn-a-bow-ear{0%,100%{transform:rotate(0)}30%,65%{transform:rotate(calc(var(--e)*10deg))}}
@keyframes kn-a-bow-eye{0%,100%{transform:scaleY(1)}30%,65%{transform:scaleY(3.8)}}
@keyframes kn-a-bow-tail{0%,100%{transform:rotate(0) scale(1)}35%,65%{transform:rotate(calc(var(--o)*-6deg)) scale(1.04)}}`});
})();
