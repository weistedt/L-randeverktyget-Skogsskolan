"""Krymper PDF:erna i dist/pdf: bildernas färgdata sparas som JPEG (q85) i stället för förlustfri Flate.
Alfakanalen (SMask) behålls orörd, så friläggningen blir lika skarp. Skriver om filerna och zippen."""
import pathlib, io, zipfile
import pypdf
from pypdf.generic import NameObject
from PIL import Image
R = pathlib.Path(__file__).resolve().parent.parent; D = R / 'dist/pdf'
tot0 = tot1 = 0
for f in sorted(D.glob('*.pdf')):
    r = pypdf.PdfReader(f); w = pypdf.PdfWriter(clone_from=r); done = set()
    for p in w.pages:
        xo = (p.get('/Resources') or {}).get('/XObject') or {}
        for name, ref in xo.items():
            o = ref.get_object()
            if o.get('/Subtype') != '/Image' or id(o) in done or o.get('/Filter') == '/DCTDecode': continue
            done.add(id(o))
            if o.get('/BitsPerComponent') != 8: continue
            wd, ht = o['/Width'], o['/Height']; raw = o.get_data()
            mode = {3 * wd * ht: 'RGB', wd * ht: 'L'}.get(len(raw))
            if not mode: continue
            buf = io.BytesIO(); Image.frombytes(mode, (wd, ht), raw).save(buf, 'JPEG', quality=85, optimize=True)
            o.set_data(buf.getvalue()) if False else None
            o._data = buf.getvalue(); o[NameObject('/Filter')] = NameObject('/DCTDecode')
            if '/DecodeParms' in o: del o['/DecodeParms']
            if '/Length' in o: o[NameObject('/Length')] = pypdf.generic.NumberObject(len(o._data))
    a = f.stat().st_size; tmp = f.with_suffix('.tmp'); w.write(tmp); tmp.replace(f); b = f.stat().st_size
    tot0 += a; tot1 += b
z = R / 'dist' / 'Skogsskolan - böckerna var för sig.zip'
with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
    for f in sorted(D.glob('*.pdf')): zf.write(f, f.name)
print(round(tot0 / 1e6, 1), 'MB ->', round(tot1 / 1e6, 1), 'MB; zip', round(z.stat().st_size / 1e6, 1), 'MB')
