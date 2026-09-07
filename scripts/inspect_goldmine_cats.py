import urllib.request
import urllib.parse
import json

def get_cat_files(cat_name, limit=20):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat_name)}&cmtype=file&cmlimit={limit}&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'] for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

cats = [
    "Automobile brakes",
    "Automobile clutches",
    "Automobile suspension",
    "Automobile tires",
    "Automobile transmissions",
    "Fuel filler flap",
    "Defects in automobile parts",
    "Electric starter motors",
    "Fuel injectors",
    "Radiators (engine cooling)",
    "Spark plugs",
    "Throttles",
    "Engine timing gears"
]

for c in cats:
    files = get_cat_files(c, 10)
    print(f"\nCategory '{c}':")
    for f in files[:3]:
        print(f"   {f}")
