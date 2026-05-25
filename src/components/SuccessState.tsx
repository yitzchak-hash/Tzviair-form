import { motion } from 'framer-motion';
import { t } from '../i18n';
import type { Lang } from '../types';

interface Props {
  onReset: () => void;
  lang: Lang;
}

export function SuccessState({ onReset, lang }: Props) {
  const tx = t[lang];
  const isRtl = lang === 'he';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="text-center flex flex-col items-center gap-6 py-8"
    >
      <div className="w-20 h-20 rounded-full bg-[#44B3E1]/10 flex items-center justify-center mb-2">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#44B3E1" fillOpacity="0.15" />
          <path d="M12 20.5L17.5 26L28 15" stroke="#44B3E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-[#1C2D55] text-2xl font-semibold leading-snug">
          {tx.successTitle}
        </h2>
        <p className="text-gray-500 text-base leading-relaxed max-w-sm mx-auto">
          {tx.successSubtitle}
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-4 px-8 py-4 rounded-2xl border border-gray-200 text-[#1C2D55] font-medium text-base
          hover:border-[#44B3E1] hover:bg-sky-50 transition-all duration-200"
      >
        {tx.fillAnother}
      </button>
    </motion.div>
  );
}
