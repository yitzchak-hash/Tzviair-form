import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';

const REQUIRED = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
] as const;

let _db: Database | null = null;

export function isFirebaseConfigured(): boolean {
  return REQUIRED.every((k) => !!import.meta.env[k]);
}

export function getDb(): Database | null {
  if (!isFirebaseConfigured()) return null;
  if (_db) return _db;

  const app: FirebaseApp =
    getApps().length > 0
      ? getApps()[0]!
      : initializeApp({
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        });

  _db = getDatabase(app);
  return _db;
}
