import urllib.request
import urllib.parse
import json
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_AFF = {
    "le-10-auto-piu-rubate-italia-2026": [
        "Polizia di Stato Giulia", "Polizia stradale auto", "Carabinieri Alfa Romeo Giulia"
    ],
    "10-auto-piu-affidabili-usate-2026": [
        "Toyota Yaris Hybrid front", "Honda Civic hatchback modern", "Mazda 3 red front"
    ],
    "motori-12-puretech-problemi-cinghia-bagno-olio": [
        "Peugeot 1.2 PureTech engine", "Citroen PureTech engine", "1.2 PureTech engine bay"
    ],
    "motori-15-dci-renault-affidabilita-bronzine": [
        "Renault 1.5 dCi engine", "Renault K9K engine", "1.5 dCi K9K"
    ],
    "cambio-dsg-dq200-volkswagen-problemi-frizione": [
        "Volkswagen DSG gearbox", "VW DSG transmission", "Dual clutch transmission cutaway"
    ],
    "motori-13-multijet-fiat-affidabilita-catena": [
        "Fiat 1.3 Multijet engine", "1.3 JTD Multijet", "Fiat Multijet 16V"
    ],
    "motori-15-bluehdi-stellantis-catena-camme": [
        "Peugeot BlueHDi engine", "1.5 BlueHDi DV5", "Citroen BlueHDi diesel"
    ],
    "auto-usate-da-300000-km-indistruttibili": [
        "Volvo V70 estate", "Mercedes-Benz W124 front", "Toyota Land Cruiser modern"
    ],
    "cambi-automatici-piu-affidabili-classifica": [
        "ZF 8HP automatic transmission", "Automatic transmission torque converter cutaway", "ZF 8HP"
    ],
    "motore-14-tsi-volkswagen-catena-consumo-olio": [
        "Volkswagen 1.4 TSI engine", "VW 1.4 TSI EA111", "1.4 TSI Twincharger engine"
    ],
    "motore-20-tdi-volkswagen-pompa-alta-pressione-cp4": [
        "Bosch CP4 common rail", "Volkswagen 2.0 TDI engine", "Common rail high pressure pump Bosch"
    ],
    "motori-bmw-n47-problema-catena-distribuzione": [
        "BMW N47 engine", "BMW 2.0d N47", "BMW N47 diesel engine"
    ],
    "motore-ford-10-ecoboost-cinghia-bagno-olio": [
        "Ford 1.0 EcoBoost engine", "Ford EcoBoost 3 cylinder", "Ford EcoBoost engine bay"
    ],
    "motori-benzina-piu-affidabili-usato": [
        "Fiat FIRE engine", "Fiat 1.2 FIRE 8V", "Toyota 1KR-FE engine"
    ],
    "motori-diesel-piu-affidabili-usato": [
        "Fiat 1.9 JTD engine", "Volkswagen 1.9 TDI engine", "Peugeot 2.0 HDi engine"
    ],
    "affidabilita-auto-ibride-toyota-hsd": [
        "Toyota Hybrid Synergy Drive", "Toyota Prius transaxle cutaway", "Toyota HSD inverter"
    ],
    "problemi-cambio-cvt-nissan-jatco": [
        "Continuously variable transmission cutaway", "Jatco CVT", "CVT pushbelt"
    ],
    "motore-16-jtdm-alfa-romeo-fiat-affidabilita": [
        "Alfa Romeo Giulietta JTDm engine", "1.6 Multijet Fiat", "Alfa Romeo 1.6 JTDm"
    ],
    "motore-12-tsi-volkswagen-ea211-cinghia": [
        "Volkswagen EA211 engine", "VW 1.2 TSI EA211", "Volkswagen 1.2 TSI engine"
    ],
    "motore--mercedes-15-dci-om607-affidabilita": [
        "Mercedes OM607 engine", "Mercedes A 180 CDI engine", "Mercedes OM608"
    ],
    "motori-3-cilindri-turbo-affidabilita": [
        "3 cylinder engine cutaway", "Inline three engine turbo", "3 cylinder turbo automotive"
    ],
    "problemi-adblue-peugeot-citroen-deformazione-serbatoio": [
        "Selective catalytic reduction tank", "Diesel exhaust fluid tank SCR", "AdBlue SCR injector"
    ],
    "motore-20-d-ingenium-jaguar-land-rover-catena": [
        "Jaguar Ingenium engine", "Land Rover Ingenium diesel", "Jaguar Land Rover 2.0 diesel"
    ],
    "motori-gpl-di-serie-affidabilita-valvole": [
        "Autogas LPG engine installation", "LPG toroidal tank", "Autogas LPG fuel system"
    ],
    "motori-metano-di-serie-volkswagen-g-tron": [
        "CNG natural gas car tank", "Volkswagen TGI natural gas", "Compressed natural gas car cylinder"
    ],
    "affidabilita-marchi-auto-classifica-2026": [
        "Car dealership showroom modern", "New cars dealership row showroom", "Automobile dealership cars showroom"
    ],
    "problemi-sospensioni-pneumatiche-suv": [
        "Air suspension strut bellows", "Luftfederung pkw", "Air spring suspension car"
    ],
    "problemi-elettronica-auto-usate-centraline": [
        "Automotive electronic control unit ECU", "Car ECU circuit board", "Automotive fuse relay module"
    ],
    "motore-16-thp-peugeot-mini-catena-consumo-olio": [
        "Prince engine 1.6 THP", "MINI Cooper S turbo engine", "Peugeot 1.6 THP engine"
    ],
    "motore-20-multijet-fiat-alfa-20-tdi": [
        "Fiat 2.0 Multijet engine", "Alfa 2.0 JTDm engine", "2.0 Multijet 16V Fiat"
    ],
    "motore-15-tsi-volkswagen-act-disattivazione-cilindri": [
        "Volkswagen 1.5 TSI Evo engine", "VW 1.5 TSI ACT", "1.5 TSI Evo Volkswagen"
    ],
    "motori-mazda-skyactiv-g-d-affidabilita": [
        "Mazda Skyactiv engine cutaway", "Mazda Skyactiv-G engine", "Mazda Skyactiv-D"
    ],
    "motori-hyundai-kia-16-crdi-affidabilita": [
        "Hyundai 1.6 CRDi engine", "Kia 1.6 CRDi engine", "Hyundai U-series diesel engine"
    ],
    "motori-subaru-boxer-diesel-problemi-albero-motore": [
        "Subaru Boxer Diesel EE20 engine", "Subaru Boxer engine cutaway", "Subaru EE20 diesel"
    ],
    "problemi-volano-monomassa-vs-bimassa": [
        "Single mass flywheel clutch conversion", "Clutch disc torsion springs", "Flywheel clutch friction plate"
    ],
    "affidabilita-auto-elettriche-usate-motore-inverter": [
        "Electric vehicle powertrain cutaway", "Electric car motor inverter", "EV motor transaxle"
    ]
}

def search_wikimedia_aff(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
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
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1000 and h >= 600:
                    hits.append({'title': title, 'base': base, 'width': w, 'height': h, 'url': ii.get('url', '')})
            return hits
    except Exception as e:
        return []

print(f"Searching Wikimedia for all {len(SEARCH_AFF)} Affidabilita articles...")
aff_results = {}
for i, (slug, q_list) in enumerate(SEARCH_AFF.items(), 1):
    found = []
    for q in q_list:
        h = search_wikimedia_aff(q)
        for item in h:
            if item['base'] not in [x['base'] for x in found]:
                found.append(item)
        if len(found) >= 3:
            break
        time.sleep(0.3)
    aff_results[slug] = found
    print(f"[{i:02d}/36] {slug} -> {len(found)} hits")
    for item in found[:1]:
        print(f"       Best: {item['base']} ({item['width']}x{item['height']})")

with open('scripts/affidabilita_search_hits.json', 'w', encoding='utf-8') as f:
    json.dump(aff_results, f, indent=2)

print("\nSaved scripts/affidabilita_search_hits.json")
