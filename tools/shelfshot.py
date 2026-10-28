"""Skärmdumpar av hyllan: desktop (1280) och mobil (390) -> tools/out/shelf-d.png, shelf-m.png"""
import pathlib, os
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent
SP = pathlib.Path(os.environ.get('SK_SCRATCH', R / 'dist')); U = f"file://{SP}/local.html"
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    for name, vp, dpr in [('d', {'width': 1280, 'height': 900}, 1), ('m', {'width': 390, 'height': 844}, 2)]:
        x = b.new_page(viewport=vp, device_scale_factor=dpr); x.on('pageerror', lambda e: errs.append(str(e)))
        x.goto(U); x.wait_for_timeout(1200)
        x.screenshot(path=str(R / f'tools/out/shelf-{name}.png'), clip={'x': 0, 'y': 0, 'width': vp['width'], 'height': 1500 if name == 'd' else 1700})
    print('errors', errs); b.close()
