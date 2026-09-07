import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCHES = {
    "clima": [
        "dual zone climate control car",
        "climate control dashboard car",
        "air conditioning console car modern",
        "Audi climate control interior",
        "BMW air conditioning dashboard"
    ],
    "benzina": [
        "fuel pump nozzle refuelling car",
        "petrol pump nozzle car",
        "refuelling car petrol station",
        "gas station pump nozzle car",
        "filling fuel tank car"
    ]
}

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            hits = []
            for p in pages.values():
                title = p.get('title', '')
                base = title.replace("File:", "").strip()
                if base in blacklist:
                    continue
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                # Landscape only! (w > h)
                if w > h and w >= 1200 and h >= 700:
                    hits.append((title, base, w, h, ii.get('url', '')))
            return hits
    except Exception as e:
        return []

for k, q_list in SEARCHES.items():
    print(f"\n=== {k.upper()} ===")
    for q in q_list:
        h = search(q)
        if h:
            print(f"  Q: '{q}' ({len(h)} hits)")
            for t, b, w, h_sz, u in h[:3]:
                print(f"     -> {t} ({w}x{h_sz})")
            break
