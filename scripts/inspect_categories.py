import json

with open('scratch_guides_parsed.json', 'r', encoding='utf-8') as f:
    guides = json.load(f)

print("Featured guides:")
for g in guides:
    if g['featured']:
        print(f"  [{g['category']}] {g['slug']} -> {g['image']} ({g['title']})")

# Let's see category distribution
cats = {}
for g in guides:
    c = g['category']
    cats[c] = cats.get(c, 0) + 1

print("\nCategories distribution:", cats)
