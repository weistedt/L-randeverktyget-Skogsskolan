/* ===== Skogsstigen – svävande dekor (redesign 2026-10-29, v3) =====
   Ingen bakgrundsbild. Hyllan har kvar sin vanliga ljusa bakgrund, och bakom
   böckerna seglar några få 3D-ikoner: löv och snöflingor om vartannat, ibland
   en fjäril eller ett bi som flyger förbi. Ikonerna ligger bakom innehållet.
   Bara transform/opacity animeras. Av vid prefers-reduced-motion, pausat när
   fliken är dold. Bakgrundsbilden från v2 ligger i assets/bank/. */
const RD_PREVIEW=true; // förhandsvisning: knappen "Visa före/efter"
function rdOn(){return document.documentElement.classList.contains('rd')}
function rdInit(){const de=document.documentElement,I=typeof ICONIMG!=='undefined'?ICONIMG:{};
 const el=$('rdScene');if(el&&!el.childElementCount){
  const img=k=>I[k]?`<img alt="" src="${I[k]}" decoding="async">`:'';
  // Fallande: löv och snöflingor om vartannat, utspridda i tid så att 3–4 syns samtidigt.
  const fall=[['leaf_autumn',8,40,27,0],['snow',30,28,31,-6],['leaf_maple',54,36,29,-12],['snow',76,24,34,-19],['leaf_birch',92,30,26,-4],['snow',16,30,33,-25],['leaf_oak',66,34,30,-16],['snow',44,26,36,-29]];
  let h=fall.map(([k,x,w,d,dl],i)=>`<span class="rd-f ${k==='snow'?'sn':'lf'}" style="--x:${x}%;--w:${w}px;--d:${d}s;--dl:${dl}s;--sw:${k==='snow'?14:30}px;--r:${i%2?-1:1};--ty:${(10+i*11)%92+4}%"><i>${img(k)}</i></span>`).join('');
  // Flygare: en fjäril (vänster→höger, lång paus) och ett bi (en annan tid).
  h+=`<span class="rd-fly bf" style="--y:34vh;--d:46s;--dl:-8s"><i>${img('butterfly')}</i></span>`;
  h+=`<span class="rd-fly be" style="--y:66vh;--d:58s;--dl:-36s"><i>${img('bee')}</i></span>`;
  el.innerHTML=h}
 document.addEventListener('visibilitychange',()=>de.classList.toggle('rd-paused',document.hidden));
 if(RD_PREVIEW){const b=document.createElement('button');b.className='rd-toggle';b.type='button';const lab=()=>b.textContent=rdOn()?'Visa gamla designen':'Visa nya designen';lab();
  b.onclick=()=>{de.classList.toggle('rd');try{localStorage.setItem('skogsskolan-rd',rdOn()?'1':'0')}catch(e){}lab();renderShelf()};document.body.appendChild(b)}
}
rdInit();
