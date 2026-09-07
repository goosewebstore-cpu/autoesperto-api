import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_CONFIG = {
    "straccia_bollo": [
        "tax form calculator money",
        "tax declaration form desk pen",
        "euro banknotes calculator pen document"
    ],
    "bollo_sicilia": [
        "calculator keys contract desk",
        "car keys calculator desk",
        "car keys invoice document"
    ],
    "profilo_digitale": [
        "File:Smartphone mounted on car dashboard during a drive in a modern vehicle with a focus on navigation use.jpg",
        "car infotainment touchscreen display dashboard",
        "connected car app smartphone"
    ],
    "10_fattori_valore": [
        "car inspection checklist technician",
        "mechanic inspecting car with clipboard",
        "car appraisal inspection tablet",
        "used car inspection lot"
    ],
    "passaggio_proprieta": [
        "handing over car key",
        "handover car keys deal",
        "car sale contract signing desk"
    ],
    "doppia_chiave": [
        "car keys remote fobs",
        "car remote key fobs desk",
        "two car keys"
    ],
    "garanzia_privati": [
        "car handshake deal dealership customer",
        "buying used car handshake",
        "business handshake car sale"
    ],
    "trattativa_prezzo": [
        "car sales negotiation",
        "car buyer and seller conversation",
        "dealership negotiation customer"
    ],
    "svalutazione_tabella": [
        "financial graph screen analytics",
        "depreciation chart analytics tablet",
        "business chart tablet computer"
    ],
    "visura_pra": [
        "tablet vehicle inspection app",
        "checking vehicle registration tablet",
        "digital database check laptop"
    ],
    "incidenza_km": [
        "File:Buick Electra 1989 digital cockpit.JPG",
        "digital instrument cluster car odometer",
        "digital speedometer car dashboard km",
        "modern car dashboard speedometer"
    ],
    "optional_auto": [
        "File:Mercedes S-Class Interior (W222).jpg",
        "modern luxury car interior cockpit",
        "ambient lighting car interior"
    ],
    "perdita_valore": [
        "used car dealership lot lineup",
        "modern cars row dealership",
        "used cars for sale row"
    ],
    "cambio_olio": [
        "pouring engine oil car",
        "motor oil change pouring",
        "engine oil dipstick filling",
        "Motoröl nachfüllen"
    ],
    "clima_ricarica": [
        "klimaservice kfz",
        "air conditioning recharge car manifold",
        "car air conditioning service station",
        "automotive ac service unit"
    ],
    "candele": [
        "spark plug electrode automotive",
        "iridium spark plug",
        "Zündkerzen",
        "bougie d'allumage"
    ],
    "cuscinetto_ruota": [
        "wheel bearing assembly car",
        "radlager kfz",
        "wheel hub bearing ball bearing car",
        "roulement de roue"
    ],
    "auto_300000km": [
        "File:Mercedes-Benz W124 Brabus 6.5 Classic-Gala 2021 1X7A0101.jpg",
        "Mercedes W124 sedan silver",
        "Toyota Land Cruiser civilian front"
    ]
}

def query_wiki(q):
    if q.startswith("File:"):
        url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(q)}&prop=imageinfo&iiprop=url|size&format=json"
    else:
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
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                u = ii.get('url', '')
                hits.append((title, base, w, h, u))
            return hits
    except Exception as e:
        print(f"Error {e} on {q}")
        return []

print("Running test queries...")
results = {}
for target, qlist in SEARCH_CONFIG.items():
    found = []
    for q in qlist:
        res = query_wiki(q)
        for h in res:
            # check dimensions
            if h[2] >= 1200 and h[3] >= 600 and h[2] > h[3]:
                if h[1] not in blacklist and h[1] not in [x[1] for x in found]:
                    found.append(h)
    results[target] = found
    print(f"[{target.upper()}] found {len(found)} valid candidates")
    for item in found[:3]:
        print(f"   -> {item[1]} ({item[2]}x{item[3]})")

with open('scripts/precise_18_candidates.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
