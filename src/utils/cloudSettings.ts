import { ref, get, set } from 'firebase/database';
import type { AppSettings } from '../types';
import { getDb } from './firebaseClient';

const SETTINGS_PATH = 'settings';

export async function loadSettingsFromCloud(): Promise<AppSettings | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snapshot = await get(ref(db, SETTINGS_PATH));
    if (!snapshot.exists()) return null;
    return snapshot.val() as AppSettings;
  } catch {
    return null;
  }
}

export async function saveSettingsToCloud(settings: AppSettings): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await set(ref(db, SETTINGS_PATH), settings);
  } catch {
    // silent — localStorage already saved the data
  }
}
