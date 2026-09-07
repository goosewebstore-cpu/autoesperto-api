import os
import json
import re

with open('scripts/build_truly_unique_vendita.py', encoding='utf-8') as f:
    text = f.read()

lines = text.splitlines()
in_mapping = False
cur_slug = None
mapping = {}
for l in lines:
    if "MAPPING_VENDITA = {" in l:
        in_mapping = True
        continue
    if in_mapping and l.startswith("}"):
        break
    if in_mapping:
        m_slug = re.search(r'"([a-z0-9-]+)":\s*\{', l)
        if m_slug:
            cur_slug = m_slug.group(1)
        m_file = re.search(r'"file":\s*([^,\n]+)', l)
        if m_file and cur_slug:
            mapping[cur_slug] = m_file.group(1).strip()

print(f"Total entries in MAPPING_VENDITA: {len(mapping)}")
for slug, f in mapping.items():
    print(f"{slug} -> {f}")
