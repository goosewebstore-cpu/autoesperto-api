import os
import sys
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "apps", "web", "public")
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH = os.path.join(PUBLIC_DIR, "logo-circle.png")

TARGET_W = 1200
TARGET_H = 630

CATEGORY_COLORS = {
    "valutazione": (99, 102, 241),   # Indigo #6366F1
    "acquisto": (52, 211, 153),      # Emerald #34D399
    "vendita": (244, 114, 182),      # Rose #F472B6
    "affidabilita": (244, 63, 94),   # Crimson #F43F5E
}

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\57a131e5-8b93-482d-a52a-c02d88adba84"
BRAIN_PREV_E4 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV_8D = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV_47 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01"

WIKI_CACHE = os.path.join(PROJECT_ROOT, "scripts", "verified_wiki_cache")
MAN_CACHE = os.path.join(PROJECT_ROOT, "scripts", "manutenzione_cache")
AFF_CACHE = os.path.join(PROJECT_ROOT, "scripts", "affidabilita_cache")

MAPPINGS = {
    # -------------------------------------------------------------
    # CATEGORIA VALUTAZIONE (10 modelli specifici)
    # -------------------------------------------------------------
    "quanto-vale-volkswagen-golf-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "vw_golf_seven_1788796670163.jpg"),
        "cat": "valutazione",
        "tag": "Volkswagen Golf 2026"
    },
    "quanto-vale-volkswagen-polo-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "vw_polo_car_1788796743133.jpg"),
        "cat": "valutazione",
        "tag": "Volkswagen Polo 2026"
    },
    "quanto-vale-toyota-yaris-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "toyota_yaris_car_1788796762901.jpg"),
        "cat": "valutazione",
        "tag": "Toyota Yaris Hybrid"
    },
    "quanto-vale-peugeot-208-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "peugeot_208_car_1788796783793.jpg"),
        "cat": "valutazione",
        "tag": "Peugeot 208 2026"
    },
    "quanto-vale-citroen-c3-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "citroen_c3_car_1788796807610.jpg"),
        "cat": "valutazione",
        "tag": "Citroën C3 2026"
    },
    "quanto-vale-dacia-duster-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "dacia_duster_suv_1788796828716.jpg"),
        "cat": "valutazione",
        "tag": "Dacia Duster 2026"
    },
    "quanto-vale-fiat-tipo-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "fiat_tipo_car_1788796846403.jpg"),
        "cat": "valutazione",
        "tag": "Fiat Tipo 2026"
    },
    "quanto-vale-jeep-renegade-usato-2026": {
        "src": os.path.join(BRAIN_CURRENT, "jeep_renegade_suv_1788796865565.jpg"),
        "cat": "valutazione",
        "tag": "Jeep Renegade 2026"
    },
    "quanto-vale-lancia-ypsilon-usata-2026": {
        "src": os.path.join(BRAIN_CURRENT, "lancia_ypsilon_car_1788796886239.jpg"),
        "cat": "valutazione",
        "tag": "Lancia Ypsilon 2026"
    },
    "quanto-vale-nissan-qashqai-usato-2026": {
        "src": os.path.join(BRAIN_CURRENT, "nissan_qashqai_suv_1788796906319.jpg"),
        "cat": "valutazione",
        "tag": "Nissan Qashqai 2026"
    },

    # -------------------------------------------------------------
    # CATEGORIA ACQUISTO (11 guide tematiche)
    # -------------------------------------------------------------
    "comprare-auto-usata-rivenditore-o-privato": {
        "src": os.path.join(BRAIN_CURRENT, "dealer_vs_private_1788796935822.jpg"),
        "cat": "acquisto",
        "tag": "Concessionario vs Privato"
    },
    "garanzia-legale-auto-usata-concessionario": {
        "src": os.path.join(BRAIN_CURRENT, "car_warranty_delivery_1788797014166.jpg"),
        "cat": "acquisto",
        "tag": "Garanzia di Conformità"
    },
    "prova-su-strada-auto-usata-cosa-controllare": {
        "src": os.path.join(BRAIN_CURRENT, "car_test_drive_1788797037209.jpg"),
        "cat": "acquisto",
        "tag": "Test Drive & Controlli"
    },
    "documenti-controllare-prima-comprare-auto-privato": {
        "src": os.path.join(BRAIN_PREV_8D, "passaggio_proprieta_1788274847188.jpg"),
        "cat": "acquisto",
        "tag": "Documenti & Libretto"
    },
    "contachilometri-scalato-come-riconoscerlo": {
        "src": os.path.join(WIKI_CACHE, "odometer_123456km.jpg"),
        "cat": "acquisto",
        "tag": "Chilometri Scalati"
    },
    "comprare-auto-usata-asta-giudiziaria": {
        "src": os.path.join(WIKI_CACHE, "auction.jpg"),
        "cat": "acquisto",
        "tag": "Aste Giudiziarie"
    },
    "auto-neopatentati-2026-regole-potenza": {
        "src": os.path.join(BRAIN_PREV_E4, "auto_neopatentati_2026_1788617250605.jpg"),
        "cat": "acquisto",
        "tag": "Neopatentati 2026"
    },
    "auto-elettriche-usate-sotto-15000-euro": {
        "src": os.path.join(WIKI_CACHE, "ev_charge.jpg"),
        "cat": "acquisto",
        "tag": "Elettriche Economiche"
    },
    "migliori-auto-familiari-usate-15000-euro-2026": {
        "src": os.path.join(BRAIN_PREV_47, "suv_crossover_15000_1788210229641.jpg"),
        "cat": "acquisto",
        "tag": "Auto Familiari Usate"
    },
    "km0-vs-usato-quale-conviene-2026": {
        "src": os.path.join(BRAIN_PREV_47, "used_cars_10k_showroom_1788210056170.jpg"),
        "cat": "acquisto",
        "tag": "Km 0 vs Usato"
    },
    "finanziamento-auto-usata-tan-taeg-rata": {
        "src": os.path.join(WIKI_CACHE, "euro_calculator_1.jpg"),
        "cat": "acquisto",
        "tag": "Finanziamento Auto"
    },

    # -------------------------------------------------------------
    # CATEGORIA VENDITA (7 guide pratiche)
    # -------------------------------------------------------------
    "come-scrivere-annuncio-efficace-vendere-auto": {
        "src": os.path.join(WIKI_CACHE, "financial_chart_blur.jpg"),
        "cat": "vendita",
        "tag": "Annuncio Efficace"
    },
    "preparare-auto-foto-annuncio-vendita": {
        "src": os.path.join(BRAIN_PREV_E4, "fotografare_auto_vendita_1788617228664.jpg"),
        "cat": "vendita",
        "tag": "Foto per l'Annuncio"
    },
    "vendere-auto-usata-subito-it-senza-truffe": {
        "src": os.path.join(WIKI_CACHE, "smartphone_car_dashboard.jpg"),
        "cat": "vendita",
        "tag": "Vendita Subito Sicura"
    },
    "truffe-comuni-vendita-auto-usata": {
        "src": os.path.join(WIKI_CACHE, "handshake_coffee_shop.jpg"),
        "cat": "vendita",
        "tag": "Difesa dalle Truffe"
    },
    "compratore-non-paga-cosa-fare": {
        "src": os.path.join(WIKI_CACHE, "euro_rechner_h.jpg"),
        "cat": "vendita",
        "tag": "Compratore Inadempiente"
    },
    "documenti-necessari-vendere-auto-usata-privatamente": {
        "src": os.path.join(WIKI_CACHE, "mercedes_autoschlussel.jpg"),
        "cat": "vendita",
        "tag": "Documenti per Vendere"
    },
    "permuta-o-vendita-diretta-cosa-conviene": {
        "src": os.path.join(AFF_CACHE, "Car_showroom__Lee_Way__Newport_-_geograph.org.uk_-_6206559.jpg"),
        "cat": "vendita",
        "tag": "Permuta vs Vendita"
    },

    # -------------------------------------------------------------
    # CATEGORIA AFFIDABILITÀ & MECCANICA (8 guide tecniche)
    # -------------------------------------------------------------
    "le-10-auto-usate-piu-affidabili-2026": {
        "src": os.path.join(BRAIN_PREV_8D, "auto_affidabili_classifica_1788274796180.jpg"),
        "cat": "affidabilita",
        "tag": "Classifica Affidabilità"
    },
    "cambio-dsg-doppia-frizione-usato-cosa-controllare": {
        "src": os.path.join(BRAIN_PREV_8D, "cambio_dsg_dq200_1788274870564.jpg"),
        "cat": "affidabilita",
        "tag": "Cambio DSG Usato"
    },
    "cambio-cvt-usato-pregi-difetti": {
        "src": os.path.join(WIKI_CACHE, "toyota_cvt.jpg"),
        "cat": "affidabilita",
        "tag": "Cambio Automatico CVT"
    },
    "batteria-ibrida-usata-durata-affidabilita": {
        "src": os.path.join(BRAIN_PREV_E4, "batteria_auto_test_1788617185812.jpg"),
        "cat": "affidabilita",
        "tag": "Batteria Auto Ibrida"
    },
    "adblue-diesel-cosa-e-quanto-costa": {
        "src": os.path.join(MAN_CACHE, "5l_Diesel_Exhaust_Fluid_canister__cropped_.jpg"),
        "cat": "affidabilita",
        "tag": "Sistema AdBlue Diesel"
    },
    "fap-intasato-diesel-come-riconoscerlo": {
        "src": os.path.join(WIKI_CACHE, "dpf_filter.jpg"),
        "cat": "affidabilita",
        "tag": "FAP / DPF Intasato"
    },
    "cinghia-distribuzione-o-catena-cosa-sapere": {
        "src": os.path.join(MAN_CACHE, "2001_honda_accord_timing_belt-terabass.jpg"),
        "cat": "affidabilita",
        "tag": "Cinghia vs Catena"
    },
    "richiami-auto-come-verificare": {
        "src": os.path.join(WIKI_CACHE, "obd2_diagnostic_man.jpg"),
        "cat": "affidabilita",
        "tag": "Richiami di Sicurezza"
    }
}

def create_badge(tag_text, accent_color):
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
                 fill=(*accent_color, 70))
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r],
                 fill=(*accent_color, 255))
    
    text_x = padding_x + (dot_r * 2 + dot_margin)
    text_y = (badge_h - text_h) // 2 - 1
    draw.text((text_x, text_y), tag_text, font=font, fill=(255, 255, 255, 245))
    return badge

def main():
    print("=" * 80)
    print(f"AutoEsperto: BRANDING & PRODUCTION OF {len(MAPPINGS)} ARTICLE COVERS")
    print("=" * 80)
    
    # 1. Verify sources exist
    missing_sources = []
    for slug, info in MAPPINGS.items():
        if not os.path.exists(info["src"]):
            missing_sources.append((slug, info["src"]))
            
    if missing_sources:
        print(f"ERROR: {len(missing_sources)} source images missing:")
        for s, src in missing_sources:
            print(f"  [{s}] -> {src}")
        return False

    print(f"All {len(MAPPINGS)} source images verified on disk!")

    # 2. Load Logo
    if not os.path.exists(LOGO_PATH):
        print(f"ERROR: Logo not found at {LOGO_PATH}")
        return False
    logo_img = Image.open(LOGO_PATH).convert("RGBA")

    # 3. Process each cover
    for i, (slug, item) in enumerate(MAPPINGS.items(), 1):
        src_file = item["src"]
        cat = item["cat"]
        tag = item["tag"]
        accent_color = CATEGORY_COLORS[cat]

        base = Image.open(src_file).convert("RGBA")
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

        # Gradient Vignette for high legibility
        grad = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
        g_draw = ImageDraw.Draw(grad)
        for y in range(TARGET_H):
            alpha = int((y / TARGET_H) ** 2.2 * 110)
            g_draw.line([(0, y), (TARGET_W, y)], fill=(8, 12, 22, alpha))
        for x in range(350):
            alpha = int(((350 - x) / 350) ** 2.0 * 80)
            g_draw.line([(x, 0), (x, TARGET_H)], fill=(8, 12, 22, alpha))

        final_im = Image.alpha_composite(resized, grad)

        # Top-Right Frosted Glass Logo Pill
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

        # Bottom-Left Category Pill Badge
        badge = create_badge(tag, accent_color)
        badge_x = 40
        badge_y = TARGET_H - badge.size[1] - 40
        final_im.paste(badge, (badge_x, badge_y), badge)

        # Save to destination
        out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
        final_rgb = final_im.convert("RGB")
        final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
        sz_kb = os.path.getsize(out_file) // 1024
        print(f"[{i:02d}/36] Produced: {slug}.jpg ({sz_kb} KB) | [{cat.upper()}] Tag: '{tag}'")

    print("\nSUCCESS: All 36 covers successfully branded and saved to apps/web/public/images/guide/!")
    return True

if __name__ == "__main__":
    main()
