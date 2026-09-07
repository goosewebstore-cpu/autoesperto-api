import os

CACHE = "scripts/accurate_cache/acquisto"
UNSPLASH = "scripts/unsplash_cache"
BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"

PERFECT_ACQUISTO = {
    # 1. 10 Segnali d'allarme nell'annuncio -> Inspector examining car
    "auto-usata-10-segnali-problema-annuncio": {
        "file": os.path.join(CACHE, "auto-usata-10-segnali-problema-annuncio.jpg"),
        "tag": "10 Segnali D'Allarme"
    },
    # 2. Diesel, benzina o ibrida -> Real gas station fuel pumps
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": {
        "file": os.path.join(CACHE, "diesel-benzina-ibrida-2026-quale-comprare-conviene.jpg"),
        "tag": "Scelta Motorizzazione"
    },
    # 3. Migliori auto 10.000€ -> 2016 Renault Clio
    "migliori-auto-usate-10000-euro-2026": {
        "file": os.path.join(CACHE, "migliori-auto-usate-10000-euro-2026.jpg"),
        "tag": "Budget 10.000€"
    },
    # 4. 5 cose da controllare -> Mechanic inspecting open engine bay
    "5-cose-da-controllare-prima-comprare-auto-usata": {
        "file": os.path.join(CACHE, "5-cose-da-controllare-prima-comprare-auto-usata.jpg"),
        "tag": "5 Controlli Chiave"
    },
    # 5. Auto usata con 100.000 km -> Dashboard odometer speedometer
    "auto-usata-100000-km-conviene-comprare": {
        "file": os.path.join(BRAIN_CURRENT, "spie_cruscotto_auto_1788617111592.jpg"),
        "tag": "Soglia 100.000 Km"
    },
    # 6. Auto incidentata -> Car with collision / bumper damage
    "come-capire-se-auto-usata-incidentata": {
        "file": os.path.join(CACHE, "come-capire-se-auto-usata-incidentata.jpg"),
        "tag": "Riconoscere Incidenti"
    },
    # 7. Diesel Euro 5 -> TDI Common Rail diesel engine bay
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": {
        "file": os.path.join(CACHE, "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi.jpg"),
        "tag": "Diesel Euro 5 & Blocchi"
    },
    # 8. Passaporto digitale veicolo UE -> Phone scanning QR code
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": {
        "file": os.path.join(CACHE, "passaporto-digitale-veicolo-regolamento-ue-2026-1738.jpg"),
        "tag": "Passaporto UE 2026"
    },
    # 9. Auto sotto 3000€ -> Fiat Punto 188
    "auto-usate-sotto-3000-euro-guida": {
        "file": os.path.join(CACHE, "auto-usate-sotto-3000-euro-guida.jpg"),
        "tag": "Budget Sotto 3.000€"
    },
    # 10. Auto sotto 5000€ -> Fiat Grande Punto
    "auto-usate-sotto-5000-euro-scelta": {
        "file": os.path.join(CACHE, "auto-usate-sotto-5000-euro-scelta.jpg"),
        "tag": "Budget Sotto 5.000€"
    },
    # 11. Auto sotto 15000€ -> Crossover SUV
    "auto-usate-sotto-15000-euro-migliori": {
        "file": os.path.join(UNSPLASH, "photo-1590362891991-f776e747a588.jpg"),
        "tag": "Budget Sotto 15.000€"
    },
    # 12. Premium sotto 20000€ -> Audi A4 B9 sedan
    "auto-usate-sotto-20000-euro-premium": {
        "file": os.path.join(CACHE, "auto-usate-sotto-20000-euro-premium.jpg"),
        "tag": "Premium Sotto 20.000€"
    },
    # 13. Neopatentati usate -> Lancia Ypsilon
    "migliori-auto-neopatentati-usate-norme": {
        "file": os.path.join(CACHE, "migliori-auto-neopatentati-usate-norme.jpg"),
        "tag": "Neopatentati 2026"
    },
    # 14. Migliori SUV usati economici -> Dacia Duster
    "migliori-suv-usati-economici-scelta": {
        "file": os.path.join(CACHE, "migliori-suv-usati-economici-scelta.jpg"),
        "tag": "SUV Economici"
    },
    # 15. Auto ibride usate -> Toyota Yaris Cross Hybrid
    "auto-ibride-usate-conviene-controlli": {
        "file": os.path.join(CACHE, "auto-ibride-usate-conviene-controlli.jpg"),
        "tag": "Guida Ibrida Usata"
    },
    # 16. Diesel vs ibrida -> European motorway traffic
    "diesel-vs-ibrida-usata-confronto": {
        "file": os.path.join(CACHE, "diesel-vs-ibrida-usata-confronto.jpg"),
        "tag": "Diesel vs Ibrida"
    },
    # 17. Garanzia legale vs commerciale -> Legal contract signing pen
    "garanzia-auto-usata-commerciale-legale": {
        "file": os.path.join(CACHE, "garanzia-auto-usata-commerciale-legale.jpg"),
        "tag": "Garanzia Legale Usato"
    },
    # 18. Checklist 25 punti -> Mechanic repairing engine bay
    "controlli-pre-acquisto-auto-usata-lista": {
        "file": os.path.join(CACHE, "controlli-pre-acquisto-auto-usata-lista.jpg"),
        "tag": "Checklist 25 Punti"
    },
    # 19. Comprare da privato vs concessionario -> Car dealer showroom outdoor
    "comprare-auto-da-privato-vs-concessionario": {
        "file": os.path.join(UNSPLASH, "photo-1562911791-c7a97b729ec5.jpg"),
        "tag": "Privato o Concessionario"
    },
    # 20. Aste auto usate -> Car auction lot rows
    "aste-auto-usate-come-funzionano-rischi": {
        "file": os.path.join(CACHE, "aste-auto-usate-come-funzionano-rischi.jpg"),
        "tag": "Aste Giudiziarie Auto"
    },
    # 21. Importare auto Germania -> Car carrier transporter truck
    "importare-auto-usata-germania-costi": {
        "file": os.path.join(CACHE, "importare-auto-usata-germania-costi.jpg"),
        "tag": "Importazione Germania"
    },
    # 22. Auto GPL e Metano -> Autogas LPG filling pump
    "auto-usate-gpl-metano-conviene": {
        "file": os.path.join(CACHE, "auto-usate-gpl-metano-conviene.jpg"),
        "tag": "Usato GPL & Metano"
    },
    # 23. Auto elettrica usata SOH batteria -> EV charging cable plugged in
    "auto-elettrica-usata-autonomia-batteria": {
        "file": os.path.join(CACHE, "auto-elettrica-usata-autonomia-batteria.jpg"),
        "tag": "Elettrico SOH Batteria"
    },
    # 24. Chilometri scalati -> OBD2 vehicle diagnostic tool
    "chilometri-scalati-auto-usata-truffa": {
        "file": os.path.join(CACHE, "chilometri-scalati-auto-usata-truffa.jpg"),
        "tag": "Truffa Km Scalati"
    },
    # 25. Fermo amministrativo -> Administrative document official stamp
    "acquisto-auto-con-fermo-amministrativo": {
        "file": os.path.join(CACHE, "acquisto-auto-con-fermo-amministrativo.jpg"),
        "tag": "Fermo Amministrativo"
    },
    # 26. Auto aziendali ed ex noleggio -> Corporate BMW 3-Series fleet
    "auto-usata-aziendale-ex-noleggio": {
        "file": os.path.join(UNSPLASH, "photo-1555215695-3004980ad54e.jpg"),
        "tag": "Auto Aziendali & Flotte"
    },
    # 27. Caparra confirmatoria -> Signing contract with pen
    "caparra-acquisto-auto-usata-regole": {
        "file": os.path.join(UNSPLASH, "photo-1450133064473-71024230f91b.jpg"),
        "tag": "Caparra & Contratto"
    },
    # 28. Auto per famiglia monovolume -> Renault Grand Scenic monovolume
    "auto-usata-per-famiglia-monovolume": {
        "file": os.path.join(CACHE, "auto-usata-per-famiglia-monovolume.jpg"),
        "tag": "Auto per Famiglie"
    },
    # 29. Auto sportiva economica -> Mazda MX-5 Miata roadster
    "auto-usata-sportiva-economica": {
        "file": os.path.join(CACHE, "auto-usata-sportiva-economica.jpg"),
        "tag": "Sportive Economiche"
    },
    # 30. Passaggio di proprietà -> Transfer of ownership certificate & car keys
    "passaggio-proprieta-auto-usata-costi": {
        "file": os.path.join(BRAIN_PREV1, "passaggio_proprieta_1788274847188.jpg"),
        "tag": "Costi Passaggio PRA"
    },
    # 31. Finanziamento auto usata -> Financial calculator, loan document & pen
    "finanziamento-auto-usata-conviene": {
        "file": os.path.join(UNSPLASH, "photo-1454165804606-c3d57bc86b40.jpg"),
        "tag": "Finanziamento & Tassi"
    },
    # 32. Cambio automatico -> DSG dual-clutch automatic gear lever
    "auto-usate-con-cambio-automatico": {
        "file": os.path.join(BRAIN_PREV1, "cambio_dsg_dq200_1788274870564.jpg"),
        "tag": "Cambio Automatico Usato"
    },
    # 33. Auto GPL per neopatentati -> Fiat 500
    "auto-usata-per-neopatentati-gpl": {
        "file": os.path.join(CACHE, "auto-usata-per-neopatentati-gpl.jpg"),
        "tag": "Neopatentati a GPL"
    },
    # 34. 4x4 fuoristrada economici -> Jeep Renegade Trailhawk 4x4
    "auto-usate-4x4-fuoristrada-economici": {
        "file": os.path.join(CACHE, "auto-usate-4x4-fuoristrada-economici.jpg"),
        "tag": "4x4 & Fuoristrada"
    },
    # 35. Auto con gancio traino -> Car towing trailer
    "auto-usata-con-gancio-traino": {
        "file": os.path.join(CACHE, "auto-usata-con-gancio-traino.jpg"),
        "tag": "Auto con Gancio Traino"
    },
    # 36. Citycar per la città -> Red compact urban city car
    "auto-usata-per-citta-citycar": {
        "file": os.path.join(UNSPLASH, "photo-1549399542-7e3f8b79c341.jpg"),
        "tag": "Migliori Citycar Urbane"
    },
    # 37. Auto con bassi consumi -> 2023 Toyota Prius PHEV
    "auto-usate-con-bassi-consumi": {
        "file": os.path.join(CACHE, "auto-usate-con-bassi-consumi.jpg"),
        "tag": "Bassi Consumi Reali"
    },
    # 38. Auto per cani e animali -> Cute dog sitting in car seat
    "auto-usata-per-cani-e-animali": {
        "file": os.path.join(CACHE, "auto-usata-per-cani-e-animali.jpg"),
        "tag": "Viaggiare con Animali"
    },
    # 39. Garanzia 12 mesi copertura -> Dealership mechanic workshop inspection
    "auto-usata-garanzia-12-mesi-copertura": {
        "file": os.path.join(UNSPLASH, "photo-1568605117036-5fe5e7bab0b7.jpg"),
        "tag": "Garanzia 12 Mesi"
    },
    # 40. Siti annunci sicurezza -> Person browsing online marketplace on laptop
    "auto-usata-sito-annunci-sicurezza": {
        "file": os.path.join(CACHE, "auto-usata-sito-annunci-sicurezza.jpg"),
        "tag": "Sicurezza Annunci Web"
    },
    # 41. Chilometri illimitati -> Mercedes W124 high mileage million miles
    "auto-usata-chilometri-illimitati": {
        "file": os.path.join(CACHE, "auto-usata-chilometri-illimitati.jpg"),
        "tag": "Oltre 150.000 Km"
    },
    # 42. Auto per agenti di commercio -> Executive highway motorway driving
    "auto-usata-per-lavoro-agenti": {
        "file": os.path.join(UNSPLASH, "photo-1542282088-72c9c27ed0cd.jpg"),
        "tag": "Auto per Professionisti"
    },
    # 43. Acquisto online consegna a domicilio -> Car carrier loading vehicle for delivery
    "auto-usata-acquisto-online-consegna": {
        "file": os.path.join(CACHE, "auto-usata-acquisto-online-consegna.jpg"),
        "tag": "Acquisto Online & Recesso"
    }
}

print(f"Total entries: {len(PERFECT_ACQUISTO)}")
for k, v in PERFECT_ACQUISTO.items():
    exists = os.path.exists(v['file'])
    print(f"[{'OK' if exists else 'MISSING'}] {k} -> {os.path.basename(v['file'])}")
    if not exists:
        print(f"  Missing path: {v['file']}")
