import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

queries = [
    'intitle:"EyeSight" filetype:bitmap',
    'intitle:"BMW G20" filetype:bitmap',
    'intitle:"Audi A4 B9" filetype:bitmap',
    'intitle:"Mercedes W205" filetype:bitmap',
    'intitle:"Fahrzeugschein" filetype:bitmap',
    'intitle:"Zulassungsbescheinigung Teil I" filetype:bitmap',
    'intitle:"steering wheel" "BMW" filetype:bitmap',
    'intitle:"steering wheel" "Audi" filetype:bitmap',
    'intitle:"steering wheel" "Volkswagen" filetype:bitmap',
    'intitle:"Speedometer" "km/h" filetype:bitmap',
    'intitle:"Serviceheft" filetype:bitmap',
    'intitle:"Wartungsplan" filetype:bitmap',
    'intitle:"Data visualization" filetype:bitmap',
    'intitle:"Artificial intelligence" screen filetype:bitmap'
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
