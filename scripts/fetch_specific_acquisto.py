import urllib.request
import urllib.parse
import json
import os
import time

TARGETS = {
    "auto-usata-per-cani-e-animali": ["Dog in car seat", "Dog car window", "Dog in car boot", "Golden retriever car"],
    "auto-usata-con-gancio-traino": ["Car towing trailer", "Car towing caravan", "Vehicle towing trailer"],
    "auto-usata-sito-annunci-sicurezza": ["Laptop online shopping", "Browsing laptop car", "Laptop computer screen"],
    "auto-usata-acquisto-online-consegna": ["Car carrier truck trailer", "Car transporter truck", "Tow truck car"],
    "chilometri-scalati-auto-usata-truffa": ["OBD2 scanner car", "OBD-II vehicle diagnostic", "Car odometer gauge"],
    "acquisto-auto-con-fermo-amministrativo": ["Official rubber stamp document", "Legal stamp document", "Notary seal document"],
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": ["QR code smartphone screen", "Scanning QR code phone", "Digital certificate smartphone"],
    "auto-usata-garanzia-12-mesi-copertura": ["Car keys on document", "Car keys desk contract", "Vehicle warranty handbook"],
    "finanziamento-auto-usata-conviene": ["Calculator euro contract", "Financial calculator document", "Bank loan calculation"],
    "auto-usata-per-lavoro-agenti": ["Highway motorway driving car", "Autobahn driving car", "Motorway driving"],
    "auto-usata-per-citta-citycar": ["Smart Fortwo street", "Smart ForTwo urban", "Fiat 500 city parking"],
    "auto-usate-con-bassi-consumi": ["Toyota Prius hybrid", "Hybrid car eco", "Eco driving meter"],
    "come-capire-se-auto-usata-incidentata": ["Car accident damage dent", "Damaged car bumper", "Car body dent repair"]
}

CACHE_DIR = "scripts/accurate_cache/acquisto"
os.makedirs(CACHE_DIR, exist_ok=True)

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/2.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '').lower()
                if any(bad in title for bad in ['flag', 'map', 'coat_of_arms', 'logo', 'icon', 'symbol', 'coin']):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                u = ii.get('url')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime', '')
                if u and w >= 900 and h >= 500 and 'jpeg' in mime.lower():
                    ratio = w / h
                    if 1.0 <= ratio <= 2.2:
                        return (u, w, h, p.get('title'))
    except Exception as e:
        pass
    return None

for slug, q_list in TARGETS.items():
    dest = os.path.join(CACHE_DIR, f"{slug}.jpg")
    found = None
    for q in q_list:
        found = search_wikimedia(q)
        if found:
            break
        time.sleep(0.1)
    if found:
        u, w, h, t = found
        req = urllib.request.Request(u, headers={'User-Agent': 'AutoEspertoTool/2.0 (info@autoesperto.it)'})
        try:
            with urllib.request.urlopen(req) as r:
                data = r.read()
                with open(dest, 'wb') as f:
                    f.write(data)
                print(f"FOUND & DOWNLOADED [{slug}]: {t[:40]} ({w}x{h})")
        except Exception as e:
            print(f"FAILED [{slug}]: {e}")
    else:
        print(f"NOT FOUND [{slug}]")
    time.sleep(0.1)

print("Finished specific target fetch.")
