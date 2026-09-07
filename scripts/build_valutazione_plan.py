import json
import os

with open('scripts/valutazione_detailed.json', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Total articles to map: {len(articles)}")
for i, a in enumerate(articles, 1):
    print(f"[{i:02d}] {a['slug']}: {a['title']}")
