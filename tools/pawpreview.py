"""Jämför tass-ikonerna i nivåpiller -> tools/out/paws.png"""
import base64, pathlib
from playwright.sync_api import sync_playwright
R = pathlib.Path(__file__).resolve().parent.parent
lab = {'paw_moss': 'Mossgrön', 'paw_bark': 'Barkbrun', 'paw_lichen': 'Lav', 'paw_pine': 'Tallgrön', 'paw_sand': 'Sand', 'paw_heather': 'Ljung'}
u = lambda n: 'data:image/webp;base64,' + base64.b64encode((R / f'src/img/icon_{n}.webp').read_bytes()).decode()
rows = ''.join(f'''<div style="display:flex;align-items:center;gap:22px;margin:10px 0"><b style="width:110px;font:600 18px sans-serif;color:#2A3531">{l}</b><span style="display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:99px;padding:6px 16px 6px 10px;box-shadow:0 2px 8px -3px rgba(0,0,0,.3);font:700 16px sans-serif;color:#2A3531">{''.join(f'<img src="{u(n)}" width=26 height=26>' for _ in range(3))} från 6 år</span><span style="display:inline-flex;gap:4px">{''.join(f'<img src="{u(n)}" width=40 height=40>' for _ in range(4))}</span></div>''' for n, l in lab.items())
(R / 'tools/out/paws.html').write_text(f'<html><body style="margin:0;padding:18px 24px;background:#EEF1EC;width:640px">{rows}</body></html>')
with sync_playwright() as p:
    b = p.chromium.launch(); x = b.new_page(viewport={'width': 690, 'height': 440}, device_scale_factor=2)
    x.goto(f'file://{R}/tools/out/paws.html'); x.wait_for_timeout(300); x.screenshot(path=str(R / 'tools/out/paws.png'), full_page=True); b.close()
