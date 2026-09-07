import json
import urllib.request
import urllib.parse
import re

with open('scripts/build_truly_unique_valutazione.py', encoding='utf-8') as f:
    code = f.read()

# find all wiki_title: "..."
titles = re.findall(r'"wiki_title":\s*"([^"]+)"', code)
print(f"Total wiki titles to verify: {len(titles)}")

failed = []
for t in titles:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEsperto/3.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read().decode('utf-8'))
            p = list(d['query']['pages'].values())[0]
            if 'imageinfo' not in p:
                print(f"FAIL: {t}")
                failed.append(t)
            else:
                print(f"OK:   {t[:45]}")
    except Exception as e:
        print(f"ERR:  {t} -> {e}")
        failed.append(t)

print(f"\nVerification summary: {len(titles) - len(failed)}/{len(titles)} OK")
if failed:
    print("FAILED TITLES:")
    for f in failed:
        print("  -", f)
