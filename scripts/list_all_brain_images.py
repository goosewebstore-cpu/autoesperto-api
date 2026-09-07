import os

brain_dirs = [
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9",
    r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"
]

all_images = []
for b in brain_dirs:
    if os.path.exists(b):
        for f in os.listdir(b):
            if f.endswith(".jpg") or f.endswith(".png"):
                p = os.path.join(b, f)
                all_images.append((f, p, os.path.getsize(p)))

print(f"Total images found in brain directories: {len(all_images)}")
for f, p, s in sorted(all_images):
    print(f"  {f} ({s} bytes)")
