import dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';
import { app, defaultWebUrls } from './app';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT || 4000;

const webUrls = defaultWebUrls();
if (webUrls.length === 1 && webUrls[0] === 'http://localhost:3000') {
  console.warn(
    "[CORS] WEB_URLS non configurato: in produzione imposta WEB_URLS con l'URL pubblico del sito (es. https://autoesperto.it)."
  );
}

try {
  if (process.env.DATABASE_URL && (process.env.DATABASE_SCHEMA_SYNC ?? 'true') !== 'false') {
    console.log('Synchronizing database schema...');
    execSync(
      'npx prisma db push --schema=packages/database/prisma/schema.prisma --skip-generate --accept-data-loss',
      { stdio: 'inherit', timeout: 60000 }
    );
    console.log('Database schema synchronized.');
  }
} catch (error) {
  console.error('Database schema sync failed:', error instanceof Error ? error.message : error);
}

app.listen(PORT, () => {
  console.log(`AutoEsperto API running on http://localhost:${PORT}`);
});