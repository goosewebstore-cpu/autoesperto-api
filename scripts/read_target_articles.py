import json
import re

with open('apps/web/src/lib/guides.ts', 'r', encoding='utf-8') as f:
    text = f.read()

guide_blocks = re.split(r'\n\s*\{\s*\n?\s*"slug":\s*', text)

targets = [
    "spie-cruscotto-auto-significato-colori",
    "quanto-vale-volkswagen-golf-usata",
    "cambio-olio-motore-ogni-quanti-km",
    "freni-auto-usurati-fischio-sostituzione",
    "batteria-auto-scarica-sintomi-sostituzione",
    "annuncio-auto-usata-perfetto-guida",
    "migliori-auto-neopatentati-usate-norme",
    "quanto-vale-jeep-renegade-usata",
    "quanto-vale-dacia-duster-usata",
    "quanto-vale-alfa-romeo-giulietta-usata",
    "turbina-motore-fischio-olio-fumo-blu",
    "motore-20-tdi-volkswagen-pompa-alta-pressione-cp4"
]

for block in guide_blocks[1:]:
    slug_match = re.search(r'^"([^"]+)"', block)
    if not slug_match:
        continue
    slug = slug_match.group(1)
    if slug in targets:
        title_match = re.search(r'"title":\s*"([^"]+)"', block)
        desc_match = re.search(r'"description":\s*"([^"]+)"', block)
        headings = re.findall(r'"heading":\s*"([^"]+)"', block)
        print("="*60)
        print(f"SLUG: {slug}")
        print(f"TITLE: {title_match.group(1) if title_match else ''}")
        print(f"DESC: {desc_match.group(1) if desc_match else ''}")
        print("HEADINGS:")
        for h in headings:
            print(f"  - {h}")
