import urllib.request
import urllib.parse
import json

queries = {
    'adas': [
        'windscreen camera car sensor filetype:bitmap',
        'windshield sensor rearview mirror car filetype:bitmap',
        'ADAS windshield filetype:bitmap',
        'camera front windshield car interior filetype:bitmap'
    ],
    'cockpit_odometer': [
        'digital cockpit car display km/h filetype:bitmap',
        'digital instrument cluster car filetype:bitmap',
        'virtual cockpit car audi OR vw filetype:bitmap',
        'speedometer km/h car dashboard filetype:bitmap'
    ],
    'suspension_strut': [
        'MacPherson strut car spring damper filetype:bitmap',
        'coilover suspension car wheel filetype:bitmap',
        'shock absorber spring car wheel filetype:bitmap',
        'Federbein Automobil filetype:bitmap'
    ],
    'service_book': [
        'service book car stamps filetype:bitmap',
        'service manual car stamps filetype:bitmap',
        'maintenance booklet car stamps filetype:bitmap',
        'Scheckheft Auto filetype:bitmap'
    ],
    'towbar': [
        'towbar car trailer hitch rear bumper filetype:bitmap',
        'Anhängerkupplung Auto filetype:bitmap',
        'towbar ball car rear filetype:bitmap'
    ],
    'license_plate': [
        'German car license plate rear filetype:bitmap',
        'EU license plate car rear filetype:bitmap',
        'Auto mit deutschem Kennzeichen filetype:bitmap'
    ],
    'paint_finish': [
        'metallic car paint reflection finish filetype:bitmap',
        'car paint polish glossy reflection filetype:bitmap',
        'car detailing polish hood reflection filetype:bitmap'
    ],
    'convertible_sunny': [
        'convertible car sunny road driving filetype:bitmap',
        'cabriolet driving coastal road filetype:bitmap',
        'Mazda MX-5 sunny road filetype:bitmap'
    ],
    'italian_highway': [
        'Autostrada Italia car driving filetype:bitmap',
        'Autostrada A1 Italia filetype:bitmap',
        'highway driving Italy scenic car filetype:bitmap'
    ],
    'registration_duc': [
        'carta di circolazione auto documento filetype:bitmap',
        'libretto di circolazione auto filetype:bitmap',
        'Fahrzeugschein Zulassung Auto filetype:bitmap'
    ],
    'interior_wear': [
        'car steering wheel leather wear filetype:bitmap',
        'car interior steering wheel driver seat filetype:bitmap',
        'car cockpit driver seat steering wheel filetype:bitmap'
    ],
    'warranty': [
        'car warranty document booklet filetype:bitmap',
        'handover car keys document desk filetype:bitmap',
        'car keys contract document table filetype:bitmap'
    ],
    'running_costs': [
        'calculator money fuel receipt car key filetype:bitmap',
        'fuel receipt car keys calculator filetype:bitmap',
        'calculator invoice car expenses desk filetype:bitmap'
    ],
    'depreciation_curve': [
        'depreciation graph chart percentage filetype:bitmap',
        'car valuation chart graph data filetype:bitmap',
        'car value depreciation curve graph filetype:bitmap'
    ]
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

found = {}
for topic, qlist in queries.items():
    for q in qlist:
        res = search(q)
        if res:
            found[topic] = res
            print(f"OK: {topic} -> {res[0][0]} ({res[0][1]}x{res[0][2]})")
            break
    if topic not in found:
        print(f"FAILED: {topic}")

with open('scripts/tech_wiki_hits.json', 'w', encoding='utf-8') as f:
    json.dump(found, f, indent=2)
