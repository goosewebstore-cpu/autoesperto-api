import json

with open('scripts/parsed_73_articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("ACQUISTO TOTAL:", len(data['acquisto']))
print("VENDITA TOTAL :", len(data['vendita']))

BRAIN_MATCHES = {
    # Acquisto
    "auto-usata-10-segnali-problema-annuncio": "spie_cruscotto_auto_1788617111592.jpg",
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": "diesel_benzina_ibrida_1788274655894.jpg",
    "migliori-auto-usate-10000-euro-2026": "migliori_auto_10000_euro_1788274639689.jpg",
    "5-cose-da-controllare-prima-comprare-auto-usata": "cambio_olio_motore_1788617144886.jpg",
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": "motore_diesel_commonrail_1788617345579.jpg",
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": "profilo_auto_passaporto_1788274737379.jpg",
    "auto-usate-sotto-3000-euro-guida": "budget_citycars_3000_1788210099424.jpg",
    "auto-usate-sotto-5000-euro-scelta": "compact_cars_5000_1788210160736.jpg",
    "auto-usate-sotto-15000-euro-migliori": "suv_crossover_15000_1788210229641.jpg",
    "auto-usate-sotto-20000-euro-premium": "premium_executive_sedans_1788210263986.jpg",
    "migliori-auto-neopatentati-usate-norme": "auto_neopatentati_2026_1788617250605.jpg",
    "migliori-suv-usati-economici-scelta": "dacia_duster_valore_1788617297822.jpg",
    "passaggio-proprieta-auto-usata-costi": "passaggio_proprieta_1788274847188.jpg",
    "auto-usate-con-cambio-automatico": "cambio_dsg_dq200_1788274870564.jpg",
    "auto-usata-per-neopatentati-gpl": "fiat_500_valore_1788274775992.jpg",
    "auto-usate-4x4-fuoristrada-economici": "jeep_renegade_valore_1788617274797.jpg",
    "auto-usata-sportiva-economica": "alfa_giulietta_usata_1788617321005.jpg",
    "controlli-pre-acquisto-auto-usata-lista": "pneumatici_usura_controllo_1788617369864.jpg",

    # Vendita
    "foto-auto-usata-da-caricare-guida": "fotografare_auto_vendita_1788617228664.jpg",
    "vendere-auto-usata-senza-revisione": "freni_auto_dischi_1788617164014.jpg",
    "valore-residuo-auto-usata-fattori": "golf_usata_valore_1788617128150.jpg",
    "vendere-auto-usata-con-bollo-scaduto": "bollo_auto_sicilia_1788274693252.jpg",
    "vendere-auto-usata-elettrica-batteria": "batteria_auto_test_1788617185812.jpg",
    "vendere-auto-usata-in-sicurezza-test-drive": "auto_rubate_sicurezza_1788274672128.jpg",
}

print(f"Matched with verified brain images: {len(BRAIN_MATCHES)}")

unmatched_acq = [a for a in data['acquisto'] if a['slug'] not in BRAIN_MATCHES]
unmatched_ven = [a for a in data['vendita'] if a['slug'] not in BRAIN_MATCHES]

print(f"\nRemaining in ACQUISTO to source: {len(unmatched_acq)}")
for i, a in enumerate(unmatched_acq, 1):
    print(f"  {i:2d}. [{a['slug']}] {a['title']}")

print(f"\nRemaining in VENDITA to source: {len(unmatched_ven)}")
for i, a in enumerate(unmatched_ven, 1):
    print(f"  {i:2d}. [{a['slug']}] {a['title']}")
