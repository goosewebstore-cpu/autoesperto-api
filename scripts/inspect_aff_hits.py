import json

aff = json.load(open('scripts/affidabilita_articles.json', encoding='utf-8'))
hits = json.load(open('scripts/affidabilita_search_hits.json', encoding='utf-8'))

for i, a in enumerate(aff, 1):
    slug = a['slug']
    h_list = hits.get(slug, [])
    print(f"{i:2d}. [{slug}] ({len(h_list)} hits)")
    for h in h_list[:2]:
        print(f"    -> {h['base']} ({h['width']}x{h['height']})")
