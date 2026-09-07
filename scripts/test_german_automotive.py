import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

GERMAN_TERMS = {
    "freni": "Bremsscheibe",
    "freni_caliper": "Bremssattel",
    "ammortizzatore": "Federbein",
    "stossdaempfer": "Stossdaempfer",
    "alternatore": "Lichtmaschine",
    "motorino": "Anlasser Schnittmodell",
    "motorino_2": "Anlasser kfz",
    "libretto": "Scheckheft",
    "serviceheft": "Serviceheft",
    "obd_spia": "Fehlerspeicher OBD",
    "kombiinstrument": "Kombiinstrument leuchten"
}

def search_de(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=6&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
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
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1000 and h >= 600:
                    hits.append((title, w, h))
            return hits
    except Exception as e:
        return []

for k, term in GERMAN_TERMS.items():
    res = search_de(term)
    print(f"\nTerm '{term}' ({k}): {len(res)} hits")
    for title, w, h in res[:3]:
        print(f"   -> {title} ({w}x{h})")
