import { useTranslation } from 'react-i18next';
import { useLocale } from '../i18n/useLocale';
import SharedNotFound from '../shared/NotFound';

// Thin wrapper around the shared LV-network 404 (see ../../../shared/NotFound.tsx
// for the design contract). Supplies this site's language, home path, and a
// handful of the site's own pillar pages so an unknown URL still routes the
// visitor back into #LaplandBars instead of a dead end.
export default function NotFound() {
  const { t } = useTranslation('nav');
  const { locale, to } = useLocale();
  // landmark={false} because this site's app layout already renders the
  // page's <main>. Without it the 404 route shipped two nested landmarks --
  // measured from the rendered DOM 2026-08-13, invisible to grep.
  return (
    <SharedNotFound
      landmark={false}
      lang={locale}
      siteName="LaplandBars"
      homeHref={to('/')}
      links={[
        { href: to('/bars'), label: t('links.bars') },
        { href: to('/ice-bars'), label: t('links.iceBars') },
        { href: to('/cocktails'), label: t('links.cocktails') },
      ]}
    />
  );
}
