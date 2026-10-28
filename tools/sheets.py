import sys,pathlib,json
from playwright.sync_api import sync_playwright
from PIL import Image
SP=pathlib.Path(__file__).parent; U=f"file://{SP}/local.html"; OUT=SP/'v3'; OUT.mkdir(exist_ok=True)
ids=sys.argv[1:]
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    x=b.new_page(viewport={'width':900,'height':1200},device_scale_factor=1)
    x.on('pageerror',lambda e:errs.append('PE '+str(e))); x.on('console',lambda m: m.type=='error' and errs.append(m.text))
    x.goto(U); x.wait_for_timeout(800)
    if not ids: ids=x.evaluate("BOOKS.map(b=>b.id)")
    zooms={}
    for bid in ids:
        x.goto(U+'#print-'+bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(250)
        z=x.evaluate("""[...document.querySelectorAll('#printRoot .pg')].map((p,i)=>{const pb=p.querySelector('.pb');const z=pb&&pb.style.zoom;const o=[];p.querySelectorAll('.pb *').forEach(el=>{});const r=p.getBoundingClientRect();let over=0;p.querySelectorAll('.pg-in > *, .pb > *').forEach(el=>{const q=el.getBoundingClientRect();if(q.bottom>r.bottom+1||q.right>r.right+1)over++});return [i,z||'',over]}).filter(a=>a[1]||a[2])""")
        zooms[bid]=z
        pages=x.locator('#printRoot .pg'); n=pages.count(); ims=[]
        for i in range(n):
            f=OUT/f'{bid}-{i:02d}.png'; pages.nth(i).screenshot(path=str(f)); ims.append(f)
        W=300; H=int(W*297/210); cols=6; rows=(n+cols-1)//cols
        sheet=Image.new('RGB',(cols*(W+10)+10,rows*(H+10)+10),(200,205,200))
        for k,f in enumerate(ims):
            im=Image.open(f).convert('RGB').resize((W,H),Image.LANCZOS); sheet.paste(im,(10+(k%cols)*(W+10),10+(k//cols)*(H+10)))
        sheet.save(OUT/f'sheet-{bid}.png')
    print(json.dumps(zooms)); print('errors:',errs[:12]); b.close()
