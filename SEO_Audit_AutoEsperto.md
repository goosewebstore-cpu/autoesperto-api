# SEO Audit — AutoEsperto (autoesperto.vercel.app)

## Executive Summary

**Sito:** AutoEsperto — Scanner AI per auto usate, con stima prezzo di mercato da annunci reali.  
**Modello:** Freemium (prima analisi gratuita, poi 5,99 € una tantum).  
**Struttura:** SaaS/tool con catalogo di ~10.000+ pagine di valutazione per marca/modello/anno.  

**Valutazione complessiva:** Il sito ha una **struttura SEO eccellente** dal punto di vista architetturale, ma presenta criticità tecniche e di autorità che limitano la crescita organica.

### Top 5 Problemi Prioritari
1. **Dominio di terzo livello** (`vercel.app`) — penalizza trust, branding e condivisione link
2. **Rendering client-side** — i contenuti principali potrebbero non essere indicizzati correttamente da Google
3. **Nessun contenuto editoriale/blog** — si perde il 70% del traffico informational ("problemi comuni", "quale scegliere", "consumi reali")
4. **Schema markup assente o non verificabile** — nessun rich snippet nei risultati di ricerca
5. **Assenza di backlink e citazioni** — il dominio non ha autorità nel settore automotive italiano

---

## Technical SEO Findings

### 1. Dominio e Hosting
| | |
|---|---|
| **Issue** | Il sito è ospitato su `autoesperto.vercel.app` (sottodominio di piattaforma) |
| **Impact** | **Alto** — perde trust agli occhi degli utenti e di Google; difficile da ricordare e condividere; rischio di penalizzazione associata al dominio radice |
| **Evidence** | URL completo: `https://autoesperto.vercel.app/valutazione/audi/a4` |
| **Fix** | **Migrare urgentemente a un dominio proprio** (es. `autoesperto.it`, `auto-esperto.com`). Configurare redirect 301 da vercel.app al nuovo dominio. |
| **Priority** | **CRITICA — Bloccante per la scalata** |

### 2. JavaScript Rendering (SSR/SSG)
| | |
|---|---|
| **Issue** | Il fetch statico mostra contenuto minimale; titoli, meta e contenuti sembrano iniettati via JavaScript |
| **Impact** | **Alto** — Google potrebbe non vedere titoli ottimizzati, FAQ, prezzi e link interni durante il crawl |
| **Evidence** | La risposta HTML della pagina `/valutazione/audi/a4` contiene solo testo grezzo senza tag `<h1>`, `<title>` o meta tag visibili nel sorgente statico |
| **Fix** | Implementare **Server-Side Rendering (SSR)** o **Static Site Generation (SSG)** per le pagine di valutazione. Vercel supporta Next.js con `getStaticPaths` + `getStaticProps` per pre-renderizzare tutte le pagine del catalogo. |
| **Priority** | **CRITICA** |

### 3. Sitemap XML
| | |
|---|---|
| **Issue** | Sitemap ben strutturato ma di dimensioni massicce; suddivisione in sottositemap (static, makes, models, years) è corretta |
| **Impact** | **Medio** — rischio che Google non processi tutti i sottositemap se il crawl budget è limitato |
| **Evidence** | `sitemapindex.xml` punta a 7 sottositemap; il `models.xml` contiene decine di migliaia di URL |
| **Fix** | ✅ Già ben fatto. Aggiungere `lastmod` aggiornato dinamicamente in base alla freschezza dei dati di prezzo. |
| **Priority** | **Medio** |

### 4. Robots.txt
| | |
|---|---|
| **Issue** | Configurazione corretta ma migliorabile |
| **Impact** | **Basso** |
| **Evidence** | `Disallow: /api/`, `/account`, `/accesso` — corretto. Presente `Host` (non standard ma utile per Yandex) |
| **Fix** | Aggiungere direttiva `Crawl-delay` se necessario; rimuovere `Host` (obsoleto). Aggiungere link al sitemap nel formato standard. |
| **Priority** | **Basso** |

### 5. Core Web Vitals (Stima)
| | |
|---|---|
| **Issue** | Probabilmente LCP e INP non ottimali a causa del rendering JS e caricamento dinamico dei prezzi |
| **Impact** | **Medio** — Vercel ha buona infrastruttura, ma il client-side fetching rallenta la metrica LCP |
| **Evidence** | Le pagine mostrano "Cerco gli annunci reali in vendita…" come stato di caricamento |
| **Fix** | Pre-renderizzare i prezzi nel build (SSG) e usare ISR (Incremental Static Regeneration) per aggiornarli ogni X ore. Mostrare skeleton solo per dati in real-time. |
| **Priority** | **Medio** |

---

## On-Page SEO Findings

### 6. Title Tags
| | |
|---|---|
| **Issue** | I title sono ben scritti ma potenzialmente iniettati via JS |
| **Impact** | **Alto** — se Google non li vede, perde il principale segnale di rilevanza |
| **Evidence** | "Quanto costa una Audi A4 usata? Prezzo di mercato 2026 \| AutoEsperto" — ottimo pattern: domanda + keyword + brand |
| **Fix** | Assicurarsi che `<title>` sia nel sorgente HTML server-rendered. Mantenere il formato attuale (domanda + keyword + anno + brand). |
| **Priority** | **Alta** |

### 7. Meta Descriptions
| | |
|---|---|
| **Issue** | Non visibili nel fetch statico — verificare presenza nel render |
| **Impact** | **Medio** — senza meta description, Google genera snippet automatici che riducono il CTR |
| **Evidence** | Nessuna `<meta name="description">` visibile nei sorgenti recuperati |
| **Fix** | Aggiungere meta description uniche per ogni pagina modello: "Scopri il prezzo medio di una [Marca] [Modello] usata nel 2026. Affidabilità, problemi comuni e consigli per l'acquisto. Prima analisi gratuita su AutoEsperto." |
| **Priority** | **Alta** |

### 8. Heading Structure
| | |
|---|---|
| **Issue** | H1 presente e ben formulato; la gerarchia sembra corretta |
| **Impact** | **Medio** — verificare che non ci siano H1 multipli per pagina |
| **Evidence** | "Quanto costa una Audi A4 usata?" come H1 nella pagina modello |
| **Fix** | Mantenere un solo H1. Aggiungere H2 per sezioni: "Prezzo di mercato", "Affidabilità", "Problematiche note", "Confronta con alternative". |
| **Priority** | **Medio** |

### 9. FAQ Accordion (SEO)
| | |
|---|---|
| **Issue** | Le FAQ sono presenti e ben formulate, ma necessitano di schema markup |
| **Impact** | **Medio** — senza schema `FAQPage`, Google non mostra le domande espandibili nei SERP |
| **Evidence** | Sezione "Domande frequenti" con accordion visibile nel testo recuperato |
| **Fix** | Implementare schema JSON-LD `FAQPage` per ogni pagina modello. Le domande sono già scritte ottimamente ("Quanto costa…", "Quali problemi…", "Vale la pena…"). |
| **Priority** | **Alta** |

### 10. Schema Markup — Product/Review/Auto
| | |
|---|---|
| **Issue** | Assente o non rilevabile nel sorgente statico |
| **Impact** | **Alto** — nessun rich snippet (stelle, prezzo, immagine) nei risultati di ricerca |
| **Evidence** | Nessun `application/ld+json` visibile nei fetch |
| **Fix** | Aggiungere schema markup per: `Product` (il modello auto), `AggregateRating` (affidabilità), `Offer` (range prezzo), `FAQPage` (domande frequenti). Per le pagine anno, usare `Vehicle` schema. |
| **Priority** | **Alta** |

### 11. URL Structure
| | |
|---|---|
| **Issue** | ✅ Eccellente — chiara, gerarchica, keyword-friendly |
| **Impact** | — |
| **Evidence** | `/valutazione/audi/a4` → `/valutazione/audi/a4/2022` |
| **Fix** | Nessuna. Mantenere coerenza. |
| **Priority** | — |

### 12. Internal Linking
| | |
|---|---|
| **Issue** | Presente ma basilare ("Altri modelli [Marca]") |
| **Impact** | **Medio** — potenziale crawl budget non sfruttato; distribuzione PageRank non ottimale |
| **Evidence** | Solo link a modelli della stessa marca; nessun link cross-marca o a contenuti correlati |
| **Fix** | Aggiungere sezioni: "Alternative simili" (link a competitor del modello), "Confronta con…" (link a /confronta pre-popolata), "Guide all'acquisto" (link al futuro blog). |
| **Priority** | **Medio** |

---

## Content Quality Findings

### 13. Thin Content su Pagine Modello
| | |
|---|---|
| **Issue** | Le pagine modello hanno struttura ma contenuto testuale sottile: solo prezzo, FAQ e lista anni |
| **Impact** | **Medio** — Google potrebbe considerarle "doorway pages" se il contenuto non è sufficientemente unico e di valore |
| **Evidence** | La pagina `/valutazione/audi/a4` ha ~150 parole di contenuto effettivo oltre alle FAQ |
| **Fix** | Arricchire ogni pagina modello con: introduzione di 200-300 parole, tabella specifiche tecniche, grafico andamento prezzo, sezione "Pro e contro", foto rappresentativa. |
| **Priority** | **Alta** |

### 14. Assenza di Blog / Contenuto Editoriale
| | |
|---|---|
| **Issue** | Il sito non ha sezione blog, guide o approfondimenti |
| **Impact** | **CRITICO** — si perde l'intero funnel informational che porta il 60-70% del traffico in questo settore |
| **Evidence** | Nessuna URL di tipo `/blog/`, `/guida/`, `/consigli/` nel sitemap |
| **Fix** | Creare sezione blog con contenuti mirati: "Migliori auto usate sotto i 10.000€", "Problemi comuni Audi A4 B8", "Come negoziare il prezzo di un'auto usata", "Documenti necessari per il passaggio di proprietà". |
| **Priority** | **CRITICA** |

### 15. E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
| | |
|---|---|
| **Issue** | Debole su tutti i fronti E-E-A-T |
| **Impact** | **Alto** — Google penalizza siti YMYL (Your Money Your Life) con bassa E-E-A-T; l'acquisto auto rientra in questa categoria |
| **Evidence** | Nessuna pagina "Chi siamo" con credenziali del team; nessuna menzione di fonti dati; nessun autore visibile; indirizzo contatto assente o generico |
| **Fix** | 1. Creare pagina "Chi siamo" con foto, bio e credenziali del fondatore/team. 2. Specificare fonte dati (es. "Dati aggregati da [portali annunci]"). 3. Aggiungere data di ultimo aggiornamento su ogni pagina valutazione. 4. Inserire recensioni utente verificate. |
| **Priority** | **Alta** |

---

## Authority & Links

### 16. Backlink Profile
| | |
|---|---|
| **Issue** | Probabilmente zero o pochissimi backlink di qualità |
| **Impact** | **Alto** — senza link autoritari, Google non considera il sito rilevante nel settore |
| **Evidence** | Dominio vercel.app con bassissima probabilità di aver ricevuto citazioni editoriali |
| **Fix** | 1. **Digital PR:** contattare blog automotive (AutoBlog, Quattroruote, Motor1) con studio dati unici ("Ecco quanto si svalutano le auto elettriche in Italia"). 2. **Guest post** su siti di settore. 3. **Partnership** con concessionari e siti di annunci. 4. **Directory** qualificate (PagineGialle, Capterra, Product Hunt). |
| **Priority** | **Alta** |

---

## Prioritized Action Plan

### Fase 1: Critical Fixes (Settimana 1-2) — Sbloccano l'indicizzazione
1. **Migrare a dominio proprio** (`autoesperto.it` o simile) + redirect 301
2. **Implementare SSR/SSG** per tutte le pagine di valutazione (Next.js `getStaticPaths`)
3. **Verificare indicizzazione:** controllare `site:autoesperto.vercel.app` su Google
4. **Aggiungere meta description** statiche nel `<head>` server-rendered

### Fase 2: High-Impact Improvements (Settimana 3-4) — Massimizzano CTR e ranking
5. **Schema markup FAQPage** su tutte le pagine modello
6. **Schema Vehicle + AggregateRating** per rich snippet prezzo e stelle
7. **Arricchire contenuto pagine modello** (+200-300 parole, tabella tech, pro/contro)
8. **Creare sezione Blog** con 10-15 articoli pillar su keyword informational ad alto volume

### Fase 3: Quick Wins (Settimana 2-3) — Basso sforzo, alto ritorno
9. **Ottimizzare internal linking** (alternative simili, confronto, guide)
10. **Aggiungere data ultimo aggiornamento** prezzi visibile in pagina
11. **Creare pagina Chi Siamo** con credenziali e foto team
12. **Aggiungere recensioni utente** con schema Review

### Fase 4: Long-term (Mese 2-6) — Costruzione autorità
13. **Digital PR mensile** con studi su dati auto usate unici
14. **Guest posting** su 2-3 blog automotive italiani al mese
15. **Newsletter** per retention e traffico diretto
16. **Integrazione social** (TikTok/Reels con "scopri quanto vale la tua auto")

---

## Calcolo Impatto Traffico Stimato

### Scenario Attuale (stima)
- Pagine indicizzate: ~2.000-5.000
- Traffico organico mensile: **500-2.000 visite** (stima conservativa)

### Scenario Post-Fix (6 mesi)
- Pagine indicizzate: ~8.000-10.000
- Traffico organico mensile: **15.000-40.000 visite**
- Driver: blog informational (60%), pagine modello long-tail (30%), brand (10%)

### Scenario Post-Fix (12 mesi con link building)
- Traffico organico mensile: **50.000-100.000 visite**
- Conversione stimata (freemium): 2-3% → **1.000-3.000 analisi a pagamento/mese**

---

## Keyword Target Consigliate (Italia)

### High-Volume (Blog / Informational)
- "quanto costa una [marca] [modello] usata" — già targettata ✅
- "problemi comuni [modello]"
- "consumi reali [modello]"
- "migliori auto usate sotto i X euro"
- "auto che si svalutano di meno"
- "documenti per acquisto auto usata"

### Long-Tail Conversion (Pagine Valutazione)
- "prezzo [marca] [modello] [anno] usata"
- "valutazione [marca] [modello] affidabilità"
- "quanto vale la mia [marca] [modello]"

---

*Audit completato il 05/08/2026. Prossimo step consigliato: avviare la migrazione al dominio proprio e l'implementazione SSR.*
