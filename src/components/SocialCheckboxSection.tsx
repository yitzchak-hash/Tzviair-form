import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export type SocialKey = 'instagram' | 'tiktok' | 'facebook';

interface Props {
  checked: Record<SocialKey, boolean>;
  onChange: (key: SocialKey, val: boolean) => void;
  showError: boolean;
}

interface PlatformConfig {
  key: SocialKey;
  logoKey: 'instagramLogoUrl' | 'tiktokLogoUrl' | 'facebookLogoUrl';
  qrKey: 'instagramQrUrl' | 'tiktokQrUrl' | 'facebookQrUrl';
}

const PLATFORMS: PlatformConfig[] = [
  { key: 'instagram', logoKey: 'instagramLogoUrl', qrKey: 'instagramQrUrl' },
  { key: 'tiktok',    logoKey: 'tiktokLogoUrl',    qrKey: 'tiktokQrUrl'    },
  { key: 'facebook',  logoKey: 'facebookLogoUrl',  qrKey: 'facebookQrUrl'  },
];

const PLATFORM_NAMES: Record<SocialKey, { he: string; en: string }> = {
  instagram: { he: 'אינסטגרם', en: 'Instagram' },
  tiktok:    { he: 'טיקטוק',   en: 'TikTok'    },
  facebook:  { he: 'פייסבוק',  en: 'Facebook'  },
};

export function SocialCheckboxSection({ checked, onChange, showError }: Props) {
  const { lang, settings } = useApp();
  const { content, social } = settings;
  const isRtl = lang === 'he';

  const headline = lang === 'he' ? content.socialHeadlineHe : content.socialHeadlineEn;
  const hint = lang === 'he' ? content.socialRequiredHintHe : content.socialRequiredHintEn;
  const followLabel = lang === 'he' ? content.socialFollowLabelHe : content.socialFollowLabelEn;
  const errorMsg = lang === 'he' ? content.socialRequiredErrorHe : content.socialRequiredErrorEn;

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex flex-col gap-5 pt-8 pb-2 border-t border-gray-100">
      <div className={`flex flex-col gap-1 ${isRtl ? 'text-right' : 'text-left'}`}>
        <p className="text-[#17213A] text-base font-semibold leading-snug">{headline}</p>
        <p className="text-gray-400 text-sm">{hint}</p>
      </div>

      <div className="flex flex-row gap-3 justify-center">
        {PLATFORMS.map((p) => {
          const logoUrl = social[p.logoKey];
          const qrUrl = social[p.qrKey];
          const isChecked = checked[p.key];
          const name = lang === 'he' ? PLATFORM_NAMES[p.key].he : PLATFORM_NAMES[p.key].en;

          return (
            <div
              key={p.key}
              onClick={() => onChange(p.key, !isChecked)}
              className={`flex-1 min-w-[140px] cursor-pointer rounded-3xl border-2 p-4 flex flex-col items-center gap-3
                transition-all duration-200 select-none
                ${isChecked
                  ? 'border-[#44B3E1] bg-sky-50 shadow-md shadow-[#44B3E1]/10'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={name} className="w-16 h-16 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm font-bold">{name[0]}</span>
                </div>
              )}

              {qrUrl ? (
                <img src={qrUrl} alt={`${name} QR`} className="w-24 h-24 object-contain rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-gray-50 border border-dashed border-gray-200" />
              )}

              <div className="flex items-center gap-2 mt-1">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0
                  ${isChecked ? 'bg-[#44B3E1] border-[#44B3E1]' : 'bg-white border-gray-300'}`}>
                  {isChecked && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1.5 4L4 6.5L9.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium transition-colors ${isChecked ? 'text-[#1C2D55]' : 'text-gray-400'}`}>
                  {followLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 justify-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${i < checkedCount ? 'bg-[#44B3E1]' : 'bg-gray-200'}`} />
        ))}
        <span className="text-xs text-gray-400 ms-1">{checkedCount}/3</span>
      </div>

      {showError && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-[#DB6519] text-sm font-medium text-center">
          {errorMsg}
        </motion.p>
      )}
    </div>
  );
}
