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

export interface ContentSettings {
  titleHe: string;
  titleEn: string;
  subtitleHe: string;
  subtitleEn: string;
  submitHe: string;
  submitEn: string;
  submittingHe: string;
  submittingEn: string;
  successTitleHe: string;
  successTitleEn: string;
  successSubtitleHe: string;
  successSubtitleEn: string;
  fillAnotherHe: string;
  fillAnotherEn: string;
  errorMsgHe: string;
  errorMsgEn: string;
  socialHeadlineHe: string;
  socialHeadlineEn: string;
  socialFollowLabelHe: string;
  socialFollowLabelEn: string;
  socialRequiredHintHe: string;
  socialRequiredHintEn: string;
  socialRequiredErrorHe: string;
  socialRequiredErrorEn: string;
  requiredHe: string;
  requiredEn: string;
}

export interface LayoutSettings {
  titleSizePx: number;
  subtitleSizePx: number;
  questionSizePx: number;
  submitSizePx: number;
  titleAlign: 'start' | 'center';
  subtitleAlign: 'start' | 'center';
  logoMaxHeightPx: number;
  formMaxWidthPx: number;
  fieldGapPx: number;
}

export interface AppSettings {
  mainLogoUrl: string;
  spreadsheetUrl: string;
  content: ContentSettings;
  layout: LayoutSettings;
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
