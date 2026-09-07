import json
import urllib.request
import urllib.parse
import sys
import re

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('scripts/build_truly_unique_valutazione.py', encoding='utf-8') as f:
    code = f.read()

titles = list(set(re.findall(r'"wiki_title":\s*"([^"]+)"', code)))
print(f"Total unique wiki titles to fetch: {len(titles)}")

# We can query in batches of 20
url_map = {}
for i in range(0, len(titles), 20):
    batch = titles[i:i+20]
    batch_str = '|'.join(batch)
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(batch_str)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(api_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                t = p.get('title')
                if 'imageinfo' in p:
                    img_url = p['imageinfo'][0]['url']
                    url_map[t] = img_url
                    print(f"OK:   {t}")
                else:
                    print(f"FAIL (no imageinfo): {t}")
    except Exception as e:
        print(f"ERROR on batch {i}: {e}")

print(f"\nSuccessfully resolved: {len(url_map)}/{len(titles)} titles!")

with open('scripts/resolved_wiki_urls.json', 'w', encoding='utf-8') as f:
    json.dump(url_map, f, indent=2)
