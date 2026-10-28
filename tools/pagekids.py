import sys,pathlib
from playwright.sync_api import sync_playwright
SP=pathlib.Path(__file__).parent; U=f"file://{SP}/local.html"
bid=sys.argv[1]; pages=[int(a) for a in sys.argv[2:]]
with sync_playwright() as p:
    b=p.chromium.launch(); x=b.new_page(viewport={'width':900,'height':1200})
    x.goto(U+'#print-'+bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(250)
    for i in pages:
        r=x.evaluate("""(i)=>{const p=document.querySelectorAll('#printRoot .pg')[i];const pb=p.querySelector('.pb');pb.style.zoom=1;const cq=p.getBoundingClientRect().width/100;const out=[];const walk=(el,d)=>{if(d>3)return;[...el.children].forEach(c=>{const r=c.getBoundingClientRect();out.push('  '.repeat(d)+c.tagName+'.'+(c.className||'').toString().slice(0,20)+' h='+(r.height/cq).toFixed(1)+' w='+(r.width/cq).toFixed(1));if(r.height/cq>14)walk(c,d+1)})};walk(pb,0);return out.slice(0,40).join('\\n')}""",i)
        print('--',i); print(r)
    b.close()
