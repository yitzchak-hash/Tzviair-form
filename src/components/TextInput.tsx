import type { Lang } from '../types';

interface Props {
  id: string;
  label: string;
  type?: string;
  inputMode?: 'text' | 'tel' | 'numeric' | 'decimal';
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hasError?: boolean;
  errorMsg: string;
  lang: Lang;
  labelSizePx?: number;
}

export function TextInput({ id, label, type = 'text', inputMode, value, onChange, required, hasError, errorMsg, lang, labelSizePx = 16 }: Props) {
  const isRtl = lang === 'he';
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={`text-[#17213A] font-medium leading-snug ${isRtl ? 'text-right' : 'text-left'}`}
        style={{ fontSize: `${labelSizePx}px` }}
      >
        {label}
        {required && <span className="text-[#DB6519] ms-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`w-full px-5 py-4 rounded-2xl border text-[#17213A] text-base bg-white transition-all duration-150
          placeholder:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-[#44B3E1] focus:border-transparent
          ${hasError ? 'border-[#DB6519] ring-1 ring-[#DB6519]' : 'border-gray-200 hover:border-gray-300'}
        `}
        style={{ fontSize: '16px' }}
      />
      {hasError && (
        <span className={`text-[#DB6519] text-sm font-medium ${isRtl ? 'text-right' : 'text-left'}`}>
          {errorMsg}
        </span>
      )}
    </div>
  );
}
