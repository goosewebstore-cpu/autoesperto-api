import json
import re

with open('scripts/valutazione_articles.json', encoding='utf-8') as f:
    slugs_list = [a['slug'] for a in json.load(f)]

with open('apps/web/src/lib/guides.ts', encoding='utf-8') as f:
    content = f.read()

# Let's extract each guide block
# We can find where 'export const guides: Guide[] = [' starts
start_idx = content.find('export const guides: Guide[] = [')
if start_idx == -1:
    print("Could not find start")
    exit(1)

# Let's inspect articles by searching for each slug in guides.ts
articles_full = []
for slug in slugs_list:
    pos = content.find(f'"slug": "{slug}"')
    if pos == -1:
        print(f"Could not find slug: {slug}")
        continue
    # find title
    m_title = re.search(r'"title":\s*"([^"]+)"', content[pos:pos+1000])
    title = m_title.group(1) if m_title else ""
    
    # find description
    m_desc = re.search(r'"description":\s*"([^"]+)"', content[pos:pos+2000])
    desc = m_desc.group(1) if m_desc else ""
    
    # find section headings
    # look up to 25000 characters ahead or up to next "slug": "
    next_slug_pos = content.find('"slug": "', pos + 20)
    end_pos = next_slug_pos if next_slug_pos != -1 else pos + 30000
    guide_chunk = content[pos:end_pos]
    
    headings = re.findall(r'"heading":\s*"([^"]+)"', guide_chunk)
    # grab first paragraph or two
    paras = re.findall(r'"paragraphs":\s*\[\s*"([^"]+)"', guide_chunk)
    
    articles_full.append({
        'slug': slug,
        'title': title,
        'description': desc,
        'headings': headings,
        'first_para': paras[0] if paras else ""
    })

print(f"Extracted {len(articles_full)} articles.")

with open('scripts/valutazione_detailed.json', 'w', encoding='utf-8') as f:
    json.dump(articles_full, f, indent=2, ensure_ascii=False)

for i, a in enumerate(articles_full, 1):
    print(f"\n--- [{i:02d}] {a['slug']} ---")
    print(f"TITLE: {a['title']}")
    print(f"DESC:  {a['description']}")
    print(f"HEADINGS: {' | '.join(a['headings'][:4])}")
