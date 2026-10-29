/* ================= Grundverktyg ================= */
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const ri=(r,a,b)=>a+Math.floor(r()*(b-a+1));
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const rep=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
function starPts(cx,cy,R,r,n=5){const p=[];for(let i=0;i<2*n;i++){const a=-Math.PI/2+i*Math.PI/n,dd=i%2?r:R;p.push([+(cx+dd*Math.cos(a)).toFixed(2),+(cy+dd*Math.sin(a)).toFixed(2)])}return p}
const pts=a=>a.map(p=>p.join(',')).join(' ');
const MUL='·', MIN='−';

/* ================= Interaktiva byggstenar (blir tomma rutor på papper) ================= */
const box=(a='',cls='')=>`<input class="box ${cls}" data-k="" data-a="${a}" inputmode="${/txt/.test(cls)?'text':'numeric'}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" maxlength="3" aria-label="Svar">`;
const tin=(a='',w=30,cls='')=>`<input class="tline ${cls}" data-k="" data-a="${a}" autocomplete="off" autocapitalize="${/case|free/.test(cls)?'sentences':'off'}" autocorrect="off" spellcheck="false" enterkeyhint="done" style="width:${w}cqw" aria-label="Svar">`;
const sel=(inner,cls='')=>`<span class="sel ${cls}" data-k="" role="button" tabindex="0">${inner}</span>`;
const eq=(s,cls='')=>`<span class="eq ${cls}">${s}</span>`;
const tray=(inner,style='')=>`<div class="tray" style="${style}">${inner}</div>`;
function grp(n,name,w,per=5){let s='';for(let i=0;i<n;i++)s+=art(name,w);return `<div class="grp" style="grid-template-columns:repeat(${Math.min(n,per)},${w}cqw)">${s}</div>`}
const A=(t,i,b,a)=>({t,i,b,a});
const pawSvg=()=>`<svg viewBox="0 0 100 100" aria-hidden="true">${ART.paw}</svg>`;
/* Svårighetsgrad: 3D-tass i dämpad mossgrön (samma i hela serien) */
const paw3d=()=>(typeof ICONIMG!=='undefined'&&ICONIMG.paw_moss)?`<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#ii-paw_moss"/></svg>`:pawSvg();
const paws=n=>`<span class="paws${typeof ICONIMG!=='undefined'&&ICONIMG.paw_moss?' p3d':''}">${rep(n,paw3d)}</span>`;
const LEVEL={1:'1 tass · från 4 år',2:'2 tassar · från 5 år',3:'3 tassar · från 6 år'};

/* ================= Skogsscener (omslag och hylla) ================= */
function spruce(x,b,h,c,c2,snow=false){const w=h*.4,t=5,f=v=>+v.toFixed(1);const R=[];for(let i=1;i<=t;i++){const y=b-h+h*.94*i/t,ww=w*i/t;R.push([x+ww,y]);if(i<t)R.push([x+ww*.45,y+h*.02])}
 const Lp=R.map(([px,py])=>[2*x-px,py]).reverse();const top=[x,b-h];
 const poly=[top,...R,...Lp].map(p=>p.map(f));const half=[top,...[...Lp].reverse(),[x,b-h*.06]].map(p=>p.map(f));
 let s=`<rect x="${f(x-h*.03)}" y="${f(b-h*.08)}" width="${f(h*.06)}" height="${f(h*.1)}" fill="var(--a-bark2)"/><polygon points="${pts(poly)}" fill="${c}"/>${c2?`<polygon points="${pts(half)}" fill="${c2}"/>`:''}`;
 if(snow)for(let i=1;i<=t;i++){const y=b-h+h*.94*i/t,ww=w*i/t;s+=`<path d="M${f(x-ww*.8)} ${f(y-h*.012)} Q${f(x)} ${f(y-h*.07)} ${f(x+ww*.8)} ${f(y-h*.012)}" fill="none" stroke="#fff" stroke-width="${f(h*.035)}" stroke-linecap="round"/>`}
 return s}
const SKY={matte:['#D8E6EE','#B9CFDC','#9DB9C9'],svenska:['#F2E0DA','#E2C4BB','#CDAA9F'],eng:['#F3E5C6','#E2CFA4','#CDB984'],geo:['#D7E8DE','#B9D3C3','#9CBDA8'],mer:['#EADFE6','#D6C2CF','#BFA5B6'],tryg:['#DCEAEC','#BED5D9','#A1BFC4']};
function grassTufts(r,n,y0,y1){let s='';for(let i=0;i<n;i++){const x=ri(r,6,204),y=ri(r,y0,y1);s+=`<path d="M${x} ${y} l-1.6 -4 M${x+2} ${y} l0 -5 M${x+4} ${y} l1.6 -4" stroke="var(--a-mossd)" stroke-width="1.1" stroke-linecap="round" opacity=".7"/>`}return s}
function sceneSvg(b){const cv=b.cover||{},v=cv.scene||'forest',r=rng(b.nr*31+b.subj.length*7+v.length);let [sky,h1,h2]=SKY[b.subj];
 if(v==='dusk'){sky='#F3DCCB';h1='#E3C2B2';h2='#C9A79A'}
 if(v==='winter'){sky='#DDE8EF';h1='#C9D9E4';h2='#AFC4D2'}
 let s=`<svg class="cv-scene" viewBox="0 0 210 297" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="210" height="297" fill="${sky}"/>`;
 if(v==='dusk'){s+=`<circle cx="164" cy="150" r="26" fill="#fff" opacity=".35"/><path d="M170 132 A20 20 0 1 0 182 160 A15 15 0 1 1 170 132Z" fill="var(--a-sun)"/>`;for(let i=0;i<9;i++)s+=`<circle cx="${ri(r,100,205)}" cy="${ri(r,108,190)}" r="${(r()*1+.7).toFixed(1)}" fill="#fff" opacity=".85"/>`}
 else if(v!=='world'&&v!=='sweden')s+=`<circle cx="166" cy="168" r="30" fill="#fff" opacity=".35"/><circle cx="166" cy="168" r="19" fill="var(--a-sun)"/>`;
 if(v==='winter'){for(let i=0;i<26;i++)s+=`<circle cx="${ri(r,4,206)}" cy="${ri(r,100,290)}" r="${(r()*1.2+.6).toFixed(1)}" fill="#fff"/>`}
 else if(v!=='world')s+=`<g opacity=".95">${artIn('cloud',22,132,30)}${artIn('cloud',122,120,24)}</g>`;
 if(v==='world'){s+=`<g transform="translate(5 132) scale(1)"><rect x="0" y="0" width="200" height="100" rx="6" fill="#C5DCEA"/>${['eu','as','af','na','sa','oc','an'].map((k,i)=>`<path d="${WORLD[k]}" fill="${['#8FB06A','#E6B25A','#D9776B','#79A4C8','#C4685C','#A68BC2','#F2F5F7'][i]}"/>`).join('')}<path d="M${WORLD.pts.se.join(' ')} Q120 40 ${WORLD.pts.af.join(' ')}" fill="none" stroke="var(--a-ink)" stroke-width="1.4" stroke-dasharray="3 3"/><circle cx="${WORLD.pts.se[0]}" cy="${WORLD.pts.se[1]}" r="2.4" fill="var(--a-lingon)"/></g>`}
 if(v==='sweden'){const sc=118/SWE.H;s+=`<g transform="translate(118 108) scale(${sc.toFixed(3)})"><path d="${SWE.no}${SWE.fi}" fill="#E9E2CF"/><path d="${SWE.se}" fill="#8FB06A"/><path d="${SWE.vanern}${SWE.vattern}${SWE.malaren}" fill="#79A4C8"/><circle cx="${SWE.cities.Stockholm[0]}" cy="${SWE.cities.Stockholm[1]}" r="2.6" fill="var(--a-lingon)"/></g>`}
 s+=`<path d="M0 205 C30 188 60 192 90 200 C120 208 150 186 210 194 L210 297 L0 297Z" fill="${h1}"/>`;
 const snow=v==='winter',farTrees=v!=='meadow'&&v!=='market';
 for(let x=-4;x<220;x+=ri(r,7,11))s+=spruce(x,214+ri(r,-3,3),ri(r,16,26),h2,null,snow);
 s+=`<path d="M0 222 C40 214 80 216 120 222 C150 226 180 218 210 220 L210 297 L0 297Z" fill="${h2}" opacity=".6"/>`;
 if(farTrees){for(let x=-6;x<220;x+=ri(r,13,20)){const hh=ri(r,32,52);s+=spruce(x,236+ri(r,-2,2),hh,'var(--a-spruce)','var(--a-spruce2)',snow)}}
 if(v==='forest'||v==='dusk'||v==='lake')s+=birchTree(cv.birchX||22,250,64,b.nr)+birchTree((cv.birchX||22)+16,248,50,b.nr+3);
 if(v==='farm')s+=artIn('house',cv.houseX||22,190,58)+`<path d="M0 252 L210 252 M0 244 L210 244" stroke="#F3EEE6" stroke-width="2.2"/>${rep(22,i=>`<rect x="${i*10}" y="238" width="3" height="18" rx="1" fill="#F3EEE6"/>`)}`;
 const g1=snow?'#F4F8FB':'var(--a-moss2)',g2=snow?'#E2ECF3':'var(--a-moss)';
 s+=`<path d="M0 238 C50 228 110 232 150 238 C175 242 195 236 210 236 L210 297 L0 297Z" fill="${g1}"/>`;
 if(v==='lake')s+=`<path d="M8 262 C40 250 120 250 168 258 C190 262 196 270 170 276 C120 286 40 284 14 276 C2 272 0 266 8 262Z" fill="var(--a-blue)"/><path d="M30 262 C60 256 110 256 140 260" fill="none" stroke="#fff" stroke-width="1.4" opacity=".55"/><ellipse cx="46" cy="270" rx="5" ry="2" fill="var(--a-moss)"/><ellipse cx="120" cy="272" rx="4" ry="1.6" fill="var(--a-moss)"/>`;
 s+=`<path d="M0 274 C40 266 90 270 130 276 C160 280 190 272 210 272 L210 297 L0 297Z" fill="${g2}"/>`;
 if(v==='meadow'||v==='market'){for(let i=0;i<16;i++){const x=ri(r,6,200),y=ri(r,244,292);s+=`<circle cx="${x}" cy="${y}" r="1.8" fill="${['#fff','var(--a-rose)','var(--a-sun)'][i%3]}"/>`}}
 if(v==='market')s+=`<g transform="translate(${cv.stallX||12} 196)"><rect x="6" y="20" width="4" height="46" fill="var(--a-bark2)"/><rect x="82" y="20" width="4" height="46" fill="var(--a-bark2)"/><path d="M0 22 L92 22 L86 6 L6 6Z" fill="#fff"/>${rep(6,i=>`<path d="M${6+i*13.4} 6 L${12+i*13.4} 6 L${7+i*14.3} 22 L${i*14.3} 22Z" fill="var(--a-lingon)"/>`)}${rep(7,i=>`<path d="M${i*13.2} 22 a6.6 6.6 0 0 0 13.2 0Z" fill="${i%2?'#fff':'var(--a-lingon)'}"/>`)}<rect x="2" y="50" width="88" height="18" rx="2" fill="var(--a-nut)"/>${artIn('apple',8,38,16)}${artIn('banana',26,36,18)}${artIn('bread',46,38,18)}${artIn('carrot',66,34,18)}</g>`;
 if(snow)s+=`<path d="M0 274 C40 266 90 270 130 276" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>`;
 else s+=grassTufts(r,9,250,290);
 s+=coverChar(b);return s+'</svg>'}
function coverChar(b){const cv=b.cover||{},ch=cv.pose||CHAR[b.subj].art,side=cv.side||'right',flyer=/swallow$|owl_fly/.test(ch);
 const size=cv.size||(flyer?84:90),x=side==='left'?(cv.x??10):(cv.x??(206-size)),y=cv.y??(flyer?150:200);
 let props=cv.props||'';if(side==='left'&&props)props=`<g transform="translate(${cv.propShift??96} 0)">${props}</g>`;
 const flip=cv.flip??(side==='left'?false:/^(squirrel|fox|swallow)/.test(ch));
 return props+(flyer?'':`<ellipse cx="${x+size*.5}" cy="${y+size*.95}" rx="${size*.32}" ry="3.4" fill="#000" opacity=".12"/>`)+artIn(ch,x,y,size,flip)}
/* ================= Sidor ================= */
const shellPg=(b,inner,cls='')=>`<div class="pg ${cls}" style="--sc:${SUBJ[b.subj].color}">${inner}<svg class="ink" viewBox="0 0 1000 1414" preserveAspectRatio="none" aria-hidden="true"></svg></div>`;
const starOutline=`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 14 L59.5 36 L83 38 L65 54 L70.5 77 L50 65 L29.5 77 L35 54 L17 38 L40.5 36Z" fill="none" stroke="var(--rule-2)" stroke-width="3" stroke-linejoin="round"/></svg>`;
const stampSvg=`<svg class="done" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="var(--sc)"/><circle cx="50" cy="50" r="40" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 4" opacity=".7"/><g transform="translate(31 18) scale(.38)" color="#fff">${ART.paw}</g><text x="50" y="74" text-anchor="middle" font-family="Andika,sans-serif" font-weight="700" font-size="15" fill="#fff" letter-spacing="1.5">KLART!</text></svg>`;
const KHINT={auto:'Stjärnan kommer när allt är rätt',self:'Tryck på stjärnan när du är klar',read:'Tryck på stjärnan när du har läst',mixed:'Gör allt, tryck sedan på stjärnan'};
function footer(b,i,klar=true,kind){return `<footer class="pf"><div class="pf-l"><span class="pnum">${i}</span><span>${b.title}</span></div>${klar?`<div class="klar">${kind?`<span class="khint">${KHINT[kind]}</span>`:''}<span class="kq">Klart?</span><div class="kbox">${starOutline}</div>${stampSvg}</div>`:''}</footer>`}
/* vem avgör att sidan är klar: appen (auto), barnet (self) eller båda (mixed: rätta delen först, sedan stjärnan) */
function pageKind(h,ins=''){const chk=/data-a="[^"]+"|data-ok="1"|data-need=|data-ans=/.test(h);
 /* på en sida som rättas är en ritruta bara kladdpapper; det som gör sidan "blandad" är fri skrivning eller spårning */
 const free=/class="wline|<input(?![^>]*data-a="[^"]+")/.test(h);
 const open=free||/class="draw|class="maze/.test(h)||(/class="sel/.test(h)&&!chk);
 /* läs- och ordsidor kräver inget gjort; alla andra egna sidor kräver att barnet har gjort något innan stjärnan */
 const read=!/class="draw|class="wline|<input/.test(h)&&(/class="story/.test(h)||/^(Lär dig|Läs berättelsen|Läs om|Läs texten|Räkna vidare på engelska|Motsatser|Veckans dagar|Årets månader|Så här låter)/.test(String(ins).replace(/<[^>]+>/g,'')));
 return {kind:chk?(free?'mixed':'auto'):'self',work:chk?open:!read}}
function coverPage(b){const s=SUBJ[b.subj];const rdT=b.title.replace(/ (\d+)$/,'\u00a0$1');/* siffran i t.ex. Bokstavsskogen 1 bryts inte ensam till ny rad */const lw=Math.max(...rdT.split(/ +/).map(w=>w.length));const tfs=Math.min(12.6,84/(lw*.56)).toFixed(2);const has3d=typeof COVERS!=='undefined'&&COVERS.includes(b.id),tone=has3d&&typeof COVERTONE!=='undefined'?COVERTONE[b.id]||'':'';const scene=has3d?`<svg class="cv-scene" viewBox="0 0 210 297" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><use href="#cv-${b.id}"/><rect width="210" height="${tone?140:130}" fill="url(#cvfade${tone==='dk'?'D':tone==='busy'?'B':''})"/></svg>`:sceneSvg(b);return shellPg(b,`${scene}<div class="cv-t"><div class="cv-series"><span>Skogsskolan</span><b>${s.name} ${b.nr}</b></div><h1 style="--tfs:${tfs}cqw">${rdT}</h1>${b.tag?`<div class="cv-tag" aria-label="Bokstäverna ${b.tag}">${b.tag}</div>`:''}<p class="cv-goal">${b.goal}</p><div class="cv-lv">${paws(b.level)}<span>${LEVEL[b.level]}</span></div></div>`,has3d?'cover ph3d'+(tone==='dk'?' dk':''):'cover')}
function stigSvg(n){const rows=Math.ceil(n/9),per=Math.ceil(n/rows),dx=per>1?88/(per-1):0,H=rows*15+2;const P=[];
 for(let i=0;i<n;i++){const r=Math.floor(i/per),k=i%per,x=r%2?94-k*dx:6+k*dx,y=8+r*15+Math.sin(k*1.3+r)*1.6;P.push([x,y])}
 let s=`<svg viewBox="0 0 100 ${H}" class="svgw stig" aria-hidden="true"><path d="M${P.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')}" fill="none" stroke="var(--tint)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
 P.forEach(([x,y],i)=>{s+=`<ellipse data-st="${i}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4.4" ry="3.6" fill="#fff" stroke="var(--rule-2)" stroke-width=".6"/><text x="${x.toFixed(1)}" y="${(y+1.15).toFixed(1)}" font-size="3.1" text-anchor="middle" font-family="Andika,sans-serif" fill="var(--ink-soft)">${i+2}</text>`});
 return s+`</svg>`}
function introPage(b,i){const c=CHAR[b.subj];return shellPg(b,`<div class="pg-in"><header class="ph nochar"><span class="kick">${pawSvg()}Skogsskolan · ${SUBJ[b.subj].name}</span><h2>Den här boken tillhör</h2></header><div class="pb" style="gap:3cqw">
 <div class="owner" style="border-bottom:.42cqw solid var(--rule-2);height:8cqw;flex:none"></div>
 <div class="hello">${art(c.poses[c.poses.length-1]||c.art,19)}<div class="bubble">${b.hello}</div></div>
 <div class="goal">${art('star',8)}<div><div class="lbl" style="margin-bottom:.8cqw">Målet med boken</div><b>${b.goal}</b></div></div>
 <div><div class="lbl" style="margin-bottom:2cqw">Min stig · färglägg en sten för varje sida du klarar</div>${stigSvg(b.pages.length)}</div>
 <div style="margin-top:auto"><div class="lbl" style="margin-bottom:1.2cqw">Till den vuxne</div><p class="note" style="font-size:2.9cqw;line-height:1.5">Ta en sida i taget, fem minuter räcker gott. Läs uppgiften högt och låt barnet pröva själv först. Beröm försöket, inte bara svaret. På papper: ringa in det du skulle trycka på.${b.subj==='eng'?' Papper har ingen högtalare. Läs orden högt tillsammans. Uttalet står inom parentes, skrivet som det låter på svenska.':''}${b.facit?' Facit finns längst bak.':''}</p></div>
 </div>${footer(b,i,false)}</div>`)}
/* samma sida i appen och på papper: "tryck" i appen, "ringa in"/"kryssa" osv. på papper */
const TP=(app,ppr)=>`<span class="tap">${app}</span>${ppr?`<span class="ppr">${ppr}</span>`:''}`;
const PAPER=[
 [/Tryck på högtalaren och lyssna\. ?/g,m=>TP(m,'')],
 [/Du kan trycka på (rutorna|dem)\. ?/g,m=>TP(m,'')],
 [/Tryck på eller ringa in/g,m=>TP(m,'Ringa in')],
 [/Tryck på eller kryssa/g,m=>TP(m,'Kryssa')],
 [/Tryck på lika många ringar\. Ringarna blir fyllda\./g,m=>TP(m,'Fyll i lika många ringar.')],
 [/Tryck på rutor tills/g,m=>TP(m,'Färglägg rutor tills')],
 [/Tryck på de tomma platserna/g,m=>TP(m,'Rita en prick på de tomma platserna')],
 [/Tryck på rutorna/g,m=>TP(m,'Kryssa i rutorna')],
 [/Tryck i diagrammet/g,m=>TP(m,'Färglägg i diagrammet')],
 [/([Tt])ryck i (rutnätet|rätt kolumn)/g,(m,t,w)=>TP(m,(t==='T'?'K':'k')+'ryssa i '+w)],
 [/Tryck där/g,m=>TP(m,'Dra ett streck där')],
 [/Tryck framför/g,m=>TP(m,'Sätt ett kryss framför')],
 [/Tryck sedan på/g,m=>TP(m,'Ringa sedan in')],
 [/eller på "lika tunga"/g,m=>TP(m,'eller "lika tunga"')],
 [/Välj pennan och färglägg/g,m=>TP(m,'Färglägg')],
 [/ med pennan/g,m=>TP(m,'')],
 [/Tryck på (den|det) rätta (svaret|bilden|bilen|ljudet)/g,(m,a,b)=>TP(m,'Sätt en ring runt '+a+' rätta '+b)],
 [/Tryck på/g,m=>TP(m,'Ringa in')],
 [/tryck på/g,m=>TP(m,'ringa in')]];
const paper=h=>String(h).split(/(<svg[\s\S]*?<\/svg>|<[^>]+>)/).map((x,i)=>{if(i%2)return x;const keep=[];const t=PAPER.reduce((t,[r,f])=>t.replace(r,(...a)=>{keep.push(f(...a));return `\u0001${keep.length-1}\u0002`}),x);return t.replace(/\u0001(\d+)\u0002/g,(_,n)=>keep[n])}).join('');
function actPage(b,p,i,pi){const c=CHAR[b.subj];let k=0;const body=paper(p.b).replace(/data-k=""/g,()=>`data-k="${k++}"`);const pk=pageKind(body,p.i);
 return shellPg(b,`<div class="pg-in"><header class="ph"><span class="kick">${pawSvg()}${SUBJ[b.subj].name} · ${b.kick||b.sub.split(',')[0]}</span><h2>${p.t}</h2><p class="ins">${paper(p.i)}</p><div class="tutor">${artSvg(p.pose||c.poses[pi%c.poses.length],'',c.flipTutor)}</div></header><div class="pb">${body}</div>${footer(b,i,true,pk.kind==='self'&&!pk.work?'read':pk.kind)}</div>`,'act').replace('class="pg act"',`class="pg act" data-pi="${pi}" data-check="${pk.kind}"${pk.work?' data-work="1"':''}`)}
function facitChunks(b){const items=b.pages.map((p,k)=>p.a?{k,t:p.t,a:p.a.join(' · ')}:null).filter(Boolean);const out=[[]];let w=0;
 items.forEach(it=>{const wt=.7+Math.ceil(it.a.length/18)+Math.ceil((it.t.length+8)/15);if(w+wt>80&&out[out.length-1].length){out.push([]);w=0}out[out.length-1].push(it);w+=wt});return items.length?out:[]}
function facitPage(b,i,chunk,n,of){const items=chunk.map(it=>`<div style="break-inside:avoid;margin-bottom:2.2cqw"><div style="font:600 2.9cqw/1.25 var(--f-disp);font-variation-settings:'SOFT' 100">Sida ${it.k+2} · ${it.t}</div><div style="font-size:2.6cqw;line-height:1.4;color:var(--ink-soft)">${it.a}</div></div>`).join('');return shellPg(b,`<div class="pg-in"><header class="ph nochar"><span class="kick">${pawSvg()}Till den vuxne</span><h2>Facit${of>1?` <span style="color:var(--ink-soft);font-size:.6em">${n} av ${of}</span>`:''}</h2></header><div class="pb" style="columns:3;column-gap:4.4cqw;display:block">${items}</div>${footer(b,i,false)}<div class="fac-lock"><b>Facit är för vuxna</b><span>Håll in knappen i tre sekunder.</span><button type="button" class="fac-hold"><i></i>Håll in</button><div class="fac-q" hidden><span class="fac-qt"></span><input class="fac-in" inputmode="numeric" autocomplete="off" aria-label="Svar"><button type="button" class="fac-go">Öppna</button></div></div></div>`,'facit')}
function wreath(){let s='';for(const side of [-1,1])for(let k=0;k<9;k++){const th=26+k*15,r=th*Math.PI/180,x=50+side*37*Math.sin(r),y=52+37*Math.cos(r);s+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.3" ry="7.2" fill="${k%2?'var(--a-moss)':'var(--a-moss2)'}" transform="rotate(${(side*th+90+side*24).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`}return s+`<circle cx="50" cy="89" r="3" fill="var(--a-lingon)"/><circle cx="46" cy="88" r="2.4" fill="var(--a-lingon)"/><circle cx="54" cy="88" r="2.4" fill="var(--a-lingon)"/>`}
function diplomaPage(b,i,name=''){const c=CHAR[b.subj];return shellPg(b,`<div class="pg-in"><div class="pb dip">
 <svg viewBox="0 0 100 100" style="width:46cqw;height:46cqw" aria-hidden="true"><circle cx="50" cy="52" r="30" fill="var(--tint)"/>${(typeof ICONIMG!=='undefined'&&ICONIMG.wreath)?'<svg x="-5" y="-6.5" width="110" height="110" viewBox="0 0 100 100" overflow="visible"><use href="#ii-wreath"/></svg>':wreath()}${artIn(c.diploma||c.art,26,26,48)}</svg>
 <h2>Diplom</h2><p class="p" style="font-size:4.2cqw">Det här diplomet går till</p>
 <div class="name" data-name="1">${name}</div>
 <p class="p" style="font-size:4.2cqw">som har klarat boken <b>${b.title}</b>${/[!?]$/.test(b.title)?'':'.'}</p>
 <p style="font:600 5cqw/1.3 var(--f-disp);font-variation-settings:'SOFT' 100;max-width:72cqw;margin:0">${b.goal}</p>
 <p class="note no-print dip-hint"></p>
 <div class="sign"><div>Datum</div><div>Underskrift</div></div>
 </div>${footer(b,i,false)}</div>`,'diploma')}
const FITCACHE={};
function buildPages(b){if(FITCACHE[b.id])return FITCACHE[b.id];const out=[coverPage(b),introPage(b,1)];b.pages.forEach((p,k)=>out.push(actPage(b,p,k+2,k)));if(b.facit){const ch=facitChunks(b);ch.forEach((c,n)=>out.push(facitPage(b,out.length,c,n+1,ch.length)))}out.push(diplomaPage(b,out.length));return FITCACHE[b.id]=fitPages(out)}

/* skyddsnät: krymp en sidas innehåll om det inte får plats (mäts en gång per bok) */
function fitPages(list){if(typeof document==='undefined')return list;const host=document.createElement('div');host.style.cssText='position:absolute;left:-10000px;top:0;width:640px;visibility:hidden;pointer-events:none';document.body.appendChild(host);
 const out=list.map(h=>{host.innerHTML=h;const pg=host.firstElementChild;pg.style.width='640px';const pb=pg.querySelector('.pb');if(!pb)return h;const over=pb.scrollHeight-pb.clientHeight;if(over<=2)return h;
  const z=Math.max(.62,pb.clientHeight/pb.scrollHeight*.975).toFixed(3);return h.replace(/<div class="pb([^"]*)"( style="([^"]*)")?/,(m,c,_,st)=>`<div class="pb${c}" style="${st?st+';':''}zoom:${z}"`)});
 host.remove();return out}
