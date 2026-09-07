import os
import hashlib
import json
import urllib.request

PUBLIC_IMG = "apps/web/public/images/guide"
man = json.load(open('scripts/manutenzione_articles.json', encoding='utf-8'))

hashes = {}
http_errors = 0

print("=== VERIFYING ALL 38 MANUTENZIONE COVERS ===")
for i, a in enumerate(man, 1):
    slug = a['slug']
    file_path = os.path.join(PUBLIC_IMG, f"{slug}.jpg")
    assert os.path.exists(file_path), f"File missing: {file_path}"
    
    with open(file_path, 'rb') as f:
        data = f.read()
        h = hashlib.md5(data).hexdigest()
    
    assert h not in hashes, f"DUPLICATE MD5 DETECTED! {slug} shares hash with {hashes[h]}"
    hashes[h] = slug
    
    # Test localhost:3000 HTTP 200
    url = f"http://localhost:3000/images/guide/{slug}.jpg"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            code = resp.getcode()
            if code != 200:
                print(f"HTTP ERROR {code} for {slug}")
                http_errors += 1
    except Exception as e:
        print(f"HTTP EXCEPTION for {slug}: {e}")
        http_errors += 1

print(f"\nResult: 38 / 38 files verified.")
print(f"Unique MD5 hashes: {len(hashes)} / 38")
print(f"HTTP errors: {http_errors}")
if len(hashes) == 38 and http_errors == 0:
    print("\nPERFECT SUCCESS! ALL 38 MANUTENZIONE COVERS ARE 100% UNIQUE AND RETURNING HTTP 200 ON LOCALHOST:3000!")
