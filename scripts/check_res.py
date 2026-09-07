import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

titles = "File:Automobile starter.JPG|File:Automobile starter 2.JPG|File:Démarreur d'une Renault 5.jpg|File:Iskra AZE 3508.JPG|File:Ventilated Plain (Smooth) Brake Rotor Parts.jpg|File:Alternator Out (16133831166).jpg"
url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(titles)}&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read().decode('utf-8'))
for p in d['query']['pages'].values():
    ii = p.get('imageinfo', [{}])[0]
    print(f"{p['title']} -> {ii.get('width')}x{ii.get('height')}")
