import urllib.request
import re
import os
import glob
import json

cache_dir = "scripts/unsplash_cache"
photos = [os.path.basename(f)[:-4] for f in glob.glob(os.path.join(cache_dir, "*.jpg"))]

results = {}
for pid in sorted(photos):
    url = f"https://unsplash.com/photos/{pid}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    try:
        with urllib.request.urlopen(req) as r:
            html = r.read().decode('utf-8', errors='ignore')
            # Look for title
            m = re.search(r'<title>([^<]+)</title>', html)
            title = m.group(1).replace(' | Download Free Images on Unsplash', '').strip() if m else ''
            results[pid] = title
            print(f"{pid}: {title}")
    except Exception as e:
        results[pid] = f"Error: {e}"
        print(f"{pid}: Error: {e}")

with open("scripts/unsplash_titles.json", "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
