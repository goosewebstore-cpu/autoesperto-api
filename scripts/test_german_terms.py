import urllib.request
import urllib.parse
import json

queries = {
    'paint_gauge': 'Lackschichtenmessgerät OR "paint depth gauge" filetype:bitmap',
    'suspension': 'Federbein MacPherson OR Stossdämpfer Auto filetype:bitmap',
    'timing_chain': 'Steuerkette Motor OR "timing chain" camshaft filetype:bitmap',
    'auto_shifter': 'Wählhebel Automatikgetriebe OR "automatic gear selector" filetype:bitmap',
    'service_book': 'Scheckheft gestempelt OR Serviceheft Auto filetype:bitmap',
    'adas_camera': 'Kamera Windschutzscheibe Innenspiegel OR "ADAS camera" windshield filetype:bitmap',
    'digital_cockpit': 'Kombiinstrument digital Tacho OR "digital cockpit" speedometer filetype:bitmap',
    'foreign_plate': '"Kennzeichen D" Auto OR "German license plate" car filetype:bitmap',
    'ztl_italy': 'cartello ZTL Italia OR "Zona a Traffico Limitato" segnale filetype:bitmap',
    'm_sport': 'BMW M Sport emblem OR Audi S-Line badge filetype:bitmap',
    'modern_fiat_500': 'Fiat 500 2015 front OR "Fiat 500" 2018 filetype:bitmap'
}

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pinfo in pages.items():
                title = pinfo.get('title')
                ii = pinfo.get('imageinfo', [{}])[0]
                results.append((title, ii.get('width', 0), ii.get('height', 0), ii.get('url', '')))
            return results
    except Exception as e:
        return []

for k, q in queries.items():
    res = search(q)
    print(f"\n=== {k} ===")
    for title, w, h, u in res:
        print(f"  {w}x{h} | {title}")
