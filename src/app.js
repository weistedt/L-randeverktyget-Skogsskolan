/* ================= Tillstånd ================= */
const $=id=>document.getElementById(id);
const KEY='skogsskolan-v1';let state={kid:'barn',done:{},work:{},t:{},pos:{},last:{}};let storeOK=true;
/* Stabila sid-id: arbete sparas per sida med ett id som räknas fram ur sidans innehåll.
   Ändras en sida nollställs bara den sidan; resten av boken behåller sitt arbete. I minnet används sidindex som förut. */
const fnv=t=>{let h=2166136261;for(let i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)};
const PIDS={};
const pids=b=>PIDS[b.id]||(PIDS[b.id]=(()=>{const seen={};return b.pages.map(p=>{let k='p'+fnv(p.t+'\u0001'+p.b+'\u0001'+JSON.stringify(p.a||''));if(seen[k])k+='_'+(seen[k]++);else seen[k]=1;return k})})());
const BK=id=>BOOKS.find(b=>b.id===id);
const toKey=(b,idx)=>{idx=+idx;const n=b.pages.length;return idx===0?'c':idx===1?'i':idx<2+n?pids(b)[idx-2]:'x'+(idx-2-n)};
const fromKey=(b,key)=>{key=String(key);if(key==='c')return 0;if(key==='i')return 1;if(key[0]==='x')return 2+b.pages.length+(+key.slice(1));const j=pids(b).indexOf(key);return j<0?null:j+2};
/* Arbete på sid-id som inte finns i den här versionen (en sida har ändrats) kastas inte: det sparas vidare oförändrat,
   så att det kommer tillbaka om sidan återställs. ORPH[barn~bok] = {w:{id:arbete}, d:[id]} */
const ORPH={};const orph=(kid,bid)=>ORPH[kid+'~'+bid]||(ORPH[kid+'~'+bid]={w:{},d:[]});
const packWork=(b,W,kid)=>{const o={};if(kid){const r=ORPH[kid+'~'+b.id];if(r)Object.assign(o,r.w)}Object.entries(W||{}).forEach(([i,w])=>{o[toKey(b,i)]=w});return o};
const packDone=(b,D,kid)=>{const o=(D||[]).map(pi=>toKey(b,pi+2));if(kid){const r=ORPH[kid+'~'+b.id];if(r)r.d.forEach(k=>{if(!o.includes(k))o.push(k)})}return o};
const unpackWork=(b,W,kid)=>{const o={};Object.entries(W||{}).forEach(([k,w])=>{const i=fromKey(b,k);if(i!==null)o[i]=w;else if(kid&&w&&typeof w==='object'){const r=orph(kid,b.id);if(!r.w[k]||(w.t||0)>(r.w[k].t||0))r.w[k]=w}});return o};
const unpackDone=(b,D,kid)=>{const o=[];(D||[]).forEach(k=>{const i=fromKey(b,k);if(i!==null&&i>=2&&i<2+b.pages.length){if(!o.includes(i-2))o.push(i-2)}else if(kid&&i===null&&typeof k==='string'){const r=orph(kid,b.id);if(!r.d.includes(k))r.d.push(k)}});return o};
/* böcker som inte finns i den här versionen (en ny bok från en nyare flik, eller en bok som bytt id) sparas vidare orörda */
const UNKB={work:{},done:{}};
const mapBooks=(m,f,u)=>{const o={};Object.entries(m||{}).forEach(([kid,bs])=>{o[kid]={};Object.entries(bs||{}).forEach(([bid,v])=>{const b=BK(bid);if(b)o[kid][bid]=f(b,v,kid);else if(u)(UNKB[u][kid]=UNKB[u][kid]||{})[bid]=v})});return o};
const withUnk=(o,u)=>{Object.entries(UNKB[u]).forEach(([kid,bs])=>{const t=o[kid]=o[kid]||{};Object.entries(bs).forEach(([bid,v])=>{if(!(bid in t))t[bid]=v})});return o};
function readDisk(json){const s=JSON.parse(json||'null');if(!s||!s.done)return null;const st=Object.assign({work:{},t:{},pos:{},last:{}},s);if(s.fmt===2){st.work=mapBooks(s.work,unpackWork,'work');st.done=mapBooks(s.done,unpackDone,'done')}return st}
const diskJSON=()=>JSON.stringify(Object.assign({},state,{fmt:2,work:withUnk(mapBooks(state.work,packWork),'work'),done:withUnk(mapBooks(state.done,packDone),'done')}));
let oldFormat=false;
let rawBad=false;
try{const raw=localStorage.getItem(KEY);let st=null;try{st=readDisk(raw)}catch(e){rawBad=true;try{localStorage.setItem(KEY+'-bad-'+Date.now(),raw)}catch(e2){}}if(st){state=st;oldFormat=JSON.parse(raw).fmt!==2}}catch(e){storeOK=false}
/* provskrivningen: misslyckas den för att minnet är fullt är det inte privat läge, och sparandet kan ändå fungera */
try{localStorage.setItem(KEY+'-p','1');localStorage.removeItem(KEY+'-p')}catch(e){if(!(e&&(e.name==='QuotaExceededError'||e.code===22)))storeOK=false}
/* en sida som barnet bockat av som inte klar ska inte läggas tillbaka av en annan flik eller molnet (en timme) */
const undKey=(kid,bid)=>kid+'~'+bid;const isUnd=(kid,bid,x)=>{const t=((state.und||{})[undKey(kid,bid)]||{})[x];return !!t&&Date.now()-t<36e5};
function setUnd(kid,bid,x,on){const u=state.und=state.und||{},k=undKey(kid,bid);if(on)(u[k]=u[k]||{})[x]=Date.now();else if(u[k]){delete u[k][x];if(!Object.keys(u[k]).length)delete u[k]}}
const dirty=new Set();let saveT=null,unsaved=false,quotaFull=false;
/* ombyggd bok (ny rev): gammalt arbete hör till andra sidor och rensas */
const bookRev=bid=>(BOOKS.find(b=>b.id===bid)||{}).rev||1;
(function(){if(!oldFormat)return;const rv=state.rev=state.rev||{};BOOKS.forEach(b=>{if((rv[b.id]||1)===b.rev)return;['done','work','pos','t'].forEach(m=>Object.values(state[m]||{}).forEach(o=>{if(o&&typeof o==='object')delete o[b.id]}));Object.keys(state.last||{}).forEach(k=>{if(state.last[k]&&state.last[k].b===b.id)delete state.last[k]});rv[b.id]=b.rev;unsaved=true})})();
if(oldFormat)unsaved=true;
famInit();
/* allt sparas direkt: lokalt efter 250 ms, och direkt när appen göms (samtal, hemknapp, flikbyte) */
function curBook(){try{return R.b?R.b.id:null}catch(e){return null}}
function save(bid){unsaved=true;if(bid===undefined)bid=curBook();if(bid){const k=state.kid;(state.t[k]=state.t[k]||{})[bid]=Date.now();dirty.add(k+'~'+bid)}clearTimeout(saveT);saveT=setTimeout(flush,250)}
/* en annan flik kan ha sparat sedan vi skrev senast: slå ihop sida för sida (nyaste vinner, klara sidor läggs ihop) innan vi skriver */
let lastDisk=null;try{lastDisk=localStorage.getItem(KEY)}catch(e){}
function mergeOtherTab(){let raw=null;try{raw=localStorage.getItem(KEY)}catch(e){return}if(!raw||raw===lastDisk)return;let st=null;try{st=readDisk(raw)}catch(e){return}if(!st)return;
 if(st.fam&&famMerge(st.fam))setTimeout(()=>{try{renderShelf()}catch(e){}});
 Object.entries(st.work||{}).forEach(([kid,bs])=>Object.entries(bs||{}).forEach(([bid,W])=>{const L=((state.work[kid]=state.work[kid]||{})[bid]=state.work[kid][bid]||{});Object.entries(W||{}).forEach(([i,w])=>{if(w&&(!L[i]||(w.t||0)>(L[i].t||0)))L[i]=w})}));
 Object.entries(st.done||{}).forEach(([kid,bs])=>Object.entries(bs||{}).forEach(([bid,D])=>{const dd=doneSet(kid,bid);(D||[]).forEach(x=>{if(!dd.includes(x)&&!isUnd(kid,bid,x))dd.push(x)})}));
 Object.entries(st.und||{}).forEach(([k,o])=>{const u=state.und=state.und||{},L=u[k]=u[k]||{};Object.entries(o||{}).forEach(([x,t])=>{if((t||0)>(L[x]||0))L[x]=t})})}
function flush(){clearTimeout(saveT);saveT=null;if(unsaved){try{mergeOtherTab();const js=diskJSON();localStorage.setItem(KEY,js);lastDisk=js;unsaved=false;if(quotaFull){quotaFull=false;$('storeWarn').hidden=storeOK}}catch(e){quotaWarn()}}cloudPush(document.visibilityState==='hidden')}
/* fullt lagringsutrymme: säg till direkt i stället för att tyst sluta spara */
function quotaWarn(){if(!quotaFull){quotaFull=true;try{toast('Kunde inte spara – webbläsarens minne är fullt.')}catch(e){}}const w=$('storeWarn');if(w){w.textContent='Webbläsarens minne är fullt, så det senaste sparas inte här. Rensa några teckningar med suddet eller Rensa sidan.';w.hidden=false}}
/* en annan flik har sparat: läs in i stället för att skriva över med gammal data */
addEventListener('storage',e=>{if(e.key!==KEY||unsaved||!e.newValue)return;const k=state.kid;try{const st=readDisk(e.newValue);if(!st)return;state=st}catch(_){return}state.kid=k;if(!state.fam||!Array.isArray(state.fam.kids))state.fam={kids:[],t:0};famSetKids();if(R.b){document.querySelectorAll('#stage .ink').forEach(x=>x.innerHTML='');syncAll()}else renderShelf()});
const endInk=()=>{try{if(typeof drawing!=='undefined'&&drawing)endDraw()}catch(e){}};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){endInk();flush()}});addEventListener('pagehide',()=>{endInk();flush()});addEventListener('beforeunload',flush);
const doneSet=(kid,bid)=>{state.done[kid]=state.done[kid]||{};return state.done[kid][bid]=state.done[kid][bid]||[]};
const work=(bid,idx)=>{const k=state.kid;state.work[k]=state.work[k]||{};const b=state.work[k][bid]=state.work[k][bid]||{};const w=b[idx]=b[idx]||{f:{},s:[],ink:[]};w.t=Date.now();return w};
const peekWork=(bid,idx)=>((state.work[state.kid]||{})[bid]||{})[idx];
const bookProg=(kid,b)=>{const dd=((state.done[kid]||{})[b.id])||[];return {n:dd.length,tot:b.pages.length,full:dd.length>=b.pages.length,set:dd}};

/* ================= Hyllan ================= */
function heroArt(){const r=rng(5);let s=`<svg class="hero-art" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><rect width="1200" height="300" fill="#DCE8EA"/><circle cx="1010" cy="120" r="70" fill="#fff" opacity=".35"/><circle cx="1010" cy="120" r="44" fill="var(--a-sun)"/>`;
 s+=`<path d="M0 200 C200 170 380 186 560 196 C760 206 960 168 1200 182 L1200 300 L0 300Z" fill="#BFD3D3"/>`;
 for(let x=-10;x<1220;x+=ri(r,16,26))s+=spruce(x,214+ri(r,-4,4),ri(r,34,56),'#9FBDB4');
 for(let x=-20;x<1220;x+=ri(r,30,48)){const hh=ri(r,70,110);s+=spruce(x,250+ri(r,-3,3),hh,'var(--a-spruce)','var(--a-spruce2)')}
 s+=birchTree(140,262,120,9)+birchTree(166,262,92,6)+birchTree(1120,262,110,8);
 s+=`<path d="M0 246 C200 236 420 240 640 248 C860 256 1040 238 1200 242 L1200 300 L0 300Z" fill="var(--a-moss2)"/>`;
 s+=artIn('squirrel',300,190,70)+artIn('owl',820,186,72)+artIn('fox',560,184,76)+artIn('swallow',900,28,62)+artIn('mushroom',250,236,30)+artIn('flower',700,232,30);
 return s+'</svg>'}
function renderShelf(){if(typeof bbInvite==='function')setTimeout(bbInvite);
 const kid=KIDS.find(k=>k.id===state.kid);let pages=0,books=0;BOOKS.forEach(b=>{const p=bookProg(kid.id,b);pages+=p.n;if(p.full)books++});
 $('who').innerHTML=famReal().map(k=>`<button aria-pressed="${state.kid===k.id}" data-kid="${k.id}"><i>${famEsc(k.name[0].toUpperCase())}</i>${famEsc(k.name)}</button>`).join('')+`<button class="who-fam" data-fam="" aria-label="${famReal().length?'Ändra familjen':'Lägg till barn'}">${famReal().length?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span>Lägg till barn</span>'}</button><button class="who-acct" id="acctChip" data-fam="" ${ACCT.kind==='google-out'?'':'hidden'}>Logga in</button>`;
 const RD=document.documentElement.classList.contains('rd');
 $('progress').innerHTML=`<div class="stat"><b>${books}</b><span>av ${BOOKS.length} böcker klara</span></div><div class="stat"><b>${pages}</b><span>sidor gjorda av ${kid.name}</span></div>${RD?'':`<div class="lvls">${[1,2,3,4,5].map(l=>`<span>${paws(l)}${LEVEL[l].split('· ')[1]}</span>`).join('')}</div>`}`;
 const L=state.last[kid.id],lb=L&&BOOKS.find(b=>b.id===L.b);
 $('resume').innerHTML=lb&&L.i>0?`<button class="resume" data-book="${lb.id}" style="--sc:${SUBJ[lb.subj].color}"><span class="rs-cv">${coverPage(lb)}</span><span class="rs-t"><small>Fortsätt där ${kid.name} slutade</small><b>${lb.title}</b><span>Sida ${Math.min(L.i,lb.pages.length+2)} av ${buildPagesCount(lb)-1}</span></span><span class="rs-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></button>`:'';
 $('storeWarn').hidden=storeOK&&!quotaFull;if(rawBad){const w=$('storeWarn');w.textContent='Det sparade arbetet gick inte att läsa. En kopia finns kvar i webbläsaren.';w.hidden=false;rawBad=false}
 $('subjects').innerHTML=Object.entries(SUBJ).map(([k,s])=>{const c=CHAR[k],bs=BOOKS.filter(b=>b.subj===k),so=SOON.filter(b=>b.subj===k);
  return `<section class="subj" data-subj="${k}" style="--sc:${s.color}"><div class="subj-h"><span class="av">${artSvg(c.art)}</span><div><h2>${s.name} <em>med ${c.kind.toLowerCase()} ${c.name}</em></h2><p>${s.sub}</p></div></div><div class="books">${bs.map(b=>{const p=bookProg(kid.id,b);
   return `<button class="bk" data-book="${b.id}" aria-label="Öppna ${b.title}"><div class="bk-cv">${coverPage(b)}<span class="bk-lv">${paws(b.level)}<span>${LEVEL[b.level].split('· ')[1]}</span></span>${p.full?`<svg class="bk-stamp" viewBox="0 0 100 100" style="--sc:${s.color}">${stampSvg.replace('class="done"','')}</svg>`:''}</div><div class="bk-ledge"></div>${RD?`<div class="bk-meta"><span class="bk-tt">${b.title}</span><span class="bk-age">${paws(b.level)}<span>${LEVEL[b.level].split('· ')[1]}</span>${kid.fits.includes(b.level)?`<em class="fit">passar ${kid.name}</em>`:''}</span><div class="bk-prog"><div class="bk-bar" role="img" aria-label="${p.n} av ${p.tot} sidor klara"><i style="width:${Math.round(100*p.n/p.tot)}%"></i></div><small>${p.n}/${p.tot}</small></div></div>`:`<div class="bk-meta"><span class="bk-tt">${b.title}</span><div class="bk-bar" role="img" aria-label="${p.n} av ${p.tot} sidor klara"><i style="width:${Math.round(100*p.n/p.tot)}%"></i></div><div class="bk-sub"><span>${p.n} av ${p.tot} sidor</span>${kid.fits.includes(b.level)?`<span class="fit">Passar ${kid.name}</span>`:''}</div></div>`}</button>`}).join('')}${so.map(b=>`<div class="bk soon" aria-label="${b.title}, kommer snart"><div class="bk-cv"><b>${b.title}</b><span>Kommer snart</span></div></div>`).join('')}</div></section>`}).join('');
}
document.addEventListener('click',e=>{const k=e.target.closest('[data-kid]');if(k){state.kid=k.dataset.kid;save(null);renderShelf();return}const b=e.target.closest('[data-book]');if(b){rememberShelfY();openBook(b.dataset.book)}});
function rememberShelfY(){try{if(!R.b)sessionStorage.setItem('sk-y',String(Math.round(window.scrollY)))}catch(e){}}

/* ================= Läsaren ================= */
const R={b:null,pages:[],idx:0,mode:'point',color:'#2F3B4F',orient:'portrait'};
let PF=null,lastInk=null,lastTouch=null;
/* page-flip 2.0.7 släpper inte sin renderloop vid destroy(): stoppa den (patchad i vendor/) och släpp referenserna */
function killPF(){if(!PF)return;try{const r=PF.getRender();r.__stop=true;r.render=()=>{};for(const k in r)if(r[k]&&typeof r[k]=='object')r[k]=null;try{removeEventListener('resize',PF.getUI().onResize)}catch(_){}PF.destroy()}catch(e){}PF=null}
const buildPagesCount=b=>b.pages.length+3+(b.facit?facitChunks(b).length:0);
let pushed=false,booting=true;try{history.scrollRestoration='manual'}catch(e){}
function openBook(id,at){if(document.fonts&&document.fonts.status!=='loaded'){document.fonts.ready.then(()=>openBook(id,at));return}const b=BOOKS.find(x=>x.id===id);if(!b)return;R.b=b;R.pages=buildPages(b);
 const pos=(state.pos[state.kid]||{})[id]||0;R.idx=at!=null?at:Math.min(pos,R.pages.length-1);
 $('shelf').hidden=true;$('reader').hidden=false;$('rtitle').textContent=b.title;$('reader').style.setProperty('--sc',SUBJ[b.subj].color);
 $('printRoot').innerHTML=R.pages.join('');setMode('point');mountFlip(R.idx);
 try{sessionStorage.setItem('sk-open',id)}catch(e){}
 try{if(!pushed){if(booting&&history.state&&history.state.sk)pushed=true;else if(ignorePop)pendingPush=true;else{history.pushState({sk:id},'');pushed=true}}}catch(e){}}
function closeBook(fromPop){if(!R.b)return;drawing=null;facitOpen=false;flush();killPF();$('stage').innerHTML='';$('reader').hidden=true;$('shelf').hidden=false;R.b=null;renderShelf();
 try{sessionStorage.removeItem('sk-open')}catch(e){}
 if(pushed&&!fromPop){pushed=false;ignorePop=true;try{history.back()}catch(e){ignorePop=false}}else pushed=false;let y=0;try{y=+sessionStorage.getItem('sk-y')||0}catch(e){}window.scrollTo(0,y);requestAnimationFrame(()=>window.scrollTo(0,y));setTimeout(()=>window.scrollTo(0,y),120)}
let ignorePop=false,pendingPush=false;
/* stänger man en bok och öppnar en ny direkt väntar vi in history.back() innan den nya boken får en egen historikpost */
addEventListener('popstate',()=>{if(ignorePop){ignorePop=false;if(pendingPush&&R.b){pendingPush=false;try{history.pushState({sk:R.b.id},'');pushed=true}catch(e){}}return}if(R.b){pushed=false;closeBook(true)}});
$('back').onclick=()=>closeBook();
/* Större sida: på liggande skärm visas en sida i full bredd som man skrollar i, i stället för ett uppslag. Standard på pekskärm. */
let FIT=(()=>{try{const v=localStorage.getItem('sk-fit');if(v)return v==='1'}catch(e){}return matchMedia('(pointer:coarse)').matches})();
function mountFlip(start){
 killPF();
 const st=$('stage');st.innerHTML='';lastSz=st.clientWidth+'x'+st.clientHeight;const W=st.clientWidth-10,H=st.clientHeight-10;
 const land=W/H>1.12,fit=FIT&&land;st.classList.toggle('fitw',fit);const fb=$('fit');if(fb){fb.hidden=!land;fb.setAttribute('aria-pressed',fit);fb.querySelector('span').textContent=fit?'Två sidor':'Större sida'}const spread=!fit&&W>=720&&land;const pw=Math.max(200,Math.floor(fit?Math.min(W-14,Math.max(H*1.15,520)):spread?Math.min(W/2,H*210/297):Math.min(W,H*210/297))),ph=Math.round(pw*297/210);
 const root=document.createElement('div');root.className='stf';root.style.width=(spread?pw*2:pw)+'px';root.style.height=ph+'px';
 R.pages.forEach((h,i)=>{const d=document.createElement('div');d.className='page';d.dataset.idx=i;if(i===0||i===R.pages.length-1)d.dataset.density='hard';d.innerHTML=h;root.appendChild(d)});
 st.appendChild(root);
 if(typeof St==='undefined'){fallbackPager(root,start);return}
 PF=new St.PageFlip(root,{width:pw,height:ph,size:'fixed',showCover:true,usePortrait:!spread,drawShadow:true,maxShadowOpacity:.32,flippingTime:820,useMouseEvents:false,mobileScrollSupport:fit,autoSize:false,startPage:start});
 PF.on('flip',e=>{R.idx=e.data;if(st.classList.contains('fitw'))st.scrollTop=0;afterTurn()});PF.on('changeOrientation',e=>{R.orient=e.data;afterTurn()});
 PF.loadFromHTML(root.querySelectorAll('.page'));R.orient=PF.getOrientation?PF.getOrientation():(spread?'landscape':'portrait');
 R.idx=PF.getCurrentPageIndex();afterTurn();
}
function fallbackPager(root,start){const pages=[...root.children];R.idx=start;const show=()=>{pages.forEach((p,i)=>p.style.display=i===R.idx?'block':'none');afterTurn()};R.flipNext=()=>{if(R.idx<pages.length-1){R.idx++;show()}};R.flipPrev=()=>{if(R.idx>0){R.idx--;show()}};show()}
function visible(){const n=R.pages.length,i=R.idx;if(R.orient!=='landscape')return [i];if(i===0)return [0];const l=i%2?i:i-1;return [l,l+1].filter(x=>x<n)}
const next=()=>{if(PF)PF.flipNext('bottom');else R.flipNext&&R.flipNext()};
const prev=()=>{if(PF)PF.flipPrev('bottom');else R.flipPrev&&R.flipPrev()};
$('next').onclick=next;$('prev').onclick=prev;
document.addEventListener('keydown',e=>{if($('reader').hidden||e.target.matches('input'))return;if(e.key==='ArrowRight')next();else if(e.key==='ArrowLeft')prev();else if(e.key==='Escape')closeBook()});
let sx=null,sy=null;
$('stage').addEventListener('touchstart',e=>{if(R.mode!=='point'||e.touches.length>1||e.target.closest('input,.sel,button')){sx=null;return}sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
$('stage').addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)(dx<0?next:prev)();sx=null},{passive:true});
let rz=null,lastSz='';const typing=()=>document.activeElement&&document.activeElement.matches&&document.activeElement.matches('#stage input');
function maybeRemount(){if(!R.b)return;const st=$('stage'),sz=st.clientWidth+'x'+st.clientHeight;if(sz===lastSz)return;if(typing())return;lastSz=sz;mountFlip(R.idx)}
new ResizeObserver(()=>{if(!R.b)return;clearTimeout(rz);rz=setTimeout(maybeRemount,220)}).observe($('stage'));
document.addEventListener('focusout',e=>{if(e.target.matches&&e.target.matches('#stage input'))setTimeout(maybeRemount,400)});

/* Sidorna mäts i 640 px (fitPages), men på en telefon kan texten brytas annorlunda (iOS). Mät de synliga sidorna
   i verklig storlek och krymp lite till om något sticker ut ner i sidfoten. Ändrar bara visningen, inte sidorna. */
function refitVisible(){const idx=visible();document.querySelectorAll('#stage .page').forEach(d=>{if(!idx.includes(+d.dataset.idx))return;const pb=d.querySelector('.pb');if(!pb||!pb.clientHeight)return;
 let z=parseFloat(pb.style.zoom)||1,n=0;while(n<8&&z>.62&&pb.scrollHeight>pb.clientHeight+2){z=Math.max(.62,z*.96);pb.style.zoom=z.toFixed(3);n++}})}
function afterTurn(){if(!R.b)return;facitPaint();requestAnimationFrame(refitVisible);const n=R.pages.length,vis=visible();const k=state.kid;(state.pos[k]=state.pos[k]||{})[R.b.id]=R.idx;state.last[k]={b:R.b.id,i:R.idx};save(null);
 $('rcount').textContent=vis.length===2?`Sida ${vis[0]}–${vis[1]} av ${n-1}`:(vis[0]===0?'Omslag':`Sida ${vis[0]} av ${n-1}`);
 $('prev').disabled=R.idx<=0;$('next').disabled=vis[vis.length-1]>=n-1;
 const dd=doneSet(state.kid,R.b.id);const acts=vis.filter(i=>i>=2&&i<2+R.b.pages.length);
 $('donebar').innerHTML=acts.length?acts.map(i=>{const kd=pageKindAt(i),on=dd.includes(i-2),lab=acts.length>1?`Sida ${i} `:'';
  /* auto: appen rättar, ingen knapp. self/mixed: barnet trycker själv (samma som stjärnan på sidan) */
  return `<span class="score" data-score="${i}" hidden></span>${kd==='auto'?(on?`<span class="done-auto">${lab}✓ Klar</span>`:''):`<button class="done-t" data-done="${i-2}" aria-pressed="${on}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${lab}${on?'Klar':'Jag är klar'}</button>`}`}).join(''):`<span class="done-hint">${vis[0]===0?'Bläddra för att börja':''}</span>`;
 syncAll();updScore();if(!afterTurn.inCheck){afterTurn.inCheck=1;try{acts.forEach(i=>checkPage(i))}finally{afterTurn.inCheck=0}}}
/* lägg in sparat arbete i alla sid-noder (StPageFlip kan klona sidor) */
function syncAll(){if(!R.b)return;const dd=doneSet(state.kid,R.b.id),kid=KIDS.find(k=>k.id===state.kid),full=dd.length>=R.b.pages.length;
 document.querySelectorAll('#stage .page').forEach(pg=>{const idx=+pg.dataset.idx,w=peekWork(R.b.id,idx);const P=pg.querySelector('.pg');if(!P)return;
  const pi=P.dataset.pi;if(pi!==undefined)P.classList.toggle('isdone',dd.includes(+pi));
  P.querySelectorAll('[data-st]').forEach(e=>e.classList.toggle('on',dd.includes(+e.dataset.st)));
  P.querySelectorAll('input[data-k]').forEach(inp=>{const v=w&&w.f[inp.dataset.k]||'';if(inp.value!==v)inp.value=v;mark(inp)});
  /* ett felval som sparats av en äldre version tas bort, annars kan stjärnan aldrig komma */
  if(w&&w.s.length){const okC=new Set([...P.querySelectorAll('.sel[data-ok]')].map(selCls));if(okC.size){const bad=[...P.querySelectorAll('.sel[data-k]:not([data-ok]):not(.memo)')].filter(x=>okC.has(selCls(x))&&w.s.includes(+x.dataset.k));if(bad.length){bad.forEach(x=>{const j=w.s.indexOf(+x.dataset.k);if(j>=0)w.s.splice(j,1)});save()}}}
  P.querySelectorAll('.sel[data-k]').forEach(s=>s.classList.toggle('on',!!(w&&w.s.includes(+s.dataset.k))));
  P.querySelectorAll('input[data-k]').forEach(inp=>{if(inp!==document.activeElement)commit(inp)});paintMatches(P,w);needMarksIn(P);memoGot(P);
  const ink=P.querySelector('.ink');if(ink){const want=w?w.ink.length:0;if(ink.childElementCount!==want)ink.innerHTML=w?w.ink.map((s,i)=>strokeEl(s,i)).join(''):''}
  const nm=P.querySelector('[data-name]');if(nm){nm.textContent=full?kid.name:'';const h=P.querySelector('.dip-hint');if(h)h.textContent=full?`Grattis ${kid.name}! Alla sidor är klara.`:`Namnet skrivs dit när alla sidor är klara (${dd.length} av ${R.b.pages.length}).`}
 })}
const norm=v=>v.trim().toLowerCase().replace(/\s+/g,' ').replace(/[.!?,]+$/,'');
/* Fält med klassen loose godtar svaret i en hel mening ("Katten heter Sigge", "35 kr", "två katter", "klockan tre"):
   svaret måste finnas som hela ord, och meningen får inte innehålla nej-ord eller andra svar/ordbanksord från samma sida. */
const NUMW={noll:0,ett:1,en:1,två:2,tre:3,fyra:4,fem:5,sex:6,sju:7,åtta:8,nio:9,tio:10,elva:11,tolv:12,tretton:13,fjorton:14,femton:15,sexton:16,sjutton:17,arton:18,nitton:19,tjugo:20};
const NEG=new Set(['inte','ej','nej','aldrig','ingen','inget','inga','not','no','never']);
const toks=s=>norm(s).replace(/(\d)([a-zåäö])/gi,'$1 $2').split(/[^0-9a-zåäöéü:]+/i).filter(Boolean);
/* småord som får finnas i flera svar utan att svaret räknas som fel */
const LOOSE_STOP=new Set('han hon den det de en ett var är i på till och för att som med av om så sen the a an is it he she they in on at to of and'.split(' '));
function looseOk(inp,v,alts){const vt=toks(v);if(!vt.length||vt.length>9||vt.some(t=>NEG.has(t)))return false;const pg=inp.closest('.pg');const own=new Set(alts.flatMap(toks));
 /* ord ur den egna frågan räknas också som egna */
 const tr=inp.closest('.tray');if(tr){const q=tr.querySelector('p');if(q)toks(q.textContent).forEach(t=>own.add(t))}LOOSE_STOP.forEach(t=>own.add(t));
 const other=new Set();if(pg){pg.querySelectorAll('input[data-a]').forEach(o=>{if(o!==inp)o.dataset.a.split('|').flatMap(toks).forEach(t=>{if(!own.has(t))other.add(t)})});pg.querySelectorAll('.chip,.bank span').forEach(c=>toks(c.textContent).forEach(t=>{if(!own.has(t))other.add(t)}))}
 if(vt.some(t=>other.has(t)))return false;
 return alts.some(x=>{const at=toks(x);if(!at.length)return false;
  if(at.length===1&&/^\d+(:\d+)?$/.test(at[0])){const nums=vt.map(t=>NUMW[t]!==undefined?String(NUMW[t]):t).filter(t=>/^\d+(:\d+)?$/.test(t));const want=at[0].replace(/^0(\d)/,'$1');return nums.length===1&&(nums[0]===want||nums[0].replace(/:00$/,'')===want||nums[0].replace(/^0(\d)/,'$1').replace(/:00$/,'')===want)}
  /* inga andra tal än i facit ("tre fyra fem" är inte "tre"), och inga klockord som ändrar tiden ("fem i fyra" är inte "fyra") */
  const nm=t=>t==='en'||t==='ett'?null:NUMW[t]!==undefined?String(NUMW[t]):/^\d+(:\d+)?$/.test(t)?t.replace(/^0(\d)/,'$1'):null;
  const an=new Set(at.map(nm).filter(Boolean));if(vt.some(t=>{const n=nm(t);return n&&!an.has(n)}))return false;
  if(an.size&&vt.some(t=>CLOCKW.has(t)&&!at.includes(t)))return false;
  for(let i=0;i+at.length<=vt.length;i++)if(at.every((t,j)=>vt[i+j]===t))return true;return false})}
const CLOCKW=new Set(['i','över','halv','kvart','minuter','minut']);
function mark(inp){const a=inp.dataset.a;if(!a){inp.classList.remove('ok');return}const cs=inp.classList.contains('case'),num=a.split('|').every(x=>/^\d+$/.test(x.trim())),f=x=>cs?x.trim().replace(/\s+/g,' ').replace(/[.!?,]+$/,''):num?norm(x).replace(/\s+/g,'').replace(/^0+(?=\d)/,''):norm(x);const v=f(inp.value);const alts=a.split('|');
 inp.classList.toggle('ok',!!v&&(alts.some(x=>f(x)===v)||(inp.classList.contains('loose')&&!cs&&looseOk(inp,inp.value,alts))))}
document.addEventListener('input',e=>{const inp=e.target;if(!R.b||!inp.matches('#stage input[data-k]'))return;const idx=+inp.closest('.page').dataset.idx;lastTouch=idx;work(R.b.id,idx).f[inp.dataset.k]=inp.value;mark(inp);
 document.querySelectorAll(`#stage .page[data-idx="${idx}"] input[data-k="${inp.dataset.k}"]`).forEach(o=>{if(o!==inp){o.value=inp.value;mark(o)}});save();if(inp.classList.contains('ok'))checkPage(idx)});
const selCls=s=>s.className.replace(/\b(on|no)\b/g,'').replace(/\s+/g,' ').trim();
function wrongTap(s,idx,k){const pg=s.closest('.pg');if(!pg||s.hasAttribute('data-ok'))return false;const c=selCls(s);if(![...pg.querySelectorAll('.sel[data-ok]')].some(o=>selCls(o)===c))return false;const q=`#stage .page[data-idx="${idx}"] .sel[data-k="${k}"]`;document.querySelectorAll(q).forEach(o=>o.classList.add('on','no'));const bid=R.b&&R.b.id;
 /* felvalet visas en stund men sparas aldrig: då kan det inte ligga kvar och blockera stjärnan om sidan laddas om */
 setTimeout(()=>{if(!R.b||R.b.id!==bid)return;document.querySelectorAll(q).forEach(o=>{const w=(((state.work[state.kid]||{})[bid]||{})[idx]);if(!w||!w.s.includes(k))o.classList.remove('on','no')});checkPage(idx);updScore()},1100);return true}
function toggleSel(s){const idx=+s.closest('.page').dataset.idx,k=+s.dataset.k,w=work(R.b.id,idx),i=w.s.indexOf(k);lastTouch=idx;if(i<0&&!s.classList.contains('memo')&&wrongTap(s,idx,k)){updScore();return}if(i>=0)w.s.splice(i,1);else w.s.push(k);save();
 document.querySelectorAll(`#stage .page[data-idx="${idx}"] .sel[data-k="${k}"]`).forEach(o=>{o.classList.toggle('on',i<0);if(i>=0)o.classList.remove('no')});needMarks(idx);checkPage(idx);updScore()}
/* memory: ett kort i taget vänds. Två kort som inte hör ihop vänds tillbaka efter en stund. */
let memoBusy=false;
function memoGot(P){const ups=[...P.querySelectorAll('.sel.memo.on')];P.querySelectorAll('.sel.memo').forEach(c=>c.classList.toggle('got',c.classList.contains('on')&&ups.some(o=>o.dataset.pair===c.dataset.pair&&o.dataset.k!==c.dataset.k)))}
function memoTap(s){if(memoBusy||s.classList.contains('on'))return;toggleSel(s);const pg=s.closest('.pg');if(!pg)return;memoGot(pg);const ups=[...pg.querySelectorAll('.sel.memo.on')];const lone=ups.filter(c=>!ups.some(o=>o!==c&&o.dataset.pair===c.dataset.pair&&o.dataset.k!==c.dataset.k));
 if(lone.length>=2){memoBusy=true;const bid=R.b&&R.b.id,ks=[...new Set(lone.map(c=>c.dataset.k))];setTimeout(()=>{memoBusy=false;if(!R.b||R.b.id!==bid)return;ks.forEach(k=>{const c=pg.querySelector(`.sel.memo[data-k="${k}"]`);if(c&&c.classList.contains('on'))toggleSel(c)})},1100)}}
const tapSel=s=>s.classList.contains('memo')?memoTap(s):toggleSel(s);
/* på en telefon blir svarsbrickorna små: ett tryck strax bredvid en bricka räknas som ett tryck på den närmaste, om den är ensam närmast */
function nearSel(e){if(!e.isTrusted||e.target.closest('input,button,a,.sel,.klar,.fac-hold'))return null;const pg=e.target.closest('#stage .page');if(!pg)return null;
 const x=e.clientX,y=e.clientY,R0=matchMedia('(pointer:coarse)').matches?14:6;let best=null,bd=1e9,nd=1e9;
 pg.querySelectorAll('.sel').forEach(s=>{const r=s.getBoundingClientRect();if(!r.width)return;const d=Math.hypot(Math.max(r.left-x,0,x-r.right),Math.max(r.top-y,0,y-r.bottom));if(d<bd){nd=bd;bd=d;best=s}else if(d<nd)nd=d});
 return best&&bd<=R0&&nd-bd>=6?best:null}
$('stage').addEventListener('click',e=>{if(R.mode!=='point')return;const s=e.target.closest('.sel')||nearSel(e);if(s)tapSel(s)});
$('stage').addEventListener('keydown',e=>{const s=e.target.closest('.sel');if(s&&(e.key==='Enter'||e.key===' ')){e.preventDefault();tapSel(s)}});
function pageKindAt(idx){const P=document.querySelector(`#stage .page[data-idx="${idx}"] .pg`);return P&&P.dataset.check||'self'}
/* barnet bockar själv av en sida (knappen eller stjärnan). Rättade delar måste vara rätt först, och på sidor med något att göra måste något vara gjort. */
function selfDone(pi){if(!R.b)return;const idx=pi+2,P=document.querySelector(`#stage .page[data-idx="${idx}"] .pg`);if(!P)return;const kd=P.dataset.check;if(kd==='auto')return;
 /* ett dubbeltryck ska inte bocka av och sedan på igen */const now=Date.now();if(now-(selfDone.t||0)<900)return;selfDone.t=now;
 const dd=doneSet(state.kid,R.b.id),i=dd.indexOf(pi);if(i>=0){dd.splice(i,1);setUnd(state.kid,R.b.id,pi,true);save();afterTurn();return}
 if(kd==='mixed'){const sc=pageScore(idx);if(sc&&sc.ok<sc.tot){toast(`Titta på svaren först: ${sc.ok} av ${sc.tot} rätt.`);return}}
 if(P.dataset.work){const w=peekWork(R.b.id,idx);const did=w&&(w.ink.length||w.s.length||Object.values(w.f).some(v=>v&&String(v).trim()));if(!did){toast('Gör uppgiften först. Sedan trycker du på stjärnan.');return}}
 dd.push(pi);setUnd(state.kid,R.b.id,pi,false);save();afterTurn();cheer(dd,kd!=='auto'?'self':false)}
$('donebar').addEventListener('click',e=>{const t=e.target.closest('[data-done]');if(!t)return;selfDone(+t.dataset.done)});
$('stage').addEventListener('click',e=>{const k=e.target.closest('.klar');if(!k||R.mode!=='point')return;const P=k.closest('.pg');if(!P||P.dataset.pi===undefined)return;
 if(P.dataset.check==='auto'){toast(P.classList.contains('isdone')?'Den här sidan är klar!':'Stjärnan kommer av sig själv när allt är rätt.');return}selfDone(+P.dataset.pi)});
/* när allt som går att rätta på en sida är rätt bockas sidan av automatiskt */
function checkPage(idx){if(!R.b)return;const pg=document.querySelector(`#stage .page[data-idx="${idx}"] .pg`);if(!pg||pg.dataset.pi===undefined)return;const pi=+pg.dataset.pi;
 const ins=[...pg.querySelectorAll('input[data-a]')].filter(i=>i.dataset.a),oks=[...pg.querySelectorAll('.sel[data-ok]')],needs=[...pg.querySelectorAll('[data-need]')];if(!ins.length&&!oks.length&&!needs.length&&!pg.querySelector('.match[data-ans]'))return;if(pg.dataset.check==='mixed'){updScore();return}
 const okCls=new Set(oks.map(selCls)),bad=[...pg.querySelectorAll('.sel.on:not([data-ok])')].filter(s=>okCls.has(selCls(s))).length;
 const mt=matchState(pg,idx);const all=ins.every(i=>i.classList.contains('ok'))&&oks.every(s=>s.classList.contains('on'))&&!bad&&needs.every(n=>n.querySelectorAll('.sel.on').length===+n.dataset.need)&&mt.ok===mt.tot;updScore();const dd=doneSet(state.kid,R.b.id);
 if(all&&!dd.includes(pi)){dd.push(pi);save();afterTurn();cheer(dd,true)}}
let toastT=null;function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2600)}
function cheer(dd,auto){const kid=KIDS.find(k=>k.id===state.kid);if(dd.length>=R.b.pages.length)toast(`Hela boken är klar, ${kid.name}! Diplomet finns på sista sidan.`);else if(auto==='self')toast(['Bra jobbat!','Snyggt!','Toppen!','Fint gjort!'][dd.length%4]);else if(auto)toast(['Bra jobbat!','Allt rätt!','Snyggt!','Toppen!'][dd.length%4]+' Sidan är klar.')}

/* ---------- penna och sudd ---------- */
const strokeEl=(s,i)=>`<path data-s="${i}" d="M${s.p.reduce((a,v,j)=>a+(j%2?','+v:(j?' L':'')+v),'')}" stroke="${s.c}" stroke-width="${s.w||7}"/>`;
let drawing=null;
let penAt=0;
document.addEventListener('pointerdown',e=>{const ink=e.target.closest('#stage .ink');if(!ink||!R.b)return;if(e.pointerType==='pen')penAt=Date.now();else if(e.pointerType==='touch'&&Date.now()-penAt<2500)return;
 /* pennan vinner över en handflata som landade först; ett streck som aldrig fick pointerup (samtal, systemgest) låser inte pennan */
 if(drawing){const stale=Date.now()-(drawing.t0||0)>4000;if(e.pointerType==='pen'&&drawing.pt!=='pen'){try{drawing.el&&drawing.el.remove()}catch(_){}drawing=null}else if(stale)endDraw();else return}const page=ink.closest('.page'),idx=+page.dataset.idx;
 if(R.mode==='erase'){eraseAt(e,idx);drawing={erase:true,idx};return}
 if(R.mode!=='pen')return;e.preventDefault();try{ink.setPointerCapture&&ink.setPointerCapture(e.pointerId)}catch(_){}
 const rc=ink.getBoundingClientRect(),pt=[Math.round((e.clientX-rc.left)/rc.width*1000),Math.round((e.clientY-rc.top)/rc.height*1414)];
 const el=document.createElementNS('http://www.w3.org/2000/svg','path');el.setAttribute('stroke',R.color);el.setAttribute('stroke-width',R.color==='#F5CB5C'?14:7);el.setAttribute('d',`M${pt[0]},${pt[1]} L${pt[0]+.1},${pt[1]}`);ink.appendChild(el);
 drawing={ink,rc,el,idx,p:[...pt],id:e.pointerId,x0:e.clientX,y0:e.clientY,moved:0,pt:e.pointerType,t0:Date.now()}});
document.addEventListener('pointermove',e=>{if(!drawing||(drawing.id!=null&&e.pointerId!==drawing.id))return;if(e.pointerType==='pen')penAt=Date.now();if(drawing.erase){const ink=document.elementFromPoint(e.clientX,e.clientY);if(ink&&ink.closest&&ink.closest('.ink'))eraseAt(e,drawing.idx);return}
 drawing.moved=Math.max(drawing.moved,Math.abs(e.clientX-drawing.x0)+Math.abs(e.clientY-drawing.y0));const {rc,p,el}=drawing,x=Math.round((e.clientX-rc.left)/rc.width*1000),y=Math.round((e.clientY-rc.top)/rc.height*1414);const lx=p[p.length-2],ly=p[p.length-1];if(Math.abs(x-lx)+Math.abs(y-ly)<4)return;p.push(x,y);el.setAttribute('d',el.getAttribute('d')+` L${x},${y}`)});
const endDraw=e=>{if(!drawing)return;if(drawing.erase&&!e){drawing=null;return}if(e&&drawing.id!=null&&e.pointerId!==drawing.id)return;
 if(!drawing.erase&&drawing.moved<8&&tapThrough(drawing.x0,drawing.y0)){drawing.el.remove();drawing=null;return}
 if(!drawing.erase&&drawing.p.length>=2){const w=work(R.b.id,drawing.idx);if(drawing.p.length===2)drawing.p.push(drawing.p[0]+1,drawing.p[1]);w.ink.push({c:R.color,w:R.color==='#F5CB5C'?14:7,p:drawing.p});drawing.el.setAttribute('data-s',w.ink.length-1);lastInk=drawing.idx;const g=penGesture(drawing,w,w.ink.length-1);save();syncAll();if(g)checkPage(drawing.idx);updScore()}drawing=null};
document.addEventListener('pointerup',endDraw);document.addEventListener('pointercancel',endDraw);
/* ett tryck med pennan på en ruta eller ett val fungerar som ett vanligt tryck */
function tapThrough(x,y){const rd=$('reader'),cls=rd.className;rd.classList.remove('pen','erase');let hit=null;try{hit=document.elementsFromPoint(x,y).find(el=>el.matches&&el.matches('#stage input[data-k],#stage .sel'))}catch(e){}rd.className=cls;if(!hit)return false;
 if(hit.matches('input')){hit.focus();try{hit.setSelectionRange(hit.value.length,hit.value.length)}catch(e){}}else tapSel(hit);return true}
function eraseAt(e,idx){const el=document.elementFromPoint(e.clientX,e.clientY);const p=el&&el.closest&&el.closest('.ink path[data-s]');if(!p)return;const pg=p.closest('.page');if(pg)idx=+pg.dataset.idx;const w=work(R.b.id,idx),si=+p.dataset.s;w.ink.splice(si,1);dropPairs(w,si);save();document.querySelectorAll(`#stage .page[data-idx="${idx}"] .ink`).forEach(i=>i.innerHTML='');syncAll()}
function setMode(m){R.mode=m;$('reader').classList.toggle('pen',m==='pen');$('reader').classList.toggle('erase',m==='erase');document.querySelectorAll('#modes [data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m));$('colors').hidden=m!=='pen'}
$('modes').addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)setMode(b.dataset.mode)});
$('colors').addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;R.color=b.dataset.c;document.querySelectorAll('#colors [data-c]').forEach(x=>x.setAttribute('aria-pressed',x===b));setMode('pen')});
$('undo').onclick=()=>{const vis=visible();
 /* Ångra direkt efter Rensa sidan tar tillbaka sidan */if(clearUndo&&R.b&&clearUndo.bid===R.b.id&&clearUndo.kid===state.kid&&vis.includes(clearUndo.i)){const ci=clearUndo.i,cw=work(R.b.id,ci);if(!cw.ink.length&&!cw.s.length&&!Object.values(cw.f||{}).some(Boolean)){Object.assign(cw,clearUndo.w,{t:Date.now()});clearUndo=null;document.querySelectorAll(`#stage .page[data-idx="${ci}"] .ink`).forEach(x=>x.innerHTML='');save();syncAll();updScore();return}}const idx=vis.includes(lastInk)?lastInk:vis.slice().reverse().find(i=>(peekWork(R.b.id,i)||{ink:[]}).ink.length);if(idx==null)return;const w=peekWork(R.b.id,idx);if(!w||!w.ink.length)return;w.ink.pop();dropPairs(w,w.ink.length);save();syncAll();updScore()};
let clearArm=null,clearArmT=0,clearUndo=null;$('clear').onclick=()=>{const b=$('clear');if(clearArm&&Date.now()-clearArmT<600)return;if(!clearArm){clearArmT=Date.now();b.classList.add('warn');b.lastChild.textContent='Tryck igen för att rensa';clearArm=setTimeout(()=>{clearArm=null;b.classList.remove('warn');b.lastChild.textContent='Rensa sidan'},3000);return}
 clearTimeout(clearArm);clearArm=null;b.classList.remove('warn');b.lastChild.textContent='Rensa sidan';const vis=visible(),has=vis.filter(i=>{const w=peekWork(R.b.id,i);return w&&(w.ink.length||w.s.length||Object.values(w.f||{}).some(Boolean))});const i=has.includes(lastTouch)?lastTouch:has.includes(lastInk)?lastInk:has[has.length-1];if(i==null)return;
 const w=work(R.b.id,i);clearUndo={bid:R.b.id,kid:state.kid,i,w:JSON.parse(JSON.stringify(w))};w.f={};w.s=[];w.ink=[];w.m=[];document.querySelectorAll(`#stage .page[data-idx="${i}"] .ink`).forEach(x=>x.innerHTML='');save();syncAll()};

/* ================= Molnsparning: följer med mellan enheter och överlever rensad webbläsardata ================= */
let DB=null,UID=null,pushT=null,pushing=false;
/* Slår ihop ett molndokument med det lokala, sida för sida: den nyaste versionen av varje sida vinner, klara sidor läggs ihop.
   Molnets data() är fryst, så den djupkopieras först. Tomma streck från molnet ersätter aldrig lokala streck
   (teckningar kan ha skurits bort för att dokumentet blev för stort). Svarar {changed,push}. */
function cloudMerge(id,raw){const v=JSON.parse(JSON.stringify(raw||{}));const [kid,bid]=String(id).split('~');const bk=BK(bid);if(!kid||!bid||!bk)return null;
 if(v.fmt===2){v.work=unpackWork(bk,v.work,kid);v.done=unpackDone(bk,v.done,kid)}else if((+v.rev||1)!==bookRev(bid))return {changed:false,push:true};
 const lt=(state.t[kid]||{})[bid]||0,rt=+v.t||0;let changed=false,push=lt>rt;
 const W=(state.work[kid]=state.work[kid]||{}),L=W[bid]=W[bid]||{},RW=v.work&&typeof v.work==='object'?v.work:{};
 for(const [i,pw] of Object.entries(RW)){const lw=L[i];if(!pw||typeof pw!=='object')continue;if(!lw||(pw.t||0)>(lw.t||0)){if(lw&&lw.ink&&lw.ink.length&&!(pw.ink&&pw.ink.length)){pw.ink=lw.ink;if(lw.m&&!(pw.m&&pw.m.length))pw.m=lw.m;push=true}L[i]=pw;changed=true}else if((lw.t||0)>(pw.t||0))push=true}
 for(const i of Object.keys(L))if(!RW[i])push=true;
 const D=(state.done[kid]=state.done[kid]||{}),dd=D[bid]=D[bid]||[];const rd=Array.isArray(v.done)?v.done:[];rd.forEach(x=>{if(!dd.includes(x)&&!isUnd(kid,bid,x)){dd.push(x);changed=true}});if(dd.length>rd.length)push=true;
 if(rt>lt&&typeof v.pos==='number')(state.pos[kid]=state.pos[kid]||{})[bid]=v.pos;(state.t[kid]=state.t[kid]||{})[bid]=Math.max(lt,rt);
 return {changed,push}}
function cloudApplied(){/* via flush: en annan fliks nyare arbete slås ihop först */unsaved=true;try{mergeOtherTab();const js=diskJSON();localStorage.setItem(KEY,js);lastDisk=js;unsaved=false}catch(e){quotaWarn()}if(R.b){document.querySelectorAll('#stage .ink').forEach(x=>x.innerHTML='');afterTurn()}else renderShelf()}
/* claude.ai: artefaktens databas. Egen webbplats: Firebase (fbInit i family.js). Båda går genom cloudStart. */
async function cloudInit(){try{if(!window.claude||typeof claude.use!=='function'){fbInit();return}const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);if(!db||!user)return;const uid=await user.id();if(!uid)return;
 if(await cloudStart(db,uid))acctSet('claude')}catch(e){DB=null}}
async function cloudStart(db,uid){try{
 const snap=await db.collection('data/users/'+uid).get();DB=db;UID=uid;let changed=false;const seen=new Set();
 [state.done,state.work].forEach(m=>Object.entries(m||{}).forEach(([kid,bs])=>Object.keys(bs||{}).forEach(bid=>{state.t[kid]=state.t[kid]||{};if(!state.t[kid][bid])state.t[kid][bid]=1})));
 let famSeen=false;snap.docs.forEach(d=>{if(!d.exists)return;if(d.id==='familj'){famSeen=true;if(famMerge(d.data()))changed=true;return}seen.add(d.id);const r=cloudMerge(d.id,d.data());if(!r)return;if(r.changed)changed=true;if(r.push)dirty.add(d.id)});
 if(!famSeen&&state.fam.kids.length)famDirty=true;
 Object.entries(state.t).forEach(([kid,m])=>Object.keys(m||{}).forEach(bid=>{if(!seen.has(kid+'~'+bid))dirty.add(kid+'~'+bid)}));
 if(famAfterCloud())changed=true;
 if(changed){famSetKids();cloudApplied()}
 cloudPush();return true}catch(e){DB=null;return false}}
/* väntar tills allt som väntar har skickats (utloggning) */
async function cloudSettle(){for(let i=0;i<40&&DB&&(pushing||dirty.size||famDirty);i++){cloudPush(true);await new Promise(r=>setTimeout(r,250))}}
function cloudPush(now){if(!DB||(!dirty.size&&!famDirty))return;clearTimeout(pushT);const run=async()=>{if(pushing){pushT=setTimeout(run,800);return}pushing=true;const keys=[...dirty];dirty.clear();
 /* familjen först: slå ihop med molnets version och skriv */if(famDirty){famDirty=false;try{const cur=await DB.doc('data/users/'+UID+'/familj').get();if(cur&&cur.exists&&famMerge(cur.data()))setTimeout(()=>{try{renderShelf()}catch(e){}});famDirty=false;await DB.doc('data/users/'+UID+'/familj').set(famCloudBody())}catch(e){famDirty=true;if(e&&/not_granted|revoked|capability|invalid.argument|permission.denied|unauthenticated/.test(e.code||''))DB=null}}
 let merged=false;for(const key of keys){const [kid,bid]=key.split('~');const bk=BK(bid);if(!bk)continue;
  /* läs molnets version och slå ihop innan vi skriver: en annan enhet kan ha sparat sedan start */try{const cur=await DB.doc('data/users/'+UID+'/'+key).get();if(cur&&cur.exists){const r=cloudMerge(key,cur.data());if(r&&r.changed)merged=true}}catch(e){}/* rev -1: en äldre app som fortfarande är öppen läser inte de nya nycklarna som sidindex */const body={fmt:2,rev:-1,t:(state.t[kid]||{})[bid]||Date.now(),done:packDone(bk,(state.done[kid]||{})[bid],kid),work:packWork(bk,(state.work[kid]||{})[bid],kid),pos:(state.pos[kid]||{})[bid]||0};
  if(JSON.stringify(body).length>240000){const w={};Object.entries(body.work).forEach(([i,x])=>w[i]={f:x.f||{},s:x.s||[],ink:[],t:x.t||0});body.work=w;body.inkCut=1}
  try{await DB.doc('data/users/'+UID+'/'+key).set(body)}catch(e){keys.slice(keys.indexOf(key)).forEach(k=>dirty.add(k));if(e&&/not_granted|revoked|capability|invalid.argument|permission.denied|unauthenticated/.test(e.code||''))DB=null;break}}
 pushing=false;if(merged)cloudApplied()};if(now)run();else pushT=setTimeout(run,1500)}

/* ================= Start ================= */
if(typeof HEROIMG!=='undefined'&&HEROIMG.hero_group){$('heroArt').innerHTML=`<img src="${HEROIMG.hero_group}" alt="Ekorren Ebba, ugglan Otto, räven Ruben och svalan Siri i en skogsglänta" decoding="async">`}else{$('heroArt').outerHTML=heroArt()}
renderShelf();
const h=location.hash.slice(1);
if(!h.startsWith('press-')&&!h.startsWith('print-'))setTimeout(famBoot);
if(h.startsWith('press-')){/* tryckfiler: #press-<id>-cv (omslag med utfall) och #press-<id>-in (inlagan) */const [,id,part]=h.split('-');const b=BOOKS.find(x=>x.id===id);if(b){document.documentElement.classList.add('print-mode','press-'+part);(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{$('printRoot').innerHTML=part==='cv'?coverPage(b)+backPage(b):buildPages(b).slice(1).join('')+fillerPage(b)+fitPages([introNoFacit(b)]).join('');document.documentElement.dataset.ready='1'})}}
else if(h.startsWith('print-')){const b=BOOKS.find(x=>x.id===h.slice(6));if(b){document.documentElement.classList.add('print-mode');(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{$('printRoot').innerHTML=buildPages(b).join('');document.documentElement.dataset.ready='1'})}}
/* Boken öppnas först när hela skriptet har körts (mikrouppgift). Annars når openBook let/const längre ner (facitOpen, Bokbinderiet) innan de finns, och uppstarten kraschar vid omladdning med typsnitten i cache. */
let bootBook=null;
if(!h.startsWith('press-')&&!h.startsWith('print-')){if(h&&BOOKS.some(b=>b.id===h))bootBook=h;else{let o=null;try{o=sessionStorage.getItem('sk-open')}catch(e){}if(o&&BOOKS.some(b=>b.id===o))bootBook=o}}
if(bootBook)queueMicrotask(()=>{try{openBook(bootBook)}finally{booting=false}});else booting=false;
$('resume').addEventListener('click',e=>{const b=e.target.closest('[data-book]');if(b){e.stopPropagation();rememberShelfY();openBook(b.dataset.book)}});
/* engelska ord läses upp med webbläsarens talsyntes */
const canSay='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;if(!canSay)document.documentElement.classList.add('nosay');
let enVoice=null;function pickVoice(){try{const v=speechSynthesis.getVoices();enVoice=v.find(x=>/en[-_]GB/i.test(x.lang))||v.find(x=>/^en/i.test(x.lang))||null}catch(e){}}
if(canSay){pickVoice();try{speechSynthesis.addEventListener('voiceschanged',pickVoice)}catch(e){}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-say]');if(!b)return;e.stopPropagation();e.preventDefault();if(!canSay)return;
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(b.dataset.say);u.lang=enVoice?enVoice.lang:'en-GB';if(enVoice)u.voice=enVoice;u.rate=.8;document.querySelectorAll('[data-say].talk').forEach(x=>x.classList.remove('talk'));b.classList.add('talk');u.onend=u.onerror=()=>b.classList.remove('talk');speechSynthesis.speak(u)}catch(err){}},true);
cloudInit();

/* ================= Återkoppling: rätt, fel och hur långt man kommit ================= */
/* en ruta rättas när barnet är klart med den (Enter eller lämnar rutan), aldrig mitt i skrivandet */
function commit(inp){const v=(inp.value||'').trim();inp.classList.toggle('no',!!v&&!!inp.dataset.a&&!inp.classList.contains('ok'))}
document.addEventListener('input',e=>{if(e.target.matches&&e.target.matches('#stage input[data-k]'))e.target.classList.remove('no')},true);
document.addEventListener('focusout',e=>{const t=e.target;if(t.matches&&t.matches('#stage input[data-k]')){commit(t);updScore()}});
document.addEventListener('keydown',e=>{const t=e.target;if(e.key!=='Enter'||!t.matches||!t.matches('#stage input[data-k]'))return;e.preventDefault();commit(t);const all=[...t.closest('.pg').querySelectorAll('input[data-k]')];const nx=all[all.indexOf(t)+1];if(nx){nx.focus();try{nx.setSelectionRange(nx.value.length,nx.value.length)}catch(_){}}else t.blur();updScore()});
/* rader där man ska trycka på rätt antal */
function needMarksIn(P){P.querySelectorAll('[data-need]').forEach(n=>{const c=n.querySelectorAll('.sel.on').length,want=+n.dataset.need;n.classList.toggle('met',c===want);n.classList.toggle('over',c>want)})}
function needMarks(idx){document.querySelectorAll(`#stage .page[data-idx="${idx}"] .pg`).forEach(needMarksIn)}
/* dra streck med pennan: prickarna i .match blir ett svar */
const inPoly=(p,poly)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>p[1])!==(yj>p[1]))&&(p[0]<(xj-xi)*(p[1]-yi)/((yj-yi)||1e-6)+xi))c=!c}return c};
function penGesture(d,w,si){const pg=d.ink.closest('.page');if(!pg)return null;const rc=d.rc,pts=[];for(let i=0;i+1<d.p.length;i+=2)pts.push([rc.left+d.p[i]/1000*rc.width,rc.top+d.p[i+1]/1414*rc.height]);if(pts.length<2)return null;
 const a=pts[0],b=pts[pts.length-1];
 const dots=[...pg.querySelectorAll('.match[data-ans] .mdot')];
 if(dots.length){const near=pt=>{let best=null,bd=1e9;dots.forEach(el=>{const r=el.getBoundingClientRect(),dd=Math.hypot(r.left+r.width/2-pt[0],r.top+r.height/2-pt[1]);if(dd<bd){bd=dd;best=el}});return bd<rc.width*.07?best:null};
  const da=near(a),db=near(b);if(da&&db&&da!==db){const L=da.dataset.ml!=null?da:(db.dataset.ml!=null?db:null),Rt=da.dataset.mr!=null?da:(db.dataset.mr!=null?db:null);
   if(L&&Rt&&L.closest('.match')===Rt.closest('.match')){const bx=[...pg.querySelectorAll('.match[data-ans]')].indexOf(L.closest('.match')),l=+L.dataset.ml,r=+Rt.dataset.mr;w.m=(w.m||[]).filter(x=>!(x.b===bx&&(x.l===l||x.r===r)));w.m.push({b:bx,l,r,s:si});return 'match'}}}
 const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]),bw=Math.max(...xs)-Math.min(...xs),bh=Math.max(...ys)-Math.min(...ys);
 if(pts.length>=8&&bw>12&&bh>12&&Math.hypot(a[0]-b[0],a[1]-b[1])<Math.max(bw,bh)*.5){const hits=[...pg.querySelectorAll('.sel[data-k]:not(.memo)')].filter(s=>{const r=s.getBoundingClientRect();return r.width&&inPoly([r.left+r.width/2,r.top+r.height/2],pts)});
  if(hits.length&&hits.length<=4){hits.forEach(s=>{if(!s.classList.contains('on'))toggleSel(s)});return 'circle'}}
 return null}
function dropPairs(w,si){if(!w.m)return;w.m=w.m.filter(x=>x.s!==si).map(x=>x.s>si?Object.assign({},x,{s:x.s-1}):x)}
function paintMatches(P,w){P.querySelectorAll('.match[data-ans]').forEach((m,bx)=>{const ans=m.dataset.ans.split(',').map(Number);m.querySelectorAll('.mdot').forEach(d=>d.classList.remove('ok','no'));((w&&w.m)||[]).filter(x=>x.b===bx).forEach(x=>{const ok=ans[x.l]===x.r;const l=m.querySelector(`[data-ml="${x.l}"]`),r=m.querySelector(`[data-mr="${x.r}"]`);[l,r].forEach(el=>el&&el.classList.add(ok?'ok':'no'))})})}
function matchState(P,idx){const w=peekWork(R.b.id,idx);let ok=0,tot=0;P.querySelectorAll('.match[data-ans]').forEach((m,bx)=>{const ans=m.dataset.ans.split(',').map(Number);tot+=ans.length;ans.forEach((j,i)=>{if(((w&&w.m)||[]).some(x=>x.b===bx&&x.l===i&&x.r===j))ok++})});return {ok,tot}}
/* "3 av 6 rätt" för sidorna som syns */
function pageScore(idx){const P=document.querySelector(`#stage .page[data-idx="${idx}"] .pg`);if(!P||P.dataset.pi===undefined)return null;const ins=[...P.querySelectorAll('input[data-a]')].filter(i=>i.dataset.a),oks=[...P.querySelectorAll('.sel[data-ok]')],needs=[...P.querySelectorAll('[data-need]')],mt=matchState(P,idx);
 const tot=ins.length+oks.length+needs.length+mt.tot;if(!tot)return null;const ok=ins.filter(i=>i.classList.contains('ok')).length+oks.filter(s=>s.classList.contains('on')).length+needs.filter(n=>n.querySelectorAll('.sel.on').length===+n.dataset.need).length+mt.ok;return {ok,tot}}
function updScore(){if(!R.b)return;document.querySelectorAll('#donebar [data-score]').forEach(el=>{const sc=pageScore(+el.dataset.score);el.textContent=sc?`${sc.ok} av ${sc.tot} rätt`:'';el.classList.toggle('full',!!sc&&sc.ok===sc.tot);el.hidden=!sc})}

/* Facit: i appen bakom ett lås för vuxna (håll in i 3 s + en räknefråga som barnen inte klarar). Öppet tills boken stängs. I utskrift syns facit alltid. */
let facitOpen=false,facHoldT=null,facAns=null;
function facitPaint(){document.querySelectorAll('#stage .pg.facit').forEach(p=>p.classList.toggle('open',facitOpen))}
function facAsk(lock){const a=12+Math.floor(Math.random()*8),b=6+Math.floor(Math.random()*4);facAns=a*b;lock.querySelectorAll('.fac-qt').forEach(q=>q.textContent=`Vad är ${a} · ${b}?`);const q=lock.querySelector('.fac-q');q.hidden=false;lock.querySelector('.fac-hold').hidden=true;const hs=lock.querySelector(':scope>span');if(hs)hs.hidden=true;const inp=q.querySelector('.fac-in');inp.value='';setTimeout(()=>inp.focus(),30)}
function facTry(lock){const inp=lock.querySelector('.fac-in');if(+inp.value.trim()===facAns){facitOpen=true;facitPaint()}else{inp.classList.add('no');setTimeout(()=>inp.classList.remove('no'),700);facAsk(lock)}}
$('stage').addEventListener('pointerdown',e=>{const h=e.target.closest('.fac-hold');if(!h)return;e.stopPropagation();e.preventDefault();h.classList.add('holding');clearTimeout(facHoldT);facHoldT=setTimeout(()=>{h.classList.remove('holding');facAsk(h.closest('.fac-lock'))},3000)},true);
['pointerup','pointercancel','pointerleave'].forEach(ev=>$('stage').addEventListener(ev,e=>{const h=e.target.closest&&e.target.closest('.fac-hold');if(!h)return;clearTimeout(facHoldT);h.classList.remove('holding')},true));
$('stage').addEventListener('click',e=>{const g=e.target.closest('.fac-go');if(g){e.stopPropagation();facTry(g.closest('.fac-lock'))}},true);
$('stage').addEventListener('keydown',e=>{if(e.target.matches('.fac-in')&&e.key==='Enter'){e.preventDefault();facTry(e.target.closest('.fac-lock'))}},true);

$('fit')&&$('fit').addEventListener('click',()=>{FIT=!FIT;try{localStorage.setItem('sk-fit',FIT?'1':'0')}catch(e){}if(R.b){flush&&flush();mountFlip(R.idx)}});
