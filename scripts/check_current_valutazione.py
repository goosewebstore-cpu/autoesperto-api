import json
import os
from PIL import Image

with open('scripts/valutazione_articles.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

guide_dir = "apps/web/public/images/guide"

print(f"Total articles in Valutazione: {len(articles)}")
exists_count = 0
for i, a in enumerate(articles, 1):
    slug = a['slug']
    path = os.path.join(guide_dir, f"{slug}.jpg")
    exists = os.path.exists(path)
    if exists:
        exists_count += 1
        im = Image.open(path)
        sz = os.path.getsize(path) // 1024
        print(f"[{exists_count:02d}] {slug} -> {sz} KB, size: {im.size} | {a['title']}")
    else:
        print(f"[MISSING] {slug} | {a['title']}")

print(f"\nSummary: {exists_count}/{len(articles)} images exist on disk")
