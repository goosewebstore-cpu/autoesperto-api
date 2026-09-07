import urllib.request
import urllib.parse
import json
import os
import time
from PIL import Image

ACQUISTO_QUERIES = {
    # 1. 10 segnali problema annuncio
    "auto-usata-10-segnali-problema-annuncio": ["mechanic inspecting car hood open garage", "car inspection mechanic checking engine", "car diagnostic inspection mechanic"],
    # 2. Scelta motorizzazione
    "diesel-benzina-ibrida-2026-quale-comprare-conviene": ["gas station fuel pump nozzle petrol diesel", "fuel dispenser petrol station nozzles", "filling station fuel pump"],
    # 3. Migliori 10.000 euro
    "migliori-auto-usate-10000-euro-2026": ["Renault Clio IV hatchback", "Volkswagen Polo Mk5 hatchback", "Ford Fiesta Mk7"],
    # 4. 5 cose da controllare
    "5-cose-da-controllare-prima-comprare-auto-usata": ["checking car engine oil dipstick", "mechanic checking car engine open hood", "car maintenance engine oil"],
    # 5. 100.000 km
    "auto-usata-100000-km-conviene-comprare": ["car speedometer odometer cluster modern", "car dashboard speedometer modern", "automobile instrument cluster odometer"],
    # 6. Auto incidentata
    "come-capire-se-auto-usata-incidentata": ["damaged car bumper collision crash", "car accident body damage dent", "car collision damage front"],
    # 7. Diesel euro 5 blocchi
    "diesel-euro-5-2026-posso-ancora-comprarlo-blocchi": ["common rail turbo diesel engine bay", "Volkswagen TDI diesel engine", "turbodiesel engine car"],
    # 8. Passaporto digitale veicolo
    "passaporto-digitale-veicolo-regolamento-ue-2026-1738": ["smartphone scanning QR code car", "digital vehicle dashboard tablet", "smartphone car app"],
    # 9. Sotto 3000 euro
    "auto-usate-sotto-3000-euro-guida": ["Fiat Punto 188 hatchback", "Peugeot 206 hatchback", "Renault Twingo I"],
    # 10. Sotto 5000 euro
    "auto-usate-sotto-5000-euro-scelta": ["Fiat Grande Punto hatchback", "Opel Corsa D hatchback", "Ford Fiesta 2008"],
    # 11. Sotto 15000 euro
    "auto-usate-sotto-15000-euro-migliori": ["Nissan Qashqai crossover", "Renault Captur crossover", "Peugeot 2008 SUV"],
    # 12. Sotto 20000 euro premium
    "auto-usate-sotto-20000-euro-premium": ["Audi A4 B9 sedan", "BMW 3 Series F30 sedan", "Mercedes-Benz C-Class W205"],
    # 13. Neopatentati usate
    "migliori-auto-neopatentati-usate-norme": ["Lancia Ypsilon 846", "Fiat Panda 319", "Hyundai i10 modern"],
    # 14. SUV usati economici
    "migliori-suv-usati-economici-scelta": ["Dacia Duster crossover", "Dacia Duster SUV modern", "Suzuki Vitara SUV"],
    # 15. Auto ibride usate
    "auto-ibride-usate-conviene-controlli": ["Toyota Yaris Cross Hybrid", "Toyota Auris Hybrid engine", "Toyota Prius Hybrid engine"],
    # 16. Diesel vs ibrida
    "diesel-vs-ibrida-usata-confronto": ["motorway highway traffic cars Europe", "highway traffic driving Europe", "freeway traffic cars"],
    # 17. Garanzia auto usata
    "garanzia-auto-usata-commerciale-legale": ["car dealership showroom sales desk", "signing contract desk keys", "dealership sales office"],
    # 18. Controlli pre-acquisto checklist
    "controlli-pre-acquisto-auto-usata-lista": ["car on hydraulic lift workshop mechanic", "mechanic inspecting underbody car lift", "car repair workshop lift"],
    # 19. Privato vs concessionario
    "comprare-auto-da-privato-vs-concessionario": ["used car dealership outdoor lot rows", "car dealership showroom outdoor lot", "car sales lot flags"],
    # 20. Aste auto usate
    "aste-auto-usate-come-funzionano-rischi": ["car auction lot rows vehicles", "automobile auction parking lot", "salvage car auction lot"],
    # 21. Importare auto Germania
    "importare-auto-usata-germania-costi": ["car carrier transporter truck trailer", "car hauler truck highway", "auto transporter truck"],
    # 22. GPL e Metano
    "auto-usate-gpl-metano-conviene": ["LPG autogas fuel dispenser nozzle", "Autogas tankstelle dispenser", "CNG fuel station nozzle"],
    # 23. Elettrica batteria SOH
    "auto-elettrica-usata-autonomia-batteria": ["electric car charging cable plug plugged", "EV charging station cable car", "electric vehicle charging port"],
    # 24. Chilometri scalati
    "chilometri-scalati-auto-usata-truffa": ["OBD2 scanner car diagnostic tool", "OBD-II vehicle diagnostic port", "automotive diagnostic scan tool"],
    # 25. Fermo amministrativo
    "acquisto-auto-con-fermo-amministrativo": ["official stamp legal document paper", "notary rubber stamp document", "legal document certificate stamp"],
    # 26. Auto aziendale ex noleggio
    "auto-usata-aziendale-ex-noleggio": ["fleet cars white parking lot rows", "company fleet cars parked row", "rental car parking lot"],
    # 27. Caparra confirmatoria
    "caparra-acquisto-auto-usata-regole": ["signing agreement contract pen paper desk", "hand signing document contract table", "business contract signature"],
    # 28. Auto per famiglia monovolume
    "auto-usata-per-famiglia-monovolume": ["Renault Scenic monovolume", "Volkswagen Touran minivan", "Ford C-Max family car"],
    # 29. Auto sportiva economica
    "auto-usata-sportiva-economica": ["Mazda MX-5 Miata roadster convertible", "Alfa Romeo Giulietta hatchback", "Abarth 500 sports car"],
    # 30. Passaggio di proprietà
    "passaggio-proprieta-auto-usata-costi": ["car keys on vehicle registration document", "car keys on table document", "vehicle document registration keys"],
    # 31. Finanziamento auto usata
    "finanziamento-auto-usata-conviene": ["calculator financial loan document euro", "calculator finance contract pen", "bank loan calculation desk"],
    # 32. Cambio automatico
    "auto-usate-con-cambio-automatico": ["automatic gear shift lever selector modern", "automatic transmission gear selector car", "DSG gear lever console"],
    # 33. Auto GPL neopatentati
    "auto-usata-per-neopatentati-gpl": ["Fiat 500 modern street", "Opel Corsa modern hatchback", "Ford Fiesta modern"],
    # 34. 4x4 fuoristrada economici
    "auto-usate-4x4-fuoristrada-economici": ["Jeep Renegade Trailhawk 4x4 offroad", "Fiat Panda 4x4 offroad", "Suzuki Jimny 4x4 offroad"],
    # 35. Gancio traino
    "auto-usata-con-gancio-traino": ["car towing camping trailer caravan", "car towing boat trailer highway", "vehicle with tow bar trailer"],
    # 36. Citycar
    "auto-usata-per-citta-citycar": ["Smart Fortwo city street urban", "Fiat 500 city parking Rome", "Toyota Aygo city street"],
    # 37. Bassi consumi
    "auto-usate-con-bassi-consumi": ["Toyota Prius hybrid car modern", "hybrid car instrument cluster eco", "eco driving fuel consumption"],
    # 38. Auto per cani
    "auto-usata-per-cani-e-animali": ["dog in car boot estate", "dog in car trunk looking out", "golden retriever dog in car"],
    # 39. Garanzia 12 mesi
    "auto-usata-garanzia-12-mesi-copertura": ["car service handbook warranty booklet keys", "car owner manual handbook desk", "service record book car keys"],
    # 40. Siti annunci sicurezza
    "auto-usata-sito-annunci-sicurezza": ["person browsing marketplace laptop screen", "laptop computer screen online shopping", "laptop desk browsing car"],
    # 41. Chilometri illimitati
    "auto-usata-chilometri-illimitati": ["Mercedes-Benz W124 sedan", "Volvo 240 estate wagon", "high mileage Mercedes sedan"],
    # 42. Auto per agenti di commercio
    "auto-usata-per-lavoro-agenti": ["Volkswagen Passat Variant highway", "Audi A4 Avant motorway driving", "BMW 3 Series Touring highway"],
    # 43. Acquisto online consegna
    "auto-usata-acquisto-online-consegna": ["flatbed tow truck carrying car delivery", "car carrier truck delivering car", "car transport delivery truck"]
}

VENDITA_QUERIES = {
    # 1. Fissare prezzo vendita
    "come-fissare-prezzo-vendita-auto": ["person using smartphone checking car price", "car valuation appraisal mobile phone", "clipboard valuation checking car"],
    # 2. Annuncio perfetto
    "annuncio-auto-usata-perfetto-guida": ["person taking photo of car with smartphone", "photographing car with phone outdoor", "smartphone camera photo car"],
    # 3. Foto auto usata
    "foto-auto-usata-da-caricare-guida": ["photographer taking photo of car camera", "photographing automobile outdoor camera", "taking photos of car detail"],
    # 4. Permuta auto usata
    "permuta-auto-usata-conviene-calcolo": ["car dealership showroom desk sales negotiation", "dealership salesman handing keys desk", "car trade in dealership desk"],
    # 5. Pagamento sicuro
    "pagamento-sicuro-vendita-auto-usata": ["smartphone mobile banking transfer app screen", "instant bank transfer phone screen", "cashier cheque bank document"],
    # 6. Atto di vendita autentica
    "atto-di-vendita-auto-usata-autentica": ["signing legal document notary municipal desk", "official signature document rubber stamp", "signing bill of sale notary"],
    # 7. Vendere con finanziamento
    "vendere-auto-usata-con-finanziamento-in-corso": ["financial loan agreement document calculator pen", "bank loan paperwork calculator table", "loan settlement document pen"],
    # 8. Senza revisione
    "vendere-auto-usata-senza-revisione": ["car periodic technical inspection brake test", "vehicle inspection station test rollers", "car brake tester inspection"],
    # 9. Danni carrozzeria
    "vendere-auto-usata-con-danni-carrozzeria": ["car scratch polishing machine buffer", "car body repair buffer polisher", "polishing car paint scratch"],
    # 10. Esportazione estero
    "vendere-auto-per-esportazione-estero": ["car transporter truck crossing border", "car carrier truck international highway", "car export transit trailer"],
    # 11. Compro auto
    "vendere-auto-usata-a-compro-auto": ["car appraisal inspector checking vehicle paint", "automotive inspector tablet checking car", "vehicle evaluation inspector checking body"],
    # 12. Valore residuo fattori
    "valore-residuo-auto-usata-fattori": ["car depreciation graph valuation chart", "modern shiny car valuation concept", "clean modern car showroom value"],
    # 13. Storico tagliandi
    "vendere-auto-usata-storico-tagliandi": ["car maintenance service booklet stamped", "stamped service book car manual", "vehicle service record stamped"],
    # 14. Vendita tra parenti
    "vendere-auto-usata-tra-parenti": ["handing car keys person to person", "car keys handover hand to hand", "passing car keys to family"],
    # 15. Doppia chiave e manuali
    "vendere-auto-usata-con-doppia-chiave": ["two modern car key fobs remote", "car keys remote control pair", "car keys and owner manual book"],
    # 16. Garanzia tra privati
    "vendere-auto-usata-garanzia-tra-privati": ["private contract agreement signing pen", "hand signing written contract table", "sale agreement contract document"],
    # 17. Conto vendita
    "vendere-auto-usata-in-conto-vendita": ["car dealership showroom floor display", "cars parked inside dealership showroom", "automobile dealer showroom interior"],
    # 18. Detailing ed igienizzazione
    "preparare-auto-usata-alla-vendita": ["car wash active foam snow detailing", "car detailing wash foam cannon", "car detailing interior cleaning"],
    # 19. Asta online
    "vendere-auto-usata-all-asta-online": ["online car auction laptop bidding screen", "person using laptop online bidding screen", "laptop screen car auction website"],
    # 20. Fermo fiscale
    "vendere-auto-usata-con-fermo-fiscale": ["official tax release certificate stamp Italy", "tax revenue agency document clearance stamp", "official legal tax stamp document"],
    # 21. Estero senza IVA
    "vendere-auto-usata-all-estero-senza-iva": ["customs border control cargo clearance", "international freight customs documents", "border customs inspection truck"],
    # 22. Trattativa prezzo
    "trattativa-prezzo-vendita-auto-usata": ["two people shaking hands beside car", "buyer seller handshake car negotiation", "handshake agreement outdoor car"],
    # 23. Incidentata o fusa
    "vendere-auto-usata-incidentata-o-fusa": ["damaged car being loaded on tow truck", "crashed car tow truck recovery", "salvage wrecked car on flatbed"],
    # 24. Societa o partita IVA
    "vendere-auto-usata-di-societa-o-partita-iva": ["business office laptop electronic invoice desk", "corporate office desk car keys contract", "business tax invoice paperwork pen"],
    # 25. Bollo scaduto
    "vendere-auto-usata-con-bollo-scaduto": ["Italian bollo auto tax payment receipt", "tax payment receipt document Italy", "official tax payment stamp receipt"],
    # 26. Elettrica SOH batteria
    "vendere-auto-usata-elettrica-batteria": ["electric car dashboard battery 100 percent", "EV instrument cluster battery display", "electric vehicle battery dashboard screen"],
    # 27. Impianto GPL
    "vendere-auto-usata-con-impianto-gpl": ["toroidal LPG tank in car spare wheel well", "LPG autogas tank in car trunk", "LPG gas converter engine car"],
    # 28. Test drive in sicurezza
    "vendere-auto-usata-in-sicurezza-test-drive": ["driver and passenger sitting inside car driving", "two people inside modern car cockpit", "test drive car cockpit passenger"],
    # 29. Auto d epoca ASI
    "vendere-auto-usata-d-epoca-valutazione": ["classic Alfa Romeo Spider vintage car", "vintage Fiat 500 classic car Italian", "classic Lancia vintage car"],
    # 30. Verbale di consegna
    "consegna-auto-usata-verbale-passaggio": ["person holding clipboard checking car handover", "handover checklist clipboard car inspection", "delivery vehicle handover keys clipboard"]
}

print(f"Total Acquisto targets: {len(ACQUISTO_QUERIES)}")
print(f"Total Vendita targets : {len(VENDITA_QUERIES)}")
