import fs from 'fs';
import path from 'path';

const ARTICLES_DIR = 'articolo/articolo-autoesperto';
const OUT_IMAGES_DIR = 'apps/web/public/images/guide';
const OUT_LIB_FILE = 'apps/web/src/lib/guides-articoli.ts';

if (!fs.existsSync(OUT_IMAGES_DIR)) {
  fs.mkdirSync(OUT_IMAGES_DIR, { recursive: true });
}

// 1. Image Mapping
const IMAGE_MAPPING = {
  'adblue-diesel-cosa-e-quanto-costa': 'photo-1486262715619-67b85e0b08d3.jpg',
  'auto-elettriche-usate-sotto-15000-euro': 'photo-1563986768609-322da13575f3.jpg',
  'auto-neopatentati-2026-regole-potenza': 'photo-1549399542-7e3f8b79c341.jpg',
  'batteria-ibrida-usata-durata-affidabilita': 'photo-1555774698-0b77e0d5fac6.jpg',
  'cambio-cvt-usato-pregi-difetti': 'photo-1550355291-bbee04a92027.jpg',
  'cambio-dsg-doppia-frizione-usato-cosa-controllare': 'photo-1617814076367-b759c7d7e738.jpg',
  'cinghia-distribuzione-o-catena-cosa-sapere': 'photo-1568605117036-5fe5e7bab0b7.jpg',
  'come-scrivere-annuncio-efficace-vendere-auto': 'photo-1554224155-8d04cb21cd6c.jpg',
  'comprare-auto-usata-asta-giudiziaria': 'photo-1454165804606-c3d57bc86b40.jpg',
  'comprare-auto-usata-rivenditore-o-privato': 'photo-1449965408869-eaa3f722e40d.jpg',
  'compratore-non-paga-cosa-fare': 'photo-1450133064473-71024230f91b.jpg',
  'contachilometri-scalato-come-riconoscerlo': 'photo-1567808291548-fc3ee04dbcf0.jpg',
  'documenti-controllare-prima-comprare-auto-privato': 'photo-1554224155-8d04cb21cd6c.jpg',
  'documenti-necessari-vendere-auto-usata-privatamente': 'photo-1582139329536-e7284fece509.jpg',
  'fap-intasato-diesel-come-riconoscerlo': 'photo-1621905251189-08b45d6a269e.jpg',
  'finanziamento-auto-usata-tan-taeg-rata': 'photo-1512941937669-90a1b58e7e9c.jpg',
  'garanzia-legale-auto-usata-concessionario': 'photo-1563720223185-11003d516935.jpg',
  'km0-vs-usato-quale-conviene-2026': 'photo-1541348263662-e0c8de4259ba.jpg',
  'le-10-auto-usate-piu-affidabili-2026': 'photo-1555215695-3004980ad54e.jpg',
  'migliori-auto-familiari-usate-15000-euro-2026': 'photo-1590362891991-f776e747a588.jpg',
  'permuta-o-vendita-diretta-cosa-conviene': 'photo-1520340356584-f9917d1eea6f.jpg',
  'preparare-auto-foto-annuncio-vendita': 'photo-1607860108855-64acf2078ed9.jpg',
  'prova-su-strada-auto-usata-cosa-controllare': 'photo-1542282088-72c9c27ed0cd.jpg',
  'quanto-vale-citroen-c3-usata-2026': 'photo-1549465220-1a8b9238cd48.jpg',
  'quanto-vale-dacia-duster-usata-2026': 'photo-1533473359331-0135ef1b58bf.jpg',
  'quanto-vale-fiat-tipo-usata-2026': 'photo-1489824904134-891ab64532f1.jpg',
  'quanto-vale-jeep-renegade-usato-2026': 'photo-1599819811279-d5ad9cccf838.jpg',
  'quanto-vale-lancia-ypsilon-usata-2026': 'photo-1556189250-72ba954cfc2b.jpg',
  'quanto-vale-nissan-qashqai-usato-2026': 'photo-1601362840469-51e4d8d58785.jpg',
  'quanto-vale-peugeot-208-usata-2026': 'photo-1541899481282-d53bffe3c35d.jpg',
  'quanto-vale-toyota-yaris-usata-2026': 'photo-1502877338535-766e1452684a.jpg',
  'quanto-vale-volkswagen-golf-usata-2026': 'photo-1580273916550-e323be2ae537.jpg',
  'quanto-vale-volkswagen-polo-usata-2026': 'photo-1508974239320-0a029497e820.jpg',
  'richiami-auto-come-verificare': 'photo-1562911791-c7a97b729ec5.jpg',
  'truffe-comuni-vendita-auto-usata': 'photo-1552519507-da3b142c6e3d.jpg',
  'vendere-auto-usata-subito-it-senza-truffe': 'photo-1494976388531-d1058494cdd8.jpg',
};

// Copy images to destination
console.log('Copying images...');
for (const [slug, srcImg] of Object.entries(IMAGE_MAPPING)) {
  const srcPath = path.join('scripts/unsplash_cache', srcImg);
  const dstPath = path.join(OUT_IMAGES_DIR, `${slug}.jpg`);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
  } else {
    console.warn(`Source image not found: ${srcPath}`);
  }
}
console.log('Images copied successfully.');
