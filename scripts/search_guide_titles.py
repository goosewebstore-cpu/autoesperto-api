import re

guides_text = open('apps/web/src/lib/guides.ts', encoding='utf-8').read()

# Extract each guide block: title, slug, category, image
guide_blocks = re.findall(r'"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",[\s\S]*?"category":\s*"([^"]+)"', guides_text)

print(f"Total parsed guides: {len(guide_blocks)}")

keywords = [
    "bollo",
    "digitale",
    "fattori",
    "passaggio",
    "chiave",
    "manuali",
    "privati",
    "trattativa",
    "svalutazione",
    "visura",
    "chilometri",
    "optional",
    "perde",
    "perdono",
    "olio",
    "climatizzatore",
    "candele",
    "cuscinetto",
    "300.000",
    "superare"
]

for kw in keywords:
    print(f"\n=== KEYWORD: {kw} ===")
    for slug, title, cat in guide_blocks:
        if kw.lower() in title.lower() or kw.lower() in slug.lower():
            print(f"  [{cat:12s}] {slug} -> \"{title}\"")
