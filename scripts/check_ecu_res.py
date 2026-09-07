import urllib.request
import urllib.parse
import json

titles = "File:Bosch display car-electronics w start-stop 24405547331.jpg|File:ECU and wire bundles.JPG|File:2008-04-17 ECU.jpg|File:Audi electric motor control, Paris Motor Show 2018, Paris (1Y7A1113).jpg"
url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(titles)}&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read().decode('utf-8'))
for p in d['query']['pages'].values():
    ii = p.get('imageinfo', [{}])[0]
    print(f"{p['title']} -> {ii.get('width')}x{ii.get('height')}")
