import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Lang, AppSettings, LogEntry } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';
import { addLogEntry, getLog } from '../utils/log';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  settings: AppSettings;
  updateSettings: (s: AppSettings) => void;
  log: LogEntry[];
  addLog: (action: string, detail: string, status?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('he');
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [log, setLog] = useState<LogEntry[]>(() => getLog());

  useEffect(() => {
    const entries = addLogEntry('App Loaded', 'Application started');
    setLog(entries);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    const entries = addLogEntry('Language Changed', l === 'he' ? 'Hebrew' : 'English');
    setLog(entries);
  }, []);

  const updateSettings = useCallback((s: AppSettings) => {
    setSettings(s);
    saveSettings(s);
  }, []);

  const addLog = useCallback((action: string, detail: string, status: 'success' | 'error' | 'info' = 'info') => {
    const entries = addLogEntry(action, detail, status);
    setLog(entries);
  }, []);

  return (
    <AppContext.Provider value={{ lang, setLang, settings, updateSettings, log, addLog }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
