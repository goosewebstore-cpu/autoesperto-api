# Changelog

## Fase 0 – Fix Priorità Zero (audit prodotto) — 2026-08-17

### P0-1: Prezzi duplicati nelle alternative (McLaren, Pagani, Bugatti, Koenigsegg…)
- Causa: `findBrandBase()` restituiva un solo valore per marca (es. 161.000 € per tutte le McLaren, 28.000 € per tutte le Pagani via fallback hash).
- Fix in `apps/web/src/lib/stima.ts`:
  - Esteso `MODEL_PRICE` con i prezzi di listino degli esotici del catalogo (McLaren, Pagani, Bugatti, Koenigsegg, Ferrari, Lamborghini, Aston Martin, Lotus, Rolls-Royce, Bentley, Tesla, Noble, TVR, Spyker, Morgan).
  - Aggiunti a `BRAND_BASE` i marchi mancanti (bugatti, koenigsegg, pagani, noble, tvr, spyker, morgan) come fallback sensato.
  - Aggiunti a `COLLECTIBLE_MAKES` i nuovi marchi per il floor collezionismo.
  - Deduplicazione in `buildAlternatives()`: un'alternativa con valore identico a una già proposta viene saltata.
- Verifica live: `/valutazione/mclaren/765lt/2024` mostra 4 alternative con prezzi distinti (109.400 / 115.900 / 135.200 / 151.300 €); `/valutazione/bugatti/chiron/2018` → 550.000 / 1.375.000 / 2.200.000 / 4.400.000 €.

### P0-2: Testi di affidabilità riciclati ("Rete di assistenza capillare in Italia" su McLaren)
- Causa: `detectSegment()` classificava gli esotici come 'utility' (default) e `SEGMENT_STRENGTHS` era condiviso per segmento.
- Fix:
  - `apps/web/src/lib/riparazione.ts`: nuova lista esportata `BOUTIQUE_SPORT_MAKES` (mclaren, pagani, bugatti, koenigsegg, ferrari, lamborghini, aston martin, lotus, noble, tvr, spyker, morgan, saleen, zenvo, apollo, gumpert, rimac, de tomaso, bizzarrini, maserati, rolls royce, bentley, maybach, brabus, porsche) → segmento 'sportiva'.
  - `apps/web/src/lib/affidabilita.ts`: riformulate le strengths 'utility' (niente più "Rete di assistenza capillare in Italia"); `verdictNote` onesto per i marchi boutique: "Dati specifici di affidabilità non disponibili per la …: la stima è basata sul segmento sportivo e sul marchio, non su statistiche verificate di questo modello."
  - `apps/web/src/components/ModelReportCard.tsx`: ora renderizza `reliability.summary` (prima mostrato solo in ReportScoreHero e PDF).
- Verifica live: `/affidabilita/mclaren/765lt/2024` mostra il disclaimer e le strengths del segmento sportiva; il vecchio testo è assente.

### P0-3: Anni impossibili (pagine anno per auto mai prodotte, range fisso 2015→oggi)
- Causa: pagine anno accettavano 2010..anno corrente+1; link anni da range fisso; `catalogo.json` non contiene anni di produzione.
- Fix:
  - Nuovo `apps/web/src/lib/model-years.ts`: mappa anni di produzione (~400 modelli popolari + esotici + produzione terminata) con `getModelYears`, `getRecentModelYears`, `isValidModelYear`; fallback `[anno corrente-19, anno corrente]`, mai anni futuri.
  - Pagine anno (`valutazione`, `riparazione`, `affidabilita`, `consumi` × `[make]/[model]/[year]`): `notFound()` per anni fuori produzione; link anni vicini reali.
  - Pagine modello: link "per anno" da anni reali (ultimi 11, o 5 recenti per valutazione).
  - Le pagine anno erano già `noindex,follow` e non in sitemap: nessun impatto indicizzazione.
- Verifica live: `/valutazione/pagani/zonda-f/2026` → 404; `/valutazione/pagani/zonda-f/2007` → 200; `/valutazione/mclaren/765lt/2025` → 404; `/valutazione/mclaren/765lt/2024` → 200.

### Nota: tema chiaro (deploy precedente, mai committato)
- Tema 3 colori (bianco/nero/blu) su tutte le pagine: incluso in questo commit perché i file sono sovrapposti ai fix P0. Già live dalla versione 9ed70d0b; qui aggiunto il CHANGELOG per tracciarlo.