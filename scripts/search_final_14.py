import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SEARCHES = {
    # 1. ADAS windshield camera / sensor
    "adas": [
        'Subaru EyeSight stereo cameras windshield filetype:bitmap',
        'ADAS camera windshield car filetype:bitmap',
        'windshield sensor rearview mirror Tesla filetype:bitmap',
        'lane assist camera car windshield filetype:bitmap',
        'radar sensor car grille front filetype:bitmap'
    ],
    # 2. Infotainment touchscreen / center console
    "infotainment": [
        'BMW iDrive center console touchscreen filetype:bitmap',
        'Mercedes-Benz MBUX touchscreen cockpit filetype:bitmap',
        'touchscreen infotainment display car dashboard filetype:bitmap',
        'Audi MMI touchscreen dashboard filetype:bitmap'
    ],
    # 3. Paint gloss / reflections
    "car_paint": [
        'car detailing polish glossy hood reflection filetype:bitmap',
        'metallic paint car hood reflection showroom filetype:bitmap',
        'ceramic coating car paint reflection filetype:bitmap'
    ],
    # 4. German / Foreign license plate
    "license_plate": [
        'German license plate EU car rear filetype:bitmap',
        'car with German license plate front filetype:bitmap',
        'Audi with German number plate filetype:bitmap',
        'BMW with German license plate filetype:bitmap'
    ],
    # 5. Steering wheel interior wear / driver cockpit
    "interior_wear": [
        'driver cockpit steering wheel modern car interior filetype:bitmap',
        'leather steering wheel multi-function modern car filetype:bitmap',
        'car interior steering wheel driver seat modern filetype:bitmap'
    ],
    # 6. Service booklet stamped / maintenance log
    "service_book": [
        'service booklet car inspection stamps filetype:bitmap',
        'maintenance service book stamped car filetype:bitmap',
        'car service manual stamped desk filetype:bitmap',
        'oil change sticker car windshield filetype:bitmap'
    ],
    # 7. Convertible sunny road (Seasonality)
    "convertible": [
        'Mazda MX-5 Miata sunny road driving filetype:bitmap',
        'Porsche 911 Cabriolet sunny driving filetype:bitmap',
        'convertible sports car coastal road filetype:bitmap'
    ],
    # 8. Warranty / Car keys contract handover
    "warranty": [
        'handing car keys handover dealer customer filetype:bitmap',
        'car keys contract signing desk dealership filetype:bitmap',
        'car keys handover new owner filetype:bitmap'
    ],
    # 9. Ownership transfer document (IPT / PRA)
    "transfer_document": [
        'signing contract desk pen calculator car filetype:bitmap',
        'car sales agreement contract signature pen filetype:bitmap',
        'signing vehicle purchase agreement table filetype:bitmap'
    ],
    # 10. Official vehicle verification / stamp
    "visura_pra": [
        'legal document stamp seal signature desk filetype:bitmap',
        'notary official seal document stamp agreement filetype:bitmap',
        'official government certificate stamp paper filetype:bitmap'
    ],
    # 11. Depreciation graph / financial chart
    "chart_depreciation": [
        'financial stock market graph screen analytics filetype:bitmap',
        'business statistics graph chart laptop screen filetype:bitmap',
        'economic market data graph display screen filetype:bitmap'
    ],
    # 12. Sicily bollo / Italian tax slip
    "tax_slip": [
        'bollettino postale ricevuta pagamento timbro filetype:bitmap',
        'ricevuta fiscale pagamento timbro quietanza filetype:bitmap',
        'Agenzia delle Entrate modulo F24 ricevuta filetype:bitmap'
    ],
    # 13. AutoEsperto AI investors presentation
    "investors_ai": [
        'artificial intelligence technology presentation screen conference filetype:bitmap',
        'data analytics presentation screen boardroom conference filetype:bitmap',
        'tech startup pitch deck screen presentation filetype:bitmap'
    ],
    # 14. Modern Renault Clio front
    "renault_clio": [
        'Renault Clio V Front 1X7A filetype:bitmap',
        'Renault Clio IV Front filetype:bitmap',
        'intitle:"Renault Clio" "Front" filetype:bitmap'
    ]
}

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                url = ii.get('url', '')
                if ('jpeg' in mime or 'png' in mime or 'jpg' in mime) and w >= 1200 and h >= 600:
                    results.append({'title': title, 'w': w, 'h': h, 'url': url})
            return results
    except Exception as e:
        return []

for cat, qlist in SEARCHES.items():
    found = []
    for q in qlist:
        res = search(q)
        if res:
            found.extend(res)
            print(f"OK: {cat} -> {res[0]['title']} ({res[0]['w']}x{res[0]['h']})", flush=True)
            break
    if not found:
        print(f"FAILED: {cat}", flush=True)
