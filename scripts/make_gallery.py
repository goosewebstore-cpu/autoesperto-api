import glob
import os

images = []
# 1. Unsplash cache
for f in sorted(glob.glob('scripts/unsplash_cache/*.jpg')):
    name = os.path.basename(f)
    # copy to public/test_imgs
    dest = os.path.join('apps/web/public/test_imgs', name)
    os.makedirs('apps/web/public/test_imgs', exist_ok=True)
    with open(f, 'rb') as fp:
        with open(dest, 'wb') as dp:
            dp.write(fp.read())
    images.append((f"/test_imgs/{name}", name, "Unsplash"))

# 2. Brain images
for f in sorted(glob.glob(r'C:\Users\noizz\.gemini\antigravity-ide\brain\*\*.jpg')):
    if 'media' in f and '.temp' in f:
        continue
    name = os.path.basename(f)
    dest = os.path.join('apps/web/public/test_imgs', name)
    try:
        with open(f, 'rb') as fp:
            with open(dest, 'wb') as dp:
                dp.write(fp.read())
        images.append((f"/test_imgs/{name}", name, "Brain"))
    except Exception:
        pass

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>AutoEsperto Photo Library Gallery</title>
<style>
body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.card { background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
.card img { width: 100%; height: 180px; object-fit: cover; }
.info { padding: 12px; font-size: 12px; }
.tag { display: inline-block; padding: 2px 8px; border-radius: 4px; background: #3b82f6; font-weight: bold; margin-bottom: 6px; }
</style>
</head>
<body>
<h1>AutoEsperto Local Candidate Photos Library</h1>
<p>Total Photos: """ + str(len(images)) + """</p>
<div class="grid">
"""

for src, name, cat in images:
    html += f"""
    <div class="card">
        <img src="{src}" alt="{name}"/>
        <div class="info">
            <span class="tag">{cat}</span>
            <div style="word-break: break-all; font-weight: bold;">{name}</div>
        </div>
    </div>
    """

html += """
</div>
</body>
</html>
"""

with open('apps/web/public/gallery.html', 'w', encoding='utf-8') as out:
    out.write(html)

print(f"Generated gallery with {len(images)} photos at apps/web/public/gallery.html")
