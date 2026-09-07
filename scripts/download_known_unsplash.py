import urllib.request
import os

UNSPLASH_IDS = [
    "photo-1555215695-3004980ad54e", # BMW Sedan
    "photo-1583121274602-3e2820c69888", # Red Ferrari / sports car
    "photo-1617814076367-b759c7d7e738", # Mercedes luxury cockpit
    "photo-1542282088-72c9c27ed0cd", # Audi mountain road
    "photo-1590362891991-f776e747a588", # Crossover SUV
    "photo-1541899481282-d53bffe3c35d", # Compact hatchback
    "photo-1503376780353-7e6692767b70", # Porsche sports
    "photo-1541348263662-e0c8de4259ba", # Modern sedan profile
    "photo-1552519507-da3b142c6e3d", # Chevrolet Corvette
    "photo-1533473359331-0135ef1b58bf", # Rugged 4x4 offroad SUV
    "photo-1563720223185-11003d516935", # Mercedes S Class luxury
    "photo-1549399542-7e3f8b79c341", # Red urban hatchback
    "photo-1580273916550-e323be2ae537", # BMW M3 front grille
    "photo-1550355291-bbee04a92027", # Audi steering wheel cockpit
    "photo-1508974239320-0a029497e820", # Classic car
    "photo-1556189250-72ba954cfc2b", # Car leather seats interior
    "photo-1502877338535-766e1452684a", # Scenic road trip
    "photo-1568605117036-5fe5e7bab0b7", # Auto repair garage mechanic
    "photo-1553440569-bcc63803a83d", # Supercar front headlight
    "photo-1494976388531-d1058494cdd8", # Ford Mustang
    "photo-1486262715619-67b85e0b08d3", # Engine mechanics tools
    "photo-1544636331-e26879cd4d9b"  # Lamborghini sports car
]

os.makedirs("scripts/unsplash_cache", exist_ok=True)
success = 0
for pid in UNSPLASH_IDS:
    out = f"scripts/unsplash_cache/{pid}.jpg"
    if os.path.exists(out):
        success += 1
        continue
    url = f"https://images.unsplash.com/{pid}?auto=format&fit=crop&w=1376&h=768&q=85"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as r:
            data = r.read()
            with open(out, 'wb') as f:
                f.write(data)
            success += 1
            print(f"Downloaded {pid}: {len(data)//1024} KB")
    except Exception as e:
        print(f"Failed {pid}: {e}")

print(f"Total downloaded: {success}/{len(UNSPLASH_IDS)}")
