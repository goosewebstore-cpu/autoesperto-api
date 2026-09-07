import os
import sys
from PIL import Image, ImageDraw, ImageFont

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV2   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"
BRAIN_E478    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01"
BRAIN_43AC    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\43ac82ea-2c78-4093-9740-96372755aff5"
UNSPLASH_DIR  = r"scripts\unsplash_cache"
ATTO_CACHE    = r"scripts\atto_vendita_cache"

PUBLIC_DIR    = r"apps\web\public"
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

# 30 articles in 'vendita' -> 30 100% UNIQUE base images
MAPPING_VENDITA = {
    "come-fissare-prezzo-vendita-auto": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1554224155-8d04cb21cd6c.jpg"),
        "tag": "Prezzo di Vendita"
    },
    "annuncio-auto-usata-perfetto-guida": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1512941937669-90a1b58e7e9c.jpg"),
        "tag": "Annuncio Perfetto"
    },
    "foto-auto-usata-da-caricare-guida": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1555774698-0b77e0d5fac6.jpg"),
        "tag": "10 Foto Fondamentali"
    },
    "permuta-auto-usata-conviene-calcolo": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1562911791-c7a97b729ec5.jpg"),
        "tag": "Permuta vs Vendita"
    },
    "pagamento-sicuro-vendita-auto-usata": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1563986768609-322da13575f3.jpg"),
        "tag": "Pagamento Sicuro"
    },
    "atto-di-vendita-auto-usata-autentica": {
        "file": os.path.join(ATTO_CACHE, "Legal_Contract_Signature_Warm_Tones.jpg"),
        "tag": "Atto di Vendita"
    },
    "vendere-auto-usata-con-finanziamento-in-corso": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1454165804606-c3d57bc86b40.jpg"),
        "tag": "Finanziamento in Corso"
    },
    "vendere-auto-usata-senza-revisione": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1486262715619-67b85e0b08d3.jpg"),
        "tag": "Revisione Scaduta"
    },
    "vendere-auto-usata-con-danni-carrozzeria": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1601362840469-51e4d8d58785.jpg"),
        "tag": "Danni Carrozzeria"
    },
    "vendere-auto-per-esportazione-estero": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1502877338535-766e1452684a.jpg"),
        "tag": "Esportazione Estero"
    },
    "vendere-auto-usata-a-compro-auto": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1563720223185-11003d516935.jpg"),
        "tag": "Servizi Compro Auto"
    },
    "valore-residuo-auto-usata-fattori": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1544636331-e26879cd4d9b.jpg"),
        "tag": "Valore Residuo"
    },
    "vendere-auto-usata-storico-tagliandi": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1567808291548-fc3ee04dbcf0.jpg"),
        "tag": "Storico Tagliandi"
    },
    "vendere-auto-usata-tra-parenti": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1549465220-1a8b9238cd48.jpg"),
        "tag": "Vendita tra Parenti"
    },
    "vendere-auto-usata-con-doppia-chiave": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1621905251189-08b45d6a269e.jpg"),
        "tag": "Doppia Chiave & Manuali"
    },
    "vendere-auto-usata-garanzia-tra-privati": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1599819811279-d5ad9cccf838.jpg"),
        "tag": "Visto e Piaciuto"
    },
    "vendere-auto-usata-in-conto-vendita": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1553440569-bcc63803a83d.jpg"),
        "tag": "Conto Vendita"
    },
    "preparare-auto-usata-alla-vendita": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1607860108855-64acf2078ed9.jpg"),
        "tag": "Detailing & Pulizia"
    },
    "vendere-auto-usata-all-asta-online": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1552519507-da3b142c6e3d.jpg"),
        "tag": "Aste Online Auto"
    },
    "vendere-auto-usata-con-fermo-fiscale": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1494976388531-d1058494cdd8.jpg"),
        "tag": "Sblocco Fermo Fiscale"
    },
    "vendere-auto-usata-all-estero-senza-iva": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1542282088-72c9c27ed0cd.jpg"),
        "tag": "Vendita Estero & IVA"
    },
    "trattativa-prezzo-vendita-auto-usata": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1582139329536-e7284fece509.jpg"),
        "tag": "Trattativa Prezzo"
    },
    "vendere-auto-usata-incidentata-o-fusa": {
        "file": os.path.join(BRAIN_CURRENT, "freni_auto_dischi_1788617164014.jpg"),
        "tag": "Auto Incidentata o Fusa"
    },
    "vendere-auto-usata-di-societa-o-partita-iva": {
        "file": os.path.join(BRAIN_PREV2, "investor_banner_1788559154127.jpg"),
        "tag": "Società & Partita IVA"
    },
    "vendere-auto-usata-con-bollo-scaduto": {
        "file": os.path.join(BRAIN_43AC, "aria_condizionata_auto_caldo_1788383926019.jpg"),
        "tag": "Bollo Auto Arretrato"
    },
    "vendere-auto-usata-elettrica-batteria": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1583121274602-3e2820c69888.jpg"),
        "tag": "SOH Batteria Elettrica"
    },
    "vendere-auto-usata-con-impianto-gpl": {
        "file": os.path.join(BRAIN_CURRENT, "pneumatici_usura_controllo_1788617369864.jpg"),
        "tag": "Impianto GPL & Bombole"
    },
    "vendere-auto-usata-in-sicurezza-test-drive": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1449965408869-eaa3f722e40d.jpg"),
        "tag": "Test Drive Sicuro"
    },
    "vendere-auto-usata-d-epoca-valutazione": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1508974239320-0a029497e820.jpg"),
        "tag": "Auto d'Epoca & ASI"
    },
    "consegna-auto-usata-verbale-passaggio": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1520340356584-f9917d1eea6f.jpg"),
        "tag": "Verbale di Consegna"
    }
}

# 1. VERIFY 100% 1-TO-1 UNIQUENESS
used_files = [v["file"] for v in MAPPING_VENDITA.values()]
assert len(used_files) == 30, f"Expected 30, got {len(used_files)}"
assert len(set(used_files)) == 30, f"Duplicate base files detected! Unique: {len(set(used_files))}"

# 2. VERIFY EVERY FILE EXISTS
for slug, item in MAPPING_VENDITA.items():
    if not os.path.exists(item["file"]):
        print(f"ERROR: missing file for {slug}: {item['file']}")
        sys.exit(1)

print("SUCCESS: All 30 base files for VENDITA exist and are 100% UNIQUE (NO SHARED BASES)!")

# 3. BUILD COVERS
TARGET_W = 1200
TARGET_H = 630
ACCENT_COLOR = (244, 114, 182) # Rose / Pink for Vendita

# Load logo
logo_img = Image.open(LOGO_PATH).convert("RGBA") if os.path.exists(LOGO_PATH) else None

def create_badge(tag_text):
    padding_x = 22
    padding_y = 11
    radius = 12
    font = None
    for fn in ["arialbd.ttf", "segoeuib.ttf", "calibrib.ttf", "arial.ttf"]:
        try:
            font = ImageFont.truetype(fn, 21)
            break
        except Exception:
            pass
    if not font:
        font = ImageFont.load_default()

    dot_r = 5
    dot_margin = 12
    try:
        bbox = font.getbbox(tag_text)
        text_w = bbox[2] - bbox[0]
        text_h = bbox[3] - bbox[1]
    except Exception:
        text_w = len(tag_text) * 11
        text_h = 20

    badge_w = padding_x * 2 + (dot_r * 2 + dot_margin) + text_w
    badge_h = padding_y * 2 + text_h

    badge = Image.new("RGBA", (badge_w, badge_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(badge)
    draw.rounded_rectangle([0, 0, badge_w - 1, badge_h - 1], radius=radius,
                           fill=(15, 23, 42, 210), outline=(255, 255, 255, 55), width=1)
    
    dot_cx = padding_x + dot_r
    dot_cy = badge_h // 2
    draw.ellipse([dot_cx - dot_r - 2, dot_cy - dot_r - 2, dot_cx + dot_r + 2, dot_cy + dot_r + 2],
                 fill=(*ACCENT_COLOR, 70))
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r],
                 fill=(*ACCENT_COLOR, 255))
    
    text_x = padding_x + (dot_r * 2 + dot_margin)
    text_y = (badge_h - text_h) // 2 - 1
    draw.text((text_x, text_y), tag_text, font=font, fill=(255, 255, 255, 245))
    return badge

for i, (slug, item) in enumerate(MAPPING_VENDITA.items(), 1):
    base = Image.open(item["file"]).convert("RGBA")
    w, h = base.size
    target_ratio = TARGET_W / TARGET_H
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        base = base.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        base = base.crop((0, top, w, top + new_h))
    
    resized = base.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

    # Gradient Vignette
    grad = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for y in range(TARGET_H):
        alpha = int((y / TARGET_H) ** 2.2 * 110)
        g_draw.line([(0, y), (TARGET_W, y)], fill=(8, 12, 22, alpha))
    for x in range(350):
        alpha = int(((350 - x) / 350) ** 2.0 * 80)
        g_draw.line([(x, 0), (x, TARGET_H)], fill=(8, 12, 22, alpha))
    
    final_im = Image.alpha_composite(resized, grad)

    # Logo watermark
    if logo_img:
        l_w, l_h = logo_img.size
        target_logo_h = 44
        target_logo_w = int(l_w * (target_logo_h / l_h))
        scaled_logo = logo_img.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)
        
        logo_bg = Image.new("RGBA", (target_logo_w + 20, target_logo_h + 16), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(logo_bg)
        bg_draw.rounded_rectangle([0, 0, target_logo_w + 19, target_logo_h + 15], radius=10,
                                  fill=(15, 23, 42, 190), outline=(255, 255, 255, 45), width=1)
        logo_bg.paste(scaled_logo, (10, 8), scaled_logo)
        
        final_im.paste(logo_bg, (TARGET_W - (target_logo_w + 20) - 36, 36), logo_bg)

    # Badge
    badge = create_badge(item["tag"])
    badge_x = 40
    badge_y = TARGET_H - badge.size[1] - 40
    final_im.paste(badge, (badge_x, badge_y), badge)

    out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
    final_rgb = final_im.convert("RGB")
    final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
    sz_kb = os.path.getsize(out_file) // 1024
    base_name = os.path.basename(item["file"])
    print(f"{i:2d}/30. [{slug}] -> {sz_kb} KB | {item['tag']} | Source: {base_name}")

print("\nDONE: All 30 vendita covers generated from 30 100% DISTINCT base photos!")
