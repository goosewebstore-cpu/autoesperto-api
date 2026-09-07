import json
import urllib.request
import urllib.parse

blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

MISSING_QUERIES = {
    "benzina-quasi-da-record-guida-risparmiare-1500-euro": [
        "Zapfpistole", "Petrol nozzle", "Fuel dispenser nozzle", "Filling gas tank"
    ],
    "batteria-auto-scarica-sintomi-sostituzione": [
        "Car battery", "Lead-acid battery automotive", "Autobatterie", "Varta battery"
    ],
    "adblue-problemi-spia-motore-inverno": [
        "AdBlue", "Diesel exhaust fluid", "SCR tank", "AdBlue filler"
    ],
    "climatizzatore-auto-non-raffredda-ricarica": [
        "Air conditioning manifold", "Car air conditioning", "Klimaservice", "A/C service car"
    ],
    "liquido-refrigerante-radiatore-livello": [
        "Coolant reservoir", "Expansion tank car", "Kuehlmittel", "Radiator automobile"
    ],
    "cambio-automatico-manutenzione-lavaggio": [
        "Automatic transmission", "Torque converter transmission", "Automatikgetriebe cutaway", "Gearbox automatic"
    ],
    "spia-motore-gialla-fissa-o-lampeggiante": [
        "Check engine light", "Malfunction indicator lamp", "Motorkontrollleuchte", "OBD-II scanner"
    ],
    "liquido-freni-dot4-sostituzione-umidita": [
        "Brake fluid", "Brake master cylinder", "Bremsfluessigkeit", "Brake reservoir"
    ],
    "pompa-acqua-perdita-liquido-distribuzione": [
        "Water pump automobile", "Wasserpumpe kfz", "Automotive water pump", "Coolant pump"
    ],
    "catalizzatore-otturato-sintomi-sostituzione": [
        "Catalytic converter", "Katalysator auto", "Exhaust catalyst", "Car catalytic"
    ]
}

def search_wiki(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            hits = []
            for pid, p in pages.items():
                title = p.get('title', '')
                base = title.replace("File:", "").strip()
                if base in blacklist:
                    continue
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                if 'image' not in mime or 'svg' in mime or 'gif' in mime:
                    continue
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1000 and h >= 600:
                    hits.append({'title': title, 'base': base, 'width': w, 'height': h, 'url': ii.get('url', '')})
            return hits
    except Exception as e:
        print(f"err: {e}")
        return []

for slug, q_list in MISSING_QUERIES.items():
    found = []
    for q in q_list:
        h = search_wiki(q)
        for x in h:
            if x['base'] not in [y['base'] for y in found]:
                found.append(x)
        if len(found) >= 3:
            break
    print(f"{slug}: {len(found)} hits")
    for x in found[:2]:
        print(f"   -> {x['base']} ({x['width']}x{x['height']})")

    # update json
    current = json.load(open('scripts/manutenzione_search_hits.json', encoding='utf-8'))
    if found:
        current[slug] = found
    with open('scripts/manutenzione_search_hits.json', 'w', encoding='utf-8') as f:
        json.dump(current, f, indent=2)
