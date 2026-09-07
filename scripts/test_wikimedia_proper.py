import urllib.request
import urllib.parse
import json

def search_wikimedia(query):
    # Search for bitmap images in File namespace (6)
    q = f"{query} filetype:bitmap"
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/1.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title')
                ii = p.get('imageinfo', [{}])[0]
                url = ii.get('url')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime')
                if url and w >= 800 and 'jpeg' in mime.lower():
                    results.append({'title': title, 'url': url, 'width': w, 'height': h})
            return results
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

print("Testing Fiat 500 search:")
res = search_wikimedia("Fiat 500 street")
for r in res:
    print(r)

print("Testing Car Odometer search:")
res2 = search_wikimedia("Car odometer dashboard")
for r in res2:
    print(r)
