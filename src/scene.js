/* ===== Skogsstigen – lugn bakgrund (redesign 2026-10-29, v2) =====
   En enda fast bakgrund rakt igenom: samma sommaräng som omslagsbilden, utan
   figurerna, så att heron flyter över i bakgrunden utan skarv. Inget bildbyte
   när man rullar. Bara några få ljuspunkter (pollen) svävar, och scenen andas
   mycket långsamt. Av vid prefers-reduced-motion, pausad när fliken är dold. */
const RD_PREVIEW=true; // förhandsvisning: knappen "Visa före/efter"
function rdOn(){return document.documentElement.classList.contains('rd')}
function rdInit(){const de=document.documentElement;
 const H=typeof HEROIMG!=='undefined'?HEROIMG:{};
 if(H.hero_bg_ang)de.style.setProperty('--rd-ang',`url(${H.hero_bg_ang})`);
 if(H.hero_bg_angs)de.style.setProperty('--rd-angs',`url(${H.hero_bg_angs})`);
 const el=$('rdScene');if(el&&!el.childElementCount){
  const R=(a,b)=>a+Math.random()*(b-a);let p='';
  for(let i=0;i<10;i++)p+=`<span class="rd-p" style="--x:${R(2,98).toFixed(1)}%;--y:${R(35,95).toFixed(0)}%;--d:${R(14,24).toFixed(1)}s;--w:${R(-24,0).toFixed(1)}s;--s:${R(.5,1.2).toFixed(2)}"></span>`;
  el.innerHTML='<i class="rd-l"></i><i class="rd-rays"></i><div class="rd-parts">'+p+'</div>'}
 document.addEventListener('visibilitychange',()=>de.classList.toggle('rd-paused',document.hidden));
 if(RD_PREVIEW){const b=document.createElement('button');b.className='rd-toggle';b.type='button';const lab=()=>b.textContent=rdOn()?'Visa gamla designen':'Visa nya designen';lab();
  b.onclick=()=>{de.classList.toggle('rd');try{localStorage.setItem('skogsskolan-rd',rdOn()?'1':'0')}catch(e){}lab();renderShelf()};document.body.appendChild(b)}
}
rdInit();
