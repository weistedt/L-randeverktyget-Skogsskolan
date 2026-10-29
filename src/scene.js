/* ===== Skogsstigen – årstiderna singlar ner (redesign 2026-10-29, v5) =====
   En stillbild av löv, snöflingor och vårblad som singlar ner över hyllan, som
   ett fruset ögonblick. Motiven ligger utspridda på olika djup (små och mjuka
   långt bort, några stora och suddiga närmast), sitter fast på sidan och rullar
   med innehållet. Årstiderna följer varandra nedåt: höst, vinter, vår, sommar …
   Lövet dalar och vickar lite på stället, snöflingorna skimrar av frost. Placeringen är slumpad men densamma varje gång (fast frö).
   Ängsbakgrunden från v2 ligger i assets/bank/. */
const RD_PREVIEW=false; // true visar knappen "Visa gamla/nya designen" (bara för förhandsvisning)
// Årstid per avsnitt uppifrån och ned (heron är sommar, så första avsnittet är höst).
const RD_SEASONS=['host','vinter','var','sommar','host','vinter','var','sommar'];
const RD_KIT={host:['leaf_maple','leaf_autumn','leaf_oak','leaf_autumn','leaf_maple'],vinter:['snow'],var:['leaf','leaf_birch','leaf'],sommar:['butterfly','ladybug','bee']};
function rdOn(){return document.documentElement.classList.contains('rd')}
function rdRand(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%100000)/100000}}
function rdSky(){const shelf=$('shelf');if(!shelf)return;shelf.querySelectorAll(':scope>.rd-sky').forEach(e=>e.remove());if(!rdOn()||shelf.hidden)return;
 const I=typeof ICONIMG!=='undefined'?ICONIMG:{};const W=shelf.clientWidth;if(!W)return;const mob=W<700;
 const sr=shelf.getBoundingClientRect(),rel=e=>{const q=e.getBoundingClientRect();return{l:q.left-sr.left,t:q.top-sr.top,r:q.right-sr.left,b:q.bottom-sr.top}};
 // Hinder: text får aldrig skymmas; omslag får skymma motivet till en del (det ser ut att ligga bakom boken).
 const txt=[...shelf.querySelectorAll('.subj-h>*,.bk-meta,.progress,.bbi,.faq-h,.faq details,#resume>*')].map(rel);
 const cov=[...shelf.querySelectorAll('.bk-cv')].map(rel);
 const ov=(a,b)=>Math.max(0,Math.min(a.r,b.r)-Math.max(a.l,b.l))*Math.max(0,Math.min(a.b,b.b)-Math.max(a.t,b.t));
 const secs=[...document.querySelectorAll('#subjects .subj'),document.querySelector('.shelf .bbi'),document.querySelector('.shelf .faq')].filter(Boolean);
 const placed=[];let far='',near='';
 secs.forEach((s,i)=>{const season=RD_SEASONS[i%RD_SEASONS.length],kit=RD_KIT[season].filter(k=>I[k]);if(!kit.length)return;
  const r=rdRand(9973*(i+1)+W),sec=rel(s),next=secs[i+1],top=sec.t-70,bot=next?rel(next).t-10:sec.b,h=Math.max(200,bot-top);
  const bug=season==='sommar';const n=bug?(mob?2:3):Math.round((mob?7:10)*Math.min(1.6,h/700));
  for(let j=0;j<n;j++){const k=bug?kit[j%kit.length]:kit[Math.floor(r()*kit.length)];
   // Djup: 0 = långt bort (litet, mjukt), 1 = mitt, 2 = nära (stort, suddigt, halvt utanför kanten, ovanpå)
   const d=bug?1:(r()<.34?0:(r()<.9?1:2));
   let sz=bug?(k==='ladybug'?46:k==='bee'?62:74):season==='vinter'?[24,44,100][d]+r()*[12,24,30][d]:[32,56,124][d]+r()*[14,28,40][d];
   if(mob)sz*=d===2?.6:.8;
   let x=0,y=0,ok=false;
   for(let t=0;t<40&&!ok;t++){
    x=d===2?(r()<.5?-sz*.5:W-sz*.5):r()*(W-sz*.6)-sz*.2; y=top+r()*(h-sz);
    const box={l:x+sz*.15,t:y+sz*.15,r:x+sz*.85,b:y+sz*.85},area=(box.r-box.l)*(box.b-box.t);
    if(d===2){ok=true;break}
    if(txt.some(q=>ov(box,q)>0))continue;                                   // aldrig bakom text
    const hid=cov.reduce((m,q)=>m+ov(box,q),0)/area;if(hid>(d===0?.55:.3))continue; // max delvis bakom omslag
    const pad=sz*.7;if(placed.some(q=>ov({l:box.l-pad,t:box.t-pad,r:box.r+pad,b:box.b+pad},q)>0))continue; // luft mellan motiven
    ok=true}
   if(!ok)continue;placed.push({l:x,t:y,r:x+sz,b:y+sz});
   const rot=Math.round(r()*140-70),flip=k!=='snow'&&!bug&&r()<.5?-1:1;
   const html=`<span class="rd-k d${d}${k==='snow'?' sn':''}${bug?' bug':''}" style="left:${Math.round(x)}px;top:${Math.round(y)}px;width:${Math.round(sz)}px;transform:rotate(${bug?Math.round(r()*30-15):rot}deg) scaleX(${flip});--dd:${(6+r()*5).toFixed(1)}s;--dl:${(-r()*10).toFixed(1)}s"><i><img alt="" src="${I[k]}" decoding="async"></i></span>`;
   if(d===2)near+=html;else far+=html}});
 shelf.insertAdjacentHTML('beforeend',`<div class="rd-sky" aria-hidden="true">${far}</div><div class="rd-sky near" aria-hidden="true">${near}</div>`)}
let rdT=0;function rdLater(){clearTimeout(rdT);rdT=setTimeout(rdSky,120)}
function rdInit(){const de=document.documentElement;
 rdLater();
 if('ResizeObserver' in window){let lastW=0;new ResizeObserver(es=>{const w=Math.round(es[0].contentRect.width);if(w!==lastW){lastW=w;rdLater()}}).observe($('shelf'))}
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(rdLater);
 if(RD_PREVIEW){const b=document.createElement('button');b.className='rd-toggle';b.type='button';const lab=()=>b.textContent=rdOn()?'Visa gamla designen':'Visa nya designen';lab();
  b.onclick=()=>{de.classList.toggle('rd');try{localStorage.setItem('skogsskolan-rd',rdOn()?'1':'0')}catch(e){}lab();renderShelf()};document.body.appendChild(b)}
}
// Hyllan byggs om vid varje renderShelf (barnbyte, tillbaka från en bok): lägg om bilden.
(function(){const orig=renderShelf;renderShelf=function(){orig.apply(this,arguments);rdLater()}})();
rdInit();
