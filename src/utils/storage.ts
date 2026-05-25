import type { AppSettings, LogEntry } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_CONTENT, DEFAULT_LAYOUT } from './defaults';

const SETTINGS_KEY = 'tzviair_settings';
const LOG_KEY = 'tzviair_log';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    // Migrate old flat title/subtitle fields into content
    const migratedContent: Record<string, string> = {};
    for (const key of ['titleHe','titleEn','subtitleHe','subtitleEn'] as const) {
      if (typeof parsed[key] === 'string') migratedContent[key] = parsed[key] as string;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...(typeof parsed.mainLogoUrl === 'string' && { mainLogoUrl: parsed.mainLogoUrl }),
      ...(typeof parsed.spreadsheetUrl === 'string' && { spreadsheetUrl: parsed.spreadsheetUrl }),
      content: {
        ...DEFAULT_CONTENT,
        ...migratedContent,
        ...(parsed.content && typeof parsed.content === 'object' ? parsed.content as object : {}),
      },
      layout: {
        ...DEFAULT_LAYOUT,
        ...(parsed.layout && typeof parsed.layout === 'object' ? parsed.layout as object : {}),
      },
      social: {
        ...DEFAULT_SETTINGS.social,
        ...(parsed.social && typeof parsed.social === 'object' ? parsed.social as object : {}),
      },
      questions: Array.isArray(parsed.questions) && parsed.questions.length > 0
        ? parsed.questions
        : [...DEFAULT_SETTINGS.questions],
    };
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadLog(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLog(entries: LogEntry[]): void {
  localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(-200)));
}
