import urllib.request
import urllib.parse
import json

def search_files(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=4&prop=imageinfo&iiprop=url|size|mime&format=json"
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

test_queries = [
    'panoramic sunroof car interior',
    'alloy wheel rim car',
    'leather car seats upholstery',
    'towbar car trailer hitch',
    'car audio speaker harman kardon OR bose',
    'ADAS camera car windshield',
    'macpherson strut car suspension',
    'car timing chain engine',
    'paint thickness gauge car',
    'headlight restoration cloudy car',
    'tyre tread depth gauge',
    'service book stamped car',
    'automatic transmission gear shifter car',
    'german license plate car'
]

for q in test_queries:
    search_files(q)
