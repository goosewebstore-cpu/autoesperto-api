import os
import sys
from PIL import Image, ImageDraw, ImageFont

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV2   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"
BRAIN_E478    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01"
BRAIN_DB27    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\db279a3e-9763-4c66-b296-6e55c1efbe93"
BRAIN_95CE    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\95ce3926-0d9b-4f17-9b43-ffd512600c7d"
BRAIN_43AC    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\43ac82ea-2c78-4093-9740-96372755aff5"
UNSPLASH_DIR  = r"scripts\unsplash_cache"

PUBLIC_DIR    = r"apps\web\public"
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

# 43 articles -> 43 100% UNIQUE base images
MAPPING = {
    "auto-usata-10-segnali-problema-annuncio": {
        "file": os.path.join(BRAIN_PREV1, "auto_usata_10_segnali_1788274588127.jpg"),
        "tag": "10 Segnali D'Allarme"
    },
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": {
        "file": os.path.join(BRAIN_PREV1, "diesel_benzina_ibrida_1788274655894.jpg"),
        "tag": "Scelta Motorizzazione"
    },
    "migliori-auto-usate-10000-euro-2026": {
        "file": os.path.join(BRAIN_E478, "used_cars_10k_showroom_1788210056170.jpg"),
        "tag": "Budget 10.000€"
    },
    "5-cose-da-controllare-prima-comprare-auto-usata": {
        "file": os.path.join(BRAIN_E478, "used_car_inspection_signals_1788210016650.jpg"),
        "tag": "5 Controlli Chiave"
    },
    "auto-usata-100000-km-conviene-comprare": {
        "file": os.path.join(BRAIN_CURRENT, "spie_cruscotto_auto_1788617111592.jpg"),
        "tag": "Soglia 100.000 Km"
    },
    "come-capire-se-auto-usata-incidentata": {
        "file": os.path.join(BRAIN_PREV1, "controlli_pre_acquisto_1788274819833.jpg"),
        "tag": "Riconoscere Incidenti"
    },
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": {
        "file": os.path.join(BRAIN_CURRENT, "motore_diesel_commonrail_1788617345579.jpg"),
        "tag": "Diesel Euro 5 & Blocchi"
    },
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": {
        "file": os.path.join(BRAIN_PREV1, "profilo_auto_passaporto_1788274737379.jpg"),
        "tag": "Passaporto UE 2026"
    },
    "auto-usate-sotto-3000-euro-guida": {
        "file": os.path.join(BRAIN_E478, "budget_citycars_3000_1788210099424.jpg"),
        "tag": "Budget Sotto 3.000€"
    },
    "auto-usate-sotto-5000-euro-scelta": {
        "file": os.path.join(BRAIN_E478, "compact_cars_5000_1788210160736.jpg"),
        "tag": "Budget Sotto 5.000€"
    },
    "auto-usate-sotto-15000-euro-migliori": {
        "file": os.path.join(BRAIN_E478, "suv_crossover_15000_1788210229641.jpg"),
        "tag": "Budget Sotto 15.000€"
    },
    "auto-usate-sotto-20000-euro-premium": {
        "file": os.path.join(BRAIN_E478, "premium_executive_sedans_1788210263986.jpg"),
        "tag": "Premium Sotto 20.000€"
    },
    "migliori-auto-neopatentati-usate-norme": {
        "file": os.path.join(BRAIN_CURRENT, "auto_neopatentati_2026_1788617250605.jpg"),
        "tag": "Neopatentati 2026"
    },
    "migliori-suv-usati-economici-scelta": {
        "file": os.path.join(BRAIN_CURRENT, "dacia_duster_valore_1788617297822.jpg"),
        "tag": "SUV Economici"
    },
    "auto-ibride-usate-conviene-controlli": {
        "file": os.path.join(BRAIN_CURRENT, "batteria_auto_test_1788617185812.jpg"),
        "tag": "Guida Ibrida Usata"
    },
    "diesel-vs-ibrida-usata-confronto": {
        "file": os.path.join(BRAIN_43AC, ".user_uploaded", "media_1788384258532.jpg"),
        "tag": "Diesel vs Ibrida"
    },
    "garanzia-auto-usata-commerciale-legale": {
        "file": os.path.join(BRAIN_PREV1, "bollo_auto_sicilia_1788274693252.jpg"),
        "tag": "Garanzia Legale Usato"
    },
    "controlli-pre-acquisto-auto-usata-lista": {
        "file": os.path.join(BRAIN_PREV1, "motori_12_puretech_1788274716838.jpg"),
        "tag": "Checklist 25 Punti"
    },
    "comprare-auto-da-privato-vs-concessionario": {
        "file": os.path.join(BRAIN_PREV1, "migliori_auto_10000_euro_1788274639689.jpg"),
        "tag": "Privato o Concessionario"
    },
    "aste-auto-usate-come-funzionano-rischi": {
        "file": os.path.join(BRAIN_95CE, ".user_uploaded", "media_1788342964249.jpg"),
        "tag": "Aste Giudiziarie Auto"
    },
    "importare-auto-usata-germania-costi": {
        "file": os.path.join(BRAIN_E478, "story_freelance_siracusa_1788209999332.jpg"),
        "tag": "Importazione Germania"
    },
    "auto-usate-gpl-metano-conviene": {
        "file": os.path.join(BRAIN_PREV1, "fiat_panda_valore_1788274757454.jpg"),
        "tag": "Usato GPL & Metano"
    },
    "auto-elettrica-usata-autonomia-batteria": {
        "file": os.path.join(BRAIN_CURRENT, "turbina_auto_guasto_1788617205772.jpg"),
        "tag": "Elettrico SOH Batteria"
    },
    "chilometri-scalati-auto-usata-truffa": {
        "file": os.path.join(BRAIN_PREV1, "auto_rubate_sicurezza_1788274672128.jpg"),
        "tag": "Truffa Km Scalati"
    },
    "acquisto-auto-con-fermo-amministrativo": {
        "file": os.path.join(BRAIN_PREV2, "investor_banner_clean_1788559411573.jpg"),
        "tag": "Fermo Amministrativo"
    },
    "auto-usata-aziendale-ex-noleggio": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1555215695-3004980ad54e.jpg"),
        "tag": "Auto Aziendali & Flotte"
    },
    "caparra-acquisto-auto-usata-regole": {
        "file": os.path.join(BRAIN_DB27, ".user_uploaded", "media_1788182749670.jpg"),
        "tag": "Caparra & Contratto"
    },
    "auto-usata-per-famiglia-monovolume": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1541899481282-d53bffe3c35d.jpg"),
        "tag": "Auto per Famiglie"
    },
    "auto-usata-sportiva-economica": {
        "file": os.path.join(BRAIN_CURRENT, "alfa_giulietta_usata_1788617321005.jpg"),
        "tag": "Sportive Economiche"
    },
    "passaggio-proprieta-auto-usata-costi": {
        "file": os.path.join(BRAIN_PREV1, "passaggio_proprieta_1788274847188.jpg"),
        "tag": "Costi Passaggio PRA"
    },
    "finanziamento-auto-usata-conviene": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1550355291-bbee04a92027.jpg"),
        "tag": "Finanziamento & Tassi"
    },
    "auto-usate-con-cambio-automatico": {
        "file": os.path.join(BRAIN_PREV1, "cambio_dsg_dq200_1788274870564.jpg"),
        "tag": "Cambio Automatico Usato"
    },
    "auto-usata-per-neopatentati-gpl": {
        "file": os.path.join(BRAIN_PREV1, "fiat_500_valore_1788274775992.jpg"),
        "tag": "Neopatentati a GPL"
    },
    "auto-usate-4x4-fuoristrada-economici": {
        "file": os.path.join(BRAIN_CURRENT, "jeep_renegade_valore_1788617274797.jpg"),
        "tag": "4x4 & Fuoristrada"
    },
    "auto-usata-con-gancio-traino": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1533473359331-0135ef1b58bf.jpg"),
        "tag": "Auto con Gancio Traino"
    },
    "auto-usata-per-citta-citycar": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1549399542-7e3f8b79c341.jpg"),
        "tag": "Migliori Citycar Urbane"
    },
    "auto-usate-con-bassi-consumi": {
        "file": os.path.join(BRAIN_CURRENT, "golf_usata_valore_1788617128150.jpg"),
        "tag": "Bassi Consumi Reali"
    },
    "auto-usata-per-cani-e-animali": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1556189250-72ba954cfc2b.jpg"),
        "tag": "Viaggiare con Animali"
    },
    "auto-usata-garanzia-12-mesi-copertura": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1568605117036-5fe5e7bab0b7.jpg"),
        "tag": "Garanzia 12 Mesi"
    },
    "auto-usata-sito-annunci-sicurezza": {
        "file": os.path.join(BRAIN_CURRENT, "fotografare_auto_vendita_1788617228664.jpg"),
        "tag": "Sicurezza Annunci Web"
    },
    "auto-usata-chilometri-illimitati": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1617814076367-b759c7d7e738.jpg"),
        "tag": "Oltre 150.000 Km"
    },
    "auto-usata-per-lavoro-agenti": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1580273916550-e323be2ae537.jpg"),
        "tag": "Auto per Professionisti"
    },
    "auto-usata-acquisto-online-consegna": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1590362891991-f776e747a588.jpg"),
        "tag": "Acquisto Online & Recesso"
    }
}

# 1. VERIFY 100% 1-TO-1 UNIQUENESS
used_files = [v["file"] for v in MAPPING.values()]
assert len(used_files) == 43, f"Expected 43, got {len(used_files)}"
assert len(set(used_files)) == 43, f"Duplicate base files detected! Unique: {len(set(used_files))}"

# 2. VERIFY EVERY FILE EXISTS
for slug, item in MAPPING.items():
    if not os.path.exists(item["file"]):
        print(f"ERROR: missing file for {slug}: {item['file']}")
        sys.exit(1)

print("SUCCESS: All 43 base files exist and are 100% UNIQUE (NO SHARED BASES)!")

# 3. BUILD COVERS
TARGET_W = 1200
TARGET_H = 630
ACCENT_COLOR = (52, 211, 153) # Emerald green for Acquisto

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

for i, (slug, item) in enumerate(MAPPING.items(), 1):
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

    # Vignette
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
    print(f"{i:2d}/43. [{slug}] -> {sz_kb} KB | {item['tag']} | Source: {base_name}")

print("\nDONE: All 43 covers generated from 43 100% DISTINCT base photos!")
