import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def get_cat_files(cat, limit=6):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat)}&gcmnamespace=6&gcmlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\n=== {cat} ({len(pages)} files) ===")
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime', '')
                if w >= 1200 and h >= 600:
                    print(f"  {w}x{h} | {title}")
    except Exception as e:
        print(f"Error: {e}")

get_cat_files("Category:Mazda MX-5 (ND)", 5)
get_cat_files("Category:Steering wheels", 5)
get_cat_files("Category:Financial charts", 5)
get_cat_files("Category:Revenue stamps of Italy", 5)
get_cat_files("Category:Vehicle registration plates of Germany in 2020", 5)
get_cat_files("Category:BMW G20", 5)
