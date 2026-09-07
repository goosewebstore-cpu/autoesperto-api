import json

with open('scripts/parsed_73_articles.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

ALREADY_ASSIGNED = {
    # Acquisto (30)
    "auto-usata-10-segnali-problema-annuncio": True,
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": True,
    "migliori-auto-usate-10000-euro-2026": True,
    "5-cose-da-controllare-prima-comprare-auto-usata": True,
    "auto-usata-100000-km-conviene-comprare": True,
    "come-capire-se-auto-usata-incidentata": True,
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": True,
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": True,
    "auto-usate-sotto-3000-euro-guida": True,
    "auto-usate-sotto-5000-euro-scelta": True,
    "auto-usate-sotto-15000-euro-migliori": True,
    "auto-usate-sotto-20000-euro-premium": True,
    "migliori-auto-neopatentati-usate-norme": True,
    "migliori-suv-usati-economici-scelta": True,
    "auto-ibride-usate-conviene-controlli": True,
    "diesel-vs-ibrida-usata-confronto": True,
    "garanzia-auto-usata-commerciale-legale": True,
    "controlli-pre-acquisto-auto-usata-lista": True,
    "comprare-auto-da-privato-vs-concessionario": True,
    "aste-auto-usate-come-funzionano-rischi": True,
    "importare-auto-usata-germania-costi": True,
    "auto-usate-gpl-metano-conviene": True,
    "auto-elettrica-usata-autonomia-batteria": True,
    "chilometri-scalati-auto-usata-truffa": True,
    "auto-usata-aziendale-ex-noleggio": True,
    "auto-usata-per-famiglia-monovolume": True,
    "auto-usata-sportiva-economica": True,
    "passaggio-proprieta-auto-usata-costi": True,
    "auto-usate-con-cambio-automatico": True,
    "auto-usata-per-neopatentati-gpl": True,
    "auto-usate-4x4-fuoristrada-economici": True,
    "auto-usata-con-gancio-traino": True,
    "auto-usata-per-citta-citycar": True,
    "auto-usate-con-bassi-consumi": True,
    "auto-usata-per-cani-e-animali": True,
    "auto-usata-garanzia-12-mesi-copertura": True,
    "auto-usata-sito-annunci-sicurezza": True,
    "auto-usata-chilometri-illimitati": True,
    "auto-usata-per-lavoro-agenti": True,
    # (39 of 43 in Acquisto!)

    # Vendita (16)
    "annuncio-auto-usata-perfetto-guida": True,
    "foto-auto-usata-da-caricare-guida": True,
    "pagamento-sicuro-vendita-auto-usata": True,
    "atto-di-vendita-auto-usata-autentica": True,
    "vendere-auto-usata-senza-revisione": True,
    "vendere-auto-usata-con-danni-carrozzeria": True,
    "vendere-auto-per-esportazione-estero": True,
    "valore-residuo-auto-usata-fattori": True,
    "vendere-auto-usata-tra-parenti": True,
    "vendere-auto-usata-con-doppia-chiave": True,
    "vendere-auto-usata-in-conto-vendita": True,
    "preparare-auto-usata-alla-vendita": True,
    "vendere-auto-usata-all-estero-senza-iva": True,
    "vendere-auto-usata-incidentata-o-fusa": True,
    "vendere-auto-usata-con-bollo-scaduto": True,
    "vendere-auto-usata-elettrica-batteria": True,
    "vendere-auto-usata-con-impianto-gpl": True,
    "vendere-auto-usata-in-sicurezza-test-drive": True,
    "vendere-auto-usata-d-epoca-valutazione": True
}

remaining_acq = [a for a in data['acquisto'] if a['slug'] not in ALREADY_ASSIGNED]
remaining_ven = [a for a in data['vendita'] if a['slug'] not in ALREADY_ASSIGNED]

print(f"Remaining in ACQUISTO ({len(remaining_acq)}):")
for a in remaining_acq:
    print(f"  * [{a['slug']}] {a['title']}")

print(f"\nRemaining in VENDITA ({len(remaining_ven)}):")
for a in remaining_ven:
    print(f"  * [{a['slug']}] {a['title']}")
