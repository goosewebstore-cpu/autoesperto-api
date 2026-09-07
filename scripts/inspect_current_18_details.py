import re
import glob

articles = [
    'straccia-bollo-sicilia-2026-chi-puo-farlo-norme',
    'bollo-auto-sicilia-2026-chi-paga-esenzioni',
    'profilo-auto-digitale-passaporto-veicolo',
    'valore-residuo-auto-usata-fattori',
    'passaggio-proprieta-auto-usata-costi',
    'vendere-auto-usata-con-doppia-chiave',
    'vendere-auto-usata-garanzia-tra-privati',
    'trattativa-prezzo-vendita-auto-usata',
    'svalutazione-auto-usata-anno-per-anno',
    'visura-pra-auto-usata-cosa-controllare',
    'valutazione-auto-usata-incidenza-chilometri',
    'valutazione-auto-usata-incidenza-optional',
    'auto-usate-che-perdono-piu-valore-2026',
    'cambio-olio-motore-ogni-quanti-km',
    'climatizzatore-auto-non-raffredda-ricarica',
    'candele-e-candelette-sostituzione-sintomi',
    'cuscinetti-ruota-rumore-rombo-velocita',
    'auto-usate-da-300000-km-indistruttibili'
]

builder_files = [
    'scripts/build_truly_unique_acquisto.py',
    'scripts/build_truly_unique_vendita.py',
    'scripts/build_truly_unique_valutazione.py',
    'scripts/build_truly_unique_manutenzione.py',
    'scripts/build_truly_unique_affidabilita.py'
]

for a in articles:
    print(f"\nTarget: {a}")
    found = False
    for bf in builder_files:
        content = open(bf, encoding='utf-8').read()
        if a in content:
            m = re.search(rf'"{a}":\s*\{{([^}}]+)\}}', content)
            if m:
                print(f"  [{bf}] -> {m.group(1).strip()[:140]}")
                found = True
    if not found:
        print("  Not found in build_truly_unique files")
