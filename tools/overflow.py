"""Hittar innehåll som sticker ut ur A4-sidan (klipps av), i utskriftsläge och i smal mobilbredd.
    python3 tools/overflow.py [bokid …]   -> rapport på stdout, skärmdumpar av felsidor i tools/out/ovf-*.png
"""
import sys, pathlib, os, json
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent
U = f"file://{R}/dist/local.html"
JS = """(pw)=>{const out=[];document.querySelectorAll('#printRoot .pg').forEach((pg,i)=>{
 if(pw){pg.style.setProperty('--pw',pw);pg.style.width=pw;pg.style.height='auto';pg.style.aspectRatio='210/297'}
});return new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
 document.querySelectorAll('#printRoot .pg').forEach((pg,i)=>{const P=pg.getBoundingClientRect();const bad=[];
  pg.querySelectorAll('*').forEach(el=>{if(el.closest('svg')&&el.tagName.toLowerCase()!=='svg')return;const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')return;
   const q=el.getBoundingClientRect();if(!q.width||!q.height)return;
   const dx=q.right-P.right, dl=P.left-q.left, dy=q.bottom-P.bottom;
   if(dx>1.5||dl>1.5||dy>1.5)bad.push([el.tagName.toLowerCase()+'.'+[...el.classList].join('.'),Math.round(dx),Math.round(dy),(el.textContent||'').trim().slice(0,30)])});
  if(bad.length)out.push([i,(pg.querySelector('h2')||{}).textContent||'',bad.slice(0,4),bad.length])});r(out)})))}"""
ids = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch(); x = b.new_page(viewport={'width': 900, 'height': 1200})
    x.goto(U); x.wait_for_timeout(600)
    if not ids: ids = x.evaluate("BOOKS.map(b=>b.id)")
    tot = 0
    for bid in ids:
        for pw in ['', '340px']:
            x.goto(U + '#print-' + bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(150)
            res = x.evaluate(JS, pw)
            for i, t, bad, n in res:
                tot += 1; print(bid, pw or 'A4', i, t, n, json.dumps(bad, ensure_ascii=False))
                if pw == '':
                    x.locator('#printRoot .pg').nth(i).screenshot(path=str(R / f'tools/out/ovf-{bid}-{i:02d}.png'))
    print('sidor med överflöde:', tot); b.close()
