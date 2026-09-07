import urllib.request
import urllib.parse
import json
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

titles = [
    "File:Volkswagen Golf 7 (before facelift) interior - GTD version.jpg",
    "File:2019 Volkswagen e-Golf Automatic Interior.jpg",
    "File:Geneva Motor Show 2011 - Mercedes-Benz C-class Interior (5558487508).jpg",
    "File:Filling station refueling a car.jpg"
]

encoded = "|".join([urllib.parse.quote(t) for t in titles])
url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={encoded}&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read().decode('utf-8'))

for p in d['query']['pages'].values():
    ii = p.get('imageinfo', [{}])[0]
    print(f"{p['title']} ({ii.get('width')}x{ii.get('height')}) -> {ii.get('url')}")
