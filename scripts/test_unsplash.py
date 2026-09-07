import urllib.request
import json

url = 'https://unsplash.com/napi/search/photos?query=car+mechanic&per_page=5'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print(f"Total results: {data.get('total')}")
        for r in data.get('results', [])[:5]:
            raw_url = r.get('urls', {}).get('raw')
            alt = r.get('alt_description')
            print(f"- ID: {r.get('id')} | {alt}")
            print(f"  URL: {raw_url}")
except Exception as e:
    print(f"Error: {e}")
