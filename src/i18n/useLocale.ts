import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Locale } from './config';
import { localisedPath, stripLocale } from './config';

/**
 * Hook that:
 *  1. Reads the current locale from the URL path (`/fi/...` → `fi`, else `en`)
 *  2. Keeps i18next in sync with the URL on every route change
 *  3. Updates `<html lang>` so browsers, search engines, and screen readers
 *     see the right language
 *  4. Returns helpers for building locale-aware paths
 */
export function useLocale() {
  const location = useLocation();
  const { i18n } = useTranslation();

  const seg = location.pathname.split('/').filter(Boolean)[0];
  const locale: Locale = seg === 'fi' ? 'fi' : 'en';

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
    }
  }, [locale, i18n]);

  return {
    locale,
    /** Path WITHOUT the locale prefix (e.g. `/fi/blog` → `/blog`). Useful for hreflang anchors. */
    pathWithoutLocale: stripLocale(location.pathname),
    /** Build a path with the given locale prefix. */
    to: (path: string, target: Locale = locale) => localisedPath(path, target),
  };
}
