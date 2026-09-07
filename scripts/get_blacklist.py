import re
import os

with open('scripts/build_truly_unique_acquisto.py', encoding='utf-8') as f:
    acq_text = f.read()

with open('scripts/build_truly_unique_vendita.py', encoding='utf-8') as f:
    ven_text = f.read()

# Extract all filenames (the last part of os.path.join)
used_in_acq = set(re.findall(r'os\.path\.join\([^)]+,\s*["\']([^"\']+\.jpg)["\']\)', acq_text))
used_in_ven = set(re.findall(r'os\.path\.join\([^)]+,\s*["\']([^"\']+\.jpg)["\']\)', ven_text))

all_used_bases = used_in_acq.union(used_in_ven)
print(f"Total base files used in Acquisto: {len(used_in_acq)}")
print(f"Total base files used in Vendita:  {len(used_in_ven)}")
print(f"Total unique used base files:      {len(all_used_bases)}")

with open('scripts/blacklist_bases.json', 'w', encoding='utf-8') as f:
    import json
    json.dump(sorted(list(all_used_bases)), f, indent=2)

for b in sorted(all_used_bases):
    print("  -", b)
