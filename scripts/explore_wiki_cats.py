import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

CATEGORIES_TO_EXPLORE = {
    "candele": ["Spark plugs", "Glow plugs"],
    "cuscinetti": ["Ball bearings", "Wheel hubs", "Automobile wheel bearings", "Bearings"],
    "clima": ["Automobile air conditioning", "Air conditioning repair", "Air conditioning equipment"],
    "olio": ["Motor oil", "Oil changes", "Automobile oil filters", "Lubricants"],
    "chiavi": ["Car keys", "Ignition keys", "Remote keyless systems"],
    "cruscotto": ["Automobile speedometers", "Automobile dashboards", "Automobile digital instruments", "Automobile instrument clusters"],
    "interni_lusso": ["Mercedes-Benz W222 interior", "Mercedes-Benz W223 interior", "Audi A8 D5 interior", "BMW G11 interior"],
    "dealership": ["Used car lots", "Automobile dealerships", "Car dealerships in Germany"],
    "affidabile": ["Mercedes-Benz W124", "Mercedes-Benz W201", "Toyota Land Cruiser (J100)"],
    "fisco_documenti": ["Calculators on desks", "Tax forms", "Banknotes of the European Union with documents", "Euro banknotes and documents"]
}

def get_cat_files(cat_name, limit=30):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat_name)}&cmtype=file&cmlimit={limit}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'] for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

def get_file_info(titles):
    if not titles: return []
    # chunk by 50
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote('|'.join(titles[:40]))}&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            valid = []
            for p in pages.values():
                t = p.get('title', '')
                base = t.replace('File:', '').strip()
                if base in blacklist: continue
                if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']): continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                u = ii.get('url', '')
                if w >= 1200 and h >= 700 and w >= h:
                    valid.append((t, base, w, h, u))
            return valid
    except Exception as e:
        print(f"Error {e}")
        return []

for topic, cats in CATEGORIES_TO_EXPLORE.items():
    print(f"\n==================== {topic.upper()} ====================")
    for c in cats:
        files = get_cat_files(c, 30)
        valid = get_file_info(files)
        print(f"Category '{c}': {len(files)} files, {len(valid)} landscape valid")
        for t, b, w, h, u in valid[:3]:
            print(f"   -> {b} ({w}x{h})")
