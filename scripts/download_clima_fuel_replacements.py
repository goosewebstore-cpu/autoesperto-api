import os
import urllib.request
from PIL import Image

cache_dir = "scripts/manutenzione_cache"
os.makedirs(cache_dir, exist_ok=True)

targets = [
    ("golf_interior.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/55/Volkswagen_Golf_7_%28before_facelift%29_interior_-_GTD_version.jpg"),
    ("fuel_station_refueling.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/38/Filling_station_refueling_a_car.jpg")
]

for fn, url in targets:
    dest = os.path.join(cache_dir, fn)
    print(f"Downloading {fn}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
        with open(dest, 'wb') as f:
            f.write(data)
    im = Image.open(dest)
    print(f"  -> {fn}: size {im.size}, {len(data)//1024} KB")
