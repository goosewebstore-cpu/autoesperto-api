import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def check_cat(cat_name):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(cat_name)}&gcmtype=file&gcmlimit=50&prop=imageinfo&iiprop=url|size&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0'})
    try:
        d = json.loads(urllib.request.urlopen(req, timeout=12).read().decode('utf-8'))
        pages = d.get('query', {}).get('pages', {})
        print(f"\n--- Category: {cat_name} ({len(pages)} files) ---")
        for p in pages.values():
            ii = p.get('imageinfo', [{}])[0]
            w, h = ii.get('width', 0), ii.get('height', 0)
            t = p.get('title', '')
            if w >= 1200 and h >= 700 and w > h:
                print(f"  {w}x{h} : {t}")
    except Exception as e:
        print(f"Error {e}")

check_cat('Contracts')
check_cat('Signatures on documents')
check_cat('Handshakes in business')
check_cat('Negotiation')
check_cat('Automotive repair shops')
