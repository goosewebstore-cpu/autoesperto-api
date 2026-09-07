import os

CACHE = "scripts/accurate_cache/acquisto"
UNSPLASH = "scripts/unsplash_cache"
BRAIN_CURRENT = r"C:\Users\noizz\.gemini\antigravity-ide\brain\e4a5a93d-3693-431f-bf52-f9e794b585e9"
BRAIN_PREV1 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\8d3e70b0-7e6f-4427-be47-45873c417b55"
BRAIN_PREV2 = r"C:\Users\noizz\.gemini\antigravity-ide\brain\f8051a05-82f2-4de7-9b49-9269652cf32b"

PERFECT_VENDITA = {
    # 1. Come fissare il prezzo giusto -> Financial price calculation document
    "come-fissare-prezzo-vendita-auto": {
        "file": os.path.join(UNSPLASH, "photo-1554224155-8d04cb21cd6c.jpg"),
        "tag": "Prezzo di Vendita"
    },
    # 2. Scrivere annuncio perfetto -> Smartphone taking photo of car for ad
    "annuncio-auto-usata-perfetto-guida": {
        "file": os.path.join(UNSPLASH, "photo-1512941937669-90a1b58e7e9c.jpg"),
        "tag": "Annuncio Perfetto"
    },
    # 3. Fotografare l'auto usata -> Smartphone framing vehicle shot
    "foto-auto-usata-da-caricare-guida": {
        "file": os.path.join(UNSPLASH, "photo-1555774698-0b77e0d5fac6.jpg"),
        "tag": "10 Foto Fondamentali"
    },
    # 4. Permuta in concessionario -> Dealership showroom sales floor
    "permuta-auto-usata-conviene-calcolo": {
        "file": os.path.join(UNSPLASH, "photo-1562911791-c7a97b729ec5.jpg"),
        "tag": "Permuta vs Vendita"
    },
    # 5. Pagamento sicuro bonifico istantaneo -> Mobile banking payment app
    "pagamento-sicuro-vendita-auto-usata": {
        "file": os.path.join(UNSPLASH, "photo-1563986768609-322da13575f3.jpg"),
        "tag": "Pagamento Sicuro"
    },
    # 6. Atto di vendita autentica firma -> Handshake and signing agreement
    "atto-di-vendita-auto-usata-autentica": {
        "file": os.path.join(UNSPLASH, "photo-1450133064473-71024230f91b.jpg"),
        "tag": "Atto di Vendita"
    },
    # 7. Vendere con finanziamento in corso -> Loan contract settlement paperwork
    "vendere-auto-usata-con-finanziamento-in-corso": {
        "file": os.path.join(UNSPLASH, "photo-1454165804606-c3d57bc86b40.jpg"),
        "tag": "Finanziamento in Corso"
    },
    # 8. Vendere auto senza revisione -> Workshop revisione inspection lane
    "vendere-auto-usata-senza-revisione": {
        "file": os.path.join(UNSPLASH, "photo-1486262715619-67b85e0b08d3.jpg"),
        "tag": "Revisione Scaduta"
    },
    # 9. Vendere con danni carrozzeria -> Machine polishing and paint scratch repair
    "vendere-auto-usata-con-danni-carrozzeria": {
        "file": os.path.join(UNSPLASH, "photo-1601362840469-51e4d8d58785.jpg"),
        "tag": "Danni Carrozzeria"
    },
    # 10. Esportazione all'estero -> European motorway highway transport
    "vendere-auto-per-esportazione-estero": {
        "file": os.path.join(UNSPLASH, "photo-1502877338535-766e1452684a.jpg"),
        "tag": "Esportazione Estero"
    },
    # 11. Servizi compro auto usate -> Professional used car buying facility
    "vendere-auto-usata-a-compro-auto": {
        "file": os.path.join(UNSPLASH, "photo-1563720223185-11003d516935.jpg"),
        "tag": "Servizi Compro Auto"
    },
    # 12. Valore residuo fattori -> High-end market appraisal
    "valore-residuo-auto-usata-fattori": {
        "file": os.path.join(UNSPLASH, "photo-1544636331-e26879cd4d9b.jpg"),
        "tag": "Valore Residuo"
    },
    # 13. Storico tagliandi -> Service booklet records and car keys
    "vendere-auto-usata-storico-tagliandi": {
        "file": os.path.join(UNSPLASH, "photo-1567808291548-fc3ee04dbcf0.jpg"),
        "tag": "Storico Tagliandi"
    },
    # 14. Vendere auto tra parenti -> Giving car keys hand to hand
    "vendere-auto-usata-tra-parenti": {
        "file": os.path.join(UNSPLASH, "photo-1549465220-1a8b9238cd48.jpg"),
        "tag": "Vendita tra Parenti"
    },
    # 15. Doppia chiave e manuali -> Two remote smart car key fobs
    "vendere-auto-usata-con-doppia-chiave": {
        "file": os.path.join(UNSPLASH, "photo-1621905251189-08b45d6a269e.jpg"),
        "tag": "Doppia Chiave & Manuali"
    },
    # 16. Garanzia visto e piaciuto tra privati -> Agreement document and keys on desk
    "vendere-auto-usata-garanzia-tra-privati": {
        "file": os.path.join(UNSPLASH, "photo-1599819811279-d5ad9cccf838.jpg"),
        "tag": "Visto e Piaciuto"
    },
    # 17. Conto vendita in concessionario -> Showroom showroom vehicle with sales tag
    "vendere-auto-usata-in-conto-vendita": {
        "file": os.path.join(UNSPLASH, "photo-1553440569-bcc63803a83d.jpg"),
        "tag": "Conto Vendita"
    },
    # 18. Detailing ed igienizzazione -> Car wash foam active cleaning
    "preparare-auto-usata-alla-vendita": {
        "file": os.path.join(UNSPLASH, "photo-1607860108855-64acf2078ed9.jpg"),
        "tag": "Detailing & Pulizia"
    },
    # 19. Aste auto online -> Online sports car auction platform
    "vendere-auto-usata-all-asta-online": {
        "file": os.path.join(UNSPLASH, "photo-1552519507-da3b142c6e3d.jpg"),
        "tag": "Aste Online Auto"
    },
    # 20. Fermo amministrativo fiscale -> Administrative rubber stamp seal document
    "vendere-auto-usata-con-fermo-fiscale": {
        "file": os.path.join(CACHE, "acquisto-auto-con-fermo-amministrativo.jpg"),
        "tag": "Sblocco Fermo Fiscale"
    },
    # 21. Vendita all'estero senza IVA -> Scenic highway cross-border route
    "vendere-auto-usata-all-estero-senza-iva": {
        "file": os.path.join(UNSPLASH, "photo-1542282088-72c9c27ed0cd.jpg"),
        "tag": "Vendita Estero & IVA"
    },
    # 22. Trattativa sul prezzo -> Key fob on contract table during negotiation
    "trattativa-prezzo-vendita-auto-usata": {
        "file": os.path.join(UNSPLASH, "photo-1582139329536-e7284fece509.jpg"),
        "tag": "Trattativa Prezzo"
    },
    # 23. Auto incidentata o con motore fuso -> Car with real collision damage
    "vendere-auto-usata-incidentata-o-fusa": {
        "file": os.path.join(CACHE, "come-capire-se-auto-usata-incidentata.jpg"),
        "tag": "Auto Incidentata o Fusa"
    },
    # 24. Vendere auto di società o P.IVA -> Corporate invoice & business report
    "vendere-auto-usata-di-societa-o-partita-iva": {
        "file": os.path.join(BRAIN_PREV2, "investor_banner_1788559154127.jpg"),
        "tag": "Società & Partita IVA"
    },
    # 25. Bollo auto scaduto arretrato -> Official Italian car tax bollo document
    "vendere-auto-usata-con-bollo-scaduto": {
        "file": os.path.join(BRAIN_PREV1, "bollo_auto_sicilia_1788274693252.jpg"),
        "tag": "Bollo Auto Arretrato"
    },
    # 26. Auto elettrica SOH batteria -> High-tech electric car
    "vendere-auto-usata-elettrica-batteria": {
        "file": os.path.join(UNSPLASH, "photo-1583121274602-3e2820c69888.jpg"),
        "tag": "SOH Batteria Elettrica"
    },
    # 27. Vendere auto GPL -> Autogas LPG filling pump and nozzle
    "vendere-auto-usata-con-impianto-gpl": {
        "file": os.path.join(CACHE, "auto-usate-gpl-metano-conviene.jpg"),
        "tag": "Impianto GPL & Bombole"
    },
    # 28. Prova su strada in sicurezza -> Hands on steering wheel daytime test drive
    "vendere-auto-usata-in-sicurezza-test-drive": {
        "file": os.path.join(UNSPLASH, "photo-1449965408869-eaa3f722e40d.jpg"),
        "tag": "Test Drive Sicuro"
    },
    # 29. Auto trentennale d'epoca ASI -> Classic vintage Italian collector car
    "vendere-auto-usata-d-epoca-valutazione": {
        "file": os.path.join(UNSPLASH, "photo-1508974239320-0a029497e820.jpg"),
        "tag": "Auto d'Epoca & ASI"
    },
    # 30. Verbale di consegna auto usata -> Car delivery inspection paper
    "consegna-auto-usata-verbale-passaggio": {
        "file": os.path.join(UNSPLASH, "photo-1520340356584-f9917d1eea6f.jpg"),
        "tag": "Verbale di Consegna"
    }
}

print(f"Total entries in VENDITA: {len(PERFECT_VENDITA)}")
for k, v in PERFECT_VENDITA.items():
    exists = os.path.exists(v['file'])
    print(f"[{'OK' if exists else 'MISSING'}] {k} -> {os.path.basename(v['file'])}")
    if not exists:
        print(f"  Missing path: {v['file']}")
