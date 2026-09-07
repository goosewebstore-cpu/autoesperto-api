import os
import json
from PIL import Image

BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1   = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_E478    = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e478b572-939b-4d53-9d87-36e3880d1f01"
UNSPLASH_DIR  = r"scripts\unsplash_cache"
ACCURATE_ACQ  = r"scripts\accurate_cache\acquisto"
VERIFIED_ACQ  = r"scripts\verified_cache\acquisto"
VERIFIED_VEN  = r"scripts\verified_cache\vendita"

FINAL_MAPPING_ACQUISTO = {
    # 1. 10 segnali d'allarme annuncio
    "auto-usata-10-segnali-problema-annuncio": {
        "file": os.path.join(BRAIN_CURRENT, "spie_cruscotto_auto_1788617111592.jpg"),
        "tag": "10 Segnali D'Allarme",
        "topic": "Dashboard warning indicators and alerts"
    },
    # 2. Diesel, benzina o ibrida
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": {
        "file": os.path.join(BRAIN_PREV1, "diesel_benzina_ibrida_1788274655894.jpg"),
        "tag": "Scelta Motorizzazione",
        "topic": "Fuel pumps at gas station"
    },
    # 3. Migliori auto 10.000€
    "migliori-auto-usate-10000-euro-2026": {
        "file": os.path.join(BRAIN_PREV1, "migliori_auto_10000_euro_1788274639689.jpg"),
        "tag": "Budget 10.000€",
        "topic": "Reliable used cars under 10k"
    },
    # 4. 5 cose da controllare
    "5-cose-da-controllare-prima-comprare-auto-usata": {
        "file": os.path.join(BRAIN_CURRENT, "cambio_olio_motore_1788617144886.jpg"),
        "tag": "5 Controlli Meccanici",
        "topic": "Mechanic checking engine oil dipstick"
    },
    # 5. 100.000 km
    "auto-usata-100000-km-conviene-comprare": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usata-100000-km-conviene-comprare.jpg"),
        "tag": "Soglia 100.000 Km",
        "topic": "Porsche instrument cluster odometer"
    },
    # 6. Auto incidentata
    "come-capire-se-auto-usata-incidentata": {
        "file": os.path.join(VERIFIED_ACQ, "come-capire-se-auto-usata-incidentata.jpg"),
        "tag": "Riconoscere Incidenti",
        "topic": "Damaged front bumper collision"
    },
    # 7. Diesel Euro 5
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": {
        "file": os.path.join(BRAIN_CURRENT, "motore_diesel_commonrail_1788617345579.jpg"),
        "tag": "Diesel Euro 5 & Blocchi",
        "topic": "Modern Common Rail turbo diesel engine bay"
    },
    # 8. Passaporto digitale veicolo
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": {
        "file": os.path.join(BRAIN_PREV1, "profilo_auto_passaporto_1788274737379.jpg"),
        "tag": "Passaporto UE 2026",
        "topic": "Digital vehicle passport app / report"
    },
    # 9. Sotto 3.000€
    "auto-usate-sotto-3000-euro-guida": {
        "file": os.path.join(BRAIN_E478, "budget_citycars_3000_1788210099424.jpg"),
        "tag": "Budget Sotto 3.000€",
        "topic": "Ultra budget city cars"
    },
    # 10. Sotto 5.000€
    "auto-usate-sotto-5000-euro-scelta": {
        "file": os.path.join(BRAIN_E478, "compact_cars_5000_1788210160736.jpg"),
        "tag": "Budget Sotto 5.000€",
        "topic": "Compact cars under 5000 euro"
    },
    # 11. Sotto 15.000€
    "auto-usate-sotto-15000-euro-migliori": {
        "file": os.path.join(BRAIN_E478, "suv_crossover_15000_1788210229641.jpg"),
        "tag": "Budget Sotto 15.000€",
        "topic": "Modern crossover SUV under 15000 euro"
    },
    # 12. Sotto 20.000€ premium
    "auto-usate-sotto-20000-euro-premium": {
        "file": os.path.join(BRAIN_E478, "premium_executive_sedans_1788210263986.jpg"),
        "tag": "Premium Sotto 20.000€",
        "topic": "Audi/BMW executive premium sedans"
    },
    # 13. Neopatentati usate
    "migliori-auto-neopatentati-usate-norme": {
        "file": os.path.join(BRAIN_CURRENT, "auto_neopatentati_2026_1788617250605.jpg"),
        "tag": "Neopatentati 2026",
        "topic": "Modern compact car for new drivers"
    },
    # 14. SUV economici
    "migliori-suv-usati-economici-scelta": {
        "file": os.path.join(BRAIN_CURRENT, "dacia_duster_valore_1788617297822.jpg"),
        "tag": "SUV Economici",
        "topic": "Modern Dacia Duster crossover"
    },
    # 15. Auto ibride usate
    "auto-ibride-usate-conviene-controlli": {
        "file": os.path.join(VERIFIED_ACQ, "auto-ibride-usate-conviene-controlli.jpg"),
        "tag": "Guida Ibrida Usata",
        "topic": "Toyota Yaris Cross Hybrid"
    },
    # 16. Diesel vs ibrida
    "diesel-vs-ibrida-usata-confronto": {
        "file": os.path.join(VERIFIED_ACQ, "diesel-vs-ibrida-usata-confronto.jpg"),
        "tag": "Diesel vs Ibrida",
        "topic": "European motorway highway traffic"
    },
    # 17. Garanzia auto usata
    "garanzia-auto-usata-commerciale-legale": {
        "file": os.path.join(VERIFIED_ACQ, "garanzia-auto-usata-commerciale-legale.jpg"),
        "tag": "Garanzia Legale Usato",
        "topic": "Legal contract and signature"
    },
    # 18. Checklist pre-acquisto
    "controlli-pre-acquisto-auto-usata-lista": {
        "file": os.path.join(BRAIN_CURRENT, "pneumatici_usura_controllo_1788617369864.jpg"),
        "tag": "Checklist 25 Punti",
        "topic": "Tire tread depth gauge and wear inspection"
    },
    # 19. Privato vs concessionario
    "comprare-auto-da-privato-vs-concessionario": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1562911791-c7a97b729ec5.jpg"),
        "tag": "Privato o Salone",
        "topic": "Car dealership modern showroom"
    },
    # 20. Aste auto usate
    "aste-auto-usate-come-funzionano-rischi": {
        "file": os.path.join(VERIFIED_ACQ, "aste-auto-usate-come-funzionano-rischi.jpg"),
        "tag": "Aste Giudiziarie Auto",
        "topic": "Car auction pavilion lot"
    },
    # 21. Importare auto Germania
    "importare-auto-usata-germania-costi": {
        "file": os.path.join(VERIFIED_ACQ, "importare-auto-usata-germania-costi.jpg"),
        "tag": "Importazione Germania",
        "topic": "Car carrier transport truck"
    },
    # 22. Auto GPL e Metano
    "auto-usate-gpl-metano-conviene": {
        "file": os.path.join(ACCURATE_ACQ, "auto-usate-gpl-metano-conviene.jpg"),
        "tag": "Usato GPL & Metano",
        "topic": "LPG Autogas filling pump station"
    },
    # 23. Elettrica batteria SOH
    "auto-elettrica-usata-autonomia-batteria": {
        "file": os.path.join(VERIFIED_ACQ, "auto-elettrica-usata-autonomia-batteria.jpg"),
        "tag": "Elettrico SOH Batteria",
        "topic": "Electric car charging cable connected"
    },
    # 24. Chilometri scalati
    "chilometri-scalati-auto-usata-truffa": {
        "file": os.path.join(VERIFIED_ACQ, "chilometri-scalati-auto-usata-truffa.jpg"),
        "tag": "Truffa Km Scalati",
        "topic": "OBD diagnostic scanner tool"
    },
    # 25. Fermo amministrativo
    "acquisto-auto-con-fermo-amministrativo": {
        "file": os.path.join(ACCURATE_ACQ, "acquisto-auto-con-fermo-amministrativo.jpg"),
        "tag": "Fermo Amministrativo",
        "topic": "Official vehicle registry document"
    },
    # 26. Auto aziendali
    "auto-usata-aziendale-ex-noleggio": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1555215695-3004980ad54e.jpg"),
        "tag": "Auto Aziendali & Flotte",
        "topic": "BMW corporate sedan"
    },
    # 27. Caparra confirmatoria
    "caparra-acquisto-auto-usata-regole": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1450133064473-71024230f91b.jpg"),
        "tag": "Caparra & Contratto",
        "topic": "Signing purchase agreement pen on desk"
    },
    # 28. Monovolume famiglia
    "auto-usata-per-famiglia-monovolume": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usata-per-famiglia-monovolume.jpg"),
        "tag": "Auto per Famiglie",
        "topic": "Renault Scenic monovolume"
    },
    # 29. Sportiva economica
    "auto-usata-sportiva-economica": {
        "file": os.path.join(BRAIN_CURRENT, "alfa_giulietta_usata_1788617321005.jpg"),
        "tag": "Sportive Economiche",
        "topic": "Alfa Romeo Giulietta sports hatchback"
    },
    # 30. Passaggio di proprietà
    "passaggio-proprieta-auto-usata-costi": {
        "file": os.path.join(BRAIN_PREV1, "passaggio_proprieta_1788274847188.jpg"),
        "tag": "Costi Passaggio PRA",
        "topic": "Car keys on Italian ownership document"
    },
    # 31. Finanziamento auto usata
    "finanziamento-auto-usata-conviene": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1454165804606-c3d57bc86b40.jpg"),
        "tag": "Finanziamento & Tassi",
        "topic": "Financial calculation and loan paperwork"
    },
    # 32. Cambio automatico
    "auto-usate-con-cambio-automatico": {
        "file": os.path.join(BRAIN_PREV1, "cambio_dsg_dq200_1788274870564.jpg"),
        "tag": "Cambio Automatico Usato",
        "topic": "DSG automatic transmission gear shifter"
    },
    # 33. GPL neopatentati
    "auto-usata-per-neopatentati-gpl": {
        "file": os.path.join(BRAIN_PREV1, "fiat_500_valore_1788274775992.jpg"),
        "tag": "Neopatentati a GPL",
        "topic": "Fiat 500 dual fuel city car"
    },
    # 34. 4x4 fuoristrada
    "auto-usate-4x4-fuoristrada-economici": {
        "file": os.path.join(BRAIN_CURRENT, "jeep_renegade_valore_1788617274797.jpg"),
        "tag": "4x4 & Fuoristrada",
        "topic": "Jeep Renegade 4x4 Trailhawk"
    },
    # 35. Gancio traino
    "auto-usata-con-gancio-traino": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usata-con-gancio-traino.jpg"),
        "tag": "Auto con Gancio Traino",
        "topic": "Car with tow hitch and trailer"
    },
    # 36. Citycar
    "auto-usata-per-citta-citycar": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1549399542-7e3f8b79c341.jpg"),
        "tag": "Migliori Citycar Urbane",
        "topic": "Red urban compact hatchback"
    },
    # 37. Bassi consumi
    "auto-usate-con-bassi-consumi": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usate-con-bassi-consumi.jpg"),
        "tag": "Bassi Consumi Reali",
        "topic": "Toyota Prius PHEV"
    },
    # 38. Cani e animali
    "auto-usata-per-cani-e-animali": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usata-per-cani-e-animali.jpg"),
        "tag": "Viaggiare con Animali",
        "topic": "Dog in car traveling"
    },
    # 39. Garanzia 12 mesi
    "auto-usata-garanzia-12-mesi-copertura": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1568605117036-5fe5e7bab0b7.jpg"),
        "tag": "Garanzia 12 Mesi",
        "topic": "Mechanic garage vehicle inspection"
    },
    # 40. Siti annunci sicurezza
    "auto-usata-sito-annunci-sicurezza": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usata-sito-annunci-sicurezza.jpg"),
        "tag": "Sicurezza Annunci Web",
        "topic": "Browsing marketplace laptop computer"
    },
    # 41. Chilometri illimitati
    "auto-usata-chilometri-illimitati": {
        "file": os.path.join(VERIFIED_ACQ, "auto-usata-chilometri-illimitati.jpg"),
        "tag": "Oltre 150.000 Km",
        "topic": "Mercedes-Benz W124 million miles"
    },
    # 42. Agenti di commercio
    "auto-usata-per-lavoro-agenti": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1542282088-72c9c27ed0cd.jpg"),
        "tag": "Auto per Professionisti",
        "topic": "Audi sedan traveling on highway"
    },
    # 43. Acquisto online consegna
    "auto-usata-acquisto-online-consegna": {
        "file": os.path.join(ACCURATE_ACQ, "auto-usata-acquisto-online-consegna.jpg"),
        "tag": "Acquisto Online & Consegna",
        "topic": "Car transport vehicle delivery"
    }
}

FINAL_MAPPING_VENDITA = {
    # 1. Fissare prezzo vendita
    "come-fissare-prezzo-vendita-auto": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1554224155-8d04cb21cd6c.jpg"),
        "tag": "Prezzo di Vendita",
        "topic": "Vehicle price evaluation and market calculation"
    },
    # 2. Annuncio perfetto
    "annuncio-auto-usata-perfetto-guida": {
        "file": os.path.join(VERIFIED_VEN, "annuncio-auto-usata-perfetto-guida.jpg"),
        "tag": "Annuncio Perfetto",
        "topic": "Taking photos of car for online ad"
    },
    # 3. Foto auto usata
    "foto-auto-usata-da-caricare-guida": {
        "file": os.path.join(BRAIN_CURRENT, "fotografare_auto_vendita_1788617228664.jpg"),
        "tag": "10 Foto Fondamentali",
        "topic": "Photographing vehicle from 10 essential angles"
    },
    # 4. Permuta auto usata
    "permuta-auto-usata-conviene-calcolo": {
        "file": os.path.join(BRAIN_E478, "used_cars_10k_showroom_1788210056170.jpg"),
        "tag": "Permuta vs Salone",
        "topic": "Dealership showroom trade-in valuation"
    },
    # 5. Pagamento sicuro
    "pagamento-sicuro-vendita-auto-usata": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1582139329536-e7284fece509.jpg"),
        "tag": "Pagamento Sicuro",
        "topic": "Safe instant bank transfer / finance security"
    },
    # 6. Atto di vendita autentica
    "atto-di-vendita-auto-usata-autentica": {
        "file": os.path.join(VERIFIED_VEN, "atto-di-vendita-auto-usata-autentica.jpg"),
        "tag": "Atto di Vendita",
        "topic": "Official signature on bill of sale"
    },
    # 7. Finanziamento in corso
    "vendere-auto-usata-con-finanziamento-in-corso": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1486262715619-67b85e0b08d3.jpg"),
        "tag": "Finanziamento in Corso",
        "topic": "Loan paperwork settlement and payoff"
    },
    # 8. Senza revisione
    "vendere-auto-usata-senza-revisione": {
        "file": os.path.join(BRAIN_CURRENT, "freni_auto_dischi_1788617164014.jpg"),
        "tag": "Revisione Scaduta",
        "topic": "Brake disc and pad safety inspection"
    },
    # 9. Danni carrozzeria
    "vendere-auto-usata-con-danni-carrozzeria": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1601362840469-51e4d8d58785.jpg"),
        "tag": "Danni Carrozzeria",
        "topic": "Car body buffer polishing scratch repair"
    },
    # 10. Esportazione estero
    "vendere-auto-per-esportazione-estero": {
        "file": os.path.join(VERIFIED_VEN, "vendere-auto-per-esportazione-estero.jpg"),
        "tag": "Esportazione Estero",
        "topic": "Car transport for export"
    },
    # 11. Compro auto
    "vendere-auto-usata-a-compro-auto": {
        "file": os.path.join(BRAIN_E478, "used_car_inspection_signals_1788210016650.jpg"),
        "tag": "Servizi Compro Auto",
        "topic": "Professional evaluator inspecting car condition"
    },
    # 12. Valore residuo fattori
    "valore-residuo-auto-usata-fattori": {
        "file": os.path.join(BRAIN_CURRENT, "golf_usata_valore_1788617128150.jpg"),
        "tag": "Valore Residuo",
        "topic": "Volkswagen Golf resale value retention"
    },
    # 13. Storico tagliandi
    "vendere-auto-usata-storico-tagliandi": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1567808291548-fc3ee04dbcf0.jpg"),
        "tag": "Storico Tagliandi",
        "topic": "Car maintenance service records & keys"
    },
    # 14. Vendita tra parenti
    "vendere-auto-usata-tra-parenti": {
        "file": os.path.join(VERIFIED_VEN, "vendere-auto-usata-tra-parenti.jpg"),
        "tag": "Vendita tra Parenti",
        "topic": "Handing over car keys person to person"
    },
    # 15. Doppia chiave e manuali
    "vendere-auto-usata-con-doppia-chiave": {
        "file": os.path.join(VERIFIED_VEN, "vendere-auto-usata-con-doppia-chiave.jpg"),
        "tag": "Doppia Chiave & Manuali",
        "topic": "Modern BMW electronic car key"
    },
    # 16. Garanzia tra privati
    "vendere-auto-usata-garanzia-tra-privati": {
        "file": os.path.join(ACCURATE_ACQ, "caparra-acquisto-auto-usata-regole.jpg"),
        "tag": "Visto e Piaciuto",
        "topic": "Written contract agreement between private parties"
    },
    # 17. Conto vendita
    "vendere-auto-usata-in-conto-vendita": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1563720223185-11003d516935.jpg"),
        "tag": "Conto Vendita",
        "topic": "Mercedes luxury car in showroom floor"
    },
    # 18. Detailing ed igienizzazione
    "preparare-auto-usata-alla-vendita": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1607860108855-64acf2078ed9.jpg"),
        "tag": "Detailing & Pulizia",
        "topic": "Professional automotive detailing wash"
    },
    # 19. Asta online
    "vendere-auto-usata-all-asta-online": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1512941937669-90a1b58e7e9c.jpg"),
        "tag": "Aste Online Auto",
        "topic": "Online marketplace browsing on device"
    },
    # 20. Fermo fiscale
    "vendere-auto-usata-con-fermo-fiscale": {
        "file": os.path.join(ACCURATE_ACQ, "passaggio-proprieta-auto-usata-costi.jpg"),
        "tag": "Sblocco Fermo Fiscale",
        "topic": "Official vehicle registration document verification"
    },
    # 21. Estero senza IVA
    "vendere-auto-usata-all-estero-senza-iva": {
        "file": os.path.join(VERIFIED_VEN, "vendere-auto-usata-all-estero-senza-iva.jpg"),
        "tag": "Vendita Estero & IVA",
        "topic": "Customs cargo clearance border inspection"
    },
    # 22. Trattativa prezzo
    "trattativa-prezzo-vendita-auto-usata": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1550355291-bbee04a92027.jpg"),
        "tag": "Trattativa Prezzo",
        "topic": "Audi steering wheel cockpit interior discussion"
    },
    # 23. Incidentata o fusa
    "vendere-auto-usata-incidentata-o-fusa": {
        "file": os.path.join(VERIFIED_VEN, "vendere-auto-usata-incidentata-o-fusa.jpg"),
        "tag": "Auto Incidentata o Fusa",
        "topic": "Collision damaged crashed vehicle"
    },
    # 24. Societa o partita IVA
    "vendere-auto-usata-di-societa-o-partita-iva": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1556189250-72ba954cfc2b.jpg"),
        "tag": "Società & Partita IVA",
        "topic": "Executive corporate company car leather interior"
    },
    # 25. Bollo scaduto
    "vendere-auto-usata-con-bollo-scaduto": {
        "file": os.path.join(BRAIN_PREV1, "bollo_auto_sicilia_1788274693252.jpg"),
        "tag": "Bollo Auto Arretrato",
        "topic": "Official Italian Bollo Auto tax payment receipt"
    },
    # 26. Elettrica SOH batteria
    "vendere-auto-usata-elettrica-batteria": {
        "file": os.path.join(BRAIN_CURRENT, "batteria_auto_test_1788617185812.jpg"),
        "tag": "SOH Batteria Elettrica",
        "topic": "Battery health diagnostic test with multimeter"
    },
    # 27. Impianto GPL
    "vendere-auto-usata-con-impianto-gpl": {
        "file": os.path.join(VERIFIED_VEN, "vendere-auto-usata-con-impianto-gpl.jpg"),
        "tag": "Impianto GPL & Bombole",
        "topic": "Vehicle LPG Autogas conversion system"
    },
    # 28. Test drive in sicurezza
    "vendere-auto-usata-in-sicurezza-test-drive": {
        "file": os.path.join(BRAIN_PREV1, "auto_rubate_sicurezza_1788274672128.jpg"),
        "tag": "Test Drive Sicuro",
        "topic": "Vehicle security verification and test drive"
    },
    # 29. Auto d epoca ASI
    "vendere-auto-usata-d-epoca-valutazione": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1508974239320-0a029497e820.jpg"),
        "tag": "Auto d'Epoca & ASI",
        "topic": "Classic vintage heritage automobile"
    },
    # 30. Verbale di consegna
    "consegna-auto-usata-verbale-passaggio": {
        "file": os.path.join(UNSPLASH_DIR, "photo-1449965408869-eaa3f722e40d.jpg"),
        "tag": "Verbale di Consegna",
        "topic": "Driver behind the wheel taking delivery of car"
    }
}

print(f"Total Acquisto mapped: {len(FINAL_MAPPING_ACQUISTO)}")
print(f"Total Vendita mapped : {len(FINAL_MAPPING_VENDITA)}")

# Check file existence and duplicates
all_files = []
missing = []

print("\n--- AUDIT ACQUISTO (43) ---")
for slug, item in FINAL_MAPPING_ACQUISTO.items():
    f = item['file']
    exists = os.path.exists(f)
    if not exists:
        missing.append((slug, f))
    else:
        sz = os.path.getsize(f) // 1024
        all_files.append(f)
        print(f"[OK] {slug} -> {os.path.basename(f)} ({sz} KB) | Tag: {item['tag']} | Topic: {item['topic']}")

print("\n--- AUDIT VENDITA (30) ---")
for slug, item in FINAL_MAPPING_VENDITA.items():
    f = item['file']
    exists = os.path.exists(f)
    if not exists:
        missing.append((slug, f))
    else:
        sz = os.path.getsize(f) // 1024
        all_files.append(f)
        print(f"[OK] {slug} -> {os.path.basename(f)} ({sz} KB) | Tag: {item['tag']} | Topic: {item['topic']}")

print(f"\nMissing files: {len(missing)}")
for slug, f in missing:
    print(f"  MISSING: {slug} -> {f}")

# Check duplicates across the entire 73 set
from collections import Counter
counts = Counter(all_files)
duplicates = {f: c for f, c in counts.items() if c > 1}
print(f"\nDuplicate files count: {len(duplicates)}")
for f, c in duplicates.items():
    print(f"  DUPLICATE ({c}x): {os.path.basename(f)}")
