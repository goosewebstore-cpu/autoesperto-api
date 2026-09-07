import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_12 = {
    "multijet_13": ["Fiat 1.3 Multijet engine bay", "Fiat Panda 1.3 Multijet", "Fiat Punto Multijet engine"],
    "bluehdi_15": ["Peugeot 1.5 BlueHDi", "Peugeot 308 BlueHDi", "Citroen C4 BlueHDi"],
    "cvt_jatco": ["Nissan Xtronic CVT transmission", "CVT transmission cutaway automobile", "Jatco transmission"],
    "turbo_3cil": ["Ford 1.0 EcoBoost 3 cylinder engine bay", "Renault 0.9 TCe engine", "3 cylinder turbo engine automobile"],
    "adblue_psa": ["AdBlue injector Peugeot", "Citroen BlueHDi AdBlue", "Selective catalytic reduction exhaust car"],
    "gpl_valvole": ["Autogas LPG toroidal tank", "LPG Autogas conversion engine", "LPG Fill and AFL valves apart.JPG"],
    "metano_cng": ["Audi A3 g-tron", "Volkswagen Golf TGI", "Natural gas vehicle CNG tank"],
    "marchi_affidabilita": ["Car dealership showroom cars", "Car brand logos automotive", "Automobile dealership modern cars"],
    "sospensioni_aria": ["Air suspension bellows car", "Mercedes Airmatic strut", "Air spring suspension automobile"],
    "centraline_ecu": ["Engine control unit ECU circuit board", "Car ECU circuit board", "Automotive ECU PCB"],
    "volano_monomassa": ["Clutch disc friction lining", "Clutch plate torsion springs", "Flywheel clutch assembly"],
    "ev_motore_inverter": ["Nissan Leaf electric motor inverter", "Electric vehicle drive unit motor", "BMW i3 electric drive unit"]
}

def search_clean(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=8&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            hits = []
            for p in pages.values():
                title = p.get('title', '')
                base = title.replace("File:", "").strip()
                if base in blacklist:
                    continue
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1100 and h >= 650:
                    hits.append((title, w, h))
            return hits
    except Exception as e:
        return []

for k, q_list in SEARCH_12.items():
    print(f"\n=== {k} ===")
    for q in q_list:
        h = search_clean(q)
        if h:
            print(f"  Q: '{q}'")
            for t, w, h_sz in h[:2]:
                print(f"     -> {t} ({w}x{h_sz})")
            break
