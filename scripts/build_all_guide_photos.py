import os
import sys
import json
from PIL import Image, ImageDraw, ImageFont

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV2 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"

PUBLIC_DIR = r"apps\web\public"
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH = os.path.join(PUBLIC_DIR, "logo-circle.png")

PHOTO_SOURCES = {
    # Newly generated in this session:
    "spie_cruscotto": os.path.join(BRAIN_CURRENT, "spie_cruscotto_auto_1788617111592.jpg"),
    "golf_valore": os.path.join(BRAIN_CURRENT, "golf_usata_valore_1788617128150.jpg"),
    "cambio_olio": os.path.join(BRAIN_CURRENT, "cambio_olio_motore_1788617144886.jpg"),
    "freni_dischi": os.path.join(BRAIN_CURRENT, "freni_auto_dischi_1788617164014.jpg"),
    "batteria_test": os.path.join(BRAIN_CURRENT, "batteria_auto_test_1788617185812.jpg"),
    "turbina_guasto": os.path.join(BRAIN_CURRENT, "turbina_auto_guasto_1788617205772.jpg"),
    "fotografare_auto": os.path.join(BRAIN_CURRENT, "fotografare_auto_vendita_1788617228664.jpg"),
    "neopatentati": os.path.join(BRAIN_CURRENT, "auto_neopatentati_2026_1788617250605.jpg"),
    "jeep_renegade": os.path.join(BRAIN_CURRENT, "jeep_renegade_valore_1788617274797.jpg"),
    "dacia_duster": os.path.join(BRAIN_CURRENT, "dacia_duster_valore_1788617297822.jpg"),
    "alfa_giulietta": os.path.join(BRAIN_CURRENT, "alfa_giulietta_usata_1788617321005.jpg"),
    "motore_diesel_cp4": os.path.join(BRAIN_CURRENT, "motore_diesel_commonrail_1788617345579.jpg"),
    "pneumatici": os.path.join(BRAIN_CURRENT, "pneumatici_usura_controllo_1788617369864.jpg"),
    
    # High-quality from previous sessions:
    "fiat_panda": os.path.join(BRAIN_PREV1, "fiat_panda_valore_1788274757454.jpg"),
    "fiat_500": os.path.join(BRAIN_PREV1, "fiat_500_valore_1788274775992.jpg"),
    "puretech_cinghia": os.path.join(BRAIN_PREV1, "motori_12_puretech_1788274716838.jpg"),
    "cambio_dsg": os.path.join(BRAIN_PREV1, "cambio_dsg_dq200_1788274870564.jpg"),
    "passaggio_proprieta": os.path.join(BRAIN_PREV1, "passaggio_proprieta_1788274847188.jpg"),
    "controlli_pre_acquisto": os.path.join(BRAIN_PREV1, "controlli_pre_acquisto_1788274819833.jpg"),
    "auto_affidabili": os.path.join(BRAIN_PREV1, "auto_affidabili_classifica_1788274796180.jpg"),
    "auto_rubate": os.path.join(BRAIN_PREV1, "auto_rubate_sicurezza_1788274672128.jpg"),
    "bollo_sicilia": os.path.join(BRAIN_PREV1, "bollo_auto_sicilia_1788274693252.jpg"),
    "diesel_benzina_ibrida": os.path.join(BRAIN_PREV1, "diesel_benzina_ibrida_1788274655894.jpg"),
    "auto_10000_euro": os.path.join(BRAIN_PREV1, "migliori_auto_10000_euro_1788274639689.jpg"),
    "freelance_story": os.path.join(BRAIN_PREV1, "autoesperto_freelance_story_1788274625545.jpg"),
    "passaporto_qr": os.path.join(BRAIN_PREV1, "profilo_auto_passaporto_1788274737379.jpg"),
    "investitori": os.path.join(BRAIN_PREV2, "investor_banner_clean_1788559411573.jpg"),
    "10_segnali": os.path.join(BRAIN_PREV1, "auto_usata_10_segnali_1788274588127.jpg")
}

CATEGORY_THEMES = {
    "valutazione": {"tag": "Valutazione 2026", "color": (56, 189, 248)}, # Sky blue
    "acquisto": {"tag": "Guida Acquisto", "color": (52, 211, 153)},     # Emerald
    "affidabilita": {"tag": "Affidabilità & Difetti", "color": (251, 191, 36)}, # Amber
    "manutenzione": {"tag": "Manutenzione & Cura", "color": (167, 139, 250)},   # Violet
    "vendita": {"tag": "Guida Vendita Usato", "color": (244, 114, 182)},        # Rose/Pink
    "generale": {"tag": "AutoEsperto Guida", "color": (56, 189, 248)}
}

def match_guide(guide):
    slug = guide.get('slug', '').lower()
    title = guide.get('title', '').lower()
    desc = guide.get('description', '').lower()
    cat = guide.get('category', '').lower()
    text = f"{slug} {title} {desc}"

    # Specific special guides
    if "investitor" in text:
        return "investitori", "Investi in AutoEsperto"
    if "freelance" in text or "storia-autoesperto" in text:
        return "freelance_story", "Storia & Dati Reali"
    if "passaporto" in text or "qr" in text:
        return "passaporto_qr", "Profilo Digitale"
    if "bollo" in text or "sicilia" in text or "straccia-bollo" in text:
        return "bollo_sicilia", "Normative & Fisco"
    if "rubat" in text or "furto" in text or "antifurto" in text or "allarme" in text:
        return "auto_rubate", "Sicurezza & Antifurto"
    if "neopatentat" in text:
        return "neopatentati", "Guida Neopatentati"

    # Specific car models
    if "golf" in text or ("volkswagen" in text and "quanto-vale" in text):
        return "golf_valore", "Quotazione Golf"
    if "duster" in text or ("dacia" in text and "quanto-vale" in text):
        return "dacia_duster", "Quotazione Dacia"
    if "giulietta" in text or ("alfa-romeo" in text and "quanto-vale" in text):
        return "alfa_giulietta", "Quotazione Alfa"
    if "renegade" in text or "jeep" in text:
        return "jeep_renegade", "Quotazione Jeep"
    if "panda" in text:
        return "fiat_panda", "Quotazione Panda"
    if "500" in text or "abarth" in text:
        return "fiat_500", "Quotazione Fiat 500"

    # Mechanics & Technical
    if "spie" in text or "spia" in text or "cruscotto" in text or "quadro" in text or "anomalia" in text or "avaria" in text:
        return "spie_cruscotto", "Spie Cruscotto"
    if "olio" in text or "tagliando" in text or "lubrificante" in text or "filtro-olio" in text:
        return "cambio_olio", "Tagliando & Olio"
    if "fren" in text or "pastigli" in text or "dischi" in text or "liquido-freni" in text:
        return "freni_dischi", "Impianto Frenante"
    if "batteri" in text or "start-stop" in text or "alternatore" in text or "motorino-avviamento" in text or "elettric" in text:
        return "batteria_test", "Batteria & Elettronica"
    if "turbin" in text or "turbo" in text or "fumo-blu" in text:
        return "turbina_guasto", "Turbina & Sovralimentazione"
    if "pneumatic" in text or "gomm" in text or "pressione" in text or "battistrada" in text or "inversione" in text:
        return "pneumatici", "Gomme & Battistrada"
    if "ammortizzator" in text or "sospension" in text or "braccett" in text or "silentblock" in text or "cuscinett" in text or "sterzo" in text:
        return "freni_dischi", "Assetto & Sospensioni"
    if "cp4" in text or "iniettor" in text or "common" in text or "rail" in text or "jtdm" in text or "tdi" in text or "pompa" in text:
        return "motore_diesel_cp4", "Motore & Iniezione"
    if "puretech" in text or "cinghia" in text or "distribuzione" in text or "catena" in text or "n47" in text or "ea111" in text or "valvol" in text:
        return "puretech_cinghia", "Distribuzione Motore"
    if "dsg" in text or "cambio" in text or "frizione" in text or "trasmissione" in text:
        return "cambio_dsg", "Cambio & Meccatronica"
    if "dpf" in text or "fap" in text or "catalizzator" in text or "scarico" in text or "egr" in text or "sonda" in text:
        return "turbina_guasto", "Scarico & Filtro FAP"
    if "clima" in text or "condizionat" in text or "raffredda" in text or "aria" in text:
        return "puretech_cinghia", "Climatizzatore & Impianto"

    # Selling guides
    if "foto" in text or "annuncio" in text or "fotografare" in text or "immagini" in text:
        return "fotografare_auto", "Foto Annuncio Perfette"
    if "vend" in text or "permuta" in text or "trattativa" in text or "prezzo" in text or "compro" in text:
        return "passaggio_proprieta", "Guida Vendita Usato"
    if "passaggio" in text or "atto" in text or "pra" in text or "radiazione" in text or "documenti" in text or "bonifico" in text:
        return "passaggio_proprieta", "Pratiche & Passaggio"

    # Valuation & Models
    if cat == "valutazione" or "quotazion" in text or "svalutazion" in text or "valore" in text:
        if "yaris" in text or "clio" in text or "fiesta" in text or "c3" in text or "208" in text or "ypsilon" in text:
            return "golf_valore", "Valutazione Usato 2026"
        return "golf_valore", "Valutazione Mercato 2026"

    # Buying
    if "10-segnali" in text or "segnali" in text or "truff" in text or "control" in text or "verific" in text:
        return "10_segnali", "10 Segnali D'Allarme"
    if "affidabil" in text or "classifica" in text or "miglior" in text:
        return "auto_affidabili", "Classifica Affidabilità"
    if "gpl" in text or "metano" in text or "diesel" in text or "ibrid" in text or "elettric" in text or "consum" in text:
        return "diesel_benzina_ibrida", "Scelta Alimentazione"
    if "10000" in text or "econom" in text or "budget" in text or "usate-da" in text:
        return "auto_10000_euro", "Migliori Auto Economiche"

    # Default fallback per category
    if cat == "acquisto":
        return "controlli_pre_acquisto", "Guida Acquisto"
    elif cat == "vendita":
        return "passaggio_proprieta", "Guida Vendita"
    elif cat == "manutenzione":
        return "cambio_olio", "Manutenzione & Cura"
    elif cat == "affidabilita":
        return "auto_affidabili", "Affidabilità & Difetti"
    else:
        return "golf_valore", "Valutazione 2026"

def apply_editorial_branding(base_img_path, output_path, logo_img, category_key="valutazione", custom_tag=None):
    try:
        base = Image.open(base_img_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening {base_img_path}: {e}")
        return False

    target_w, target_h = 1200, 630
    img_ratio = base.width / base.height
    target_ratio = target_w / target_h

    if img_ratio > target_ratio:
        new_h = target_h
        new_w = int(target_h * img_ratio)
    else:
        new_w = target_w
        new_h = int(target_w / img_ratio)

    base_resized = base.resize((new_w, new_h), Image.Resampling.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    base_cropped = base_resized.crop((left, top, left + target_w, top + target_h))

    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Vignette top-left
    vignette = Image.new("RGBA", (550, 260), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for r in range(240, 0, -5):
        alpha = int(90 * (1 - r / 240))
        v_draw.rounded_rectangle([0, 0, r * 2.2, r], radius=25, fill=(0, 0, 0, alpha))
    overlay.paste(vignette, (0, 0), vignette)

    # Fonts
    try:
        font_brand = ImageFont.truetype("arialbd.ttf", 23)
        font_tag = ImageFont.truetype("arialbd.ttf", 10)
    except:
        font_brand = ImageFont.load_default()
        font_tag = ImageFont.load_default()

    brand_title = "AutoEsperto"
    cat_info = CATEGORY_THEMES.get(category_key, CATEGORY_THEMES["generale"])
    tag_title = (custom_tag or cat_info["tag"]).upper()
    badge_color = cat_info["color"]

    logo_size = 46
    logo_resized = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    bbox_brand = draw.textbbox((0, 0), brand_title, font=font_brand)
    brand_w = bbox_brand[2] - bbox_brand[0]
    bbox_tag = draw.textbbox((0, 0), tag_title, font=font_tag)
    tag_w = bbox_tag[2] - bbox_tag[0]

    content_w = max(brand_w, tag_w + 14)
    pad_x, pad_y = 16, 12
    badge_w = logo_size + 14 + content_w + (pad_x * 2)
    badge_h = logo_size + (pad_y * 2)
    badge_x, badge_y = 32, 32

    # Glass container
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=18,
        fill=(11, 19, 43, 235),
        outline=(255, 255, 255, 60),
        width=1
    )

    # Paste Logo
    overlay.paste(logo_resized, (badge_x + pad_x, badge_y + pad_y), logo_resized)

    # Text Placement
    text_x = badge_x + pad_x + logo_size + 12
    text_y_brand = badge_y + pad_y + 3
    text_y_tag = text_y_brand + 25

    draw.text((text_x, text_y_brand), brand_title, fill=(255, 255, 255, 255), font=font_brand)

    tag_pad_x = 7
    tag_h = 16
    draw.rounded_rectangle(
        [text_x - 1, text_y_tag, text_x + tag_w + (tag_pad_x * 2), text_y_tag + tag_h],
        radius=4,
        fill=(badge_color[0], badge_color[1], badge_color[2], 55),
        outline=(badge_color[0], badge_color[1], badge_color[2], 140),
        width=1
    )
    draw.text((text_x + tag_pad_x, text_y_tag + 1), tag_title, fill=(badge_color[0], badge_color[1], badge_color[2], 255), font=font_tag)

    # Bottom Right Logo Stamp
    wm_size = 38
    wm_logo = logo_img.resize((wm_size, wm_size), Image.Resampling.LANCZOS)
    wm_x = target_w - wm_size - 28
    wm_y = target_h - wm_size - 24
    draw.ellipse([wm_x - 4, wm_y - 4, wm_x + wm_size + 4, wm_y + wm_size + 4], fill=(0, 0, 0, 110))
    overlay.paste(wm_logo, (wm_x, wm_y), wm_logo)

    final = Image.alpha_composite(base_cropped, overlay)
    final_rgb = final.convert("RGB")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_rgb.save(output_path, "JPEG", quality=92, optimize=True)
    return True

def main():
    print("--- Starting AutoEsperto Full Guide Image Generation & Branding Pipeline ---")
    logo = Image.open(LOGO_PATH).convert("RGBA")
    print(f"Loaded logo from {LOGO_PATH} (size: {logo.size})")

    with open('scratch_guides_parsed.json', 'r', encoding='utf-8') as f:
        guides = json.load(f)

    print(f"Processing all {len(guides)} guides...")

    success = 0
    errors = 0

    for i, g in enumerate(guides, 1):
        source_key, tag = match_guide(g)
        source_img = PHOTO_SOURCES.get(source_key)
        if not source_img or not os.path.exists(source_img):
            print(f"[{i}/{len(guides)}] ERROR: Missing source '{source_key}' for {g['slug']}")
            errors += 1
            continue

        img_rel = g['image'].lstrip('/')
        target_path = os.path.join(PUBLIC_DIR, img_rel)

        ok = apply_editorial_branding(
            base_img_path=source_img,
            output_path=target_path,
            logo_img=logo,
            category_key=g.get('category', 'generale'),
            custom_tag=tag
        )

        if ok:
            success += 1
            if i % 25 == 0 or i == len(guides):
                print(f"[{i}/{len(guides)}] Processed {g['slug']} -> {source_key} ({tag})")
        else:
            errors += 1

    print(f"\nCOMPLETED: {success} images successfully branded, {errors} errors.")

if __name__ == "__main__":
    main()
