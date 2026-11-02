/**
 * In-memory global store for shared vehicle passports on the Next.js server.
 * Persists across API route calls within the serverless/worker instance.
 */

declare global {
  // eslint-disable-next-line no-var
  var __publicPassportsMap: Map<string, any> | undefined;
}

export function getServerPublicPassportsMap(): Map<string, any> {
  if (!globalThis.__publicPassportsMap) {
    globalThis.__publicPassportsMap = new Map();
  }
  return globalThis.__publicPassportsMap;
}
