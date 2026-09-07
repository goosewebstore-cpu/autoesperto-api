import urllib.request
import urllib.parse
import json

def get_cat_files(cat_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat_name)}&cmtype=file&cmlimit=25&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'] for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

cats = [
    "Steering-wheel lock",
    "OBD-II",
    "OBD-II Connector",
    "Starter motor",
    "Alternators",
    "Thermostat housing",
    "Engine cooling",
    "Windshield wipers",
    "Sunroof",
    "Steering boxes",
    "Shock absorbers",
]

for c in cats:
    files = get_cat_files(c)
    print(f"\nCategory '{c}': {len(files)} files")
    for f in files[:4]:
        print(f"   {f}")
