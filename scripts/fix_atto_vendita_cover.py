import os
from PIL import Image, ImageDraw, ImageFont

PROJECT_ROOT  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR    = os.path.join(PROJECT_ROOT, "apps", "web", "public")
GUIDE_IMG_DIR = os.path.join(PUBLIC_DIR, "images", "guide")
LOGO_PATH     = os.path.join(PUBLIC_DIR, "logo-circle.png")

src_file = os.path.join(PROJECT_ROOT, "scripts", "atto_vendita_cache", "Legal_Contract_Signature_Warm_Tones.jpg")
slug = "atto-di-vendita-auto-usata-autentica"
tag_text = "Atto di Vendita"

TARGET_W = 1200
TARGET_H = 630
ACCENT_COLOR = (244, 114, 182) # Rose/Pink #F472B6 for Vendita

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

# Category Pill Badge (bottom-left)
badge = create_badge(tag_text)
badge_x = 40
badge_y = TARGET_H - badge.size[1] - 40
final_im.paste(badge, (badge_x, badge_y), badge)

out_file = os.path.join(GUIDE_IMG_DIR, f"{slug}.jpg")
final_rgb = final_im.convert("RGB")
final_rgb.save(out_file, "JPEG", quality=92, optimize=True)
sz_kb = os.path.getsize(out_file) // 1024
print(f"SUCCESS: Generated {out_file} ({sz_kb} KB)")
