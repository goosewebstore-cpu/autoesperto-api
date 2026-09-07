import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def get_cm(cat):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat)}&cmtype=file&cmlimit=30&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'] for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

for c in ["Shock absorbers", "Electric starter motors", "Automobile suspension", "Cutaways of automobile parts"]:
    print(f"\n=== Category:{c} ===")
    files = get_cm(c)
    for f in files[:8]:
        print(f"  {f}")
