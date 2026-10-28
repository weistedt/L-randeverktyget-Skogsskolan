import sys,json,pathlib
from playwright.sync_api import sync_playwright
SP=pathlib.Path(__file__).parent; U=f"file://{SP}/local.html"
with sync_playwright() as p:
    b=p.chromium.launch(); x=b.new_page(viewport={'width':900,'height':1200})
    for bid in sys.argv[1:]:
        x.goto(U+'#print-'+bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(250)
        r=x.evaluate("""[...document.querySelectorAll('#printRoot .pg')].map((p,i)=>{const pb=p.querySelector('.pb');if(!pb)return null;const cq=p.getBoundingClientRect().width/100;const z=parseFloat(pb.style.zoom||1);const t=(p.querySelector('h1,h2,.ttl')||{}).textContent||'';return [i,t.slice(0,22),(pb.clientHeight*z/cq).toFixed(1),(pb.scrollHeight*z/cq).toFixed(1),z]}).filter(Boolean)""")
        for row in r: print(bid,row)
    b.close()
