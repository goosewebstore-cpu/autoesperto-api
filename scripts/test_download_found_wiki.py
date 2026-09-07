import urllib.request
import urllib.parse
import os
from PIL import Image

dest_dir = "scripts/verified_wiki_cache"
os.makedirs(dest_dir, exist_ok=True)

files = [
    ("File:Mercedes Benz Autoschlüssel - 01.jpg", "mercedes_autoschlussel.jpg"),
    ("File:Mercedes S-Class Interior (W222).jpg", "mercedes_s_class_interior.jpg"),
    ("File:Mercedes-Benz W124 Brabus 6.5 Classic-Gala 2021 1X7A0101.jpg", "mercedes_w124.jpg"),
    ("File:Candela rotta.jpg", "candela_rotta.jpg"),
    ("File:Bujía Bosch Yttrium Super Plus.JPG", "bosch_super_plus.jpg"),
    ("File:\" 14 - ITALY - 500 Abarth TFT - Speedometers dashboards driving stand cockpits Automobile gauges.JPG", "abarth_500_tft.jpg"),
    ("File:123456 km on Bonner Ave, Winnipeg (504809) (24164746880).jpg", "odometer_123456km.jpg")
]

for title, fname in files:
    dest = os.path.join(dest_dir, fname)
    if not os.path.exists(dest):
        url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
        try:
            import json, time
            time.sleep(1)
            d = json.loads(urllib.request.urlopen(req, timeout=12).read().decode('utf-8'))
            p = list(d.get('query', {}).get('pages', {}).values())[0]
            img_url = p.get('imageinfo', [{}])[0].get('url', '')
            if img_url:
                img_req = urllib.request.Request(img_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
                with urllib.request.urlopen(img_req, timeout=25) as r:
                    data = r.read()
                    with open(dest, 'wb') as out_f:
                        out_f.write(data)
                print(f"Downloaded {fname}: {len(data)//1024} KB")
        except Exception as e:
            print(f"Failed {fname}: {e}")
    if os.path.exists(dest):
        im = Image.open(dest)
        print(f"OK: {fname} -> {im.size}")
