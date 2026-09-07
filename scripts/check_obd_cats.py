import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

for cat in ["On-board diagnostics", "Automobile instrument clusters", "Dashboard (automobile)"]:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat)}&cmlimit=25&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            items = d.get('query', {}).get('categorymembers', [])
            print(f"Cat '{cat}': {len(items)} items")
            for it in items[:6]:
                print(f"   {it['title']}")
    except Exception as e:
        print(f"err: {e}")
