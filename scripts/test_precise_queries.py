import urllib.request
import urllib.parse
import json

def test_q(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=6&gsrnamespace=6&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            d = json.loads(resp.read().decode('utf-8'))
            pages = d.get('query', {}).get('pages', {})
            res = []
            for p in pages.values():
                title = p['title']
                ii = p.get('imageinfo', [{}])[0]
                res.append((title, ii.get('width', 0), ii.get('height', 0)))
            return res
    except Exception as e:
        return []

checks = [
    ("spia-motore", "Check engine light car dashboard"),
    ("spia-motore-2", "Malfunction indicator car dashboard"),
    ("spia-motore-3", "OBD2 scanner car"),
    ("clima-ricarica", "Air conditioning recharge car"),
    ("clima-ricarica-2", "Manifold gauge air conditioning"),
    ("liquido-refrigerante", "Coolant expansion tank car"),
    ("liquido-refrigerante-2", "Engine coolant reservoir"),
    ("pompa-acqua", "Automotive water pump"),
    ("pompa-acqua-2", "Car engine water pump"),
    ("benzina-risparmio", "Refuelling car petrol pump"),
    ("benzina-risparmio-2", "Fuel dispenser nozzle car"),
    ("cambio-auto-lavaggio", "Automatic transmission gearbox"),
    ("cambio-auto-lavaggio-2", "Automatic transmission cutaway"),
    ("liquido-freni", "Brake master cylinder reservoir"),
    ("liquido-freni-2", "Brake fluid reservoir car"),
    ("aria-caldo", "Car air conditioning dashboard"),
    ("aria-caldo-2", "Car climate control vents"),
]

for name, q in checks:
    print(f"\n--- {name} : '{q}' ---")
    hits = test_q(q)
    for title, w, h in hits[:4]:
        print(f"   {title} ({w}x{h})")
