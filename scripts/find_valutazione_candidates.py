import urllib.request
import urllib.parse
import json

TARGETS = {
    # Models
    "quanto-vale-fiat-panda-usata-2026": [
        'intitle:"Fiat Panda Easy" filetype:bitmap',
        'intitle:"Fiat Panda" "Front" filetype:bitmap',
        'Fiat Panda 2012 front filetype:bitmap'
    ],
    "quanto-vale-fiat-panda-usata-quotazione": [
        'intitle:"Fiat Panda 4x4" filetype:bitmap',
        'Fiat Panda 4x40 filetype:bitmap',
        'Fiat Panda Cross filetype:bitmap'
    ],
    "quanto-vale-fiat-500-usata-2026-prezzi-controlli": [
        'intitle:"Fiat 500" "Front" filetype:bitmap',
        'Fiat 500 Lounge filetype:bitmap',
        'Fiat 500 in Emilia-Romagna filetype:bitmap'
    ],
    "quanto-vale-fiat-500-usata-quotazione": [
        'intitle:"Fiat 500C" filetype:bitmap',
        'Fiat 500 Cabriolet filetype:bitmap',
        'Fiat 500 Hybrid filetype:bitmap'
    ],
    "quanto-vale-volkswagen-golf-usata": [
        'intitle:"Volkswagen Golf VII" filetype:bitmap',
        'intitle:"Volkswagen Golf VIII" filetype:bitmap',
        'Volkswagen Golf 7 TSI filetype:bitmap'
    ],
    "quanto-vale-lancia-ypsilon-usata": [
        'intitle:"Lancia Ypsilon" filetype:bitmap',
        'Lancia Ypsilon Geneva filetype:bitmap'
    ],
    "quanto-vale-dacia-duster-usata": [
        'intitle:"Dacia Duster" filetype:bitmap',
        'Dacia Duster II filetype:bitmap'
    ],
    "quanto-vale-alfa-romeo-giulietta-usata": [
        'intitle:"Alfa Romeo Giulietta (940" filetype:bitmap',
        'Alfa Romeo Giulietta Super filetype:bitmap',
        'Alfa Romeo Giulietta 2017 filetype:bitmap'
    ],
    "quanto-vale-jeep-renegade-usata": [
        'intitle:"Jeep Renegade 4xe" filetype:bitmap',
        'intitle:"Jeep Renegade" filetype:bitmap'
    ],
    "quanto-vale-toyota-yaris-usata": [
        'intitle:"Toyota Yaris Hybrid" filetype:bitmap',
        'Toyota Yaris XP210 filetype:bitmap'
    ],
    "quanto-vale-renault-clio-usata": [
        'intitle:"Renault Clio IV" filetype:bitmap',
        'intitle:"Renault Clio V" filetype:bitmap',
        'Renault Clio E-Tech filetype:bitmap'
    ],
    "quanto-vale-ford-fiesta-usata": [
        'intitle:"Ford Fiesta MK7" filetype:bitmap',
        'Ford Fiesta ST-Line filetype:bitmap',
        'Ford Fiesta EcoBoost filetype:bitmap'
    ],
    "quanto-vale-citroen-c3-usata": [
        'intitle:"Citroën C3 (3rd generation)" filetype:bitmap',
        'Citroën C3 Airbump filetype:bitmap',
        'intitle:"Citroën C3" filetype:bitmap'
    ],
    "quanto-vale-peugeot-208-usata": [
        'intitle:"Peugeot 208 B" filetype:bitmap',
        'Peugeot 208 GT filetype:bitmap',
        'intitle:"Peugeot 208" filetype:bitmap'
    ],

    # Specific automotive features & inspections
    "valutazione-auto-usata-tetto-panoramico": [
        'View of trees through Tesla Model 3 rear glass roof',
        'sunroof glass roof car interior filetype:bitmap',
        'panoramic roof car filetype:bitmap'
    ],
    "valutazione-auto-usata-interni-in-pelle": [
        'BMW G70 BMW Individual Merino Leather filetype:bitmap',
        'leather interior car seats BMW filetype:bitmap',
        'leather seats car upholstery filetype:bitmap'
    ],
    "valutazione-auto-usata-cerchi-in-lega": [
        'Toyota GR Supra 9545 filetype:bitmap',
        'alloy wheel rim car close-up filetype:bitmap',
        'alloy wheel brake caliper filetype:bitmap'
    ],
    "valutazione-auto-usata-gancio-traino": [
        'towbar trailer hitch car rear filetype:bitmap',
        'Anhängerkupplung PKW filetype:bitmap',
        'towbar fitted car bumper filetype:bitmap'
    ],
    "valutazione-auto-usata-impianto-audio-premium": [
        'Harman Kardon Car Audio Speaker filetype:bitmap',
        'car door speaker Harman Kardon filetype:bitmap',
        'Bose car audio speaker filetype:bitmap'
    ],
    "valutazione-auto-usata-pacchetto-adas": [
        'windshield camera ADAS car filetype:bitmap',
        'lane assist camera windshield car filetype:bitmap',
        'front camera rearview mirror car filetype:bitmap'
    ],
    "valutazione-auto-usata-cambio-automatico": [
        'DSG gear selector car console filetype:bitmap',
        'automatic transmission shifter car interior filetype:bitmap',
        'automatic gear selector BMW filetype:bitmap'
    ],
    "valutazione-auto-usata-freni-e-sospensioni": [
        'MacPherson strut spring car suspension filetype:bitmap',
        'car suspension coilover shock absorber filetype:bitmap',
        'brake disc suspension strut car filetype:bitmap'
    ],
    "valutazione-auto-usata-motore-rumori": [
        'timing chain car engine filetype:bitmap',
        'engine timing chain camshaft filetype:bitmap',
        'car engine bay mechanics inspection filetype:bitmap'
    ],
    "valutazione-auto-usata-stato-fari-cristalli": [
        'Close view of a car headlight with condensation filetype:bitmap',
        'car headlight lens close up filetype:bitmap',
        'headlamp car front lens filetype:bitmap'
    ],
    "valutazione-auto-usata-stato-pneumatici": [
        'TyreDepthGauge filetype:bitmap',
        'tire tread depth measurement filetype:bitmap',
        'tyre tread gauge measurement filetype:bitmap'
    ],
    "valutazione-auto-usata-stato-interni": [
        'car steering wheel dashboard wear filetype:bitmap',
        'worn leather steering wheel car filetype:bitmap',
        'driver cockpit steering wheel modern filetype:bitmap'
    ],
    "valutazione-auto-usata-incidenza-chilometri": [
        'digital odometer speedometer car km filetype:bitmap',
        'instrument cluster car speedometer digital filetype:bitmap',
        'car dashboard tachometer km/h filetype:bitmap'
    ],
    "valutazione-auto-usata-incidenza-optional": [
        'car center console infotainment screen buttons filetype:bitmap',
        'modern car cockpit steering wheel screen filetype:bitmap',
        'luxury car dashboard buttons options filetype:bitmap'
    ],
    "valutazione-auto-incidente-subito": [
        'paint thickness gauge car body filetype:bitmap',
        'measuring paint thickness car filetype:bitmap',
        'damaged car fender repair filetype:bitmap'
    ],
    "valutazione-auto-usata-allestimento-top": [
        'M Sport badge car fender filetype:bitmap',
        'AMG badge car exterior filetype:bitmap',
        'S-line badge car grill filetype:bitmap'
    ],
    "valutazione-auto-usata-targa-estera": [
        'German license plate car rear filetype:bitmap',
        'German number plate car filetype:bitmap',
        'European license plate car filetype:bitmap'
    ],
    "valutazione-auto-usata-colore-carrozzeria": [
        'metallic paint car reflection glossy filetype:bitmap',
        'car paint reflection shiny showroom filetype:bitmap',
        'automotive paint detailing finish filetype:bitmap'
    ],
    "quotazione-auto-euro-5-diesel-blocchi": [
        'ZTL sign Italy traffic filetype:bitmap',
        'Zona a Traffico Limitato sign filetype:bitmap',
        'low emission zone sign Europe filetype:bitmap'
    ],
    "valutazione-auto-usata-libretto-tagliandi": [
        'stamped service book car maintenance filetype:bitmap',
        'car service manual stamped pages filetype:bitmap',
        'vehicle maintenance history book filetype:bitmap'
    ],
    "valutazione-auto-usata-numero-proprietari": [
        'Italian car registration document DUC filetype:bitmap',
        'Carta di circolazione auto filetype:bitmap',
        'vehicle registration certificate desk filetype:bitmap'
    ],
    "valutazione-auto-usata-garanzia-residua": [
        'warranty booklet car keys filetype:bitmap',
        'official car warranty certificate filetype:bitmap',
        'vehicle warranty folder desk filetype:bitmap'
    ],
    "calcolo-ipt-passaggio-proprieta-province": [
        'Italian car ownership transfer document filetype:bitmap',
        'calculator paperwork car keys desk filetype:bitmap',
        'ACI PRA passaggio di proprieta document filetype:bitmap'
    ],
    "visura-pra-auto-usata-cosa-controllare": [
        'visura PRA auto document filetype:bitmap',
        'official automotive registry document stamp filetype:bitmap',
        'legal vehicle document stamp check filetype:bitmap'
    ],
    "valutazione-auto-usata-stagionalita": [
        'cabriolet convertible spring road filetype:bitmap',
        '4x4 SUV winter snow road filetype:bitmap',
        'convertible car driving sunny filetype:bitmap'
    ],
    "valutazione-auto-usata-zona-geografica": [
        'scenic Italian road highway car driving filetype:bitmap',
        'highway Italy landscape driving filetype:bitmap',
        'Autostrada del Sole Italy car filetype:bitmap'
    ],
    "auto-usate-che-perdono-piu-valore-2026": [
        'car depreciation graph chart filetype:bitmap',
        'used car lot valuation dealership filetype:bitmap',
        'car price drop market chart filetype:bitmap'
    ],
    "quanto-costa-mantenere-auto-2026-spese-reali": [
        'car running costs calculator fuel receipt filetype:bitmap',
        'calculator fuel receipt car key desk filetype:bitmap',
        'automobile expenses invoices pen filetype:bitmap'
    ],
    "svalutazione-auto-usata-anno-per-anno": [
        'vehicle depreciation percentage chart filetype:bitmap',
        'automotive valuation curve chart filetype:bitmap',
        'car price depreciation table analysis filetype:bitmap'
    ],
    "bollo-auto-sicilia-2026-chi-paga-esenzioni": [
        'bollo auto calcolo bollettino ricevuta filetype:bitmap',
        'Italian car tax payment slip desk filetype:bitmap',
        'Agenzia delle Entrate bollo auto quietanza filetype:bitmap'
    ]
}

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                url = ii.get('url', '')
                mime = ii.get('mime', '')
                if ('jpeg' in mime or 'png' in mime or 'jpg' in mime) and w >= 1200 and h >= 600:
                    results.append({'title': title, 'w': w, 'h': h, 'url': url})
            return results
    except Exception as e:
        return []

findings = {}
for slug, qlist in TARGETS.items():
    found = []
    for q in qlist:
        res = search_wikimedia(q)
        if res:
            found.extend(res)
            break
    findings[slug] = found
    status = f"OK ({len(found)} hits: {found[0]['title'][:40]})" if found else "NO HITS"
    print(f"[{slug[:40]}] -> {status}")

with open('scripts/valutazione_wiki_hits.json', 'w', encoding='utf-8') as f:
    json.dump(findings, f, indent=2)
