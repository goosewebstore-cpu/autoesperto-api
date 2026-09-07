import urllib.request
import urllib.parse
import json
import re

FORBIDDEN_WORDS = [
    '190', '191', '192', '193', '194', '195', '196', '197', '198',
    'ancient', 'antique', 'vintage', 'historic', 'museum', 'monument',
    'statue', 'painting', 'drawing', 'sketch', 'stamp', 'coin', 'map',
    'flag', 'logo', 'icon', 'symbol', 'seal', 'diagram', 'archive', 'dpla',
    'prc', 'china', 'seattle', 'fbi', 'army', 'police_car', 'horse', 'carriage',
    'locomotive', 'railway', 'train', 'aircraft', 'airplane', 'boat', 'ship'
]

def search_clean_wikimedia(query, min_w=1200, min_h=600, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (automotive editorial; info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, p in pages.items():
                title = p.get('title', '')
                title_lower = title.lower()
                if any(bad in title_lower for bad in FORBIDDEN_WORDS):
                    continue
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                if 'jpeg' not in mime and 'jpg' not in mime:
                    continue
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w < min_w or h < min_h:
                    continue
                ratio = w / h
                if ratio < 1.1 or ratio > 2.3:
                    continue
                results.append({
                    'title': title,
                    'url': ii.get('url'),
                    'w': w,
                    'h': h,
                    'ratio': round(ratio, 2)
                })
            return results
    except Exception as e:
        print(f"Search failed for '{query}': {e}")
        return []

test_queries = [
    "Car keys modern",
    "Car collision damage bumper",
    "Car polishing detail",
    "Electric car charging station cable",
    "Car workshop vehicle lift",
    "LPG autogas dispenser nozzle",
    "Golden retriever car seat",
    "Car towing caravan trailer"
]

for q in test_queries:
    res = search_clean_wikimedia(q)
    print(f"\nQuery: '{q}' -> {len(res)} clean results")
    for r in res[:3]:
        print(f"  * {r['title']} ({r['w']}x{r['h']}, ratio {r['ratio']})")
