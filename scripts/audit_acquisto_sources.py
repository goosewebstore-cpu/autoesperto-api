import os
from check_perfect_acquisto import PERFECT_ACQUISTO

print("=== CHECKING ALL 43 ACQUISTO BASE IMAGES ===")
for i, (slug, item) in enumerate(PERFECT_ACQUISTO.items(), 1):
    f = item['file']
    print(f"{i:2d}/43. [{slug}]")
    print(f"     Source: {os.path.basename(f)}")
    print(f"     Tag   : {item['tag']}")
