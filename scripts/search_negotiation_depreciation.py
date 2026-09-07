import urllib.request
import urllib.parse
import json
import os

headers = {'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'}
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers=headers)
    hits = []
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            for p in pages.values():
                t = p.get('title', '')
                base = t.replace('File:', '').strip()
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    continue
                if base in blacklist:
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                u = ii.get('url', '')
                if w >= 1200 and h >= 600 and w > h:
                    hits.append((t, base, w, h, u))
    except Exception as e:
        print(f"Error on {q}: {e}")
    return hits

targets = {
    "trattativa": [
        "car dealership customer consultation",
        "car sales negotiation",
        "dealership sales representative customer",
        "buying used car customer"
    ],
    "svalutazione": [
        "depreciation graph",
        "market price chart screen",
        "business bar chart analytics",
        "stock chart tablet display",
        "financial market chart"
    ],
    "visura": [
        "vehicle identification tablet",
        "mechanic reading tablet screen",
        "car registration document inspection",
        "automotive diagnostic tablet car"
    ]
}

for cat, qlist in targets.items():
    print(f"=== {cat.upper()} ===")
    for q in qlist:
        res = search(q)
        for t, base, w, h, u in res[:4]:
            print(f"  [{q}] {base} ({w}x{h})")
