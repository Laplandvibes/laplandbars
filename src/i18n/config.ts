import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from '../locales/en/common.json';
import enNav from '../locales/en/nav.json';
import enPages from '../locales/en/pages.json';

import fiCommon from '../locales/fi/common.json';
import fiNav from '../locales/fi/nav.json';
import fiPages from '../locales/fi/pages.json';

export const SUPPORTED_LOCALES = ['en', 'fi'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const NS = ['common', 'nav', 'pages'] as const;

const resources = {
  en: { common: enCommon, nav: enNav, pages: enPages },
  fi: { common: fiCommon, nav: fiNav, pages: fiPages },
};

function detectFromPath(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const seg = window.location.pathname.split('/').filter(Boolean)[0];
  return seg === 'fi' ? 'fi' : 'en';
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectFromPath(),
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    ns: NS as unknown as string[],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: { order: ['path', 'navigator'], lookupFromPathIndex: 0 },
    react: { useSuspense: false },
  });

export function stripLocale(pathname: string): string {
  return pathname.replace(/^\/fi(?=\/|$)/, '') || '/';
}

export function localisedPath(pathname: string, locale: Locale): string {
  const base = stripLocale(pathname);
  if (locale === 'en') return base;
  return base === '/' ? '/fi' : `/fi${base}`;
}

export default i18n;
