import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

def get_cat_members(cat):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(cat)}&gcmtype=file&gcmlimit=50&prop=imageinfo&iiprop=url|size&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0'})
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = d.get('query', {}).get('pages', {})
        results = []
        for p in pages.values():
            t = p.get('title', '')
            base = t.replace('File:', '').strip()
            if base in blacklist: continue
            ii = p.get('imageinfo', [{}])[0]
            w, h = ii.get('width', 0), ii.get('height', 0)
            u = ii.get('url', '')
            if w >= 1200 and h >= 700 and w > h:
                results.append((t, base, w, h, u))
        return results
    except Exception as e:
        print(f"Error on {cat}: {e}")
        return []

cats = [
    'Automobile keys with remote control',
    'Automobile keys',
    'Key fobs',
    'Wheel hubs',
    'Automobile wheel bearings'
]

for c in cats:
    print(f"\nCategory: {c}")
    items = get_cat_members(c)
    print(f"Found {len(items)} items:")
    for t, b, w, h, u in items:
        print(f"  {w}x{h} : {b}")
