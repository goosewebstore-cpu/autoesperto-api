import type { AlternativeVehicle, AutoReport, PriceAnalysis, ReliabilityAnalysis } from '@autoesperto/types';
import { estimateReliability } from './affidabilita';
import { estimateConsumption } from './consumi';
import { detectSegment, type SegmentKey } from './riparazione';
import { getAllMakes } from './catalogo';

/**
 * Stima locale e deterministica di un report. Serve a garantire che ogni pagina
 * modello abbia contenuto prezzo + affidabilità renderizzato lato server anche
 * quando l'API (annunci reali) non è raggiungibile o per i modelli fuori dal
 * catalogo dei modelli popolari. Quando possibile, l'API resta la fonte migliore:
 * questi valori sono solo il fallback "Stima indicativa di mercato".
 */

const MODEL_PRICE: Record<string, number> = {
  'fiat panda': 16500, 'fiat 500': 19500, 'fiat 500x': 25500, 'fiat 500l': 24500,
  'fiat tipo': 21000, 'fiat punto': 17500, 'fiat 600': 23000, 'fiat bravo': 22500,
  'fiat doblo': 25000, 'fiat freemont': 32000, 'fiat ducato': 35000, 'fiat sedici': 24000,
  'fiat multipla': 18000, 'fiat 124': 30000, 'fiat panda 4x4': 19000,
  'lancia ypsilon': 19000, 'lancia delta': 24000, 'lancia thema': 30000, 'lancia voyager': 40000,
  'alfa romeo giulietta': 26000, 'alfa romeo giulia': 55000, 'alfa romeo stelvio': 62000,
  'alfa romeo tonale': 42000, 'alfa romeo mito': 17500, 'alfa romeo 147': 22000,
  'alfa romeo 159': 26000, 'alfa romeo 4c': 60000, 'alfa romeo giulietta veloce': 34000,
  'volkswagen golf': 33000, 'volkswagen polo': 22500, 'volkswagen t-roc': 36000,
  'volkswagen tiguan': 45000, 'volkswagen passat': 48000, 'volkswagen touran': 40000,
  'volkswagen up': 16500, 'volkswagen arteon': 55000, 'volkswagen taigo': 28000,
  'volkswagen id.3': 41000, 'volkswagen id.4': 46000, 'volkswagen id.5': 52000,
  'volkswagen scirocco': 36000, 'volkswagen jetta': 31000, 'volkswagen beetle': 28000,
  'volkswagen touareg': 75000, 'volkswagen sharan': 43000, 'volkswagen t-cross': 27000,
  'volkswagen golf sportsvan': 30000, 'volkswagen e-golf': 36000, 'volkswagen california': 65000,
  'audi a1': 27000, 'audi a3': 38000, 'audi a4': 50000, 'audi a5': 56000, 'audi a6': 63000,
  'audi a7': 75000, 'audi a8': 95000, 'audi q2': 32500, 'audi q3': 43000, 'audi q5': 58000,
  'audi q7': 76000, 'audi q8': 92000, 'audi tt': 55000, 'audi e-tron': 76000, 'audi a2': 25000,
  'bmw serie 1': 38000, 'bmw serie 2': 45000, 'bmw serie 3': 53000, 'bmw serie 4': 58000,
  'bmw serie 5': 68000, 'bmw serie 6': 76000, 'bmw serie 7': 105000, 'bmw serie 8': 115000,
  'bmw x1': 45000, 'bmw x2': 46000, 'bmw x3': 59000, 'bmw x4': 66000, 'bmw x5': 86000,
  'bmw x6': 96000, 'bmw x7': 115000, 'bmw z4': 62000, 'bmw i3': 40000, 'bmw i4': 60000,
  'bmw i5': 75000, 'bmw ix': 85000, 'bmw mini': 28000,
  'mercedes classe a': 39000, 'mercedes classe b': 40000, 'mercedes classe c': 57000,
  'mercedes classe e': 68000, 'mercedes classe s': 115000, 'mercedes gla': 45000,
  'mercedes glb': 48000, 'mercedes glc': 63000, 'mercedes gle': 86000, 'mercedes gls': 105000,
  'mercedes cls': 90000, 'mercedes slk': 55000, 'mercedes slc': 55000, 'mercedes classe v': 65000,
  'mercedes eqa': 48000, 'mercedes eqb': 52000, 'mercedes eqc': 61000, 'mercedes amg gt': 110000,
  'mercedes classe t': 36000, 'mercedes sprinter': 50000, 'mercedes g': 130000, 'mercedes g wagen': 130000,
  'ford fiesta': 19000, 'ford focus': 29000, 'ford puma': 33500, 'ford kuga': 32000,
  'ford mondeo': 45000, 'ford cmax': 30000, 'ford galaxy': 43000, 'ford ka': 15500,
  'ford ecosport': 23500, 'ford edge': 50000, 'ford mustang': 56000, 'ford s-max': 40000,
  'ford ranger': 43000, 'ford tourneo': 40000, 'ford transit': 40000, 'ford capri': 42000,
  'ford explorer': 70000, 'ford escort': 20000, 'ford fiesta st': 30000, 'ford focus rs': 45000,
  'opel corsa': 19000, 'opel astra': 29500, 'opel mokka': 29000, 'opel grandland': 38000,
  'opel insignia': 40000, 'opel adam': 16500, 'opel crossland': 27000, 'opel zafira': 34000,
  'opel meriva': 22000, 'opel corsa-e': 35000, 'opel vectra': 30000, 'opel combo': 28000,
  'opel vivaro': 35000, 'opel antara': 30000, 'opel frontera': 24000,
  'lti tx4': 38000, 'lti tx2': 34000, 'lti tx1': 30000, 'london taxis international tx4': 38000,
  'peugeot 208': 22000, 'peugeot 308': 30000, 'peugeot 2008': 30000, 'peugeot 3008': 40500,
  'peugeot 5008': 45000, 'peugeot 508': 46000, 'peugeot 108': 16000, 'peugeot 206': 17500,
  'peugeot 207': 18500, 'peugeot 301': 19000, 'peugeot 407': 35000, 'peugeot 607': 40000,
  'peugeot rcz': 40000, 'peugeot e-208': 36000, 'peugeot e-2008': 40000, 'peugeot expert': 35000,
  'peugeot 1007': 15000, 'peugeot 405': 15000, 'peugeot 406': 25000, 'peugeot 307': 21000,
  'peugeot 308 sw': 32000, 'peugeot 408': 38000,
  'citroen c3': 19500, 'citroen c4': 28000, 'citroen c5': 38000, 'citroen c3 aircross': 26000,
  'citroen c4 cactus': 24000, 'citroen c5 aircross': 37000, 'citroen c1': 15500, 'citroen c2': 17500,
  'citroen grand c4 space tourer': 35000, 'citroen c4 picasso': 33000, 'citroen jumpy': 32000,
  'citroen berlingo': 27000, 'citroen ds3': 21000, 'citroen ds4': 30000, 'citroen ds5': 36000,
  'citroen c4x': 32000, 'citroen c3 picasso': 20000, 'citroen c6': 38000, 'citroen c8': 35000,
  'renault clio': 19000, 'renault captur': 28500, 'renault megane': 30000, 'renault scenic': 38000,
  'renault kadjar': 36000, 'renault twingo': 16500, 'renault zoe': 30000, 'renault arkana': 33000,
  'renault austral': 37000, 'renault espace': 45000, 'renault koleos': 40000, 'renault modus': 17000,
  'renault talisman': 43000, 'renault clio rs': 30000, 'renault megane rs': 42000, 'renault laguna': 33000,
  'renault scenic 4': 30000, 'renault twizy': 9000, 'renault 5': 33000, 'renault trafic': 35000,
  'renault kangoo': 24000, 'renault master': 35000, 'renault symbioz': 33000, 'renault rafale': 45000,
  'dacia sandero': 14500, 'dacia duster': 21500, 'dacia logan': 15000, 'dacia jogger': 19000,
  'dacia spring': 19000, 'dacia dokker': 17000, 'dacia lodgy': 19000, 'dacia sandero stepway': 15500,
  'toyota yaris': 23500, 'toyota corolla': 34500, 'toyota chr': 37000, 'toyota rav4': 49000,
  'toyota aygo': 16000, 'toyota camry': 50000, 'toyota avensis': 38000, 'toyota auris': 28000,
  'toyota hilux': 45000, 'toyota gt86': 33000, 'toyota proace': 38000, 'toyota yaris cross': 31000,
  'toyota land cruiser': 65000, 'toyota prius': 38000, 'toyota c-hr': 37000, 'toyota urban cruiser': 18000,
  'toyota iq': 14000, 'toyota aygo x': 17000, 'toyota bz4x': 47000, 'toyota corolla cross': 42000,
  'toyota highlander': 60000, 'toyota rav4 hybrid': 50000,
  'nissan qashqai': 37500, 'nissan juke': 28500, 'nissan micra': 18500, 'nissan leaf': 33000,
  'nissan x-trail': 43000, 'nissan pulsar': 22000, 'nissan note': 19000, 'nissan patrol': 85000,
  'nissan gtr': 120000, 'nissan 370z': 50000, 'nissan townstar': 25000, 'nissan qashqai+2': 30000,
  'nissan juke nismo': 30000, 'nissan qashqai e-power': 40000, 'nissan ariya': 48000, 'nissan almera': 22000,
  'nissan primastar': 30000, 'nissan murano': 55000, 'nissan navara': 42000,
  'kia rio': 19500, 'kia ceed': 27500, 'kia sportage': 39000, 'kia picanto': 16500, 'kia stonic': 23500,
  'kia niro': 35000, 'kia stinger': 55000, 'kia soul': 26000, 'kia ev6': 51000, 'kia pro_ceed': 30000,
  'kia sorento': 50000, 'kia carnival': 40000, 'kia xceed': 32000, 'kia ev9': 75000, 'kia venga': 20000,
  'kia ceed sw': 29000, 'kia optima': 42000, 'kia sportage gt': 45000, 'kia niro ev': 40000,
  'hyundai i10': 16500, 'hyundai i20': 18500, 'hyundai i30': 28000, 'hyundai tucson': 41000,
  'hyundai kona': 34500, 'hyundai bayon': 25000, 'hyundai santa fe': 52000, 'hyundai ix20': 22000,
  'hyundai veloster': 30000, 'hyundai ioniq': 40000, 'hyundai i40': 33000, 'hyundai getz': 14500,
  'hyundai i30 fastback': 30000, 'hyundai ioniq 5': 50000, 'hyundai ioniq 6': 52000, 'hyundai i20 n': 28000,
  'hyundai i30 n': 38000, 'hyundai matrix': 18000, 'hyundai terracan': 30000, 'hyundai ix35': 28000,
  'hyundai kona electric': 40000,
  'seat ibiza': 19500, 'seat leon': 30500, 'seat arona': 26500, 'seat ateca': 37500, 'seat toledo': 22000,
  'seat alhambra': 38000, 'seat mi': 15000, 'seat tarraco': 40000, 'seat cordoba': 18000,
  'seat leon cupra': 38000, 'seat altea': 24000, 'seat ibiza st': 22000, 'seat leon st': 32000,
  'seat cupra': 38000, 'seat terraco': 40000, 'seat malaga': 15000,
  'skoda fabia': 20000, 'skoda octavia': 34500, 'skoda kamiq': 29500, 'skoda karoq': 37500,
  'skoda kodiaq': 45000, 'skoda superb': 45000, 'skoda scala': 26000, 'skoda citigo': 16000,
  'skoda yeti': 30000, 'skoda rapid': 22000, 'skoda enyaq': 46000, 'skoda octavia scout': 38000,
  'skoda superb combi': 48000, 'skoda felicia': 15000, 'skoda roomster': 22000, 'skoda fabia rs': 25000,
  'skoda elroq': 40000,
  'mazda 2': 19500, 'mazda 3': 31500, 'mazda 6': 38000, 'mazda cx-3': 27000, 'mazda cx-5': 40000,
  'mazda cx-30': 32000, 'mazda mx-5': 35000, 'mazda cx-7': 35000, 'mazda cx-9': 55000, 'mazda bt-50': 40000,
  'mazda cx-60': 52000, 'mazda cx-80': 60000, 'mazda mx-30': 38000, 'mazda 323': 15000, 'mazda 626': 22000,
  'suzuki swift': 18000, 'suzuki vitara': 28000, 'suzuki jimny': 28500, 'suzuki ignis': 18500,
  'suzuki sx4': 25000, 'suzuki baleno': 18000, 'suzuki celerio': 15500, 'suzuki across': 45000,
  'suzuki grand vitara': 30000, 'suzuki swift sport': 24000, 'suzuki alto': 14000, 'suzuki liana': 18000,
  'suzuki samurai': 15000, 'suzuki swace': 32000,
  'honda jazz': 23000, 'honda civic': 34500, 'honda crv': 48000, 'honda hr-v': 32000, 'honda accord': 45000,
  'honda city': 22000, 'honda insight': 35000, 'honda crz': 28000, 'honda nsx': 150000, 'honda e': 35000,
  'honda civic type r': 50000, 'honda jazz crosstar': 26000, 'honda crv hybrid': 52000, 'honda prelude': 40000,
  'honda integra': 35000, 'honda legend': 60000, 'honda s2000': 40000,
  'mini cooper': 28500, 'mini clubman': 35000, 'mini countryman': 38000, 'mini paceman': 33000,
  'mini cabrio': 30000, 'mini john cooper': 33000, 'mini one': 24000, 'mini aceman': 40000,
  'mini cooper s': 33000, 'mini countryman plug-in': 45000,
  'volvo xc40': 46000, 'volvo xc60': 59000, 'volvo xc90': 80000, 'volvo s60': 55000, 'volvo s90': 65000,
  'volvo v40': 35000, 'volvo v60': 50000, 'volvo v90': 60000, 'volvo c30': 28000, 'volvo c40': 50000,
  'volvo ex30': 42000, 'volvo s40': 32000, 'volvo s80': 55000, 'volvo v50': 33000, 'volvo v70': 45000,
  'volvo xc70': 52000,
  'land rover evoque': 48000, 'land rover discovery sport': 52000, 'land rover freelander': 38000,
  'land rover discovery': 75000, 'land rover range rover': 120000, 'land rover range rover sport': 110000,
  'land rover defender': 80000, 'land rover velar': 75000, 'land rover range rover evoque': 48000,
  'jaguar xe': 50000, 'jaguar xf': 60000, 'jaguar xj': 80000, 'jaguar f-pace': 60000, 'jaguar e-pace': 48000,
  'jaguar f-type': 80000, 'jaguar xk': 90000, 'jaguar i-pace': 70000, 'jaguar x-type': 30000,
  'tesla model 3': 45000, 'tesla model y': 48000, 'tesla model s': 95000, 'tesla model x': 110000,
  'jeep renegade': 27000, 'jeep compass': 41000, 'jeep cherokee': 45000, 'jeep wrangler': 60000,
  'jeep grand cherokee': 75000, 'jeep avenger': 31000, 'jeep renegade 4xe': 40000, 'jeep patriot': 22000,
  'jeep compass 4xe': 45000, 'jeep grand cherokee l': 90000, 'jeep gladiator': 70000,
  'lexus ct': 30000, 'lexus is': 45000, 'lexus es': 55000, 'lexus nx': 50000, 'lexus rx': 65000,
  'lexus ux': 42000, 'lexus lc': 95000, 'lexus ls': 100000, 'lexus gs': 60000, 'lexus nx 450h': 55000,
  'porsche 911': 120000, 'porsche cayenne': 90000, 'porsche macan': 80000, 'porsche panamera': 100000,
  'porsche taycan': 90000, 'porsche boxster': 70000, 'porsche cayman': 75000, 'porsche 718': 75000,
  'porsche 911 turbo': 200000, 'porsche 911 carrera': 130000,
  'smart fortwo': 25000, 'smart forfour': 27000, 'smart fortwo cabrio': 28000, 'smart #1': 42000,
  'smart #3': 45000, 'smart roadster': 25000,
  'subaru impreza': 35000, 'subaru outback': 45000, 'subaru forester': 40000, 'subaru xv': 32000,
  'subaru brz': 38000, 'subaru legacy': 45000, 'subaru levorg': 45000, 'subaru tribeca': 45000,
  'subaru justy': 16000, 'subaru svx': 30000,
  'mitsubishi space star': 18000, 'mitsubishi asx': 26000, 'mitsubishi outlander': 38000,
  'mitsubishi colt': 20000, 'mitsubishi eclipse cross': 32000, 'mitsubishi l200': 40000,
  'mitsubishi pajero': 60000, 'mitsubishi lancer': 25000, 'mitsubishi i-miev': 30000, 'mitsubishi carisma': 20000,
  'maserati ghibli': 80000, 'maserati levante': 95000, 'maserati quattroporte': 110000, 'maserati grancabrio': 120000,
  'maserati granturismo': 130000, 'maserati grecale': 85000, 'maserati mc20': 200000,
  'ferrari 488': 220000, 'ferrari 812': 340000, 'ferrari portofino': 200000, 'ferrari roma': 220000,
  'ferrari f8': 240000, 'ferrari 458': 220000, 'ferrari california': 200000, 'ferrari 430': 160000,
  'lamborghini huracan': 220000, 'lamborghini gallardo': 180000, 'lamborghini urus': 230000,
  'lamborghini aventador': 350000, 'lamborghini murcielago': 250000,
  'bentley continental': 200000, 'bentley bentayga': 210000, 'bentley flying spur': 220000,
  'rolls royce phantom': 400000, 'rolls royce ghost': 350000, 'rolls royce cullinan': 380000,
  'mclaren 570s': 170000, 'mclaren 570gt': 180000, 'mclaren 600lt': 210000, 'mclaren 600lt spider': 235000,
  'mclaren 650s': 230000, 'mclaren 650s spider': 245000, 'mclaren 675lt': 280000, 'mclaren 675lt spider': 300000,
  'mclaren 750s': 330000, 'mclaren 750s spider': 350000, 'mclaren 765lt': 330000, 'mclaren 765lt spider': 360000,
  'mclaren artura': 230000, 'mclaren artura spider': 250000, 'mclaren elva': 1500000, 'mclaren gt': 220000,
  'mclaren gts': 230000, 'mclaren mp4-12c': 200000, 'mclaren mp4-12c spider': 215000, 'mclaren p1': 1100000,
  'mclaren senna': 800000, 'mclaren speedtail': 1800000,
  'pagani huayra': 2300000, 'pagani huayra bc': 2700000, 'pagani huayra r': 2900000, 'pagani utopia': 2500000,
  'pagani zonda': 1200000, 'pagani zonda cinque': 1500000, 'pagani zonda f': 1100000, 'pagani zonda r': 1800000,
  'bugatti chiron': 2500000, 'bugatti chiron pur sport': 3000000, 'bugatti chiron super sport': 3500000,
  'bugatti chiron super sport 300+': 3800000, 'bugatti divo': 5000000, 'bugatti centodieci': 8000000,
  'bugatti la voiture noire': 11000000, 'bugatti mistral': 5000000, 'bugatti tourbillon': 3800000,
  'bugatti bolide': 4000000, 'bugatti eb 110': 800000, 'bugatti eb 110 gt': 850000, 'bugatti eb 110 ss': 1000000,
  'bugatti veyron 16.4': 1500000, 'bugatti veyron 16.4 grand sport': 1700000, 'bugatti veyron 16.4 super sport': 2000000,
  'bugatti veyron grand sport vitesse': 2100000, 'bugatti 16c galibier': 1000000, 'bugatti type 41 royale': 10000000,
  'bugatti type 57': 3500000, 'bugatti type 57 atlantic': 40000000, 'bugatti type 57sc atlantic': 45000000,
  'bugatti type 57c': 4000000, 'bugatti type 57s': 6000000, 'bugatti type 59': 9000000,
  'bugatti type 13': 400000, 'bugatti type 17': 400000, 'bugatti type 18': 500000, 'bugatti type 22': 500000,
  'bugatti type 23': 600000, 'bugatti type 30': 800000, 'bugatti type 32': 700000, 'bugatti type 35': 1200000,
  'bugatti type 37': 1000000, 'bugatti type 43': 1500000, 'bugatti type 44': 1200000, 'bugatti type 46': 1500000,
  'bugatti type 49': 1600000, 'bugatti type 50': 2500000, 'bugatti type 51': 3000000, 'bugatti type 52': 200000,
  'bugatti type 53': 4000000, 'bugatti type 54': 5000000, 'bugatti type 55': 3500000, 'bugatti type 56': 1500000,
  'bugatti type 101': 2500000, 'bugatti type 101 antem': 2600000, 'bugatti type 251': 3000000,
  'bugatti eb 112': 1000000, 'bugatti eb 118': 1200000, 'bugatti eb 218': 1300000, 'bugatti vision gran turismo': 5000000,
  'koenigsegg agera': 1400000, 'koenigsegg agera r': 1600000, 'koenigsegg agera rs': 2000000,
  'koenigsegg cc850': 3000000, 'koenigsegg cc8s': 900000, 'koenigsegg ccr': 700000, 'koenigsegg ccx': 750000,
  'koenigsegg ccxr': 900000, 'koenigsegg gemera': 1700000, 'koenigsegg jesko': 2800000, 'koenigsegg one 1': 2400000,
  'koenigsegg regera': 1800000,
  'ferrari 296 gtb': 260000, 'ferrari 296 gts': 280000, 'ferrari sf90 stradale': 400000, 'ferrari sf90 spider': 450000,
  'ferrari purosangue': 390000, 'ferrari 488 pista': 280000, 'ferrari 488 pista spider': 310000,
  'ferrari 458 speciale': 250000, 'ferrari 458 spider': 240000, 'ferrari 458 italia': 220000,
  'ferrari 360 modena': 180000, 'ferrari 360 spider': 190000, 'ferrari f430': 180000, 'ferrari 430 scuderia': 220000,
  'ferrari 599 gtb fiorano': 280000, 'ferrari 599 gto': 450000, 'ferrari 612 scaglietti': 250000,
  'ferrari 575m maranello': 220000, 'ferrari 550 maranello': 200000, 'ferrari 512 tr': 180000,
  'ferrari 512 bb': 250000, 'ferrari testarossa': 200000, 'ferrari f512 m': 250000, 'ferrari f12 berlinetta': 290000,
  'ferrari gtc4lusso': 260000, 'ferrari ff': 250000, 'ferrari monza sp1': 1700000, 'ferrari monza sp2': 1700000,
  'ferrari 288 gto': 2500000, 'ferrari 250 gto': 40000000, 'ferrari 250 gt california': 12000000,
  'ferrari 250 gte': 800000, 'ferrari 250 europa': 900000, 'ferrari 275 gtb': 1500000, 'ferrari 330 gt': 900000,
  'ferrari 365 gtb 4': 1500000, 'ferrari 365 gtc': 1200000, 'ferrari 365 gts': 2000000, 'ferrari 208 gtb': 150000,
  'ferrari 208 gts': 160000, 'ferrari 208 turbo': 120000, 'ferrari 308 gtb': 150000, 'ferrari 308 gts': 160000,
  'ferrari 348': 150000, 'ferrari mondial': 100000, 'ferrari dino 206 gt': 1800000, 'ferrari dino 246 gt': 1500000,
  'ferrari 456 gt': 200000, 'ferrari 125 s': 3000000, 'ferrari 166 inter': 1000000, 'ferrari 195 inter': 1200000,
  'ferrari 212 inter': 1300000, 'ferrari 250 gt': 600000, 'ferrari 365 gtb 4 daytona': 1500000,
  'lamborghini 350 gt': 800000, 'lamborghini 400 gt': 900000,
  'lamborghini countach': 1200000, 'lamborghini diablo': 300000, 'lamborghini espada': 300000,
  'lamborghini hurac a n': 220000,
  'lamborghini islero': 400000, 'lamborghini jalpa': 250000, 'lamborghini jarama': 350000,
  'lamborghini miura': 2000000, 'lamborghini murci lago': 250000,
  'lamborghini revuelto': 450000, 'lamborghini silhouette': 400000, 'lamborghini urraco': 250000,
  'aston martin db11': 190000, 'aston martin db12': 220000, 'aston martin dbx': 180000, 'aston martin vantage': 150000,
  'aston martin v12 vantage': 180000, 'aston martin v8 vantage': 150000, 'aston martin vanquish': 200000,
  'aston martin vanquish zagato': 300000, 'aston martin dbs': 200000, 'aston martin dbs superleggera': 250000,
  'aston martin dbs volante': 220000, 'aston martin rapide': 160000, 'aston martin rapide s': 170000,
  'aston martin one-77': 1200000, 'aston martin valkyrie': 2500000, 'aston martin valhalla': 800000,
  'aston martin vulcan': 2300000, 'aston martin virage': 250000, 'aston martin lagonda': 250000,
  'aston martin lagonda taraf': 1000000, 'aston martin cygnet': 30000, 'aston martin db4': 800000,
  'aston martin db5': 1200000, 'aston martin db6': 900000, 'aston martin db2 4': 600000, 'aston martin db2': 500000,
  'aston martin db1': 800000, 'aston martin db3': 1000000, 'aston martin db3s': 1200000, 'aston martin db7': 140000,
  'aston martin db7 vantage': 160000, 'aston martin db7 zagato': 200000, 'aston martin db9': 170000,
  'aston martin db9 volante': 180000, 'aston martin bulldog': 2000000, 'aston martin victor': 1500000,
  'aston martin ar1': 100000,
  'lotus elise': 52000, 'lotus exige': 75000, 'lotus evora': 100000, 'lotus emira': 95000, 'lotus eletre': 105000,
  'lotus esprit': 70000, 'lotus elan': 55000, 'lotus europa': 55000, 'lotus seven': 45000, 'lotus cortina': 60000,
  'lotus elite': 60000, 'lotus type 14': 60000, 'lotus type 23': 80000, 'lotus type 25': 80000,
  'lotus type 49': 90000, 'lotus type 72': 1000000, 'lotus type 79': 1200000, 'lotus type 97t': 800000,
  'lotus type 99t': 700000,
  'rolls royce dawn': 300000, 'rolls royce wraith': 300000, 'rolls royce spectre': 420000,
  'rolls royce silver shadow': 80000, 'rolls royce silver spirit': 70000, 'rolls royce silver spur': 80000,
  'rolls royce silver seraph': 90000, 'rolls royce silver cloud': 150000, 'rolls royce silver dawn': 100000,
  'rolls royce silver ghost': 400000, 'rolls royce park ward': 250000, 'rolls royce camargue': 200000,
  'rolls royce corniche': 150000, 'rolls royce 20 25': 150000,
  'bentley continental gt': 220000, 'bentley continental gtc': 230000, 'bentley continental flying spur': 210000,
  'bentley continental supersports': 260000, 'bentley continental r': 250000, 'bentley continental t': 200000,
  'bentley continental s': 180000, 'bentley mulsanne': 300000, 'bentley arnage': 180000, 'bentley azure': 200000,
  'bentley brooklands': 250000, 'bentley turbo r': 150000, 'bentley eight': 120000, 'bentley t-series': 250000,
  'bentley mark vi': 300000, 'bentley r type': 400000, 'bentley s1': 400000, 'bentley s2': 450000, 'bentley s3': 500000,
  'bentley 3 litre': 250000, 'bentley 4 litre': 300000, 'bentley 6 litre': 350000, 'bentley 8 litre': 2500000,
  'bentley speed six': 3000000, 'bentley state limousine': 250000, 'bentley blower bentley': 5000000,
  'bentley bacalar': 1500000, 'bentley exp 10 speed 6': 1000000, 'bentley exp 100 gt': 2000000,
  'tesla cybertruck': 90000, 'tesla roadster': 200000, 'tesla semi': 150000,
  'noble m10': 60000, 'noble m12': 80000, 'noble m14': 90000, 'noble m15': 100000, 'noble m400': 120000,
  'noble m600': 150000,
  'tvr cerbera': 70000, 'tvr chimaera': 55000, 'tvr griffith': 60000, 'tvr sagaris': 110000, 'tvr t350': 70000,
  'tvr tamora': 60000, 'tvr tuscan': 65000, 'tvr tuscan speed six': 75000,
  'spyker c12 zagato': 350000, 'spyker c8 aileron': 250000, 'spyker c8 laviolette': 220000,
  'spyker c8 spyder': 240000, 'spyker d8 peking-to-paris': 400000,
  'morgan 3-wheeler': 40000, 'morgan 4 4': 55000, 'morgan aero 8': 90000, 'morgan aero supersports': 120000,
  'morgan aeromax': 100000, 'morgan plus 4': 70000, 'morgan plus 6': 80000, 'morgan plus 8': 90000,
  'morgan roadster': 65000,
};

const BRAND_BASE: Record<string, number> = {
  ferrari: 250000, lamborghini: 300000, bentley: 250000, rolls: 350000, porsche: 75000,
  maserati: 70000, mclaren: 250000, aston: 180000, lotus: 90000, tesla: 46000,
  audi: 48000, bmw: 43000, mercedes: 44000, lexus: 45000, jaguar: 50000, land: 60000,
  volvo: 38000, alfa: 38000, mini: 27000, jeep: 33000, lancia: 20000, smart: 26000,
  subaru: 31000, mitsubishi: 28000, suzuki: 23000, honda: 28000, mazda: 28000,
  toyota: 29000, nissan: 27000, kia: 26000, hyundai: 26500, seat: 25000, skoda: 26000,
  volkswagen: 30000, vw: 30000, renault: 25000, peugeot: 26000, citroen: 25000,
  opel: 25000, ford: 27000, fiat: 21000, dacia: 16000, dodge: 55000, chrysler: 45000,
  chevrolet: 45000, dr: 22000, aito: 30000, byd: 30000,
  mg: 28000, xiaomi: 40000, polestar: 55000, lixiang: 50000, zeekr: 50000, leapmotor: 30000,
  jaecoo: 35000, omoda: 32000, dfsk: 25000, baic: 28000, ebro: 30000, cupra: 38000,
  ds: 32000, iveco: 40000, piaggio: 15000, austin: 25000, morris: 20000, rover: 25000,
  lada: 18000, bugatti: 2500000, koenigsegg: 2000000, pagani: 2200000, noble: 150000,
  tvr: 100000, spyker: 200000, morgan: 90000,
};

const BODY_ADJUSTMENT: Record<string, number> = {
  suv: 4500, crossover: 2500, fuoristrada: 4000, station: 2000, cabrio: 2500, spider: 1500,
  coupé: 2500, monovolume: 2000,
};

const DEPRECIATION_CURVE: Array<[number, number]> = [
  [0, 1.0], [1, 0.82], [2, 0.74], [3, 0.67], [4, 0.63], [5, 0.58], [6, 0.56], [7, 0.51],
  [8, 0.46], [9, 0.42], [10, 0.38], [11, 0.35], [12, 0.32], [13, 0.30], [14, 0.28], [15, 0.26],
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ');
}

function normalizeMake(make: string): string {
  const m = normalize(make);
  if (m === 'vw') return 'volkswagen';
  if (m.startsWith('alfa')) return 'alfa romeo';
  if (m.startsWith('mercedes') || m === 'mb' || m === 'benz') return 'mercedes';
  if (m.startsWith('land')) return 'land rover';
  if (m.startsWith('rolls')) return 'rolls royce';
  if (m.startsWith('volks') || m.startsWith('vokswagen')) return 'volkswagen';
  if (m === 'lancia') return 'lancia';
  if (m === 'vauxhall') return 'opel';
  if (m.includes('london taxi') || m.startsWith('lti')) return 'lti';
  return m;
}

function findModelPrice(make: string, model: string): number | undefined {
  const makeNorm = normalizeMake(make);
  const modelNorm = normalize(model);
  const key = `${makeNorm} ${modelNorm}`;

  let best: number | undefined;
  let bestLength = 0;
  for (const [candidate, price] of Object.entries(MODEL_PRICE)) {
    const norm = normalize(candidate);
    if (key.startsWith(norm) && norm.length > bestLength) {
      best = price;
      bestLength = norm.length;
    }
  }
  return best;
}

function findBrandBase(make: string): number {
  const makeNorm = normalizeMake(make);
  const key = Object.keys(BRAND_BASE).find((k) => makeNorm.startsWith(k));
  if (key) return BRAND_BASE[key];

  let hash = 0;
  for (let i = 0; i < makeNorm.length; i++) {
    hash = (hash << 5) - hash + makeNorm.charCodeAt(i);
    hash |= 0;
  }
  const bases = [21000, 26000, 31000, 24000, 28000, 35000];
  return bases[Math.abs(hash) % bases.length];
}

function getBodyAdjust(body: string): number {
  if (!body) return 0;
  const b = normalize(body);
  const key = Object.keys(BODY_ADJUSTMENT).find((k) => b.includes(k));
  return key ? BODY_ADJUSTMENT[key] : 0;
}

function getSegmentFactor(basePrice: number): number {
  if (basePrice <= 18000) return 1.15;
  if (basePrice <= 25000) return 1.06;
  if (basePrice >= 90000) return 0.87;
  if (basePrice >= 60000) return 0.92;
  return 1.0;
}

function getFuelFactor(fuel: string, age: number): number {
  const f = normalize(fuel);
  if (f.includes('diesel') || f.includes('tdi')) return age > 10 ? 0.88 : 1.0;
  if (f.includes('ibrid') || f.includes('hybrid')) return f.includes('mild') ? 1.0 : age <= 6 ? 1.06 : 0.98;
  if (f.includes('elettr') || f.includes(' ev') || f === 'ev') return age <= 4 ? 1.08 : 0.9;
  if (f.includes('gpl') || f.includes('metano')) return 0.95;
  return 1.0;
}

function getResidual(age: number): number {
  const clamped = Math.max(0, age);
  if (clamped >= 15) return Math.max(0.12, 0.26 - (clamped - 15) * 0.015);
  let residual = DEPRECIATION_CURVE[0][1];
  for (const [ageAt, value] of DEPRECIATION_CURVE) {
    if (ageAt <= clamped) residual = value;
    else break;
  }
  return residual;
}

const COLLECTIBLE_MAKES = ['porsche', 'ferrari', 'lamborghini', 'bentley', 'rolls', 'aston', 'mclaren', 'bugatti', 'koenigsegg', 'pagani', 'noble', 'tvr', 'spyker'];

function getCollectibleFloor(basePrice: number, make: string, age: number): number {
  if (basePrice < 100000) return 0;
  if (!COLLECTIBLE_MAKES.some((k) => normalizeMake(make).startsWith(k))) return 0;
  if (age <= 10) return 0.55;
  return Math.max(0.35, 0.55 - (age - 10) * 0.02);
}

export interface MarketValueOptions {
  year?: number;
  fuel?: string;
  body?: string;
  power?: string;
}

export function estimateMarketValue(
  make: string,
  model: string,
  options: MarketValueOptions = {}
): { value: number; min: number; max: number } {
  const year = options.year || 2020;
  const power = parseInt((options.power || '').replace(/\D/g, '')) || 100;
  const fuel = options.fuel || '';
  const body = options.body || '';

  const modelPrice = findModelPrice(make, model);
  const base = modelPrice ?? findBrandBase(make) + getBodyAdjust(body);

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  let residual = getResidual(age);
  residual *= getSegmentFactor(base);
  residual *= getFuelFactor(fuel, age);
  residual = Math.max(residual, getCollectibleFloor(base, make, age));

  const powerFactor = 1 + (Math.min(power, 300) - 100) * 0.0015;
  let value = Math.round((base * residual * powerFactor) / 100) * 100;
  value = Math.max(1500, value);

  const range = Math.round((value * 0.1) / 100) * 100;
  return { value, min: value - range, max: value + range };
}

function verdictForScore(score: number): 'BUY' | 'NEGOTIATE' | 'AVOID' {
  if (score >= 8) return 'BUY';
  if (score >= 7) return 'NEGOTIATE';
  return 'AVOID';
}

function maintenanceLabel(min: number, max: number): 'basso' | 'medio' | 'alto' | 'molto alto' {
  const avg = (min + max) / 2;
  if (avg < 450) return 'basso';
  if (avg < 750) return 'medio';
  if (avg < 1100) return 'alto';
  return 'molto alto';
}

function buildAdvice(weaknesses: string[], maintenanceMin: number): string[] {
  const list = weaknesses.slice(0, 3).map((w) => `Controlla ${w.charAt(0).toLowerCase()}${w.slice(1)}.`);
  list.push('Verifica lo storico di manutenzione e i tagliandi.');
  list.push('Controlla che i km siano coerenti con l\u2019età del veicolo.');
  if (maintenanceMin > 500) list.push('Preventiva i costi di manutenzione prima di trattare il prezzo.');
  return list.slice(0, 4);
}

export interface SegmentCandidate {
  make: string;
  model: string;
  body: string;
}

export const REAL_SEGMENT_CANDIDATES: Record<string, SegmentCandidate[]> = {
  citycar: [
    { make: 'Fiat', model: 'Panda', body: 'Citycar' },
    { make: 'Fiat', model: '500', body: 'Citycar' },
    { make: 'Toyota', model: 'Aygo', body: 'Citycar' },
    { make: 'Toyota', model: 'Aygo X', body: 'Citycar Crossover' },
    { make: 'Hyundai', model: 'i10', body: 'Citycar' },
    { make: 'Kia', model: 'Picanto', body: 'Citycar' },
    { make: 'Renault', model: 'Twingo', body: 'Citycar' },
    { make: 'Smart', model: 'Fortwo', body: 'Citycar' },
    { make: 'Volkswagen', model: 'up!', body: 'Citycar' },
    { make: 'Lancia', model: 'Ypsilon', body: 'Citycar' },
    { make: 'Suzuki', model: 'Ignis', body: 'Citycar Crossover' },
    { make: 'Citroen', model: 'C1', body: 'Citycar' },
    { make: 'Peugeot', model: '108', body: 'Citycar' },
    { make: 'Dacia', model: 'Spring', body: 'Citycar EV' },
  ],
  utilitaria: [
    { make: 'Toyota', model: 'Yaris', body: 'Utilitaria' },
    { make: 'Renault', model: 'Clio', body: 'Utilitaria' },
    { make: 'Peugeot', model: '208', body: 'Utilitaria' },
    { make: 'Volkswagen', model: 'Polo', body: 'Utilitaria' },
    { make: 'Ford', model: 'Fiesta', body: 'Utilitaria' },
    { make: 'Opel', model: 'Corsa', body: 'Utilitaria' },
    { make: 'Dacia', model: 'Sandero', body: 'Utilitaria' },
    { make: 'Citroen', model: 'C3', body: 'Utilitaria' },
    { make: 'Hyundai', model: 'i20', body: 'Utilitaria' },
    { make: 'Seat', model: 'Ibiza', body: 'Utilitaria' },
    { make: 'Skoda', model: 'Fabia', body: 'Utilitaria' },
    { make: 'Suzuki', model: 'Swift', body: 'Utilitaria' },
    { make: 'Nissan', model: 'Micra', body: 'Utilitaria' },
    { make: 'Mini', model: 'Cooper', body: 'Utilitaria' },
    { make: 'Fiat', model: 'Punto', body: 'Utilitaria' },
  ],
  bsuv: [
    { make: 'Jeep', model: 'Renegade', body: 'SUV compatto' },
    { make: 'Fiat', model: '500X', body: 'Crossover' },
    { make: 'Volkswagen', model: 'T-Roc', body: 'SUV compatto' },
    { make: 'Volkswagen', model: 'T-Cross', body: 'SUV compatto' },
    { make: 'Volkswagen', model: 'Taigo', body: 'Crossover Coupé' },
    { make: 'Toyota', model: 'Yaris Cross', body: 'SUV compatto' },
    { make: 'Peugeot', model: '2008', body: 'SUV compatto' },
    { make: 'Renault', model: 'Captur', body: 'Crossover' },
    { make: 'Ford', model: 'Puma', body: 'Crossover' },
    { make: 'Nissan', model: 'Juke', body: 'Crossover' },
    { make: 'Hyundai', model: 'Kona', body: 'SUV compatto' },
    { make: 'Hyundai', model: 'Bayon', body: 'Crossover' },
    { make: 'Kia', model: 'Stonic', body: 'Crossover' },
    { make: 'Dacia', model: 'Duster', body: 'SUV compatto' },
    { make: 'Suzuki', model: 'Vitara', body: 'SUV compatto' },
    { make: 'Mazda', model: 'CX-3', body: 'SUV compatto' },
    { make: 'Mazda', model: 'CX-30', body: 'Crossover' },
    { make: 'Opel', model: 'Mokka', body: 'Crossover' },
    { make: 'Opel', model: 'Crossland', body: 'Crossover' },
    { make: 'Seat', model: 'Arona', body: 'SUV compatto' },
    { make: 'Skoda', model: 'Kamiq', body: 'SUV compatto' },
    { make: 'Jeep', model: 'Avenger', body: 'SUV compatto' },
    { make: 'Citroen', model: 'C3 Aircross', body: 'SUV compatto' },
    { make: 'MG', model: 'ZS', body: 'SUV compatto' },
  ],
  compatta: [
    { make: 'Volkswagen', model: 'Golf', body: 'Berlina 2 volumi' },
    { make: 'Audi', model: 'A3', body: 'Berlina 2 volumi' },
    { make: 'BMW', model: 'Serie 1', body: 'Berlina 2 volumi' },
    { make: 'Mercedes', model: 'Classe A', body: 'Berlina 2 volumi' },
    { make: 'Ford', model: 'Focus', body: 'Berlina 2 volumi' },
    { make: 'Toyota', model: 'Corolla', body: 'Berlina 2 volumi' },
    { make: 'Peugeot', model: '308', body: 'Berlina 2 volumi' },
    { make: 'Seat', model: 'Leon', body: 'Berlina 2 volumi' },
    { make: 'Skoda', model: 'Octavia', body: 'Berlina' },
    { make: 'Fiat', model: 'Tipo', body: 'Berlina 2 volumi' },
    { make: 'Alfa Romeo', model: 'Giulietta', body: 'Berlina 2 volumi' },
    { make: 'Opel', model: 'Astra', body: 'Berlina 2 volumi' },
    { make: 'Hyundai', model: 'i30', body: 'Berlina 2 volumi' },
    { make: 'Kia', model: 'Ceed', body: 'Berlina 2 volumi' },
    { make: 'Mazda', model: 'Mazda 3', body: 'Berlina 2 volumi' },
    { make: 'Honda', model: 'Civic', body: 'Berlina 2 volumi' },
    { make: 'Renault', model: 'Megane', body: 'Berlina 2 volumi' },
  ],
  csuv: [
    { make: 'Volkswagen', model: 'Tiguan', body: 'SUV medio' },
    { make: 'Toyota', model: 'RAV4', body: 'SUV medio' },
    { make: 'Toyota', model: 'C-HR', body: 'Crossover' },
    { make: 'Nissan', model: 'Qashqai', body: 'Crossover' },
    { make: 'Peugeot', model: '3008', body: 'SUV medio' },
    { make: 'Hyundai', model: 'Tucson', body: 'SUV medio' },
    { make: 'Kia', model: 'Sportage', body: 'SUV medio' },
    { make: 'Ford', model: 'Kuga', body: 'SUV medio' },
    { make: 'Jeep', model: 'Compass', body: 'SUV medio' },
    { make: 'Cupra', model: 'Formentor', body: 'Crossover Coupé' },
    { make: 'BMW', model: 'X1', body: 'SUV medio' },
    { make: 'Audi', model: 'Q3', body: 'SUV medio' },
    { make: 'Mercedes', model: 'GLA', body: 'SUV medio' },
    { make: 'Volvo', model: 'XC40', body: 'SUV medio' },
    { make: 'Alfa Romeo', model: 'Tonale', body: 'SUV medio' },
    { make: 'Renault', model: 'Austral', body: 'SUV medio' },
    { make: 'Citroen', model: 'C5 Aircross', body: 'SUV medio' },
    { make: 'Seat', model: 'Ateca', body: 'SUV medio' },
    { make: 'Skoda', model: 'Karoq', body: 'SUV medio' },
    { make: 'Mazda', model: 'CX-5', body: 'SUV medio' },
    { make: 'Land Rover', model: 'Range Rover Evoque', body: 'SUV medio' },
  ],
  berlina_d: [
    { make: 'BMW', model: 'Serie 3', body: 'Berlina' },
    { make: 'Audi', model: 'A4', body: 'Berlina / Station Wagon' },
    { make: 'Mercedes', model: 'Classe C', body: 'Berlina' },
    { make: 'Alfa Romeo', model: 'Giulia', body: 'Berlina' },
    { make: 'Volvo', model: 'S60', body: 'Berlina' },
    { make: 'Volkswagen', model: 'Passat', body: 'Station Wagon' },
    { make: 'Tesla', model: 'Model 3', body: 'Berlina EV' },
    { make: 'Skoda', model: 'Superb', body: 'Berlina / Station Wagon' },
    { make: 'Peugeot', model: '508', body: 'Berlina' },
    { make: 'Ford', model: 'Mondeo', body: 'Berlina' },
    { make: 'Audi', model: 'A6', body: 'Berlina' },
    { make: 'BMW', model: 'Serie 5', body: 'Berlina' },
    { make: 'Mercedes', model: 'Classe E', body: 'Berlina' },
  ],
  dsuv: [
    { make: 'BMW', model: 'X3', body: 'SUV grande' },
    { make: 'Audi', model: 'Q5', body: 'SUV grande' },
    { make: 'Mercedes', model: 'GLC', body: 'SUV grande' },
    { make: 'Porsche', model: 'Macan', body: 'SUV grande' },
    { make: 'Alfa Romeo', model: 'Stelvio', body: 'SUV grande' },
    { make: 'Volvo', model: 'XC60', body: 'SUV grande' },
    { make: 'Land Rover', model: 'Range Rover Velar', body: 'SUV grande' },
    { make: 'Tesla', model: 'Model Y', body: 'SUV EV' },
    { make: 'Maserati', model: 'Grecale', body: 'SUV grande' },
    { make: 'Volkswagen', model: 'Touareg', body: 'SUV grande' },
    { make: 'Jeep', model: 'Grand Cherokee', body: 'SUV grande' },
    { make: 'Porsche', model: 'Cayenne', body: 'SUV grande' },
    { make: 'BMW', model: 'X5', body: 'SUV grande' },
    { make: 'Audi', model: 'Q7', body: 'SUV grande' },
    { make: 'Mercedes', model: 'GLE', body: 'SUV grande' },
    { make: 'Volvo', model: 'XC90', body: 'SUV grande' },
  ],
  sportiva: [
    { make: 'Mazda', model: 'MX-5', body: 'Spider' },
    { make: 'Toyota', model: 'GR86', body: 'Coupé' },
    { make: 'BMW', model: 'Serie 2', body: 'Coupé' },
    { make: 'BMW', model: 'Z4', body: 'Spider' },
    { make: 'Audi', model: 'TT', body: 'Coupé' },
    { make: 'Porsche', model: '718 Cayman', body: 'Coupé' },
    { make: 'Ford', model: 'Mustang', body: 'Coupé' },
    { make: 'Alpine', model: 'A110', body: 'Coupé' },
    { make: 'Abarth', model: '595', body: 'Sportiva compatta' },
    { make: 'Toyota', model: 'Supra', body: 'Coupé' },
  ],
  supercar: [
    { make: 'Porsche', model: '911', body: 'Coupé' },
    { make: 'Ferrari', model: 'Roma', body: 'Coupé GT' },
    { make: 'Ferrari', model: '296 GTB', body: 'Supercar' },
    { make: 'Lamborghini', model: 'Huracan', body: 'Supercar' },
    { make: 'McLaren', model: 'Artura', body: 'Supercar' },
    { make: 'Aston Martin', model: 'Vantage', body: 'Coupé GT' },
    { make: 'Maserati', model: 'MC20', body: 'Supercar' },
    { make: 'Audi', model: 'R8', body: 'Supercar' },
    { make: 'Nissan', model: 'GT-R', body: 'Supercar' },
  ],
  monovolume: [
    { make: 'Fiat', model: '500L', body: 'Monovolume' },
    { make: 'Citroen', model: 'Berlingo', body: 'Multispazio' },
    { make: 'Peugeot', model: 'Rifter', body: 'Multispazio' },
    { make: 'Volkswagen', model: 'Touran', body: 'Monovolume' },
    { make: 'Volkswagen', model: 'Caddy', body: 'Multispazio' },
    { make: 'Mercedes', model: 'Classe B', body: 'Monovolume' },
    { make: 'Renault', model: 'Scenic', body: 'Monovolume' },
    { make: 'Ford', model: 'C-Max', body: 'Monovolume' },
    { make: 'Ford', model: 'S-Max', body: 'Monovolume' },
    { make: 'Dacia', model: 'Jogger', body: 'Multispazio' },
  ],
  fuoristrada: [
    { make: 'Jeep', model: 'Wrangler', body: 'Fuoristrada' },
    { make: 'Suzuki', model: 'Jimny', body: 'Fuoristrada' },
    { make: 'Toyota', model: 'Land Cruiser', body: 'Fuoristrada' },
    { make: 'Toyota', model: 'Hilux', body: 'Pick-up' },
    { make: 'Ford', model: 'Ranger', body: 'Pick-up' },
    { make: 'Land Rover', model: 'Defender', body: 'Fuoristrada' },
    { make: 'Mercedes', model: 'Classe G', body: 'Fuoristrada' },
  ],
  elettrica: [
    { make: 'Tesla', model: 'Model 3', body: 'Berlina EV' },
    { make: 'Tesla', model: 'Model Y', body: 'SUV EV' },
    { make: 'Volkswagen', model: 'ID.3', body: 'Compatta EV' },
    { make: 'Volkswagen', model: 'ID.4', body: 'SUV EV' },
    { make: 'Cupra', model: 'Born', body: 'Compatta EV' },
    { make: 'Renault', model: 'Megane E-Tech', body: 'Crossover EV' },
    { make: 'Kia', model: 'EV6', body: 'Crossover EV' },
    { make: 'Hyundai', model: 'Ioniq 5', body: 'Crossover EV' },
    { make: 'MG', model: 'MG4', body: 'Compatta EV' },
    { make: 'BYD', model: 'Atto 3', body: 'SUV EV' },
    { make: 'Smart', model: '#1', body: 'Crossover EV' },
  ],
};

export function classifySegment(make: string, model: string): string {
  const norm = `${make} ${model}`.toLowerCase().replace(/[-_.]/g, ' ');

  // 1. Supercars
  if (/911|ferrari|lamborghini|mclaren|aston martin|mc20|r8\b|huracan|aventador|roma|296|f8|sf90|gtb|granturismo|grancabrio|gt-r\b|gtr\b|corvette|artura|720s|765lt|vantage|db11|db12|revuelto|urus|purosangue/.test(norm)) return 'supercar';

  // 2. Pure offroaders & pickups
  if (/wrangler|jimny|land cruiser|hilux|ranger|navara|l200|amarok|classe g\b|g wagen|gladiator/.test(norm)) return 'fuoristrada';

  // 3. Sports cars / Coupé / Spider / Hot Hatch
  if (/mx 5|miata|gr86|gt86|brz|z4|tt\b|718|boxster|cayman|mustang|alpine|a110|abarth|spider|supra|370z|350z|golf gti|golf r|focus st|focus rs|civic type r|megane rs|i30 n|i20 n|yaris gr|gr yaris/.test(norm)) return 'sportiva';

  // 4. Large / Luxury SUVs (D-SUV, E-SUV)
  if (/x3\b|x4\b|x5\b|x6\b|x7\b|q5\b|q7\b|q8\b|glc|gle|gls|macan|cayenne|stelvio|grecale|levante|xc60|xc90|velar|range rover|grand cherokee|model y|f pace|e pace|touareg|rx\b|nx\b|santa fe|sorento|tarraco|edge|explorer|highlander|cx 60|cx 80|defender|discovery\b/.test(norm)) return 'dsuv';

  // 5. C-SUV / Medium Crossovers
  if (/tiguan|rav4|c hr|chr\b|corolla cross|qashqai|3008|5008|tucson|sportage|xceed|kuga|compass|formentor|ateca|karoq|kodiaq|x1\b|x2\b|q3\b|gla\b|glb\b|xc40|tonale|austral|kadjar|arkana|c5 aircross|grandland|cx 5|eclipse cross|cr v|crv\b|hr v|hrv\b|forester|xv\b|crosstrek|ux\b|evoque|discovery sport|hs\b|across|symbioz|rafale|elroq|enyaq|id 4|id 5|ioniq 5|ev6|atto 3/.test(norm)) return 'csuv';

  // 6. B-SUV / Compact Crossovers
  if (/renegade|500x|600\b|t roc|t cross|taigo|yaris cross|2008|captur|puma|juke|kona|bayon|stonic|duster|vitara|s cross|cx 3\b|cx 30|mokka|crossland|frontera|arona|kamiq|avenger|c3 aircross|zs\b|ecosport|tivoli|aceman|countryman|smart #1|smart #3|ex30|ds 3|mokka e|2008 e|e 2008/.test(norm)) return 'bsuv';

  // 7. Monovolume & MPVs
  if (/500l|berlingo|rifter|touran|sharan|caddy|multivan|classe b|b180|b200|classe v|vito|scenic|espace|c max|s max|galaxy|kangoo|doblo|qubo|combo|zafira|lodgy|dokker|jogger|carens|alhambra|altea|roomster|b max|meriva|c4 picasso|spacetourer/.test(norm)) return 'monovolume';

  // 8. Dedicated Electrics (Compact)
  if (/id 3|born|megane e tech|leaf|mg4|byd dolphin|zoe|i3\b/.test(norm)) return 'elettrica';

  // 9. Berlina & Station Wagon Segment D/E
  if (/serie 3|318|320|330|340|serie 5|520|530|540|a4\b|a5\b|a6\b|classe c|c180|c200|c220|classe e|e200|e220|giulia|159|s60|v60|s90|v90|passat|arteon|model 3|superb|508|mondeo|insignia|talisman|camry|mazda 6|avensis|accord|optima|i40|levorg|outback|i4\b|byd seal|polestar/.test(norm)) return 'berlina_d';

  // 10. Citycar (A-Segment)
  if (/panda|500\b|aygo|i10|picanto|twingo|fortwo|forfour|up!|up\b|ypsilon|ignis|celerio|spring|citigo|mii\b|c1\b|108\b|adam\b|ka\b|karl|matiz|seicento|space star|twizy/.test(norm)) return 'citycar';

  // 11. Utilitaria (B-Segment Hatchbacks)
  if (/yaris|clio|208|polo|fiesta|corsa|sandero|c3\b|i20|rio\b|ibiza|fabia|swift|micra|jazz|mito\b|cooper\b|mini\b|punto|grande punto|207|206|mazda 2|colt/.test(norm)) return 'utilitaria';

  // 12. Compatta (C-Segment Hatchbacks)
  if (/golf|a3\b|serie 1|116|118|120|128|135|classe a|a160|a180|a200|a220|focus|corolla|auris|308|megane|leon|octavia|tipo|giulietta|147|astra|i30|ceed|pro ceed|mazda 3|civic|scala|bravo|ds 4|ct200h|ct 200h|pulsar/.test(norm)) return 'compatta';

  // Fallback heuristic based on make/model keywords
  if (/\b(suv|cross|crossover|aircross)\b/.test(norm)) return 'csuv';
  if (/\b(sw|station|touring|avant|wagon|combi|variant|sportstourer)\b/.test(norm)) return 'berlina_d';
  if (/\b(sport|coupe|spider|cabrio|cabriolet|roadster)\b/.test(norm)) return 'sportiva';

  return 'compatta';
}

export function buildAlternatives(make: string, model: string, year: number): AlternativeVehicle[] {
  const segment = classifySegment(make, model);
  const pool = REAL_SEGMENT_CANDIDATES[segment] || REAL_SEGMENT_CANDIDATES.compatta;
  const normMake = make.toLowerCase();
  const normModel = model.toLowerCase();

  const candidates = pool.filter(
    (c) => !(c.make.toLowerCase() === normMake && c.model.toLowerCase() === normModel)
  );

  const seenMakes = new Set<string>();
  const result: AlternativeVehicle[] = [];

  // Pass 1: 1 car per make
  for (const c of candidates) {
    const cMake = c.make.toLowerCase();
    if (cMake === normMake || seenMakes.has(cMake)) continue;
    seenMakes.add(cMake);
    const est = estimateMarketValue(c.make, c.model, { year });
    result.push({
      make: c.make,
      model: c.model,
      body: c.body,
      segment,
      estimatedValue: est.value,
      estimatedMin: est.min,
      estimatedMax: est.max,
    });
    if (result.length >= 4) break;
  }

  // Pass 2: Fill remaining if needed
  if (result.length < 4) {
    for (const c of candidates) {
      if (result.some((r) => r.make === c.make && r.model === c.model)) continue;
      const est = estimateMarketValue(c.make, c.model, { year });
      result.push({
        make: c.make,
        model: c.model,
        body: c.body,
        segment,
        estimatedValue: est.value,
        estimatedMin: est.min,
        estimatedMax: est.max,
      });
      if (result.length >= 4) break;
    }
  }

  return result;
}

export function buildLocalReport(
  make: string,
  model: string,
  year?: number,
  requestedPrice?: number,
  km?: number
): AutoReport {
  const currentYear = new Date().getFullYear();
  const y = year || currentYear;
  const reliability = estimateReliability(make, model, y);
  const consumption = estimateConsumption(make, model, y);
  const basePrice = estimateMarketValue(make, model, { year: y });

  // Correzione km (media italiana ~15.000 km/anno)
  let val = basePrice.value;
  if (km && km > 0) {
    const expectedKm = Math.max(10000, (currentYear - y) * 15000);
    const diffKm = km - expectedKm;
    const kmFactor = 1 - (diffKm / 100000) * 0.12;
    val = Math.max(1500, Math.round((val * Math.max(0.65, Math.min(1.35, kmFactor))) / 100) * 100);
  }

  const range = Math.round((val * 0.1) / 100) * 100;
  const price = {
    value: val,
    min: val - range,
    max: val + range,
  };

  const age = Math.max(0, currentYear - y);
  const residualNow = getResidual(age);

  const dep = (years: number): number => {
    if (residualNow <= 0) return 0;
    return Math.round((price.value * (1 - getResidual(age + years) / residualNow)) / 100) * 100;
  };

  const segmentKey = reliability.segmentKey || detectSegment(make, model);
  const maintMin = segmentKey === 'citycar' ? 250 : segmentKey === 'utility' ? 300 : segmentKey === 'berlina' ? 420 : segmentKey === 'suv' ? 480 : 650;
  const maintMax = segmentKey === 'citycar' ? 380 : segmentKey === 'utility' ? 480 : segmentKey === 'berlina' ? 650 : segmentKey === 'suv' ? 750 : 1100;
  const annualMaint = Math.round((maintMin + maintMax) / 2);

  const insuranceBase = segmentKey === 'citycar' ? 360 : segmentKey === 'utility' ? 400 : segmentKey === 'berlina' ? 480 : segmentKey === 'suv' ? 520 : 680;
  const insuranceEstimate = insuranceBase;

  const reliabilityAnalysis: ReliabilityAnalysis = {
    score: reliability.score,
    verdict: verdictForScore(reliability.score),
    verdictLabel: reliability.label,
    summary: reliability.verdictNote,
    strengths: reliability.strengths,
    weaknesses: reliability.weaknesses,
    advice: buildAdvice(reliability.weaknesses, reliability.maintenanceMin),
    engine: 'Non specificato',
    transmission: 'Non specificato',
    maintenance: maintenanceLabel(reliability.maintenanceMin, reliability.maintenanceMax),
    commonIssues: reliability.weaknesses,
    aiEnhanced: false,
    usage: {
      city: consumption.urban <= 6.5 ? 'Ottima' : consumption.urban <= 7.5 ? 'Buona' : 'Nella media',
      family: reliability.segmentKey === 'suv' || reliability.segmentKey === 'berlina' ? 'Buona' : 'Sufficiente',
      highway: consumption.extraurban <= 6 ? 'Ottima' : 'Buona',
      newDriver: reliability.segmentKey === 'sportiva' ? 'Da valutare con attenzione' : 'Adatta',
    },
    consumption: {
      city: consumption.urban,
      highway: consumption.extraurban,
      combined: consumption.combined,
      fuelType: consumption.isElectric ? 'elettrica' : 'benzina',
    },
    futureCosts: {
      annualMaintenance: annualMaint,
      fuelCostPer100Km: consumption.costPer100km,
      insuranceEstimate: insuranceEstimate,
      depreciation1Year: dep(1),
      depreciation3Years: dep(3),
      depreciation5Years: dep(5),
    },
  };

  const isSpecificModelData = Boolean(findModelPrice(make, model));

  const priceAnalysis: PriceAnalysis = {
    estimatedValue: price.value,
    min: price.min,
    max: price.max,
    inputYear: y,
    requestedPrice: requestedPrice,
    priceLabel: requestedPrice
      ? requestedPrice <= price.min
        ? 'GOOD'
        : requestedPrice >= price.max
        ? 'HIGH'
        : 'FAIR'
      : undefined,
    comment: isSpecificModelData
      ? `Stima indicativa per una ${make} ${model} ${y} in buone condizioni. Per una valutazione più precisa inserisci anno, chilometri e prezzo richiesto.`
      : `Stima calcolata sul segmento ${segmentKey} per ${make} ${model}. Dati specifici del modello non sufficienti per una quotazione statistica diretta.`,
    marketUrls: [],
    isSegmentEstimate: !isSpecificModelData,
  };

  return {
    vehicle: { make, model, year: y, dataSource: isSpecificModelData ? 'model' : 'segment_fallback' },
    reliability: reliabilityAnalysis,
    price: priceAnalysis,
    alternatives: buildAlternatives(make, model, y),
    createdAt: new Date().toISOString(),
  };
}
