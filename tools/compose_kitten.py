"""Lägesord-scener som inte gick att generera rätt (under bordet, under stolen, framför lådan):
delar ur rutnät g18 (samma katt, bord, låda, stol, samma skala) läggs i rätt lager -> src/img/icon_k_*.webp"""
import pathlib, numpy as np
from PIL import Image
from rembg import remove, new_session
R = pathlib.Path(__file__).resolve().parent.parent; G = R / 'assets/recraft-original/icon-grids'
S = new_session('u2net')
def cells(gid):
    im = Image.open(G / f'{gid}.webp').convert('RGB'); W, H = im.size; out = {}
    for r in range(3):
        for c in range(3):
            cell = im.crop((c * W // 3, r * H // 3, (c + 1) * W // 3, (r + 1) * H // 3))
            a = np.array(remove(cell, session=S, post_process_mask=True))[:, :, 3]
            rgba = np.dstack([np.array(cell), a]); o = Image.fromarray(rgba, 'RGBA'); out[(r, c)] = o.crop(o.getbbox())
    return out
g = cells('g18'); g16 = cells('g16')
lying, table, box, chair = g[(0, 1)], g[(1, 0)], g[(1, 1)], g[(1, 2)]
# sittande katt: vänstra motivet i g16 (katt till vänster om lådan)
lb = g16[(2, 0)]; a = np.array(lb)[:, :, 3] > 30; cols = np.where(a.any(axis=0))[0]
gap = next((x for x in range(cols[0], cols[-1]) if not a[:, x].any()), None)
sit = lb.crop((0, 0, gap, lb.size[1])); sit = sit.crop(sit.getbbox())
def scene(layers, name, W=420, H=360):
    c = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for im, x, y in layers: c.alpha_composite(im, (int(x), int(y)))
    c = c.crop(c.getbbox()); w, h = c.size; T = 320; sc = T * .92 / max(w, h)
    c = c.resize((round(w * sc), round(h * sc)), Image.LANCZOS); o = Image.new('RGBA', (T, T), (0, 0, 0, 0)); o.alpha_composite(c, ((T - c.size[0]) // 2, (T - c.size[1]) // 2))
    o.save(R / 'src/img' / f'icon_{name}.webp', 'WEBP', quality=84, method=6); print(name, table.size, lying.size)
W, H = 420, 360; base = H - 20
# under bordet: katten ligger på golvet mellan benen, bordet ovanpå
scene([(lying, (W - lying.size[0]) // 2, base - lying.size[1] + 2), (table, (W - table.size[0]) // 2, base - table.size[1])], 'k_under_table')
scene([(lying, (W - lying.size[0]) // 2 + 6, base - lying.size[1] + 2), (chair, (W - chair.size[0]) // 2, base - chair.size[1])], 'k_under_chair')
# framför lådan: lådan bakom, katten framför och lite lägre
bx = box; s2 = sit.resize((round(sit.size[0] * .95), round(sit.size[1] * .95)))
scene([(bx, (W - bx.size[0]) // 2, base - 30 - bx.size[1]), (s2, (W - s2.size[0]) // 2, base - s2.size[1])], 'k_front_box')
# katten på bordet: samma runda bord som under bordet, katten sitter på bordsskivan
W2, H2 = 420, 520; b2 = H2 - 20; tx = (W2 - table.size[0]) // 2; ty = b2 - table.size[1]
s3 = sit.resize((round(sit.size[0] * .9), round(sit.size[1] * .9)))
scene([(table, tx, ty), (s3, (W2 - s3.size[0]) // 2, ty + round(table.size[1] * .1) - s3.size[1])], 'k_on_table', W2, H2)
# bakom lådan: katten sitter bakom, bara huvud och öron syns ovanför lådan
s4 = sit.resize((round(sit.size[0] * .95), round(sit.size[1] * .95)))
scene([(s4, (W - bx.size[0]) // 2 + round(bx.size[0] * .62), base - 26 - s4.size[1]), (bx, (W - bx.size[0]) // 2, base - bx.size[1])], 'k_behind_box', 460)
