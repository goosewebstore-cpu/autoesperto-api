import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

guides_blocks = re.findall(r'(\{\s*"slug":\s*"[^"]+"[\s\S]*?\n  \})', text)

valutazione = []
for b in guides_blocks:
    cat_m = re.search(r'"category":\s*"([^"]+)"', b)
    if cat_m and cat_m.group(1) == 'valutazione':
        slug_m = re.search(r'"slug":\s*"([^"]+)"', b)
        title_m = re.search(r'"title":\s*"([^"]+)"', b)
        desc_m = re.search(r'"description":\s*"([^"]+)"', b)
        img_m = re.search(r'"image":\s*"([^"]+)"', b)
        content_m = re.search(r'"content":\s*"([^"]+)"', b)
        valutazione.append({
            'slug': slug_m.group(1) if slug_m else '',
            'title': title_m.group(1) if title_m else '',
            'desc': desc_m.group(1) if desc_m else '',
            'image': img_m.group(1) if img_m else '',
            'content': content_m.group(1)[:400] if content_m else ''
        })

print(f"Total articles in VALUTAZIONE: {len(valutazione)}")
with open('scripts/valutazione_articles.json', 'w', encoding='utf-8') as f:
    json.dump(valutazione, f, indent=2, ensure_ascii=False)

for i, a in enumerate(valutazione, 1):
    print(f"\n{i:02d}. [{a['slug']}]")
    print(f"    TITLE: {a['title']}")
    print(f"    DESC : {a['desc']}")
    print(f"    IMAGE: {a['image']}")
    print(f"    SAMPLE: {a['content'][:150]}...")
