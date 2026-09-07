import urllib.request

candidates = [
    # Car keys & handing keys
    "photo-1621905251189-08b45d6a269e",
    "photo-1599819811279-d5ad9cccf838",
    "photo-1549465220-1a8b9238cd48",
    "photo-1582139329536-e7284fece509",
    # Detailing & car wash
    "photo-1607860108855-64acf2078ed9",
    "photo-1520340356584-f9917d1eea6f",
    "photo-1601362840469-51e4d8d58785",
    # Dealership & showroom
    "photo-1562911791-c7a97b729ec5",
    "photo-1563720223185-11003d516935",
    "photo-1567808291548-fc3ee04dbcf0",
    # Contract & handshake
    "photo-1556742049-0a67c5574f73",
    "photo-1554224155-8d04cb21cd6c",
    "photo-1450133064473-71024230f91b",
    "photo-1454165804606-c3d57bc86b40",
    # Test drive & cockpit
    "photo-1449965408869-eaa3f722e40d",
    "photo-1489824904134-891ab64532f1",
    # Tow truck & damaged
    "photo-1563986768609-322da13575f3",
    # Smartphone app / photos
    "photo-1512941937669-90a1b58e7e9c",
    "photo-1555774698-0b77e0d5fac6"
]

valid = []
for cid in candidates:
    url = f"https://images.unsplash.com/{cid}?auto=format&fit=crop&w=1376&h=768&q=80"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            data = resp.read()
            with open(f"scripts/unsplash_cache/{cid}.jpg", 'wb') as f:
                f.write(data)
            print(f"VALID: {cid} ({len(data)//1024} KB)")
            valid.append(cid)
    except Exception as e:
        print(f"INVALID: {cid}")

print(f"\nTotal valid: {len(valid)}/{len(candidates)}")
