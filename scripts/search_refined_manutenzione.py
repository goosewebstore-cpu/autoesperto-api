import urllib.request
import urllib.parse
import json

blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_SPECIFIC = {
    "aria-condizionata-auto-salva-motore-batteria-caldo-2026": [
        "Car climate control dashboard", "Car air conditioning controls", "Automotive AC compressor"
    ],
    "benzina-quasi-da-record-guida-risparmiare-1500-euro": [
        "Fuel pump nozzle car tank", "Refuelling automobile petrol station", "Filling car petrol station"
    ],
    "fiat-panda-500-rubate-sicilia-come-proteggersi": [
        "Car steering wheel lock", "Disklok steering lock", "Fiat 500 steering wheel interior"
    ],
    "profilo-auto-digitale-passaporto-veicolo": [
        "Vehicle maintenance log book", "Car service manual book", "Vehicle inspection certificate"
    ],
    "freni-auto-usurati-fischio-sostituzione": [
        "Car brake rotor caliper", "Ventilated brake disc car", "Bremsscheibe auto bremssattel"
    ],
    "climatizzatore-auto-non-raffredda-ricarica": [
        "Air conditioning recharge manifold", "Klimaanlage service kfz", "AC manifold gauges car"
    ],
    "ammortizzatori-auto-scarichi-sintomi": [
        "MacPherson strut coil spring car", "Car suspension strut shock absorber", "Federbein auto"
    ],
    "candele-e-candelette-sostituzione-sintomi": [
        "Spark plug ceramic electrode engine", "NGK spark plugs car", "Zuendkerze motor"
    ],
    "liquido-refrigerante-radiatore-livello": [
        "Coolant expansion tank engine bay", "Kuehlmittelbehaelter auto", "Radiator coolant reservoir car"
    ],
    "pneumatici-usura-pressione-inversione": [
        "Tyre pressure gauge car wheel", "Tire tread depth gauge", "Checking tyre pressure automobile"
    ],
    "spia-motore-gialla-fissa-o-lampeggiante": [
        "Check engine light speedometer dashboard", "OBD2 diagnostic scanner car screen", "Motorkontrollleuchte tacho"
    ],
    "rumore-braccetti-sospensione-silentblock": [
        "Suspension wishbone control arm car", "Querlenker auto silentblock", "Car lower control arm ball joint"
    ],
    "alternatore-auto-guasto-spia-batteria": [
        "Car alternator copper winding", "Lichtmaschine kfz auto", "Automotive alternator pulley"
    ],
    "motorino-avviamento-auto-non-parte": [
        "Car starter motor solenoid", "Anlasser auto kfz", "Automobile starter motor pinion"
    ],
    "cuscinetti-ruota-rumore-rombo-velocita": [
        "Wheel hub bearing car", "Radlager auto radnabe", "Car wheel bearing replacement"
    ],
    "pompa-acqua-perdita-liquido-distribuzione": [
        "Automobile water pump impeller", "Wasserpumpe kfz motor", "Car engine water pump coolant"
    ],
    "scatola-sterzo-gioco-rumore-perdite": [
        "Power steering rack car", "Lenkgetriebe auto zahnstange", "Car steering rack tie rod"
    ],
    "termostato-motore-bloccato-aperto-chiuso": [
        "Engine thermostat coolant valve", "Kuehlmittelthermostat kfz", "Car thermostat housing"
    ],
    "pulizia-corpo-farfallato-minimo-irregolare": [
        "Electronic throttle body valve", "Drosselklappe motor auto", "Car throttle body intake flap"
    ],
    "manutenzione-tetto-apribile-infiltrazioni": [
        "Car sunroof glass open", "Panoramic sunroof car roof", "Schiebedach pkw glass"
    ],
    "sostituzione-spazzole-tergicristallo-rumore": [
        "Windshield wiper blade rain car", "Scheibenwischerblatt auto", "Car wiper blade windshield glass"
    ]
}

def search_wikimedia_clean(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=10&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
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
                if w >= 1100 and h >= 600:
                    hits.append({'title': title, 'base': base, 'width': w, 'height': h, 'url': ii.get('url', '')})
            return hits
    except Exception as e:
        return []

refined_hits = {}
for slug, q_list in SEARCH_SPECIFIC.items():
    found = []
    for q in q_list:
        h = search_wikimedia_clean(q)
        for item in h:
            if item['base'] not in [x['base'] for x in found]:
                found.append(item)
        if len(found) >= 3:
            break
    print(f"[{len(found):2d} hits] {slug}")
    for item in found[:2]:
        print(f"    -> {item['base']} ({item['width']}x{item['height']})")
    refined_hits[slug] = found

with open('scripts/manutenzione_refined_hits.json', 'w', encoding='utf-8') as f:
    json.dump(refined_hits, f, indent=2)

print("\nSaved scripts/manutenzione_refined_hits.json")
