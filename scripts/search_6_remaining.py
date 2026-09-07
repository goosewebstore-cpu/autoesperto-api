import urllib.request
import urllib.parse
import json
import os
import sys

headers = {'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'}

queries = {
    'wheel_bearing': [
        'wheel bearing',
        'Radlager',
        'roulement a billes',
        'Kugellager',
        'tapered roller bearing',
        'Kegelrollenlager'
    ],
    'tax_calc': [
        'calculator pen euro document',
        'calculator and pen on desk',
        'tax form calculator',
        'euro calculator',
        'calculator invoice'
    ],
    'handshake_deal': [
        'handshake deal car',
        'handshake customer business',
        'business handshake agreement'
    ],
    'depreciation_graph': [
        'financial chart screen',
        'business analytics graph',
        'economic graph screen'
    ],
    'visura_pra': [
        'tablet car diagnostics',
        'mechanic tablet diagnostic',
        'vehicle inspection tablet'
    ]
}

blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

results = {}
for cat, qlist in queries.items():
    print(f"=== {cat} ===")
    results[cat] = []
    for q in qlist:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=8&prop=imageinfo&iiprop=url|size&format=json"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode('utf-8'))
                pages = data.get('query', {}).get('pages', {})
                for p in pages.values():
                    t = p.get('title', '')
                    base = t.replace('File:', '').strip()
                    if not any(base.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png']):
                        continue
                    if base in blacklist:
                        continue
                    ii = p.get('imageinfo', [{}])[0]
                    w = ii.get('width', 0)
                    h = ii.get('height', 0)
                    u = ii.get('url', '')
                    if w >= 1200 and h >= 600 and w > h:
                        print(f"  [{q}] {base} ({w}x{h})")
                        results[cat].append({
                            'title': t,
                            'base': base,
                            'width': w,
                            'height': h,
                            'url': u
                        })
        except Exception as e:
            print(f"  error on {q}: {e}")

with open('scripts/search_6_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
print("Done! Saved to scripts/search_6_results.json")
