import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import te from './locales/te.json';
import ml from './locales/ml.json';
import pa from './locales/pa.json';
import ta from './locales/ta.json';
import kn from './locales/kn.json';
import ur from './locales/ur.json';
import as from './locales/as.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  te: { translation: te },
  ml: { translation: ml },
  pa: { translation: pa },
  ta: { translation: ta },
  kn: { translation: kn },
  ur: { translation: ur },
  as: { translation: as },
  gu: { translation: gu },
  mr: { translation: mr },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

