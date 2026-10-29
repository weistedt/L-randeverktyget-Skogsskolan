"""Berättelsescener -> src/img/icon_sc_*.webp (kvadratisk transparent duk, bilden centrerad med rundade hörn).
Originalen ligger i assets/recraft-original/scenes/ (adresser i docs/scene-urls.txt).
Visas med artFit('sc_namn', bredd, höjd) som beskär till bilden.
    python3 tools/mkscenes.py
"""
import pathlib
from PIL import Image, ImageDraw, ImageFilter
R = pathlib.Path(__file__).resolve().parent.parent
SRC = R / 'assets/recraft-original/scenes'; OUT = R / 'src/img'
W = 1000
# sökbilder där barnet trycker i bilden behåller raka kanter
HARD = {'sc_skog', 'sc_park', 'sc_rum', 'sc_ang_vid'}
# beskärning (vänster, topp, höger, botten i andelar) per bild
CROP = {'sc_kotte': (.045, 0, .955, 1)}
# mindre bild för detaljrika motiv (gräs) så att filen inte blir för stor
SIZE = {'sc_ang_vid': (760, 72), 'sc_park': (820, 70), 'sc_rum': (820, 74), 'sc_skatt': (760, 76), 'sc_skog': (900, 72), 'sc_norrsken': (760, 74)}

def fix(n, im):
    if n == 'sc_storm':  # Recraft skrev "wait!" i himlen: fyll med en lodrät övergång mellan himlen ovanför och nedanför
        import numpy as np
        A = np.asarray(im).astype(float); x0, x1, y0, y1 = 470, 600, 330, 398
        top = A[y0 - 2:y0, x0:x1].mean(0); bot = A[y1:y1 + 2, x0:x1].mean(0)
        for y in range(y0, y1):
            t = (y - y0) / (y1 - y0); A[y, x0:x1] = top * (1 - t) + bot * t
        fill = Image.fromarray(A.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
        m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rectangle((x0 + 6, y0 + 4, x1 - 6, y1 - 4), fill=255); m = m.filter(ImageFilter.GaussianBlur(5))
        im = Image.composite(fill, im, m)
    return im

for f in sorted(SRC.glob('sc_*.webp')):
    n = f.stem
    if n.endswith('_a'): continue
    im = fix(n, Image.open(f).convert('RGB'))
    w, h = im.size; c = CROP.get(n)
    if c: im = im.crop((int(c[0]*w), int(c[1]*h), int(c[2]*w), int(c[3]*h)))
    w0, q = SIZE.get(n, (W, 74))
    im = im.resize((w0, round(w0 * im.size[1] / im.size[0])), Image.LANCZOS)
    if n in HARD:  # sökbilder med tryckytor: raka kanter, så att inget göms i en uttoning
        m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, im.size[0]-1, im.size[1]-1), radius=28, fill=255)
    else:  # mjukt uttonade kanter, så att bilden smälter in i sidan
        f = round(min(im.size) * .085); m = Image.new('L', im.size, 0)
        ImageDraw.Draw(m).rounded_rectangle((f, f, im.size[0]-1-f, im.size[1]-1-f), radius=f * 2, fill=255)
        m = m.filter(ImageFilter.GaussianBlur(f * .62))
    im.putalpha(m)
    can = Image.new('RGBA', (w0, w0), (0, 0, 0, 0)); can.paste(im, (0, (w0 - im.size[1]) // 2), im)
    can.save(OUT / f'icon_{n}.webp', quality=q, method=6)
    print(n, (OUT / f'icon_{n}.webp').stat().st_size // 1024, 'KB')
