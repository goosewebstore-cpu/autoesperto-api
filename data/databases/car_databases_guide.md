# Guida ai Database Gratuiti per Auto (Prezzi, Specifiche e Valutazioni)

Questa guida documenta i migliori database e dataset pubblici gratuiti utilizzabili per alimentare il motore di valutazione di **AutoEsperto** e addestrare i suoi modelli di intelligenza artificiale.

---

## 1. Monitoraggio Ufficiale Emissioni e Dati Tecnici UE (EEA Passenger Cars)
* **Ente**: Agenzia Europea per l'Ambiente (EEA) / Commissione Europea
* **Riferimento di Legge**: Regolamento (UE) 2019/631
* **Licenza**: Open Data UE (riutilizzo libero commerciale e non commerciale)
* **Link Portale**: https://www.eea.europa.eu/en/datahub/datahubitem-view/fa8b1229-3db6-495d-b18e-9c9b3267c02b
* **Formati disponibili**: CSV, SQL, Elastic Search Viewer

### Dati Chiave Disponibili:
* `Mh`: Costruttore / Produttore (es. STELLANTIS, VOLKSWAGEN AG, BMW AG)
* `Cn`: Nome Commerciale del Veicolo (es. 500, Golf, Clio, Yaris)
* `Ct`: Categoria di veicolo (M1 per auto passeggeri)
* `Cm3`: Cilindrata esatta del motore
* `Kw`: Potenza massima in kW (facilmente convertibile in CV: $kW \times 1.35962$)
* `Ft`: Tipo di carburante (PETROL, DIESEL, ELECTRIC, HYBRID, LPG, E85)
* `M (kg)`: Massa del veicolo in ordine di marcia
* `Fw (l/100km)` o `Wh/km`: Consumo effettivo di carburante / energia in ciclo WLTP
* `Ew (g/km)`: Emissioni certificate di $CO_2$
* `Zr (km)`: Autonomia certificata in elettrico (per BEV e PHEV)

---

## 2. Tabelle ACI Costi Chilometrici e Fringe Benefit (Automobile Club d'Italia)
* **Ente**: ACI / Ministero dell'Economia e delle Finanze
* **Pubblicazione**: Annuale in Gazzetta Ufficiale e su aci.it / dati.aci.it
* **Licenza**: Pubblico dominio / Open Government Data
* **Link Portale**: https://www.aci.it/servizi-online/costi-chilometrici.html e https://www.dati.aci.it
* **Formati disponibili**: Excel (.xlsx), PDF Gazzetta Ufficiale

### Perché è la fonte d'oro per la svalutazione in Italia:
Le tabelle ACI calcolano per **ogni singolo modello venduto in Italia** il costo al chilometro basandosi su:
1. **Quota Ammortamento Capitale**: la svalutazione finanziaria reale dell'auto in base a un ciclo standard di percorrenza.
2. **Quota Carburante**: spesa media di rifornimento per 100 km.
3. **Quota Pneumatici**: usura gomme per km.
4. **Quota Manutenzione e Riparazione**: spesa stimata per tagliandi e imprevisti meccanici.
5. **Costi Fissi**: Assicurazione RCA e Tassa di Possesso (Bollo Auto regionale).

---

## 3. Dataset Kaggle & Hugging Face: Annunci Usato Reali (AutoScout24 & Subito.it)
* **Comunità**: Kaggle / Hugging Face Datasets
* **Frequenza**: Aggiornati periodicamente da data scientist e ricercatori universitari
* **Dataset consigliati**:
  - `AutoScout24 Car Sales Dataset` (46.000+ - 250.000+ veicoli)
  - `Italian Used Cars Market Dataset` (Subito / AutoScout24 Italia)
  - `Fiat 500 Used Cars Italy` (analisi prezzi puntuale geografica per regione)
* **Formato**: CSV, Parquet, JSON

### Campi per l'Addestramento ML:
* `make`: Marca normalizzata
* `model`: Modello
* `version`: Allestimento o motorizzazione
* `year`: Anno di prima immatricolazione
* `mileage`: Chilometraggio registrato
* `fuel`: Tipo di alimentazione
* `gearbox`: Manuale o Automatico
* `power_ps`: Cavalli vapore (CV)
* `price`: Prezzo richiesto dal venditore (target della regressione)
* `seller_type`: Privato vs Concessionario/Rivenditore

---

## 4. NHTSA vPIC REST API (Specifiche e Decodifica VIN Gratuita)
* **Ente**: US Department of Transportation / National Highway Traffic Safety Administration
* **Costo**: 100% Gratuito (nessuna registrazione né API Key richiesta)
* **Endpoint Base**: `https://vpic.nhtsa.dot.gov/api/`
* **Formato**: JSON

### Endpoint Utili:
* **Decodifica VIN**: `GET /vehicles/DecodeVinValues/{VIN}?format=json`
  Restituisce costruttore, modello, anno modello, tipo di carrozzeria, tipologia di carburante, trazione (AWD, FWD, RWD) e sistemi di assistenza (ABS, ESP, airbag).
* **Elenco Produttori**: `GET /vehicles/GetAllMakes?format=json`
* **Modelli per Marca**: `GET /vehicles/GetModelsForMake/{make}?format=json`

---

## 5. EU Safety Gate / RAPEX (Richiami Ufficiali di Sicurezza)
* **Ente**: Commissione Europea - Consumer Safety
* **Link Portale**: https://ec.europa.eu/safety-gate-alerts/
* **Formato**: Download XML / JSON / Portale Open Data UE

### Utilità per AutoEsperto:
* Permette di verificare i richiami del costruttore per marca, modello e anno di produzione.
* Alimenta l'**Health Score** e la checklist pre-acquisto evidenziando problemi noti (es. airbag difettosi, pompe carburante ad alta pressione, catene di distribuzione deboli).
