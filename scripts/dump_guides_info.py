import re
import json

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse all guides
raw_guides = re.findall(r'\{\s*"slug":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"description":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"', text)

acquisto = [g for g in raw_guides if g[3] == 'acquisto']
vendita = [g for g in raw_guides if g[3] == 'vendita']

print(f"Acquisto: {len(acquisto)} | Vendita: {len(vendita)}")

with open('scripts/full_guides_info.json', 'w', encoding='utf-8') as f:
    json.dump({
        'acquisto': [{'slug': s, 'title': t, 'desc': d} for s, t, d, _ in acquisto],
        'vendita': [{'slug': s, 'title': t, 'desc': d} for s, t, d, _ in vendita]
    }, f, indent=2, ensure_ascii=False)
