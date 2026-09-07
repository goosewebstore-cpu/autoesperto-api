import os
import json

articles = [
    ("straccia-bollo-sicilia-2026-chi-puo-farlo-norme", "valutazione"),
    ("bollo-auto-sicilia-2026-chi-paga-esenzioni", "valutazione"),
    ("profilo-auto-digitale-passaporto-veicolo", "manutenzione"),
    ("valore-residuo-auto-usata-fattori", "vendita"),
    ("passaggio-proprieta-auto-usata-costi", "acquisto"),
    ("vendere-auto-usata-con-doppia-chiave", "vendita"),
    ("vendere-auto-usata-garanzia-tra-privati", "vendita"),
    ("trattativa-prezzo-vendita-auto-usata", "vendita"),
    ("svalutazione-auto-usata-anno-per-anno", "valutazione"),
    ("visura-pra-auto-usata-cosa-controllare", "valutazione"),
    ("valutazione-auto-usata-incidenza-chilometri", "valutazione"),
    ("valutazione-auto-usata-incidenza-optional", "valutazione"),
    ("auto-usate-che-perdono-piu-valore-2026", "valutazione"),
    ("cambio-olio-motore-ogni-quanti-km", "manutenzione"),
    ("climatizzatore-auto-non-raffredda-ricarica", "manutenzione"),
    ("candele-e-candelette-sostituzione-sintomi", "manutenzione"),
    ("cuscinetti-ruota-rumore-rombo-velocita", "manutenzione"),
    ("auto-usate-da-300000-km-indistruttibili", "affidabilita")
]

print("=== CURRENT STATE OF 18 REQUESTED ARTICLES ===")
for slug, cat in articles:
    p = f"apps/web/public/images/guide/{slug}.jpg"
    sz = os.path.getsize(p)//1024 if os.path.exists(p) else 0
    print(f"[{cat:12s}] {slug} ({sz} KB)")
