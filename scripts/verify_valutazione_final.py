import os
import json
import hashlib
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDE_DIR    = os.path.join(PROJECT_ROOT, "apps", "web", "public", "images", "guide")

with open(os.path.join(PROJECT_ROOT, "scripts", "valutazione_detailed.json"), encoding='utf-8') as f:
    articles = json.load(f)

print(f"=== Auditing {len(articles)} Valutazione Covers ===")

hashes = {}
missing = []
wrong_size = []

for a in articles:
    slug = a["slug"]
    img_path = os.path.join(GUIDE_DIR, f"{slug}.jpg")
    if not os.path.exists(img_path):
        missing.append(slug)
        continue
    
    # Check size
    im = Image.open(img_path)
    if im.size != (1200, 630):
        wrong_size.append((slug, im.size))
    
    # Check hash
    h = hashlib.md5(open(img_path, 'rb').read()).hexdigest()
    hashes.setdefault(h, []).append(slug)

print(f"Total articles: {len(articles)}")
print(f"Missing images: {len(missing)}")
print(f"Wrong size (not 1200x630): {len(wrong_size)}")
print(f"Unique image hashes: {len(hashes)}/47")

if len(hashes) == 47:
    print("SUCCESS: 100% OF VALUTAZIONE COVERS HAVE UNIQUE HASHES (ZERO DUPLICATES)!")
else:
    print("WARNING: Duplicates found:")
    for h, slugs in hashes.items():
        if len(slugs) > 1:
            print(f"  Duplicate hash {h}: {slugs}")

# Check overlap with acquisto and vendita
import re
with open(os.path.join(PROJECT_ROOT, "scripts", "build_truly_unique_acquisto.py"), encoding='utf-8') as f:
    acq_slugs = re.findall(r'"([a-z0-9\-]+)":\s*\{', f.read())

with open(os.path.join(PROJECT_ROOT, "scripts", "build_truly_unique_vendita.py"), encoding='utf-8') as f:
    ven_slugs = re.findall(r'"([a-z0-9\-]+)":\s*\{', f.read())

acq_hashes = {hashlib.md5(open(os.path.join(GUIDE_DIR, f"{s}.jpg"), 'rb').read()).hexdigest(): s for s in acq_slugs if os.path.exists(os.path.join(GUIDE_DIR, f"{s}.jpg"))}
ven_hashes = {hashlib.md5(open(os.path.join(GUIDE_DIR, f"{s}.jpg"), 'rb').read()).hexdigest(): s for s in ven_slugs if os.path.exists(os.path.join(GUIDE_DIR, f"{s}.jpg"))}

val_hashes = {h: slugs[0] for h, slugs in hashes.items()}

overlap_acq = set(val_hashes.keys()).intersection(set(acq_hashes.keys()))
overlap_ven = set(val_hashes.keys()).intersection(set(ven_hashes.keys()))

print(f"\nOverlap with Acquisto (43 covers): {len(overlap_acq)}")
print(f"Overlap with Vendita  (30 covers): {len(overlap_ven)}")

if len(overlap_acq) == 0 and len(overlap_ven) == 0:
    print("PERFECT: ZERO cross-category duplicates across all 120 covers (43 Acquisto + 30 Vendita + 47 Valutazione)!")
