import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

cats = [
    "Car keys",
    "Car dealerships",
    "Speedometers",
    "Dashboard",
    "Car interior",
    "Spark plugs",
    "Mercedes-Benz W124"
]

def list_cat(cat_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(cat_name)}&gcmtype=file&gcmlimit=50&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=12) as resp:
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
                if w >= 1200 and h >= 700 and w > h:
                    valid.append((t, base, w, h, u))
            return valid
    except Exception as e:
        print(f"Error {e}")
        return []

for c in cats:
    print(f"\nCategory: {c}")
    items = list_cat(c)
    print(f"Found {len(items)} valid landscape images:")
    for t, b, w, h, u in items[:5]:
        print(f"   {b} ({w}x{h})")
