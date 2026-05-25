export type Lang = 'he' | 'en';

export type QuestionType = 'text' | 'number' | 'tel' | 'single-choice' | 'multi-choice';

export interface QuestionOption {
  en: string;
  he: string;
}

export interface Question {
  id: string;
  labelEn: string;
  labelHe: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[];
}

export interface SocialConfig {
  instagramLogoUrl: string;
  instagramQrUrl: string;
  tiktokLogoUrl: string;
  tiktokQrUrl: string;
  facebookLogoUrl: string;
  facebookQrUrl: string;
}

export interface AppSettings {
  mainLogoUrl: string;
  spreadsheetUrl: string;
  social: SocialConfig;
  questions: Question[];
}

export type LogStatus = 'success' | 'error' | 'info';

export interface LogEntry {
  id: string;
  time: string;
  action: string;
  detail: string;
  status: LogStatus;
}

export type FormValues = Record<string, string | string[]>;
