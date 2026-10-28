import pathlib
from playwright.sync_api import sync_playwright
SP=pathlib.Path('tools/out')
init="""window.__work=0;"""
patch="""(()=>{const d=St.PageFlip.prototype.destroy;St.PageFlip.prototype.destroy=function(){try{const r=this.getRender();r.render=()=>{};for(const k in r)if(r[k]&&typeof r[k]==='object')r[k]=null;window.removeEventListener('resize',this.getUI().onResize)}catch(e){console.error(e)}d.call(this)};
 const proto=Object.getPrototypeOf(Object.getPrototypeOf(PF.getRender()));const dr=proto.constructor;})()"""
with sync_playwright() as p:
    b=p.chromium.launch(args=['--js-flags=--expose-gc','--enable-precise-memory-info']); pg=b.new_page(viewport={'width':1300,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m: m.type=='error' and errs.append(m.text))
    pg.goto(f"file://{SP}/local.html"); pg.wait_for_timeout(800)
    for fix in [False,True]:
        pg.reload(); pg.wait_for_timeout(800)
        pg.evaluate("openBook('m1',3)"); pg.wait_for_timeout(800)
        if fix: pg.evaluate(patch)
        for k in range(20):
            pg.evaluate("closeBook()"); pg.evaluate("openBook(['m1','m3','s1','g1'][%d%%4],3)"%k); pg.wait_for_timeout(150)
        pg.evaluate("window.gc&&gc()"); pg.wait_for_timeout(300); pg.evaluate("window.gc&&gc()")
        t=pg.evaluate("(()=>{const t0=performance.now();let n=0;return new Promise(r=>{const f=()=>{n++;if(performance.now()-t0<1000)requestAnimationFrame(f);else r(n)};requestAnimationFrame(f)})})()")
        print('fix' if fix else 'orig','heapMB',round(pg.evaluate("performance.memory.usedJSHeapSize")/1e6,1),'nodes', pg.evaluate("document.querySelectorAll('*').length"),'fps',t)
        pg.evaluate("next()"); pg.wait_for_timeout(1200); print(' idx',pg.evaluate("R.idx"))
    print('errs',errs[:3])
    b.close()
