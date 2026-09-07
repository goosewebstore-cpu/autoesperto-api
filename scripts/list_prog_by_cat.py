import os
import json

with open('scratch_guides_parsed.json', 'r', encoding='utf-8') as f:
    guides = json.load(f)

guide_dir = r"apps\web\public\images\guide"

prog_guides = []
for g in guides:
    img_name = os.path.basename(g['image'])
    img_path = os.path.join(guide_dir, img_name)
    if os.path.exists(img_path):
        size = os.path.getsize(img_path)
        if 70000 <= size <= 89000:
            prog_guides.append(g)

print(f"Total programmatic guides: {len(prog_guides)}")

# Let's inspect by category
by_cat = {}
for g in prog_guides:
    c = g['category']
    by_cat.setdefault(c, []).append(g)

for c, glist in by_cat.items():
    print(f"\n--- Category: {c} ({len(glist)} guides) ---")
    for g in glist[:10]:
        print(f"  * {g['slug']}")
        print(f"    Title: {g['title']}")
