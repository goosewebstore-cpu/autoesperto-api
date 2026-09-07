import urllib.request
import urllib.parse
import json

def test_cat(cat_name):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat_name)}&gcmtype=file&gcmlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/2.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\n--- CATEGORY: {cat_name} ({len(pages)} files) ---")
            for pid, p in pages.items():
                ii = p.get('imageinfo', [{}])[0]
                print(f"  * {p.get('title')} [{ii.get('width')}x{ii.get('height')}, {ii.get('mime')}]")
    except Exception as e:
        print(f"Error in {cat_name}: {e}")

test_cat('Category:Car keys')
test_cat('Category:Automobile keys')
test_cat('Category:Automobile detailing')
test_cat('Category:Car wash')
test_cat('Category:Damaged automobiles')
test_cat('Category:Automobile mechanics')
test_cat('Category:Vehicles in auctions')
