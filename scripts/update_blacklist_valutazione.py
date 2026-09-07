import re
import json

with open('scripts/build_truly_unique_valutazione.py', encoding='utf-8') as f:
    code = f.read()

val_bases = []
for line in code.splitlines():
    if '"path":' in line or '"wiki_title":' in line:
        m = re.search(r'"(?:path|wiki_title)":\s*r?"([^"]+)"', line)
        if m:
            val_bases.append(m.group(1).split('\\')[-1].split('/')[-1])

blacklist = json.load(open('scripts/blacklist_bases.json', encoding='utf-8'))
print(f"Current blacklist: {len(blacklist)}")
print(f"Valutazione bases: {len(val_bases)}")
combined = sorted(list(set(blacklist + val_bases)))
print(f"Combined unique bases: {len(combined)}")
with open('scripts/blacklist_bases.json', 'w', encoding='utf-8') as f:
    json.dump(combined, f, indent=2)
print("Updated scripts/blacklist_bases.json successfully!")
