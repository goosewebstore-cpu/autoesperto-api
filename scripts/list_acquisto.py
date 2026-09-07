import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match each guide
# Look for blocks starting with {"slug": ...} or similar
items = re.findall(r'\{\s*"slug":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"description":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"', text)

print(f"Total parsed articles: {len(items)}")
acquisto = [item for item in items if item[3] == 'acquisto']
print(f"Acquisto count: {len(acquisto)}")

for i, (slug, title, desc, cat) in enumerate(acquisto, 1):
    print(f"{i:2d}. [{slug}]")
    print(f"    Title: {title}")
    print(f"    Desc:  {desc[:100]}...")

# Also let's save to a json for easy processing
with open('scripts/acquisto_articles.json', 'w', encoding='utf-8') as f:
    json.dump([{'slug': s, 'title': t, 'desc': d, 'category': c} for s, t, d, c in acquisto], f, indent=2, ensure_ascii=False)
