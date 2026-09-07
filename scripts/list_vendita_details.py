import json
import os

vend = json.load(open('scripts/vendita_articles.json', encoding='utf-8'))
for i, a in enumerate(vend, 1):
    slug = a['slug']
    p = os.path.join("apps/web/public/images/guide", f"{slug}.jpg")
    sz = os.path.getsize(p)//1024 if os.path.exists(p) else 0
    print(f"{i:2d}. [{slug}] ({sz} KB)")
    print(f"    Title: {a['title']}")
    print(f"    Desc:  {a['description'][:85]}...")
