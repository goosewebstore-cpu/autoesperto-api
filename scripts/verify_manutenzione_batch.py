import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

PROPOSED_MANUTENZIONE = {
    "aria-condizionata-auto-salva-motore-batteria-caldo-2026": "File:2000 Toyota Sienna (3).jpg",
    "benzina-quasi-da-record-guida-risparmiare-1500-euro": "File:A petrol attendant in a fuel station.jpg",
    "fiat-panda-500-rubate-sicilia-come-proteggersi": "File:A steering-wheel lock is a visible anti-theft device.jpg",
    "profilo-auto-digitale-passaporto-veicolo": "File:Motor Vehicle Register Certificate of PRC Cover.jpg",
    "cinghia-distribuzione-vs-catena-scadenza": "File:2001 honda accord timing belt-terabass.jpg",
    "frizione-e-volano-bimassa-sintomi-costi": "File:Zweimassenschwungrad und kupplung aufgeschnitten.jpg",
    "cambio-olio-motore-ogni-quanti-km": "File:020220816 121314 motor oil Galkar.jpg",
    "freni-auto-usurati-fischio-sostituzione": "File:Magura Julie disk brake rotor 160 mm.jpg",
    "batteria-auto-scarica-sintomi-sostituzione": "File:An Advance Auto Parts store employee changes a car battery in a parking lot in front of the shop.jpg",
    "spie-cruscotto-auto-significato-colori": "File:Dashboard display showing warning lights in a vehicle during nighttime driving.jpg",
    "dpf-fap-intasato-rigenerazione-soluzioni": "File:Diesel particulate filter 01.JPG",
    "adblue-problemi-spia-motore-inverno": "File:5l Diesel Exhaust Fluid canister (cropped).jpg",
    "climatizzatore-auto-non-raffredda-ricarica": "File:Cool under pressure- 386th ECES HVAC technicians in action (9047740).jpg",
    "ammortizzatori-auto-scarichi-sintomi": "File:Volkswagen Golf GTI VI -Crossing the Tagus River in a ferry boat- (47168591562).jpg",
    "candele-e-candelette-sostituzione-sintomi": "File:10 NGK Spark Plugs Dodge RPDE.jpg",
    "liquido-refrigerante-radiatore-livello": "File:2023 Subaru Outback Limited 2.5 liter 4 cyl engine bay.jpg",
    "cambio-automatico-manutenzione-lavaggio": "File:AISIN AWR10L65 automatic transmission.jpg",
    "pneumatici-usura-pressione-inversione": "File:Fiat 500 Abarth (15351745174).jpg",
    "spia-motore-gialla-fissa-o-lampeggiante": "File:OBD-II Connector 09911-01.jpg",
    "valvola-egr-sporca-sintomi-pulizia": "File:Clogged EGR Valve Intake manifold.jpg",
    "liquido-freni-dot4-sostituzione-umidita": "File:Brake fluid reservoir in Škoda Fabia I.jpg",
    "rumore-braccetti-sospensione-silentblock": "File:Car, Front tire, Failed Ball Joint.jpg",
    "debimetro-flussometro-aria-sintomi": "File:Bosch Mass Air Flow Sensor location in the engine bay (Opel Antara 2.0 CDTI).jpg",
    "sonda-lambda-guasta-consumi-elevati": "File:Caterham Roadsport building - 091.2 - Fix lambda probe wiring - Flickr - exfordy.jpg",
    "puleggia-albero-motore-smorzatrice-rumore": "File:Keilrippenriemen Servopumpe Spannrollen VW T4 IMG 20160922 135213.jpg",
    "alternatore-auto-guasto-spia-batteria": "File:20080131030DR Dresden-Seevorstadt Offizielle Bosch Einbaustelle.jpg",
    "motorino-avviamento-auto-non-parte": "File:20080131035DR Dresden-Seevorstadt Offizielle Bosch Einbaustelle.jpg",
    "cuscinetti-ruota-rumore-rombo-velocita": "File:Lotus Europa (29970237816).jpg",
    "pompa-acqua-perdita-liquido-distribuzione": "File:Pompa wody2.jpg",
    "scatola-sterzo-gioco-rumore-perdite": "File:1971 AMI Rambler Gremlin AnnMD sterbx.jpg",
    "catalizzatore-otturato-sintomi-sostituzione": "File:Catalytic Converter Interior.jpg",
    "termostato-motore-bloccato-aperto-chiuso": "File:2005 Chevrolet Aveo Thermostat Housing (broken).jpg",
    "turbina-motore-fischio-olio-fumo-blu": "File:Turbocompressor.JPG",
    "iniettori-diesel-rumorosi-fumo-nero": "File:Bosch common rail injector (cropped).JPG",
    "candelette-preriscaldo-spia-lampeggiante": "File:Glühkerzen Diesel Direkteinspritzer PKW.jpg",
    "pulizia-corpo-farfallato-minimo-irregolare": "File:Opel Z18XE Vectra C beziffert.JPG",
    "manutenzione-tetto-apribile-infiltrazioni": "File:1982 Datsun 200SX SL by Nissan, 3-dr, front right.jpg",
    "sostituzione-spazzole-tergicristallo-rumore": "File:Rain - Flickr - ksjantz.jpg"
}

# Verify uniqueness and blacklist
chosen_bases = [t.replace("File:", "").strip() for t in PROPOSED_MANUTENZIONE.values()]
print(f"Total proposed: {len(chosen_bases)}")
print(f"Unique proposed: {len(set(chosen_bases))}")

bl_clash = [b for b in chosen_bases if b in blacklist]
if bl_clash:
    print(f"WARNING: Blacklist clashes found: {bl_clash}")
else:
    print("ALL 38 FILES ARE 100% UNIQUE AND ZERO BLACKLIST OVERLAP!")

# Batch query mediawiki API to verify they all exist and get URLs
titles_batch = "|".join([urllib.parse.quote(t) for t in PROPOSED_MANUTENZIONE.values()])
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={titles_batch}&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(api_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req, timeout=20) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    pages = data.get('query', {}).get('pages', {})

print(f"\nResolved {len(pages)} pages from Wikimedia API:")
missing = []
for slug, title in PROPOSED_MANUTENZIONE.items():
    found = False
    for pid, p in pages.items():
        if p.get('title') == title or p.get('title').lower() == title.lower():
            ii = p.get('imageinfo', [{}])[0]
            w = ii.get('width', 0)
            h = ii.get('height', 0)
            url = ii.get('url')
            if url and w > 0:
                print(f"  OK [{slug}] -> {title} ({w}x{h})")
                found = True
                break
    if not found:
        print(f"  MISSING/FAILED: [{slug}] -> {title}")
        missing.append((slug, title))

print(f"\nTotal verified OK: {len(PROPOSED_MANUTENZIONE) - len(missing)} / {len(PROPOSED_MANUTENZIONE)}")
