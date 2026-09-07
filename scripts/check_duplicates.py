import hashlib, os, glob
from collections import defaultdict
import json

guide_dir = 'apps/web/public/images/guide'

with open('scripts/parsed_73_articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

acq_slugs = {a['slug'] for a in data['acquisto']}
ven_slugs = {a['slug'] for a in data['vendita']}

# We want to check perceptual or exact duplicates
# Also check base image sources
from check_perfect_acquisto import PERFECT_ACQUISTO
from build_truly_unique_vendita import MAPPING_VENDITA

print("=== CHECKING BASE IMAGE REUSE IN ACQUISTO ===")
acq_files = defaultdict(list)
for slug, item in PERFECT_ACQUISTO.items():
    acq_files[item['file']].append(slug)

for f, slugs in acq_files.items():
    if len(slugs) > 1:
        print(f"REUSED IN ACQUISTO ({len(slugs)}): {os.path.basename(f)} -> {slugs}")

print("\n=== CHECKING BASE IMAGE REUSE IN VENDITA ===")
ven_files = defaultdict(list)
for slug, item in MAPPING_VENDITA.items():
    ven_files[item['file']].append(slug)

for f, slugs in ven_files.items():
    if len(slugs) > 1:
        print(f"REUSED IN VENDITA ({len(slugs)}): {os.path.basename(f)} -> {slugs}")

print("\n=== CHECKING OVERLAP BETWEEN ACQUISTO AND VENDITA ===")
overlap = set(acq_files.keys()) & set(ven_files.keys())
print(f"Number of overlapping base images: {len(overlap)}")
for f in overlap:
    print(f"OVERLAP: {os.path.basename(f)}")
    print(f"  Acquisto: {acq_files[f]}")
    print(f"  Vendita : {ven_files[f]}")
