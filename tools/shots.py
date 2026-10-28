import sys,os,pathlib
from playwright.sync_api import sync_playwright
SP=pathlib.Path(__file__).parent; U=f"file://{SP}/local.html"
mode=sys.argv[1]
with sync_playwright() as p:
    b=p.chromium.launch()
    errs=[]
    def pg(vw,vh,scale=1):
        x=b.new_page(viewport={'width':vw,'height':vh},device_scale_factor=scale)
        x.on('pageerror',lambda e:errs.append('PE '+str(e))); x.on('console',lambda m: m.type in('error','warning') and errs.append(m.type+' '+m.text))
        return x
    if mode=='ui':
        x=pg(1280,900); x.goto(U); x.wait_for_timeout(1200); x.screenshot(path=str(SP/'ui-shelf.png'),full_page=False)
        x.click('[data-book="m1"]'); x.wait_for_timeout(900); x.screenshot(path=str(SP/'ui-reader1.png'))
        x.click('#next'); x.wait_for_timeout(400); x.screenshot(path=str(SP/'ui-flipmid.png')); x.wait_for_timeout(1000); x.click('#next'); x.wait_for_timeout(1300); x.screenshot(path=str(SP/'ui-reader2.png'))
        m=pg(390,844,2); m.goto(U); m.wait_for_timeout(1200); m.screenshot(path=str(SP/'ui-m-shelf.png'))
        m.click('[data-book="s1"]'); m.wait_for_timeout(900)
        for i in range(2): m.click('#next'); m.wait_for_timeout(1100)
        m.screenshot(path=str(SP/'ui-m-reader.png'))
    else:
        out=SP/'pdf2'; out.mkdir(exist_ok=True)
        x=pg(900,900)
        for bid in sys.argv[2:]:
            x.goto(U+'#print-'+bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(300)
            x.pdf(path=str(out/f'{bid}.pdf'),format='A4',print_background=True,prefer_css_page_size=True)
    print('\n'.join(errs[:20]) or 'no errors')
    b.close()
