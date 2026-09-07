import re
import os

with open('scripts/build_truly_unique_acquisto.py', encoding='utf-8') as f:
    acq_code = f.read()

with open('scripts/build_truly_unique_vendita.py', encoding='utf-8') as f:
    ven_code = f.read()

# find all file names
acq_files = set(re.findall(r'os\.path\.join\([^)]+\)', acq_code))
ven_files = set(re.findall(r'os\.path\.join\([^)]+\)', ven_code))

print(f"Acquisto mapped files: {len(acq_files)}")
print(f"Vendita mapped files:  {len(ven_files)}")
overlap = acq_files.intersection(ven_files)
print(f"Overlap: {len(overlap)}")
for o in overlap:
    print(f"  OVERLAP: {o}")
