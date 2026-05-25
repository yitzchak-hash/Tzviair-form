import { useApp } from '../context/AppContext';

export function LanguageToggle() {
  const { lang, setLang } = useApp();

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-full">
      <button
        onClick={() => setLang('he')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          lang === 'he'
            ? 'bg-white text-[#1C2D55] shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        עברית
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
          lang === 'en'
            ? 'bg-white text-[#1C2D55] shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        English
      </button>
    </div>
  );
}
