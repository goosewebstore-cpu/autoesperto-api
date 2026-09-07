import os
import glob
from PIL import Image

search_dirs = [
    'scripts/unsplash_cache',
    'scripts/accurate_cache/acquisto',
    'apps/web/public',
    'apps/web/public/images/guide',
    r'C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9',
    r'C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55',
    r'C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b',
    r'C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01',
    r'C:\Users\noizz\.gemini\antigravity-ide\brain\43ac82ea-2c78-4093-9740-96372755aff5',
]

all_images = []
for d in search_dirs:
    if not os.path.exists(d):
        continue
    for ext in ['*.jpg', '*.png', '*.webp', '*.jpeg']:
        for f in glob.glob(os.path.join(d, ext)):
            if 'tempmedia' in f or 'test_imgs' in f or 'guide' in f:
                continue
            all_images.append(f)

print(f"Total raw source images found: {len(all_images)}")
for p in sorted(all_images):
    try:
        im = Image.open(p)
        exif = im.getexif()
        desc = exif.get(0x010e, '')
        name = os.path.basename(p)
        print(f"[{os.path.basename(os.path.dirname(p))}] {name} - {im.size} - {desc[:50]}")
    except Exception as e:
        pass
