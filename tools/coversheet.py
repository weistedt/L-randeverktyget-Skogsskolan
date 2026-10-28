"""Renderar alla omslag (sida 0) + hyllan till tools/out/covers.png och tools/out/shelf.png."""
import sys, pathlib, os
from playwright.sync_api import sync_playwright
from PIL import Image
R = pathlib.Path(__file__).resolve().parent.parent
SP = pathlib.Path(os.environ.get('SK_SCRATCH', R / 'dist')); U = f"file://{SP}/local.html"
OUT = R / 'tools/out'; OUT.mkdir(exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(); errs = []
    x = b.new_page(viewport={'width': 1280, 'height': 900}, device_scale_factor=1)
    x.on('pageerror', lambda e: errs.append('PE ' + str(e)))
    x.goto(U); x.wait_for_timeout(1200)
    x.screenshot(path=str(OUT / 'shelf.png'), full_page=True)
    ids = sys.argv[1:] or x.evaluate("BOOKS.map(b=>b.id)")
    ims = []
    for bid in ids:
        x.goto(U + '#print-' + bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(200)
        f = OUT / f'cover-{bid}.png'; x.locator('#printRoot .pg').first.screenshot(path=str(f)); ims.append(f)
    W = 260; H = int(W * 297 / 210); cols = 8; rows = (len(ims) + cols - 1) // cols
    s = Image.new('RGB', (cols * (W + 8) + 8, rows * (H + 8) + 8), (200, 205, 200))
    for k, f in enumerate(ims):
        s.paste(Image.open(f).convert('RGB').resize((W, H), Image.LANCZOS), (8 + (k % cols) * (W + 8), 8 + (k // cols) * (H + 8)))
    s.save(OUT / 'covers.png'); print('errors', errs[:5])
    b.close()
