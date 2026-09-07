import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def find_cats(prefix):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=allcategories&acprefix={urllib.parse.quote(prefix)}&aclimit=10&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['*'] for x in d.get('query', {}).get('allcategories', [])]
    except Exception as e:
        return []

prefixes = [
    "Air condition", "Automotive air", "Car key", "Handshake", "Wheel bear", "Car dealer", "Odometer", "Speedometer", "Dashboard", "Car interior", "Mercedes-Benz W124", "Motor oil", "Spark plug"
]

for p in prefixes:
    res = find_cats(p)
    print(f"Prefix '{p}': {res[:4]}")
