import urllib.request
import json

url = 'https://unsplash.com/napi/search/photos?query=car+mechanic+inspection&per_page=5'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
try:
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read().decode('utf-8'))
        print("Total results:", data.get("total"))
        for p in data.get('results', [])[:5]:
            desc = p.get("alt_description") or p.get("description") or "No desc"
            print(f"ID: {p['id']} | Desc: {desc} | URL: {p['urls']['raw']}")
except Exception as e:
    print("Failed:", e)
