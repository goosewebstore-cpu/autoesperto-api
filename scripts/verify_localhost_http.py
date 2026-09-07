import urllib.request
import json
import os
from PIL import Image

with open('scripts/parsed_73_articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Verifying all 43 ACQUISTO and 30 VENDITA guide covers on disk and localhost...")

BASE_URL = "http://localhost:3000/images/guide"

disk_ok = 0
http_ok = 0

all_articles = data['acquisto'] + data['vendita']

for i, a in enumerate(all_articles, 1):
    slug = a['slug']
    disk_path = os.path.join("apps", "web", "public", "images", "guide", f"{slug}.jpg")
    
    # Check disk
    if not os.path.exists(disk_path):
        print(f"[DISK MISSING] {slug}")
        continue
    
    im = Image.open(disk_path)
    sz = os.path.getsize(disk_path) // 1024
    if im.size != (1200, 630):
        print(f"[SIZE WRONG] {slug} -> {im.size}")
        continue
    disk_ok += 1

    # Check localhost HTTP
    url = f"{BASE_URL}/{slug}.jpg"
    try:
        req = urllib.request.Request(url, method='HEAD')
        with urllib.request.urlopen(req, timeout=3) as resp:
            if resp.status == 200:
                http_ok += 1
            else:
                print(f"[HTTP {resp.status}] {slug}")
    except Exception as e:
        print(f"[HTTP ERROR] {slug}: {e}")

print(f"\nDISK VERIFICATION : {disk_ok}/{len(all_articles)} valid (1200x630)")
print(f"HTTP VERIFICATION : {http_ok}/{len(all_articles)} returned HTTP 200 on localhost")
