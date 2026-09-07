import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_5 = {
    "ecu": "Electronic control unit",
    "air_susp": "Air suspension",
    "clutch_disc": "Clutch disc",
    "ev_drivetrain": "Electric vehicle powertrain",
    "ev_motor": "Electric car motor",
    "adblue_scr": "Selective catalytic reduction"
}

def search_5(q):
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
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1100 and h >= 650:
                    hits.append((title, w, h))
            return hits
    except Exception as e:
        return []

for k, q in SEARCH_5.items():
    res = search_5(q)
    print(f"\n{k} ('{q}'): {len(res)} hits")
    for t, w, h in res[:3]:
        print(f"   -> {t} ({w}x{h})")
