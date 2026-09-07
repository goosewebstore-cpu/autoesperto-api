import glob
import os
from PIL import Image

files = sorted(glob.glob("scripts/unsplash_cache/*.jpg"))
print(f"Total unsplash cached files: {len(files)}")

for f in files:
    name = os.path.basename(f)
    im = Image.open(f)
    sz_kb = os.path.getsize(f) // 1024
    print(f"{name:38s} | {im.size[0]}x{im.size[1]} | {sz_kb} KB")
