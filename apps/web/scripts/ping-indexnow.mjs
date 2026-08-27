/**
 * IndexNow Instant Indexing Ping Script
 * Automatically submits updated URLs to Bing, Yandex and IndexNow search network.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'autoesperto.it';
const KEY = 'e8f4a1c2b5d6478990a1b2c3d4e5f678';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read URLs from sitemaps
const staticXmlPath = path.resolve(__dirname, '../public/sitemaps/static.xml');
const guidesXmlPath = path.resolve(__dirname, '../public/sitemaps/guides.xml');
const makesXmlPath = path.resolve(__dirname, '../public/sitemaps/makes.xml');
const modelsXmlPath = path.resolve(__dirname, '../public/sitemaps/models.xml');

const urls = [];

function extractUrls(xmlPath) {
  if (!fs.existsSync(xmlPath)) return;
  const content = fs.readFileSync(xmlPath, 'utf8');
  const matches = [...content.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  for (const m of matches) {
    urls.push(m[1]);
  }
}

extractUrls(staticXmlPath);
extractUrls(guidesXmlPath);
extractUrls(makesXmlPath);
extractUrls(modelsXmlPath);

if (urls.length === 0) {
  console.log('[IndexNow] No URLs found to ping.');
  process.exit(0);
}

console.log(`[IndexNow] Submitting ${Math.min(urls.length, 10000)} URLs to IndexNow API...`);

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls.slice(0, 10000), // Max batch size
};

try {
  const response = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(3000),
  });

  if (response.ok || response.status === 200 || response.status === 202) {
    console.log(`[IndexNow] Success! Response status: ${response.status} (${response.statusText || 'Accepted'})`);
  } else {
    console.log(`[IndexNow] Response status: ${response.status} ${response.statusText}`);
  }
} catch (error) {
  console.warn('[IndexNow] Ping failed (network or offline):', error.message);
}
