import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

QUERIES = {
    "valutazione-auto-usata-pacchetto-adas": [
        'intitle:"ADAS" filetype:bitmap',
        'intitle:"EyeSight" filetype:bitmap',
        'intitle:"sensor" "windshield" filetype:bitmap',
        'Tesla autopilot camera filetype:bitmap'
    ],
    "valutazione-auto-usata-incidenza-chilometri": [
        'intitle:"speedometer" "km/h" filetype:bitmap',
        'intitle:"tachometer" "km/h" filetype:bitmap',
        'intitle:"cockpit" "digital" filetype:bitmap',
        'Audi virtual cockpit filetype:bitmap'
    ],
    "valutazione-auto-usata-incidenza-optional": [
        'intitle:"infotainment" "console" filetype:bitmap',
        'intitle:"center console" "touchscreen" filetype:bitmap',
        'BMW iDrive screen console filetype:bitmap',
        'Mercedes MBUX interior screen filetype:bitmap'
    ],
    "valutazione-auto-incidente-subito": [
        'intitle:"damage" "car" "fender" filetype:bitmap',
        'intitle:"scratch" "car" "body" filetype:bitmap',
        'car dent door panel repair filetype:bitmap'
    ],
    "valutazione-auto-usata-colore-carrozzeria": [
        'intitle:"Metallic" "Paint" car filetype:bitmap',
        'car paint reflection showroom filetype:bitmap',
        'glossy car paint finish reflection filetype:bitmap'
    ],
    "valutazione-auto-usata-targa-estera": [
        'intitle:"Kennzeichen" "PKW" filetype:bitmap',
        'intitle:"Nummernschild" "Auto" filetype:bitmap',
        'German car license plate front filetype:bitmap'
    ],
    "valutazione-auto-usata-stato-interni": [
        'intitle:"steering wheel" "leather" filetype:bitmap',
        'car steering wheel interior dashboard filetype:bitmap',
        'driver seat leather steering wheel filetype:bitmap'
    ],
    "valutazione-auto-usata-libretto-tagliandi": [
        'intitle:"Scheckheft" filetype:bitmap',
        'intitle:"Serviceheft" filetype:bitmap',
        'intitle:"Wartungsheft" filetype:bitmap',
        'car maintenance service log filetype:bitmap'
    ],
    "valutazione-auto-usata-numero-proprietari": [
        'intitle:"Fahrzeugbrief" filetype:bitmap',
        'intitle:"Zulassungsbescheinigung" filetype:bitmap',
        'intitle:"carte grise" filetype:bitmap'
    ],
    "valutazione-auto-usata-stagionalita": [
        'intitle:"Cabriolet" "road" filetype:bitmap',
        'intitle:"Convertible" "sun" filetype:bitmap',
        'Mazda MX-5 road driving filetype:bitmap'
    ],
    "valutazione-auto-usata-garanzia-residua": [
        'intitle:"car key" "handover" filetype:bitmap',
        'handing over car keys deal filetype:bitmap',
        'car keys contract handshake table filetype:bitmap'
    ],
    "valutazione-auto-usata-freni-e-sospensioni": [
        'intitle:"Federbein" filetype:bitmap',
        'intitle:"Coilover" filetype:bitmap',
        'intitle:"Stoßdämpfer" filetype:bitmap',
        'car suspension coilover strut filetype:bitmap'
    ],
    "calcolo-ipt-passaggio-proprieta-province": [
        'calculator pen contract desk car filetype:bitmap',
        'calculator document car key desk filetype:bitmap'
    ],
    "visura-pra-auto-usata-cosa-controllare": [
        'official document stamp seal legal car filetype:bitmap',
        'vehicle inspection document certificate filetype:bitmap'
    ],
    "auto-usate-che-perdono-piu-valore-2026": [
        'used car lot dealership rows filetype:bitmap',
        'car dealership lot vehicles rows filetype:bitmap'
    ],
    "quanto-costa-mantenere-auto-2026-spese-reali": [
        'car maintenance bill invoice calculator filetype:bitmap',
        'fuel pump nozzle receipt car filetype:bitmap'
    ],
    "svalutazione-auto-usata-anno-per-anno": [
        'car price graph curve chart filetype:bitmap',
        'statistics graph chart screen analytics filetype:bitmap'
    ],
    "straccia-bollo-sicilia-2026-chi-puo-farlo-norme": [
        'bollo auto ricevuta pagamento marca bollo filetype:bitmap',
        'ricevuta fiscale bollo auto quietanza filetype:bitmap'
    ],
    "bollo-auto-sicilia-2026-chi-paga-esenzioni": [
        'Agenzia Entrate ricevuta bollo auto kW filetype:bitmap',
        'ACI pagamento bollo auto ricevuta filetype:bitmap'
    ],
    "autoesperto-cerca-investitori-ai-auto-usate": [
        'artificial intelligence analytics dashboard screen filetype:bitmap',
        'financial presentation boardroom screen investment filetype:bitmap'
    ]
}

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url|size|mime&format=json"
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

hits = {}
for slug, qlist in QUERIES.items():
    found = []
    for q in qlist:
        res = search_wikimedia(q)
        if res:
            found.extend(res)
            print(f"OK: {slug} -> {res[0]['title']} ({res[0]['w']}x{res[0]['h']})", flush=True)
            break
    if not found:
        print(f"FAILED: {slug}", flush=True)
    else:
        hits[slug] = found

with open('scripts/exact_17_hits.json', 'w', encoding='utf-8') as f:
    json.dump(hits, f, indent=2)
