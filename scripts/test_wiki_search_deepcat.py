import urllib.request
import urllib.parse
import json

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\n=== {q} ({len(pages)}) ===")
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                w = ii.get('width')
                h = ii.get('height')
                print(f"  {w}x{h} | {title}")
    except Exception as e:
        print('Error:', e)

search('deepcat:"Automobile wheels" filetype:bitmap')
search('deepcat:"Tow hitches" filetype:bitmap')
search('deepcat:"Automobile transmissions" filetype:bitmap')
search('deepcat:"Automobile suspensions" filetype:bitmap')
search('deepcat:"Vehicle registration plates of Italy" filetype:bitmap')
