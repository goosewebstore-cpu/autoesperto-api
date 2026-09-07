import os
import urllib.request
from PIL import Image

cache_dir = "scripts/atto_vendita_cache"
os.makedirs(cache_dir, exist_ok=True)
dest = os.path.join(cache_dir, "Legal_Contract_Signature_Warm_Tones.jpg")

url = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Legal_Contract_%26_Signature_-_Warm_Tones.jpg"
req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
with urllib.request.urlopen(req, timeout=30) as resp:
    data = resp.read()
    with open(dest, 'wb') as f:
        f.write(data)

im = Image.open(dest)
print(f"Downloaded {len(data)//1024} KB. Image size: {im.size}")
