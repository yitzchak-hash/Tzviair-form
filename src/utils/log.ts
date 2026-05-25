import type { LogEntry, LogStatus } from '../types';
import { loadLog, saveLog } from './storage';

export function addLogEntry(
  action: string,
  detail: string,
  status: LogStatus = 'info'
): LogEntry[] {
  const entries = loadLog();
  const newEntry: LogEntry = {
    id: crypto.randomUUID(),
    time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    action,
    detail,
    status,
  };
  const updated = [newEntry, ...entries];
  saveLog(updated);
  return updated;
}

export function getLog(): LogEntry[] {
  return loadLog();
}
