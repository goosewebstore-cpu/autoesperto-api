import urllib.request
import urllib.parse
import json

queries = [
    "Volkswagen Golf Mk7",
    "Renault Clio IV",
    "Ford Fiesta 2018",
    "Audi A4 B9",
    "BMW 3er F30",
    "Toyota Yaris hybrid",
    "Car dashboard speedometer",
    "Modern car engine bay",
    "Electric car charging station",
    "Car keys document"
]

def search_wikimedia(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/1.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                ii = p.get('imageinfo', [{}])[0]
                url = ii.get('url')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                mime = ii.get('mime', '')
                if url and w >= 1000 and 'jpeg' in mime.lower():
                    return {'query': query, 'title': p.get('title'), 'url': url, 'w': w, 'h': h}
    except Exception as e:
        pass
    return None

for q in queries:
    res = search_wikimedia(q)
    if res:
        print(f"FOUND for '{q}': {res['title']} ({res['w']}x{res['h']})")
        print(f"  URL: {res['url'][:80]}...")
    else:
        print(f"NO RESULT for '{q}'")
