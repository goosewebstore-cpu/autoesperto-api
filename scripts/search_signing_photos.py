import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCH_SIGN = [
    "Signing contract document pen desk",
    "Signing vehicle sales agreement",
    "Hand signing contract pen document",
    "Signing official agreement pen",
    "Contract signing desk pen"
]

def search_sign(q):
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
                if w >= 1200 and h >= 700:
                    hits.append((title, base, w, h, ii.get('url', '')))
            return hits
    except Exception as e:
        return []

for q in SEARCH_SIGN:
    print(f"\n--- '{q}' ---")
    h = search_sign(q)
    for t, b, w, h_sz, u in h[:4]:
        print(f"   -> {t} ({w}x{h_sz})")
