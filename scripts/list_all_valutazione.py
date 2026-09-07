import json

with open('scripts/valutazione_articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total articles in VALUTAZIONE: {len(data)}")
for i, a in enumerate(data, 1):
    print(f"{i:02d}. [{a['slug']}] -> {a['title']}")
