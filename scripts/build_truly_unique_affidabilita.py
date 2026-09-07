import os
import sys
import json
import time
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PROJECT_ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR     = os.path.join(PROJECT_ROOT, "scripts", "affidabilita_cache")
PUBLIC_DIR    = os.path.join(PROJECT_ROOT, "apps", "web", "public")
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(GUIDE_IMG_DIR, exist_ok=True)

MAPPING = {
    "le-10-auto-piu-rubate-italia-2026": {
        "wiki_title": "File:Alfa Romeo Giulia Super - Polizia di Stato (5892593844).jpg",
        "tag": "Classifica Furti 2026"
    },
    "10-auto-piu-affidabili-usate-2026": {
        "wiki_title": "File:The frontview of Toyota YARiS HYBRID G (XP210 prototype).jpg",
        "tag": "Classifica Affidabilità"
    },
    "motori-12-puretech-problemi-cinghia-bagno-olio": {
        "wiki_title": "File:Peugeot 2008 1.2 PureTech 100 (2020) (52173175166).jpg",
        "tag": "PureTech 1.2 Wet Belt"
    },
    "motori-15-dci-renault-affidabilita-bronzine": {
        "wiki_title": "File:Engine 1.5 dCi 55 kW.jpg",
        "tag": "Renault 1.5 dCi K9K"
    },
    "cambio-dsg-dq200-volkswagen-problemi-frizione": {
        "wiki_title": "File:VW DSG transmission DTMB.jpg",
        "tag": "DSG DQ200 Frizioni a Secco"
    },
    "motori-13-multijet-fiat-affidabilita-catena": {
        "wiki_title": "File:2016 Fiat Panda Cross 4x4 1.3 Multijet 95.jpg",
        "tag": "Fiat 1.3 Multijet"
    },
    "motori-15-bluehdi-stellantis-catena-camme": {
        "wiki_title": "File:2019 Peugeot 508 GT-Line BlueHDi 1.5 (130 PS).jpg",
        "tag": "1.5 BlueHDi Catenella 7mm"
    },
    "auto-usate-da-300000-km-indistruttibili": {
        "wiki_title": "File:M307 Volvo V70 Estate - Netherlands Politie (5701002640).jpg",
        "tag": "Auto da 300.000 Km"
    },
    "cambi-automatici-piu-affidabili-classifica": {
        "wiki_title": "File:ZF Stufenautomatgetriebe 8HP70.jpg",
        "tag": "ZF 8HP & Aisin"
    },
    "motore-14-tsi-volkswagen-catena-consumo-olio": {
        "wiki_title": "File:Volkswagen Polo GTE - silnik 1.4 TSI + elektryczny (MSP15).JPG",
        "tag": "1.4 TSI EA111 Catena"
    },
    "motore-20-tdi-volkswagen-pompa-alta-pressione-cp4": {
        "wiki_title": "File:EGR Volkswagen 2.0 TDI.JPG",
        "tag": "2.0 TDI Pompa Bosch CP4"
    },
    "motori-bmw-n47-problema-catena-distribuzione": {
        "wiki_title": "File:2010 BMW X1 sDrive 2.0d SE - Flickr - The Car Spy (16).jpg",
        "tag": "BMW N47 Catena Posteriore"
    },
    "motore-ford-10-ecoboost-cinghia-bagno-olio": {
        "wiki_title": "File:Ford 2.0 EcoBoost.jpg",
        "tag": "Ford EcoBoost Cinghia Olio"
    },
    "motori-benzina-piu-affidabili-usato": {
        "wiki_title": 'File:" 12 - Italian engine Fiat 1.4 MultiAir Turbo.jpg',
        "tag": "Motori Benzina Affidabili"
    },
    "motori-diesel-piu-affidabili-usato": {
        "wiki_title": "File:Fiat Multipla 1.9 JTD (2004) (52170707291).jpg",
        "tag": "Turbodiesel Indistruttibili"
    },
    "affidabilita-auto-ibride-toyota-hsd": {
        "wiki_title": "File:2006 Toyota Prius T Spirit - 1497cc 1.5 (76PS) Hybrid Synergy Drive - Silver Steel - 03-03-2024, Front Left.jpg",
        "tag": "Toyota Hybrid e-CVT"
    },
    "problemi-cambio-cvt-nissan-jatco": {
        "wiki_title": "File:Subaru Crosstrek S-HEV powertrain cutaway.jpg",
        "tag": "Cambio CVT Jatco"
    },
    "motore-16-jtdm-alfa-romeo-fiat-affidabilita": {
        "wiki_title": "File:2016 Fiat Doblo Easy Multijet 1.6 Front.jpg",
        "tag": "1.6 Multijet / JTDm"
    },
    "motore-12-tsi-volkswagen-ea211-cinghia": {
        "wiki_title": "File:VW EA211-evo Deutsches-Museum.jpg",
        "tag": "1.2 TSI EA211 a Cinghia"
    },
    "motore--mercedes-15-dci-om607-affidabilita": {
        "wiki_title": "File:Mercedes-Benz A 180 CDI (W176, 2014) (52180834122).jpg",
        "tag": "Mercedes OM607 / OM608"
    },
    "motori-3-cilindri-turbo-affidabilita": {
        "wiki_title": "File:Renault Clio V TCe 90 (2020) (52207757169).jpg",
        "tag": "3 Cilindri Turbo Benzina"
    },
    "problemi-adblue-peugeot-citroen-deformazione-serbatoio": {
        "wiki_title": "File:Hino Standardized SCR Unit.jpg",
        "tag": "AdBlue PSA Serbatoio"
    },
    "motore-20-d-ingenium-jaguar-land-rover-catena": {
        "wiki_title": "File:JAGUAR 2L I4 Turbocharged (6959278660).jpg",
        "tag": "Jaguar JLR 2.0D Ingenium"
    },
    "motori-gpl-di-serie-affidabilita-valvole": {
        "wiki_title": "File:LPG Fill and AFL valves apart.JPG",
        "tag": "Valvole & Impianti GPL"
    },
    "motori-metano-di-serie-volkswagen-g-tron": {
        "wiki_title": "File:2013-03-05 Geneva Motor Show 7913.JPG",
        "tag": "Metano VW TGI & g-tron"
    },
    "affidabilita-marchi-auto-classifica-2026": {
        "wiki_title": "File:Car showroom, Lee Way, Newport - geograph.org.uk - 6206559.jpg",
        "tag": "Report Marchi Auto 2026"
    },
    "problemi-sospensioni-pneumatiche-suv": {
        "wiki_title": "File:Air spring.JPG",
        "tag": "Sospensioni Pneumatiche"
    },
    "problemi-elettronica-auto-usate-centraline": {
        "wiki_title": "File:ECU and wire bundles.JPG",
        "tag": "Centraline Elettroniche ECU"
    },
    "motore-16-thp-peugeot-mini-catena-consumo-olio": {
        "wiki_title": "File:2021 MINI Clubman Cooper S LCI red engine view in Brunei.jpg",
        "tag": "1.6 THP Prince Engine"
    },
    "motore-20-multijet-fiat-alfa-20-tdi": {
        "wiki_title": "File:Fiat Freemont 2.0 Multijet 4x4 (2013) (52919563146).jpg",
        "tag": "Fiat 2.0 Multijet 400k Km"
    },
    "motore-15-tsi-volkswagen-act-disattivazione-cilindri": {
        "wiki_title": "File:VW Tiguan 1.5 eTSI ACT R-Line (III) – f 14022026.jpg",
        "tag": "1.5 TSI ACT Disattivazione"
    },
    "motori-mazda-skyactiv-g-d-affidabilita": {
        "wiki_title": "File:2015 Mazda MX-5 ND 2.0 SKYACTIV-G 160 i-ELOOP Motorraum.jpg",
        "tag": "Mazda Skyactiv-G & D"
    },
    "motori-hyundai-kia-16-crdi-affidabilita": {
        "wiki_title": "File:2014 Hyundai i40 (VF2) Active CRDi sedan (2015-07-06) 01.jpg",
        "tag": "Hyundai 1.6 CRDi Diesel"
    },
    "motori-subaru-boxer-diesel-problemi-albero-motore": {
        "wiki_title": "File:SUBARU BOXER DIESEL (EE20) 01.jpg",
        "tag": "Subaru Boxer Diesel EE20"
    },
    "problemi-volano-monomassa-vs-bimassa": {
        "wiki_title": "File:Close-up view of a worn clutch disc among automotive tools in a workshop.jpg",
        "tag": "Volano Bimassa vs Monomassa"
    },
    "affidabilita-auto-elettriche-usate-motore-inverter": {
        "wiki_title": "File:Electric motor Toyota bZ4X Expo 2022 CRI 4894.jpg",
        "tag": "Motore Elettrico & Inverter"
    }
}

def main():
    print(f"=== Starting Production of 36 Unique Covers for Affidabilità ===")
    
    # 1. Check blacklist
    blacklist = set(json.load(open(os.path.join(PROJECT_ROOT, "scripts", "blacklist_bases.json"), encoding='utf-8')))
    titles = [item["wiki_title"] for item in MAPPING.values()]
    bases = [t.replace("File:", "").strip() for t in titles]

    assert len(bases) == 36, f"Expected 36, got {len(bases)}"
    assert len(set(bases)) == 36, f"Duplicate bases within mapping: {len(bases) - len(set(bases))}"
    
    clashes = [b for b in bases if b in blacklist]
    assert len(clashes) == 0, f"Blacklist clashes: {clashes}"
    print(f"SUCCESS: 36 unique bases confirmed, 0 duplicate, 0 blacklist clash against {len(blacklist)} existing bases.")

    # 2. Batch resolve URLs
    encoded_titles = "|".join([urllib.parse.quote(t) for t in titles])
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={encoded_titles}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(api_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
    with urllib.request.urlopen(req, timeout=25) as resp:
        d = json.loads(resp.read().decode('utf-8'))
    
    url_cache = {}
    for p in d.get('query', {}).get('pages', {}).values():
        t = p.get('title')
        ii = p.get('imageinfo', [{}])[0]
        u = ii.get('url')
        if t and u:
            url_cache[t] = u

    # 3. Download to cache
    resolved_sources = {}
    print("\n--- Downloading / Verifying 36 Sources in Cache ---")
    for i, (slug, item) in enumerate(MAPPING.items(), 1):
        title = item["wiki_title"]
        safe_name = "".join(c if c.isalnum() or c in '._-' else '_' for c in title.replace("File:", ""))
        local_cache_file = os.path.join(CACHE_DIR, safe_name)
        
        if os.path.exists(local_cache_file) and os.path.getsize(local_cache_file) > 10000:
            resolved_sources[slug] = local_cache_file
            print(f"[{i:02d}/36] Cached: {slug} -> {safe_name}")
        else:
            img_url = url_cache.get(title)
            if not img_url:
                # single query
                single_api = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
                r = urllib.request.Request(single_api, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
                with urllib.request.urlopen(r, timeout=15) as s_resp:
                    s_d = json.loads(s_resp.read().decode('utf-8'))
                    p = list(s_d['query']['pages'].values())[0]
                    img_url = p['imageinfo'][0]['url']
            
            print(f"[{i:02d}/36] Downloading: {title} ...", flush=True)
            r = urllib.request.Request(img_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
            with urllib.request.urlopen(r, timeout=30) as d_resp:
                data = d_resp.read()
                with open(local_cache_file, 'wb') as f:
                    f.write(data)
            resolved_sources[slug] = local_cache_file
            print(f"       -> Saved {len(data)//1024} KB to {safe_name}", flush=True)
            time.sleep(1.5)

    print("\nAll 36 sources downloaded and cached successfully!")

    # 4. BRANDING & PRODUCTION OF 36 COVERS
    TARGET_W = 1200
    TARGET_H = 630
    ACCENT_COLOR = (244, 63, 94) # Rose / Crimson #F43F5E matching GuideCard.tsx for Affidabilità

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

    print("\n--- Generating 36 Branded Covers for Affidabilità ---")
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

        # Category Pill Badge with Rose dot (bottom-left)
        badge = create_badge(item["tag"])
        badge_x = 40
        badge_y = TARGET_H - badge.size[1] - 40
        final_im.paste(badge, (badge_x, badge_y), badge)

        out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
        final_rgb = final_im.convert("RGB")
        final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
        sz_kb = os.path.getsize(out_file) // 1024
        base_name = os.path.basename(src_file)
        print(f"{i:2d}/36. [{slug}] -> {sz_kb} KB | Tag: '{item['tag']}' | Source: {base_name}", flush=True)

    # 5. Update blacklist with all 36 bases
    updated_bl = sorted(list(blacklist.union(set(bases))))
    with open(os.path.join(PROJECT_ROOT, "scripts", "blacklist_bases.json"), 'w', encoding='utf-8') as f:
        json.dump(updated_bl, f, indent=2)
    print(f"\nUpdated blacklist: now contains {len(updated_bl)} bases (was {len(blacklist)}).")
    print("\nSUCCESS: All 36 covers for Affidabilità successfully generated!")

if __name__ == "__main__":
    main()
