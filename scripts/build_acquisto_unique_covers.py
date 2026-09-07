import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV2   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"
BRAIN_E478    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01"
BRAIN_DB27    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\db279a3e-9763-4c66-b296-6e55c1efbe93"
BRAIN_95CE    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\95ce3926-0d9b-4f17-9b43-ffd512600c7d"
BRAIN_43AC    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\43ac82ea-2c78-4093-9740-96372755aff5"

PUBLIC_DIR    = r"apps\web\public"
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

# Load logo
if os.path.exists(LOGO_PATH):
    logo_img = Image.open(LOGO_PATH).convert("RGBA")
else:
    logo_img = None

# Base image definitions
BASES = {
    "auto_usata_10_segnali": os.path.join(BRAIN_PREV1, "auto_usata_10_segnali_1788274588127.jpg"),
    "diesel_benzina_ibrida": os.path.join(BRAIN_PREV1, "diesel_benzina_ibrida_1788274655894.jpg"),
    "used_cars_10k_showroom": os.path.join(BRAIN_E478, "used_cars_10k_showroom_1788210056170.jpg"),
    "used_car_inspection_signals": os.path.join(BRAIN_E478, "used_car_inspection_signals_1788210016650.jpg"),
    "spie_cruscotto_auto": os.path.join(BRAIN_CURRENT, "spie_cruscotto_auto_1788617111592.jpg"),
    "controlli_pre_acquisto": os.path.join(BRAIN_PREV1, "controlli_pre_acquisto_1788274819833.jpg"),
    "motore_diesel_commonrail": os.path.join(BRAIN_CURRENT, "motore_diesel_commonrail_1788617345579.jpg"),
    "profilo_auto_passaporto": os.path.join(BRAIN_PREV1, "profilo_auto_passaporto_1788274737379.jpg"),
    "budget_citycars_3000": os.path.join(BRAIN_E478, "budget_citycars_3000_1788210099424.jpg"),
    "compact_cars_5000": os.path.join(BRAIN_E478, "compact_cars_5000_1788210160736.jpg"),
    "suv_crossover_15000": os.path.join(BRAIN_E478, "suv_crossover_15000_1788210229641.jpg"),
    "premium_executive_sedans": os.path.join(BRAIN_E478, "premium_executive_sedans_1788210263986.jpg"),
    "auto_neopatentati_2026": os.path.join(BRAIN_CURRENT, "auto_neopatentati_2026_1788617250605.jpg"),
    "dacia_duster_valore": os.path.join(BRAIN_CURRENT, "dacia_duster_valore_1788617297822.jpg"),
    "batteria_auto_test": os.path.join(BRAIN_CURRENT, "batteria_auto_test_1788617185812.jpg"),
    "media_1788384258532": os.path.join(BRAIN_43AC, ".user_uploaded", "media_1788384258532.jpg"),
    "bollo_auto_sicilia": os.path.join(BRAIN_PREV1, "bollo_auto_sicilia_1788274693252.jpg"),
    "motori_12_puretech": os.path.join(BRAIN_PREV1, "motori_12_puretech_1788274716838.jpg"),
    "migliori_auto_10000_euro": os.path.join(BRAIN_PREV1, "migliori_auto_10000_euro_1788274639689.jpg"),
    "media_1788342964249": os.path.join(BRAIN_95CE, ".user_uploaded", "media_1788342964249.jpg"),
    "story_freelance_siracusa": os.path.join(BRAIN_E478, "story_freelance_siracusa_1788209999332.jpg"),
    "fiat_panda_valore": os.path.join(BRAIN_PREV1, "fiat_panda_valore_1788274757454.jpg"),
    "turbina_auto_guasto": os.path.join(BRAIN_CURRENT, "turbina_auto_guasto_1788617205772.jpg"),
    "auto_rubate_sicurezza": os.path.join(BRAIN_PREV1, "auto_rubate_sicurezza_1788274672128.jpg"),
    "investor_banner_clean": os.path.join(BRAIN_PREV2, "investor_banner_clean_1788559411573.jpg"),
    "media_1788182749670": os.path.join(BRAIN_DB27, ".user_uploaded", "media_1788182749670.jpg"),
    "alfa_giulietta_usata": os.path.join(BRAIN_CURRENT, "alfa_giulietta_usata_1788617321005.jpg"),
    "passaggio_proprieta": os.path.join(BRAIN_PREV1, "passaggio_proprieta_1788274847188.jpg"),
    "cambio_dsg_dq200": os.path.join(BRAIN_PREV1, "cambio_dsg_dq200_1788274870564.jpg"),
    "fiat_500_valore": os.path.join(BRAIN_PREV1, "fiat_500_valore_1788274775992.jpg"),
    "jeep_renegade_valore": os.path.join(BRAIN_CURRENT, "jeep_renegade_valore_1788617274797.jpg"),
    "golf_usata_valore": os.path.join(BRAIN_CURRENT, "golf_usata_valore_1788617128150.jpg"),
    "fotografare_auto_vendita": os.path.join(BRAIN_CURRENT, "fotografare_auto_vendita_1788617228664.jpg")
}

# Verify all bases exist
missing = [k for k, p in BASES.items() if not os.path.exists(p)]
if missing:
    print(f"Warning: missing base images: {missing}")
else:
    print(f"All {len(BASES)} base images verified!")

# Detailed recipe for each of the 43 articles
RECIPES = {
    "auto-usata-10-segnali-problema-annuncio": {
        "base": "auto_usata_10_segnali",
        "crop": "center", "flip": False,
        "tag": "10 Segnali D'Allarme"
    },
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": {
        "base": "diesel_benzina_ibrida",
        "crop": "center", "flip": False,
        "tag": "Scelta Motorizzazione"
    },
    "migliori-auto-usate-10000-euro-2026": {
        "base": "used_cars_10k_showroom",
        "crop": "center", "flip": False,
        "tag": "Budget 10.000€"
    },
    "5-cose-da-controllare-prima-comprare-auto-usata": {
        "base": "used_car_inspection_signals",
        "crop": "center", "flip": False,
        "tag": "5 Controlli Chiave"
    },
    "auto-usata-100000-km-conviene-comprare": {
        "base": "spie_cruscotto_auto",
        "crop": "left_macro", "flip": False,
        "tag": "Soglia 100.000 Km"
    },
    "come-capire-se-auto-usata-incidentata": {
        "base": "controlli_pre_acquisto",
        "crop": "right_macro", "flip": False,
        "tag": "Riconoscere Incidenti"
    },
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": {
        "base": "motore_diesel_commonrail",
        "crop": "center", "flip": False,
        "tag": "Diesel Euro 5 & Blocchi"
    },
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": {
        "base": "profilo_auto_passaporto",
        "crop": "center", "flip": False,
        "tag": "Passaporto UE 2026"
    },
    "auto-usate-sotto-3000-euro-guida": {
        "base": "budget_citycars_3000",
        "crop": "center", "flip": False,
        "tag": "Budget Sotto 3.000€"
    },
    "auto-usate-sotto-5000-euro-scelta": {
        "base": "compact_cars_5000",
        "crop": "center", "flip": False,
        "tag": "Budget Sotto 5.000€"
    },
    "auto-usate-sotto-15000-euro-migliori": {
        "base": "suv_crossover_15000",
        "crop": "center", "flip": False,
        "tag": "Budget Sotto 15.000€"
    },
    "auto-usate-sotto-20000-euro-premium": {
        "base": "premium_executive_sedans",
        "crop": "center", "flip": False,
        "tag": "Premium Sotto 20.000€"
    },
    "migliori-auto-neopatentati-usate-norme": {
        "base": "auto_neopatentati_2026",
        "crop": "center", "flip": False,
        "tag": "Neopatentati 2026"
    },
    "migliori-suv-usati-economici-scelta": {
        "base": "dacia_duster_valore",
        "crop": "center", "flip": False,
        "tag": "SUV Economici"
    },
    "auto-ibride-usate-conviene-controlli": {
        "base": "batteria_auto_test",
        "crop": "center", "flip": False,
        "tag": "Guida Ibrida Usata"
    },
    "diesel-vs-ibrida-usata-confronto": {
        "base": "media_1788384258532",
        "crop": "center", "flip": False,
        "tag": "Diesel vs Ibrida"
    },
    "garanzia-auto-usata-commerciale-legale": {
        "base": "bollo_auto_sicilia",
        "crop": "left_macro", "flip": False,
        "tag": "Garanzia Legale Usato"
    },
    "controlli-pre-acquisto-auto-usata-lista": {
        "base": "motori_12_puretech",
        "crop": "center", "flip": False,
        "tag": "Checklist 25 Punti"
    },
    "comprare-auto-da-privato-vs-concessionario": {
        "base": "migliori_auto_10000_euro",
        "crop": "center", "flip": False,
        "tag": "Privato o Concessionario"
    },
    "aste-auto-usate-come-funzionano-rischi": {
        "base": "media_1788342964249",
        "crop": "center", "flip": False,
        "tag": "Aste Giudiziarie Auto"
    },
    "importare-auto-usata-germania-costi": {
        "base": "story_freelance_siracusa",
        "crop": "center", "flip": False,
        "tag": "Importazione Germania"
    },
    "auto-usate-gpl-metano-conviene": {
        "base": "fiat_panda_valore",
        "crop": "center", "flip": False,
        "tag": "Usato GPL & Metano"
    },
    "auto-elettrica-usata-autonomia-batteria": {
        "base": "turbina_auto_guasto",
        "crop": "left_macro", "flip": False,
        "tag": "Elettrico SOH Batteria"
    },
    "chilometri-scalati-auto-usata-truffa": {
        "base": "auto_rubate_sicurezza",
        "crop": "center", "flip": False,
        "tag": "Truffa Km Scalati"
    },
    "acquisto-auto-con-fermo-amministrativo": {
        "base": "bollo_auto_sicilia",
        "crop": "right_macro", "flip": False,
        "tag": "Fermo Amministrativo"
    },
    "auto-usata-aziendale-ex-noleggio": {
        "base": "investor_banner_clean",
        "crop": "right_macro", "flip": False,
        "tag": "Auto Aziendali & Flotte"
    },
    "caparra-acquisto-auto-usata-regole": {
        "base": "media_1788182749670",
        "crop": "center", "flip": False,
        "tag": "Caparra & Contratto"
    },
    "auto-usata-per-famiglia-monovolume": {
        "base": "fiat_panda_valore",
        "crop": "right_macro", "flip": True,
        "tag": "Auto per Famiglie"
    },
    "auto-usata-sportiva-economica": {
        "base": "alfa_giulietta_usata",
        "crop": "center", "flip": False,
        "tag": "Sportive Economiche"
    },
    "passaggio-proprieta-auto-usata-costi": {
        "base": "passaggio_proprieta",
        "crop": "center", "flip": False,
        "tag": "Costi Passaggio PRA"
    },
    "finanziamento-auto-usata-conviene": {
        "base": "investor_banner_clean",
        "crop": "left_macro", "flip": False,
        "tag": "Finanziamento & Tassi"
    },
    "auto-usate-con-cambio-automatico": {
        "base": "cambio_dsg_dq200",
        "crop": "center", "flip": False,
        "tag": "Cambio Automatico Usato"
    },
    "auto-usata-per-neopatentati-gpl": {
        "base": "fiat_500_valore",
        "crop": "center", "flip": False,
        "tag": "Neopatentati a GPL"
    },
    "auto-usate-4x4-fuoristrada-economici": {
        "base": "jeep_renegade_valore",
        "crop": "center", "flip": False,
        "tag": "4x4 & Fuoristrada"
    },
    "auto-usata-con-gancio-traino": {
        "base": "dacia_duster_valore",
        "crop": "left_macro", "flip": True,
        "tag": "Auto con Gancio Traino"
    },
    "auto-usata-per-citta-citycar": {
        "base": "fiat_500_valore",
        "crop": "right_macro", "flip": True,
        "tag": "Migliori Citycar Urbane"
    },
    "auto-usate-con-bassi-consumi": {
        "base": "golf_usata_valore",
        "crop": "center", "flip": False,
        "tag": "Bassi Consumi Reali"
    },
    "auto-usata-per-cani-e-animali": {
        "base": "budget_citycars_3000",
        "crop": "right_macro", "flip": True,
        "tag": "Viaggiare con Animali"
    },
    "auto-usata-garanzia-12-mesi-copertura": {
        "base": "passaggio_proprieta",
        "crop": "left_macro", "flip": True,
        "tag": "Garanzia 12 Mesi"
    },
    "auto-usata-sito-annunci-sicurezza": {
        "base": "fotografare_auto_vendita",
        "crop": "center", "flip": False,
        "tag": "Sicurezza Annunci Web"
    },
    "auto-usata-chilometri-illimitati": {
        "base": "spie_cruscotto_auto",
        "crop": "right_macro", "flip": False,
        "tag": "Oltre 150.000 Km"
    },
    "auto-usata-per-lavoro-agenti": {
        "base": "premium_executive_sedans",
        "crop": "left_macro", "flip": True,
        "tag": "Auto per Professionisti"
    },
    "auto-usata-acquisto-online-consegna": {
        "base": "used_cars_10k_showroom",
        "crop": "right_macro", "flip": True,
        "tag": "Acquisto Online & Recesso"
    }
}

TARGET_W = 1200
TARGET_H = 630
ACCENT_COLOR = (52, 211, 153) # Emerald green for Acquisto

def process_crop(im, crop_type, flip):
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    
    w, h = im.size
    target_ratio = TARGET_W / TARGET_H

    if crop_type == "center":
        current_ratio = w / h
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            im = im.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            im = im.crop((0, top, w, top + new_h))
    elif crop_type == "left_macro":
        # Focus on left 70% of image with zoom
        crop_w = int(w * 0.72)
        crop_h = int(crop_w / target_ratio)
        if crop_h > h:
            crop_h = h
            crop_w = int(h * target_ratio)
        top = (h - crop_h) // 2
        im = im.crop((0, top, crop_w, top + crop_h))
    elif crop_type == "right_macro":
        # Focus on right 70% of image with zoom
        crop_w = int(w * 0.72)
        crop_h = int(crop_w / target_ratio)
        if crop_h > h:
            crop_h = h
            crop_w = int(h * target_ratio)
        left = w - crop_w
        top = (h - crop_h) // 2
        im = im.crop((left, top, w, top + crop_h))
    
    return im.resize((TARGET_W, TARGET_H), Image.Resampling.LANCZOS)

def create_badge(tag_text):
    padding_x = 22
    padding_y = 11
    radius = 12
    
    # Try fonts
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

def build_cover(slug, recipe):
    base_path = BASES[recipe["base"]]
    tag_text = recipe["tag"]
    crop_type = recipe["crop"]
    flip = recipe["flip"]

    base = Image.open(base_path).convert("RGBA")
    processed = process_crop(base, crop_type, flip)

    # Gradient vignette
    grad = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grad)
    for y in range(TARGET_H):
        alpha = int((y / TARGET_H) ** 2.2 * 110)
        g_draw.line([(0, y), (TARGET_W, y)], fill=(8, 12, 22, alpha))
    for x in range(350):
        alpha = int(((350 - x) / 350) ** 2.0 * 80)
        g_draw.line([(x, 0), (x, TARGET_H)], fill=(8, 12, 22, alpha))
    
    final_im = Image.alpha_composite(processed, grad)

    # Watermark logo
    if logo_img:
        l_w, l_h = logo_img.size
        target_logo_h = 44
        target_logo_w = int(l_w * (target_logo_h / l_h))
        scaled_logo = logo_img.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)
        
        # Subtle logo glow badge
        logo_bg = Image.new("RGBA", (target_logo_w + 20, target_logo_h + 16), (0, 0, 0, 0))
        bg_draw = ImageDraw.Draw(logo_bg)
        bg_draw.rounded_rectangle([0, 0, target_logo_w + 19, target_logo_h + 15], radius=10,
                                  fill=(15, 23, 42, 190), outline=(255, 255, 255, 45), width=1)
        logo_bg.paste(scaled_logo, (10, 8), scaled_logo)
        
        logo_x = TARGET_W - (target_logo_w + 20) - 36
        logo_y = 36
        final_im.paste(logo_bg, (logo_x, logo_y), logo_bg)

    # Badge in bottom left
    badge = create_badge(tag_text)
    badge_x = 40
    badge_y = TARGET_H - badge.size[1] - 40
    final_im.paste(badge, (badge_x, badge_y), badge)

    # Save output
    out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
    final_rgb = final_im.convert("RGB")
    final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
    size_kb = os.path.getsize(out_file) // 1024
    return size_kb

print(f"Building {len(RECIPES)} unique covers for categoria 'acquisto'...")
for i, (slug, r) in enumerate(RECIPES.items(), 1):
    sz = build_cover(slug, r)
    print(f"{i:2d}/43. [{slug}] -> {sz} KB | {r['tag']} (base: {r['base']}, crop: {r['crop']}, flip: {r['flip']})")

print("All 43 acquisto covers successfully built!")
