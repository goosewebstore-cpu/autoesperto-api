import urllib.request
import urllib.parse
import json

def test_intitle(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (automotive editorial; info@autoesperto.it)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"\nQuery: {query} ({len(pages)} items):")
            for pid, p in pages.items():
                title = p.get('title', '')
                ii = p.get('imageinfo', [{}])[0]
                mime = ii.get('mime', '')
                w = ii.get('width', 0)
                h = ii.get('height', 0)
                print(f"  * {title} [{w}x{h}, {mime}]")
    except Exception as e:
        print(f"Error {query}: {e}")

test_intitle('intitle:"Clio IV" filetype:bitmap')
test_intitle('intitle:"Duster" GIMS filetype:bitmap')
test_intitle('intitle:"Fiat Panda" 201 filetype:bitmap')
test_intitle('intitle:"accident" car damage filetype:bitmap')
test_intitle('intitle:"car key" filetype:bitmap')
test_intitle('intitle:"speedometer" car 201 filetype:bitmap')
test_intitle('intitle:"detailing" car filetype:bitmap')
test_intitle('intitle:"car wash" foam filetype:bitmap')
test_intitle('intitle:"charging" EV station filetype:bitmap')
