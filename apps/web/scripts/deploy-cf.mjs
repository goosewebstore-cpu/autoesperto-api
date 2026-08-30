import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as esbuild from 'esbuild';

console.log('=== Step 1: Building with opennextjs-cloudflare ===');
execSync('npx opennextjs-cloudflare build', { stdio: 'inherit' });

console.log('=== Step 2: Optimizing & Minifying Worker Bundle ===');

function minifyFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    if (code.length < 50) return;
    const res = esbuild.transformSync(code, {
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      target: 'esnext',
      legalComments: 'none',
    });
    fs.writeFileSync(filePath, res.code, 'utf8');
    console.log(`Minified ${path.basename(filePath)}: ${(code.length / 1024).toFixed(1)} KB -> ${(res.code.length / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.warn(`Could not minify ${filePath}:`, err.message);
  }
}

function walkAndMinify(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndMinify(full);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      minifyFile(full);
    }
  }
}

walkAndMinify(path.resolve('.open-next'));

console.log('=== Step 3: Deploying with Wrangler ===');
execSync('npx wrangler deploy', {
  stdio: 'inherit',
  env: {
    ...process.env,
    OPEN_NEXT_DEPLOY: 'true',
  },
});
console.log('=== Deployment completed successfully! ===');
