import glob
import os
from PIL import Image

files = glob.glob('scripts/unsplash_cache/*.jpg')
print(f"Total in unsplash_cache: {len(files)}")
for f in sorted(files):
    sz_kb = os.path.getsize(f) // 1024
    with Image.open(f) as im:
        print(f"{sz_kb:4d} KB | {im.size} | {os.path.basename(f)}")
