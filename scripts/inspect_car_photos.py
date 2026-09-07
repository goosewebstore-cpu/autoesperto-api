import os
from PIL import Image

with open('scripts/all_brain_images.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f if line.strip()]

car_images = []
for l in lines:
    parts = l.split(' | ')
    if len(parts) == 4:
        sz, dim, name, path = parts
        if any(x in name.lower() for x in ['dish', 'restaurant', 'sample_branded']):
            continue
        car_images.append({
            'name': name,
            'dim': dim,
            'sz': sz,
            'path': path
        })

print(f"Total potential car photos: {len(car_images)}")
for i, img in enumerate(car_images, 1):
    print(f"{i:2d}. {img['dim']} | {img['name']} -> {img['path']}")
