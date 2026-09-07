import json

data = json.load(open('scripts/manutenzione_search_hits.json', encoding='utf-8'))
man = json.load(open('scripts/manutenzione_articles.json', encoding='utf-8'))

for i, a in enumerate(man, 1):
    slug = a['slug']
    hits = data.get(slug, [])
    print(f"{i:2d}. [{slug}] ({len(hits)} hits)")
    if hits:
        for h in hits[:2]:
            print(f"    -> {h['base']} ({h['width']}x{h['height']})")
    else:
        print("    -> NO HITS YET")
