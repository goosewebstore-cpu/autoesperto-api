import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def get_subcats(cat_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat_name)}&cmtype=subcat&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'] for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

for c in ["Car keys", "Car dealerships", "Dashboard", "Automobile air conditioning"]:
    print(c, "subcats:", get_subcats(c)[:10])
