import os
import glob
from PIL import Image

unsplash_dir = "scripts/unsplash_cache"
files = sorted(glob.glob(os.path.join(unsplash_dir, "*.jpg")))
print(f"Total unsplash files: {len(files)}")

for f in files:
    name = os.path.basename(f)
    im = Image.open(f)
    print(f"{name} -> {im.size}")
