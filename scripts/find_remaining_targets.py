import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCHES = {
    "straccia_bollo": [
        "Euro banknotes desk pen",
        "Euro currency calculator",
        "Tax calculation desk",
        "Tax return form desk"
    ],
    "garanzia_privati": [
        "car handshake",
        "handshake dealership",
        "handshake customer automobile",
        "buying car handshake"
    ],
    "trattativa_prezzo": [
        "car sales negotiation",
        "dealership negotiation",
        "car salesman customer desk",
        "business agreement office"
    ],
    "svalutazione_tabella": [
        "financial chart tablet screen",
        "business analytics tablet",
        "analytics dashboard screen tablet",
        "chart tablet desk"
    ],
    "visura_pra": [
        "tablet vehicle inspection",
        "tablet car diagnostics",
        "automotive diagnostic tablet",
        "laptop car database"
    ],
    "clima_ricarica": [
        "automotive air conditioning manifold",
        "R134a manifold gauges",
        "car AC recharge gauges",
        "Robinair air conditioning"
    ],
    "cuscinetto_ruota": [
        "wheel bearing hub",
        "tapered roller bearing",
        "ball bearing automotive",
        "wheel hub bearing"
    ]
}

def search_commons(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q)}&gsrlimit=12&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            hits = []
            for p in pages.values():
                t = p.get('title', '')
                base = t.replace('File:', '').strip()
                if base in blacklist: continue
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']): continue
                ii = p.get('imageinfo', [{}])[0]
                w, h = ii.get('width', 0), ii.get('height', 0)
                u = ii.get('url', '')
                if w >= 1200 and h >= 700 and w > h:
                    hits.append((t, base, w, h, u))
            return hits
    except Exception as e:
        return []

all_results = {}
for k, q_list in SEARCHES.items():
    print(f"\nTarget: {k}")
    found = []
    for q in q_list:
        res = search_commons(q)
        for h in res:
            if h[1] not in [x[1] for x in found]:
                found.append(h)
        if len(found) >= 3:
            break
    print(f"Found {len(found)} candidates:")
    for t, b, w, h, u in found[:4]:
        print(f"  {w}x{h} : {b}")
    all_results[k] = found

with open('scripts/remaining_7_hits.json', 'w', encoding='utf-8') as f:
    json.dump(all_results, f, indent=2)
