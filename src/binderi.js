/* ================= Bokbinderiet =================
   Gör en riktig bok av en Skogsskolan-bok: välj bok, namn, bindning och facit, och få tryckfärdiga PDF:er.
   Sidorna kommer från bokens käll-PDF (print/<id>.pdf, byggd med tools/press.py) och sätts ihop här i webbläsaren
   med pdf-lib, så att namnet kan skrivas på första sidan. Filerna sparas via artefaktens downloads-förmåga. */
const BB={open:false,bid:null,subj:null,name:'',bind:'spiral',facit:'in',duplex:true,man:null,manErr:false,src:new Map(),files:null,busy:false};
const BINDS={
 spiral:{t:'Spiral',d:'Ligger platt när barnet skriver. Hårda pärmar fram och bak. Beställ hos ett tryckeri eller en kopieringsbutik.',tag:'Bäst att skriva i'},
 hard:{t:'Hårda pärmar',d:'Inbunden med hårda pärmar. Snyggast i bokhyllan, men sidorna ligger inte platt och tryckeriet behöver göra mer.',tag:'Finast'},
 home:{t:'Skriv ut hemma',d:'Hela boken i en fil för din egen skrivare. Häfta eller sätt i en pärm.',tag:'Billigast'}};
const BICON={
 spiral:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="7" width="27" height="35" rx="3"/><path d="M17 15h17M17 21h17M17 27h11"/>'+[11,17,23,29,35].map(y=>`<path d="M15 ${y}c-4 0-6 1.5-6 3s2 3 6 3"/>`).join('')+'</svg>',
 hard:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6h25a3 3 0 0 1 3 3v31a2 2 0 0 1-2 2H12z"/><path d="M12 6v36M16 6v36"/><path d="M21 15h13M21 21h9"/></svg>',
 home:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V7h20v11"/><rect x="7" y="18" width="34" height="15" rx="3"/><path d="M14 28h20v13H14z"/><path d="M18 33h12M18 37h8"/></svg>'};
const bbBook=()=>BOOKS.find(b=>b.id===BB.bid)||BOOKS[0];
const bbRange=([a,b])=>Array.from({length:Math.max(0,b-a)},(_,i)=>a+i);
const bbEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bbMB=n=>(n/1048576).toFixed(1).replace('.',',')+' MB';

/* boken som färdig produkt: produktfoto i skogsmiljö (Recraft) där omslaget läggs exakt på den tomma pärmen med
   en perspektivmatris och multipliceras, så att ljus, skuggor, spiral och gem från fotot syns igenom */
function bbMock(b,bind,cls=''){return `<div class="mk mk-photo mk-${bind} ${cls}" data-bind="${bind}" style="--sc:${SUBJ[b.subj].color}"><img class="mk-img" src="${MOCK2IMG[bind]}" alt="" draggable="false"><div class="mk-cv">${coverPage(b)}</div></div>`}
function bbSq2Quad(p){const [x0,y0]=p[0],[x1,y1]=p[1],[x2,y2]=p[2],[x3,y3]=p[3];const dx1=x1-x2,dx2=x3-x2,dy1=y1-y2,dy2=y3-y2,sx=x0-x1+x2-x3,sy=y0-y1+y2-y3;let g=0,h=0;
 if(Math.abs(sx)>1e-9||Math.abs(sy)>1e-9){const d=dx1*dy2-dx2*dy1;g=(sx*dy2-dx2*sy)/d;h=(dx1*sy-sx*dy1)/d}
 return [x1-x0+g*x1,x3-x0+h*x3,x0,y1-y0+g*y1,y3-y0+h*y3,y0,g,h]}
function bbWarp(el){const q=MOCK2Q[el.dataset.bind],cv=el.querySelector('.mk-cv');if(!q||!cv)return;const W=el.clientWidth,H=el.clientHeight,cw=cv.offsetWidth,ch=cv.offsetHeight;if(!W||!cw)return;
 const [a,b,c,d,e,f,g,h]=bbSq2Quad([q.tl,q.tr,q.br,q.bl].map(([x,y])=>[x*W,y*H]));
 cv.style.transform=`matrix3d(${a/cw},${d/cw},0,${g/cw},${b/ch},${e/ch},0,${h/ch},0,0,1,0,${c},${f},0,1)`}
const BBRO=typeof ResizeObserver!=='undefined'?new ResizeObserver(es=>es.forEach(e=>bbWarp(e.target))):null;
function bbWarpAll(){document.querySelectorAll('.mk-photo').forEach(el=>{bbWarp(el);if(BBRO&&!el.__ro){el.__ro=1;BBRO.observe(el)}})}
addEventListener('resize',()=>bbWarpAll());
/* en riktig uppgiftssida ur boken: den med flest bilder bland de första sidorna */
const BBPEEK={};function bbPeekPage(b){if(BBPEEK[b.id])return BBPEEK[b.id];let best=0,bn=-1;b.pages.slice(0,8).forEach((pg,k)=>{const h=actPage(b,pg,k+2,k),n=(h.match(/<use /g)||[]).length;if(n>bn){bn=n;best=k}});return BBPEEK[b.id]=actPage(b,b.pages[best],best+2,best)}

/* vad som hamnar i filerna, utan att röra PDF:en: används både för sammanfattningen och sammansättningen */
function bbPlan(){const b=bbBook(),m=BB.man&&BB.man[b.id];if(!m)return null;const L=m.lay,nf=L.facit[1]-L.facit[0];
 const facit=nf?BB.facit:'none';const inner=[facit==='in'?L.intro:L.intro2,...bbRange(L.acts),...(facit==='in'?bbRange(L.facit):[]),L.dip];
 const duplex=BB.bind!=='home'||BB.duplex;if(duplex&&inner.length%2)inner.push(L.fill);
 const files=[];const title=b.title.replace(/[\/\\:*?"<>|]/g,'').trim();
 if(BB.bind==='home'){const all=duplex?[L.front,'blank',...inner,'blank',L.back]:[L.front,...inner,L.back];files.push({kind:'all',name:`${title} – hela boken.pdf`,list:all,trim:true,label:'Hela boken',meta:`${all.length} sidor · A4${duplex?' · dubbelsidigt':''}`})}
 else{files.push({kind:'inner',name:`${title} – inlaga.pdf`,list:inner,label:'Inlagan',meta:`${inner.length} sidor · A4 · dubbelsidigt`});
  files.push({kind:'cover',name:`${title} – omslag.pdf`,list:[L.front,L.back],label:'Omslaget',meta:'fram- och baksida · 3 mm utfall'})}
 if(facit==='sep'){const fl=bbRange(L.facit);files.push({kind:'facit',name:`${title} – facit.pdf`,list:fl,label:'Facit',meta:`${fl.length} ${fl.length>1?'sidor':'sida'} · A4 · för den vuxne`})}
 return {b,m,inner,files,nf,duplex,facit}}

function bbSpec(){const p=bbPlan(),b=bbBook();if(!p)return `${b.title} · A4`;const n=p.inner.length+(BB.bind==='home'?0:2);
 return `${b.title} · ${p.inner.length} sidor inlaga · ${Math.ceil(p.inner.length/(p.duplex?2:1))} ark A4${BB.bind!=='home'?' + omslag':''}`}

function bbOrderText(){const p=bbPlan();if(!p)return '';const b=p.b,inl=p.inner.length;
 if(BB.bind==='home')return `Öppna "${b.title} – hela boken.pdf" och skriv ut i färg på A4.
Välj "Faktisk storlek" (100 %) – inte "Anpassa till sida".${p.duplex?'\nDubbelsidigt: vänd längs långsidan.':''}
Papper: 120 g gör att pennan inte syns igenom. Omslaget blir finast på 200–250 g om skrivaren klarar det.
Häfta två gånger i vänsterkanten, eller hålslå och sätt i en pärm.`;
 const facit=p.facit==='sep'?`\nFacit: "${b.title} – facit.pdf", enkelsidigt på vanligt papper, löst (ska inte bindas in).`:'';
 if(BB.bind==='spiral')return `Hej! Jag vill beställa 1 ex av en spiralbunden bok i A4.
Inlaga: "${b.title} – inlaga.pdf", ${inl} sidor, färg, dubbelsidigt, 120 g obestruket papper.
Omslag: "${b.title} – omslag.pdf", sida 1 är framsidan och sida 2 baksidan. Tryck dem på var sitt ark 300 g kartong, enkelsidigt, gärna matt laminerade. Filen har 3 mm utfall och skärs till A4.
Bindning: wire-o (dubbelspiral) längs vänster långsida, med omslagen som första och sista blad.${facit}
Filerna är PDF i RGB-färg. Säg till om ni behöver något annat.
Tack!`;
 return `Hej! Jag vill beställa 1 ex av en bok i A4 med hårda pärmar.
Inlaga: "${b.title} – inlaga.pdf", ${inl} sidor, färg, dubbelsidigt, 120 g obestruket papper.
Omslag: "${b.title} – omslag.pdf", sida 1 är framsidan och sida 2 baksidan, med 3 mm utfall.
Bindning: inbindning med hårda pärmar. Jag vill ha framsidan och baksidan på pärmarna. Om ni kascherar och behöver ett omslag i ett stycke med rygg och omvik, kan ni göra det av de här två sidorna?${facit}
Filerna är PDF i RGB-färg. Säg till om ni behöver något annat.
Tack!`}

function bbRender(){const b=bbBook(),s=SUBJ[b.subj];const P=$('binderi');P.style.setProperty('--sc',s.color);
 $('bbStage').innerHTML=`<div class="mk-wrap">${bbMock(b,BB.bind,'mk-big')}<div class="bb-peek"><div id="bbPeek"></div><span>En sida ur boken</span></div></div>`;requestAnimationFrame(bbWarpAll);
 const subj=BB.subj||b.subj;
 $('bbSubj').innerHTML=Object.entries(SUBJ).map(([k,v])=>`<button class="bb-chip" data-subj="${k}" aria-pressed="${k===subj}" style="--sc:${v.color}">${v.name}</button>`).join('');
 $('bbShelf').innerHTML=BOOKS.filter(x=>x.subj===subj).map(x=>`<button class="bb-pick" data-bid="${x.id}" aria-pressed="${x.id===b.id}" aria-label="${bbEsc(x.title)}"><span class="bb-pick-cv">${coverPage(x)}</span><span class="bb-pick-t">${x.title}</span><span class="bb-pick-l">${paws(x.level)}</span></button>`).join('');
 $('bbBind').innerHTML=Object.entries(BINDS).map(([k,v])=>`<button class="bb-bind" data-bind="${k}" aria-pressed="${BB.bind===k}"><span class="bb-bind-ic">${BICON[k]}</span><span class="bb-bind-t"><b>${v.t}</b><em>${v.tag}</em></span><span class="bb-bind-d">${v.d}</span></button>`).join('');
 const p=bbPlan();const hasF=!p||p.nf>0;$('bbFacitRow').hidden=!hasF;
 $('bbFacit').innerHTML=[['in','I boken'],['sep','Eget blad'],['none','Utan facit']].map(([k,t])=>`<button data-facit="${k}" aria-pressed="${BB.facit===k}">${t}</button>`).join('');
 $('bbDuplexRow').hidden=BB.bind!=='home';$('bbDuplex').checked=BB.duplex;
 $('bbSpec').textContent=bbSpec();
 $('bbPeek').innerHTML=`<div class="bb-peek-pg" inert style="--sc:${s.color}">${bbPeekPage(b)}</div>`;
 $('bbGuideTitle').textContent=BB.bind==='home'?'Så skriver du ut hemma':'Så beställer du hos ett tryckeri';
 {const ot=bbOrderText();$('bbOrder').textContent=ot;const gd=document.querySelector('.bb-guide');if(gd)gd.hidden=!ot}
 const ok=!!p;$('bbMake').disabled=!ok||BB.busy;$('bbMakeNote').textContent=BB.manErr?'Tryckfilerna kunde inte hämtas just nu. Prova att ladda om sidan.':!BB.man?'Hämtar tryckfilerna …':!ok?'Den här boken har ingen tryckfil ännu.':'Filerna skapas här i webbläsaren. Det tar några sekunder.';
 bbShowFiles()}
function bbPeekName(){const o=document.querySelector('#bbPeek .owner');if(o)o.innerHTML=BB.name?`<span class="owner-name">${bbEsc(BB.name)}</span>`:''}

function bbShowFiles(){const R2=$('bbResult');if(!BB.files){R2.hidden=true;R2.innerHTML='';return}R2.hidden=false;
 R2.innerHTML=`<div class="bb-res-h"><b>Klart!</b> ${BB.files.length>1?`${BB.files.length} filer`:'En fil'} att spara.</div>${BB.files.map((f,i)=>`<div class="bb-file"><span class="bb-file-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg><i>PDF</i></span><span class="bb-file-t"><b>${f.label}</b><small>${f.meta} · ${bbMB(f.blob.size)}</small></span><button class="bb-save" data-file="${i}" aria-pressed="${!!f.saved}">${f.saved?'Sparad':'Spara'}</button></div>`).join('')}${BB.files.length>1?'<button class="bb-saveall" id="bbSaveAll">Spara alla</button>':''}`}

let bbDL;function bbDownloads(){if(bbDL===undefined)bbDL=(window.claude&&typeof claude.use==='function')?claude.use('downloads').catch(()=>null):Promise.resolve(null);return bbDL}
async function bbSave(i){const f=BB.files&&BB.files[i];if(!f)return false;const dl=await bbDownloads();
 if(dl){try{await dl.save({filename:f.name,data:f.blob});f.saved=true;bbShowFiles();return true}catch(e){const c=e&&e.code;if(c==='declined')return false;if(c==='rate_limited'){toast('Spara den förra filen först.');return false}if(!/unavailable|not_granted|capability/.test(c||'')){toast('Filen kunde inte sparas.');return false}}}
 try{const u=URL.createObjectURL(f.blob);const a=document.createElement('a');a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);f.saved=true;bbShowFiles();return true}catch(e){toast('Filen kunde inte sparas här.');return false}}

let PDFLIB=null;function bbPdfLib(){if(!PDFLIB){const s=document.createElement('script');s.textContent=$('pdflibsrc').textContent;document.head.appendChild(s);PDFLIB=window.PDFLib}return PDFLIB}
async function bbManifest(){if(BB.man||BB.manErr)return;try{const r=await fetch('print/manifest.json',{cache:'no-cache'});if(!r.ok)throw 0;BB.man=await r.json()}catch(e){BB.manErr=true}if(BB.open)bbRender()}
async function bbSource(id){if(!BB.src.has(id))BB.src.set(id,fetch('print/'+id+'.pdf').then(r=>{if(!r.ok)throw new Error('fetch');return r.arrayBuffer()}).catch(e=>{BB.src.delete(id);throw e}));return BB.src.get(id)}
/* namnet ritas med bokens rubrikstil i en bild och läggs på linjen "Den här boken tillhör" */
async function bbNameImage(name){try{await document.fonts.load('600 150px Fraunces')}catch(e){}const fs=150,c=document.createElement('canvas'),x=c.getContext('2d');x.font=`600 ${fs}px Fraunces, Georgia, serif`;
 const w=Math.ceil(x.measureText(name).width)+24;c.width=w;c.height=Math.ceil(fs*1.32);x.font=`600 ${fs}px Fraunces, Georgia, serif`;x.fillStyle='#26322E';x.textBaseline='alphabetic';x.fillText(name,12,Math.round(fs*1.02));
 const blob=await new Promise(r=>c.toBlob(r,'image/png'));return {bytes:new Uint8Array(await blob.arrayBuffer()),w,h:c.height,base:fs*1.02,fs}}

/* valen när bindningen startade: ändras de under tiden kastas resultatet, så att filerna alltid stämmer med panelen */
const bbSig=()=>JSON.stringify([BB.bid,BB.bind,BB.facit,BB.duplex,BB.name.trim()]);
async function bbMake(){const p=bbPlan();if(!p||BB.busy)return;BB.busy=true;const sig=bbSig();BB.files=null;bbShowFiles();const btn=$('bbMake');btn.disabled=true;btn.classList.add('working');$('bbStage').querySelector('.mk')?.classList.add('binding');
 const step=t=>{$('bbMakeNote').textContent=t};
 try{step('Hämtar sidorna …');const buf=await bbSource(p.b.id);const {PDFDocument}=bbPdfLib();const src=await PDFDocument.load(buf);
  if(src.getPageCount()!==p.m.pages)throw new Error('count');
  const nm=BB.name.trim();const nimg=nm?await bbNameImage(nm):null;const out=[];
  for(const f of p.files){step(`Binder ${f.label.toLowerCase()} …`);const doc=await PDFDocument.create();doc.setTitle(`${p.b.title} – Skogsskolan`);doc.setAuthor(nm?`${nm}s bok`:'Skogsskolan');doc.setCreator('Skogsskolan · Bokbinderiet');
   const want=f.list.filter(x=>x!=='blank');const pages=await doc.copyPages(src,want);let k=0;let png=null;
   for(const it of f.list){if(it==='blank'){doc.addPage([595.28,841.89]);continue}const pg=pages[k++];doc.addPage(pg);
    if(f.trim&&(it===p.m.lay.front||it===p.m.lay.back)){const W=pg.getWidth(),H=pg.getHeight(),bl=8.504;[pg.setMediaBox,pg.setCropBox,pg.setTrimBox,pg.setBleedBox].forEach(fn=>fn.call(pg,bl,bl,W-2*bl,H-2*bl))}
    if(nimg&&(it===p.m.lay.intro||it===p.m.lay.intro2)){if(!png)png=await doc.embedPng(nimg.bytes);const [bx,by,bw,bh]=it===p.m.lay.intro2&&p.m.name2?p.m.name2:p.m.name;const sc=Math.min(bh*.78/nimg.fs,(bw-8)/nimg.w);
     pg.drawImage(png,{x:bx+2-12*sc,y:by+bh*.14-(nimg.h-nimg.base)*sc,width:nimg.w*sc,height:nimg.h*sc})}}
   const bytes=await doc.save();out.push(Object.assign({},f,{blob:new Blob([bytes],{type:'application/pdf'})}))}
  if(bbSig()!==sig){step('Valen ändrades medan boken bands. Tryck på knappen igen.');BB.files=null;return}
  BB.files=out;step('Klart. Spara filerna och lämna dem till tryckeriet.');if(BB.bind==='home')step('Klart. Spara filen och skriv ut.')}
 catch(e){step(e&&e.message==='count'?'Tryckfilen för den här boken är inte uppdaterad. Försök igen senare.':'Det gick inte att skapa filerna. Kontrollera nätet och försök igen.');BB.files=null}
 finally{BB.busy=false;btn.disabled=false;btn.classList.remove('working');$('bbStage').querySelector('.mk')?.classList.remove('binding');bbShowFiles();if(BB.files)$('bbResult').scrollIntoView({behavior:'smooth',block:'nearest'})}}

function bbOpen(bid){BB.bid=bid||(R.b&&R.b.id)||(state.last[state.kid]&&state.last[state.kid].b)||BOOKS[0].id;BB.subj=null;BB.files=null;BB.open=true;
 try{const kid=KIDS.find(k=>k.id===state.kid);if(!BB.name&&kid&&!BB.nameTouched)BB.name=kid.name}catch(e){}
 $('bbName').value=BB.name;$('binderi').hidden=false;document.documentElement.classList.add('bb-open');bbRender();bbManifest();$('binderi').scrollTop=0;setTimeout(()=>$('bbClose').focus(),50)}
function bbClose(){if(!BB.open)return;BB.open=false;$('binderi').hidden=true;document.documentElement.classList.remove('bb-open')}

/* händelser */
$('binderi').addEventListener('click',e=>{const t=e.target;let x;
 if(x=t.closest('[data-subj]')){BB.subj=x.dataset.subj;bbRender();return}
 if(x=t.closest('[data-bid]')){BB.bid=x.dataset.bid;BB.subj=null;BB.files=null;bbRender();return}
 if(x=t.closest('[data-bind]')){BB.bind=x.dataset.bind;BB.files=null;bbRender();return}
 if(x=t.closest('[data-facit]')){BB.facit=x.dataset.facit;BB.files=null;bbRender();return}
 if(x=t.closest('[data-file]')){bbSave(+x.dataset.file);return}
 if(t.closest('#bbSaveAll')){(async()=>{for(let i=0;i<BB.files.length;i++){if(BB.files[i].saved)continue;const ok=await bbSave(i);if(!ok)break}})();return}
 if(t.closest('#bbCopy')){const txt=$('bbOrder').textContent;const done=()=>toast('Texten är kopierad.');try{navigator.clipboard.writeText(txt).then(done,()=>{bbSelect();toast('Markerad – kopiera med Ctrl+C.')})}catch(err){bbSelect()}return}
 if(t.closest('#bbClose'))bbClose()});
function bbSelect(){const r=document.createRange();r.selectNodeContents($('bbOrder'));const s=getSelection();s.removeAllRanges();s.addRange(r)}
$('bbName').addEventListener('input',e=>{BB.name=e.target.value.slice(0,24);BB.nameTouched=true;BB.files=null;bbPeekName();bbShowFiles()});
$('bbDuplex').addEventListener('change',e=>{BB.duplex=e.target.checked;BB.files=null;bbRender()});
$('bbMake').addEventListener('click',bbMake);
document.addEventListener('keydown',e=>{if(BB.open&&e.key==='Escape'){e.stopImmediatePropagation();bbClose()}},true);
addEventListener('popstate',()=>{if(BB.open)bbClose()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-open-binderi]');if(t){e.preventDefault();bbOpen(t.dataset.openBinderi||undefined)}});
/* inbjudan på hyllan: två riktiga omslag som färdiga böcker */
function bbInvite(){const el=$('bbiArt');if(!el)return;const hb=$('heroBB');const kid=state.kid,last=state.last[kid]&&BOOKS.find(b=>b.id===state.last[kid].b);const a=last||BOOKS.find(b=>b.id==='g1')||BOOKS[0],b2=BOOKS.find(b=>b.subj!==a.subj&&b.level===a.level)||BOOKS[1];
 el.innerHTML=bbMock(b2,'hard','mk-back')+bbMock(a,'spiral','mk-front');if(hb)hb.innerHTML=artFit('bokbinderi',13,13,true);requestAnimationFrame(bbWarpAll)}
bbInvite();
