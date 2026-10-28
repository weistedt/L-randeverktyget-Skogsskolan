"""Vilka tryckfiler behöver byggas om? Jämför den nya appen med det som ligger publicerat.

    python3 tools/press_plan.py <gammal build.json eller tom fil>  > ombygg.txt

Skriver bok-id:n som måste byggas om (en per rad) och sparar det nya läget i dist/print/build.json,
som publiceras bredvid PDF:erna och blir jämförelsen nästa gång.

En bok byggs om när
  - dess innehåll ändrats (sidornas HTML, omslag, baksida, fyllnadssida: samma som pressHash + omslaget),
  - en bild den använder ändrats (bildens bytes ingår i fingeravtrycket, liksom tryckomslaget assets/print-covers/<id>.jpg),
  - en ändrad CSS-regel träffar något element i bokens tryckvy (selektorn provas mot den renderade sidan),
  - eller något globalt ändrats: @font-face/@keyframes m.m., tools/press.py, pdf-verktygen, eller det saknas gammalt läge.
Sådant som bara rör appen på skärm (familjerutan, inloggning, Bokbinderiet) bygger alltså inte om några PDF:er."""
import sys, json, hashlib, pathlib
from playwright.sync_api import sync_playwright

R = pathlib.Path(__file__).resolve().parent.parent
U = f"file://{R}/dist/local.html"
OUT = R / 'dist/print'; OUT.mkdir(parents=True, exist_ok=True)
sha = lambda b: hashlib.sha256(b if isinstance(b, bytes) else b.encode()).hexdigest()[:16]

old = {}
if len(sys.argv) > 1:
    try:
        old = json.loads(pathlib.Path(sys.argv[1]).read_text() or '{}')
    except Exception:
        old = {}

# globalt: verktygen som gör PDF:en
glob = sha(b''.join((R / p).read_bytes() for p in ['tools/press.py', 'src/vendor/page-flip.browser.js'] if (R / p).exists()))

def css_rules(css):
    """Råa CSS-regler ur källan (inte webbläsarens normaliserade text: den tappar värden med var() i kortformer).
    Ger (sammanhang, selektor eller None för @-regler som @font-face/@keyframes, nyckeltext)."""
    import re
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    out = []
    def block_end(i):
        d = 0; q = None
        while i < len(css):
            c = css[i]
            if q:
                if c == q and css[i - 1] != '\\': q = None
            elif c in '"\'': q = c
            elif c == '{': d += 1
            elif c == '}':
                d -= 1
                if d == 0: return i
            i += 1
        return len(css) - 1
    def walk(i, end, ctx):
        while i < end:
            j = css.find('{', i)
            if j < 0 or j >= end: break
            pre = ' '.join(css[i:j].split()); k = block_end(j); body = ' '.join(css[j + 1:k].split())
            if pre.startswith(('@media', '@supports', '@container', '@layer')):
                walk(j + 1, k, ctx + pre + ';')
            elif pre.startswith('@'):
                out.append((ctx, None, ctx + '|' + pre + '{' + body + '}'))
            elif pre:
                out.append((ctx, pre, ctx + '|' + pre + '{' + body + '}'))
            i = k + 1
    walk(0, len(css), '')
    return out

# en bok i tryckvyn, samma som #press-<id>-cv och #press-<id>-in i app.js, men utan att ladda om sidan
JS_RENDER = r"""async ([id,part])=>{const b=BOOKS.find(x=>x.id===id);const H=document.documentElement;H.classList.remove('press-cv','press-in');H.classList.add('print-mode','press-'+part);
 $('printRoot').innerHTML=part==='cv'?coverPage(b)+backPage(b):buildPages(b).slice(1).join('')+fillerPage(b)+fitPages([introNoFacit(b)]).join('');
 if(document.fonts)await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const root=$('printRoot');const html=root.innerHTML;
 /* bilder som boken pekar på: <use href="#x">, url(#x) och data-URI:er direkt i sidan */
 const refs=new Set();html.replace(/(?:href="|url\(["']?)#([\w:.-]+)/g,(m,k)=>{refs.add(k)});
 const imgs=[...refs].sort().map(k=>{const el=document.getElementById(k);return el&&!root.contains(el)?k+'='+el.outerHTML:''}).join('\n');
 return {html,imgs}}"""

JS_MATCH = r"""(sels)=>{const root=$('printRoot');const hit=[];for(const s of sels){
  /* pseudo-element tas bort (de stylar elementet de sitter på); ogiltiga selektorer räknas som träff */
  const q=s.replace(/::?(before|after|placeholder|marker|selection|first-line|first-letter|backdrop|-webkit-[\w-]+|-moz-[\w-]+)/g,'');
  let els;try{els=document.querySelectorAll(q||'*')}catch(e){hit.push(s);continue}
  for(const el of els){if(root.contains(el)||el.contains(root)){hit.push(s);break}}}return hit}"""

with sync_playwright() as p:
    br = p.chromium.launch(); x = br.new_page(viewport={'width': 900, 'height': 1300})
    errs = []; x.on('pageerror', lambda e: errs.append(str(e)))
    x.route('**/gstatic.com/**', lambda r: r.abort())
    x.goto(U); x.wait_for_timeout(800)
    x.evaluate("()=>{try{famClose()}catch(e){}}")
    ids = x.evaluate("BOOKS.map(b=>b.id)")
    src_css = (R / 'src/palette.css').read_text() + '\n' + (R / 'src/style.css').read_text()
    rules = css_rules(src_css)
    new_texts = sorted({t for _, _, t in rules})
    old_texts = set(old.get('css', []))
    changed = [r for r in rules if r[2] not in old_texts]
    removed = [t for t in old_texts - set(new_texts)]
    # borttagna regler: selektorn står mellan '|' och första '{'
    rem_sels = []
    glob_css = any(sel is None for _, sel, _ in changed)
    for t in removed:
        pre = t.split('|', 1)[1].split('{', 1)[0].strip()
        if pre.startswith('@'): glob_css = True
        else: rem_sels.append(pre)
    sels = sorted({sel for _, sel, _ in changed if sel} | set(rem_sels))

    books = {}; rebuild = []
    full = (not old) or old.get('glob') != glob or glob_css
    for bid in ids:
        parts = {}
        hit = []
        for part in ('cv', 'in'):
            r = x.evaluate(JS_RENDER, [bid, part])
            parts[part] = sha(r['html']) + sha(r['imgs'])
            if sels and not full:
                hit += x.evaluate(JS_MATCH, sels)
        hc = R / 'assets/print-covers' / f'{bid}.jpg'
        fp = sha(parts['cv'] + parts['in'] + (sha(hc.read_bytes()) if hc.exists() else '-'))
        books[bid] = fp
        why = 'nytt läge' if full else ('ny bok' if bid not in old.get('books', {}) else
              'innehåll eller bilder' if old['books'][bid] != fp else ('css: ' + hit[0]) if hit else '')
        if why:
            rebuild.append(bid)
            print(f'{bid}: {why}', file=sys.stderr)
    br.close()

if errs:
    print('fel i sidan:', errs[:3], file=sys.stderr)
(OUT / 'build.json').write_text(json.dumps({'glob': glob, 'css': new_texts, 'books': books}, ensure_ascii=False, separators=(',', ':')))
print(f'{len(rebuild)} av {len(ids)} böcker byggs om' + (' (allt: globalt ändrat eller inget gammalt läge)' if full else ''), file=sys.stderr)
print('\n'.join(rebuild))
