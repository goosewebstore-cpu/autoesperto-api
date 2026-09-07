import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

items = re.findall(r'\{\s*"slug":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"description":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"', text)

vendita = [item for item in items if item[3] == 'vendita']
print(f"Total vendita articles: {len(vendita)}")

vendita_data = []
for i, (slug, title, desc, cat) in enumerate(vendita, 1):
    # Also find image
    m_img = re.search(r'\"slug\":\s*\"' + re.escape(slug) + r'\"[\s\S]*?\"image\":\s*\"([^\"]+)\"', text)
    img = m_img.group(1) if m_img else f"/images/guide/{slug}.jpg"
    vendita_data.append({
        'slug': slug,
        'title': title,
        'description': desc,
        'category': cat,
        'image': img
    })
    print(f"{i:2d}. [{slug}]")
    print(f"    Title: {title}")
    print(f"    Image: {img}")

with open('scripts/vendita_articles.json', 'w', encoding='utf-8') as f:
    json.dump(vendita_data, f, indent=2, ensure_ascii=False)

print("\nSaved to scripts/vendita_articles.json")
