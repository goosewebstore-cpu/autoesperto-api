import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCHES_MORE = {
    "audi_interior": "Audi A4 interior dashboard",
    "bmw_interior": "BMW 3 Series interior dashboard",
    "golf_interior": "Volkswagen Golf VII interior dashboard",
    "mercedes_interior": "Mercedes-Benz C-Class interior dashboard",
    "ac_compressor": "Automotive air conditioning compressor",
    "gas_nozzle": "Gas station nozzle car",
    "petrol_nozzle_modern": "Fuel pump dispenser nozzle modern"
}

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=6&prop=imageinfo&iiprop=url|size&format=json"
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
                if w > h and w >= 1500 and h >= 800:
                    hits.append((title, base, w, h, ii.get('url', '')))
            return hits
    except Exception as e:
        return []

for k, q in SEARCHES_MORE.items():
    res = search(q)
    print(f"\n=== {k} ('{q}') ===")
    for t, b, w, h, u in res[:3]:
        print(f"   -> {t} ({w}x{h})")
