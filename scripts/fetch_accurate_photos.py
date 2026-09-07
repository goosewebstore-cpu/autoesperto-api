import urllib.request
import urllib.parse
import json
import os
import time
from PIL import Image

CACHE_DIR = "scripts/accurate_cache/acquisto"
os.makedirs(CACHE_DIR, exist_ok=True)

# Smart queries for each of the 43 articles in acquisto
# Multiple targeted queries in order of preference
ACQUISTO_QUERIES = {
    "auto-usata-10-segnali-problema-annuncio": [
        "Car inspection mechanic", "Used car inspection", "Automobile inspection"
    ],
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": [
        "Fuel dispenser petrol diesel station", "Gas station fuel pump nozzle", "Filling station fuel pump"
    ],
    "migliori-auto-usate-10000-euro-2026": [
        "2016 Renault Clio", "Ford Fiesta Mk7", "Volkswagen Polo Mk5"
    ],
    "5-cose-da-controllare-prima-comprare-auto-usata": [
        "Car engine bay open hood inspection", "Checking car engine oil dipstick", "Mechanic checking car engine"
    ],
    "auto-usata-100000-km-conviene-comprare": [
        "Car speedometer odometer cluster", "Automobile instrument cluster", "Car digital dashboard"
    ],
    "come-capire-se-auto-usata-incidentata": [
        "Car body repair collision", "Damaged car bumper fender", "Car chassis damage inspection"
    ],
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": [
        "Volkswagen TDI engine bay", "Common rail diesel engine", "Turbodiesel engine bay"
    ],
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": [
        "Smartphone QR code scan car", "QR code smartphone screen", "Digital vehicle dashboard app"
    ],
    "auto-usate-sotto-3000-euro-guida": [
        "Fiat Punto 188", "Peugeot 206 hatchback", "Renault Twingo I"
    ],
    "auto-usate-sotto-5000-euro-scelta": [
        "Fiat Grande Punto", "Ford Fiesta 2008", "Opel Corsa D"
    ],
    "auto-usate-sotto-15000-euro-migliori": [
        "Nissan Qashqai II", "Renault Captur", "Peugeot 2008 I"
    ],
    "auto-usate-sotto-20000-euro-premium": [
        "Audi A4 B9 sedan", "BMW 3er F30 sedan", "Mercedes-Benz C-Class W205"
    ],
    "migliori-auto-neopatentati-usate-norme": [
        "Lancia Ypsilon 846", "Fiat Panda 319", "Hyundai i10"
    ],
    "migliori-suv-usati-economici-scelta": [
        "Dacia Duster II", "Dacia Duster 2018", "Duster crossover"
    ],
    "auto-ibride-usate-conviene-controlli": [
        "Toyota Yaris Cross Hybrid", "Toyota Auris Hybrid engine", "Hybrid car battery engine"
    ],
    "diesel-vs-ibrida-usata-confronto": [
        "Motorway highway traffic Europe", "Autobahn highway driving", "Highway road cars"
    ],
    "garanzia-auto-usata-commerciale-legale": [
        "Legal contract signing pen paper", "Signing agreement contract desk", "Document signature notary"
    ],
    "controlli-pre-acquisto-auto-usata-lista": [
        "Car workshop hydraulic lift inspection", "Car mechanic underbody inspection", "Car on vehicle lift"
    ],
    "comprare-auto-da-privato-vs-concessionario": [
        "Car dealership glass showroom lot", "Used car dealership lot", "Car dealer showroom outdoor"
    ],
    "aste-auto-usate-come-funzionano-rischi": [
        "Car auction parking lot rows", "Automobile auction lot", "Police impound lot cars"
    ],
    "importare-auto-usata-germania-costi": [
        "Car carrier transporter truck highway", "Auto transporter truck trailer", "Car hauler truck"
    ],
    "auto-usate-gpl-metano-conviene": [
        "Autogastank LPG Tankstelle", "LPG autogas filling nozzle", "CNG fuel dispenser nozzle"
    ],
    "auto-elettrica-usata-autonomia-batteria": [
        "Electric car charging cable plug", "EV charging station cable plugged", "Electric vehicle charging socket"
    ],
    "chilometri-scalati-auto-usata-truffa": [
        "OBD2 car scanner diagnostic tool", "OBD-II vehicle diagnostic port", "Automotive diagnostic scanner"
    ],
    "acquisto-auto-con-fermo-amministrativo": [
        "Administrative document rubber stamp", "Legal document official stamp seal", "Government tax document stamp"
    ],
    "auto-usata-aziendale-ex-noleggio": [
        "White company fleet cars parking lot", "Fleet vehicles parked row", "Rental cars parking lot"
    ],
    "caparra-acquisto-auto-usata-regole": [
        "Signing contract agreement pen paper", "Business contract signing document", "Signature on paper document"
    ],
    "auto-usata-per-famiglia-monovolume": [
        "Volkswagen Touran monovolume", "Renault Scenic minivan", "Ford C-Max family car"
    ],
    "auto-usata-sportiva-economica": [
        "Mazda MX-5 Miata roadster", "Abarth 500 sports car", "Alfa Romeo MiTo QV"
    ],
    "passaggio-proprieta-auto-usata-costi": [
        "Vehicle registration certificate car keys", "Car keys on registration document", "Vehicle document registration"
    ],
    "finanziamento-auto-usata-conviene": [
        "Financial calculator contract euro money", "Calculator finance loan document", "Bank loan calculation document"
    ],
    "auto-usate-con-cambio-automatico": [
        "Automatic transmission gear shift lever", "Automatic gear selector PRND", "DSG gear selector lever"
    ],
    "auto-usata-per-neopatentati-gpl": [
        "Fiat 500 1.2 Lounge", "Opel Corsa E LPG", "Ford Fiesta GPL"
    ],
    "auto-usate-4x4-fuoristrada-economici": [
        "Suzuki Jimny offroad 4x4", "Jeep Renegade Trailhawk 4x4", "Fiat Panda 4x4 offroad"
    ],
    "auto-usata-con-gancio-traino": [
        "Car towing caravan trailer highway", "Car towing camping trailer", "Vehicle with tow bar trailer"
    ],
    "auto-usata-per-citta-citycar": [
        "Smart Fortwo city street", "Fiat 500 street urban parking", "Toyota Aygo city street"
    ],
    "auto-usate-con-bassi-consumi": [
        "Eco driving instrument dashboard fuel", "Car fuel consumption gauge eco", "Hybrid eco dashboard display"
    ],
    "auto-usata-per-cani-e-animali": [
        "Dog in car trunk estate", "Dog sitting in car boot", "Golden retriever dog in car"
    ],
    "auto-usata-garanzia-12-mesi-copertura": [
        "Service booklet car key fob desk", "Car warranty handbook keys", "Vehicle service record book"
    ],
    "auto-usata-sito-annunci-sicurezza": [
        "Laptop computer website shopping screen", "Browsing marketplace laptop computer", "Laptop screen online shopping"
    ],
    "auto-usata-chilometri-illimitati": [
        "Volvo 240 estate high mileage", "Mercedes W124 diesel", "Old high mileage Volvo car"
    ],
    "auto-usata-per-lavoro-agenti": [
        "Volkswagen Passat Variant highway", "Audi A4 Avant motorway", "BMW 3 Series Touring highway"
    ],
    "auto-usata-acquisto-online-consegna": [
        "Car delivery flatbed tow truck", "Tow truck delivering car", "Flatbed transporter with car"
    ]
}

def search_image(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/2.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            candidates = []
            for pid, p in pages.items():
                ii = p.get('imageinfo', [{}])[0]
                u = ii.get('url')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime', '')
                # Filter out SVGs, PDFs, tiny icons, logos, flags, maps, coins, stamps
                title = p.get('title', '').lower()
                if any(bad in title for bad in ['flag', 'map', 'coat_of_arms', 'logo', 'icon', 'symbol', 'seal_of', 'coin']):
                    continue
                if u and w >= 1000 and h >= 600 and 'jpeg' in mime.lower():
                    # landscape preference
                    ratio = w / h
                    if 1.1 <= ratio <= 2.2:
                        candidates.append((u, w, h, title))
            if candidates:
                return candidates[0]
    except Exception as e:
        pass
    return None

print(f"Starting fetch for {len(ACQUISTO_QUERIES)} acquisto articles...")

fetched = {}
for i, (slug, q_list) in enumerate(ACQUISTO_QUERIES.items(), 1):
    dest = os.path.join(CACHE_DIR, f"{slug}.jpg")
    if os.path.exists(dest) and os.path.getsize(dest) > 30000:
        fetched[slug] = dest
        print(f"{i:2d}/43. [{slug}] -> CACHED ({os.path.getsize(dest)//1024} KB)")
        continue
    
    found = None
    for q in q_list:
        found = search_image(q)
        if found:
            break
        time.sleep(0.08)
        
    if found:
        u, w, h, t = found
        req = urllib.request.Request(u, headers={'User-Agent': 'AutoEspertoTool/2.0 (info@autoesperto.it)'})
        try:
            with urllib.request.urlopen(req) as r:
                data = r.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                fetched[slug] = dest
                print(f"{i:2d}/43. [{slug}] -> DOWNLOADED {w}x{h} ({len(data)//1024} KB): {t[:40]}")
        except Exception as e:
            print(f"{i:2d}/43. [{slug}] -> DOWNLOAD FAILED: {e}")
    else:
        print(f"{i:2d}/43. [{slug}] -> NOT FOUND")
    time.sleep(0.1)

print(f"\nCompleted fetch: {len(fetched)}/43")
