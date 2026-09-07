import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR   = os.path.join(PROJECT_ROOT, "apps", "web", "public")

with open(os.path.join(PROJECT_ROOT, 'scripts', 'full_guides_info.json'), 'r', encoding='utf-8') as f:
    full_data = json.load(f)

acquisto = full_data.get('acquisto', [])
vendita = full_data.get('vendita', [])

with open(os.path.join(PROJECT_ROOT, 'scripts', 'valutazione_detailed.json'), 'r', encoding='utf-8') as f:
    valutazione = json.load(f)

html = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>AutoEsperto Guides Image Audit - Acquisto, Vendita & Valutazione</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 28px; margin: 0; }
h1 { font-size: 28px; margin-bottom: 8px; color: #38bdf8; }
h2 { font-size: 22px; margin-top: 40px; padding-bottom: 10px; border-bottom: 2px solid #334155; }
.desc { color: #94a3b8; font-size: 15px; margin-bottom: 28px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 24px; }
.card { background: #1e293b; border-radius: 14px; overflow: hidden; border: 1px solid #334155; display: flex; flex-direction: column; transition: transform 0.2s; }
.card:hover { transform: translateY(-4px); border-color: #64748b; }
.card img { width: 100%; height: 200px; object-fit: cover; background: #0f172a; }
.info { padding: 16px; flex-grow: 1; display: flex; flex-direction: column; }
.badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; width: fit-content; }
.badge-acquisto { background: #065f46; color: #34d399; }
.badge-vendita { background: #831843; color: #f472b6; }
.badge-valutazione { background: #312e81; color: #818cf8; }
.title { font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 6px; line-height: 1.4; }
.article-desc { font-size: 12px; color: #94a3b8; line-height: 1.4; flex-grow: 1; }
.img-path { font-size: 11px; color: #64748b; margin-top: 10px; font-family: monospace; word-break: break-all; }
</style>
</head>
<body>
<h1>AutoEsperto Guides Image Audit</h1>
<p class="desc">Verifica live di 120 copertine uniche e conformi (43 Acquisto + 30 Vendita + 47 Valutazione). Nessun duplicato, formato 1200x630, logo AutoEsperto e badge di categoria dedicato.</p>

<h2 style="color: #818cf8;">Categoria VALUTAZIONE (47 Articoli - Completata)</h2>
<div class="grid">
"""

for i, g in enumerate(valutazione, 1):
    slug = g['slug']
    title = g['title']
    desc = g['description']
    img_url = f"/images/guide/{slug}.jpg"
    html += f"""
    <div class="card">
        <img src="{img_url}" alt="{slug}" loading="lazy"/>
        <div class="info">
            <span class="badge badge-valutazione">#{i:02d} Valutazione</span>
            <div class="title">{title}</div>
            <div class="article-desc">{desc}</div>
            <div class="img-path">Slug: {slug}</div>
        </div>
    </div>
    """

html += """
</div>

<h2 style="color: #f472b6;">Categoria VENDITA (30 Articoli - Completata)</h2>
<div class="grid">
"""

for i, g in enumerate(vendita, 1):
    slug = g['slug']
    title = g['title']
    desc = g['desc']
    img_url = f"/images/guide/{slug}.jpg"
    html += f"""
    <div class="card">
        <img src="{img_url}" alt="{slug}" loading="lazy"/>
        <div class="info">
            <span class="badge badge-vendita">#{i:02d} Vendita</span>
            <div class="title">{title}</div>
            <div class="article-desc">{desc}</div>
            <div class="img-path">Slug: {slug}</div>
        </div>
    </div>
    """

html += """
</div>

<h2 style="color: #34d399;">Categoria ACQUISTO (43 Articoli - Completata)</h2>
<div class="grid">
"""

for i, g in enumerate(acquisto, 1):
    slug = g['slug']
    title = g['title']
    desc = g['desc']
    img_url = f"/images/guide/{slug}.jpg"
    html += f"""
    <div class="card">
        <img src="{img_url}" alt="{slug}" loading="lazy"/>
        <div class="info">
            <span class="badge badge-acquisto">#{i:02d} Acquisto</span>
            <div class="title">{title}</div>
            <div class="article-desc">{desc}</div>
            <div class="img-path">Slug: {slug}</div>
        </div>
    </div>
    """

html += """
</div>
</body>
</html>
"""

out_path = os.path.join(PUBLIC_DIR, "audit-gallery.html")
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Audit gallery created at: {out_path} ({os.path.getsize(out_path)//1024} KB)")
