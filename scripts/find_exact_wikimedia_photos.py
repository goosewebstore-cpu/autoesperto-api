import urllib.request
import urllib.parse
import json

TARGETS = {
    # Acquisto
    "auto-usata-per-cani-e-animali": ['"Dog in car"', '"Dog" sitting in car', '"Golden retriever" car'],
    "auto-usata-con-gancio-traino": ['Car towing trailer', 'Car with towbar', 'Caravan towing car'],
    "auto-elettrica-usata-autonomia-batteria": ['"Electric car charging"', '"EV charging station"', 'Tesla charging station'],
    "auto-usate-gpl-metano-conviene": ['"Autogas" LPG pump', '"LPG" dispenser nozzle', 'CNG filling station'],
    "come-capire-se-auto-usata-incidentata": ['"Car accident damage"', 'Damaged car bumper', 'Car collision damage'],
    "auto-usata-chilometri-illimitati": ['Mercedes W124 diesel', 'Volvo 240 estate', 'Mercedes W123'],
    "importare-auto-usata-germania-costi": ['Car carrier truck highway', 'Autotransporter truck', 'Car transporter trailer'],
    "aste-auto-usate-come-funzionano-rischi": ['Car auction lot', 'Automobile auction rows', 'Salvage auction cars'],
    "chilometri-scalati-auto-usata-truffa": ['OBD2 diagnostic scanner car', 'OBD-II vehicle diagnostic', 'Car diagnostic scanner'],
    "auto-usata-100000-km-conviene-comprare": ['Car speedometer 100000', 'Automobile speedometer cluster', 'Car instrument cluster modern'],
    "diesel-vs-ibrida-usata-confronto": ['Autobahn motorway traffic', 'Motorway highway traffic Europe', 'Highway driving cars'],
    "auto-ibride-usate-conviene-controlli": ['Toyota Yaris Hybrid', 'Toyota Auris Hybrid', 'Toyota Prius engine'],
    "auto-usata-per-famiglia-monovolume": ['Renault Scenic', 'Volkswagen Touran', 'Ford C-Max'],
    "auto-usate-con-bassi-consumi": ['Toyota Prius', 'Volkswagen Golf BlueMotion', 'Peugeot 208 diesel'],
    "caparra-acquisto-auto-usata-regole": ['Signing contract pen desk', 'Hand signing agreement document', 'Car contract signature'],
    "acquisto-auto-con-fermo-amministrativo": ['Official legal document stamp', 'Italian legal document stamp', 'Administrative document signature'],
    "auto-usata-garanzia-12-mesi-copertura": ['Car warranty booklet', 'Car service manual desk', 'Automobile handbook'],
    "auto-usata-sito-annunci-sicurezza": ['Laptop shopping website', 'Browsing laptop screen computer', 'Person using laptop desk'],
    "auto-usata-acquisto-online-consegna": ['Car delivery truck', 'Flatbed tow truck car', 'Vehicle transport delivery'],

    # Vendita
    "vendere-auto-usata-con-doppia-chiave": ['"Car key" remote', 'Automobile remote keys', 'BMW car key'],
    "preparare-auto-usata-alla-vendita": ['Car wash foam snow', 'Car detailing polishing machine', 'Washing car sponge'],
    "vendere-auto-usata-con-danni-carrozzeria": ['Car scratch repair', 'Car body polishing', 'Car paint repair'],
    "vendere-auto-usata-incidentata-o-fusa": ['Crashed car damaged tow truck', 'Wrecked car salvage', 'Broken car accident'],
    "vendere-auto-usata-con-impianto-gpl": ['LPG tank car trunk', 'Autogas tank toroidal', 'LPG gas system engine'],
    "vendere-auto-usata-d-epoca-valutazione": ['Alfa Romeo Spider classic', 'Fiat 500 classic vintage', 'Lancia Fulvia Coupe'],
    "vendere-auto-usata-storico-tagliandi": ['Car service booklet stamps', 'Vehicle maintenance book', 'Service book stamped'],
    "vendere-auto-usata-tra-parenti": ['Handing car keys handover', 'Car keys hand to hand', 'Passing car keys'],
    "consegna-auto-usata-verbale-passaggio": ['Vehicle handover checklist clipboard', 'Car delivery keys handover', 'Handover inspection car'],
    "vendere-auto-usata-garanzia-tra-privati": ['Contract agreement signing document', 'Signing contract table pen', 'Private sale agreement signature'],
    "vendere-auto-usata-con-finanziamento-in-corso": ['Finance loan calculator paperwork', 'Calculator financial contract', 'Bank loan paperwork pen'],
    "finanziamento-auto-usata-conviene": ['Calculator euro money finance', 'Loan contract finance euro', 'Financial calculation contract'],
    "vendere-auto-usata-di-societa-o-partita-iva": ['Business office laptop car keys', 'Corporate office paperwork keys', 'Business signing contract desk'],
    "vendere-auto-usata-con-fermo-fiscale": ['Tax document official stamp Italy', 'Legal document stamp seal', 'Official tax clearance certificate'],
    "vendere-auto-usata-all-estero-senza-iva": ['Customs border checkpoint Europe', 'International shipping container car', 'Freight customs border'],
    "vendere-auto-per-esportazione-estero": ['Car transit export plates', 'Car transporter border export', 'Truck carrying export cars'],
    "trattativa-prezzo-vendita-auto-usata": ['Buyer seller handshake car', 'Two people shaking hands car', 'Handshake agreement car dealership'],
    "vendere-auto-usata-a-compro-auto": ['Used car evaluation inspector tablet', 'Car appraiser vehicle inspection', 'Mechanic inspector checking car'],
    "vendere-auto-usata-all-asta-online": ['Online auction laptop bidding screen', 'Laptop screen website car auction', 'Online car bidding screen'],
    "annuncio-auto-usata-perfetto-guida": ['Photographing car smartphone outdoor', 'Taking photo car phone', 'Smartphone photo car'],
    "come-fissare-prezzo-vendita-auto": ['Car price appraisal smartphone', 'Evaluating car value phone', 'Car price valuation clipboard'],
    "permuta-auto-usata-conviene-calcolo": ['Dealership desk car keys exchange', 'Car dealership sales negotiation', 'Dealership customer handshake'],
    "pagamento-sicuro-vendita-auto-usata": ['Mobile banking transfer smartphone', 'Smartphone online banking app', 'Instant bank payment screen'],
    "vendere-auto-usata-in-conto-vendita": ['Car showroom dealer consignment', 'Luxury car dealership showroom', 'Dealership showroom floor cars'],
    "atto-di-vendita-auto-usata-autentica": ['Signing legal document notary desk', 'Official document signature stamp', 'Signing bill of sale desk']
}

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (automotive editorial; info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            candidates = []
            for pid, p in pages.items():
                title = p.get('title', '')
                t_lower = title.lower()
                # Skip historical / bad items
                if any(b in t_lower for b in ['190', '191', '192', '193', '194', '195', '196', '197', '198', 'ancient', 'antique', 'vintage_car', 'museum', 'statue', 'painting', 'drawing', 'stamp', 'coin', 'map', 'flag', 'logo', 'icon', 'seal', 'diagram', 'archive', 'dpla', 'prc', 'seattle', 'fbi']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                if 'jpeg' not in mime and 'jpg' not in mime:
                    continue
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w < 1000 or h < 600:
                    continue
                ratio = w / h
                if ratio < 1.1 or ratio > 2.3:
                    continue
                candidates.append((title, ii.get('url'), w, h))
            return candidates
    except Exception as e:
        return []

print(f"Testing queries for {len(TARGETS)} targets...")
found_map = {}
for slug, q_list in TARGETS.items():
    found = None
    for q in q_list:
        candidates = search_wikimedia(q)
        if candidates:
            found = candidates[0]
            break
    if found:
        t, u, w, h = found
        found_map[slug] = {'title': t, 'url': u, 'w': w, 'h': h}
        safe_t = t[:55].encode('ascii', 'replace').decode('ascii')
        print(f"FOUND: [{slug}] -> {safe_t} ({w}x{h})")
    else:
        print(f"NOT FOUND: [{slug}]")

with open('scripts/wikimedia_clean_found.json', 'w', encoding='utf-8') as f:
    json.dump(found_map, f, indent=2, ensure_ascii=False)

print(f"\nTotal clean found: {len(found_map)}/{len(TARGETS)}")
