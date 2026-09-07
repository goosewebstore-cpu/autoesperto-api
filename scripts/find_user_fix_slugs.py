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
    guides.append({
        'slug': slug,
        'cat': m_cat.group(1) if m_cat else '',
        'title': m_title.group(1) if m_title else ''
    })

keywords = [
    ("bollo auto sicilia", ["bollo-auto-sicilia", "straccia-bollo"]),
    ("profilo auto digitale", ["profilo-auto-digitale"]),
    ("10 fattori valore", ["valore-residuo-auto-usata-fattori"]),
    ("passaggio di proprieta", ["passaggio-proprieta", "tra-parenti"]),
    ("doppia chiave", ["doppia-chiave"]),
    ("vendita tra privati", ["garanzia-tra-privati"]),
    ("trattativa prezzo", ["trattativa-prezzo"]),
    ("svalutazione", ["svalutazione-auto-usata-anno-per-anno"]),
    ("visura pra", ["visura-pra"]),
    ("incidenza chilometri", ["incidenza-chilometri"]),
    ("optional", ["incidenza-optional"]),
    ("perdono piu valore", ["perdono-piu-valore"]),
    ("cambio olio motore", ["cambio-olio-motore"]),
    ("climatizzatore non raffredda", ["climatizzatore-auto-non-raffredda"]),
    ("candele d'accensione", ["candele-e-candelette"]),
    ("cuscinetto ruota", ["cuscinetti-ruota"]),
    ("superare 300.000", ["300000-km-indistruttibili"])
]

print("=== MATCHED ARTICLES ===")
found_slugs = []
for label, kw_list in keywords:
    matches = [g for g in guides if any(kw in g['slug'] for kw in kw_list)]
    print(f"\n{label.upper()}:")
    for m in matches:
        print(f"  [{m['cat']}] {m['slug']} -> {m['title']}")
        found_slugs.append(m['slug'])

print(f"\nTotal slugs identified: {len(found_slugs)}")
