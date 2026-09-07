import json
import urllib.request
import urllib.parse
import time

blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

QUERIES = {
    "aria-condizionata-auto-salva-motore-batteria-caldo-2026": [
        "car air conditioning service station", "r134a manifold gauges", "car ac compressor repair"
    ],
    "benzina-quasi-da-record-guida-risparmiare-1500-euro": [
        "fuel pump nozzle refueling car", "petrol pump nozzle car tank", "gasoline pump dispenser car"
    ],
    "fiat-panda-500-rubate-sicilia-come-proteggersi": [
        "steering wheel lock car", "pedal lock anti theft car", "disklok steering wheel"
    ],
    "profilo-auto-digitale-passaporto-veicolo": [
        "car service book maintenance record", "vehicle registration document certificate", "car inspection tablet checklist"
    ],
    "cinghia-distribuzione-vs-catena-scadenza": [
        "timing belt engine automotive", "timing chain engine camshaft", "timing belt pulleys tensioner"
    ],
    "frizione-e-volano-bimassa-sintomi-costi": [
        "dual mass flywheel clutch", "zweimassenschwungrad", "clutch disc pressure plate"
    ],
    "cambio-olio-motore-ogni-quanti-km": [
        "pouring motor oil into engine", "oil change engine dipstick", "pouring engine oil filler"
    ],
    "freni-auto-usurati-fischio-sostituzione": [
        "brake disc caliper ventilated", "car brake pad rotor replacement", "bremsscheibe bremssattel"
    ],
    "batteria-auto-scarica-sintomi-sostituzione": [
        "car battery engine compartment terminal", "car battery tester clamps", "autobatterie 12v"
    ],
    "spie-cruscotto-auto-significato-colori": [
        "car instrument cluster warning lights illuminated", "car dashboard speedometer night illuminated", "cockpit instrument cluster lit"
    ],
    "dpf-fap-intasato-rigenerazione-soluzioni": [
        "diesel particulate filter dpf cutaway", "dieselpartikelfilter", "particulate filter honeycomb exhaust"
    ],
    "adblue-problemi-spia-motore-inverno": [
        "adblue tank filler neck car", "filling adblue diesel car", "adblue filler cap"
    ],
    "climatizzatore-auto-non-raffredda-ricarica": [
        "air conditioning recharging machine car", "klimaservice gerat auto", "automotive ac service unit"
    ],
    "ammortizzatori-auto-scarichi-sintomi": [
        "macpherson strut coil spring shock absorber", "car suspension shock absorber strut", "federbein stosdampfer"
    ],
    "candele-e-candelette-sostituzione-sintomi": [
        "spark plugs automotive engine", "spark plug electrode ceramic", "zundkerzen motor"
    ],
    "liquido-refrigerante-radiatore-livello": [
        "coolant expansion tank car engine", "radiator coolant reservoir pink", "kuhlmittelbehalter auto"
    ],
    "cambio-automatico-manutenzione-lavaggio": [
        "automatic transmission fluid flush machine", "getriebespulung automatikgetriebe", "automatic gearbox oil service"
    ],
    "pneumatici-usura-pressione-inversione": [
        "checking tyre pressure gauge car wheel", "tyre tread depth gauge measurement", "tire pressure gauge valve stem"
    ],
    "spia-motore-gialla-fissa-o-lampeggiante": [
        "obd2 scanner diagnostic port car", "check engine light dashboard obd", "car diagnostic tool obdii screen"
    ],
    "valvola-egr-sporca-sintomi-pulizia": [
        "egr valve exhaust gas recirculation", "agr ventil verkokt", "egr valve carbon deposits"
    ],
    "liquido-freni-dot4-sostituzione-umidita": [
        "brake fluid reservoir master cylinder car", "brake fluid tester moisture", "bremsflussigkeit behaelter"
    ],
    "rumore-braccetti-sospensione-silentblock": [
        "control arm bushing suspension car", "querlenker buchse silentlager", "suspension wishbone ball joint"
    ],
    "debimetro-flussometro-aria-sintomi": [
        "mass air flow sensor automotive", "luftmassenmesser maf sensor", "air flow meter intake"
    ],
    "sonda-lambda-guasta-consumi-elevati": [
        "lambda sensor oxygen exhaust probe", "lambdasonde auspuff", "oxygen sensor car exhaust manifold"
    ],
    "puleggia-albero-motore-smorzatrice-rumore": [
        "crankshaft pulley harmonic balancer", "riemenscheibe kurbelwelle", "crankshaft damper pulley engine"
    ],
    "alternatore-auto-guasto-spia-batteria": [
        "car alternator engine generator", "lichtmaschine kfz alternator", "automotive alternator copper winding"
    ],
    "motorino-avviamento-auto-non-parte": [
        "starter motor car solenoid pinion", "anlasser kfz starter", "car starter motor assembly"
    ],
    "cuscinetti-ruota-rumore-rombo-velocita": [
        "wheel bearing hub assembly car", "radlager kfz wheel bearing", "wheel hub bearing unit"
    ],
    "pompa-acqua-perdita-liquido-distribuzione": [
        "water pump engine impeller automotive", "wasserpumpe motor kfz", "automotive coolant water pump"
    ],
    "scatola-sterzo-gioco-rumore-perdite": [
        "steering rack and pinion car", "lenkgetriebe zahnstangenlenkung", "power steering rack tie rod"
    ],
    "catalizzatore-otturato-sintomi-sostituzione": [
        "catalytic converter exhaust cutaway honeycomb", "katalysator kfz abgasanlage", "catalytic converter monolit"
    ],
    "termostato-motore-bloccato-aperto-chiuso": [
        "engine thermostat housing valve coolant", "kuhlmittelthermostat kfz", "car thermostat brass wax"
    ],
    "turbina-motore-fischio-olio-fumo-blu": [
        "turbocharger turbine compressor wheel", "abgasturbolader cutaway", "car turbocharger disassembled"
    ],
    "iniettori-diesel-rumorosi-fumo-nero": [
        "common rail diesel fuel injector", "diesel injektor common rail", "piezo injector diesel fuel"
    ],
    "candelette-preriscaldo-spia-lampeggiante": [
        "diesel glow plugs incandescent", "gluhkerzen diesel", "glow plug tip diesel engine"
    ],
    "pulizia-corpo-farfallato-minimo-irregolare": [
        "throttle body butterfly valve engine", "drosselklappe benzinmotor", "electronic throttle body intake"
    ],
    "manutenzione-tetto-apribile-infiltrazioni": [
        "car panoramic sunroof open glass", "schiebedach pkw panoramic roof", "open sunroof vehicle roof"
    ],
    "sostituzione-spazzole-tergicristallo-rumore": [
        "windshield wiper blade rain windshield", "scheibenwischerblatt auto", "car wiper blade windshield raindrops"
    ]
}

def search_wikimedia(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=12&gsrnamespace=6&prop=imageinfo&iiprop=url|size|mime&format=json"
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

print(f"Testing queries for all {len(QUERIES)} articles...")
results = {}
for slug, q_list in QUERIES.items():
    found = []
    for q in q_list:
        cands = search_wikimedia(q)
        for c in cands:
            if c['base'] not in [x['base'] for x in found]:
                found.append(c)
        if len(found) >= 3:
            break
        time.sleep(0.3)
    results[slug] = found
    print(f"[{len(found)} hits] {slug}")

with open('scripts/manutenzione_search_hits.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("\nSaved scripts/manutenzione_search_hits.json")
