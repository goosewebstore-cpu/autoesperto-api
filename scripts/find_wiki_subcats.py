import urllib.request
import urllib.parse
import json

def get_subcats(cat_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle={urllib.parse.quote(cat_title)}&gcmtype=subcat&gcmlimit=20&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            return [p['title'] for p in pages.values()]
    except Exception as e:
        print(f"Error for {cat_title}: {e}")
        return []

print("=== Subcats of Category:Automobile interiors ===")
for sc in get_subcats("Category:Automobile interiors"):
    print(" ", sc)

print("\n=== Subcats of Category:Automobile parts ===")
for sc in get_subcats("Category:Automobile parts"):
    print(" ", sc)
