import os
import json
import hashlib
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(PROJECT_ROOT, "apps", "web", "public", "images", "guide")

# Check all images in IMG_DIR
files = [f for f in os.listdir(IMG_DIR) if f.endswith('.jpg')]
print(f"Total files: {len(files)}")

# Check aspect ratios and dimensions
bad_aspect = []
for f in files:
    p = os.path.join(IMG_DIR, f)
    with Image.open(p) as im:
        w, h = im.size
        if w != 1200 or h != 630:
            bad_aspect.append((f, w, h))

print(f"Images not 1200x630: {len(bad_aspect)}")
for f, w, h in bad_aspect:
    print(f"  {f}: {w}x{h}")
