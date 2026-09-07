import os
import json
import re

with open('scripts/build_truly_unique_vendita.py', encoding='utf-8') as f:
    code = f.read()

# Parse the mapping exactly
lines = code.splitlines()
in_map = False
mapping = {}
cur_slug = None
for l in lines:
    if "MAPPING_VENDITA = {" in l:
        in_map = True
        continue
    if in_map and l.startswith("}"):
        break
    if in_map:
        m_s = re.search(r'"([a-z0-9-]+)":\s*\{', l)
        if m_s:
            cur_slug = m_s.group(1)
        m_f = re.search(r'"file":\s*os\.path\.join\(([^,]+),\s*"([^"]+)"\)', l)
        if m_f and cur_slug:
            mapping[cur_slug] = (m_f.group(1), m_f.group(2))

print(f"Parsed {len(mapping)} articles in vendita:")
for slug, (folder, fn) in mapping.items():
    print(f"  {slug:45s} -> {fn}")
