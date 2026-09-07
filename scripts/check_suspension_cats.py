import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

for cat in ["MacPherson strut", "MacPherson struts", "Automotive suspension struts", "Coilover", "Coilovers", "Suspension components"]:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:{urllib.parse.quote(cat)}&cmtype=file&cmlimit=10&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            files = d.get('query', {}).get('categorymembers', [])
            print(f"Cat '{cat}': {len(files)} files")
            for f in files[:3]:
                print(f"   {f['title']}")
    except Exception as e:
        print(f"err {cat}: {e}")
