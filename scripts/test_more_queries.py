import urllib.request
import urllib.parse
import json

queries = [
    'intitle:"LPG" car filetype:bitmap',
    'intitle:"Autogas" tank filetype:bitmap',
    'intitle:"handshake" deal filetype:bitmap',
    'intitle:"inspection" car vehicle filetype:bitmap',
    'intitle:"notarile" filetype:bitmap',
    'intitle:"invoice" business filetype:bitmap',
    'intitle:"auction" car vehicle filetype:bitmap',
    'intitle:"dealership" showroom cars filetype:bitmap',
    'intitle:"contract" signing signature filetype:bitmap',
    'intitle:"appraisal" car filetype:bitmap'
]

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\nQUERY: {q} ({len(pages)} results)")
            for pid, p in pages.items():
                title = p.get('title', '')
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                print(f"  * {title} [{w}x{h}, {mime}]")
    except Exception as e:
        print(f"Failed {q}: {e}")
