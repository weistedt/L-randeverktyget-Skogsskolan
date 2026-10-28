"""3D-ikoner från Recraft-rutnät (3×3) -> src/img/icon_<namn>.webp (320 px, centrerad, transparent).
docs/icon-grids.txt: <grid-id> <namn,namn,…(9 st, '-' = hoppa över)> <url>
    python3 tools/icons.py          # laddar ner saknade rutnät, skär ut alla
"""
import pathlib, subprocess, sys
import numpy as np
from PIL import Image
from rembg import remove, new_session
R = pathlib.Path(__file__).resolve().parent.parent
G = R / 'assets/recraft-original/icon-grids'; G.mkdir(parents=True, exist_ok=True)
OUT = R / 'src/img'
MODEL = {'truck': 'u2net', 'birch_spring': 'u2net', 'birch_autumn': 'u2net', 'birch_winter': 'u2net', 'bear_den': 'u2net', 'leaf_autumn': 'u2net', 'mushroom': 'u2net', 'rain': 'u2net', 'flower': 'u2net'}  # isnet tappar tunna delar (fot, droppar, stjälk)
SESS = {}


def sess(n):
    m = MODEL.get(n, 'isnet-general-use')
    if m not in SESS:
        SESS[m] = new_session(m)
    return SESS[m]
only = set(sys.argv[1:])
done = []
for line in (R / 'docs/icon-grids.txt').read_text().split('\n'):
    if not line.strip():
        continue
    if line.startswith("#") or "#förkastad" in line:
        continue
    gid, names, url = line.split()[:3]
    f = G / f'{gid}.webp'
    if not f.exists():
        subprocess.run(['curl', '-sS', '-o', str(f), url], check=True)
    im = Image.open(f).convert('RGB'); W, H = im.size
    names = names.split(',')
    if only and not (set(names) & only):
        continue
    # Hitta rutnätet ur själva motiven (rutnätet ligger inte alltid jämnt i tredjedelar)
    M = np.array(remove(im, session=SESS.setdefault('u2net', new_session('u2net')), post_process_mask=True))[:, :, 3] > 40

    def runs(prof, gap=18):
        idx = np.where(prof)[0]; out = []
        for i in idx:
            if out and i - out[-1][1] <= gap: out[-1][1] = i
            else: out.append([i, i])
        return [r for r in out if r[1] - r[0] > 12]
    cx, cy = runs(M.any(axis=0)), runs(M.any(axis=1))
    if len(cx) != 3 or len(cy) != 3:
        print(gid, 'rutnät ej hittat', len(cx), len(cy), '– använder tredjedelar')
        cx = [[c * W // 3, (c + 1) * W // 3] for c in range(3)]; cy = [[r * H // 3, (r + 1) * H // 3] for r in range(3)]
    def span(rr, i, lim):
        lo = (rr[i - 1][1] + rr[i][0]) // 2 if i > 0 else 0
        hi = (rr[i][1] + rr[i + 1][0]) // 2 if i < 2 else lim
        return lo, hi
    for k, n in enumerate(names):
        if n == '-' or (only and n not in only):
            continue
        r, c = divmod(k, 3)
        x0, x1 = span(cx, c, W); y0, y1 = span(cy, r, H)
        cell = im.crop((x0, y0, x1, y1))
        rgb = np.array(cell).astype(np.float32)
        a = np.array(remove(cell, session=sess(n), post_process_mask=True))[:, :, 3].astype(np.float32) / 255
        B = np.median(np.array(im).reshape(-1, 3)[::97], axis=0)
        a = np.clip((a - 0.1) / 0.8, 0, 1)
        aa = np.maximum(a, 1e-3)[..., None]
        F = np.clip((rgb - (1 - aa) * B) / aa, 0, 255)
        F = np.where(a[..., None] > 0.98, rgb, F)
        o = Image.fromarray(np.dstack([F, a * 255]).astype(np.uint8), 'RGBA')
        bb = Image.fromarray((a > 0.08).astype(np.uint8) * 255).getbbox()
        o = o.crop(bb); w, h = o.size
        T = 320; sc = T * 0.92 / max(w, h)
        o = o.resize((max(1, round(w * sc)), max(1, round(h * sc))), Image.LANCZOS)
        cv = Image.new('RGBA', (T, T), (0, 0, 0, 0)); cv.alpha_composite(o, ((T - o.size[0]) // 2, (T - o.size[1]) // 2))
        cv.save(OUT / f'icon_{n}.webp', 'WEBP', quality=82, method=6); done.append(n)
print(len(done), 'ikoner')
cell = 120; cols = 10; rows = (len(done) + cols - 1) // cols
sh = Image.new('RGB', (cols * cell, rows * cell), (232, 238, 230))
for i, n in enumerate(done):
    t = Image.open(OUT / f'icon_{n}.webp').resize((cell - 8, cell - 8))
    sh.paste(t, ((i % cols) * cell + 4, (i // cols) * cell + 4), t)
(R / 'tools/out').mkdir(exist_ok=True); sh.save(R / 'tools/out/icons.png')
