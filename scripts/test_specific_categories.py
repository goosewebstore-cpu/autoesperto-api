import urllib.request
import urllib.parse
import json

CATEGORIES_TO_TEST = [
    "Category:Automobile keys",
    "Category:Car detailing",
    "Category:Automobile repair shops",
    "Category:Automobile damage",
    "Category:Automobile instrument clusters",
    "Category:Electric vehicle charging",
    "Category:Liquefied petroleum gas dispensers",
    "Category:Towbars",
    "Category:Dogs in automobiles",
    "Category:Used car dealerships",
    "Category:Car haulers",
    "Category:Motor vehicle inspection"
]

for cat in CATEGORIES_TO_TEST:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat)}&gcmtype=file&gcmlimit=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (automotive editorial; info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\n{cat} ({len(pages)} items):")
            for pid, p in pages.items():
                title = p.get('title', '')
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if 'image' in mime:
                    print(f"  * {title} [{w}x{h}, {mime}]")
    except Exception as e:
        print(f"Error {cat}: {e}")
