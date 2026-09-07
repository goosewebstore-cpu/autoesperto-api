import os
import json
from PIL import Image

with open('scripts/parsed_73_articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

guide_dir = "apps/web/public/images/guide"

print("--- ACQUISTO AUDIT ---")
for a in data['acquisto']:
    slug = a['slug']
    path = os.path.join(guide_dir, f"{slug}.jpg")
    if os.path.exists(path):
        sz = os.path.getsize(path) // 1024
        im = Image.open(path)
        print(f"[{slug}] ({sz} KB, {im.size}) - {a['title']}")
    else:
        print(f"[{slug}] MISSING! - {a['title']}")

print("\n--- VENDITA AUDIT ---")
for a in data['vendita']:
    slug = a['slug']
    path = os.path.join(guide_dir, f"{slug}.jpg")
    if os.path.exists(path):
        sz = os.path.getsize(path) // 1024
        im = Image.open(path)
        print(f"[{slug}] ({sz} KB, {im.size}) - {a['title']}")
    else:
        print(f"[{slug}] MISSING! - {a['title']}")
