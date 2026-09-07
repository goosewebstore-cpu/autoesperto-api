import json

with open('scripts/valutazione_detailed.json', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Total articles in Valutazione: {len(articles)}")
for i, a in enumerate(articles, 1):
    print(f"=== [{i:02d}] {a['slug']} ===")
    print(f"Title: {a['title']}")
    print(f"Desc:  {a['description']}")
    print(f"Headings: {a['headings']}")
    print()
