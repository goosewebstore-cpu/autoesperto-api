import urllib.request
import urllib.parse
import json

def get_cat_members(cat_name, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat_name)}&cmtype=file&cmlimit={limit}&prop=imageinfo&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'] for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

test_cats = [
    "Automotive air conditioning",
    "Car batteries",
    "Automotive water pumps",
    "Diesel particulate filters",
    "Exhaust gas recirculation",
    "Automotive catalytic converters",
    "Oxygen sensors",
    "Mass flow sensors",
    "Spark plugs",
    "Glow plugs",
    "Shock absorbers",
    "Automobile steering gear",
    "Automobile throttle bodies",
    "Windscreen wipers",
    "Common rail",
    "Automobile instrument clusters",
    "On-board diagnostics",
    "Automobile air filters",
    "Filling stations"
]

for cat in test_cats:
    files = get_cat_members(cat, 5)
    print(f"Cat '{cat}': {len(files)} files")
    for f in files[:2]:
        print(f"   {f}")
