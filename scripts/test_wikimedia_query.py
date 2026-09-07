import urllib.request
import urllib.parse
import json

def test_query(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/2.0 (editorial auto platform; contact info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\n--- QUERY: {query} ({len(pages)} results) ---")
            for pid, p in pages.items():
                title = p.get('title', '')
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime', '')
                u = ii.get('url', '')
                print(f"  * {title} [{w}x{h}, {mime}]")
    except Exception as e:
        print(f"Failed query '{query}': {e}")

test_query("Renault Clio IV front")
test_query("Damaged car bumper crash")
test_query("Car keys on table")
test_query("Car detailing polishing")
test_query("Electric vehicle charging plug")
