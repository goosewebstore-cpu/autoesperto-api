import re
import json

with open('apps/web/src/lib/guides.ts', encoding='utf-8') as f:
    text = f.read()

chunks = text.split('"slug": "')
guides = []
for c in chunks[1:]:
    slug = c.split('"')[0]
    m_cat = re.search(r'"category":\s*"([^"]+)"', c)
    m_title = re.search(r'"title":\s*"([^"]+)"', c)
    m_desc = re.search(r'"description":\s*"([^"]+)"', c)
    cat = m_cat.group(1) if m_cat else 'unknown'
    title = m_title.group(1) if m_title else ''
    desc = m_desc.group(1) if m_desc else ''
    guides.append({'slug': slug, 'category': cat, 'title': title, 'description': desc})

print(f"Total guides: {len(guides)}")
cats = {}
for g in guides:
    cats.setdefault(g['category'], []).append(g)

for c, glist in sorted(cats.items()):
    print(f"  {c}: {len(glist)} articles")

# Save manutenzione and affidabilita to json
with open('scripts/manutenzione_articles.json', 'w', encoding='utf-8') as f:
    json.dump(cats.get('manutenzione', []), f, indent=2, ensure_ascii=False)

with open('scripts/affidabilita_articles.json', 'w', encoding='utf-8') as f:
    json.dump(cats.get('affidabilita', []), f, indent=2, ensure_ascii=False)

print("\nSaved scripts/manutenzione_articles.json and scripts/affidabilita_articles.json")
