import os,pathlib
from playwright.sync_api import sync_playwright
SP=pathlib.Path(__file__).parent; U=f"file://{SP}/local.html"
with sync_playwright() as p:
    b=p.chromium.launch(); errs=[]
    x=b.new_page(viewport={'width':1280,'height':900}); x.on('pageerror',lambda e:errs.append(str(e))); x.on('console',lambda m: m.type=='error' and errs.append(m.text))
    x.goto(U); x.wait_for_timeout(1200)
    x.click('[data-book="m1"]'); x.wait_for_timeout(900)
    x.click('#next'); x.wait_for_timeout(1300)   # pages 1-2
    # type answers on page 2 (Räkna och skriv): first box answer 3, second wrong
    inps=x.locator('#stage .page[data-idx="2"] input[data-k]')
    print('inputs on p2:',inps.count())
    inps.nth(0).fill('3'); inps.nth(1).fill('7'); x.wait_for_timeout(200)
    print('ok classes:', inps.nth(0).get_attribute('class'), '|', inps.nth(1).get_attribute('class'))
    x.click('[data-done="0"]'); x.wait_for_timeout(700)
    # pen draw on page 2
    x.click('[data-mode="pen"]'); x.wait_for_timeout(200)
    box=x.locator('#stage .page[data-idx="2"] .ink').first.bounding_box(); print('ink box',box)
    sx,sy=box['x']+box['width']*0.2,box['y']+box['height']*0.5
    x.mouse.move(sx,sy); x.mouse.down()
    for i in range(20): x.mouse.move(sx+i*8, sy+((i%5)-2)*6)
    x.mouse.up(); x.wait_for_timeout(300)
    x.screenshot(path=str(SP/'it-1.png'))
    x.click('[data-mode="point"]'); x.click('#next'); x.wait_for_timeout(1300); x.click('#next'); x.wait_for_timeout(1300)
    # pages 5-6: Ringa in (idx5) select icons
    sels=x.locator('#stage .page[data-idx="5"] .sel'); print('sels p5',sels.count())
    for i in range(4): sels.nth(i).click()
    x.wait_for_timeout(300); x.screenshot(path=str(SP/'it-2.png'))
    x.click('#prev'); x.wait_for_timeout(1300); x.click('#prev'); x.wait_for_timeout(1300)
    v=x.locator('#stage .page[data-idx="2"] input[data-k]').nth(0).input_value(); n=x.locator('#stage .page[data-idx="2"] .ink path').count()
    print('persist value',v,'ink paths',n)
    st=x.evaluate("localStorage.getItem('skogsskolan-v1')"); print('stored len',len(st or ''))
    x.click('#back'); x.wait_for_timeout(800); x.screenshot(path=str(SP/'it-shelf.png'))
    m=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2); m.goto(U); m.wait_for_timeout(1200); m.screenshot(path=str(SP/'it-m-shelf.png'),full_page=False)
    m.click('[data-book="m3"]'); m.wait_for_timeout(900)
    for i in range(6): m.click('#next'); m.wait_for_timeout(1000)
    m.screenshot(path=str(SP/'it-m-reader.png'))
    print('errors:',errs[:10])
    b.close()
