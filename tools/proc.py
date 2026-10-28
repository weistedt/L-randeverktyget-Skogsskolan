"""Frilägger Recraft-figurer: assets/recraft-original/<namn>.(webp|jpg|png) -> src/img/<namn>.webp

    python3 tools/proc.py                 # alla i MIRROR
    python3 tools/proc.py owl_read fox_point

Steg: rembg (isnet-general-use) -> alfaklipp -> kantfärgsrening mot bakgrundens median ->
spegling så att figuren tittar åt höger -> beskär -> 640 px kvadrat med fötterna mot nederkanten
(flygande figurer centreras) -> webp q84. Skriver även tools/out/sheet.png för granskning.
"""
import sys, pathlib
import numpy as np
from PIL import Image
from rembg import remove, new_session

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'recraft-original'
OUT = ROOT / 'src' / 'img'
# 1 = spegla (originalet tittar/pekar åt vänster)
MIRROR = {'squirrel': 1, 'squirrel_wave': 1, 'squirrel_think': 0, 'owl': 0, 'owl_wave': 0, 'fox': 1, 'fox_wave': 1,
          'swallow': 1, 'swallow_perch': 1,
          'squirrel_point': 1, 'squirrel_cheer': 0, 'owl_think': 0, 'owl_cheer': 0, 'owl_read': 0,
          'fox_think': 0, 'fox_cheer': 0, 'fox_point': 0, 'swallow_cheer': 0, 'swallow_map': 0, 'ivar': 0, 'ivar_point': 0, 'ivar_think': 0, 'ivar_wave': 0, 'ivar_cheer': 0}
FLY = {'swallow'}
# isnet tappar ibland en uppsträckt vinge; då används u2net
MODEL = {'swallow_cheer': 'u2net'}
SESS = {}


def sess(n):
    m = MODEL.get(n, 'isnet-general-use')
    if m not in SESS:
        SESS[m] = new_session(m)
    return SESS[m]


def find(n):
    for e in ('webp', 'jpg', 'png', 'raw'):
        p = SRC / f'{n}.{e}'
        if p.exists():
            return p
    raise FileNotFoundError(n)


def proc(n, m):
    im = Image.open(find(n)).convert('RGB')
    if im.size[0] != 1024:
        im = im.resize((1024, 1024), Image.LANCZOS)
    a = np.array(remove(im, session=sess(n), post_process_mask=True))[:, :, 3].astype(np.float32) / 255
    rgb = np.array(im).astype(np.float32)
    border = np.concatenate([rgb[:12].reshape(-1, 3), rgb[-12:].reshape(-1, 3), rgb[:, :12].reshape(-1, 3), rgb[:, -12:].reshape(-1, 3)])
    B = np.median(border, axis=0)
    a = np.clip((a - 0.08) / 0.84, 0, 1)
    aa = np.maximum(a, 1e-3)[..., None]
    F = np.clip((rgb - (1 - aa) * B) / aa, 0, 255)
    F = np.where(a[..., None] > 0.98, rgb, F)
    o = Image.fromarray(np.dstack([F, a * 255]).astype(np.uint8), 'RGBA')
    bb = Image.fromarray((a > 0.06).astype(np.uint8) * 255).getbbox()
    if m:
        o = o.transpose(Image.FLIP_LEFT_RIGHT)
        bb = (1024 - bb[2], bb[1], 1024 - bb[0], bb[3])
    o = o.crop(bb); w, h = o.size
    T = 640; pad = 0.04
    sc = min(T * (1 - 2 * pad) / w, T * (1 - pad - 0.025) / h)
    o = o.resize((max(1, round(w * sc)), max(1, round(h * sc))), Image.LANCZOS)
    c = Image.new('RGBA', (T, T), (0, 0, 0, 0))
    x = (T - o.size[0]) // 2
    y = (T - o.size[1]) // 2 if n in FLY else T - round(T * 0.025) - o.size[1]
    c.alpha_composite(o, (x, y))
    c.save(OUT / f'{n}.webp', 'WEBP', quality=84, method=6)
    print(n, o.size, (OUT / f'{n}.webp').stat().st_size // 1024, 'KB')


names = sys.argv[1:] or list(MIRROR)
for n in names:
    proc(n, MIRROR.get(n, 0))
cell = 300; cols = 5; rows = (len(names) + cols - 1) // cols
sheet = Image.new('RGB', (cell * cols, cell * rows), (214, 229, 236))
for i, n in enumerate(names):
    im = Image.open(OUT / f'{n}.webp').resize((cell - 10, cell - 10))
    bg = Image.new('RGBA', im.size, (214, 229, 236, 255) if i % 2 == 0 else (240, 233, 220, 255)); bg.alpha_composite(im)
    sheet.paste(bg.convert('RGB'), ((i % cols) * cell + 5, (i // cols) * cell + 5))
(ROOT / 'tools' / 'out').mkdir(exist_ok=True)
sheet.save(ROOT / 'tools' / 'out' / 'sheet.png')
