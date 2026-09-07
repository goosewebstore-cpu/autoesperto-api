import json
import urllib.request
import urllib.parse
import time

blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

QUERIES_AFF = {
    "le-10-auto-piu-rubate-italia-2026": [
        "polizia di stato auto alfa romeo", "polizia stradale auto pattuglia", "car crime theft investigation vehicle"
    ],
    "10-auto-piu-affidabili-usate-2026": [
        "toyota yaris hybrid front modern", "honda civic hatchback front modern", "mazda 3 hatchback front red"
    ],
    "motori-12-puretech-problemi-cinghia-bagno-olio": [
        "puretech engine peugeot citroen", "timing belt oil submerged automotive", "peugeot 1.2 puretech engine bay"
    ],
    "motori-15-dci-renault-affidabilita-bronzine": [
        "renault k9k 1.5 dci engine", "1.5 dci engine renault", "renault clio dci engine bay"
    ],
    "cambio-dsg-dq200-volkswagen-problemi-frizione": [
        "volkswagen dsg gearbox transmission", "dual clutch transmission cutaway dsg", "vw dsg mechatronic"
    ],
    "motori-13-multijet-fiat-affidabilita-catena": [
        "fiat 1.3 multijet engine", "1.3 jtd multijet engine bay fiat", "multijet 16v engine fiat"
    ],
    "motori-15-bluehdi-stellantis-catena-camme": [
        "psa dv5 1.5 bluehdi engine", "1.5 bluehdi engine peugeot citroen", "peugeot bluehdi diesel engine"
    ],
    "auto-usate-da-300000-km-indistruttibili": [
        "volvo v70 estate modern", "mercedes w124 estate front", "toyota land cruiser modern front"
    ],
    "cambi-automatici-piu-affidabili-classifica": [
        "zf 8hp automatic transmission", "automatic transmission cutaway torque converter", "aisin automatic transmission"
    ],
    "motore-14-tsi-volkswagen-catena-consumo-olio": [
        "volkswagen 1.4 tsi ea111 engine", "1.4 tsi twincharger engine", "vw 1.4 tsi engine bay"
    ],
    "motore-20-tdi-volkswagen-pompa-alta-pressione-cp4": [
        "bosch cp4 common rail pump", "high pressure fuel pump common rail", "volkswagen 2.0 tdi common rail engine"
    ],
    "motori-bmw-n47-problema-catena-distribuzione": [
        "bmw n47 diesel engine", "bmw 2.0d n47 engine bay", "bmw n47 timing chain"
    ],
    "motore-ford-10-ecoboost-cinghia-bagno-olio": [
        "ford 1.0 ecoboost engine", "1.0 ecoboost 3 cylinder engine", "ford fiesta ecoboost engine bay"
    ],
    "motori-benzina-piu-affidabili-usato": [
        "fiat fire 1.2 8v engine", "toyota 1.0 vvt-i 1kr-fe engine", "honda vtec 16v engine"
    ],
    "motori-diesel-piu-affidabili-usato": [
        "fiat 1.9 jtd 8v engine", "volkswagen 1.9 tdi engine", "peugeot 2.0 hdi engine"
    ],
    "affidabilita-auto-ibride-toyota-hsd": [
        "toyota hybrid synergy drive cutaway", "toyota prius hybrid transaxle inverter", "toyota hsd power split device"
    ],
    "problemi-cambio-cvt-nissan-jatco": [
        "continuously variable transmission cvt cutaway", "jatco cvt pushbelt pulleys", "nissan cvt transmission"
    ],
    "motore-16-jtdm-alfa-romeo-fiat-affidabilita": [
        "alfa romeo giulietta 1.6 jtdm engine", "1.6 multijet engine fiat", "alfa 1.6 jtdm engine bay"
    ],
    "motore-12-tsi-volkswagen-ea211-cinghia": [
        "volkswagen ea211 1.2 tsi engine", "vw golf ea211 engine bay", "1.2 tsi ea211 16v"
    ],
    "motore--mercedes-15-dci-om607-affidabilita": [
        "mercedes om607 engine class a", "mercedes a 180 cdi engine bay", "mercedes 1.5 cdi om608"
    ],
    "motori-3-cilindri-turbo-affidabilita": [
        "3 cylinder turbo engine cutaway", "modern 3 cylinder inline engine", "downsized 3 cylinder turbo engine"
    ],
    "problemi-adblue-peugeot-citroen-deformazione-serbatoio": [
        "selective catalytic reduction tank urea", "scr adblue injector exhaust", "diesel exhaust fluid injector"
    ],
    "motore-20-d-ingenium-jaguar-land-rover-catena": [
        "jaguar ingenium 2.0d engine", "land rover 2.0 ingenium diesel engine", "range rover evoque ingenium engine"
    ],
    "motori-gpl-di-serie-affidabilita-valvole": [
        "lpg cng injector rail autogas", "autogas lpg car engine installation", "lpg toroidal tank spare wheel"
    ],
    "motori-metano-di-serie-volkswagen-g-tron": [
        "cng compressed natural gas car cylinder", "erdgas auto cng tanks", "volkswagen tgi natural gas engine"
    ],
    "affidabilita-marchi-auto-classifica-2026": [
        "modern car showroom dealerships lineup", "new cars parked front dealership showroom", "car front grilles modern dealership"
    ],
    "problemi-sospensioni-pneumatiche-suv": [
        "air suspension strut bellows air spring", "luftfederung pkw bellows", "audi adaptive air suspension strut"
    ],
    "problemi-elettronica-auto-usate-centraline": [
        "car electronic control unit ecu circuit board", "automotive fuse box relay engine", "car wiring harness electronic module"
    ],
    "motore-16-thp-peugeot-mini-catena-consumo-olio": [
        "prince engine 1.6 thp mini cooper", "peugeot 1.6 thp engine", "mini cooper s turbo engine bay"
    ],
    "motore-20-multijet-fiat-alfa-20-tdi": [
        "fiat 2.0 multijet engine", "alfa 2.0 jtdm engine bay", "2.0 multijet 170 hp engine"
    ],
    "motore-15-tsi-volkswagen-act-disattivazione-cilindri": [
        "volkswagen 1.5 tsi evo engine", "vw 1.5 tsi engine bay golf", "1.5 tsi evo cylinder deactivation"
    ],
    "motori-mazda-skyactiv-g-d-affidabilita": [
        "mazda skyactiv engine cutaway", "mazda skyactiv-g engine bay", "mazda skyactiv-d 2.2 engine"
    ],
    "motori-hyundai-kia-16-crdi-affidabilita": [
        "hyundai 1.6 crdi u2 engine", "kia 1.6 crdi engine bay", "hyundai tucson crdi engine"
    ],
    "motori-subaru-boxer-diesel-problemi-albero-motore": [
        "subaru boxer diesel ee20 engine", "subaru boxer engine cutaway", "subaru horizontal opposed diesel engine"
    ],
    "problemi-volano-monomassa-vs-bimassa": [
        "single mass flywheel clutch kit conversion", "dual mass flywheel vs single mass", "flywheel clutch friction surface"
    ],
    "affidabilita-auto-elettriche-usate-motore-inverter": [
        "electric car motor inverter unit drivetrain", "ev electric motor reduction gear transmission", "electric vehicle power inverter unit"
    ]
}

def search_wikimedia(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=10&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            candidates = []
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
                    candidates.append({
                        'title': title,
                        'base': base,
                        'width': w,
                        'height': h,
                        'url': ii.get('url', '')
                    })
            return candidates
    except Exception as e:
        print(f"Error searching '{q}': {e}")
        return []

print(f"Prepared queries for {len(QUERIES_AFF)} affidabilita articles.")
