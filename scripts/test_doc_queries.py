import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

queries = [
    'intitle:"Calculator" desk filetype:bitmap',
    'intitle:"Invoice" filetype:bitmap',
    'intitle:"Receipt" filetype:bitmap',
    'intitle:"Contract" signing filetype:bitmap',
    'intitle:"Handshake" business filetype:bitmap',
    'intitle:"Warranty" certificate filetype:bitmap',
    'intitle:"Graph" statistics filetype:bitmap',
    'intitle:"Chart" economic filetype:bitmap',
    'intitle:"Stamp" Italy revenue filetype:bitmap',
    'intitle:"F24" filetype:bitmap',
    'intitle:"Bollo" filetype:bitmap',
    'intitle:"Service" book car filetype:bitmap',
    'intitle:"Inspection" car mechanic filetype:bitmap'
]

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                results.append((title, ii.get('width', 0), ii.get('height', 0), ii.get('url', '')))
            return results
    except Exception as e:
        return []

for q in queries:
    res = search(q)
    print(f"\n=== {q} ===")
    for title, w, h, u in res:
        print(f"  {w}x{h} | {title}")
