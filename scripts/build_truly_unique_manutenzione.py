import os
import sys
import json
import time
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PROJECT_ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR     = os.path.join(PROJECT_ROOT, "scripts", "manutenzione_cache")
PUBLIC_DIR    = os.path.join(PROJECT_ROOT, "apps", "web", "public")
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(GUIDE_IMG_DIR, exist_ok=True)

MAPPING = {
    "aria-condizionata-auto-salva-motore-batteria-caldo-2026": {
        "wiki_title": "File:Volkswagen Golf 7 (before facelift) interior - GTD version.jpg",
        "tag": "Clima & Protezione Motore"
    },
    "benzina-quasi-da-record-guida-risparmiare-1500-euro": {
        "wiki_title": "File:Filling station refueling a car.jpg",
        "tag": "Risparmio Carburante"
    },
    "fiat-panda-500-rubate-sicilia-come-proteggersi": {
        "wiki_title": "File:A steering-wheel lock is a visible anti-theft device.jpg",
        "tag": "Antifurto Meccanico"
    },
    "profilo-auto-digitale-passaporto-veicolo": {
        "wiki_title": "File:Motor Vehicle Register Certificate of PRC Cover.jpg",
        "tag": "Passaporto Veicolo"
    },
    "cinghia-distribuzione-vs-catena-scadenza": {
        "wiki_title": "File:2001 honda accord timing belt-terabass.jpg",
        "tag": "Cinghia Distribuzione"
    },
    "frizione-e-volano-bimassa-sintomi-costi": {
        "wiki_title": "File:Zweimassenschwungrad und kupplung aufgeschnitten.jpg",
        "tag": "Volano Bimassa"
    },
    "cambio-olio-motore-ogni-quanti-km": {
        "wiki_title": "File:020220816 121314 motor oil Galkar.jpg",
        "tag": "Olio Motore & Filtro"
    },
    "freni-auto-usurati-fischio-sostituzione": {
        "wiki_title": "File:Ventilated Plain (Smooth) Brake Rotor Parts.jpg",
        "tag": "Dischi & Pastiglie"
    },
    "batteria-auto-scarica-sintomi-sostituzione": {
        "wiki_title": "File:An Advance Auto Parts store employee changes a car battery in a parking lot in front of the shop.jpg",
        "tag": "Batteria 12V & Start-Stop"
    },
    "spie-cruscotto-auto-significato-colori": {
        "wiki_title": "File:Dashboard display showing warning lights in a vehicle during nighttime driving.jpg",
        "tag": "Spie Cruscotto"
    },
    "dpf-fap-intasato-rigenerazione-soluzioni": {
        "wiki_title": "File:Diesel particulate filter 01.JPG",
        "tag": "Filtro DPF / FAP"
    },
    "adblue-problemi-spia-motore-inverno": {
        "wiki_title": "File:5l Diesel Exhaust Fluid canister (cropped).jpg",
        "tag": "AdBlue & Sistema SCR"
    },
    "climatizzatore-auto-non-raffredda-ricarica": {
        "wiki_title": "File:Cool under pressure- 386th ECES HVAC technicians in action (9047740).jpg",
        "tag": "Ricarica Climatizzatore"
    },
    "ammortizzatori-auto-scarichi-sintomi": {
        "wiki_title": 'File:" 13 - ITALY - Fiat Panda 2003 suspension shock absorbers - Automotive suspension technologies and disk brake.JPG',
        "tag": "Ammortizzatori & Strut"
    },
    "candele-e-candelette-sostituzione-sintomi": {
        "wiki_title": "File:10 NGK Spark Plugs Dodge RPDE.jpg",
        "tag": "Candele d'Accensione"
    },
    "liquido-refrigerante-radiatore-livello": {
        "wiki_title": "File:2023 Subaru Outback Limited 2.5 liter 4 cyl engine bay.jpg",
        "tag": "Liquido Refrigerante"
    },
    "cambio-automatico-manutenzione-lavaggio": {
        "wiki_title": "File:AISIN AWR10L65 automatic transmission.jpg",
        "tag": "Lavaggio Cambio Automatico"
    },
    "pneumatici-usura-pressione-inversione": {
        "wiki_title": "File:Fiat 500 Abarth (15351745174).jpg",
        "tag": "Pressione & Battistrada"
    },
    "spia-motore-gialla-fissa-o-lampeggiante": {
        "wiki_title": "File:Close-up of engine oil temperature gauge on car dashboard (49006320293).jpg",
        "tag": "Spia Motore Check Engine"
    },
    "valvola-egr-sporca-sintomi-pulizia": {
        "wiki_title": "File:Clogged EGR Valve Intake manifold.jpg",
        "tag": "Valvola EGR & Pulizia"
    },
    "liquido-freni-dot4-sostituzione-umidita": {
        "wiki_title": "File:Brake fluid reservoir in Škoda Fabia I.jpg",
        "tag": "Liquido Freni DOT4"
    },
    "rumore-braccetti-sospensione-silentblock": {
        "wiki_title": "File:Car, Front tire, Failed Ball Joint.jpg",
        "tag": "Braccetti & Silentblock"
    },
    "debimetro-flussometro-aria-sintomi": {
        "wiki_title": "File:Bosch Mass Air Flow Sensor location in the engine bay (Opel Antara 2.0 CDTI).jpg",
        "tag": "Debimetro Aria MAF"
    },
    "sonda-lambda-guasta-consumi-elevati": {
        "wiki_title": "File:Caterham Roadsport building - 091.2 - Fix lambda probe wiring - Flickr - exfordy.jpg",
        "tag": "Sonda Lambda O2"
    },
    "puleggia-albero-motore-smorzatrice-rumore": {
        "wiki_title": "File:Keilrippenriemen Servopumpe Spannrollen VW T4 IMG 20160922 135213.jpg",
        "tag": "Puleggia Albero Motore"
    },
    "alternatore-auto-guasto-spia-batteria": {
        "wiki_title": "File:Alternator Out (16133831166).jpg",
        "tag": "Alternatore Auto"
    },
    "motorino-avviamento-auto-non-parte": {
        "wiki_title": "File:Démarreur d'une Renault 5.jpg",
        "tag": "Motorino d'Avviamento"
    },
    "cuscinetti-ruota-rumore-rombo-velocita": {
        "wiki_title": "File:Lotus Europa (29970237816).jpg",
        "tag": "Cuscinetti Ruota"
    },
    "pompa-acqua-perdita-liquido-distribuzione": {
        "wiki_title": "File:Pompa wody2.jpg",
        "tag": "Pompa dell'Acqua"
    },
    "scatola-sterzo-gioco-rumore-perdite": {
        "wiki_title": "File:1971 AMI Rambler Gremlin AnnMD sterbx.jpg",
        "tag": "Scatola Sterzo & Tiranti"
    },
    "catalizzatore-otturato-sintomi-sostituzione": {
        "wiki_title": "File:Catalytic Converter Interior.jpg",
        "tag": "Catalizzatore Scarico"
    },
    "termostato-motore-bloccato-aperto-chiuso": {
        "wiki_title": "File:2005 Chevrolet Aveo Thermostat Housing (broken).jpg",
        "tag": "Valvola Termostatica"
    },
    "turbina-motore-fischio-olio-fumo-blu": {
        "wiki_title": "File:Turbocompressor.JPG",
        "tag": "Turbina & Wastegate"
    },
    "iniettori-diesel-rumorosi-fumo-nero": {
        "wiki_title": "File:Bosch common rail injector (cropped).JPG",
        "tag": "Iniettori Common Rail"
    },
    "candelette-preriscaldo-spia-lampeggiante": {
        "wiki_title": "File:Glühkerzen Diesel Direkteinspritzer PKW.jpg",
        "tag": "Candelette Diesel"
    },
    "pulizia-corpo-farfallato-minimo-irregolare": {
        "wiki_title": "File:Opel Z18XE Vectra C beziffert.JPG",
        "tag": "Corpo Farfallato"
    },
    "manutenzione-tetto-apribile-infiltrazioni": {
        "wiki_title": "File:1982 Datsun 200SX SL by Nissan, 3-dr, front right.jpg",
        "tag": "Tetto Apribile & Scoli"
    },
    "sostituzione-spazzole-tergicristallo-rumore": {
        "wiki_title": "File:Rain - Flickr - ksjantz.jpg",
        "tag": "Spazzole Tergicristallo"
    }
}

def main():
    print(f"=== Starting Production of 38 Unique Covers for Manutenzione ===")
    
    # 1. Check blacklist
    blacklist = set(json.load(open(os.path.join(PROJECT_ROOT, "scripts", "blacklist_bases.json"), encoding='utf-8')))
    titles = [item["wiki_title"] for item in MAPPING.values()]
    bases = [t.replace("File:", "").strip() for t in titles]

    assert len(bases) == 38, f"Expected 38, got {len(bases)}"
    assert len(set(bases)) == 38, f"Duplicate bases within mapping: {len(bases) - len(set(bases))}"
    
    clashes = [b for b in bases if b in blacklist]
    assert len(clashes) == 0, f"Blacklist clashes: {clashes}"
    print("SUCCESS: 38 unique bases confirmed, 0 duplicate, 0 blacklist clash.")

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
    print("\n--- Downloading / Verifying 38 Sources in Cache ---")
    for i, (slug, item) in enumerate(MAPPING.items(), 1):
        title = item["wiki_title"]
        safe_name = "".join(c if c.isalnum() or c in '._-' else '_' for c in title.replace("File:", ""))
        local_cache_file = os.path.join(CACHE_DIR, safe_name)
        
        if os.path.exists(local_cache_file) and os.path.getsize(local_cache_file) > 10000:
            resolved_sources[slug] = local_cache_file
            print(f"[{i:02d}/38] Cached: {slug} -> {safe_name}")
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
            
            print(f"[{i:02d}/38] Downloading: {title} ...", flush=True)
            r = urllib.request.Request(img_url, headers={'User-Agent': 'AutoEspertoPhotoBot/3.0 (info@autoesperto.it)'})
            with urllib.request.urlopen(r, timeout=30) as d_resp:
                data = d_resp.read()
                with open(local_cache_file, 'wb') as f:
                    f.write(data)
            resolved_sources[slug] = local_cache_file
            print(f"       -> Saved {len(data)//1024} KB to {safe_name}", flush=True)
            time.sleep(1.5)

    print("\nAll 38 sources downloaded and cached successfully!")

    # 4. BRANDING & PRODUCTION OF 38 COVERS
    TARGET_W = 1200
    TARGET_H = 630
    ACCENT_COLOR = (245, 158, 11) # Amber #F59E0B matching GuideCard.tsx for Manutenzione

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

    print("\n--- Generating 38 Branded Covers for Manutenzione ---")
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

        # Category Pill Badge with Amber dot (bottom-left)
        badge = create_badge(item["tag"])
        badge_x = 40
        badge_y = TARGET_H - badge.size[1] - 40
        final_im.paste(badge, (badge_x, badge_y), badge)

        out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
        final_rgb = final_im.convert("RGB")
        final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
        sz_kb = os.path.getsize(out_file) // 1024
        base_name = os.path.basename(src_file)
        print(f"{i:2d}/38. [{slug}] -> {sz_kb} KB | Tag: '{item['tag']}' | Source: {base_name}", flush=True)

    # 5. Update blacklist with all 38 bases
    updated_bl = sorted(list(blacklist.union(set(bases))))
    with open(os.path.join(PROJECT_ROOT, "scripts", "blacklist_bases.json"), 'w', encoding='utf-8') as f:
        json.dump(updated_bl, f, indent=2)
    print(f"\nUpdated blacklist: now contains {len(updated_bl)} bases (was {len(blacklist)}).")
    print("\nSUCCESS: All 38 covers for Manutenzione successfully generated!")

if __name__ == "__main__":
    main()
