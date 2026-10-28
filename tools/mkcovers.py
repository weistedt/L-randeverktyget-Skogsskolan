"""assets/recraft-original/covers/<id>.webp -> src/img/cover_<id>.webp (A4-beskärning, 900 px bred, webp q80).
Filer med suffix (m7a, s9a …) är förkastade varianter och hoppas över."""
import pathlib, re
from PIL import Image, ImageStat
import json
R = pathlib.Path(__file__).resolve().parent.parent
tone = {}
for p in sorted((R / 'assets/recraft-original/covers').glob('*.webp')):
    if not re.fullmatch(r'[msegnjtbk]\d+|sl', p.stem):
        continue
    im = Image.open(p).convert('RGB'); w, h = im.size
    th = round(w * 297 / 210)
    if th <= h:
        top = (h - th) // 2; im = im.crop((0, top, w, top + th))
    else:
        tw = round(h * 210 / 297); left = (w - tw) // 2; im = im.crop((left, 0, left + tw, h))
    im = im.resize((900, round(900 * 297 / 210)), Image.LANCZOS)
    im.save(R / 'src/img' / f'cover_{p.stem}.webp', 'WEBP', quality=72, method=6)  # sidan får vara högst 16 MB; tryckfilerna har egna omslag
    # Ton i titelzonen: mörk bakgrund -> ljus text; rörig -> starkare ljus toning
    st = ImageStat.Stat(im.convert('L').crop((0, int(im.size[1] * .05), im.size[0], int(im.size[1] * .38))))
    m, sd = st.mean[0], st.stddev[0]
    tone[p.stem] = 'dk' if m < 125 else ('busy' if sd > 45 or m < 150 else '')
    print(p.stem, end=' ')

(R / 'src/img/covers.json').write_text(json.dumps(tone, indent=0, sort_keys=True))
print()
print({k: v for k, v in tone.items() if v})
