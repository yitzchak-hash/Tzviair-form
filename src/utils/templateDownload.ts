import type { Question } from '../types';

const FIXED_BEFORE = [
  { id: 'timestamp', label: 'Timestamp' },
  { id: 'language',  label: 'Language'  },
];

const FIXED_AFTER = [
  { id: 'socialFollowed', label: 'Social Followed' },
];

function buildColumns(questions: Question[]) {
  return [
    ...FIXED_BEFORE,
    ...questions.map((q) => ({ id: q.id, label: q.labelEn || q.id })),
    ...FIXED_AFTER,
  ];
}

function buildSampleRow(questions: Question[]): Record<string, string> {
  const row: Record<string, string> = {
    timestamp: new Date().toISOString(),
    language: 'he',
  };
  for (const q of questions) {
    if (q.type === 'single-choice' && q.options?.[0]) row[q.id] = q.options[0].en;
    else if (q.type === 'tel') row[q.id] = '050-0000000';
    else if (q.type === 'number') row[q.id] = '10';
    else row[q.id] = `(${q.labelEn})`;
  }
  row.socialFollowed = 'instagram, tiktok';
  return row;
}

function trigger(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(questions: Question[]) {
  const cols = buildColumns(questions);
  const sample = buildSampleRow(questions);
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;

  const lines = [
    '# TzviAir Form — Spreadsheet Template',
    '# Row 1: Column headers  |  Row 2: Field IDs (reference)  |  Row 3: Sample data',
    cols.map((c) => esc(c.label)).join(','),
    cols.map((c) => esc(c.id)).join(','),
    cols.map((c) => esc(sample[c.id] ?? '')).join(','),
  ];
  trigger(new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' }), 'tzviair-template.csv');
}

export async function downloadExcel(questions: Question[]) {
  const XLSX = await import('xlsx');
  const cols = buildColumns(questions);
  const sample = buildSampleRow(questions);

  const headerRow = cols.map((c) => c.label);
  const idRow     = cols.map((c) => c.id);
  const sampleRow = cols.map((c) => sample[c.id] ?? '');

  const ws = XLSX.utils.aoa_to_sheet([headerRow, idRow, sampleRow]);
  ws['!cols'] = cols.map(() => ({ wch: 28 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Submissions');
  XLSX.writeFile(wb, 'tzviair-template.xlsx');
}
