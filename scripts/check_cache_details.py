import os
import glob
from PIL import Image

cache_dir = "scripts/accurate_cache/acquisto"
files = sorted(glob.glob(os.path.join(cache_dir, "*.jpg")))

print(f"Total files in accurate_cache/acquisto: {len(files)}")
for f in files:
    name = os.path.basename(f)
    im = Image.open(f)
    print(f"{name} -> size: {im.size}, format: {im.format}")
