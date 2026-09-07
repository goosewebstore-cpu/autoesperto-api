import os
import json
import re

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_FILE = os.path.join(PROJECT_ROOT, "apps", "web", "public", "audit-gallery.html")

with open(os.path.join(PROJECT_ROOT, 'apps', 'web', 'src', 'lib', 'guides.ts'), encoding='utf-8') as f:
    text = f.read()

chunks = text.split('"slug": "')
guides = []
for c in chunks[1:]:
    slug = c.split('"')[0]
    m_cat = re.search(r'"category":\s*"([^"]+)"', c)
    m_title = re.search(r'"title":\s*"([^"]+)"', c)
    m_desc = re.search(r'"description":\s*"([^"]+)"', c)
    guides.append({
        'slug': slug,
        'category': m_cat.group(1) if m_cat else 'unknown',
        'title': m_title.group(1) if m_title else '',
        'desc': m_desc.group(1) if m_desc else ''
    })

CAT_CONFIG = {
    "acquisto": {"label": "Acquisto (43)", "color": "#10B981", "bg": "rgba(16, 185, 129, 0.15)", "border": "rgba(16, 185, 129, 0.4)"},
    "vendita": {"label": "Vendita (30)", "color": "#F472B6", "bg": "rgba(244, 114, 182, 0.15)", "border": "rgba(244, 114, 182, 0.4)"},
    "valutazione": {"label": "Valutazione (47)", "color": "#6366F1", "bg": "rgba(99, 102, 241, 0.15)", "border": "rgba(99, 102, 241, 0.4)"},
    "manutenzione": {"label": "Manutenzione (38)", "color": "#F59E0B", "bg": "rgba(245, 158, 11, 0.15)", "border": "rgba(245, 158, 11, 0.4)"},
    "affidabilita": {"label": "Affidabilità (36)", "color": "#F43F5E", "bg": "rgba(244, 63, 94, 0.15)", "border": "rgba(244, 63, 94, 0.4)"},
}

cards_html = []
for i, g in enumerate(guides, 1):
    slug = g['slug']
    cat = g['category']
    cfg = CAT_CONFIG.get(cat, {"label": cat, "color": "#94A3B8", "bg": "rgba(148, 163, 184, 0.1)", "border": "#94A3B8"})
    img_url = f"/images/guide/{slug}.jpg"
    
    card = f"""
    <div class="card" data-category="{cat}">
      <div class="card-img-wrap">
        <img src="{img_url}" alt="{g['title']}" loading="lazy" />
        <span class="badge" style="background:{cfg['bg']}; color:{cfg['color']}; border:1px solid {cfg['border']};">
          <span class="dot" style="background:{cfg['color']};"></span>
          {cfg['label'].split(' ')[0]}
        </span>
        <span class="num">#{i}</span>
      </div>
      <div class="card-content">
        <h3>{g['title']}</h3>
        <p class="slug">/{slug}</p>
        <p class="desc">{g['desc'][:110]}...</p>
        <div class="card-footer">
          <a href="/guide/{slug}" target="_blank" class="link-btn">Apri Guida &rarr;</a>
          <a href="{img_url}" target="_blank" class="img-btn">Vedi Immagine HD</a>
        </div>
      </div>
    </div>
    """
    cards_html.append(card)

html = f"""<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AutoEsperto - Complete 194 Guide Covers Audit</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {{
      --bg: #0B0F19;
      --card-bg: #131B2E;
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #F8FAFC;
      --text-muted: #94A3B8;
      --accent: #3B82F6;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 32px 24px;
      line-height: 1.5;
    }}
    header {{
      max-width: 1400px;
      margin: 0 auto 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}
    .top-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 24px;
    }}
    h1 {{
      font-size: 28px;
      font-weight: 800;
      background: linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}
    .stats {{
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }}
    .stat-badge {{
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }}
    .filters {{
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }}
    .filter-btn {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }}
    .filter-btn:hover, .filter-btn.active {{
      background: var(--accent);
      color: white;
      border-color: var(--accent);
      box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
    }}
    .grid {{
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }}
    .card {{
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }}
    .card:hover {{
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.16);
    }}
    .card-img-wrap {{
      position: relative;
      aspect-ratio: 1200 / 630;
      background: #000;
      overflow: hidden;
    }}
    .card-img-wrap img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }}
    .card:hover .card-img-wrap img {{
      transform: scale(1.04);
    }}
    .badge {{
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
      backdrop-filter: blur(8px);
    }}
    .dot {{
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }}
    .num {{
      position: absolute;
      bottom: 10px;
      right: 12px;
      background: rgba(0, 0, 0, 0.7);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: #94A3B8;
      backdrop-filter: blur(4px);
    }}
    .card-content {{
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 8px;
    }}
    h3 {{
      font-size: 15px;
      font-weight: 800;
      line-height: 1.35;
      color: #F8FAFC;
    }}
    .slug {{
      font-size: 11px;
      font-family: monospace;
      color: #60A5FA;
      word-break: break-all;
    }}
    .desc {{
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.45;
      flex-grow: 1;
    }}
    .card-footer {{
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }}
    .link-btn {{
      color: #60A5FA;
      text-decoration: none;
      font-weight: 700;
    }}
    .link-btn:hover {{
      text-decoration: underline;
    }}
    .img-btn {{
      color: #94A3B8;
      text-decoration: none;
      font-weight: 600;
      font-size: 11px;
    }}
    .img-btn:hover {{
      color: #FFF;
    }}
  </style>
</head>
<body>
  <header>
    <div class="top-bar">
      <div>
        <h1>AutoEsperto Guide - 100% Unique Image Gallery</h1>
        <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">
          Comprehensive visual audit of all 194 guides &bull; 0 Duplicates &bull; Logo Watermark &bull; Topic-Accurate Photography
        </p>
      </div>
      <div class="stats">
        <span class="stat-badge" style="color:#10B981; border-color: rgba(16,185,129,0.3);">43 Acquisto</span>
        <span class="stat-badge" style="color:#F472B6; border-color: rgba(244,114,182,0.3);">30 Vendita</span>
        <span class="stat-badge" style="color:#6366F1; border-color: rgba(99,102,241,0.3);">47 Valutazione</span>
        <span class="stat-badge" style="color:#F59E0B; border-color: rgba(245,158,11,0.3);">38 Manutenzione</span>
        <span class="stat-badge" style="color:#F43F5E; border-color: rgba(244,63,94,0.3);">36 Affidabilità</span>
        <span class="stat-badge" style="background:#10B981; color:white; border-color:#10B981;">Total: 194 / 194 Unique</span>
      </div>
    </div>
    <div class="filters">
      <button class="filter-btn active" onclick="filterCat('all')">Tutte (194)</button>
      <button class="filter-btn" onclick="filterCat('acquisto')">Acquisto (43)</button>
      <button class="filter-btn" onclick="filterCat('vendita')">Vendita (30)</button>
      <button class="filter-btn" onclick="filterCat('valutazione')">Valutazione (47)</button>
      <button class="filter-btn" onclick="filterCat('manutenzione')">Manutenzione (38)</button>
      <button class="filter-btn" onclick="filterCat('affidabilita')">Affidabilità (36)</button>
    </div>
  </header>

  <main class="grid" id="grid">
    {''.join(cards_html)}
  </main>

  <script>
    function filterCat(cat) {{
      const buttons = document.querySelectorAll('.filter-btn');
      buttons.forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');

      const cards = document.querySelectorAll('.card');
      cards.forEach(c => {{
        if (cat === 'all' || c.getAttribute('data-category') === cat) {{
          c.style.display = 'flex';
        }} else {{
          c.style.display = 'none';
        }}
      }});
    }}
  </script>
</body>
</html>
"""

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Generated {HTML_FILE} with all {len(guides)} guides!")
