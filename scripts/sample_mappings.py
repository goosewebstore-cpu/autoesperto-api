import json
from test_mapping_distribution import match_guide

with open('scratch_guides_parsed.json', 'r', encoding='utf-8') as f:
    guides = json.load(f)

print("Sample mappings:")
for g in guides[20:60]:
    source, tag = match_guide(g)
    print(f"  [{source:18}] ({tag:22}) -> {g['slug']}")
