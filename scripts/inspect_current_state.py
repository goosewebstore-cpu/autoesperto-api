import json
import os

with open('scripts/full_guides_info.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
acquisto = data['acquisto']
vendita = data['vendita']

print(f"Acquisto: {len(acquisto)} articles")
print(f"Vendita: {len(vendita)} articles")

print("\n--- ACQUISTO SAMPLES ---")
for g in acquisto:
    slug = g['slug']
    title = g['title']
    img = g.get('image', '')
    disk_path = os.path.join('apps', 'web', 'public', img.lstrip('/'))
    exists = os.path.exists(disk_path)
    size = os.path.getsize(disk_path) if exists else 0
    print(f"[{exists}] {slug} -> {img} ({size} bytes) | Title: {title}")

print("\n--- VENDITA SAMPLES ---")
for g in vendita:
    slug = g['slug']
    title = g['title']
    img = g.get('image', '')
    disk_path = os.path.join('apps', 'web', 'public', img.lstrip('/'))
    exists = os.path.exists(disk_path)
    size = os.path.getsize(disk_path) if exists else 0
    print(f"[{exists}] {slug} -> {img} ({size} bytes) | Title: {title}")
