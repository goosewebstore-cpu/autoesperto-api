import json
import sys

with open('scripts/valutazione_detailed.json', encoding='utf-8') as f:
    articles = json.load(f)

start = int(sys.argv[1]) if len(sys.argv) > 1 else 1
end = int(sys.argv[2]) if len(sys.argv) > 2 else len(articles)

for i in range(start - 1, end):
    a = articles[i]
    print(f"[{i+1:02d}] {a['slug']}")
    print(f"     Title: {a['title']}")
    print(f"     Desc:  {a['description']}")
    print()
