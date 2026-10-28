/* ================= Familjen: barnen, åldern och inloggningen =================
   Barnen registreras med namn och födelseår. Nivån räknas fram ur åldern (4 år = 1 tass … 8 år = 5 tassar)
   och kan flyttas ett steg åt varje håll. Familjen sparas i state.fam (lokalt) och i molnet som dokumentet
   data/users/<uid>/familj, bredvid barnens bokdokument (<barn>~<bok>).
   Molnet är antingen claude.ai-artefaktens databas (när appen körs i claude.ai) eller Firebase (Google-inloggning)
   när appen körs på egen webbplats och FIREBASE_CONFIG är ifylld. Båda har samma sökvägar och samma get/set.
   Bara funktionsdeklarationer och var här: filen läggs före app.js, och famInit() anropas därifrån. */
var KIDS=[];
var FAM_YEAR=new Date().getFullYear();
/* barn som fanns innan familjeregistret: deras arbete ligger under egna id i den sparade datan.
   Inga namn finns i koden; ett sådant barn får ett kort med id:t som namn och kan rättas i familjerutan. */
var FAM_FALLBACK={id:'barn',name:'Barnet',born:null,adj:0,lvl:0,fits:[]};
var famDirty=false,famDraft=null,famOpenMode=null,ACCT={kind:'local',email:''};

function famLevel(k){if(!k||!k.born)return 0;return Math.max(1,Math.min(5,FAM_YEAR-k.born-3+(+k.adj||0)))}
function famFits(L){if(!L)return [];return L>=5?[4,5]:[L,L+1]}
function famAge(k){return k&&k.born?FAM_YEAR-k.born:null}
function famHasData(id){return ['done','work','last','t'].some(m=>{const o=(state[m]||{})[id];return o&&Object.keys(o).length})}
function famSetKids(){const ks=((state.fam&&state.fam.kids)||[]).filter(k=>!k.hid).map(k=>{const L=famLevel(k);return Object.assign({},k,{lvl:L,fits:famFits(L)})});
 KIDS.length=0;ks.forEach(k=>KIDS.push(k));
 if(!KIDS.length){KIDS.push(FAM_FALLBACK);state.kid=FAM_FALLBACK.id;return}
 if(!KIDS.some(k=>k.id===state.kid))state.kid=KIDS[0].id}
function famSeedLegacy(){const f=state.fam;if(f.kids.length)return false;
 const ids=[...new Set(['done','work','last','t'].flatMap(m=>Object.keys(state[m]||{})))].filter(id=>id&&id!==FAM_FALLBACK.id&&/^[a-zåäö]{2,20}$/.test(id)&&famHasData(id));if(!ids.length)return false;
 const t=Date.now();ids.forEach(id=>f.kids.push({id,name:id[0].toUpperCase()+id.slice(1),born:null,adj:0,t}));f.t=t;famDirty=true;return true}
function famInit(){if(!state.fam||!Array.isArray(state.fam.kids))state.fam={kids:[],t:0};famSeedLegacy();famSetKids();
 document.addEventListener('click',famClick);
 const fm=$('fam');if(fm){fm.addEventListener('input',famInput);fm.addEventListener('change',famInput)}}
/* efter start: ett tomt register öppnar "Vem ska läsa?" (inte vid utskrift eller när en bok öppnas direkt) */
function famBoot(){if(!famReal().length&&!document.documentElement.classList.contains('print-mode'))famOpen('first')}
function famReal(){return KIDS.filter(k=>k!==FAM_FALLBACK)}
/* två källor (annan flik, molnet): barn slås ihop per id, nyaste ändring vinner */
function famMerge(other){if(!other||!Array.isArray(other.kids))return false;const f=state.fam;let ch=false;
 other.kids.forEach(o=>{if(!o||!o.id||typeof o.name!=='string')return;const i=f.kids.findIndex(k=>k.id===o.id);
  if(i<0){f.kids.push(Object.assign({},o));ch=true}else if((+o.t||0)>(+f.kids[i].t||0)){f.kids[i]=Object.assign({},o);ch=true}else if((+f.kids[i].t||0)>(+o.t||0))famDirty=true});
 if(f.kids.some(k=>!other.kids.some(o=>o&&o.id===k.id)))famDirty=true;
 f.t=Math.max(+f.t||0,+other.t||0);if(ch){famSetKids();if(famDraft&&famOpenMode==='first'&&famReal().length)famClose()}return ch}
function famCloudBody(){return {kids:state.fam.kids.map(k=>({id:k.id,name:k.name,born:k.born,adj:+k.adj||0,t:+k.t||0,hid:k.hid?1:0})),t:+state.fam.t||0}}
/* anropas när molnets dokument har lästs in: barn som bara finns i gammalt arbete får ett kort */
function famAfterCloud(){if(famSeedLegacy()){famSetKids();if(famOpenMode==='first'&&famDraft&&!famDraft.touched)famClose();return true}return false}

/* ---------- Dialogen ---------- */
function famOpen(mode){famOpenMode=mode||'edit';famDraft={touched:false,kids:JSON.parse(JSON.stringify(state.fam.kids))};
 if(!famDraft.kids.some(k=>!k.hid))famDraft.kids.push(famNewKid());famRender();const fm=$('fam');fm.hidden=false;document.documentElement.classList.add('fam-on');
 setTimeout(()=>{const i=fm.querySelector('.fam-kid input[data-f="name"]');if(i&&!i.value)i.focus()},60)}
function famClose(){famDraft=null;famOpenMode=null;const fm=$('fam');if(fm)fm.hidden=true;document.documentElement.classList.remove('fam-on')}
function famNewKid(){return {id:'k'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),name:'',born:FAM_YEAR-5,adj:0,t:0,fresh:1}}
function famYears(sel){let s='';for(let y=FAM_YEAR-2;y>=FAM_YEAR-13;y--)s+=`<option value="${y}"${y===sel?' selected':''}>${y}</option>`;return s}
function famEsc(t){return String(t||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
/* vad nivåvalet gör, i klartext: vilka böcker hyllan märker som "Passar <namn>" */
function famLvText(k){const L=famLevel(k);if(!L)return '';const f=famFits(L),a=f[0]+3,b=f[f.length-1]+3,adj=+k.adj||0,nm=famEsc((k.name||'').trim()||'barnet');
 const span=`böckerna för ${a}–${b} år`;
 return adj<0?`Hyllan märker ${span} som passar ${nm}, ett steg lättare än åldern.`:adj>0?`Hyllan märker ${span} som passar ${nm}, ett steg svårare än åldern.`:`Hyllan märker ${span} som passar ${nm}.`}
function famRender(){const d=famDraft;if(!d)return;const first=famOpenMode==='first';
 const art=$('famArt');if(art&&!art.firstChild&&typeof HEROIMG!=='undefined'&&HEROIMG.hero_fam)art.innerHTML=`<img src="${HEROIMG.hero_fam}" alt="" decoding="async">`;
 $('famH').textContent=first?'Vem ska läsa?':'Familjen';
 $('famSub').textContent=first?'Skriv namnet och året barnet är fött, så märker hyllan böckerna som passar.':'Namnet syns på hyllan och på diplomet i varje bok.';
 const live=d.kids.filter(k=>!k.hid),gone=d.kids.filter(k=>k.hid),canDel=live.length>1||!first;
 $('famList').innerHTML=live.map(k=>{const age=famAge(k),adj=+k.adj||0;
  return `<div class="fam-kid" data-id="${k.id}">
  <div class="fam-r1"><input data-f="name" class="${k.need?'need':''}" maxlength="20" placeholder="Barnets namn" value="${famEsc(k.name)}" autocomplete="off" spellcheck="false" aria-label="Barnets namn">
   <label class="fam-born"><span>Född</span><select data-f="born" aria-label="Födelseår">${famYears(k.born)}</select></label><span class="fam-age">${age} år</span></div>
  <div class="fam-r2" role="radiogroup" aria-label="Nivå"><span class="fam-lbl">Nivå</span>${[[-1,'Lättare'],[0,'Som åldern'],[1,'Svårare']].map(([v,t])=>`<button role="radio" data-fam-adj="${v}" aria-checked="${adj===v}">${t}</button>`).join('')}</div>
  <p class="fam-lv">${famLvText(k)}</p>
  ${k.ask?`<p class="fam-ask">Ta bort ${famEsc(k.name||'barnet')} från hyllan? Det som är gjort sparas och kommer tillbaka om du lägger till barnet igen. <button data-fam-hide2="${k.id}">Ta bort</button> <button data-fam-keep="${k.id}">Behåll</button></p>`:canDel?`<button class="fam-del" data-fam-hide="${k.id}">Ta bort ${famEsc((k.name||'').trim())||'barnet'}</button>`:''}
  </div>`}).join('');
 $('famGone').innerHTML=gone.length?`<p>Borttagna: ${gone.map(k=>`<button data-fam-back="${k.id}">${famEsc(k.name)}, lägg tillbaka</button>`).join(' · ')}</p>`:'';
 $('famCancel').hidden=first;famAcctRender()}
/* inga felmeddelanden: Klar leder bara till fältet som saknar namn */
function famValid(){const d=famDraft;if(!d)return true;const live=d.kids.filter(k=>!k.hid);let bad=null;const seen=new Set();
 live.forEach(k=>{const n=(k.name||'').trim().toLowerCase();k.need=!n||seen.has(n);if(k.need&&!bad)bad=k;seen.add(n)});
 return bad}
function famK(el){const r=el.closest('.fam-kid');return r&&famDraft&&famDraft.kids.find(k=>k.id===r.dataset.id)}
function famInput(e){const t=e.target;if(!t.dataset||!t.dataset.f)return;const k=famK(t);if(!k)return;famDraft.touched=true;
 if(t.dataset.f==='name'){k.name=t.value.replace(/\s+/g,' ').replace(/^\s/,'');if(k.need&&k.name.trim()){k.need=false;t.classList.remove('need')}const row=t.closest('.fam-kid'),lv=row.querySelector('.fam-lv');if(lv)lv.innerHTML=famLvText(k);const del=row.querySelector('.fam-del');if(del)del.textContent='Ta bort '+(k.name.trim()||'barnet');return}
 if(t.dataset.f==='born'&&e.type==='change'){k.born=+t.value;famRender()}}
function famClick(e){const t=e.target.closest&&e.target.closest('[data-fam],[data-fam-adj],[data-fam-hide],[data-fam-hide2],[data-fam-keep],[data-fam-back],#famAdd,#famOk,#famCancel,#famIn,#famOut,#famLocal');if(!t)return;
 if(t.hasAttribute('data-fam')){e.stopPropagation();famOpen('edit');return}
 const d=famDraft;if(!d)return;e.preventDefault();
 if(t.id==='famAdd'){d.touched=true;d.kids.push(famNewKid());famRender();const ins=$('famList').querySelectorAll('input[data-f="name"]');ins[ins.length-1].focus();return}
 if(t.id==='famCancel'){famClose();return}
 if(t.id==='famOk'){famCommit();return}
 if(t.id==='famIn'){acctSignIn();return}
 if(t.id==='famOut'){acctSignOut();return}
 const k=famK(t)||d.kids.find(x=>x.id===(t.dataset.famBack||t.dataset.famHide||t.dataset.famHide2||t.dataset.famKeep));if(!k)return;d.touched=true;
 if(t.dataset.famAdj!=null){k.adj=+t.dataset.famAdj;famRender();return}
 if(t.dataset.famHide){if(k.fresh&&!famHasData(k.id)){d.kids.splice(d.kids.indexOf(k),1)}else k.ask=1;famRender();return}
 if(t.dataset.famHide2){delete k.ask;k.hid=1;famRender();return}
 if(t.dataset.famKeep){delete k.ask;famRender();return}
 if(t.dataset.famBack){delete k.hid;famRender()}}
function famCommit(){const d=famDraft;if(!d)return;if(!d.kids.some(k=>!k.hid)){d.kids.push(famNewKid())}const bad=famValid();if(bad){famRender();const i=$('famList').querySelector(`.fam-kid[data-id="${bad.id}"] input[data-f="name"]`);if(i){i.focus();i.classList.remove('need');void i.offsetWidth;i.classList.add('need')}return}const now=Date.now(),f=state.fam,first=famOpenMode==='first';
 /* första barnet tar över arbete som gjorts innan något barn fanns (FAM_FALLBACK) */
 if(!f.kids.length&&famHasData(FAM_FALLBACK.id)){const k=d.kids.find(x=>!x.hid&&x.fresh);if(k)k.id=FAM_FALLBACK.id}
 d.kids.forEach(k=>{delete k.ask;delete k.need;const o=f.kids.find(x=>x.id===k.id);k.name=(k.name||'').trim();const same=o&&o.name===k.name&&o.born===k.born&&(+o.adj||0)===(+k.adj||0)&&!!o.hid===!!k.hid;
  delete k.fresh;if(!same)k.t=now});
 f.kids=d.kids.map(k=>({id:k.id,name:k.name,born:k.born,adj:+k.adj||0,t:k.t||now,hid:k.hid?1:0}));f.t=now;famDirty=true;
 const prev=state.kid;famSetKids();if(first&&KIDS[0])state.kid=KIDS[0].id;famClose();save(null);
 try{renderShelf()}catch(e){}if(R.b&&prev!==state.kid){try{syncAll()}catch(e){}}
 toast(first?`Välkommen${KIDS.length===1?', '+KIDS[0].name:''}! Böckerna som passar är märkta.`:'Familjen är sparad.')}

/* ---------- Konto: var sparas allt? ---------- */
function famAcctRender(){const el=$('famAcct');if(!el)return;let h='';
 if(ACCT.kind==='claude')h=`<p>Sparas i ditt claude.ai-konto.</p>`;
 else if(ACCT.kind==='google')h=`<p>Sparas på ${ACCT.email?famEsc(ACCT.email):'ditt Google-konto'} och finns på alla enheter där du loggar in. <button class="fam-link" id="famOut">Logga ut</button></p>`;
 else if(ACCT.kind==='google-out')h=`<p>Sparas bara i den här webbläsaren.</p><button class="fam-google" id="famIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.3 3-4 5.6-4z"/></svg>Logga in med Google och spara på alla enheter</button>`;
 else h=`<p>Sparas i den här webbläsaren.</p>`;
 el.innerHTML=h}
function acctSet(kind,email){ACCT={kind,email:email||''};famAcctRender();const c=$('acctChip');if(c){c.hidden=kind!=='google-out'}}

/* ---------- Firebase (egen webbplats) ---------- */
var FB=null;
function fbLoad(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
async function fbInit(){if(typeof FIREBASE_CONFIG==='undefined'||!FIREBASE_CONFIG||!FIREBASE_CONFIG.apiKey)return false;
 try{const v='https://www.gstatic.com/firebasejs/10.14.1/';await fbLoad(v+'firebase-app-compat.js');await Promise.all([fbLoad(v+'firebase-auth-compat.js'),fbLoad(v+'firebase-firestore-compat.js')]);
  const app=firebase.initializeApp(FIREBASE_CONFIG);FB={auth:firebase.auth(),db:firebase.firestore()};}catch(e){FB=null;return false}
 acctSet('google-out');
 FB.auth.onAuthStateChanged(async u=>{if(!u){if(DB){DB=null;UID=null}acctSet('google-out');return}
  /* data från ett annat konto ligger kvar lokalt: börja om i stället för att blanda ihop två familjer */
  if(state.owner&&state.owner!==u.uid){try{localStorage.removeItem(KEY)}catch(e){}location.reload();return}
  if(!state.owner){state.owner=u.uid;unsaved=true;flush()}
  acctSet('google',u.email);await cloudStart(FB.db,u.uid)});
 try{await FB.auth.getRedirectResult()}catch(e){}
 return true}
async function acctSignIn(){if(!FB)return;const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
 try{await FB.auth.signInWithPopup(p)}catch(e){const c=e&&e.code||'';if(/popup-blocked|operation-not-supported/.test(c)){try{await FB.auth.signInWithRedirect(p)}catch(_){toast('Inloggningen gick inte. Försök igen.')}}else if(!/popup-closed|cancelled-popup/.test(c))toast('Inloggningen gick inte. Försök igen.')}}
/* utloggning: skicka det sista till molnet, logga ut och töm den här enheten (allt finns kvar i kontot) */
async function acctSignOut(){if(!FB)return;flush();await cloudSettle();
 /* hann inte allt upp till molnet (inget nät) frågar vi först, och sparar en kopia innan något tas bort */
 let pend=false;try{pend=dirty.size>0||!!famDirty||!!pushing}catch(e){}if(pend&&!confirm('Allt är inte sparat i molnet ännu. Logga ut ändå? Det som inte hunnit sparas finns kvar som en kopia i den här webbläsaren.'))return;
 try{if(pend)localStorage.setItem(KEY+'-bak-'+Date.now(),localStorage.getItem(KEY)||'')}catch(e){}
 try{await FB.auth.signOut()}catch(e){}try{localStorage.removeItem(KEY)}catch(e){}location.reload()}
