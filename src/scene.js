/* ===== Skogsstigen – årstiderna längs sidan (redesign 2026-10-29, v4) =====
   Ingen bakgrundsbild och inget som följer med skärmen. Varje avsnitt på hyllan
   får ett större 3D-motiv som sitter fast på sidan, vid avsnittets rubrik, och
   årstiderna följer varandra när man rullar nedåt: sommar, höst, vinter, vår …
   Motivet rör sig nästan inte (lövet gungar, snöflingan vrider sig långsamt,
   fjärilen slår med vingarna). Stilla vid prefers-reduced-motion.
   Ängsbakgrunden från v2 ligger i assets/bank/. */
const RD_PREVIEW=true; // förhandsvisning: knappen "Visa före/efter"
// Årets ring: [ikon, rörelse, årstid]. Börjar på sommar som omslagsbilden.
const RD_YEAR=[['bee','hover','Sommar'],['leaf_maple','sway','Höst'],['snow','spin','Vinter'],['butterfly','flap','Vår'],
               ['ladybug','hover','Sommar'],['leaf_oak','sway','Höst'],['snow','spin','Vinter'],['flower','sway','Vår']];
function rdOn(){return document.documentElement.classList.contains('rd')}
function rdDecor(){if(!rdOn())return;const I=typeof ICONIMG!=='undefined'?ICONIMG:{};
 const secs=[...document.querySelectorAll('#subjects .subj'),document.querySelector('.shelf .bbi'),document.querySelector('.shelf .faq')].filter(Boolean);
 secs.forEach((s,i)=>{if(s.querySelector(':scope>.rd-season'))return;const [k,m,t]=RD_YEAR[i%RD_YEAR.length];if(!I[k])return;
  const d=document.createElement('span');d.className=`rd-season ${m} ${k.replace(/_.*/,'')}`;d.setAttribute('aria-hidden','true');d.dataset.t=t;
  d.innerHTML=`<i><img alt="" src="${I[k]}" decoding="async"></i>`;s.prepend(d)})}
function rdInit(){const de=document.documentElement;
 rdDecor();
 if(RD_PREVIEW){const b=document.createElement('button');b.className='rd-toggle';b.type='button';const lab=()=>b.textContent=rdOn()?'Visa gamla designen':'Visa nya designen';lab();
  b.onclick=()=>{de.classList.toggle('rd');try{localStorage.setItem('skogsskolan-rd',rdOn()?'1':'0')}catch(e){}lab();renderShelf()};document.body.appendChild(b)}
}
// Avsnitten byggs om vid varje renderShelf: lägg tillbaka motiven.
(function(){const orig=renderShelf;renderShelf=function(){orig.apply(this,arguments);rdDecor()}})();
rdInit();
