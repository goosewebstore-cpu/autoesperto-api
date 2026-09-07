import urllib.request
import urllib.parse
import json

def get_cat_members(cat_title, limit=8):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat_title)}&gcmnamespace=6&gcmlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                if ii.get('mime') in ['image/jpeg', 'image/png']:
                    results.append({
                        'title': title,
                        'w': ii.get('width', 0),
                        'h': ii.get('height', 0),
                        'url': ii.get('url')
                    })
            return results
    except Exception as e:
        print(f"Error for {cat_title}: {e}")
        return []

cats = [
    "Category:Automobile wheels",
    "Category:Car audio",
    "Category:Automobile interiors",
    "Category:Automobile dashboards",
    "Category:Automobile transmissions",
    "Category:Automobile headlights",
    "Category:Sunroofs",
    "Category:Vehicle registration plates of Italy",
    "Category:Tow hitches",
    "Category:Tire tread",
    "Category:Automobile suspension components"
]

for c in cats:
    members = get_cat_members(c, 5)
    print(f"\n=== {c} ({len(members)} images) ===")
    for m in members:
        print(f"  {m['w']}x{m['h']} | {m['title']}")
