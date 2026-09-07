import urllib.request
import urllib.parse
import json
import os
import time
from PIL import Image

DEST_DIR = "scripts/verified_cache"
os.makedirs(os.path.join(DEST_DIR, "acquisto"), exist_ok=True)
os.makedirs(os.path.join(DEST_DIR, "vendita"), exist_ok=True)

# Exact queries with modern automotive terms and fallback queries
DOWNLOAD_TARGETS = {
    # --- ACQUISTO (remaining) ---
    "acquisto/auto-usata-100000-km-conviene-comprare": [
        "VDO speedometer odometer car dashboard",
        "speedometer odometer 100000 km",
        "car instrument cluster digital speedometer"
    ],
    "acquisto/come-capire-se-auto-usata-incidentata": [
        "2000 Chrysler Cirrus with missing bumper.jpg",
        "car bumper collision damage crash",
        "damaged car fender body repair"
    ],
    "acquisto/auto-ibride-usate-conviene-controlli": [
        "Toyota Yaris Cross Hybrid",
        "Toyota Yaris Hybrid Z",
        "Toyota Prius hybrid engine"
    ],
    "acquisto/diesel-vs-ibrida-usata-confronto": [
        "motorway traffic highway cars Europe",
        "Autobahn traffic driving cars",
        "highway freeway traffic cars"
    ],
    "acquisto/garanzia-auto-usata-commerciale-legale": [
        "signing contract agreement desk pen",
        "business contract signature desk",
        "hand signing contract document"
    ],
    "acquisto/aste-auto-usate-come-funzionano-rischi": [
        "Auction tent at Mecum Auctions Kissimmee",
        "car auction parking lot rows",
        "automobile auction vehicles lot"
    ],
    "acquisto/importare-auto-usata-germania-costi": [
        "Isuzu Giga CYZ V275 Car Carrier Truck",
        "car carrier transporter truck trailer",
        "auto transporter truck highway"
    ],
    "acquisto/auto-usate-gpl-metano-conviene": [
        "LPG autogas fuel pump dispenser",
        "Autogas dispenser nozzle station",
        "CNG filling station nozzle"
    ],
    "acquisto/auto-elettrica-usata-autonomia-batteria": [
        "electric car charging station cable connected",
        "EV charging station plug vehicle",
        "electric vehicle charging station"
    ],
    "acquisto/chilometri-scalati-auto-usata-truffa": [
        "OBD nastaveni.jpg",
        "OBD2 car scanner diagnostic tool",
        "car OBD-II diagnostic tool port"
    ],
    "acquisto/acquisto-auto-con-fermo-amministrativo": [
        "official stamp rubber document legal",
        "notary seal official document stamp",
        "legal contract rubber stamp"
    ],
    "acquisto/caparra-acquisto-auto-usata-regole": [
        "signing agreement document table pen",
        "hand signing contract pen paper",
        "signature on document table"
    ],
    "acquisto/auto-usata-per-famiglia-monovolume": [
        "RENAULT SCENIC II China.jpg",
        "Renault Scenic family minivan",
        "Volkswagen Touran monovolume"
    ],
    "acquisto/finanziamento-auto-usata-conviene": [
        "calculator financial paperwork euro money",
        "calculator finance contract pen table",
        "bank loan calculation desk euro"
    ],
    "acquisto/auto-usata-con-gancio-traino": [
        "car towing camping trailer caravan",
        "car towing travel trailer highway",
        "vehicle with towbar trailer"
    ],
    "acquisto/auto-usate-con-bassi-consumi": [
        "Toyota Prius Plug-in Hybrid",
        "Toyota Prius hybrid car",
        "eco driving dashboard instrument fuel"
    ],
    "acquisto/auto-usata-per-cani-e-animali": [
        "A dog in car at Matsushima Bay.jpg",
        "dog in car boot estate looking",
        "dog sitting in car trunk"
    ],
    "acquisto/auto-usata-sito-annunci-sicurezza": [
        "person using laptop screen desk browsing",
        "laptop computer screen web shopping",
        "browsing marketplace laptop computer"
    ],
    "acquisto/auto-usata-chilometri-illimitati": [
        "MB W124 million miles.jpg",
        "Mercedes-Benz W124 sedan classic",
        "Volvo 240 estate high mileage"
    ],
    "acquisto/auto-usata-acquisto-online-consegna": [
        "flatbed tow truck delivering car",
        "car transporter delivering vehicle",
        "flatbed tow truck with vehicle"
    ],

    # --- VENDITA (remaining) ---
    "vendita/come-fissare-prezzo-vendita-auto": [
        "person using smartphone outdoor car",
        "smartphone screen car appraisal",
        "evaluating car value mobile phone"
    ],
    "vendita/annuncio-auto-usata-perfetto-guida": [
        "taking photo of car with smartphone",
        "person photographing car smartphone outdoor",
        "smartphone camera car photo"
    ],
    "vendita/permuta-auto-usata-conviene-calcolo": [
        "car dealership showroom sales desk",
        "dealership sales desk keys handshake",
        "car dealer office negotiation"
    ],
    "vendita/pagamento-sicuro-vendita-auto-usata": [
        "smartphone online banking mobile transfer",
        "mobile banking app smartphone screen",
        "instant payment smartphone app"
    ],
    "vendita/atto-di-vendita-auto-usata-autentica": [
        "signing legal contract notary office",
        "notary signing official document pen",
        "official bill of sale signature"
    ],
    "vendita/vendere-auto-usata-con-finanziamento-in-corso": [
        "finance contract document calculator desk",
        "financial loan agreement paperwork pen",
        "loan paperwork calculator table"
    ],
    "vendita/vendere-auto-usata-con-danni-carrozzeria": [
        "car polishing machine buffing paint",
        "polishing car body buffer detailing",
        "car scratch repair polishing"
    ],
    "vendita/vendere-auto-per-esportazione-estero": [
        "car carrier truck highway Europe",
        "international auto transporter truck",
        "truck transporting cars export"
    ],
    "vendita/vendere-auto-usata-a-compro-auto": [
        "vehicle inspector checking car tablet",
        "car appraiser inspecting bodywork tablet",
        "car inspection mechanic tablet"
    ],
    "vendita/vendere-auto-usata-storico-tagliandi": [
        "car maintenance service book stamped",
        "vehicle service handbook stamps",
        "stamped car service booklet"
    ],
    "vendita/vendere-auto-usata-tra-parenti": [
        "handing car keys person to person",
        "car keys hand to hand handover",
        "passing car keys exchange"
    ],
    "vendita/vendere-auto-usata-con-doppia-chiave": [
        "320d BMW's car key",
        "Car key duplication",
        "car key remote modern"
    ],
    "vendita/vendere-auto-usata-garanzia-tra-privati": [
        "signing agreement document pen table",
        "private sale contract signing pen",
        "written agreement contract signature"
    ],
    "vendita/vendere-auto-usata-in-conto-vendita": [
        "car dealership showroom interior floor",
        "cars inside dealer showroom floor",
        "automobile showroom indoor display"
    ],
    "vendita/preparare-auto-usata-alla-vendita": [
        "car wash snow foam active cannon",
        "car detailing foam wash sponge",
        "washing car with active foam"
    ],
    "vendita/vendere-auto-usata-all-asta-online": [
        "online bidding website laptop screen",
        "laptop screen online auction bidding",
        "person using laptop bidding online"
    ],
    "vendita/vendere-auto-usata-con-fermo-fiscale": [
        "official tax document stamp revenue",
        "tax clearance document stamp seal",
        "official revenue agency stamp paper"
    ],
    "vendita/vendere-auto-usata-all-estero-senza-iva": [
        "customs border cargo freight truck",
        "international shipping customs border",
        "customs clearance checkpoint freight"
    ],
    "vendita/trattativa-prezzo-vendita-auto-usata": [
        "two people shaking hands beside car outdoor",
        "buyer seller handshake car negotiation",
        "handshake outdoor car deal"
    ],
    "vendita/vendere-auto-usata-incidentata-o-fusa": [
        "damaged crashed car on flatbed tow truck",
        "wrecked car tow truck recovery",
        "salvage car tow truck transport"
    ],
    "vendita/vendere-auto-usata-di-societa-o-partita-iva": [
        "business corporate office desk car keys",
        "business invoice paperwork laptop desk",
        "corporate office contract car keys"
    ],
    "vendita/vendere-auto-usata-con-impianto-gpl": [
        "LPG tank in car boot spare wheel",
        "toroidal autogas tank car spare wheel",
        "autogas tank installation car"
    ],
    "vendita/consegna-auto-usata-verbale-passaggio": [
        "person with clipboard inspecting car handover",
        "handover checklist clipboard vehicle",
        "car delivery inspection clipboard"
    ]
}

def fetch_first_valid(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '')
                t_lower = title.lower()
                if any(bad in t_lower for bad in ['190', '191', '192', '193', '194', '195', '196', '197', '198', 'ancient', 'antique', 'vintage_car', 'museum', 'statue', 'painting', 'drawing', 'stamp', 'coin', 'map', 'flag', 'logo', 'icon', 'seal', 'diagram', 'archive', 'dpla', 'prc', 'seattle', 'fbi']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                if 'jpeg' not in mime and 'jpg' not in mime:
                    continue
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w < 900 or h < 500:
                    continue
                ratio = w / h
                if 1.0 <= ratio <= 2.3:
                    return (title, ii.get('url'), w, h)
    except Exception:
        pass
    return None

print(f"Starting targeted download for {len(DOWNLOAD_TARGETS)} targets...")

results = {}
for i, (rel_key, queries) in enumerate(DOWNLOAD_TARGETS.items(), 1):
    dest = os.path.join(DEST_DIR, f"{rel_key}.jpg")
    if os.path.exists(dest) and os.path.getsize(dest) > 30000:
        results[rel_key] = dest
        print(f"[{i:2d}/{len(DOWNLOAD_TARGETS)}] {rel_key} -> ALREADY EXISTS")
        continue

    found = None
    for q in queries:
        found = fetch_first_valid(q)
        if found:
            break
        time.sleep(0.08)

    if found:
        title, url, w, h = found
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read()
            with open(dest, 'wb') as f:
                f.write(content)
            results[rel_key] = dest
            safe_t = title[:50].encode('ascii', 'replace').decode('ascii')
            print(f"[{i:2d}/{len(DOWNLOAD_TARGETS)}] {rel_key} -> OK: {safe_t} ({w}x{h})")
        except Exception as e:
            print(f"[{i:2d}/{len(DOWNLOAD_TARGETS)}] {rel_key} -> DOWNLOAD ERROR: {e}")
    else:
        print(f"[{i:2d}/{len(DOWNLOAD_TARGETS)}] {rel_key} -> NOT FOUND ON WIKIMEDIA")
    time.sleep(0.1)

print(f"\nTargeted download finished: {len(results)}/{len(DOWNLOAD_TARGETS)} acquired.")
