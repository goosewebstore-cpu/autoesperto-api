import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

terms = [
    ("starter", "Starter motor disassembled"),
    ("starter_2", "Automobile starter motor"),
    ("strut", "MacPherson strut"),
    ("strut_2", "Automotive coilover suspension"),
    ("service", "Vehicle maintenance inspection record"),
    ("service_2", "Car inspection checklist")
]

def search_terms(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=6&gsrnamespace=6&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            hits = []
            for p in pages.values():
                title = p.get('title', '')
                base = title.replace("File:", "").strip()
                if base in blacklist:
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1100 and h >= 650:
                    hits.append((title, w, h))
            return hits
    except Exception as e:
        return []

for k, q in terms:
    res = search_terms(q)
    print(f"\nTerm '{q}': {len(res)} hits")
    for title, w, h in res[:3]:
        print(f"   -> {title} ({w}x{h})")
