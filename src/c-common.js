/* ================= Gemensamma övningsbyggstenar ================= */
const forest=['apple','acorn','leaf','mushroom','ladybug','flower','pinecone','blueberry','strawberry','fish','bird','egg'];
const selOk=(inner,cls,ok)=>sel(inner,cls).replace('class="sel',`${ok?'data-ok="1" ':''}class="sel`);
function tenFrame(n,w=30,icon='acorn'){let s=`<svg viewBox="0 0 52 22" style="width:${w}cqw" class="ic" aria-hidden="true"><rect x=".6" y=".6" width="50.8" height="20.8" rx="3" fill="#fff" stroke="var(--rule-2)" stroke-width=".8"/>`;
 for(let i=1;i<5;i++)s+=`<line x1="${.6+i*10.16}" y1=".6" x2="${.6+i*10.16}" y2="21.4" stroke="var(--rule)" stroke-width=".6"/>`;s+=`<line x1=".6" y1="11" x2="51.4" y2="11" stroke="var(--rule)" stroke-width=".6"/>`;
 for(let i=0;i<n;i++){const x=(i%5)*10.16+1.4,y=Math.floor(i/5)*10.4+1.2;s+=artIn(icon,x,y,8.6)}return s+'</svg>'}
function dotsPuzzle(points,deco=''){const cx=points.reduce((a,p)=>a+p[0],0)/points.length,cy=points.reduce((a,p)=>a+p[1],0)/points.length;let s=`<svg viewBox="0 0 100 100" class="svgw" aria-hidden="true">${deco}`;
 /* siffran placeras där den hamnar längst från alla andra prickar och linjer, så att det aldrig är oklart vilken prick den hör till */
 const N=points.length,un=(x,y)=>{const d=Math.hypot(x,y)||1;return [x/d,y/d]};
 const segD=(px,py,a,b)=>{const vx=b[0]-a[0],vy=b[1]-a[1],t=Math.max(0,Math.min(1,((px-a[0])*vx+(py-a[1])*vy)/((vx*vx+vy*vy)||1)));return Math.hypot(px-a[0]-t*vx,py-a[1]-t*vy)};
 const placed=[];points.forEach((p,i)=>{const a=points[(i-1+N)%N],b=points[(i+1)%N],u=un(a[0]-p[0],a[1]-p[1]),v=un(b[0]-p[0],b[1]-p[1]),pref=un(-(u[0]+v[0]),-(u[1]+v[1]));let best=null;
  for(let k=0;k<16;k++){const ang=k*Math.PI/8,ddx=Math.cos(ang),ddy=Math.sin(ang),lx=p[0]+ddx*5.6,ly=p[1]+ddy*5.6;if(lx<3||lx>97||ly<4||ly>97)continue;
   let m=99;points.forEach((q,j)=>{if(j!==i)m=Math.min(m,Math.hypot(lx-q[0],ly-q[1]))});for(let j=0;j<N;j++)m=Math.min(m,segD(lx,ly,points[j],points[(j+1)%N])+1.2);
   placed.forEach(q=>{m=Math.min(m,Math.hypot(lx-q[0],ly-q[1])*.8)});const sc=Math.min(m,9)+(ddx*pref[0]+ddy*pref[1])*.8;if(!best||sc>best[0])best=[sc,ddx,ddy]}
  let dx=best[1]*5.6,dy=best[2]*5.6;placed.push([p[0]+dx,p[1]+dy]);s+=`<circle cx="${p[0]}" cy="${p[1]}" r="1.35" fill="${i===0?'#4E9A5A':'var(--ink)'}"/><text x="${(p[0]+dx).toFixed(1)}" y="${(p[1]+dy+1.4).toFixed(1)}" font-size="3.9" text-anchor="middle" fill="var(--ink)" font-family="Andika,sans-serif">${i+1}</text>`});return s+'</svg>'}
function numberLine(max=20,{h=30}={}){let s=`<svg viewBox="0 0 212 ${h}" class="svgw" aria-hidden="true"><line x1="6" y1="${h-12}" x2="206" y2="${h-12}" stroke="var(--ink-soft)" stroke-width="1.1" stroke-linecap="round"/>`;
 const lab=max<=20?1:max<=30?5:10,tick=max<=50?1:5;
 for(let i=0;i<=max;i+=tick){const x=6+i*200/max,big=max<=10||i%5===0,L=i%lab===0;s+=`<line x1="${x}" y1="${h-(big?17:15)}" x2="${x}" y2="${h-(big?7:9)}" stroke="var(--ink-soft)" stroke-width="${big?1.1:.7}" stroke-linecap="round"/>`+(L?`<text x="${x}" y="${h-.5}" font-size="${max<=10?6:max<=20?(i%5?4.4:5.2):5.4}" text-anchor="middle" fill="var(--ink)" font-family="Andika,sans-serif" font-weight="${i%5?400:700}">${i}</text>`:'')}return s+'</svg>'}
const SH={cirkel:c=>`<circle cx="50" cy="50" r="36" fill="${c}"/>`,kvadrat:c=>`<rect x="16" y="16" width="68" height="68" rx="6" fill="${c}"/>`,triangel:c=>`<path d="M50 13 L88 82 H12Z" fill="${c}" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>`,rektangel:c=>`<rect x="8" y="28" width="84" height="44" rx="6" fill="${c}"/>`,stjarna:c=>`<path d="M50 11 L60.6 35.4 L87 37.7 L67 55.2 L72.9 81 L50 67.4 L27.1 81 L33 55.2 L13 37.7 L39.4 35.4Z" fill="${c}" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>`,hjarta:c=>`<path d="M50 86 C30 72 12 58 12 38 C12 24 22 15 33 15 C41 15 47 20 50 27 C53 20 59 15 67 15 C78 15 88 24 88 38 C88 58 70 72 50 86Z" fill="${c}"/>`,oval:c=>`<ellipse cx="50" cy="50" rx="40" ry="26" fill="${c}"/>`};
const SHL={cirkel:c=>`<circle cx="50" cy="50" r="36" fill="#fff" stroke="${c}" stroke-width="4"/>`,kvadrat:c=>`<rect x="16" y="16" width="68" height="68" rx="6" fill="#fff" stroke="${c}" stroke-width="4"/>`,triangel:c=>`<path d="M50 13 L88 82 H12Z" fill="#fff" stroke="${c}" stroke-width="4" stroke-linejoin="round"/>`,rektangel:c=>`<rect x="8" y="28" width="84" height="44" rx="6" fill="#fff" stroke="${c}" stroke-width="4"/>`};
const SHPATH={cirkel:'M50 14 A36 36 0 1 1 49.9 14',kvadrat:'M16 16 L84 16 L84 84 L16 84 Z',triangel:'M50 13 L88 82 L12 82 Z',rektangel:'M8 28 L92 28 L92 72 L8 72 Z',stjarna:'M50 11 L60.6 35.4 L87 37.7 L67 55.2 L72.9 81 L50 67.4 L27.1 81 L33 55.2 L13 37.7 L39.4 35.4 Z',hjarta:'M50 27 C53 20 59 15 67 15 C78 15 88 24 88 38 C88 58 70 72 50 86 C30 72 12 58 12 38 C12 24 22 15 33 15 C41 15 47 20 50 27'};
const SHSTART={cirkel:[50,14],kvadrat:[16,16],triangel:[50,13],rektangel:[8,28],stjarna:[50,11],hjarta:[50,27]};
const sh=(t,c,w=8)=>`<svg class="ic" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true">${SH[t](c)}</svg>`;
const shIn=(t,c,x,y,s)=>`<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100">${SH[t](c)}</svg>`;
const shTrace=(t,w=22)=>`<svg class="ic" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true"><path d="${SHPATH[t]}" fill="none" stroke="var(--dots)" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0 7"/><circle cx="${SHSTART[t][0]}" cy="${SHSTART[t][1]}" r="3.6" fill="#4E9A5A"/></svg>`;
const slot=(w=8)=>`<svg class="ic" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true"><circle cx="50" cy="50" r="38" fill="#fff" stroke="var(--rule-2)" stroke-width="3" stroke-dasharray="7 7"/></svg>`;
const SC={b:'var(--a-blue)',r:'var(--a-lingon)',y:'var(--a-sun)',g:'var(--a-moss)',p:'var(--a-rose)',o:'var(--a-kant)'};
const outlineArt=(n,w)=>`<svg class="ic outline" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true">${artFlat(n)}</svg>`;
/* tryck för att färglägga: konturbild som blir färgad */
const paint=(n,w)=>sel(`<span class="pv off">${outlineArt(n,w)}</span><span class="pv on">${art(n,w)}</span>`,'paint');
/* lästal: enheten skrivs efter svarsrutan (tas ur frågan: "Hur många äpplen …" → äpplen, km, kr) så att barnet bara skriver talet */
const qUnit=q=>{const m=q.match(/Hur många (?:olika )?([a-zåäö]+)/i);const verb=new Set(['har','är','blir','får','kan','fanns','finns','ska','var','behöver','äter','ser','hittar','gånger','blommar','flyger','simmar','sover']);if(m&&!verb.has(m[1].toLowerCase()))return m[1];if(/\bkm\b/.test(q))return 'km';if(/\bkr\b|kronor/.test(q))return 'kr';return ''};
const qBlock=(q,ans,unit,icon)=>{const u=unit===undefined||unit===null?qUnit(q):unit;return `<div class="tray" style="align-items:stretch;gap:3cqw"><div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;gap:1.4cqw"><p class="p" style="font-size:3.4cqw;line-height:1.4">${icon?`<span style="float:left;margin:0 2cqw .6cqw 0;display:flex;gap:.6cqw">${(Array.isArray(icon)?icon:[icon]).map(n=>artFit(n,11,10,true)).join('')}</span>`:''}${q}</p><span class="eq s">Svar: ${box(ans,String(ans).length>2?'s wide3':'s')}${u?` ${u}`:''}</span></div><div class="draw" style="flex:none;width:28cqw;min-height:17cqw"><span class="lab">Rita här</span></div></div>`};
const dot='<span class="mdot"></span>';
/* två kolumner att dra streck mellan */
/* dra streck: vänster i ska till höger ans[i]. keys:[L,R] räknar fram ans ur listorna som korten byggs av */
const mcSame=(l,r)=>l===r||(Array.isArray(l)&&(l[1]===r||(Array.isArray(r)&&r[0]===l[0])))||(typeof l==='string'&&typeof r==='string'&&l.toLowerCase()===r)||(typeof l==='number'&&r===l);
function matchCols(left,right,{gap=24,keys=null,ans=null}={}){const n=Math.max(left.length,right.length);if(!ans&&keys){ans=keys[0].map(l=>{let j=keys[1].indexOf(l);if(j<0)j=keys[1].findIndex(r=>mcSame(l,r));if(j<0&&Array.isArray(l))j=keys[1].indexOf(l[0]);return j})}
 let s=`<div class="tray match" ${ans&&ans.every(x=>x>=0)?`data-ans="${ans.join(',')}"`:''} style="flex:1;grid-template-columns:auto auto ${gap}cqw auto auto">`;
 for(let i=0;i<n;i++)s+=`<div class="mc-l">${left[i]||''}</div>${left[i]?`<span class="mdot" data-ml="${i}"></span>`:'<span></span>'}<span></span>${right[i]?`<span class="mdot" data-mr="${i}"></span>`:'<span></span>'}<div class="mc-r">${right[i]||''}</div>`;return s+'</div>'}
/* blanda så att inget hamnar på samma plats (streckpar ska aldrig stå rakt mittemot) */
function derange(arr,seed=1){const r=rng(seed);for(let k=0;k<80;k++){const d=shuffle(r,arr);if(d.every((x,i)=>x!==arr[i]))return d}return arr.slice(1).concat(arr.slice(0,1))}
/* memory: par av kort (t.ex. bild + ord). I appen ligger korten med baksidan upp, på papper klipper man ut dem. */
function memoGrid(pairs,seed,cols=4){const cards=[];pairs.forEach(([a,b],i)=>{cards.push([a,i]);cards.push([b,i])});const sh=shuffle(rng(seed),cards);
 return `<div class="memogrid" style="grid-template-columns:repeat(${cols},minmax(0,1fr))">${sh.map(([f,i])=>selOk(`<span class="mf">${f}</span>`,'memo',true).replace('class="sel',`data-pair="${i}" class="sel`)).join('')}</div>`}
/* berättelsescen (icon_sc_*): beskärs till bilden och fyller sin behållare */
const scene=(n,w)=>{const b=ICONBOX[n]||[0,0,100,100];return `<svg class="ic scene" viewBox="${b.join(' ')}" style="width:${w?w+'cqw':'100%'};height:auto;display:block" aria-hidden="true">${ART[n]}</svg>`};
/* dela lika: en hög med exakt n saker, och tomma platser i varje korg som fylls när man trycker */
const pile=(icon,n,s,cols)=>`<div style="display:grid;grid-template-columns:repeat(${cols},${s+.4}cqw);gap:.3cqw;justify-items:center">${rep(n,()=>art(icon,s))}</div>`;
const slots=(icon,need,extra,s,cols)=>`<div data-need="${need}" style="display:grid;grid-template-columns:repeat(${cols},${s+1}cqw);gap:.6cqw;justify-items:center">${rep(need+extra,()=>sel(`<span class="sl">${art(icon,s)}</span>`,'pick slot'))}</div>`;
/* tryckpunkt på en scenbild: x, y och bredd w i procent av själva bilden (ICONBOX har 2 enheters marginal runt bilden) */
const hotspot=(n,x,y,w,ok)=>{const b=ICONBOX[n]||[0,0,100,100],iL=b[0]>0?b[0]+2:0,iW=b[0]>0?b[2]-4:b[2],iT=b[1]+2,iH=b[3]-4;const X=(iL+x/100*iW-b[0])/b[2]*100,Y=(iT+y/100*iH-b[1])/b[3]*100,Wd=w/100*iW/b[2]*100,Hd=Wd*b[2]/b[3];
 return `<span class="scn-it" style="left:${(X-Wd/2).toFixed(2)}%;top:${(Y-Hd/2).toFixed(2)}%;width:${Wd.toFixed(2)}%">${selOk('<span class="hot"></span>','pick hotspot',!!ok)}</span>`};
/* välj rätt: rad med alternativ där ett är rätt */
const choice=(items,ok,cls='pick')=>items.map((x,i)=>selOk(x,cls,i===ok)).join('');
function dice(n,w=9){const P={1:[[50,50]],2:[[30,30],[70,70]],3:[[28,28],[50,50],[72,72]],4:[[30,30],[70,30],[30,70],[70,70]],5:[[28,28],[72,28],[50,50],[28,72],[72,72]],6:[[30,26],[70,26],[30,50],[70,50],[30,74],[70,74]]}[n];/* tärningen ritas mjukt skuggad (som 3D-ikonerna), utan gradient-id: de fungerar inte i dolda sidor */
 return `<svg class="ic" viewBox="0 0 100 100" style="width:${w}cqw;height:${w}cqw" aria-hidden="true"><rect x="9" y="11" width="86" height="86" rx="22" fill="#5A4A35" opacity=".16"/><rect x="7" y="7" width="86" height="86" rx="22" fill="#D6C9AF"/><rect x="7" y="5" width="86" height="82" rx="22" fill="#F6F0E2"/><ellipse cx="36" cy="26" rx="26" ry="16" fill="#fff" opacity=".55"/>${P.map(([x,y])=>`<circle cx="${x}" cy="${y-1.5}" r="9" fill="#2A221C"/><circle cx="${x-2.6}" cy="${y-4.2}" r="2.4" fill="#fff" opacity=".35"/>`).join('')}</svg>`}
function domino(a,b,w=24){/* 3D-bricka (icon_domino_blank) rakt uppifrån; prickarna läggs på i kod så antalet alltid stämmer */const half=(n,ox)=>{const P={0:[],1:[[25,25]],2:[[14,14],[36,36]],3:[[13,13],[25,25],[37,37]],4:[[14,14],[36,14],[14,36],[36,36]],5:[[13,13],[37,13],[25,25],[13,37],[37,37]],6:[[14,11],[36,11],[14,25],[36,25],[14,39],[36,39]]}[n];return P.map(([x,y])=>{const cx=ox+x*.92,cy=26+2+y*.88;return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="4" fill="#2A2522"/><circle cx="${(cx+.7).toFixed(1)}" cy="${(cy+.8).toFixed(1)}" r="2.6" fill="#4A403A" opacity=".55"/>`}).join('')};return `<svg class="ic" viewBox="0 26 100 48" style="width:${w}cqw" aria-hidden="true"><use href="#ii-domino_blank"/>${half(a,3)}${half(b,53.5)}</svg>`}
function scaleSvg(l,r,w=34){/* l tyngre => vänster ner */const t=l==='='?0:(l?8:-8);return `<svg class="ic" viewBox="0 0 120 80" style="width:${w}cqw" aria-hidden="true"><path d="M60 74 L60 22" stroke="var(--a-bark)" stroke-width="3"/><path d="M44 76 L76 76" stroke="var(--a-bark)" stroke-width="4" stroke-linecap="round"/><g transform="rotate(${-t} 60 22)"><path d="M14 22 L106 22" stroke="var(--a-bark2)" stroke-width="3" stroke-linecap="round"/><path d="M14 22 L6 40 L22 40Z M106 22 L98 40 L114 40Z" fill="none" stroke="var(--a-bark2)" stroke-width="1.2"/><path d="M2 40 L26 40 C24 46 4 46 2 40Z M94 40 L118 40 C116 46 96 46 94 40Z" fill="var(--a-grey)"/></g><circle cx="60" cy="22" r="3.4" fill="var(--a-bark2)"/></svg>`}
function glassSvg(level,w=10,juice=''){const b=typeof ICONBOX!=='undefined'&&ICONBOX.glass_e;if(b&&ART.glass_e&&ART.glass_e.startsWith('<use')){const[x,y0,bw,bh]=b,T=10.5,B=74.4,yy=B-level*(B-T-3),L=v=>20.3+(v-10)*5/64.4,R=v=>79.7-(v-10)*5/64.4,c=juice==='red'?'#B9493B':'#7FA7C7',c2=juice==='red'?'#D9705F':'#A9C6DD';
  /* 3D-glas (Recraft) med saften ritad i glaset, så att nivån alltid stämmer */
  return `<svg class="ic" viewBox="${x} ${y0} ${bw} ${bh}" style="width:${w}cqw;height:${(w*bh/bw).toFixed(2)}cqw" aria-hidden="true">${ART.glass_e}<path d="M${L(yy)+.6} ${yy} L${R(yy)-.6} ${yy} L${R(B)-1} ${B-.6} Q50 ${B+1.2} ${L(B)+1} ${B-.6}Z" fill="${c}" opacity=".86"/><ellipse cx="50" cy="${yy}" rx="${(R(yy)-L(yy))/2-.8}" ry="1.8" fill="${c2}" opacity=".9"/><rect x="${L(yy)+3}" y="${yy+3}" width="2.4" height="${Math.max(0,B-yy-8)}" rx="1.2" fill="#fff" opacity=".28"/></svg>`}
 const y=82-level*62;return `<svg class="ic" viewBox="0 0 60 90" style="width:${w}cqw;height:${w*1.5}cqw" aria-hidden="true"><path d="M8 12 L14 84 L46 84 L52 12" fill="#fff" stroke="var(--rule-2)" stroke-width="2.4" stroke-linejoin="round"/><path d="M${8+(y-12)*6/72+.8} ${y} L${52-(y-12)*6/72-.8} ${y} L45.4 82.6 L14.6 82.6Z" fill="${juice==='red'?'#C9604F':'var(--a-bluel)'}"/></svg>`}
function bundle(tens,ones,w=60){let s=`<svg class="ic" viewBox="0 0 ${tens*22+ones*7+10} 60" style="width:${Math.min(w,(tens*22+ones*7+10)*.42)}cqw" aria-hidden="true">`;for(let t=0;t<tens;t++){const x=6+t*22;for(let i=0;i<10;i++)s+=`<rect x="${x+i*1.6}" y="6" width="1.4" height="48" rx=".7" fill="var(--a-nut)"/>`;s+=`<rect x="${x-1}" y="26" width="18" height="5" rx="1.4" fill="var(--a-lingon)"/>`}for(let i=0;i<ones;i++)s+=`<rect x="${tens*22+8+i*7}" y="6" width="3" height="48" rx="1.4" fill="var(--a-nut)"/>`;return s+'</svg>'}
const priceTag=p=>`<span class="tag">${p} kr</span>`;
function hundred(start,end,cols=10){let s=`<div class="hgrid" style="grid-template-columns:repeat(${cols},1fr)">`;for(let n=start;n<=end;n++)s+=sel(`<span>${n}</span>`,'hc');return s+'</div>'}
function compass(size=60){return `<svg viewBox="0 0 100 100" style="width:${size}cqw" class="ic" aria-hidden="true"><circle cx="50" cy="50" r="31" fill="var(--tint)"/><circle cx="50" cy="50" r="31" fill="none" stroke="var(--rule-2)" stroke-width=".8"/>${[45,135,225,315].map(a=>`<path d="M50 50 L47.6 50 L50 30 L52.4 50Z" fill="var(--a-cream2)" transform="rotate(${a} 50 50)"/>`).join('')}${[0,90,180,270].map(a=>`<path d="M50 50 L45.5 50 L50 21 L54.5 50Z" fill="${a===0?'var(--a-lingon)':'var(--a-spruce2)'}" transform="rotate(${a} 50 50)"/><path d="M50 50 L50 21 L54.5 50Z" fill="#000" opacity=".15" transform="rotate(${a} 50 50)"/>`).join('')}<circle cx="50" cy="50" r="3.4" fill="#fff"/>${[['N',50,13],['Ö',90,53.5],['S',50,95],['V',10,53.5]].map(([t,x,y])=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="10" font-weight="600" font-family="Fraunces,serif" fill="var(--ink)">${t}</text>`).join('')}</svg>`}
function gridMap(items,{cols=6,rows=6,labels=true}={}){const S=14,O=labels?10:2;let s=`<svg viewBox="0 0 ${cols*S+O+2} ${rows*S+O+2}" class="svgw" aria-hidden="true"><rect x="${O}" y="${O}" width="${cols*S}" height="${rows*S}" rx="2" fill="color-mix(in srgb,var(--a-moss2) 30%,#fff)"/>`;
 for(let x=0;x<=cols;x++)s+=`<line x1="${O+x*S}" y1="${O}" x2="${O+x*S}" y2="${O+rows*S}" stroke="var(--rule-2)" stroke-width=".45"/>`;for(let y=0;y<=rows;y++)s+=`<line x1="${O}" y1="${O+y*S}" x2="${O+cols*S}" y2="${O+y*S}" stroke="var(--rule-2)" stroke-width=".45"/>`;
 if(labels){for(let x=0;x<cols;x++)s+=`<text x="${O+x*S+S/2}" y="${O-3}" font-size="5.5" text-anchor="middle" font-weight="700" font-family="Andika,sans-serif" fill="var(--ink)">${'ABCDEFGH'[x]}</text>`;for(let y=0;y<rows;y++)s+=`<text x="${O-4.5}" y="${O+y*S+S/2+2}" font-size="5.5" text-anchor="middle" font-weight="700" font-family="Andika,sans-serif" fill="var(--ink)">${y+1}</text>`}
 items.forEach(([n,x,y])=>{if(n==='X')s+=`<g stroke="var(--a-lingon)" stroke-width="2.4" stroke-linecap="round"><line x1="${O+x*S+3.5}" y1="${O+y*S+3.5}" x2="${O+x*S+S-3.5}" y2="${O+y*S+S-3.5}"/><line x1="${O+x*S+S-3.5}" y1="${O+y*S+3.5}" x2="${O+x*S+3.5}" y2="${O+y*S+S-3.5}"/></g>`;else s+=artIn(n,O+x*S+1.3,O+y*S+1.3,S-2.6)});return s+'</svg>'}
function maze(seed,C,R,start='acorn',goal='squirrel'){const r=rng(seed),W=Array.from({length:R},()=>Array.from({length:C},()=>({n:1,e:1,s:1,w:1,v:0})));const st=[[0,0]];W[0][0].v=1;
 while(st.length){const [x,y]=st[st.length-1];const nb=[[0,-1,'n','s'],[1,0,'e','w'],[0,1,'s','n'],[-1,0,'w','e']].filter(([dx,dy])=>{const a=x+dx,b=y+dy;return a>=0&&b>=0&&a<C&&b<R&&!W[b][a].v});if(!nb.length){st.pop();continue}const [dx,dy,dd,o]=nb[Math.floor(r()*nb.length)];W[y][x][dd]=0;W[y+dy][x+dx][o]=0;W[y+dy][x+dx].v=1;st.push([x+dx,y+dy])}
 W[0][0].n=0;W[R-1][C-1].s=0;
 const S=10,O=3;let s=`<svg viewBox="0 -14 ${C*S+O*2} ${R*S+O*2+28}" class="svgw maze" aria-hidden="true"><rect x="${O}" y="${O}" width="${C*S}" height="${R*S}" rx="3" fill="var(--tint)"/><g stroke="var(--a-spruce)" stroke-width="1.6" stroke-linecap="round">`;
 for(let y=0;y<R;y++)for(let x=0;x<C;x++){const c=W[y][x],X=O+x*S,Y=O+y*S;if(c.n)s+=`<line x1="${X}" y1="${Y}" x2="${X+S}" y2="${Y}"/>`;if(c.w)s+=`<line x1="${X}" y1="${Y}" x2="${X}" y2="${Y+S}"/>`;if(y===R-1&&c.s)s+=`<line x1="${X}" y1="${Y+S}" x2="${X+S}" y2="${Y+S}"/>`;if(x===C-1&&c.e)s+=`<line x1="${X+S}" y1="${Y}" x2="${X+S}" y2="${Y+S}"/>`}
 return s+'</g>'+artIn(start,O-1,-14,13)+artIn(goal,O+(C-1)*S-3,O+R*S+1,14)+'</svg>'}
/* kartor */
/* crop: visa bara x 10–90 så att Sverige blir större (grannländerna syns ändå i kanterna) */
function sweMap({w=60,cities=[],labels=false,lakes=true,neighbors=true,fillSe='#B9D08E',dotsOnly=false,crop=false,fs=3.4,dotFill=null}={}){const W=SWE.W,H=SWE.H,X0=crop?10:0,VW=crop?80:W;let s=`<svg class="ic" viewBox="${X0} 0 ${VW} ${H}" style="width:${w}cqw;height:${(w*H/VW).toFixed(1)}cqw;overflow:hidden;border-radius:2cqw" aria-hidden="true"><rect width="${W}" height="${H}" rx="3" fill="#D7E8F1"/>`;
 if(neighbors)s+=`<path d="${SWE.no}${SWE.fi}${SWE.dk}${SWE.ee}${SWE.de}${SWE.pl}${SWE.lt}${SWE.lv}${SWE.ru}" fill="#EEE8D8" stroke="#fff" stroke-width=".4"/>`;
 s+=`<path d="${SWE.se}" fill="${fillSe}" stroke="#7E9C5E" stroke-width=".35"/>`;if(lakes)s+=`<path d="${SWE.vanern}${SWE.vattern}${SWE.malaren}" fill="#8DB4D6"/>`;
 cities.forEach(n=>{const [x,y]=SWE.cities[n];s+=`<circle cx="${x}" cy="${y}" r="${n==='Stockholm'?1.6:1.2}" fill="${dotFill||(n==='Stockholm'?'var(--a-lingon)':'var(--ink)')}"/>${dotsOnly?'':`<text x="${x+2}" y="${y+1.2}" font-size="${fs}" font-family="Andika,sans-serif" fill="var(--ink)" stroke="#fff" stroke-width="${fs*.18}" paint-order="stroke">${n}</text>`}`});
 return s+`</svg>`}
const WCOL={eu:'#8FB06A',as:'#E6B25A',af:'#D9776B',na:'#79A4C8',sa:'#4FA38F',oc:'#A68BC2',an:'#B3BFCC'};
/* Antarktis: kartdatan slutar vid kanten, så hela kontinenten ritas här under (kartan är 108 hög) */
const ANT='M24 99.5 C38 96 58 97 80 95.6 C100 94.4 122 96 142 94.8 C162 94 182 96.4 196 98.6 L197 104.5 C172 106.4 122 106.8 82 106.3 C56 106 38 105.3 23 103.8Z';
const WNAME={eu:'Europa',as:'Asien',af:'Afrika',na:'Nordamerika',sa:'Sydamerika',oc:'Oceanien',an:'Antarktis'};
function worldLand(outline,dx=0){let s='';Object.keys(WNAME).forEach(k=>{s+=`<path d="${k==='an'?ANT:WORLD[k]}" ${dx?`transform="translate(${dx} 0)"`:''} fill="${outline?'#fff':WCOL[k]}" stroke="${outline?'var(--ink-soft)':(k==='an'?'#8A99A8':'none')}" stroke-width="${outline?.5:(k==='an'?.3:0)}" stroke-linejoin="round"/>`});return s}
const WLAB=k=>k==='an'?[111,102]:WORLD.labels[k];
function worldMap({w=85,outline=false,labels=false,nums=false,route=false}={}){let s=`<svg class="ic" viewBox="0 0 200 108" style="width:${w}cqw;height:${(w*.54).toFixed(1)}cqw;overflow:hidden;border-radius:1.6cqw" aria-hidden="true"><rect width="200" height="108" rx="4" fill="#D7E8F1"/>`;
 s+=worldLand(outline);
 if(labels||nums)Object.keys(WNAME).forEach((k,i)=>{const [x,y]=WLAB(k);s+=nums?`<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="var(--ink-soft)" stroke-width=".5"/><text x="${x}" y="${y+1.6}" font-size="4.6" text-anchor="middle" font-family="Andika,sans-serif" fill="var(--ink)">${i+1}</text>`:`<text x="${x}" y="${y}" font-size="5" text-anchor="middle" font-family="Andika,sans-serif" font-weight="700" fill="var(--ink)">${WNAME[k]}</text>`});
 if(route)s+=`<path d="M${WORLD.pts.se.join(' ')} Q120 40 ${WORLD.pts.af.join(' ')}" fill="none" stroke="var(--ink)" stroke-width="1" stroke-dasharray="2.4 2.4"/><circle cx="${WORLD.pts.se[0]}" cy="${WORLD.pts.se[1]}" r="1.8" fill="var(--a-lingon)"/>`;
 return s+'</svg>'}
/* bokstäver */
const LETTERS={A:['apa','anka','apelsin'],B:['boll','båt','bil'],C:['cykel','citron','cirkus'],D:['docka','drake','dörr'],E:['ekorre','ekollon','elefant'],F:['fisk','fjäril','fågel'],G:['gran','gris','glass'],H:['hus','hund','häst'],I:['is','igelkott','isbjörn'],
 J:['jordgubbe','julgran','jord'],K:['katt','kotte','ko'],L:['löv','lampa','lejon'],M:['måne','moln','mus'],N:['nyckelpiga','näsa','nalle'],O:['orm','ost','oliv'],P:['penna','pil','panda'],Q:['quiz','Qatar','squash'],R:['räv','regn','ros'],
 S:['sol','svamp','sax'],T:['tåg','tomat','troll'],U:['uggla','ur','utter'],V:['vante','val','vas'],W:['wok','wienerbröd','webb'],X:['lax','sax','xylofon'],Y:['yxa','yta','yllemössa'],Z:['zebra','zoo','zucchini'],'Å':['ål','åsna','åska'],'Ä':['äpple','ägg','älg'],'Ö':['öga','örn','ö']};
const LETTER_ART={B:['ball','boll'],C:['bike','cykel'],E:['wsquirrel','ekorre'],F:['fish','fisk'],G:['tree','gran'],H:['house','hus'],I:['hedgehog','igelkott'],J:['strawberry','jordgubbe'],K:['cat','katt'],L:['leaf','löv'],M:['moon','måne'],N:['ladybug','nyckelpiga'],O:['cheese','ost'],P:['pencil','penna'],R:['wfox','räv'],S:['sun','sol'],T:['train','tåg'],U:['wowl','uggla'],V:['mitten','vante'],'Ä':['apple','äpple'],G2:['pig','gris'],H2:['dog','hund'],A:['monkey','apa'],D:['doll','docka'],W:['wok','wok'],X:['xylophone','xylofon'],Y:['axe','yxa'],Z:['zebra','zebra'],'Å':['donkey','åsna'],'Ö':['eagle','örn']};
const RARE={Q:'Q är ovanlig i svenska ord. Den låter som k, eller kv som i quiz. Den finns mest i ord från andra språk.',W:'W är ovanlig i svenska. Den låter som ett vanligt v.',X:'X låter som ks, som i lax och sax. I början av ett ord, som i xylofon, låter X som s.',Z:'Z låter som s. Den finns mest i lånade ord.','Å':'Å, Ä och Ö finns i svenska men inte i engelska!',C:'C låter ofta som s, som i cykel och citron.'};
function hl(word,L){const i=word.toLowerCase().indexOf(L.toLowerCase());if(i<0)return word;return word.slice(0,i)+`<b style="color:var(--sc)">${word.slice(i,i+1)}</b>`+word.slice(i+1)}
/* ord med bild som återanvänds i flera böcker */
const PICWORDS=[['sun','sol'],['car','bil'],['cat','katt'],['fish','fisk'],['house','hus'],['tree','gran'],['moon','måne'],['ball','boll'],['boat','båt'],['bird','fågel'],['apple','äpple'],['egg','ägg'],['cow','ko'],['pig','gris'],['dog','hund'],['hat','mössa'],['sock','strumpa'],['leaf','löv'],['star','stjärna'],['heart','hjärta'],['fox','räv'],['owl','uggla'],['frog','groda'],['bear','björn'],['hen','höna'],['sheep','får'],['moose','älg'],['book','bok'],['bike','cykel'],['train','tåg'],['bread','bröd'],['milk','mjölk'],['carrot','morot'],['banana','banan'],['cheese','ost'],['flower','blomma'],['butterfly','fjäril'],['cookie','kaka'],['umbrella','paraply'],['pencil','penna'],['hare','hare'],['hedgehog','igelkott'],['penguin','pingvin'],['lion','lejon'],['elephant','elefant'],['mitten','vante'],['boot','stövel'],['icecream','glass'],['strawberry','jordgubbe'],['blueberry','blåbär'],['mouse','mus'],['woolhat','mössa'],['wfox','räv'],['wowl','uggla'],['wsquirrel','ekorre'],['monkey','apa'],['eagle','örn'],['snowman','snögubbe'],['boulder','sten']];
const PW=Object.fromEntries(PICWORDS);

const artSvgW=(n,w,flip=false)=>`<svg class="ic" viewBox="0 0 100 100" style="width:${typeof w==='number'?w+'cqw':w};${typeof w==='number'?'height:'+w+'cqw':'height:auto'}" aria-hidden="true"><g ${flip?'transform="translate(100 0) scale(-1 1)"':''}>${ART[n]}</g></svg>`;
const arrowSvg=(deg,w=14)=>`<svg class="ic" viewBox="0 0 100 60" style="width:${w}cqw" aria-hidden="true"><g transform="rotate(${deg} 50 30)"><path d="M10 30 H74" stroke="var(--sc)" stroke-width="11" stroke-linecap="round"/><path d="M60 10 L88 30 L60 50Z" fill="var(--sc)" stroke="var(--sc)" stroke-width="6" stroke-linejoin="round"/></g></svg>`;
/* paket i olika färger (för vågen) */
[['pkg_r','#C9574B','#A9463D'],['pkg_b','#5B86B4','#4A6F98'],['pkg_y','#E2B64A','#C49A33']].forEach(([k,c,d])=>{if(typeof ICONIMG!=='undefined'&&ICONIMG[k])return;ART[k]=`<rect x="16" y="38" width="68" height="52" rx="4" fill="${c}"/><rect x="12" y="28" width="76" height="14" rx="3" fill="${d}"/><rect x="45" y="28" width="10" height="62" fill="#F6E6C4"/><path d="M50 28 C42 14 28 14 33 23 C37 29 46 29 50 28 C54 29 63 29 67 23 C72 14 58 14 50 28Z" fill="#F6E6C4"/>`});

/* ================= Korsord (kryss) =================
   words: [[ORD, ledtråd, rad, kolumn, 'A'|'D']] – rad/kolumn är ordets FÖRSTA bokstav.
   mode 'pic': ledtråden är en ikon som står i rutan före ordet, med en pil in mot ordet.
   mode 'num': ordets första ruta får ett nummer; ledtrådarna står under rutnätet som bildkort (ikon) eller text.
   given: rutor med bokstaven ifylld från början – 'first' (första bokstaven i varje ord), 'cons' (alla konsonanter)
          eller en lista [[rad,kolumn],…]. secret: [[rad,kolumn],…] i det hemliga ordets ordning.
   Rutorna är vanliga svarsrutor (box), en bokstav i varje; korsande rutor delas. */
const KVOW='AEIOUYÅÄÖ';
function kryss(words,{mode='pic',secret=[],given=null,cell=10.2,ask='Vem gömmer sig?',secretHint='Läs de gula rutorna i ordning.',clueW=null,list=false}={}){
 const L={},PIC=[],starts={};let H=0,W=0;
 words.forEach(([w,clue,r,c,d])=>{const dr=d==='D'?1:0,dc=d==='D'?0:1;[...w].forEach((ch,i)=>{const k=(r+dr*i)+','+(c+dc*i);if(L[k]&&L[k]!==ch)throw new Error('kryss: krock i '+k+' '+w);L[k]=ch;H=Math.max(H,r+dr*i+1);W=Math.max(W,c+dc*i+1)});
  if(mode==='pic'){PIC.push([clue,r-dr,c-dc,d,w]);if(r-dr<0||c-dc<0)throw new Error('kryss: bildrutan utanför för '+w)}starts[r+','+c]=1});
 const num={};if(mode==='num')Object.keys(starts).map(k=>k.split(',').map(Number)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).forEach(([r,c],i)=>num[r+','+c]=i+1);
 const sec={};secret.forEach(([r,c],i)=>sec[r+','+c]=i+1);
 const fix=new Set();
 if(given==='first')words.forEach(([,,r,c])=>fix.add(r+','+c));
 else if(given==='cons')Object.entries(L).forEach(([k,ch])=>{if(!KVOW.includes(ch))fix.add(k)});
 else if(Array.isArray(given))given.forEach(([r,c])=>fix.add(r+','+c));
 Object.keys(sec).forEach(k=>{if(fix.has(k))throw new Error('kryss: hemlig ruta är ifylld '+k)});
 const arrow=d=>`<svg class="karr ${d==='D'?'down':'right'}" viewBox="0 0 20 20" aria-hidden="true"><path d="${d==='D'?'M4 7l6 7 6-7z':'M7 4l7 6-7 6z'}"/></svg>`;
 let g='';
 /* Bilden får växa utåt (bort från ordet) där grannrutorna är tomma, annars stannar den i sin ruta */
 const used=k=>L[k]||PIC.some(([,pr,pc])=>pr+','+pc===k);
 PIC.forEach(([icon,r,c,d,w])=>{const out=d==='D'?[[r-1,c],[r,c-1],[r,c+1]]:[[r,c-1],[r-1,c],[r+1,c]];const near=PIC.some(([,pr,pc])=>(pr!==r||pc!==c)&&Math.abs(pr-r)<=1&&Math.abs(pc-c)<=1);const big=!near&&out.every(([a,b])=>!used(a+','+b));
  g+=`<span class="kpic ${d}${big?' big':''}" data-r="${r}" data-c="${c}" data-d="${d}" style="grid-area:${r+1}/${c+1}" aria-label="${w.length} bokstäver ${d==='D'?'nedåt':'åt höger'}">${art(icon,cell)}${arrow(d)}</span>`});
 Object.entries(L).forEach(([k,ch])=>{const [r,c]=k.split(',').map(Number),n=sec[k],nb=num[k];
  g+=`<span class="kcell${n?' sec':''}" data-r="${r}" data-c="${c}" style="grid-area:${r+1}/${c+1}">${fix.has(k)?`<span class="box kc fix">${ch}</span>`:box(ch,'txt kc')}${n?`<b>${n}</b>`:''}${nb?`<i class="kn">${nb}</i>`:''}</span>`});
 const grid=`<div class="kryss" style="--kc:${cell}cqw;grid-template-columns:repeat(${W},var(--kc));grid-template-rows:repeat(${H},var(--kc))">${g}</div>`;
 let clues='';
 if(mode==='num'){const byDir=d=>words.filter(x=>x[4]===d).map(x=>[num[x[2]+','+x[3]],x]).sort((a,b)=>a[0]-b[0]);
  const pic=words.every(x=>typeof ART!=='undefined'&&!!ART[x[1]]);
  const at=([n,[w,clue,r,c,d]])=>`data-r="${d==='D'?r-1:r}" data-c="${d==='D'?c:c-1}" data-d="${d}"`;
  const all=words.map(x=>[num[x[2]+','+x[3]],x]).sort((a,b)=>a[0]-b[0]||(a[1][4]==='A'?-1:1));
  if(pic)clues=`<div class="kcards">${all.map(it=>`<span class="kclue pic" ${at(it)}><span class="kbadge"><i class="kn">${it[0]}</i>${arrow(it[1][4])}</span>${art(it[1][1],clueW||13)}</span>`).join('')}</div>`;
  else if(list)clues=`<ol class="klist">${all.map(it=>`<li class="kclue" ${at(it)}><i class="kn">${it[0]}</i>${arrow(it[1][4])}<span>${it[1][1]}</span></li>`).join('')}</ol>`;
  else{const col=(d,t)=>`<div class="kcol"><h4>${arrow(d)}${t}</h4><ul>${byDir(d).map(it=>`<li class="kclue" ${at(it)}><i class="kn">${it[0]}</i><span>${it[1][1]}</span></li>`).join('')}</ul></div>`;
   clues=`<div class="kclues">${col('A','Åt höger')}${col('D','Nedåt')}</div>`}}
 const word=secret.map(([r,c])=>L[r+','+c]).join('');
 const hid=secret.length?`<div class="ksecret"><p class="p"><b>${ask}</b>${secretHint}</p><div class="ksw">${[...word].map((ch,i)=>`<span class="kcell sec"><b>${i+1}</b>${box(ch,'txt kc')}</span>`).join('')}</div></div>`:'';
 return {html:`<div class="kwrap ${mode}">${grid}${clues}${hid}</div>`,word,words:words.map(x=>x[0]),
  key:(d=>words.filter(x=>x[4]===d).map(x=>(mode==='num'?num[x[2]+','+x[3]]+' ':'')+x[0]).join(', '))};
}
/* Ordsök: rows = rader med bokstäver, words = [[ORD, ikon, rad, kolumn, 'A'|'D']]. Barnet trycker på (ringar in) orden. */
function ordsok(rows,words,{cell=9.4}={}){const on=new Set();
 words.forEach(([w,,r,c,d])=>{[...w].forEach((ch,i)=>{const rr=r+(d==='D'?i:0),cc=c+(d==='D'?0:i);if(rows[rr][cc]!==ch)throw new Error('ordsok: '+w+' passar inte');on.add(rr+','+cc)})});
 const g=rows.map((row,r)=>[...row].map((ch,c)=>selOk(`<span>${ch}</span>`,'lc ws',on.has(r+','+c))).join('')).join('');
 return `<div class="wsw"><div class="wsgrid" style="--wc:${cell}cqw;grid-template-columns:repeat(${rows[0].length},var(--wc))">${g}</div><div class="wscards">${words.map(([w,ic])=>`<span class="wscard">${art(ic,9)}<b>${w}</b></span>`).join('')}</div></div>`}
/* Eget korsord: rutat fält att rita bilder och skriva ord i (pennan i appen, blyerts på papper) */
function egetKryss(R=8,C=8){return `<div class="kown" style="grid-template-columns:repeat(${C},1fr);grid-template-rows:repeat(${R},1fr)">${rep(R*C,()=>'<i></i>')}</div>`}
