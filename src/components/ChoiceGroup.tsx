import type { QuestionOption, Lang } from '../types';

interface Props {
  label: string;
  options: QuestionOption[];
  value: string | string[];
  multi?: boolean;
  onChange: (v: string | string[]) => void;
  required?: boolean;
  hasError?: boolean;
  errorMsg: string;
  lang: Lang;
  labelSizePx?: number;
}

export function ChoiceGroup({ label, options, value, multi, onChange, required, hasError, errorMsg, lang, labelSizePx = 16 }: Props) {
  const isRtl = lang === 'he';

  const isSelected = (opt: string) => {
    if (multi) return Array.isArray(value) && value.includes(opt);
    return value === opt;
  };

  const handleClick = (opt: string) => {
    if (multi) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt];
      onChange(next);
    } else {
      onChange(value === opt ? '' : opt);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <span
        className={`text-[#17213A] font-medium leading-snug ${isRtl ? 'text-right' : 'text-left'}`}
        style={{ fontSize: `${labelSizePx}px` }}
      >
        {label}
        {required && <span className="text-[#DB6519] ms-1">*</span>}
      </span>
      <div className="flex flex-wrap gap-3 justify-center">
        {options.map((opt) => {
          const displayLabel = lang === 'he' ? opt.he : opt.en;
          const sel = isSelected(lang === 'he' ? opt.he : opt.en);
          return (
            <button
              key={opt.en}
              type="button"
              onClick={() => handleClick(lang === 'he' ? opt.he : opt.en)}
              className={`px-6 py-3.5 rounded-2xl text-base font-medium border transition-all duration-200 min-w-[90px] min-h-[52px]
                ${sel
                  ? 'bg-[#1C2D55] text-white border-[#1C2D55] shadow-md'
                  : 'bg-white text-[#17213A] border-gray-200 hover:border-[#44B3E1] hover:bg-sky-50'
                }
              `}
            >
              {displayLabel}
            </button>
          );
        })}
      </div>
      {hasError && (
        <span className="text-[#DB6519] text-sm font-medium text-center">{errorMsg}</span>
      )}
    </div>
  );
}
