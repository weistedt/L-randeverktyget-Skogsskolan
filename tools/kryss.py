"""Sökprogram för korsord (kryss() i src/c-common.js).

Lägger ord i ett rutnät med korsningar, enligt reglerna:
  - lägen: 'pic' = bilden står i rutan före ordet (måste vara ledig), 'num' = numrerat, inga bildrutor
  - inga oavsiktliga grannbokstäver, inget ord fortsätter in i ett annat
  - högst H rader och W kolumner (bildrutor räknas med)
  - hemligt ord (valfritt): rutor som inte korsas, ur minst tre olika ord (två om ordet är kort), aldrig två i följd i samma ord

    python3 tools/kryss.py --words SOL,FISK,TÄLT,ÄGG,GRODA,MYRA --pick 6 --H 6 --W 7 --secret OTTO --mode pic --time 60
    --words kan vara fler än --pick: då provas slumpvisa urval ur listan. --must anger ord som alltid ska vara med.
Utskriften är rutnätet i text och en rad att klistra in i kryss([...]) (rad, kolumn = ordets första bokstav)."""
import argparse, random, time, json, collections

def bbox(cells):
    rs = [r for r, _ in cells]; cs = [c for _, c in cells]
    return min(rs), min(cs), max(rs), max(cs)

def place_ok(G, P, placed, w, r, c, d, mode, H, W):
    dr, dc = (0, 1) if d == 'A' else (1, 0)
    pre = (r - dr, c - dc); post = (r + dr * len(w), c + dc * len(w))
    if pre in G or post in G: return -1
    if mode == 'pic' and pre in P: return -1
    x = 0
    for i, ch in enumerate(w):
        cell = (r + dr * i, c + dc * i)
        if cell in P: return -1
        if cell in G:
            if G[cell] != ch: return -1
            for ww, r2, c2, d2 in placed:
                if d2 == d and ((d == 'A' and r2 == cell[0] and c2 <= cell[1] < c2 + len(ww)) or
                                (d == 'D' and c2 == cell[1] and r2 <= cell[0] < r2 + len(ww))): return -1
            x += 1
        else:
            for s in ((cell[0] + dc, cell[1] + dr), (cell[0] - dc, cell[1] - dr)):
                if s in G: return -1
    if x == len(w): return -1
    cells = list(G) + list(P) + [(r + dr * i, c + dc * i) for i in range(len(w))] + ([pre] if mode == 'pic' else [])
    r0, c0, r1, c1 = bbox(cells)
    if r1 - r0 + 1 > H or c1 - c0 + 1 > W: return -1
    return x

def solve(words, mode, H, W, secs, cap=3000):
    sols, seen = [], set()
    t_end = time.time() + secs
    visited = set()
    def rec(rest, G, P, placed):
        if time.time() > t_end or len(sols) >= cap: return
        st = frozenset(placed)
        if st in visited: return
        visited.add(st)
        if not rest:
            cells = list(G) + list(P); r0, c0, _, _ = bbox(cells)
            key = tuple(sorted((w, r - r0, c - c0, d) for w, r, c, d in placed))
            if key not in seen:
                seen.add(key); sols.append((dict(G), dict(P), list(placed)))
            return
        for wi, w in enumerate(rest):
            opts = []
            for (r, c), ch in list(G.items()):
                for i, wc in enumerate(w):
                    if wc != ch: continue
                    for d in 'AD':
                        dr, dc = (0, 1) if d == 'A' else (1, 0)
                        sr, sc = r - dr * i, c - dc * i
                        if place_ok(G, P, placed, w, sr, sc, d, mode, H, W) > 0: opts.append((sr, sc, d))
            if not opts: continue
            for sr, sc, d in dict.fromkeys(opts):
                dr, dc = (0, 1) if d == 'A' else (1, 0)
                added = [(sr + dr * i, sc + dc * i) for i in range(len(w)) if (sr + dr * i, sc + dc * i) not in G]
                for i, ch in enumerate(w): G[(sr + dr * i, sc + dc * i)] = ch
                pc = (sr - dr, sc - dc)
                if mode == 'pic': P[pc] = (w, d)
                placed.append((w, sr, sc, d))
                rec(rest[:wi] + rest[wi + 1:], G, P, placed)
                placed.pop()
                if mode == 'pic': del P[pc]
                for a in added: del G[a]
            # inget return här: ett ord som inte får plats nu kan få plats när ett annat ord har lagts ut
    w0 = max(words, key=len); rest = [w for w in words if w is not w0]
    for d0 in 'AD':
        dr, dc = (0, 1) if d0 == 'A' else (1, 0)
        G = {(dr * i, dc * i): ch for i, ch in enumerate(w0)}
        P = {(-dr, -dc): (w0, d0)} if mode == 'pic' else {}
        rec(rest, G, P, [(w0, 0, 0, d0)])
    return sols

def owners(placed):
    own = collections.defaultdict(list)
    for w, r, c, d in placed:
        dr, dc = (0, 1) if d == 'A' else (1, 0)
        for i in range(len(w)): own[(r + dr * i, c + dc * i)].append((w, i))
    return own

def secret_cells(G, placed, word, rnd):
    own = owners(placed); best = None
    for _ in range(300):
        used, pick = set(), []
        for ch in word:
            c = [k for k, v in G.items() if v == ch and k not in used and len(own[k]) == 1]
            if not c: return None
            k = rnd.choice(c); used.add(k); pick.append(k)
        ws = [own[k][0][0] for k in pick]
        if len(set(ws)) < min(3, len(word) - 1): continue
        bad = any(own[a][0][0] == own[b][0][0] and abs(own[a][0][1] - own[b][0][1]) == 1 for a, b in zip(pick, pick[1:]))
        if bad: continue
        sc = len(set(ws))
        if not best or sc > best[0]: best = (sc, pick)
    return best[1] if best else None

def stats(s):
    G, P, placed = s; own = owners(placed)
    x = sum(1 for v in own.values() if len(v) > 1)
    r0, c0, r1, c1 = bbox(list(G) + list(P)); H, W = r1 - r0 + 1, c1 - c0 + 1
    return x, H, W, (len(G) + len(P)) / (H * W)

def show(s, sec=()):
    G, P, placed = s; r0, c0, r1, c1 = bbox(list(G) + list(P)); out = []
    for r in range(r0, r1 + 1):
        row = ''
        for c in range(c0, c1 + 1):
            if (r, c) in P: row += ' →' if P[(r, c)][1] == 'A' else ' ↓'
            elif (r, c) in G: row += (' ' + G[(r, c)].lower()) if (r, c) in sec else (' ' + G[(r, c)])
            else: row += ' ·'
        out.append(row)
    return '\n'.join(out)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--words', required=True); ap.add_argument('--must', default='')
    ap.add_argument('--pick', type=int, default=0); ap.add_argument('--H', type=int, default=6); ap.add_argument('--W', type=int, default=7)
    ap.add_argument('--secret', default=''); ap.add_argument('--mode', default='pic'); ap.add_argument('--time', type=float, default=60)
    ap.add_argument('--seed', type=int, default=1); ap.add_argument('--top', type=int, default=4); ap.add_argument('--minx', type=int, default=0)
    a = ap.parse_args()
    pool = [w.strip().upper() for w in a.words.split(',') if w.strip()]
    must = [w.strip().upper() for w in a.must.split(',') if w.strip()]
    n = a.pick or len(pool); rnd = random.Random(a.seed); res = []; t0 = time.time()
    while time.time() - t0 < a.time:
        ws = must + rnd.sample([w for w in pool if w not in must], n - len(must)) if n < len(pool) else pool[:]
        for s in solve(ws, a.mode, a.H, a.W, min(2.0, a.time / 4)):
            x, H, W, f = stats(s)
            if x < a.minx or x < len(ws) - 1: continue  # alla ord sitter ihop
            sec = secret_cells(s[0], s[2], a.secret.upper(), rnd) if a.secret else []
            if a.secret and not sec: continue
            res.append((x * 10 + f * 25 - (H * W) / 8, ws, s, sec))
        if n == len(pool) and res: break
    res.sort(key=lambda t: -t[0]); seen = set(); k = 0
    for sc, ws, s, sec in res:
        key = tuple(sorted(ws)) if n < len(pool) else show(s)
        if key in seen: continue
        seen.add(key); k += 1
        G, P, placed = s; r0, c0, _, _ = bbox(list(G) + list(P)); x, H, W, f = stats(s)
        print(f'== {round(sc, 1)}  korsningar {x}  {H}×{W}  ord {ws}')
        print(show(s, set(sec)))
        print('ord:', json.dumps([[w, r - r0, c - c0, d] for w, r, c, d in placed], ensure_ascii=False))
        if sec: print('hemligt:', json.dumps([[r - r0, c - c0] for r, c in sec]))
        print()
        if k >= a.top: break
    if not res: print('inga lösningar')

if __name__ == '__main__':
    main()
