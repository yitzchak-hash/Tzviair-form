import type { AppSettings, Question } from '../types';

export const DEFAULT_SPREADSHEET_URL =
  'https://script.google.com/macros/s/AKfycbx7itS1rkAMjd69oR3gSxe-v-r587nMf2z11kkBZ0TL55Wajbn-Ks-Q8BLb8svYerkq/exec';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'fullName',
    labelEn: 'Full Name',
    labelHe: 'שם מלא',
    type: 'text',
    required: true,
  },
  {
    id: 'phone',
    labelEn: 'Phone Number',
    labelHe: 'מספר טלפון',
    type: 'tel',
    required: true,
  },
  {
    id: 'previousAcCompany',
    labelEn: 'Previous AC company worked with',
    labelHe: 'חברת מיזוג קודמת שעבדת איתה',
    type: 'text',
    required: false,
  },
  {
    id: 'yearsInBusiness',
    labelEn: 'How many years are you in business?',
    labelHe: 'כמה שנים את/ה בתחום?',
    type: 'text',
    required: true,
  },
  {
    id: 'previousAcExperience',
    labelEn: 'Did you have a good experience with the previous AC company you worked with?',
    labelHe: 'האם הייתה לך חוויה טובה עם חברת המיזוג הקודמת שעבדת איתה?',
    type: 'single-choice',
    required: false,
    options: [
      { en: 'Yes', he: 'כן' },
      { en: 'Somewhat', he: 'במידה מסוימת' },
      { en: 'No', he: 'לא' },
    ],
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  mainLogoUrl: '',
  spreadsheetUrl: DEFAULT_SPREADSHEET_URL,
  social: {
    instagramLogoUrl: '',
    instagramQrUrl: '',
    tiktokLogoUrl: '',
    tiktokQrUrl: '',
    facebookLogoUrl: '',
    facebookQrUrl: '',
  },
  questions: DEFAULT_QUESTIONS,
};
