import os
import glob

unsplash_dir = "scripts/unsplash_cache"
files = sorted(glob.glob(os.path.join(unsplash_dir, "*.jpg")))

# Copy to public/test_unsplash
dest_dir = "apps/web/public/test_unsplash"
os.makedirs(dest_dir, exist_ok=True)

html = """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>Unsplash Cache Review</title>
<style>
body { background: #111; color: white; font-family: sans-serif; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.card { background: #222; border-radius: 8px; overflow: hidden; padding-bottom: 8px; }
.card img { width: 100%; height: 200px; object-fit: cover; }
.name { padding: 8px; font-size: 13px; font-weight: bold; }
</style>
</head>
<body>
<h1>Unsplash Cached Photos (38 total)</h1>
<div class="grid">
"""

for f in files:
    name = os.path.basename(f)
    dest_path = os.path.join(dest_dir, name)
    if not os.path.exists(dest_path):
        with open(f, 'rb') as src_f, open(dest_path, 'wb') as dst_f:
            dst_f.write(src_f.read())
    html += f"""
    <div class="card">
        <img src="/test_unsplash/{name}"/>
        <div class="name">{name}</div>
    </div>
    """

html += "</div></body></html>"
with open("apps/web/public/unsplash-test.html", "w", encoding="utf-8") as f:
    f.write(html)
print("Saved apps/web/public/unsplash-test.html")
