"""Interaktionstest: fel-markering, Enter, räknare, pennstreck mellan prickar, ringa in, fel tryck, hyllans scroll."""
import pathlib
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent; U = f"file://{R}/dist/local.html"
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(); x = b.new_page(viewport={'width': 900, 'height': 1100}); errs = []
    x.on('pageerror', lambda e: errs.append(str(e)))
    x.goto(U); x.wait_for_timeout(700); x.evaluate("localStorage.clear();state.done={};state.work={};famClose()")
    def open_(bid, pg):
        x.evaluate(f"closeBook&&R.b&&closeBook();openBook('{bid}',{pg})"); x.wait_for_timeout(1300)
        return x.locator(f'#stage .page[data-idx="{pg}"]').first
    # 1) Sje-ljudet: skriv 'sx' + Enter -> no; skriv 'sj' -> ok
    idx = x.evaluate("BOOKS.find(b=>b.id==='s9').pages.findIndex(p=>p.t==='Sje-ljudet')+2")
    page = open_('s9', idx); inp = page.locator('input[data-k]').first
    inp.click(); inp.type('sx'); inp.press('Enter'); x.wait_for_timeout(200)
    res['fel markeras'] = 'no' in (inp.get_attribute('class') or '')
    res['Enter till nästa'] = x.evaluate("document.activeElement===document.querySelectorAll('#stage .page[data-idx=\"%d\"] input[data-k]')[1]" % idx)
    inp.click(); inp.fill('sj'); inp.press('Enter'); x.wait_for_timeout(200)
    res['bokstäver godkänns'] = 'ok' in (inp.get_attribute('class') or '')
    res['räknare'] = x.locator('#donebar [data-score]').first.inner_text()
    # 2) Pennstreck mellan prickar (E1 Yummy!)
    idx = x.evaluate("BOOKS.find(b=>b.id==='e1').pages.findIndex(p=>p.t==='Yummy!')+2")
    page = open_('e1', idx); x.evaluate("setMode('pen')")
    ans = page.locator('.match').get_attribute('data-ans').split(',')
    def stroke(a, c):
        ra = a.bounding_box(); rc = c.bounding_box()
        x0, y0 = ra['x'] + ra['width'] / 2, ra['y'] + ra['height'] / 2; x1, y1 = rc['x'] + rc['width'] / 2, rc['y'] + rc['height'] / 2
        x.mouse.move(x0, y0); x.mouse.down()
        for k in range(1, 16): x.mouse.move(x0 + (x1 - x0) * k / 15, y0 + (y1 - y0) * k / 15)
        x.mouse.up(); x.wait_for_timeout(250)
    stroke(page.locator('[data-ml="0"]'), page.locator(f'[data-mr="{ans[0]}"]'))
    res['rätt par grönt'] = 'ok' in (page.locator('[data-ml="0"]').get_attribute('class') or '')
    wrong = (int(ans[1]) + 1) % len(ans)
    stroke(page.locator('[data-ml="1"]'), page.locator(f'[data-mr="{wrong}"]'))
    res['fel par orange'] = 'no' in (page.locator('[data-ml="1"]').get_attribute('class') or '')
    x.evaluate("$('undo').click()"); x.wait_for_timeout(200)
    res['ångra tar bort paret'] = 'no' not in (page.locator('[data-ml="1"]').get_attribute('class') or '')
    for i, j in enumerate(ans):
        if i == 0: continue
        stroke(page.locator(f'[data-ml="{i}"]'), page.locator(f'[data-mr="{j}"]'))
    x.wait_for_timeout(300); res['sidan klar via streck'] = x.evaluate("doneSet(state.kid,'e1').includes(%d)" % (idx - 2))
    # 3) Ringa in med pennan (M1 Ringa in rätt antal)
    ri = x.evaluate("BOOKS.find(b=>b.id==='m1').pages.findIndex(p=>p.t==='Ringa in rätt antal')+2")
    page = open_('m1', ri); x.evaluate("setMode('pen')")
    s0 = page.locator('[data-need] .sel').first; r = s0.bounding_box(); cx, cy, rad = r['x'] + r['width'] / 2, r['y'] + r['height'] / 2, max(r['width'], r['height']) * .75
    import math
    x.mouse.move(cx + rad, cy); x.mouse.down()
    for k in range(1, 26): x.mouse.move(cx + rad * math.cos(k / 24 * 2 * math.pi), cy + rad * math.sin(k / 24 * 2 * math.pi))
    x.mouse.up(); x.wait_for_timeout(300)
    res['ring väljer'] = 'on' in (s0.get_attribute('class') or '')
    # 4) Fel tryck (M4 Lång och kort)
    x.evaluate("setMode('point')"); page = open_('m4', x.evaluate("BOOKS.find(b=>b.id==='m4').pages.findIndex(p=>p.t==='Lång och kort')+2"))
    sels = page.locator('.sel.pick'); bad = None
    for i in range(sels.count()):
        if sels.nth(i).get_attribute('data-ok') is None: bad = sels.nth(i); break
    bad.click(); x.wait_for_timeout(150); res['fel tryck markeras'] = 'no' in (bad.get_attribute('class') or '')
    x.wait_for_timeout(1300); res['fel tryck släpps'] = 'on' not in (bad.get_attribute('class') or '')
    # 5) Memory (S4): två kort som inte hör ihop vänds tillbaka, ett par ligger kvar, alla par klarar sidan
    mi = x.evaluate("BOOKS.find(b=>b.id==='s4').pages.findIndex(p=>p.t==='Memory med ord')+2")
    page = open_('s4', mi); cards = page.locator('.sel.memo'); n = cards.count()
    pairs = [cards.nth(i).get_attribute('data-pair') for i in range(n)]
    a = 0; b2 = next(i for i in range(n) if pairs[i] != pairs[0])
    cards.nth(a).click(); cards.nth(b2).click(); x.wait_for_timeout(300)
    up = 'on' in (cards.nth(b2).get_attribute('class') or ''); x.wait_for_timeout(1300)
    res['memory: fel par vänds tillbaka'] = up and 'on' not in (cards.nth(a).get_attribute('class') or '') and 'on' not in (cards.nth(b2).get_attribute('class') or '')
    for pr in sorted(set(pairs)):
        ii = [i for i in range(n) if pairs[i] == pr]
        for i in ii: cards.nth(i).click(); x.wait_for_timeout(120)
    x.wait_for_timeout(1300)
    res['memory: par ligger kvar'] = all('on' in (cards.nth(i).get_attribute('class') or '') for i in range(n))
    res['memory: sidan klar'] = x.evaluate("doneSet(state.kid,'s4').includes(%d)" % (mi - 2))
    # 6) Punktluckor och tryckord (S10)
    gi = x.evaluate("BOOKS.find(b=>b.id==='s10').pages.findIndex(p=>p.t==='Var slutar meningen?')+2")
    page = open_('s10', gi); gaps = page.locator('.sel.gap'); okg = [i for i in range(gaps.count()) if gaps.nth(i).get_attribute('data-ok') is not None]
    for i in okg: gaps.nth(i).click(); x.wait_for_timeout(120)
    x.wait_for_timeout(500); res['punkter: fyra luckor, sidan klar'] = (len(okg) == 4, x.evaluate("doneSet(state.kid,'s10').includes(%d)" % (gi - 2)))
    ti = x.evaluate("BOOKS.find(b=>b.id==='s10').pages.findIndex(p=>p.t==='Hitta stavfelen')+2")
    page = open_('s10', ti); tw = page.locator('.tapline .sel'); res['stavfel: fyra tryckbara fel'] = sum(1 for i in range(tw.count()) if tw.nth(i).get_attribute('data-ok') is not None) == 4
    # 7) Hyllans scroll
    x.evaluate("closeBook()"); x.wait_for_timeout(400); x.evaluate("window.scrollTo(0,1600)"); x.wait_for_timeout(200)
    bk = x.locator('[data-book="e2"]').first; bk.scroll_into_view_if_needed(); x.wait_for_timeout(200); y0 = x.evaluate('window.scrollY')
    bk.click(); x.wait_for_timeout(1200); x.evaluate("$('back').click()"); x.wait_for_timeout(600)
    sy=x.evaluate('window.scrollY'); res['hyllan behåller läge'] = (abs(sy - y0) < 60, sy, y0)
    res['fel'] = errs[:3]; b.close()
for k, v in res.items(): print(f'{k}: {v}')
