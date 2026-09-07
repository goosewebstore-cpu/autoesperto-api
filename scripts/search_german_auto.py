import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

TERMS = {
    "clima": ["Klimaservice Kfz", "Klimaanlage Auto", "Kältemittel R134a", "Klimaanlage Befüllung", "Air conditioning service manifold", "Automotive AC recharge"],
    "radlager": ["Radlager", "Radnabe Kfz", "Radlagerwechsel", "Wheel bearing replacement", "Automotive ball bearing", "Radlagerung"],
    "kaufvertrag": ["Kaufvertrag Auto", "Gebrauchtwagenkauf", "Autoverkauf", "Handschlag Auto", "Car sale agreement", "Autoverkauf Vertrag"],
    "steuer": ["Kfz-Steuer", "Finanzamt Formular", "Steuererklärung Rechner", "Taschenrechner Belege", "Rechnung Auto Werkstatt", "Calculator documents pen"],
    "tacho": ["Kombiinstrument digital", "Tachometer digital km", "Digitales Cockpit Auto", "Digital dashboard km/h"],
    "pra_check": ["Kfz-Zulassung Dokument", "Fahrzeugschein Auto", "Fahrzeugbrief", "TÜV Bericht", "Car title inspection"]
}

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = d.get('query', {}).get('pages', {})
        res = []
        for p in pages.values():
            t = p.get('title', '')
            base = t.replace('File:', '').strip()
            if base in blacklist: continue
            if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']): continue
            ii = p.get('imageinfo', [{}])[0]
            w, h = ii.get('width', 0), ii.get('height', 0)
            u = ii.get('url', '')
            if w >= 1200 and h >= 700 and w > h:
                res.append((t, base, w, h, u))
        return res
    except Exception as e:
        return []

found_all = {}
for topic, qlist in TERMS.items():
    print(f"\nSearching topic: {topic}")
    found = []
    for q in qlist:
        res = search(q)
        for h in res:
            if h[1] not in [x[1] for x in found]:
                found.append(h)
        if len(found) >= 4:
            break
    print(f"[{topic.upper()}] found {len(found)} candidates:")
    for t, b, w, h, u in found[:4]:
        print(f"  {w}x{h} : {b}")
    found_all[topic] = found

with open('scripts/german_search_hits.json', 'w', encoding='utf-8') as f:
    json.dump(found_all, f, indent=2)
