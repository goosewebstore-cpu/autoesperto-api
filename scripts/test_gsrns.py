import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=circolazione%20veicolo&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read().decode('utf-8'))
for p in d.get('query', {}).get('pages', {}).values():
    ii = p.get('imageinfo', [{}])[0]
    t = p['title']
    print(f"{t} -> {ii.get('width')}x{ii.get('height')}")
