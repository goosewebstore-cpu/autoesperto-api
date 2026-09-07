import urllib.request
import urllib.parse
import json

cats = [
    "Category:Contract signing",
    "Category:Handshakes",
    "Category:Automobile keys",
    "Category:Car washes",
    "Category:Motor vehicle inspection",
    "Category:Automobile damage",
    "Category:Used car dealerships",
    "Category:Automobile interiors"
]

for c in cats:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(c)}&gcmtype=file&gcmlimit=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            safe_c = c.encode('ascii', 'replace').decode('ascii')
            print(f"\n{safe_c} ({len(pages)} items):")
            for pid, p in pages.items():
                title = p.get('title', '')
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                safe_t = title.encode('ascii', 'replace').decode('ascii')
                print(f"  * {safe_t} [{w}x{h}, {mime}]")
    except Exception as e:
        print(f"Error {c}: {e}")
