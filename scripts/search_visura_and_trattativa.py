import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'}
queries = [
    'OBD2 diagnostic scanner',
    'OBD diagnostic car',
    'diagnosegerat auto',
    'vehicle inspection document',
    'Zulassungsbescheinigung',
    'carte grise',
    'car title document',
    'handshake car customer',
    'car buying agreement'
]
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=6&prop=imageinfo&iiprop=url|size&format=json"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as r:
            d = json.loads(r.read().decode('utf-8'))
            for p in d.get('query', {}).get('pages', {}).values():
                ii = p.get('imageinfo', [{}])[0]
                w, h = ii.get('width', 0), ii.get('height', 0)
                t = p.get('title', '')
                base = t.replace('File:', '').strip()
                if base in blacklist:
                    continue
                if w >= 1200 and h >= 600 and w > h:
                    print(f"[{q}] -> {base} ({w}x{h})")
    except Exception as e:
        print(f"Error {e} on {q}")
