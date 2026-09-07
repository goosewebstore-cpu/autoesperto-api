import os
from PIL import Image

guide_dir = r"apps\web\public\images\guide"
files = [f for f in os.listdir(guide_dir) if f.endswith(".jpg") or f.endswith(".png")]

print(f"Total guide images: {len(files)}")

# Group by size range or inspect pixel characteristics
small_programmatic = []
photo_like = []

for f in sorted(files):
    p = os.path.join(guide_dir, f)
    size = os.path.getsize(p)
    # The programmatic canvas ones are typically between 70,000 and 90,000 bytes
    # Let's check sample pixel at (900, 300) - in the programmatic ones it is usually the big colored circle
    try:
        im = Image.open(p)
        # Check if it has a flat circle background
        # Programmatic canvas: let's test specific coordinates
        px = im.getpixel((1000, 300))
        # In programmatic, right side has a giant circle or solid gradient
        if 70000 <= size <= 89000:
            small_programmatic.append((f, size))
        else:
            photo_like.append((f, size))
    except Exception as e:
        print(f"Error {f}: {e}")

print(f"Programmatic canvas covers count: {len(small_programmatic)}")
print(f"Photo-like covers count: {len(photo_like)}")

print("\n--- SAMPLE PROGRAMMATIC COVERS ---")
for f, s in small_programmatic[:15]:
    print(f"  {f} ({s} bytes)")

print("\n--- SAMPLE PHOTO-LIKE COVERS ---")
for f, s in photo_like[:15]:
    print(f"  {f} ({s} bytes)")
