import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

guides_blocks = re.findall(r'(\{\s*"slug":\s*"[^"]+"[\s\S]*?\n  \})', text)

articles = []
for b in guides_blocks:
    slug = re.search(r'"slug":\s*"([^"]+)"', b)
    cat = re.search(r'"category":\s*"([^"]+)"', b)
    title = re.search(r'"title":\s*"([^"]+)"', b)
    desc = re.search(r'"description":\s*"([^"]+)"', b)
    content = re.search(r'"content":\s*"([^"]+)"', b)
    
    if slug and cat:
        articles.append({
            'slug': slug.group(1),
            'cat': cat.group(1),
            'title': title.group(1) if title else '',
            'desc': desc.group(1) if desc else '',
            'content_sample': (content.group(1)[:200] if content else '')
        })

acquisto = [a for a in articles if a['cat'] == 'acquisto']
vendita = [a for a in articles if a['cat'] == 'vendita']

with open('scripts/parsed_73_articles.json', 'w', encoding='utf-8') as f:
    json.dump({'acquisto': acquisto, 'vendita': vendita}, f, indent=2, ensure_ascii=False)

print(f"Saved {len(acquisto)} acquisto and {len(vendita)} vendita articles to scripts/parsed_73_articles.json")
