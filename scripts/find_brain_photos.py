import os
from PIL import Image

brain_base = r'C:\Users\noizz\.gemini\antigravity-ide\brain'
results = []
for root, dirs, files in os.walk(brain_base):
    for f in files:
        if f.lower().endswith(('.jpg', '.png', '.webp')) and not f.startswith('.'):
            full = os.path.join(root, f)
            try:
                with Image.open(full) as im:
                    w, h = im.size
                    size_kb = os.path.getsize(full) // 1024
                    if w >= 800 and h >= 400: # high-res landscape
                        results.append((full, f, w, h, size_kb))
            except Exception:
                pass

print(f"Total suitable landscape images: {len(results)}")
for full, name, w, h, sz in sorted(results, key=lambda x: x[1]):
    print(f"{sz:4d} KB | {w}x{h} | {name} | {full}")
