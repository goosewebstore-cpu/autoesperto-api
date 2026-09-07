import urllib.request
import re
import glob
import os

files = glob.glob('scripts/unsplash_cache/*.jpg')
descriptions = {}

for f in files:
    pid = os.path.basename(f).replace('.jpg', '')
    url = f"https://unsplash.com/photos/{pid}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as r:
            html = r.read().decode('utf-8', errors='ignore')
            m = re.search(r'<title>(.*?)</title>', html)
            m_desc = re.search(r'<meta name="description" content="(.*?)"', html)
            title = m.group(1) if m else 'No title'
            desc = m_desc.group(1) if m_desc else 'No desc'
            descriptions[pid] = {'title': title, 'desc': desc}
            print(f"{pid}: {title[:70]}")
    except Exception as e:
        descriptions[pid] = {'error': str(e)}
        print(f"{pid}: Error {e}")

import json
with open('scripts/unsplash_descriptions.json', 'w', encoding='utf-8') as out:
    json.dump(descriptions, out, indent=2, ensure_ascii=False)
