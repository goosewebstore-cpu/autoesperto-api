import os
import hashlib
import json

PUBLIC_DIR = "apps/web/public/images/guide"

man = json.load(open('scripts/manutenzione_articles.json', encoding='utf-8'))
aff = json.load(open('scripts/affidabilita_articles.json', encoding='utf-8'))

def analyze(name, articles):
    print(f"\n=== {name.upper()} ({len(articles)}) ===")
    hashes = {}
    missing = 0
    for a in articles:
        p = os.path.join(PUBLIC_DIR, f"{a['slug']}.jpg")
        if not os.path.exists(p):
            print(f"MISSING: {a['slug']}")
            missing += 1
            continue
        with open(p, 'rb') as f:
            h = hashlib.md5(f.read()).hexdigest()
        hashes.setdefault(h, []).append(a['slug'])
    
    unique_hashes = len(hashes)
    print(f"Total articles: {len(articles)}")
    print(f"Total files present: {len(articles) - missing}")
    print(f"Unique MD5 hashes: {unique_hashes}")
    duplicates = {h: slugs for h, slugs in hashes.items() if len(slugs) > 1}
    if duplicates:
        print(f"DUPLICATE GROUPS ({len(duplicates)}):")
        for h, slugs in duplicates.items():
            print(f"  Hash {h[:8]} shared by {len(slugs)} articles:")
            for s in slugs[:4]:
                print(f"    - {s}")
            if len(slugs) > 4:
                print(f"    ... and {len(slugs)-4} more")
    else:
        print("ALL UNIQUE!")

analyze("manutenzione", man)
analyze("affidabilita", aff)
