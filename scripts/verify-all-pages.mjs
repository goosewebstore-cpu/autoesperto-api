import { guides } from '../apps/web/src/lib/guides.ts';

let ok = 0;
let fail = 0;
const errors = [];

for (const g of guides) {
  try {
    const res = await fetch(`http://localhost:3000/guide/${g.slug}`);
    if (res.status === 200) {
      ok++;
    } else {
      fail++;
      errors.push(`${res.status}: ${g.slug}`);
    }
  } catch (e) {
    fail++;
    errors.push(`ERR: ${g.slug} - ${e.message}`);
  }
}

console.log(`OK: ${ok}/${guides.length}`);
console.log(`FAIL: ${fail}/${guides.length}`);
if (errors.length > 0) {
  console.log('\nFailed articles:');
  errors.forEach(e => console.log('  ' + e));
}
