import os
from check_perfect_acquisto import PERFECT_ACQUISTO

for i, (k, v) in enumerate(PERFECT_ACQUISTO.items(), 1):
    f = v['file']
    print(f"{i:2d}. {k}: {os.path.basename(f)}")
