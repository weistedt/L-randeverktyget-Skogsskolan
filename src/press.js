/* ================= Tryck: sidor som bara finns i tryckfilerna =================
   Baksida (spegelvänd omslagsbild som tonar ut, serien, målet) och "Mina egna sidor" som fyller ut
   så att en dubbelsidig bok går jämnt ut. Omslagen renderas med 3 mm utfall (216 × 303 mm). */
function backPage(b){const s=SUBJ[b.subj],c=CHAR[b.subj];const series=BOOKS.filter(x=>x.subj===b.subj);
 const topics=b.sub.split(/,\s*/);const has3d=typeof COVERS!=='undefined'&&COVERS.includes(b.id);
 const scene=has3d?`<svg class="bb-scene" viewBox="0 0 210 297" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g transform="translate(210 0) scale(-1 1)"><use href="#cv-${b.id}"/></g><rect width="210" height="297" fill="url(#backfade)"/></svg>`:'';
 const pose=(c.poses&&c.poses[1])||c.art;
 return shellPg(b,`${scene}<div class="bc-in">
  <div class="bc-top"><div><span class="kick">${pawSvg()}Skogsskolan · ${s.name} ${b.nr}</span><h2>${b.title}</h2></div>${art(pose,24)}</div>
  <div class="bc-card"><div class="lbl">I den här boken</div><div class="bc-topics">${topics.map(t=>`<span class="chip">${t[0].toUpperCase()+t.slice(1)}</span>`).join('')}</div>
   <div class="lbl" style="margin-top:2.6cqw">Målet</div><b class="bc-goal">${b.goal}</b>
   <div class="bc-lv">${paws(b.level)}<span>${LEVEL[b.level]}</span></div></div>
  <div class="bc-card bc-series${series.length>8?' bc-many':''}"><div class="lbl">Fler böcker i ${s.name.toLowerCase()}</div><ol>${series.map(x=>`<li class="${x.id===b.id?'on':''}"><span class="n">${x.nr}</span><span class="t">${x.title}</span>${series.length>8?'':paws(x.level)}</li>`).join('')}</ol><p class="bc-foot"><b>Skogsskolan</b> · egna lärböcker att bläddra i, skriva i och skriva ut.</p></div>
 </div>`,'backcv')}
function fillerPage(b){return shellPg(b,`<div class="pg-in"><header class="ph nochar"><span class="kick">${pawSvg()}Skogsskolan · ${SUBJ[b.subj].name}</span><h2>Mina egna sidor</h2><p class="ins">Rita, skriv eller räkna vad du vill.</p></header><div class="pb"><div class="dotgrid"></div></div></div>`,'filler')}
/* innehållshash: bokens alla sidor som de ritas. Tryckfilernas manifest bär samma hash, så grinden ser när en tryckfil är gammal. */
const pressHash=b=>{const s=buildPages(b).join('')+backPage(b)+fillerPage(b)+introNoFacit(b);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(36)+'-'+s.length.toString(36)};
/* sidornas ordning i bokens käll-PDF (print/<id>.pdf): framsida, baksida (båda med utfall), inlagan, fyllnadssida, försättsblad utan facitmening */
function pressLayout(b){const nf=b.facit?facitChunks(b).length:0,n=b.pages.length;const o={front:0,back:1,intro:2,acts:[3,3+n],facit:[3+n,3+n+nf],dip:3+n+nf,fill:4+n+nf,intro2:5+n+nf};o.total=o.intro2+1;return o}
/* "Den här boken tillhör" utan meningen om facit, för böcker som skrivs ut utan facit eller med facit som eget blad */
const introNoFacit=b=>introPage(Object.assign(Object.create(Object.getPrototypeOf(b)),b,{facit:false}),1);
