import { guides } from '../apps/web/src/lib/guides.ts';

async function checkUrl(slug) {
  try {
    const res = await fetch(`http://localhost:3000/guide/${slug}`);
    return { slug, status: res.status, ok: res.status === 200 };
  } catch (err) {
    return { slug, status: 0, error: err.message, ok: false };
  }
}

async function run() {
  console.log(`Testing ${guides.length} guide pages concurrently...`);
  const chunkSize = 15;
  let okCount = 0;
  const failures = [];

  for (let i = 0; i < guides.length; i += chunkSize) {
    const chunk = guides.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map(g => checkUrl(g.slug)));
    for (const r of results) {
      if (r.ok) {
        okCount++;
      } else {
        failures.push(r);
      }
    }
    process.stdout.write(`\rProgress: ${okCount + failures.length}/${guides.length} (OK: ${okCount}, Failed: ${failures.length})`);
  }

  console.log('\n\n=== RESULT ===');
  console.log(`Total: ${guides.length}`);
  console.log(`Success (200 OK): ${okCount}`);
  console.log(`Failures: ${failures.length}`);
  if (failures.length > 0) {
    console.log('Failed pages:');
    failures.forEach(f => console.log(` - ${f.slug}: status ${f.status} ${f.error || ''}`));
  }
}

run();
