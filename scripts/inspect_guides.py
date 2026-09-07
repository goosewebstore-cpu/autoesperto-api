import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's extract each object in the array
# We can find blocks separated by { "slug": ... }
guide_blocks = re.split(r'\n\s*\{\s*\n?\s*"slug":\s*', text)
print(f"Blocks found: {len(guide_blocks)-1}")

results = []
for block in guide_blocks[1:]:
    slug_match = re.search(r'^"([^"]+)"', block)
    title_match = re.search(r'"title":\s*"([^"]+)"', block)
    cat_match = re.search(r'"category":\s*"([^"]+)"', block)
    img_match = re.search(r'"image":\s*"([^"]+)"', block)
    feat_match = re.search(r'"featured":\s*(true|false)', block)
    
    slug = slug_match.group(1) if slug_match else "UNKNOWN"
    title = title_match.group(1) if title_match else "UNKNOWN"
    cat = cat_match.group(1) if cat_match else "UNKNOWN"
    img = img_match.group(1) if img_match else "UNKNOWN"
    feat = feat_match.group(1) if feat_match else "false"
    
    results.append({
        "slug": slug,
        "title": title,
        "category": cat,
        "image": img,
        "featured": feat == "true"
    })

print(f"Parsed {len(results)} guides.")
print("\n--- FIRST 25 GUIDES ---")
for i, r in enumerate(results[:25]):
    print(f"{i+1:2d}. [{r['category']}] (feat:{r['featured']}) {r['slug']}")
    print(f"    Image: {r['image']}")
    print(f"    Title: {r['title']}")

with open('scratch_guides_parsed.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
