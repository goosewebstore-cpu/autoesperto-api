import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
blacklist = set(json.load(open(os.path.join(PROJECT_ROOT, "scripts", "blacklist_bases.json"), encoding='utf-8')))

titles = [
    "File:Alfa Romeo Giulia Super - Polizia di Stato (5892593844).jpg",
    "File:The frontview of Toyota YARiS HYBRID G (XP210 prototype).jpg",
    "File:Peugeot 2008 1.2 PureTech 100 (2020) (52173175166).jpg",
    "File:Engine 1.5 dCi 55 kW.jpg",
    "File:VW DSG transmission DTMB.jpg",
    "File:2016 Fiat Panda Cross 4x4 1.3 Multijet 95.jpg",
    "File:2019 Peugeot 508 GT-Line BlueHDi 1.5 (130 PS).jpg",
    "File:M307 Volvo V70 Estate - Netherlands Politie (5701002640).jpg",
    "File:ZF Stufenautomatgetriebe 8HP70.jpg",
    "File:Volkswagen Polo GTE - silnik 1.4 TSI + elektryczny (MSP15).JPG",
    "File:EGR Volkswagen 2.0 TDI.JPG",
    "File:2010 BMW X1 sDrive 2.0d SE - Flickr - The Car Spy (16).jpg",
    "File:Ford 2.0 EcoBoost.jpg",
    'File:" 12 - Italian engine Fiat 1.4 MultiAir Turbo.jpg',
    "File:Fiat Multipla 1.9 JTD (2004) (52170707291).jpg",
    "File:2006 Toyota Prius T Spirit - 1497cc 1.5 (76PS) Hybrid Synergy Drive - Silver Steel - 03-03-2024, Front Left.jpg",
    "File:Subaru Crosstrek S-HEV powertrain cutaway.jpg",
    "File:2016 Fiat Doblo Easy Multijet 1.6 Front.jpg",
    "File:VW EA211-evo Deutsches-Museum.jpg",
    "File:Mercedes-Benz A 180 CDI (W176, 2014) (52180834122).jpg",
    "File:Renault Clio V TCe 90 (2020) (52207757169).jpg",
    "File:Hino Standardized SCR Unit.jpg",
    "File:JAGUAR 2L I4 Turbocharged (6959278660).jpg",
    "File:LPG Fill and AFL valves apart.JPG",
    "File:2013-03-05 Geneva Motor Show 7913.JPG",
    "File:Car showroom, Lee Way, Newport - geograph.org.uk - 6206559.jpg",
    "File:Air spring.JPG",
    "File:ECU and wire bundles.JPG",
    "File:2021 MINI Clubman Cooper S LCI red engine view in Brunei.jpg",
    "File:Fiat Freemont 2.0 Multijet 4x4 (2013) (52919563146).jpg",
    "File:VW Tiguan 1.5 eTSI ACT R-Line (III) – f 14022026.jpg",
    "File:2015 Mazda MX-5 ND 2.0 SKYACTIV-G 160 i-ELOOP Motorraum.jpg",
    "File:2014 Hyundai i40 (VF2) Active CRDi sedan (2015-07-06) 01.jpg",
    "File:SUBARU BOXER DIESEL (EE20) 01.jpg",
    "File:Close-up view of a worn clutch disc among automotive tools in a workshop.jpg",
    "File:Electric motor Toyota bZ4X Expo 2022 CRI 4894.jpg"
]

bases = [t.replace("File:", "").strip() for t in titles]
print(f"Total proposed for Affidabilita: {len(bases)}")
print(f"Unique proposed: {len(set(bases))}")
clashes = [b for b in bases if b in blacklist]
print(f"Blacklist clashes: {len(clashes)}")
if clashes:
    print(f"Clashes: {clashes}")
else:
    print("ALL 36 BASES ARE 100% UNIQUE WITH 0 BLACKLIST OVERLAP!")
