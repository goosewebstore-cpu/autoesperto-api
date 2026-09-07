import re
import os

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

guides_blocks = re.findall(r'(\{\s*"slug":\s*"[^"]+"[\s\S]*?\n  \})', text)
print(f'Total guide blocks: {len(guides_blocks)}')

acquisto_list = []
vendita_list = []

for b in guides_blocks:
    slug_m = re.search(r'"slug":\s*"([^"]+)"', b)
    title_m = re.search(r'"title":\s*"([^"]+)"', b)
    cat_m = re.search(r'"category":\s*"([^"]+)"', b)
    img_m = re.search(r'"image":\s*"([^"]+)"', b)
    
    slug = slug_m.group(1) if slug_m else ''
    title = title_m.group(1) if title_m else ''
    cat = cat_m.group(1) if cat_m else ''
    img = img_m.group(1) if img_m else ''
    
    item = {'slug': slug, 'title': title, 'category': cat, 'image': img}
    if cat == 'acquisto':
        acquisto_list.append(item)
    elif cat == 'vendita':
        vendita_list.append(item)

print(f"Acquisto: {len(acquisto_list)}")
print(f"Vendita: {len(vendita_list)}")

print("\n--- ACQUISTO (all) ---")
for item in acquisto_list:
    img_path = item['image']
    disk_file = os.path.join('apps/web/public', img_path.lstrip('/'))
    exists = os.path.exists(disk_file)
    sz = os.path.getsize(disk_file) if exists else 0
    print(f"{item['slug']} -> {img_path} | exists: {exists} ({sz} bytes) | title: {item['title']}")

print("\n--- VENDITA (all) ---")
for item in vendita_list:
    img_path = item['image']
    disk_file = os.path.join('apps/web/public', img_path.lstrip('/'))
    exists = os.path.exists(disk_file)
    sz = os.path.getsize(disk_file) if exists else 0
    print(f"{item['slug']} -> {img_path} | exists: {exists} ({sz} bytes) | title: {item['title']}")
