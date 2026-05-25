import type { AppSettings, ContentSettings, LayoutSettings, Question } from '../types';

export const DEFAULT_SPREADSHEET_URL =
  'https://script.google.com/macros/s/AKfycbx7itS1rkAMjd69oR3gSxe-v-r587nMf2z11kkBZ0TL55Wajbn-Ks-Q8BLb8svYerkq/exec';

export const DEFAULT_CONTENT: ContentSettings = {
  titleHe: 'השארת פרטים',
  titleEn: 'Leave Your Details',
  subtitleHe: 'תודה שביקרתם את צבי אייר. נשמח לשמור על קשר ולהמשיך ללוות את הפרויקטים הבאים שלכם.',
  subtitleEn: "Thank you for visiting TzviAir. We'd love to stay connected and support your future projects.",
  submitHe: 'שליחה',
  submitEn: 'Submit',
  submittingHe: 'שולח...',
  submittingEn: 'Submitting...',
  successTitleHe: 'תודה שהתחברתם לצבי אייר',
  successTitleEn: 'Thank you for connecting with TzviAir.',
  successSubtitleHe: 'נשמח לשמור על קשר ולהמשיך מכאן יחד.',
  successSubtitleEn: 'We look forward to staying in touch.',
  fillAnotherHe: 'מילוי פרטים נוספים',
  fillAnotherEn: 'Fill another form',
  errorMsgHe: 'לא הצלחנו לשלוח כרגע. כדאי לבדוק את החיבור לאינטרנט ולנסות שוב בעוד רגע.',
  errorMsgEn: "We couldn't submit the form right now. Please check the internet connection and try again in a moment.",
  socialHeadlineHe: 'שלא תשכחו — תעקבו אחרינו בטיקטוק, באינסטגרם ובפייסבוק',
  socialHeadlineEn: "Don't forget — follow us on TikTok, Instagram, and Facebook",
  socialFollowLabelHe: 'עקבתי',
  socialFollowLabelEn: 'I followed',
  socialRequiredHintHe: 'יש לעקוב אחר לפחות 2 פלטפורמות כדי להמשיך',
  socialRequiredHintEn: 'Follow at least 2 platforms to continue',
  socialRequiredErrorHe: 'נא לסמן מעקב אחר לפחות 2 רשתות חברתיות',
  socialRequiredErrorEn: 'Please follow at least 2 social platforms',
  requiredHe: 'שדה חובה',
  requiredEn: 'Required',
};

export const DEFAULT_LAYOUT: LayoutSettings = {
  titleSizePx: 30,
  subtitleSizePx: 16,
  questionSizePx: 16,
  submitSizePx: 18,
  titleAlign: 'start',
  subtitleAlign: 'start',
  logoMaxHeightPx: 220,
  formMaxWidthPx: 680,
  fieldGapPx: 32,
};

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
  content: DEFAULT_CONTENT,
  layout: DEFAULT_LAYOUT,
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
