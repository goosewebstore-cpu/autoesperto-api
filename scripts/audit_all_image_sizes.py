import os
from PIL import Image

# Let's inspect all 194 images in apps/web/public/images/guide
PUBLIC_DIR = "apps/web/public/images/guide"
files = [f for f in os.listdir(PUBLIC_DIR) if f.endswith('.jpg')]
print(f"Total guide images on disk: {len(files)}")

# Check file sizes
too_small = []
for f in files:
    sz = os.path.getsize(os.path.join(PUBLIC_DIR, f)) // 1024
    if sz < 40:
        too_small.append((f, sz))

print(f"Images smaller than 40KB: {len(too_small)}")
for f, sz in too_small:
    print(f"  {f}: {sz} KB")
