import type { Question, FormValues, Lang } from '../types';

export function buildPayload(
  questions: Question[],
  values: FormValues,
  language: Lang
): Record<string, string> {
  const payload: Record<string, string> = {
    timestamp: new Date().toISOString(),
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
