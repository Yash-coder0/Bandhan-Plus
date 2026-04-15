// i18n setup for multilingual support (English, Hindi, Marathi)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../public/locales/en/translation.json';
import hiTranslation from '../public/locales/hi/translation.json';
import mrTranslation from '../public/locales/mr/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
    mr: { translation: mrTranslation }
  },
  lng: localStorage.getItem('bandhan_lang') || 'en', // Default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;