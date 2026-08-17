# AUDIT AutoEsperto.it — Piano e verifica Priorità Zero (branch `audit-v1`)

## Esito verifiche Priorità Zero (confermate nel codice)

### P0-1 · Prezzi duplicati nel widget "Confronta con auto simili" — CONFERMATO, causa diversa da quella ipotizzata
Il widget NON riusa il prezzo dell'auto principale: `buildAlternatives()` in `apps/web/src/lib/stima.ts:359-392` calcola `estimateMarketValue()` per ciascun modello comparato.

La causa reale è il **fallback per marca**: i modelli non presenti in `MODEL_PRICE` usano `findBrandBase()` (`stima.ts:219-231`) — un singolo valore per marca:
- McLaren: `BRAND_BASE.mclaren = 250000` → 570GT, 570S, 600LT, 600LT Spider e 765LT ottengono tutti la stessa base → stesso valore finale "161.000 €"
- Pagani: marca non in `BRAND_BASE` → hash fallback tra [21000…35000] → "28.000 €" per Huayra, Huayra BC, Huayra R, Utopia e Zonda F

### P0-2 · Testo affidabilità riciclato — CONFERMATO
`estimateReliability()` in `apps/web/src/lib/affidabilita.ts:136-160` assegna `SEGMENT_STRENGTHS[segmentKey]` a TUTTI i modelli del segmento:
- tutte le sportive (McLaren, Pagani, Ferrari…) → "Componenti di qualità superiore" / "Manutenzione curata da officine specializzate"
- tutte le utilitarie → "Buon equilibrio tra solidità e costi" / "Rete di assistenza capillare in Italia" (falso per marchi esotici)
`verdictNoteFor()` genera il paragrafo solo dallo score. Non esistono dati di affidabilità per modello nel codice.

### P0-3 · Anni generati senza vincolo alla produzione reale — CONFERMATO
- `valutazione/[make]/[model]/[year]/page.tsx:35,77` accetta qualsiasi anno tra 2010 e `CURRENT_YEAR + 1` (→ 2026 per 765LT)
- `:17-19` link "altri anni" da range fisso 2015→corrente; `[model]/page.tsx:21-23` propone 5 anni fissi (corrente−4..corrente)
- `catalogo.json` non contiene gli anni di produzione dei modelli
- Mitigazioni esistenti: le pagine anno sono già `noindex, follow` e NON sono nella sitemap (`sitemaps.ts` genera solo make/model) → nessun impatto di indicizzazione, solo veridicità + crawl budget.

## Piano d'azione

### P0 — Fix immediati (toccano pricing engine + logica anni → serve conferma)
1. **P0-1**: estendere `MODEL_PRICE` con i modelli mancanti (McLaren 570GT/570S/600LT/765LT, Pagani Huayra/Zonda/Utopia, altri esotici presenti nel catalogo) usando prezzi di listino reali e pubblici; deduplicare/rimuovere le alternative che risolverebbero al fallback identico.
2. **P0-2**: rendere onesto il testo: strengths per segmento riformulate in modo neutro (niente affermazioni marca-specifiche false), disclaimer esplicito "stima basata su segmento e marchio, non su dati specifici del modello"; per marchi esotici (Pagani, McLaren, Bugatti, Koenigsegg, Rimac…) → "Dati di affidabilità non ancora disponibili per questo modello".
3. **P0-3**: nuova mappa `MODEL_YEARS` (marca|modello → intervallo di produzione reale) per i ~110 modelli popolari + i modelli problematici; fallback onesto per gli altri (mai anni futuri, mai > produzione nota); 404 sugli anni fuori produzione; la pagina modello elenca solo gli anni realmente prodotti.

### P1 — Dopo conferma P0
- Homepage: una CTA primaria in hero, sezioni per categoria prodotto, riduzione del peso visivo, verifica mobile-first
- Report: gerarchia 3 livelli (verdetto+valore → score/affidabilità/mercato → dettagli), loading state con passi reali ("Identificazione ✓ → Analisi immagini → Valutazione")
- Navbar/accordion mobile minimale; tap target ≥ 44px
- Audit console errors, contrasto colore (calcolo numerico), focus state tastiera, aria
- SEO: controllo thin content FAQ, internal linking coerente

### P2 — Microcopy, error/empty state, design system uniforme, performance (font/immagini/bundle)

### P3 — Nice-to-have

## Limiti dichiarati
- Lighthouse/CWV reali: non eseguibili da CLI in questo ambiente; proverò PageSpeed Insights API per le pagine chiave, altrimenti analisi statica dichiarata come tale
- Dati annunci reali (API su Render): verificabili solo se l'API risponde
- Analytics/conversioni: non accessibili — nessun numero inventato, nessuna stima presentata come dato
- Contrasto: calcolato numericamente sui colori del design system (verificabile, deterministico)

## Changelog (per fase)
- Verrà aggiornato a ogni fase completata.