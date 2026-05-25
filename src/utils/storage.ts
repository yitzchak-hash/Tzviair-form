import type { AppSettings, LogEntry } from '../types';
import { DEFAULT_SETTINGS } from './defaults';

const SETTINGS_KEY = 'tzviair_settings';
const LOG_KEY = 'tzviair_log';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS, questions: [...DEFAULT_SETTINGS.questions] };
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      social: { ...DEFAULT_SETTINGS.social, ...(parsed.social ?? {}) },
      questions: parsed.questions && parsed.questions.length > 0
        ? parsed.questions
        : [...DEFAULT_SETTINGS.questions],
    };
  } catch {
    return { ...DEFAULT_SETTINGS, questions: [...DEFAULT_SETTINGS.questions] };
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
  const trimmed = entries.slice(-200);
  localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
}
