import urllib.request
import urllib.parse
import json

def search_files(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\n=== Query: {q} ({len(pages)} files) ===")
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                url = ii.get('url')
                print(f"  {w}x{h} | {title}")
    except Exception as e:
        print('Error:', e)

queries = [
    'intitle:"Lancia Ypsilon" filetype:bitmap',
    'intitle:"Peugeot 208" filetype:bitmap',
    'intitle:"Citroën C3" filetype:bitmap',
    'intitle:"Toyota Yaris" filetype:bitmap',
    'intitle:"Ford Fiesta" filetype:bitmap',
    'intitle:"Volkswagen Golf" filetype:bitmap',
    'intitle:"Dacia Duster" filetype:bitmap',
    'intitle:"Alfa Romeo Giulietta" filetype:bitmap',
    'intitle:"Jeep Renegade" filetype:bitmap',
    'intitle:"Fiat Panda" filetype:bitmap',
    'intitle:"Fiat 500" filetype:bitmap'
]

for q in queries:
    search_files(q)
