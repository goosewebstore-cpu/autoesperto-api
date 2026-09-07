import urllib.request
import urllib.parse
import json
import time

ARTICLES = [
    ("auto-usata-10-segnali-problema-annuncio", "Car inspection mechanic flashlight"),
    ("diesel-benzina-ibrida-2026-quale-comprare-conviene", "Fuel dispenser petrol diesel station"),
    ("migliori-auto-usate-10000-euro-2026", "Renault Clio IV hatchback"),
    ("5-cose-da-controllare-prima-comprare-auto-usata", "Car engine bay inspection hood"),
    ("auto-usata-100000-km-conviene-comprare", "Modern car digital speedometer dashboard"),
    ("come-capire-se-auto-usata-incidentata", "Car body repair workshop panel"),
    ("diesel-euro-5-2026-posso-ancora-comprarlo-blocchi", "Volkswagen TDI diesel engine"),
    ("passaporto-digitale-veicolo-regolamento-ue-2026-1738", "Smartphone QR code app car"),
    ("auto-usate-sotto-3000-euro-guida", "Fiat Punto hatchback street"),
    ("auto-usate-sotto-5000-euro-scelta", "Ford Fiesta 2012 hatchback"),
    ("auto-usate-sotto-15000-euro-migliori", "Nissan Qashqai crossover"),
    ("auto-usate-sotto-20000-euro-premium", "Audi A4 B9 sedan"),
    ("migliori-auto-neopatentati-usate-norme", "Lancia Ypsilon car"),
    ("migliori-suv-usati-economici-scelta", "Dacia Duster II crossover"),
    ("auto-ibride-usate-conviene-controlli", "Toyota Yaris Cross Hybrid"),
    ("diesel-vs-ibrida-usata-confronto", "European motorway highway traffic"),
    ("garanzia-auto-usata-commerciale-legale", "Car dealership desk signing keys"),
    ("controlli-pre-acquisto-auto-usata-lista", "Car workshop hydraulic lift"),
    ("comprare-auto-da-privato-vs-concessionario", "Car dealership glass showroom"),
    ("aste-auto-usate-come-funzionano-rischi", "Car auction parking lot"),
    ("importare-auto-usata-germania-costi", "Car carrier trailer truck highway"),
    ("auto-usate-gpl-metano-conviene", "Autogas LPG filling pump"),
    ("auto-elettrica-usata-autonomia-batteria", "Electric vehicle charging cable plug"),
    ("chilometri-scalati-auto-usata-truffa", "OBD2 car diagnostic scanner"),
    ("acquisto-auto-con-fermo-amministrativo", "Administrative document rubber stamp"),
    ("auto-usata-aziendale-ex-noleggio", "White company fleet cars parking"),
    ("caparra-acquisto-auto-usata-regole", "Signing contract agreement pen paper"),
    ("auto-usata-per-famiglia-monovolume", "Volkswagen Passat Variant estate"),
    ("auto-usata-sportiva-economica", "Mazda MX-5 Miata roadster"),
    ("passaggio-proprieta-auto-usata-costi", "Vehicle registration document certificate"),
    ("finanziamento-auto-usata-conviene", "Financial calculator contract money"),
    ("auto-usate-con-cambio-automatico", "Automatic transmission gear shift selector"),
    ("auto-usata-per-neopatentati-gpl", "Opel Corsa LPG car"),
    ("auto-usate-4x4-fuoristrada-economici", "Suzuki Jimny offroad 4x4"),
    ("auto-usata-con-gancio-traino", "Car towing caravan trailer"),
    ("auto-usata-per-citta-citycar", "Smart Fortwo city car street"),
    ("auto-usate-con-bassi-consumi", "Eco driving dashboard fuel consumption"),
    ("auto-usata-per-cani-e-animali", "Golden retriever dog in car trunk"),
    ("auto-usata-garanzia-12-mesi-copertura", "Service booklet car key fob"),
    ("auto-usata-sito-annunci-sicurezza", "Browsing laptop online web shopping"),
    ("auto-usata-chilometri-illimitati", "Volvo 240 high mileage odometer"),
    ("auto-usata-per-lavoro-agenti", "Business sedan highway motorway"),
    ("auto-usata-acquisto-online-consegna", "Tow truck car delivery vehicle")
]

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/1.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                ii = p.get('imageinfo', [{}])[0]
                u = ii.get('url')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime', '')
                if u and w >= 800 and 'jpeg' in mime.lower():
                    return {'title': p.get('title'), 'url': u, 'w': w, 'h': h}
    except Exception as e:
        pass
    return None

results = {}
for i, (slug, q) in enumerate(ARTICLES, 1):
    res = search_wikimedia(q)
    if not res:
        # Fallback simpler query
        words = q.split()[:2]
        res = search_wikimedia(" ".join(words))
    
    if res:
        results[slug] = res
        print(f"{i:2d}/43. [{slug}] -> {res['title'][:40]} ({res['w']}x{res['h']})")
    else:
        print(f"{i:2d}/43. [{slug}] -> NOT FOUND")
    time.sleep(0.1)

with open('scripts/wikimedia_found_43.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print(f"Total found: {len(results)}/43")
