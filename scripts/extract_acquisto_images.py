import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

with open('scripts/acquisto_articles.json', 'r', encoding='utf-8') as f:
    acq = json.load(f)

for item in acq:
    slug = item['slug']
    m = re.search(r'\"slug\":\s*\"' + re.escape(slug) + r'\"[\s\S]*?\"image\":\s*\"([^\"]+)\"', text)
    if m:
        item['image'] = m.group(1)
    else:
        item['image'] = f'/images/guide/{slug}.jpg'

with open('scripts/acquisto_articles_with_images.json', 'w', encoding='utf-8') as f:
    json.dump(acq, f, indent=2, ensure_ascii=False)

print(f"Mapped {len(acq)} articles.")
for i, item in enumerate(acq, 1):
    print(f"{i:2d}. {item['slug']} -> {item['image']}")
