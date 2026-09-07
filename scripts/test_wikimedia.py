import urllib.request
import json

query = "used car inspection"
url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoTool/1.0 (info@autoesperto.it)'})

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        print(f"Found {len(pages)} pages")
        for pid, p in pages.items():
            title = p.get('title')
            ii = p.get('imageinfo', [{}])[0]
            print(f"- {title} | {ii.get('url')}")
except Exception as e:
    print(f"Error: {e}")
