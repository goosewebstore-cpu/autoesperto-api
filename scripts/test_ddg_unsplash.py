import urllib.request
import urllib.parse
import re

def search_unsplash_images(query):
    url = f"https://html.duckduckgo.com/html/?q={urllib.parse.quote('site:images.unsplash.com ' + query)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract photo links
            links = re.findall(r'https?://images\.unsplash\.com/photo-[a-zA-Z0-9\-]+', html)
            return list(set(links))
    except Exception as e:
        print(f"Error: {e}")
        return []

links = search_unsplash_images("car dashboard odometer")
print("Found links:", len(links))
for l in links[:5]:
    print(l)
