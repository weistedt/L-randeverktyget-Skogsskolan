/* ===== Skogsstigen – levande bakgrund (redesign 2026-10-29) =====
   En fast bakgrund bakom hyllan som byter landskap per ämne (tona över), med
   långsam "andning", ljusstrålar och några få svävande partiklar (löv, pollen,
   eldflugor). Bara transform/opacity animeras. Av vid prefers-reduced-motion,
   pausad när fliken är dold eller när en bok/Bokbinderiet är öppen. */
const RD_PREVIEW=true; // förhandsvisning: knappen "Visa före/efter"
const RD_SCENES={matte:'host',svenska:'var',eng:'sjo',geo:'himmel',mer:'gran',tryg:'by',bbi:'gran',faq:'by'};
const RD_PART={host:'leaf',var:'petal',sjo:'mote',himmel:'mote',gran:'mote',by:'fly'};
let rdIO=null,rdCur='';
function rdOn(){return document.documentElement.classList.contains('rd')}
function rdInit(){const de=document.documentElement;
 const H=typeof HEROIMG!=='undefined'?HEROIMG:{};
 ['host','var','sjo','himmel','gran','by'].forEach(n=>{if(H['hero_bg_'+n])de.style.setProperty('--rd-'+n,`url(${H['hero_bg_'+n]})`)});
 const el=$('rdScene');if(el&&!el.childElementCount){
  el.innerHTML=Object.keys(RD_PART).map(n=>`<i class="rd-l" data-s="${n}" style="background-image:var(--rd-${n})"></i>`).join('')+'<i class="rd-veil"></i><i class="rd-rays"></i><div class="rd-parts" id="rdParts"></div>'}
 rdParts();rdWatch();rdSet('host');
 document.addEventListener('visibilitychange',()=>de.classList.toggle('rd-paused',document.hidden));
 if(RD_PREVIEW){const b=document.createElement('button');b.className='rd-toggle';b.type='button';const lab=()=>b.textContent=rdOn()?'Visa gamla designen':'Visa nya designen';lab();
  b.onclick=()=>{de.classList.toggle('rd');try{localStorage.setItem('skogsskolan-rd',rdOn()?'1':'0')}catch(e){}lab();renderShelf();rdWatch()};document.body.appendChild(b)}
}
function rdParts(){const box=$('rdParts');if(!box)return;const I=typeof ICONIMG!=='undefined'?ICONIMG:{};
 const leaf=[I.leaf_autumn,I.leaf_birch,I.leaf_maple].filter(Boolean),petal=[I.leaf_birch].filter(Boolean);let h='';
 const R=(a,b)=>a+Math.random()*(b-a);
 // Löv: få, stora, faller långsamt med sväng. Pollen/eldflugor: små ljuspunkter som stiger.
 for(let i=0;i<6;i++)h+=`<span class="rd-p leaf" style="--x:${R(2,96).toFixed(1)}%;--d:${R(16,26).toFixed(1)}s;--w:${R(-12,0).toFixed(1)}s;--s:${R(.55,1).toFixed(2)};--sw:${R(18,46).toFixed(0)}px"><img alt="" src="${leaf[i%leaf.length]||''}"></span>`;
 for(let i=0;i<5;i++)h+=`<span class="rd-p petal" style="--x:${R(2,96).toFixed(1)}%;--d:${R(18,28).toFixed(1)}s;--w:${R(-14,0).toFixed(1)}s;--s:${R(.35,.6).toFixed(2)};--sw:${R(20,50).toFixed(0)}px"><img alt="" src="${petal[0]||''}"></span>`;
 for(let i=0;i<12;i++)h+=`<span class="rd-p mote" style="--x:${R(2,98).toFixed(1)}%;--y:${R(30,95).toFixed(0)}%;--d:${R(12,22).toFixed(1)}s;--w:${R(-20,0).toFixed(1)}s;--s:${R(.5,1.3).toFixed(2)}"></span>`;
 for(let i=0;i<9;i++)h+=`<span class="rd-p fly" style="--x:${R(4,96).toFixed(1)}%;--y:${R(45,92).toFixed(0)}%;--d:${R(7,13).toFixed(1)}s;--w:${R(-12,0).toFixed(1)}s;--s:${R(.6,1.1).toFixed(2)}"></span>`;
 box.innerHTML=h}
function rdSet(n){if(!n||n===rdCur)return;rdCur=n;const el=$('rdScene');if(!el)return;el.dataset.s=n;el.dataset.p=RD_PART[n]||'mote';
 el.querySelectorAll('.rd-l').forEach(l=>l.classList.toggle('on',l.dataset.s===n))}
function rdWatch(){if(rdIO){rdIO.disconnect();rdIO=null}if(!('IntersectionObserver' in window))return;
 rdIO=new IntersectionObserver(es=>{es.forEach(e=>{if(!e.isIntersecting)return;const t=e.target;rdSet(RD_SCENES[t.dataset.subj||(t.classList.contains('bbi')?'bbi':t.classList.contains('faq')?'faq':'matte')])})},{rootMargin:'-42% 0px -42% 0px'});
 document.querySelectorAll('#subjects .subj,.shelf .bbi,.shelf .faq').forEach(s=>rdIO.observe(s));
 const top=$('progress');if(top)rdIO.observe(top)}
// Nya sektioner efter varje renderShelf: koppla om observatören.
(function(){const orig=renderShelf;renderShelf=function(){orig.apply(this,arguments);if(rdOn())requestAnimationFrame(rdWatch)}})();
rdInit();
