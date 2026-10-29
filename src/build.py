"""Bygger Skogsskolan till EN html-fil.

    python3 src/build.py

Utdata:
  dist/skogsskolan.html   – det som publiceras (Google Fonts + page-flip från CDN)
  <SK_SCRATCH>/local.html – samma sak med lokala typsnitt och lokal page-flip, för Playwright-test
                            (SK_SCRATCH = miljövariabel, annars dist/)
Bilder: src/img/<figur>.webp (3D-figurer, frilagda) och src/img/cover_<bokid>.webp (omslag).
Nya figurposer måste läggas till i NAMES nedan.
"""
import base64, json, os, pathlib

S = pathlib.Path(__file__).resolve().parent
ROOT = S.parent
DIST = ROOT / 'dist'; DIST.mkdir(exist_ok=True)
SCRATCH = pathlib.Path(os.environ.get('SK_SCRATCH', DIST))

FONTS = '<link id="gfonts" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..700,0..100,0..1&display=swap">'
PF = '<script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.js"></script>'

# 3D-figurer (Recraft). Ordningen spelar ingen roll; namnet blir ART-nyckel och <use href="#ci-namn">.
NAMES = ['squirrel', 'squirrel_wave', 'squirrel_think', 'owl', 'owl_wave', 'fox', 'fox_wave', 'swallow', 'swallow_perch']
NAMES += [n for n in ['squirrel_point', 'squirrel_cheer', 'owl_think', 'owl_cheer', 'owl_read', 'fox_think', 'fox_cheer',
                      'fox_point', 'swallow_cheer', 'swallow_map', 'ivar', 'ivar_point', 'ivar_think', 'ivar_wave', 'ivar_cheer'] if (S / 'img' / f'{n}.webp').exists()]

def b64(p):
    return 'data:image/webp;base64,' + base64.b64encode(p.read_bytes()).decode()

d = {n: b64(S / 'img' / f'{n}.webp') for n in NAMES}
cv = {p.stem[6:]: b64(p) for p in sorted((S / 'img').glob('cover_*.webp'))}
extra = {p.stem: b64(p) for p in sorted((S / 'img').glob('hero_*.webp'))}
# 3D-ikoner: bara de som används (ICON_USE), övriga ligger kvar i img/ som reserv
ICON_SKIP = {'paw_bark', 'paw_lichen', 'paw_pine', 'paw_sand', 'paw_heather', 'daisy'}
icons = {p.stem[5:]: b64(p) for p in sorted((S / 'img').glob('icon_*.webp')) if p.stem[5:] not in ICON_SKIP}
# Innehållsruta per ikon (procent av bildens sida, 2 enheters marginal) så att breda scener kan visas tätt beskurna (artFit)
from PIL import Image
def _box(p):
    im = Image.open(p); W, H = im.size
    # scenbilder och bildval med mjukt uttonade kanter: lådan räknas från den nästan täckande delen, så att uttoningen hamnar utanför
    thr = 200 if p.stem.startswith(('icon_sc_', 'icon_vg_')) and p.stem[5:] not in ('sc_skog', 'sc_park', 'sc_rum') else 20
    # helt täckande bild (sparad utan alfa): lådan är hela bilden
    bb = im.getchannel('A').point(lambda v: 255 if v > thr else 0).getbbox() if 'A' in im.getbands() else (0, 0, W, H)
    if not bb: return None
    x0, y0, x1, y1 = [max(0, min(100, round(v * 100 / W) + d)) for v, d in zip(bb, (-2, -2, 2, 2))]
    return [x0, y0, x1 - x0, y1 - y0]
iconbox = {k: _box(S / 'img' / f'icon_{k}.webp') for k in icons}
cj = "/* 3D-figurer och omslag (Recraft). Bilderna ligger en gång i dokumentet och återanvänds med <use>. */\n"
cj += "const CHARIMG=" + json.dumps(d) + ";\nconst COVERIMG=" + json.dumps(cv) + ";\nconst COVERS=Object.keys(COVERIMG);\n"
tone = json.loads((S / 'img' / 'covers.json').read_text()) if (S / 'img' / 'covers.json').exists() else {}
cj += "const COVERTONE=" + json.dumps(tone) + ";\n"
mocks2 = {p.stem[6:]: b64(p) for p in sorted((S / 'img').glob('mock2_*.webp'))}  # Bokbinderiets produktfoton (Recraft, docs/recraft-log.md)
cj += "const MOCK2IMG=" + json.dumps(mocks2) + ";\nconst MOCK2Q=" + (S / 'img' / 'mocks2.json').read_text() + ";\n"
cj += "const SCALE3D=" + (S / 'img' / 'scale3d.json').read_text() + ";\n"  # 3D-våg i delar (stativ, balk, skål), Recraft 2026-10-27
cj += "const PEN3D=" + (S / 'img' / 'pencils3d.json').read_text() + ";\n"  # 3D-pennor i tre delar (spets, kropp, ände), Recraft 2026-10-27
cj += "const HEROIMG=" + json.dumps(extra) + ";\nconst ICONIMG=" + json.dumps(icons) + ";\nconst ICONBOX=" + json.dumps(iconbox, separators=(',', ':')) + ";\n"
cj += (S / 'chars-tail.js').read_text()
(S / 'chars.js').write_text(cj)

css = (S / 'palette.css').read_text() + '\n' + (S / 'style.css').read_text()
ORDER = ['glyphs.js', 'art.js', 'art2.js', 'chars.js', 'geodata.js', 'write.js', 'pages.js', 'c-common.js', 'c-matte.js',
         'c-svenska.js', 'c-eng.js', 'c-geo.js', 'geo-eur.js', 'c-level4.js', 'c-level5.js', 'c-mer.js', 'c-tryg.js', 'c-catalog.js', 'press.js', 'firebase-config.js', 'family.js', 'app.js', 'binderi.js']
js = '\n'.join((S / f).read_text() for f in ORDER)
head = '<title>Skogsskolan</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
PFJS = '<script>\n' + (S / 'vendor' / 'page-flip.browser.js').read_text() + '\n</script>'  # inbäddad och patchad (se vendor/)
# pdf-lib (MIT) ligger som text och körs först när Bokbinderiet sätter ihop en PDF
PDFLIB = '<script type="text/plain" id="pdflibsrc">\n' + (S / 'vendor' / 'pdf-lib.min.js').read_text().replace('\ufffd', '\\uFFFD') + '\n</script>'  # U+FFFD som JS-escape (står bara i strängar)
html = head + FONTS + '\n<style>\n' + css + '\n</style>\n' + (S / 'body.html').read_text() + '\n' + PFJS + '\n' + PDFLIB + '\n<script>\n' + js + '\n</script>\n'
(DIST / 'skogsskolan.html').write_text(html)
# Egen webbplats (Firebase Hosting): ett helt dokument, dist/web/index.html. Tryckfilerna kopieras till dist/web/print av tools/web.sh.
WEB = DIST / 'web'; WEB.mkdir(exist_ok=True)
(WEB / 'index.html').write_text("<!doctype html><html lang='sv'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'>"
    "<meta name='description' content='Lärböcker i matte, svenska, engelska och geografi för barn 4–8 år – att bläddra i, skriva i och skriva ut.'>"
    "<meta name='theme-color' content='#F1F3EF'></head><body>" + html + "</body></html>")
legacy = pathlib.Path('/home/claude/ekollon.html')          # publiceringsväg i Claude-sessionen
if legacy.parent.exists():
    legacy.write_text(html)

# Lokal testversion
F = ROOT / 'assets' / 'fonts'
ff = f"""<style>
@font-face{{font-family:Andika;font-weight:400;src:url('file://{F}/Andika-Regular.ttf')}}
@font-face{{font-family:Andika;font-weight:700;src:url('file://{F}/Andika-Bold.ttf')}}
@font-face{{font-family:Fraunces;font-weight:100 900;src:url('file://{F}/Fraunces.ttf')}}
</style>"""
pf_local = next((p for p in [ROOT / 'node_modules/page-flip/dist/js/page-flip.browser.js',
                             SCRATCH / 'npm/node_modules/page-flip/dist/js/page-flip.browser.js'] if p.exists()), None)
local = html.replace(FONTS, ff)
if pf_local:
    local = local.replace(PF, f'<script src="file://{pf_local}"></script>')
_local = ("<!doctype html><html lang='sv'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'></head><body>" + local + "</body></html>")
for d in {DIST, SCRATCH}:
    (d / 'local.html').write_text(_local)
print('built', len(html) // 1024, 'KB')
