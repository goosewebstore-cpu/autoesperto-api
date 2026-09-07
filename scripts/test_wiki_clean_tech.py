import urllib.request
import urllib.parse
import json

def search_wikimedia(query, limit=5):
    # Add filetype:bitmap to ensure images only
    full_query = f"{query} filetype:bitmap"
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(full_query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoEditorial/3.0 (automotive research; https://autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                results.append({
                    'title': title,
                    'width': ii.get('width', 0),
                    'height': ii.get('height', 0),
                    'url': ii.get('url', '')
                })
            return results
    except Exception as e:
        print(f"Error for '{query}': {e}")
        return []

tests = [
    # Topic: panoramic roof
    'sunroof "car" glass',
    # Topic: alloy wheel
    'alloy wheel "car" rim',
    # Topic: leather seats
    'leather seat "interior" car',
    # Topic: towbar
    '"tow hitch" OR "towbar" car',
    # Topic: audio speakers
    'speaker car door Harman OR Bose',
    # Topic: ADAS
    'windshield camera sensor car',
    # Topic: suspension / strut
    'MacPherson strut spring car',
    # Topic: timing chain
    'timing chain engine',
    # Topic: headlights
    'headlight car lens',
    # Topic: automatic transmission
    'automatic gear selector car console',
    # Topic: odometer
    'car odometer speedometer km/h',
    # Topic: paint depth
    'coating thickness gauge car',
    # Topic: service booklet
    'service manual car maintenance'
]

for t in tests:
    res = search_wikimedia(t, 3)
    print(f"\n=== Query: {t} ({len(res)} results) ===")
    for r in res:
        print(f"  {r['width']}x{r['height']} | {r['title']}")
