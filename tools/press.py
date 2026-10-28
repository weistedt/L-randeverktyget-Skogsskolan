"""Tryckfiler för Bokbinderiet: en käll-PDF per bok -> dist/print/<id>.pdf + dist/print/manifest.json.

Sidordning i käll-PDF:en (samma som pressLayout() i src/press.js):
  0 framsida och 1 baksida, båda 216 x 303 mm med 3 mm utfall (TrimBox satt till A4),
  2 "Den här boken tillhör", uppgiftssidorna, facit, diplom, sist "Mina egna sidor" (A4).
Framsidan får omslagsbilden i tryckupplösning från assets/print-covers/<id>.jpg om den finns.
Bilderna i inlagan sparas som JPEG q85 (alfakanalen orörd), omslagsbilden som JPEG q90.

    python3 tools/press.py [bokid …]      (bygg först: python3 src/build.py)
Appen hämtar print/<id>.pdf och print/manifest.json bredvid sidan, så filerna publiceras med artefakten (files)."""
import sys, io, json, base64, pathlib, time
import pypdf
from pypdf.generic import NameObject, RectangleObject, NumberObject
from PIL import Image
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parent.parent
U = f"file://{R}/dist/local.html"
OUT = R / 'dist/print'; OUT.mkdir(parents=True, exist_ok=True)
HI = R / 'assets/print-covers'  # uppskalade med Recraft crisp_upscale (docs/cover-hi-urls.txt)
MM = 72 / 25.4
BLEED = 3 * MM


def hi_cover(bid):
    """Omslagsbilden i tryckupplösning (assets/print-covers/<id>.jpg, A4-beskuren, 2600 px bred) som data-URL."""
    f = HI / f'{bid}.jpg'
    if not f.exists():
        return None
    return 'data:image/jpeg;base64,' + base64.b64encode(f.read_bytes()).decode()


def shrink(writer, q=85):
    done = set()
    for p in writer.pages:
        xo = (p.get('/Resources') or {}).get('/XObject') or {}
        for _, ref in xo.items():
            o = ref.get_object()
            if o.get('/Subtype') != '/Image' or id(o) in done or o.get('/Filter') == '/DCTDecode':
                continue
            done.add(id(o))
            if o.get('/BitsPerComponent') != 8:
                continue
            wd, ht = o['/Width'], o['/Height']; raw = o.get_data()
            mode = {3 * wd * ht: 'RGB', wd * ht: 'L'}.get(len(raw))
            if not mode:
                continue
            buf = io.BytesIO(); Image.frombytes(mode, (wd, ht), raw).save(buf, 'JPEG', quality=q, optimize=True)
            o._data = buf.getvalue(); o[NameObject('/Filter')] = NameObject('/DCTDecode')
            if '/DecodeParms' in o: del o['/DecodeParms']
            o[NameObject('/Length')] = NumberObject(len(o._data))


man_path = OUT / 'manifest.json'
man = json.loads(man_path.read_text()) if man_path.exists() else {}
want = set(sys.argv[1:])
t0 = time.time()
with sync_playwright() as p:
    br = p.chromium.launch(); x = br.new_page(viewport={'width': 900, 'height': 1300}); errs = []
    x.on('pageerror', lambda e: errs.append(str(e)))
    x.goto(U); x.wait_for_timeout(600)
    books = x.evaluate("BOOKS.map(b=>({id:b.id,title:b.title,subj:SUBJ[b.subj].name,nr:b.nr,lay:pressLayout(b),hash:pressHash(b)}))")
    for bk in books:
        bid = bk['id']
        if want and bid not in want:
            continue
        # omslag med utfall
        x.goto(U + f'#press-{bid}-cv'); x.reload(); x.wait_for_selector('html[data-ready]')
        hc = hi_cover(bid)
        if hc:
            x.evaluate("""([id,src])=>new Promise(r=>{const im=document.getElementById('cv-'+id);const t=new Image();t.onload=()=>{im.setAttribute('href',src);setTimeout(r,300)};t.onerror=()=>r();t.src=src})""", [bid, hc])
        x.wait_for_timeout(300)
        cv = x.pdf(width='216mm', height='303mm', print_background=True, prefer_css_page_size=False)
        # inlagan
        x.goto(U + f'#press-{bid}-in'); x.reload(); x.wait_for_selector('html[data-ready]'); x.wait_for_timeout(300)
        nb2 = x.evaluate("""()=>{const ps=document.querySelectorAll('#printRoot .pg');const pg=ps[ps.length-1];const o=pg.querySelector('.owner');if(!o)return null;const P=pg.getBoundingClientRect(),r=o.getBoundingClientRect();const s=595.28/P.width;
          return [ (r.left-P.left)*s, 841.89-(r.bottom-P.top)*s, r.width*s, r.height*s ]}""")
        nb = x.evaluate("""()=>{const pg=document.querySelector('#printRoot .pg');const o=pg.querySelector('.owner');const P=pg.getBoundingClientRect(),r=o.getBoundingClientRect();const s=595.28/P.width;
          return [ (r.left-P.left)*s, 841.89-(r.bottom-P.top)*s, r.width*s, r.height*s ]}""")
        inner = x.pdf(format='A4', print_background=True, prefer_css_page_size=True)
        # sätt ihop
        w = pypdf.PdfWriter()
        rc = pypdf.PdfReader(io.BytesIO(cv)); ri = pypdf.PdfReader(io.BytesIO(inner))
        for pg in rc.pages:
            w.add_page(pg)
        for pg in ri.pages:
            w.add_page(pg)
        W, H = float(w.pages[0].mediabox.width), float(w.pages[0].mediabox.height)
        for i in (0, 1):
            w.pages[i].trimbox = RectangleObject([BLEED, BLEED, W - BLEED, H - BLEED])
            w.pages[i].bleedbox = RectangleObject([0, 0, W, H])
        shrink(w)
        w.add_metadata({'/Title': f"{bk['title']} – Skogsskolan", '/Author': 'Skogsskolan', '/Subject': f"{bk['subj']} {bk['nr']}", '/Keywords': bk['hash']})
        f = OUT / f'{bid}.pdf'
        with open(f, 'wb') as fh:
            w.write(fh)
        n = len(w.pages); lay = bk['lay']
        if n != lay['total']:
            errs.append(f'{bid}: {n} sidor i PDF men layout säger {lay["total"]}')
        man[bid] = {'pages': n, 'lay': lay, 'name': [round(v, 1) for v in nb], 'name2': [round(v, 1) for v in nb2] if nb2 else None, 'hash': bk['hash'], 'bytes': f.stat().st_size, 'hi': bool(hc)}
        print(bid, n, 'sidor', round(f.stat().st_size / 1e6, 2), 'MB', 'hi' if hc else 'lo', flush=True)
    br.close()
man_path.write_text(json.dumps(man, ensure_ascii=False, separators=(',', ':')))
print('klart', len(man), 'böcker,', round(sum(v['bytes'] for v in man.values()) / 1e6, 1), 'MB,', round(time.time() - t0), 's, fel:', errs[:5])
