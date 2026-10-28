"""Bildval (vinjetter): 2x2-rutnät från Recraft -> src/img/icon_vg_<namn>.webp med mjukt uttonade kanter.
docs/vignette-grids.txt: <grid-id> <namn,namn,namn,namn ('-' = hoppa över)> <url>
Rutorna läses uppifrån vänster, rad för rad. Visas med artFit('vg_namn', bredd, höjd).
    python3 tools/vignettes.py
"""
import pathlib, subprocess
from PIL import Image, ImageDraw, ImageFilter
R = pathlib.Path(__file__).resolve().parent.parent
G = R / 'assets/recraft-original/vignettes'; G.mkdir(parents=True, exist_ok=True)
OUT = R / 'src/img'
S = 440  # sidlängd ut (sidan får vara högst 16 MB)


def cells(im):
    w, h = im.size; ins = .018
    for r in range(2):
        for c in range(2):
            x0, y0 = c * w / 2, r * h / 2
            yield im.crop((round(x0 + w * ins), round(y0 + h * ins), round(x0 + w / 2 - w * ins), round(y0 + h / 2 - h * ins)))


def fade(im):
    im = im.resize((S, round(S * im.size[1] / im.size[0])), Image.LANCZOS).convert('RGB')
    f = round(min(im.size) * .085); m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((f, f, im.size[0] - 1 - f, im.size[1] - 1 - f), radius=f * 2, fill=255)
    im.putalpha(m.filter(ImageFilter.GaussianBlur(f * .62)))
    return im


for line in (R / 'docs/vignette-grids.txt').read_text().split('\n'):
    if not line.strip() or line.startswith('#'):
        continue
    gid, names, url = line.split()[:3]
    f = G / f'{gid}.webp'
    if not f.exists():
        subprocess.run(['curl', '-sS', '-m', '60', '-o', str(f), url], check=True)
    for n, cell in zip(names.split(','), cells(Image.open(f).convert('RGB'))):
        if n == '-':
            continue
        fade(cell).save(OUT / f"icon_vg_{n}.webp", "WEBP", quality=76, method=6)
        print(n, end=' ')
print()
