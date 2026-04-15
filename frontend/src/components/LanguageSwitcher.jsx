// Switch between English, Hindi, and Marathi
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हिं', full: 'Hindi' },
  { code: 'mr', label: 'मर', full: 'Marathi' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('bandhan_lang', code); // Remember choice
  };

  return (
    <div className="flex gap-1 border border-gray-200 rounded-lg overflow-hidden">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          title={lang.full}
          className={`px-2 py-1 text-xs font-medium transition-colors
            ${i18n.language === lang.code
              ? 'bg-rose-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;