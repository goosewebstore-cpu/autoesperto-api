import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

QUERIES = {
    "straccia_bollo": [
        "F24 tax Italy", "agenzia entrate ricevuta", "bollo auto ricevuta", "ricevuta pagamento", "tasse commercialista calcolatrice", "tax payment receipt desk", "Euro banknotes calculator pen"
    ],
    "valore_residuo_fattori": [
        "used car inspection", "vehicle inspection checklist", "car appraisal mechanic", "evaluating car dealership"
    ],
    "doppia_chiave": [
        "car keys remote", "car keys table", "automobile key remote fob", "keys ignition modern car"
    ],
    "garanzia_privati": [
        "car handshake deal", "handshake customer car", "buying car handshake", "handshake deal automobile"
    ],
    "trattativa_prezzo": [
        "car sales negotiation", "car salesman customer desk", "dealership negotiation", "discussing car purchase"
    ],
    "tabella_svalutazione": [
        "business chart screen tablet", "depreciation graph tablet", "stock market graph tablet office", "financial chart tablet desk"
    ],
    "visura_pra": [
        "vehicle registration tablet", "checking car database laptop", "automotive tablet inspection", "car diagnosis tablet"
    ],
    "incidenza_km": [
        "digital speedometer car", "digital instrument cluster", "car speedometer dashboard", "digital odometer car"
    ],
    "clima_ricarica": [
        "klimaservice", "air conditioning car recharge", "automotive air conditioning recharge", "Robinair AC", "R134a service"
    ],
    "cuscinetto_ruota": [
        "wheel bearing car", "wheel hub bearing", "radlager auto", "roulement de roue automobile"
    ]
}

def search_commons(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q)}&gsrlimit=8&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            hits = []
            for p in pages.values():
                title = p.get('title', '')
                base = title.replace("File:", "").strip()
                if base in blacklist: continue
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']): continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                u = ii.get('url', '')
                if w >= 1200 and h >= 700 and w >= h: # Landscape
                    hits.append((title, base, w, h, u))
            return hits
    except Exception as e:
        return []

all_hits = {}
for k, qlist in QUERIES.items():
    print(f"\nSearching for {k}...")
    found = []
    for q in qlist:
        hits = search_commons(q)
        for h in hits:
            if h[1] not in [x[1] for x in found]:
                found.append(h)
        if len(found) >= 3:
            break
    print(f"[{k.upper()}] found {len(found)} candidates:")
    for h in found[:4]:
        print(f"   -> {h[1]} ({h[2]}x{h[3]})")
    all_hits[k] = found

with open("scripts/direct_search_hits.json", "w", encoding="utf-8") as f:
    json.dump(all_hits, f, indent=2)
