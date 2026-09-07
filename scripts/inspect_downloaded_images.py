import os
import glob
from PIL import Image

cache_dirs = [
    "scripts/verified_cache/acquisto",
    "scripts/verified_cache/vendita"
]

for d in cache_dirs:
    print(f"\n=== DIRECTORY: {d} ===")
    for f in sorted(glob.glob(os.path.join(d, "*.jpg"))):
        name = os.path.basename(f)
        try:
            im = Image.open(f)
            sz_kb = os.path.getsize(f) // 1024
            exif = im.getexif()
            desc = exif.get(0x010e, '').strip()
            print(f"[{name}] {im.size} ({sz_kb} KB) | Desc: {desc[:50]}")
        except Exception as e:
            print(f"[{name}] ERROR: {e}")
