import os
import sys
import json
import re
from PIL import Image, ImageDraw, ImageFont

BRAIN_DIR = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
PUBLIC_DIR = r"apps\web\public"
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH = os.path.join(PUBLIC_DIR, "logo-circle.png")

CATEGORY_THEMES = {
    "valutazione": {
        "tag": "Valutazione 2026",
        "color": (56, 189, 248) # Sky blue
    },
    "acquisto": {
        "tag": "Guida Acquisto",
        "color": (52, 211, 153) # Emerald
    },
    "affidabilita": {
        "tag": "Affidabilità & Difetti",
        "color": (251, 191, 36) # Amber
    },
    "manutenzione": {
        "tag": "Manutenzione & Cura",
        "color": (167, 139, 250) # Violet
    },
    "vendita": {
        "tag": "Guida Vendita Usato",
        "color": (244, 114, 182) # Rose/Pink
    },
    "generale": {
        "tag": "AutoEsperto Guida",
        "color": (56, 189, 248)
    }
}

def apply_editorial_branding(
    base_img_path,
    output_path,
    logo_img,
    category_key="valutazione",
    custom_tag=None
):
    try:
        base = Image.open(base_img_path).convert("RGBA")
    except Exception as e:
        print(f"Error opening base image {base_img_path}: {e}")
        return False
        
    target_w, target_h = 1200, 630  # Standard 1.91:1 OpenGraph / Hero ratio
    
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
    
    # Vignette for badge readability
    vignette = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for i in range(170):
        alpha = int(95 * (1 - (i / 170.0)))
        v_draw.line([(0, i), (600, i)], fill=(0, 0, 0, alpha))
    overlay = Image.alpha_composite(overlay, vignette)
    draw = ImageDraw.Draw(overlay)
    
    # Fonts
    try:
        font_brand = ImageFont.truetype("arialbd.ttf", 23)
        font_tag = ImageFont.truetype("arialbd.ttf", 11)
    except:
        font_brand = ImageFont.load_default()
        font_tag = ImageFont.load_default()
        
    theme = CATEGORY_THEMES.get(category_key.lower(), CATEGORY_THEMES["generale"])
    tag_title = (custom_tag or theme["tag"]).upper()
    badge_color = theme["color"]
    
    logo_size = 54
    logo_resized = logo_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    badge_x = 32
    badge_y = 30
    pad_x = 14
    pad_y = 10
    badge_h = logo_size + (pad_y * 2) # 74px
    
    brand_title = "AutoEsperto"
    
    bbox_brand = draw.textbbox((0, 0), brand_title, font=font_brand)
    bbox_tag = draw.textbbox((0, 0), tag_title, font=font_tag)
    
    brand_w = bbox_brand[2] - bbox_brand[0]
    tag_w = bbox_tag[2] - bbox_tag[0]
    content_w = max(brand_w, tag_w)
    
    badge_w = pad_x + logo_size + 14 + content_w + pad_x + 10
    
    # Shadow
    draw.rounded_rectangle(
        [badge_x + 2, badge_y + 4, badge_x + badge_w + 2, badge_y + badge_h + 4],
        radius=20,
        fill=(0, 0, 0, 120)
    )
    
    # Glass Container
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=20,
        fill=(11, 19, 43, 230),  # Deep premium navy
        outline=(255, 255, 255, 55),
        width=1
    )
    
    # Paste Logo
    logo_pos = (badge_x + pad_x, badge_y + pad_y)
    overlay.paste(logo_resized, logo_pos, logo_resized)
    
    # Text Placement
    text_x = badge_x + pad_x + logo_size + 12
    text_y_brand = badge_y + pad_y + 3
    text_y_tag = text_y_brand + 25
    
    draw.text((text_x, text_y_brand), brand_title, fill=(255, 255, 255, 255), font=font_brand)
    
    tag_pad_x = 7
    tag_h = 16
    tag_rect = [
        text_x - 1,
        text_y_tag,
        text_x + tag_w + (tag_pad_x * 2),
        text_y_tag + tag_h
    ]
    draw.rounded_rectangle(
        tag_rect,
        radius=4,
        fill=(badge_color[0], badge_color[1], badge_color[2], 50),
        outline=(badge_color[0], badge_color[1], badge_color[2], 130),
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
    print("--- Starting AutoEsperto Article Image Branding Pipeline ---")
    logo = Image.open(LOGO_PATH).convert("RGBA")
    print(f"Loaded logo from {LOGO_PATH} (size: {logo.size})")
    
    # 1. Map High-Resolution AI Generated Photos to specific target article files
    ai_photo_mappings = [
        {
            "source": os.path.join(BRAIN_DIR, "autoesperto_freelance_story_1788274625545.jpg"),
            "targets": [
                "autoesperto-freelance-siciliano-dati-reali-mercato-usato.jpg",
                "autoesperto-freelance-siciliano-dati-mercato-usato.jpg"
            ],
            "category": "valutazione",
            "tag": "Storia & Dati Reali"
        },
        {
            "source": os.path.join(BRAIN_DIR, "auto_usata_10_segnali_1788274588127.jpg"),
            "targets": [
                "auto-usata-10-segnali-problema-annuncio.jpg",
                "10-segnali-annuncio-auto-usata.jpg"
            ],
            "category": "acquisto",
            "tag": "10 Segnali D'Allarme"
        },
        {
            "source": os.path.join(BRAIN_DIR, "migliori_auto_10000_euro_1788274639689.jpg"),
            "targets": [
                "migliori-auto-usate-10000-euro-2026.jpg",
                "auto-usate-sotto-15000-euro-migliori.jpg",
                "auto-usate-sotto-5000-euro-scelta.jpg",
                "auto-usate-sotto-3000-euro-guida.jpg",
                "auto-usate-sotto-20000-euro-premium.jpg",
                "migliori-suv-usati-economici-scelta.jpg"
            ],
            "category": "acquisto",
            "tag": "Migliori Usate 2026"
        },
        {
            "source": os.path.join(BRAIN_DIR, "diesel_benzina_ibrida_1788274655894.jpg"),
            "targets": [
                "diesel-benzina-ibrida-2026-quale-comprare-conviene.jpg",
                "diesel-vs-ibrida-usata-confronto.jpg",
                "auto-ibride-usate-conviene-controlli.jpg",
                "auto-elettrica-usata-autonomia-batteria.jpg",
                "affidabilita-auto-ibride-toyota-hsd.jpg",
                "affidabilita-auto-elettriche-usate-motore-inverter.jpg",
                "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi.jpg"
            ],
            "category": "acquisto",
            "tag": "Confronto Motori 2026"
        },
        {
            "source": os.path.join(BRAIN_DIR, "auto_rubate_sicurezza_1788274672128.jpg"),
            "targets": [
                "le-10-auto-piu-rubate-italia-2026.jpg",
                "fiat-panda-500-rubate-sicilia-come-proteggersi.jpg"
            ],
            "category": "affidabilita",
            "tag": "Classifica & Difesa"
        },
        {
            "source": os.path.join(BRAIN_DIR, "bollo_auto_sicilia_1788274693252.jpg"),
            "targets": [
                "straccia-bollo-sicilia-2026-chi-puo-farlo-norme.jpg",
                "bollo-auto-sicilia-2026-chi-paga-esenzioni.jpg",
                "quanto-costa-mantenere-auto-2026-spese-reali.jpg"
            ],
            "category": "valutazione",
            "tag": "Normative & Fisco"
        },
        {
            "source": os.path.join(BRAIN_DIR, "motori_12_puretech_1788274716838.jpg"),
            "targets": [
                "motori-12-puretech-problemi-cinghia-bagno-olio.jpg",
                "cinghia-distribuzione-vs-catena-scadenza.jpg",
                "motore-ford-10-ecoboost-cinghia-bagno-olio.jpg",
                "motori-15-bluehdi-stellantis-catena-camme.jpg",
                "motori-15-dci-renault-affidabilita-bronzine.jpg",
                "motori-13-multijet-fiat-affidabilita-catena.jpg",
                "motori-bmw-n47-problema-catena-distribuzione.jpg",
                "motori-3-cilindri-turbo-affidabilita.jpg"
            ],
            "category": "affidabilita",
            "tag": "Guida Tecnica Motori"
        },
        {
            "source": os.path.join(BRAIN_DIR, "profilo_auto_passaporto_1788274737379.jpg"),
            "targets": [
                "profilo-auto-digitale-passaporto-veicolo.jpg",
                "passaporto-digitale-veicolo-regolamento-ue-2026-1738.jpg"
            ],
            "category": "manutenzione",
            "tag": "Passaporto Digitale"
        },
        {
            "source": os.path.join(BRAIN_DIR, "fiat_panda_valore_1788274757454.jpg"),
            "targets": [
                "quanto-vale-fiat-panda-usata-2026.jpg",
                "quanto-vale-fiat-panda-usata-quotazione.jpg"
            ],
            "category": "valutazione",
            "tag": "Quotazione Fiat Panda"
        },
        {
            "source": os.path.join(BRAIN_DIR, "fiat_500_valore_1788274775992.jpg"),
            "targets": [
                "quanto-vale-fiat-500-usata-2026-prezzi-controlli.jpg",
                "quanto-vale-fiat-500-usata-quotazione.jpg"
            ],
            "category": "valutazione",
            "tag": "Quotazione Fiat 500"
        },
        {
            "source": os.path.join(BRAIN_DIR, "auto_affidabili_classifica_1788274796180.jpg"),
            "targets": [
                "10-auto-piu-affidabili-usate-2026.jpg",
                "affidabilita-marchi-auto-classifica-2026.jpg",
                "auto-usate-da-300000-km-indistruttibili.jpg",
                "motori-benzina-piu-affidabili-usato.jpg",
                "motori-diesel-piu-affidabili-usato.jpg"
            ],
            "category": "affidabilita",
            "tag": "Report Affidabilità"
        },
        {
            "source": os.path.join(BRAIN_DIR, "controlli_pre_acquisto_1788274819833.jpg"),
            "targets": [
                "5-cose-da-controllare-prima-comprare-auto-usata.jpg",
                "controlli-pre-acquisto-auto-usata-lista.jpg",
                "come-capire-se-auto-usata-incidentata.jpg",
                "chilometri-scalati-auto-usata-truffa.jpg",
                "auto-usata-100000-km-conviene-comprare.jpg"
            ],
            "category": "acquisto",
            "tag": "Checklist Ispezione"
        },
        {
            "source": os.path.join(BRAIN_DIR, "passaggio_proprieta_1788274847188.jpg"),
            "targets": [
                "passaggio-proprieta-auto-usata-costi.jpg",
                "calcolo-ipt-passaggio-proprieta-province.jpg",
                "atto-di-vendita-auto-usata-autentica.jpg",
                "visura-pra-auto-usata-cosa-controllare.jpg",
                "acquisto-auto-con-fermo-amministrativo.jpg",
                "caparra-acquisto-auto-usata-regole.jpg",
                "consegna-auto-usata-verbale-passaggio.jpg"
            ],
            "category": "acquisto",
            "tag": "Pratiche & Passaggio"
        },
        {
            "source": os.path.join(BRAIN_DIR, "cambio_dsg_dq200_1788274870564.jpg"),
            "targets": [
                "cambio-dsg-dq200-volkswagen-problemi-frizione.jpg",
                "cambi-automatici-piu-affidabili-classifica.jpg",
                "cambio-automatico-manutenzione-lavaggio.jpg",
                "problemi-cambio-cvt-nissan-jatco.jpg",
                "frizione-e-volano-bimassa-sintomi-costi.jpg",
                "problemi-volano-monomassa-vs-bimassa.jpg"
            ],
            "category": "affidabilita",
            "tag": "Cambi & Trasmissioni"
        }
    ]
    
    updated_files = set()
    
    # Process AI photo mappings
    for mapping in ai_photo_mappings:
        src = mapping["source"]
        if not os.path.exists(src):
            print(f"Warning: source file not found: {src}")
            continue
        for target_name in mapping["targets"]:
            out_path = os.path.join(GUIDE_IMG_DIR, target_name)
            success = apply_editorial_branding(
                src,
                out_path,
                logo,
                category_key=mapping["category"],
                custom_tag=mapping["tag"]
            )
            if success:
                updated_files.add(target_name)
                print(f"[OK] AI Photo Branded -> {target_name} ({mapping['tag']})")
                
    # Also load all guides to ensure every guide image in guides.ts has branding applied
    with open("scratch/all_guides.json", "r", encoding="utf-8") as f:
        all_guides = json.load(f)
        
    for g in all_guides:
        img_rel = g.get("image")
        if not img_rel:
            continue
        file_name = os.path.basename(img_rel)
        if file_name in updated_files:
            continue # already processed with AI photo
            
        target_path = os.path.join(GUIDE_IMG_DIR, file_name)
        if os.path.exists(target_path):
            # Apply branding to the existing image
            success = apply_editorial_branding(
                target_path,
                target_path,
                logo,
                category_key=g.get("category", "valutazione")
            )
            if success:
                updated_files.add(file_name)
                print(f"[OK] Branded existing -> {file_name}")

    print(f"\nAll done! Processed and branded {len(updated_files)} guide article images.")

if __name__ == "__main__":
    main()
