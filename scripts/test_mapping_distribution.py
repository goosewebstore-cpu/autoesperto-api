import os
import json
import re

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV2 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"

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

with open('scratch_guides_parsed.json', 'r', encoding='utf-8') as f:
    guides = json.load(f)

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
    if "golf" in text or "volkswagen" in text and "quanto-vale" in text:
        return "golf_valore", "Quotazione Golf"
    if "duster" in text or "dacia" in text and "quanto-vale" in text:
        return "dacia_duster", "Quotazione Dacia"
    if "giulietta" in text or "alfa-romeo" in text and "quanto-vale" in text:
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

# Test mapping on all 194 guides
stats = {}
for g in guides:
    source_key, tag = match_guide(g)
    stats[source_key] = stats.get(source_key, 0) + 1

print("Mapping distribution across 194 guides:")
for k, count in sorted(stats.items(), key=lambda x: x[1], reverse=True):
    print(f"  {k:22}: {count} guides")
