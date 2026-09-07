import os
import sys
import json
from PIL import Image, ImageDraw, ImageFont

PUBLIC_DIR = r"apps\web\public"
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH = os.path.join(PUBLIC_DIR, "logo-circle.png")

TARGET_W = 1200
TARGET_H = 630

CATEGORY_COLORS = {
    "acquisto": (52, 211, 153),      # Emerald #34D399
    "vendita": (244, 114, 182),      # Rose #F472B6
    "valutazione": (99, 102, 241),   # Indigo #6366F1
    "manutenzione": (245, 158, 11),  # Amber #F59E0B
    "affidabilita": (244, 63, 94)    # Crimson #F43F5E
}

MAPPINGS = {
    # 1. Bollo Auto Sicilia 2026: Alfa Giulia on Sicilian coastal scenic highway
    "bollo-auto-sicilia-2026-chi-paga-esenzioni": {
        "file": r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55\bollo_auto_sicilia_1788274693252.jpg",
        "cat": "valutazione",
        "tag": "Bollo Sicilia 2026"
    },
    # 2. Straccia Bollo Sicilia: Official Euro currency calculator
    "straccia-bollo-sicilia-2026-chi-puo-farlo-norme": {
        "file": r"scripts\verified_wiki_cache\euro_calculator_1.jpg",
        "cat": "valutazione",
        "tag": "Straccia Bollo 2026"
    },
    # 3. Profilo Auto Digitale: Woman holding connected car app with Audi Q5
    "profilo-auto-digitale-passaporto-veicolo": {
        "file": r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55\profilo_auto_passaporto_1788274737379.jpg",
        "cat": "manutenzione",
        "tag": "Passaporto Digitale"
    },
    # 4. 10 Fattori che determinano il valore: Technician inspecting modern BMW with tablet in workshop
    "valore-residuo-auto-usata-fattori": {
        "file": r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01\used_car_inspection_signals_1788210016650.jpg",
        "cat": "vendita",
        "tag": "10 Fattori Valore"
    },
    # 5. Passaggio di Proprietà: Official handover of keys over transfer contract
    "passaggio-proprieta-auto-usata-costi": {
        "file": r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55\passaggio_proprieta_1788274847188.jpg",
        "cat": "acquisto",
        "tag": "Passaggio di Proprietà"
    },
    # 6. Doppia Chiave & Manuali: High-res Mercedes smart electronic key fob on desk
    "vendere-auto-usata-con-doppia-chiave": {
        "file": r"scripts\verified_wiki_cache\mercedes_autoschlussel.jpg",
        "cat": "vendita",
        "tag": "Doppia Chiave & Libretto"
    },
    # 7. Vendita tra privati e garanzia: High-res business handshake agreement over coffee & contract
    "vendere-auto-usata-garanzia-tra-privati": {
        "file": r"scripts\verified_wiki_cache\handshake_coffee_shop.jpg",
        "cat": "vendita",
        "tag": "Compravendita Privati"
    },
    # 8. Gestire la trattativa di vendita: Two professionals in sales negotiation discussion over documents
    "trattativa-prezzo-vendita-auto-usata": {
        "file": r"scripts\unsplash_cache\photo-1450133064473-71024230f91b.jpg",
        "cat": "vendita",
        "tag": "Trattativa Prezzo"
    },
    # 9. Tabella Svalutazione auto: Financial market depreciation curves & analytics graph
    "svalutazione-auto-usata-anno-per-anno": {
        "file": r"scripts\verified_wiki_cache\financial_chart_blur.jpg",
        "cat": "valutazione",
        "tag": "Tabella Svalutazione"
    },
    # 10. Visura PRA: Official European vehicle registration certificate (documento unico / telaio / vincoli)
    "visura-pra-auto-usata-cosa-controllare": {
        "file": r"scripts\verified_wiki_cache\zulassungsbescheinigung.jpg",
        "cat": "valutazione",
        "tag": "Visura PRA & Vincoli"
    },
    # 11. Quanto incidono i chilometri: Digital instrument cluster speedometer with "ODO 123456" km
    "valutazione-auto-usata-incidenza-chilometri": {
        "file": r"scripts\verified_wiki_cache\odometer_123456km.jpg",
        "cat": "valutazione",
        "tag": "Chilometraggio Reale"
    },
    # 12. Gli optional che aumentano il valore: Mercedes S-Class luxury interior cockpit with dual screens & ambient LEDs
    "valutazione-auto-usata-incidenza-optional": {
        "file": r"scripts\verified_wiki_cache\mercedes_s_class_interior.jpg",
        "cat": "valutazione",
        "tag": "Optional di Valore"
    },
    # 13. Quanto perde di valore un'auto: Modern dealership showroom with rows of quality used vehicles
    "auto-usate-che-perdono-piu-valore-2026": {
        "file": r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01\used_cars_10k_showroom_1788210056170.jpg",
        "cat": "valutazione",
        "tag": "Perdita di Valore"
    },
    # 14. Cambio olio motore: Mechanic pouring fresh synthetic golden oil with funnel into engine
    "cambio-olio-motore-ogni-quanti-km": {
        "file": r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9\cambio_olio_motore_1788617144886.jpg",
        "cat": "manutenzione",
        "tag": "Cambio Olio Motore"
    },
    # 15. Climatizzatore non raffredda: Automotive Freon R134a refrigerant charging can & hose
    "climatizzatore-auto-non-raffredda-ricarica": {
        "file": r"scripts\verified_wiki_cache\freon_134a.jpg",
        "cat": "manutenzione",
        "tag": "Ricarica Clima R134a"
    },
    # 16. Candele d'accensione: Bosch Super Plus high-performance spark plug
    "candele-e-candelette-sostituzione-sintomi": {
        "file": r"scripts\verified_wiki_cache\bosch_super_plus.jpg",
        "cat": "manutenzione",
        "tag": "Candele d'Accensione"
    },
    # 17. Cuscinetto ruota rombo: Heavy-duty precision deep groove rolling wheel bearing
    "cuscinetti-ruota-rumore-rombo-velocita": {
        "file": r"scripts\verified_wiki_cache\rolling_bearing_60mm.jpg",
        "cat": "manutenzione",
        "tag": "Cuscinetto Ruota"
    },
    # 18. 10 auto da oltre 300.000 km: Iconic indestructible Mercedes-Benz W124 sedan
    "auto-usate-da-300000-km-indistruttibili": {
        "file": r"scripts\verified_wiki_cache\mercedes_w124.jpg",
        "cat": "affidabilita",
        "tag": "Auto da 300.000 Km"
    },
    # 19. Garanzia legale commerciale (acquisto): Vehicle handover with keys
    "garanzia-auto-usata-commerciale-legale": {
        "file": r"scripts\verified_wiki_cache\vehicle_handover_24.jpg",
        "cat": "acquisto",
        "tag": "Garanzia Legale Usato"
    },
    # 20. Spesa annuale reale (valutazione): Digital trip computer & fuel economy display Abarth 500
    "costo-mantenimento-auto-calcolo-annuale": {
        "file": r"scripts\verified_wiki_cache\abarth_500_tft.jpg",
        "cat": "valutazione",
        "tag": "Spesa Annuale Reale"
    },
    # 21. Passaporto digitale regolamento UE (acquisto): Smartphone on modern car dashboard
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": {
        "file": r"scripts\verified_wiki_cache\smartphone_car_dashboard.jpg",
        "cat": "acquisto",
        "tag": "Passaporto UE 2026"
    }
}

# Load Logo
logo_img = Image.open(LOGO_PATH).convert("RGBA") if os.path.exists(LOGO_PATH) else None

def create_badge(tag_text, cat_name):
    accent_color = CATEGORY_COLORS.get(cat_name, (99, 102, 241))
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

print("Processing all 21 covers...")
for i, (slug, item) in enumerate(MAPPINGS.items(), 1):
    src_file = item["file"]
    if not os.path.exists(src_file):
        print(f"ERROR: missing source file: {src_file}")
        sys.exit(1)
        
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

    # Vignette Gradient
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
    badge = create_badge(item["tag"], item["cat"])
    badge_x = 40
    badge_y = TARGET_H - badge.size[1] - 40
    final_im.paste(badge, (badge_x, badge_y), badge)

    out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
    final_rgb = final_im.convert("RGB")
    final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
    sz_kb = os.path.getsize(out_file) // 1024
    base_name = os.path.basename(src_file)
    print(f"{i:2d}/21. [{slug}] -> {sz_kb} KB | [{item['cat'].upper()}] {item['tag']} | Source: {base_name}")

print("\nSUCCESS: All 21 covers updated successfully!")
