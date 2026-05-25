import type { Question, FormValues, Lang } from '../types';

export function buildPayload(
  questions: Question[],
  values: FormValues,
  language: Lang
): Record<string, string> {
  const payload: Record<string, string> = {
    timestamp: (() => { const d = new Date(); return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; })(),
    language,
  };

  for (const q of questions) {
    const val = values[q.id];
    if (Array.isArray(val)) {
      payload[q.id] = val.join(', ');
    } else {
      payload[q.id] = (val ?? '').toString().trim();
    }
  }

  return payload;
}
