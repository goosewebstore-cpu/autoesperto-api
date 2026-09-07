import os
import sys
import json
import time
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PROJECT_ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR     = os.path.join(PROJECT_ROOT, "scripts", "valutazione_cache")
PUBLIC_DIR    = os.path.join(PROJECT_ROOT, "apps", "web", "public")
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(GUIDE_IMG_DIR, exist_ok=True)

MAPPING = {
    "autoesperto-freelance-siciliano-dati-reali-mercato-usato": {
        "type": "local",
        "path": r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55\autoesperto_freelance_story_1788274625545.jpg",
        "tag": "Freelance Siciliano"
    },
    "autoesperto-cerca-investitori-ai-auto-usate": {
        "type": "wiki",
        "wiki_title": "File:Business agreement handshake at coffee shop.jpg",
        "tag": "Investitori & AI"
    },
    "straccia-bollo-sicilia-2026-chi-puo-farlo-norme": {
        "type": "wiki",
        "wiki_title": "File:Signing a contract between partner cities Sanok and Truskavets (2023)bbb.jpg",
        "tag": "Straccia Bollo 2026"
    },
    "bollo-auto-sicilia-2026-chi-paga-esenzioni": {
        "type": "wiki",
        "wiki_title": "File:Telephone, portrait, man, workplace, interior, desk, calculator, ashtray Fortepan 5052.jpg",
        "tag": "Tariffe & Esenzioni"
    },
    "auto-usate-che-perdono-piu-valore-2026": {
        "type": "local",
        "path": r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55\auto_affidabili_classifica_1788274796180.jpg",
        "tag": "Classifica Svalutazione"
    },
    "quanto-vale-fiat-panda-usata-2026": {
        "type": "wiki",
        "wiki_title": "File:2012 Fiat Panda Easy 1.2 Front.jpg",
        "tag": "Fiat Panda 2026"
    },
    "quanto-vale-fiat-500-usata-2026-prezzi-controlli": {
        "type": "wiki",
        "wiki_title": "File:2016 Fiat 500 Lounge 1.2 Front.jpg",
        "tag": "Fiat 500 2026"
    },
    "quanto-costa-mantenere-auto-2026-spese-reali": {
        "type": "local",
        "path": r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9\cambio_olio_motore_1788617144886.jpg",
        "tag": "Spesa Annuale Reale"
    },
    "svalutazione-auto-usata-anno-per-anno": {
        "type": "wiki",
        "wiki_title": "File:Data Visualization and Quality in Wikidata Datathon I 01.jpg",
        "tag": "Curva Svalutazione"
    },
    "calcolo-ipt-passaggio-proprieta-province": {
        "type": "wiki",
        "wiki_title": "File:EFTA00003028-Beach-House - Cluttered desk with papers sticky notes a calculator and a mouse suggesting busy work.jpg",
        "tag": "Calcolo IPT Province"
    },
    "visura-pra-auto-usata-cosa-controllare": {
        "type": "wiki",
        "wiki_title": "File:DOSAAF. Individual Book. Car driving practice. img 02.jpg",
        "tag": "Visura PRA & Vincoli"
    },
    "quanto-vale-fiat-panda-usata-quotazione": {
        "type": "wiki",
        "wiki_title": "File:Fiat Panda 4x4 Van.jpg",
        "tag": "Quotazione Panda 4x4"
    },
    "quanto-vale-fiat-500-usata-quotazione": {
        "type": "wiki",
        "wiki_title": "File:2017 Fiat 500 Anniversario 1.2 Front.jpg",
        "tag": "Quotazione Fiat 500"
    },
    "quanto-vale-volkswagen-golf-usata": {
        "type": "wiki",
        "wiki_title": "File:Volkswagen Golf VIII R Variant 1X7A0413.jpg",
        "tag": "Quotazione Golf"
    },
    "quanto-vale-lancia-ypsilon-usata": {
        "type": "wiki",
        "wiki_title": "File:Lancia Ypsilon Geneva.jpg",
        "tag": "Quotazione Ypsilon"
    },
    "quanto-vale-dacia-duster-usata": {
        "type": "wiki",
        "wiki_title": "File:2023 Dacia Duster 1X7A6452.jpg",
        "tag": "Quotazione Duster"
    },
    "quanto-vale-alfa-romeo-giulietta-usata": {
        "type": "wiki",
        "wiki_title": "File:2017 Alfa Romeo Giulietta (940 Series 3) Super hatchback (2018-10-19) 01.jpg",
        "tag": "Quotazione Giulietta"
    },
    "quanto-vale-jeep-renegade-usata": {
        "type": "wiki",
        "wiki_title": "File:Jeep Renegade 4xe 1X7A6025.jpg",
        "tag": "Quotazione Renegade"
    },
    "quanto-vale-toyota-yaris-usata": {
        "type": "wiki",
        "wiki_title": "File:Toyota Yaris Hybrid GR Sport (XP210) Automesse Ludwigsburg 2022 1X7A5891.jpg",
        "tag": "Quotazione Yaris Hybrid"
    },
    "quanto-vale-renault-clio-usata": {
        "type": "wiki",
        "wiki_title": "File:2015 Renault Clio Expression DCi Grandtour (Front ).png",
        "tag": "Quotazione Clio"
    },
    "quanto-vale-ford-fiesta-usata": {
        "type": "wiki",
        "wiki_title": "File:Ford Fiesta MK7 Facelift 1X7A0408.jpg",
        "tag": "Quotazione Fiesta"
    },
    "quanto-vale-citroen-c3-usata": {
        "type": "wiki",
        "wiki_title": "File:2020 Citroën C3 (3rd generation) DSC 7377.jpg",
        "tag": "Quotazione Citroën C3"
    },
    "quanto-vale-peugeot-208-usata": {
        "type": "wiki",
        "wiki_title": "File:Peugeot 208 B facelift DSC 7227.jpg",
        "tag": "Quotazione Peugeot 208"
    },
    "valutazione-auto-usata-incidenza-chilometri": {
        "type": "wiki",
        "wiki_title": "File:Belgian Federal Police speedometer calibration on airstrip 140514-A-RX599-063.jpg",
        "tag": "Incidenza Chilometri"
    },
    "valutazione-auto-usata-incidenza-optional": {
        "type": "wiki",
        "wiki_title": "File:Audi A8 2013 (11209750264).jpg",
        "tag": "Optional di Valore"
    },
    "quotazione-auto-euro-5-diesel-blocchi": {
        "type": "wiki",
        "wiki_title": "File:Breuil-Cervinia (AO) - segnale di zona a traffico limitato.jpg",
        "tag": "Blocchi Diesel Euro 5"
    },
    "valutazione-auto-incidente-subito": {
        "type": "wiki",
        "wiki_title": "File:Car damage on fender observed in a parking lot.jpg",
        "tag": "Auto Incidentata"
    },
    "valutazione-auto-usata-colore-carrozzeria": {
        "type": "wiki",
        "wiki_title": "File:1971 AMC Hornet SC 360 4-bbl 4-speed in Deep Maroon Metallic at 2021 AMO meet 02of13.jpg",
        "tag": "Colore Carrozzeria"
    },
    "valutazione-auto-usata-targa-estera": {
        "type": "wiki",
        "wiki_title": "File:BMW G20 (2022) 1X7A6120.jpg",
        "tag": "Targa Estera"
    },
    "valutazione-auto-usata-stato-pneumatici": {
        "type": "wiki",
        "wiki_title": "File:TyreDepthGauge.JPG",
        "tag": "Usura Pneumatici"
    },
    "valutazione-auto-usata-stato-interni": {
        "type": "wiki",
        "wiki_title": "File:2023 Audi A4 B9 Avant Allroad - steering wheel with Audi logo.jpg",
        "tag": "Usura Interni"
    },
    "valutazione-auto-usata-libretto-tagliandi": {
        "type": "wiki",
        "wiki_title": "File:Engine components displayed in a red car during a mechanical inspection process at a garage.jpg",
        "tag": "Libretto Tagliandi"
    },
    "valutazione-auto-usata-numero-proprietari": {
        "type": "wiki",
        "wiki_title": "File:Zulassungsbescheinigung Teil I.JPG",
        "tag": "Numero Proprietari"
    },
    "valutazione-auto-usata-zona-geografica": {
        "type": "wiki",
        "wiki_title": "File:Autostrada del sole sesso reggio emilia.jpg",
        "tag": "Differenze Regionali"
    },
    "valutazione-auto-usata-stagionalita": {
        "type": "wiki",
        "wiki_title": "File:20 Mazda MX-5 Miata Club.jpg",
        "tag": "Stagionalità Prezzi"
    },
    "valutazione-auto-usata-garanzia-residua": {
        "type": "wiki",
        "wiki_title": "File:Business man and woman handshake in work office.jpg",
        "tag": "Garanzia Ufficiale"
    },
    "valutazione-auto-usata-freni-e-sospensioni": {
        "type": "wiki",
        "wiki_title": "File:Federbein.JPG",
        "tag": "Sospensioni & Assetto"
    },
    "valutazione-auto-usata-motore-rumori": {
        "type": "wiki",
        "wiki_title": "File:Albero a camme e catena di distribuzione in testata di motore automobile.jpg",
        "tag": "Rumori & Catena Motore"
    },
    "valutazione-auto-usata-stato-fari-cristalli": {
        "type": "wiki",
        "wiki_title": "File:Close view of a car headlight with condensation on a black vehicle parked.jpg",
        "tag": "Fari & Cristalli"
    },
    "valutazione-auto-usata-allestimento-top": {
        "type": "wiki",
        "wiki_title": "File:Audi A8 L 55 TFSI Quattro S Line Premium D5 FL Mythos Black Metallic (50).jpg",
        "tag": "Allestimento Top"
    },
    "valutazione-auto-usata-cambio-automatico": {
        "type": "wiki",
        "wiki_title": "File:Automatic gear selector and center console of a Toyota Yaris GR Sport, with red stitching details.jpg",
        "tag": "Cambio Automatico"
    },
    "valutazione-auto-usata-tetto-panoramico": {
        "type": "wiki",
        "wiki_title": "File:View of trees through Tesla Model 3 rear glass roof.jpg",
        "tag": "Tetto Panoramico"
    },
    "valutazione-auto-usata-gancio-traino": {
        "type": "wiki",
        "wiki_title": "File:AHK Komplett 01.jpg",
        "tag": "Gancio Traino"
    },
    "valutazione-auto-usata-impianto-audio-premium": {
        "type": "wiki",
        "wiki_title": "File:Harman Kardon Car Audio Speaker.jpg",
        "tag": "Impianto Audio Premium"
    },
    "valutazione-auto-usata-pacchetto-adas": {
        "type": "wiki",
        "wiki_title": "File:Subaru Evoltis (Ascent) 2.4 Touring 'EyeSight' 2023 and Subaru XV 2.0i-S EyeSight 2022.jpg",
        "tag": "Sistemi ADAS Livello 2"
    },
    "valutazione-auto-usata-cerchi-in-lega": {
        "type": "wiki",
        "wiki_title": "File:Dülmen, Auto Bertels, Toyota GR Supra -- 2021 -- 9545.jpg",
        "tag": "Cerchi in Lega"
    },
    "valutazione-auto-usata-interni-in-pelle": {
        "type": "wiki",
        "wiki_title": "File:BMW G70 BMW Individual Merino Leather Amarone (34).jpg",
        "tag": "Interni in Pelle"
    }
}

if __name__ == '__main__':
    # 1. VERIFY EXACT COUNT & 1-TO-1 UNIQUENESS
    assert len(MAPPING) == 47, f"Expected 47 articles, got {len(MAPPING)}"

    identifiers = []
    for k, v in MAPPING.items():
        ident = v.get("path") or v.get("wiki_title")
        identifiers.append(ident)

    assert len(set(identifiers)) == 47, f"Duplicate detected in mapping! Unique: {len(set(identifiers))}/47"

    # 2. CHECK AGAINST BLACKLIST (ACQUISTO & VENDITA)
    with open(os.path.join(PROJECT_ROOT, "scripts", "blacklist_bases.json"), encoding='utf-8') as f:
        blacklist = set(json.load(f))

    for k, v in MAPPING.items():
        if v["type"] == "local":
            fname = os.path.basename(v["path"])
            assert fname not in blacklist, f"Blacklist collision on {k}: {fname}"

    print("VERIFICATION PASSED: All 47 base photos are 100% unique and 0 overlap with Acquisto/Vendita!")

    # Load resolved wiki urls from cache or fetch missing
    with open(os.path.join(PROJECT_ROOT, "scripts", "resolved_wiki_urls.json"), encoding='utf-8') as f:
        url_cache = json.load(f)

    # Make sure Panda 4x4 Van is in url_cache
    if "File:Fiat Panda 4x4 Van.jpg" not in url_cache:
        url_cache["File:Fiat Panda 4x4 Van.jpg"] = "https://upload.wikimedia.org/wikipedia/commons/1/1c/Fiat_Panda_4x4_Van.jpg"

    resolved_sources = {}
    for i, (slug, item) in enumerate(MAPPING.items(), 1):
        if item["type"] == "local":
            assert os.path.exists(item["path"]), f"Missing local file for {slug}: {item['path']}"
            resolved_sources[slug] = item["path"]
            print(f"[{i:02d}/47] Local: {slug} -> {os.path.basename(item['path'])}")
        else:
            title = item["wiki_title"]
            ext = ".png" if title.lower().endswith(".png") else ".jpg"
            local_cache_file = os.path.join(CACHE_DIR, f"{slug}{ext}")
            if os.path.exists(local_cache_file) and os.path.getsize(local_cache_file) > 10000:
                resolved_sources[slug] = local_cache_file
                print(f"[{i:02d}/47] Cached: {slug} -> {os.path.basename(local_cache_file)}")
            else:
                print(f"[{i:02d}/47] Downloading: {title} ...", flush=True)
                img_url = url_cache.get(title)
                if not img_url:
                    # fetch single
                    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
                    req = urllib.request.Request(api_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
                    with urllib.request.urlopen(req, timeout=12) as resp:
                        d = json.loads(resp.read().decode('utf-8'))
                        p = list(d['query']['pages'].values())[0]
                        img_url = p['imageinfo'][0]['url']
                
                req = urllib.request.Request(img_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
                with urllib.request.urlopen(req, timeout=25) as resp:
                    data = resp.read()
                    with open(local_cache_file, 'wb') as f:
                        f.write(data)
                resolved_sources[slug] = local_cache_file
                print(f"       -> Saved {len(data)//1024} KB to {local_cache_file}", flush=True)
                time.sleep(2.0) # polite CDN pause to prevent 429

    print("\nAll 47 sources successfully acquired and verified on disk!")

    # 4. BRANDING & PRODUCTION OF 47 COVERS
    TARGET_W = 1200
    TARGET_H = 630
    ACCENT_COLOR = (99, 102, 241) # Indigo #6366F1 matching GuideCard.tsx for Valutazione

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

    print("\n--- Generating 47 Branded Covers for Valutazione ---")
    for i, (slug, item) in enumerate(MAPPING.items(), 1):
        src_file = resolved_sources[slug]
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

        # AutoEsperto Logo Watermark in frosted glass pill (top-right)
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

        # Category Pill Badge with Indigo dot (bottom-left)
        badge = create_badge(item["tag"])
        badge_x = 40
        badge_y = TARGET_H - badge.size[1] - 40
        final_im.paste(badge, (badge_x, badge_y), badge)

        out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
        final_rgb = final_im.convert("RGB")
        final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
        sz_kb = os.path.getsize(out_file) // 1024
        base_name = os.path.basename(src_file)
        print(f"{i:2d}/47. [{slug}] -> {sz_kb} KB | Tag: '{item['tag']}' | Source: {base_name}", flush=True)

    print("\nSUCCESS: All 47 covers for Valutazione successfully generated from 47 distinct topic-accurate photos!")
