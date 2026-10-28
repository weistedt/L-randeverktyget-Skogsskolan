"""Kvalitetsgrind före publicering (kompletterar overflow.py).

    python3 tools/gate.py [bokid …]

Rapporterar per bok:
  ZOOM    uppgiftssidor som krymps under 0,85 för att få plats (bilder blir för små)
  KORT    rutor, bilder eller text som sticker ut ur sitt kort (.tray/.card)
  MÖNSTER rätt svar som går att gissa: alltid samma plats, diagonal 0-1-2-3, eller upprepad cykel
  STRECK  streckpar där rätt svar står rakt mittemot
Avslutar med kod 1 om något hittas.
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parent.parent
U = f"file://{R}/dist/local.html"
JS = r"""()=>{const out=[];const pgs=[...document.querySelectorAll('#printRoot .pg')];
 pgs.forEach((pg,i)=>{const kind=pg.classList.contains('facit')?'facit':pg.classList.contains('diploma')?'diploma':(i<2?'intro':'act');if(kind!=='act')return;
  const pb=pg.querySelector('.pb');const z=pb&&pb.style.zoom?+pb.style.zoom:1;if(z<0.85)out.push(['ZOOM',i,z.toFixed(2)]);
  pg.querySelectorAll('.tray,.card').forEach(c=>{const r=c.getBoundingClientRect();c.querySelectorAll('input,.eq,svg.ic,.sel,.word,.p').forEach(el=>{if(el.closest('.tray,.card')!==c)return;const q=el.getBoundingClientRect();if(!q.width)return;const d=Math.max(r.left-q.left,q.right-r.right,r.top-q.top,q.bottom-r.bottom);if(d>2)out.push(['KORT',i,(el.className.baseVal??el.className)+' '+Math.round(d)+'px'])})});
  pg.querySelectorAll('.match[data-ans]').forEach(m=>{const a=m.dataset.ans.split(',').map(Number);const st=a.map((v,k)=>v===k?k:-1).filter(k=>k>=0);if(st.length)out.push(['STRECK',i,'par rakt mittemot på rad '+st.map(k=>k+1).join(',')])});
  const groups=new Map();pg.querySelectorAll('.sel[data-ok]').forEach(s=>{if(s.closest('.mirror'))return;const p=s.parentElement.closest('div,p,span')||s.parentElement;const sib=[...p.querySelectorAll('.sel')].filter(x=>x.closest('div,p,span')===p||x.parentElement===p);if(sib.length<2)return;const ok=sib.filter(x=>x.hasAttribute('data-ok'));if(ok.length!==1)return;groups.set(p,sib.indexOf(ok[0]))});
  const seq=[...groups.values()];
  if(seq.length>=3){const same=seq.every(v=>v===seq[0]);const diag=seq.every((v,k)=>v===k);const cyc=seq.length>=6&&[2,3].some(P=>seq.every((v,k)=>k<P||v===seq[k-P])&&new Set(seq.slice(0,P)).size===P);
   const pre=seq.length>=4&&seq.slice(0,4).every((v,k)=>v===k);const cnt={};seq.forEach(v=>cnt[v]=(cnt[v]||0)+1);const top=Math.max(...Object.values(cnt));const most=seq.length>=4&&top/seq.length>=.75;
   if(same)out.push(['MÖNSTER',i,'alltid plats '+seq[0]+': '+seq.join(',')]);else if(diag||pre)out.push(['MÖNSTER',i,'diagonal: '+seq.join(',')]);else if(cyc)out.push(['MÖNSTER',i,'cykel: '+seq.join(',')]);else if(most)out.push(['MÖNSTER',i,'nästan alltid samma plats: '+seq.join(',')])}
 });return out}"""

ids = sys.argv[1:]
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(); x = b.new_page(viewport={'width': 900, 'height': 1200})
    x.goto(U); x.wait_for_timeout(800)
    if not ids:
        ids = x.evaluate("BOOKS.map(b=>b.id)")
    for bid in ids:
        x.goto(U + '#print-' + bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(200)
        title = x.evaluate(f"BOOKS.find(b=>b.id==='{bid}').title")
        res = x.evaluate(JS)
        if res:
            bad += len(res)
            print(f"{bid} {title}")
            for kind, i, info in res:
                t = x.evaluate(f"(BOOKS.find(b=>b.id==='{bid}').pages[{i}-2]||{{}}).t")
                print(f"   {kind:8} s.{i} {t}: {info}")
    # tryckfilerna: manifestets hash måste stämma med bokens sidor, annars är PDF:en i Bokbinderiet gammal
    mf = pathlib.Path(__file__).resolve().parent.parent / 'dist/print/manifest.json'
    if mf.exists():
        man = json.loads(mf.read_text()); x.goto(U); x.wait_for_timeout(500)
        cur = x.evaluate("Object.fromEntries(BOOKS.map(b=>[b.id,pressHash(b)]))")
        stale = [k for k in ids if k in cur and (k not in man or man[k]['hash'] != cur[k])]
        if stale:
            bad += len(stale); print('TRYCK    tryckfilen är gammal eller saknas för', ' '.join(stale), '-> python3 tools/press.py', ' '.join(stale))
    b.close()
print('fynd:', bad)
sys.exit(1 if bad else 0)
