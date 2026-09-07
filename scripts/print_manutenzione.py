import json

man = json.load(open('scripts/manutenzione_articles.json', encoding='utf-8'))
print(f"=== MANUTENZIONE ({len(man)} articles) ===")
for i, a in enumerate(man, 1):
    print(f"{i:2d}. [{a['slug']}]\n    Title: {a['title']}\n    Desc:  {a['description'][:90]}...")
