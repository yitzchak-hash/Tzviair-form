import type { Question, FormValues } from '../types';

export function validateForm(
  questions: Question[],
  values: FormValues
): Record<string, boolean> {
  const errors: Record<string, boolean> = {};
  for (const q of questions) {
    if (!q.required) continue;
    const val = values[q.id];
    if (Array.isArray(val)) {
      if (val.length === 0) errors[q.id] = true;
    } else {
      if (!val || val.toString().trim() === '') errors[q.id] = true;
    }
  }
  return errors;
}
