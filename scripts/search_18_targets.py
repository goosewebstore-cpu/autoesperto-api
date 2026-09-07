import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_18 = {
    "bollo_sicilia": [
        "Italian tax form F24 car", "receipt calculator car keys", "paying taxes calculator desk car"
    ],
    "straccia_bollo": [
        "document tax stamp Italy", "tax relief debt cancellation document", "official legal stamp paper agreement"
    ],
    "profilo_digitale": [
        "smartphone car app vehicle dashboard", "tablet car diagnostics workshop", "connected car smartphone dashboard"
    ],
    "10_fattori_valore": [
        "car inspection clipboard checklist", "used car valuation inspection technician", "evaluating used car tablet"
    ],
    "passaggio_proprieta": [
        "handover car keys contract desk", "handing over car keys buyer seller", "car keys document signing"
    ],
    "doppia_chiave": [
        "car key fobs remote manual", "two car keys modern remote", "car key fob remote buttons"
    ],
    "garanzia_privati": [
        "car sale handshake deal buyer seller", "buying used car handshake private", "handshake car deal customer"
    ],
    "trattativa_prezzo": [
        "car dealership negotiation discussion", "business negotiation car buyer seller", "sales conversation car"
    ],
    "svalutazione_tabella": [
        "financial chart graph analytics tablet", "business analytics graph screen", "depreciation chart financial graph"
    ],
    "visura_pra": [
        "tablet vehicle database check", "checking car vin vehicle registration tablet", "car registration database computer"
    ],
    "incidenza_km": [
        "modern digital car odometer km", "digital speedometer dashboard odometer", "instrument cluster digital km h"
    ],
    "optional_auto": [
        "luxury car interior panoramic head up display", "modern car luxury cockpit ambient lighting", "mercedes s class interior luxury"
    ],
    "perdita_valore": [
        "used cars for sale row price tag", "car dealership lot modern vehicles", "discount price tag car showroom"
    ],
    "cambio_olio": [
        "pouring engine oil funnel car", "pouring motor oil engine filler", "oil change pouring fresh oil engine"
    ],
    "clima_ricarica": [
        "car air conditioning recharge station service", "automotive ac service unit manifold", "klimaservice kfz r134a r1234yf"
    ],
    "candele": [
        "spark plug electrode automotive close up", "iridium spark plugs engine", "replacing spark plugs engine"
    ],
    "cuscinetto_ruota": [
        "car wheel bearing hub assembly", "wheel hub bearing ball bearings car", "radlager kfz radnabe"
    ],
    "auto_300000km": [
        "Mercedes W124 sedan classic", "Toyota Land Cruiser modern front", "Volvo V70 estate civilian"
    ]
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
                if w >= 1200 and h >= 700 and w >= h: # Landscape format!
                    hits.append((title, base, w, h, ii.get('url', '')))
            return hits
    except Exception as e:
        return []

print(f"Searching for 18 targets...")
found_all = {}
for k, q_list in SEARCH_18.items():
    found = []
    for q in q_list:
        res = search(q)
        for item in res:
            if item[1] not in [x[1] for x in found]:
                found.append(item)
        if len(found) >= 2:
            break
    print(f"\n[{k.upper()}] ({len(found)} hits)")
    for t, b, w, h, u in found[:2]:
        print(f"   -> {t} ({w}x{h})")
    found_all[k] = found

with open('scripts/search_18_results.json', 'w', encoding='utf-8') as f:
    json.dump(found_all, f, indent=2)

print("\nSaved scripts/search_18_results.json")
