import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
blacklist = set(json.load(open('scripts/blacklist_bases.json', encoding='utf-8')))

SEARCHES = {
    "freni": [
        "ventilated disc brake automotive caliper",
        "car brake rotor caliper brembo",
        "automotive disc brake ventilated"
    ],
    "libretto": [
        "vehicle maintenance log car",
        "car service book manual",
        "driving licence automotive car document"
    ],
    "alternatore": [
        "car alternator cutaway",
        "automotive alternator rotor stator",
        "car alternator disassembly"
    ],
    "motorino": [
        "car starter motor cutaway",
        "automotive starter motor pinion",
        "starter motor solenoid cutaway"
    ],
    "ammortizzatore": [
        "car shock absorber cutaway",
        "macpherson strut automotive cutaway",
        "car suspension coilover shock absorber"
    ],
    "obd_spia": [
        "car obd scanner diagnostic code",
        "obd-ii diagnostic tool screen car",
        "check engine light cluster dashboard"
    ]
}

def search_clean(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q + ' filetype:bitmap')}&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            hits = []
            for p in pages.values():
                title = p.get('title', '')
                base = title.replace("File:", "").strip()
                if base in blacklist:
                    continue
                ii = p.get('imageinfo', [{}])[0]
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                if w >= 1200 and h >= 700:
                    hits.append((title, w, h))
            return hits
    except Exception as e:
        return []

for key, q_list in SEARCHES.items():
    print(f"\n=== {key.upper()} ===")
    for q in q_list:
        res = search_clean(q)
        if res:
            print(f"  Query '{q}':")
            for title, w, h in res[:3]:
                print(f"    -> {title} ({w}x{h})")
            break
