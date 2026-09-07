import os
import json
import re

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"

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
    
    # High-quality from previous session:
    "fiat_panda": os.path.join(BRAIN_PREV, "fiat_panda_valore_1788274757454.jpg"),
    "fiat_500": os.path.join(BRAIN_PREV, "fiat_500_valore_1788274775992.jpg"),
    "puretech_cinghia": os.path.join(BRAIN_PREV, "motori_12_puretech_1788274716838.jpg"),
    "cambio_dsg": os.path.join(BRAIN_PREV, "cambio_dsg_dq200_1788274870564.jpg"),
    "passaggio_proprieta": os.path.join(BRAIN_PREV, "passaggio_proprieta_1788274847188.jpg"),
    "controlli_pre_acquisto": os.path.join(BRAIN_PREV, "controlli_pre_acquisto_1788274819833.jpg"),
    "auto_affidabili": os.path.join(BRAIN_PREV, "auto_affidabili_classifica_1788274796180.jpg"),
    "auto_rubate": os.path.join(BRAIN_PREV, "auto_rubate_sicurezza_1788274672128.jpg"),
    "bollo_sicilia": os.path.join(BRAIN_PREV, "bollo_auto_sicilia_1788274693252.jpg"),
    "diesel_benzina_ibrida": os.path.join(BRAIN_PREV, "diesel_benzina_ibrida_1788274655894.jpg"),
    "auto_10000_euro": os.path.join(BRAIN_PREV, "migliori_auto_10000_euro_1788274639689.jpg"),
    "freelance_story": os.path.join(BRAIN_PREV, "autoesperto_freelance_story_1788274625545.jpg"),
    "passaporto_qr": os.path.join(BRAIN_PREV, "profilo_auto_passaporto_1788274737379.jpg"),
    "investitori": os.path.join(BRAIN_CURRENT, "investor_banner_clean_1788559411573.jpg")
}

# Verify all sources exist
missing = []
for k, path in PHOTO_SOURCES.items():
    if not os.path.exists(path):
        missing.append((k, path))

if missing:
    print("MISSING SOURCES:", missing)
else:
    print(f"All {len(PHOTO_SOURCES)} high-resolution photo sources verified successfully!")
