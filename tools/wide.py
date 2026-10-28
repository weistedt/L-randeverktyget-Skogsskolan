"""Långsmala 3D-motiv (ormar) -> src/img/icon_wide_<namn>.webp i formatet 5:1 (viewBox 100×20).
docs/wide-images.txt: <namn,namn> <url>  – motiven ligger ovanför varandra i bilden."""
import pathlib, subprocess
import numpy as np
from PIL import Image
from rembg import remove, new_session
R = pathlib.Path(__file__).resolve().parent.parent
G = R / 'assets/recraft-original/wide'; G.mkdir(parents=True, exist_ok=True)
S = new_session('u2net')
for k, line in enumerate(l for l in (R / 'docs/wide-images.txt').read_text().split('\n') if l.strip()):
    names, url = line.split()[:2]; names = names.split(',')
    f = G / f'w{k}.webp'
    if not f.exists(): subprocess.run(['curl', '-sS', '-o', str(f), url], check=True)
    im = Image.open(f).convert('RGB'); W, H = im.size
    a = np.array(remove(im, session=S, post_process_mask=True))[:, :, 3].astype(np.float32) / 255
    rows = np.where((a > .3).any(axis=1))[0]
    # dela i sammanhängande radband
    bands = []; 
    for y in rows:
        if bands and y - bands[-1][1] <= 6: bands[-1][1] = y
        else: bands.append([y, y])
    bands = [b for b in bands if b[1] - b[0] > 15]
    assert len(bands) == len(names), (bands, names)
    rgb = np.array(im).astype(np.float32); B = np.median(rgb.reshape(-1, 3)[::97], axis=0)
    for n, (y0, y1) in zip(names, bands):
        sub = a[y0:y1 + 1]; aa = np.clip((sub - .1) / .8, 0, 1); al = np.maximum(aa, 1e-3)[..., None]
        F = np.clip((rgb[y0:y1 + 1] - (1 - al) * B) / al, 0, 255); F = np.where(aa[..., None] > .98, rgb[y0:y1 + 1], F)
        o = Image.fromarray(np.dstack([F, aa * 255]).astype(np.uint8), 'RGBA'); o = o.crop(Image.fromarray((aa > .08).astype(np.uint8) * 255).getbbox())
        T = (1000, 200); sc = min(T[0] * .98 / o.size[0], T[1] * .9 / o.size[1])
        o = o.resize((round(o.size[0] * sc), round(o.size[1] * sc)), Image.LANCZOS)
        c = Image.new('RGBA', T, (0, 0, 0, 0)); c.alpha_composite(o, ((T[0] - o.size[0]) // 2, (T[1] - o.size[1]) // 2))
        c.save(R / 'src/img' / f'icon_wide_{n}.webp', 'WEBP', quality=84, method=6); print(n, o.size)
