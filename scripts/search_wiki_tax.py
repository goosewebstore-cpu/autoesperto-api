import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

queries = [
    "tax return desk",
    "income tax return form",
    "Steuererklärung Formular",
    "Steuererklärung Schreibtisch",
    "Euro banknotes calculator",
    "Euro banknotes desk",
    "Euro money calculator",
    "Euro bank notes calculator"
]

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0'})
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = d.get('query', {}).get('pages', {})
        res = []
        for p in pages.values():
            t = p.get('title', '')
            base = t.replace('File:', '').strip()
            if base in blacklist: continue
            if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']): continue
            ii = p.get('imageinfo', [{}])[0]
            w, h = ii.get('width', 0), ii.get('height', 0)
            u = ii.get('url', '')
            if w >= 1200 and h >= 700 and w > h:
                res.append((t, base, w, h, u))
        return res
    except Exception as e:
        return []

for q in queries:
    items = search(q)
    print(f"Query: '{q}' -> {len(items)} hits")
    for t, b, w, h, u in items[:3]:
        print(f"   {w}x{h} : {b}")
