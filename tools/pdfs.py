"""A4-PDF per bok -> dist/pdf/ och en zip med alla (Skogsskolan - böckerna var för sig.zip).
    python3 tools/pdfs.py [bokid …]"""
import sys, pathlib, zipfile
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent
U = f"file://{R}/dist/local.html"; OUT = R / 'dist/pdf'; OUT.mkdir(parents=True, exist_ok=True)
SUB = {'matte': 'Matte', 'svenska': 'Svenska', 'eng': 'Engelska', 'geo': 'Geografi'}
with sync_playwright() as p:
    b = p.chromium.launch(); x = b.new_page(viewport={'width': 900, 'height': 900}); errs = []
    x.on('pageerror', lambda e: errs.append(str(e)))
    x.goto(U); x.wait_for_timeout(600)
    books = x.evaluate("BOOKS.map(b=>[b.id,b.subj,b.nr,b.title])")
    want = set(sys.argv[1:])
    files = []
    for bid, subj, nr, title in books:
        if want and bid not in want: continue
        safe = title.replace('&', 'och').replace('!', '').replace('?', '').replace("'", '').replace('/', '-')
        f = OUT / f"Skogsskolan - {SUB[subj]} {nr} - {safe}.pdf"
        x.goto(U + '#print-' + bid); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(300)
        x.pdf(path=str(f), format='A4', print_background=True, prefer_css_page_size=True); files.append(f)
    b.close()
z = R / 'dist' / 'Skogsskolan - böckerna var för sig.zip'
with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in sorted(OUT.glob('*.pdf')): zf.write(f, f.name)
print(len(files), 'pdf', round(sum(f.stat().st_size for f in files) / 1e6, 1), 'MB; zip', round(z.stat().st_size / 1e6, 1), 'MB; fel', errs[:3])
