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
                    if w >= 600 and h >= 350:
                        results.append((full, f, w, h, size_kb))
            except Exception:
                pass

with open('scripts/all_brain_images.txt', 'w', encoding='utf-8') as out:
    for full, name, w, h, sz in sorted(results, key=lambda x: x[1]):
        out.write(f"{sz:4d} KB | {w:4d}x{h:<4d} | {name} | {full}\n")

print(f"Wrote {len(results)} images to scripts/all_brain_images.txt")
