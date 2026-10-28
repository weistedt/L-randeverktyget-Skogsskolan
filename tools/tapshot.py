"""Öppnar en bok i läsaren (mobil), trycker på valda tryckval och tar skärmdump.
    python3 tools/tapshot.py m4 2 [index index …]   -> tools/out/tap-<bok>-<sida>.png"""
import sys, pathlib
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent
bid, pg = sys.argv[1], int(sys.argv[2]); taps = [int(a) for a in sys.argv[3:]]
with sync_playwright() as p:
    b = p.chromium.launch(); x = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, has_touch=True)
    errs = []; x.on('pageerror', lambda e: errs.append(str(e)))
    x.goto(f'file://{R}/dist/local.html'); x.wait_for_timeout(800)
    x.evaluate(f"localStorage.clear();openBook('{bid}',{pg})"); x.wait_for_timeout(1200)
    sels = x.locator(f'#stage .page[data-idx="{pg}"] .sel')
    for t in taps:
        sels.nth(t).click(); x.wait_for_timeout(250)
    x.wait_for_timeout(500); x.screenshot(path=str(R / f'tools/out/tap-{bid}-{pg}.png')); print('errors', errs); b.close()
