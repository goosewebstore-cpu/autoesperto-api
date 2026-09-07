import urllib.request
import urllib.parse
import json

def get_subcats(cat_name):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat_name)}&cmtype=subcat&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            return [x['title'].replace('Category:', '') for x in d.get('query', {}).get('categorymembers', [])]
    except Exception as e:
        return []

print("=== Automobile parts subcategories ===")
parts = get_subcats("Automobile parts")
for p in sorted(parts)[:35]:
    print(f"  {p}")

print("\n=== Internal combustion engine parts subcategories ===")
engine_parts = get_subcats("Internal combustion engine parts")
for ep in sorted(engine_parts)[:35]:
    print(f"  {ep}")
