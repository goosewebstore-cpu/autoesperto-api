import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def test_titles(titles):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(titles)}&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode('utf-8'))
    for p in d['query']['pages'].values():
        ii = p.get('imageinfo', [{}])[0]
        print(f"{p['title']} -> {ii.get('width')}x{ii.get('height')}")

# search shock absorber
url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=shock%20absorber%20coilover%20filetype:bitmap&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read().decode('utf-8'))
for p in d.get('query', {}).get('pages', {}).values():
    ii = p.get('imageinfo', [{}])[0]
    print(f"SHOCK: {p['title']} ({ii.get('width')}x{ii.get('height')})")
